import React, { useRef, useState } from 'react'
import { getProjectArray } from '../../Store/slices/projects'
import { getTimecardArray } from '../../Store/slices/timecards'
import { connect } from 'react-redux';
import { getUsersArray } from '../../Store/slices/users'
import { Heading, Period, PeriodHeading, PrintContentContainer, TableRow, TableWrapper, PrintLogo } from './PrintContentElements'
import { getMonthIndex } from '../../Store/slices/monthIndex';
import { getcurrentAddress } from '../../Store/slices/currentAddress';
import { getcurrentContractor } from '../../Store/slices/currentContractor';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import { PrintButton, TableCell, A4ratio, Header, Footer, FootHeight, HeadHeight } from './PrintContentElements';
import { useReactToPrint } from "react-to-print";
import ControlPanelSection from './../ControlPanelSection/index';
import { gettotalTime } from '../../Store/slices/totalTime';
import { isObject, isRounded } from '../services/helpfulFunctions'
import { nanoid } from 'nanoid'

const PrintContent = ({
	timecards,
	users,
	projects,
	monthIndex,
	currentModeIndex,
	currentAddress,
	currentContractor
}) => {

	const selectedMonth = monthIndex;
	const firstMode = currentModeIndex === 0; // Project hours
	const secondMode = currentModeIndex === 1; // Contractor hours
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const dataModes = ['Project Hours', 'Contractor Hours'];
	const modeItem = dataModes[currentModeIndex].split(' ')[0];
	const reverseModeItem = dataModes[firstMode ? currentModeIndex + 1 : currentModeIndex - 1].split(' ')[0];
	const [{ printAllChecked }, setprintAllChecked] = useState({ printAllChecked: false });
	const [{ notesModeOn }, setnotesModeOn] = useState({ notesModeOn: false });

	const totalProjectHours = [];
	const printPageSlicer = [];



	function pagesFactory(itemsPerPage = 22) {

		// producing pages based on itemsPerPage count
		let pageNr = 0;

		// 1.Gather all entries and divide them into pages
		const sliceEntries = printPageSlicer.reduce(
			(items, item, index) => {
				const pageLimitReached = (index + 1) % itemsPerPage === 0;
				const pageNotThere = typeof items[pageNr] === 'undefined';

				if (pageNotThere) items[pageNr] = [item];
				else
					items[pageNr] = [...items[pageNr], item];

				if (pageLimitReached) pageNr = pageNr + 1;

				return items
			}, []);

		// 2.Group all entries by project names (if many entries under one project it will be split into multiple pages 
		// therefore into multiple identical project names)
		const groupEntries = sliceEntries.map(page => {
			return page.reduce(
				(entries, entry) => {
					const objKey = obj => (isObject(obj) ? Object.keys(obj)[0] : null);
					const userId = entry.userId;
					const projectId = entry.projectId;
					const groupName = objKey(entry);
					const foundGroup = entries.find(item => objKey(item) === groupName);
					const entryContents = entry[groupName];

					if (foundGroup)
						foundGroup[groupName].push(entryContents);
					else entries.push({ [groupName]: [entryContents], userId, projectId })

					return entries;
				}, [])
		});

		return groupEntries.flat(1);
	};


	function renderTable() {
		let rowCount = 0;
		let totalCardHours = 0;

		function idType() {
			let idType = null;
			if (firstMode) idType = 'projectId';
			if (secondMode) idType = 'userId';
			return idType;
		}
		function countHoursPerCard(card, arr) {
			arr.push(card);
		}

		const renderDataItems = timecards
			.filter(card => card.startTime.split('-')[1] - 1 === selectedMonth)
			.reduce((items, item) => items.find(x => x[idType()] === item[idType()]) ? [...items] : [...items, item], [])
			.map((card, index) => {
				rowCount = index + 1;
				const projectCardHours = [];
				const contractorCardHours = [];
				const projectCards = timecards
					.filter(card => card.startTime.split('-')[1] - 1 === selectedMonth)

					// show only the particular project cards
					.filter((card, index) => {
						const cardIndexToRemove = card.projectId === itemId() ? index : null;
						return index === cardIndexToRemove
					})

					// show all projects
					.filter(c => printAllChecked ? c : c.projectId === currentAddress.projectId)

					// card visuals
					.map(card => {
						const contractorsName = users.find(user => user.userId === card.userId).name;
						countHoursPerCard(card, projectCardHours);

						return (
							<TableWrapper key={nanoid()} className='printSize printOuterTable'>
								<tbody>
									<TableRow>
										<TableCell>{contractorsName}</TableCell>
										<TableCell className='hourLen'>{isRounded(card.hours)}</TableCell>
									</TableRow>
								</tbody>
							</TableWrapper>
						)
					});

				const contractorCards = selection => timecards

					// show cards from selected month
					.filter(card => card.startTime.split('-')[1] - 1 === selectedMonth)

					// show only the particular user cards
					.filter((card, index) => {
						const cardIndexToRemove = card.userId === itemId() ? index : null;
						return index === cardIndexToRemove
					})

					// show all users
					.filter(c => printAllChecked ? c : users.find(user => user.userId === card.userId).name === currentContractor.name)

					// Show only selected cards (used by seperators)
					.filter(c => c.projectId === selection.projectId)

					// sort by date (descending)
					.sort((a, b) => {
						const entryDateA = a.startTime.split('T')[0].split('-')[2];
						const entryDateB = b.startTime.split('T')[0].split('-')[2];
						return entryDateB - entryDateA;
					})

					// card visuals
					.map(card => {
						const entryDate = card.startTime.split('T')[0];
						const timeStarted = card.startTime.split('T')[1].slice(0, 5);
						const timeEnded = card.endTime ? card.endTime.split('T')[1].slice(0, 5) : 'no entry';
						const workInterval = `${timeStarted} - ${timeEnded}`;
						const breakTime = card.breakTime;
						const notesContent = card.notes ? card.notes : '';

						countHoursPerCard(card, contractorCardHours);

						return (
							<TableRow key={nanoid()}>
								<TableCell className={'dateColumn'} style={{ textAlign: 'start', border: 'unset' }}>{entryDate}</TableCell>
								{notesModeOn &&

									<TableCell style={{ textAlign: 'start', border: 'unset' }}>{notesContent}</TableCell>}
								{!notesModeOn &&
									<><TableCell style={{ textAlign: 'end', border: 'unset' }}>{workInterval}</TableCell>
										<TableCell style={{ textAlign: 'end', color: '#c10a0a', border: 'unset' }}>{`-${isRounded(breakTime)}`}</TableCell>
										<TableCell style={{ textAlign: 'end', border: 'unset' }} className='hourLen'>{isRounded(card.hours)}</TableCell></>}
							</TableRow>
						)
					});

				const ContractorEntryHeader = () => (
					<TableRow key={nanoid()}>
						<TableCell style={{ textAlign: 'start', border: 'unset', width: '30%' }}>{'Date'}</TableCell>
						{notesModeOn &&
							<TableCell style={{ textAlign: 'start', border: 'unset' }}>{'Notes'}</TableCell>}
						{!notesModeOn &&
							<><TableCell style={{ textAlign: 'end', border: 'unset' }}>{'Work Interval'}</TableCell>
								<TableCell style={{ textAlign: 'end', border: 'unset' }}>{'Breaks'}</TableCell>
								<TableCell style={{ textAlign: 'end', border: 'unset' }}>{'Total'}</TableCell></>}
					</TableRow>);

				function gatherPrintContent() {
					timecards
						// show cards from selected month
						.filter(card => card.startTime.split('-')[1] - 1 === selectedMonth)

						// show only particular user cards
						.filter((card, index) => {
							const cardIndexToRemove = card.userId === itemId() ? index : null;
							return index === cardIndexToRemove
						})

						// group cards by project name
						.reduce((cards, card) => {
							totalProjectHours.push(card);
							return cards.find(x => x['projectId'] === card['projectId']) ? [...cards] : [...cards, card]
						}, [])

						// prepare
						.forEach(card => {
							const userId = card.userId;
							const projectId = card.projectId;
							const projectName = projects.find(project => project.projectId === card.projectId).address;

							// prepare data entries for slicing
							contractorCards(card).forEach(card => { printPageSlicer.push({ [projectName]: card, userId, projectId }) });
						});
				};

				// execute print data collecting
				gatherPrintContent();

				const PreparedForPrint = ({ linesPerPage, filterParam }) => {
					const sectionUserId = users.find(user => user.name === filterParam).userId;

					return pagesFactory(linesPerPage)

						// show only particular user cards
						.filter((card, index) => {
							const cardIndexToRemove = sectionUserId === card.userId ? index : null;
							return index === cardIndexToRemove
						})

						// card visuals
						.map(section => {
							const timeSumPerProject = totalProjectHours

								// show only particular project cards
								.filter(c => c.projectId === section.projectId)

								// show only particular user cards
								.filter((card, index) => {
									const cardIndexToRemove = card.userId === section.userId ? index : null;
									return index === cardIndexToRemove
								})

								// calculate total hours
								.reduce((total, item) => (total + item.hours), 0);

							const projectName = Object.keys(section)[0];
							const DataEntries = () => (section[projectName]);


							return (
								<TableWrapper key={nanoid()} className='printSize'>
									<tbody>

										<TableRow className={'breakThis'}>
											<TableCell style={{ fontWeight: 'bold' }}>{projectName}</TableCell>
											{!notesModeOn && <TableCell style={{ textAlign: 'end', fontWeight: 'bold' }}>{isRounded(timeSumPerProject)}</TableCell>}
										</TableRow>

										<TableRow>
											<TableCell colSpan="2">

												<TableWrapper style={{ border: 'unset' }} className='printSize'>
													<tbody>
														<ContractorEntryHeader />
														<DataEntries />
													</tbody>
												</TableWrapper>

											</TableCell>
										</TableRow>

									</tbody>
								</TableWrapper>
							)
						})
				};

				function cardList(filterParam) {
					if (firstMode) return projectCards;
					if (secondMode) return <PreparedForPrint linesPerPage={21} filterParam={filterParam} />;
				}
				function itemName() {
					let itemName = null;
					if (firstMode) itemName = projects.find(project => project.projectId === card.projectId).address;
					if (secondMode) itemName = users.find(user => user.userId === card.userId).name;
					return itemName;
				}
				function itemId() {
					let itemId = null;
					if (firstMode) itemId = projects.find(project => project.projectId === card.projectId).projectId;
					if (secondMode) itemId = users.find(user => user.userId === card.userId).userId;

					return itemId;
				}
				const cardTimeSource = firstMode ? projectCardHours : contractorCardHours;
				const cardTimeCount = cardTimeSource.reduce((total, item) => (total + item.hours), 0)

				totalCardHours = totalCardHours + cardTimeCount

				function noCardData() {
					if (firstMode) return cardList().length === 0;
					if (secondMode) return cardTimeCount === 0;
				}

				if (noCardData()) return null;
				return (
					<TableRow key={nanoid()} className='breakThis'>
						<TableCell className='verticalTop'>{itemName()}</TableCell>
						<TableCell>

							{cardList(itemName())}

						</TableCell>
						{!notesModeOn &&
							<TableCell className='alignCenter'>{isRounded(cardTimeCount)}</TableCell>}
					</TableRow>
				)
			}); // End of renderDataItems


		return (
			<TableWrapper className='printSize container' style={{ width: notesModeOn ? '80vw' : '100%' }}>
				<tbody>
					<TableRow className='bold'>
						<TableCell className='thirty'>{`${modeItem}:`}</TableCell>
						<TableCell>{`${reverseModeItem}s`} {!notesModeOn ? 'assigned / hours' : 'with notes'}</TableCell>
						{!notesModeOn &&
							<TableCell className='ten'>Total Hours</TableCell>}
					</TableRow>

					{renderDataItems}

					{printAllChecked &&
						<TableRow className='bold'>
							<TableCell className='verticalTop'>IN TOTAL:</TableCell>
							<TableCell>{`${rowCount} ${modeItem}s`}</TableCell>
							{!notesModeOn &&
								<TableCell className='alignCenter'>{isRounded(totalCardHours)} hours</TableCell>}
						</TableRow>}
				</tbody>
			</TableWrapper>
		);


	}; // End of renderTable


	const printContentRef = useRef();
	const handlePrint = useReactToPrint({
		content: () => printContentRef.current
	});

	return (
		<>
			<PrintButton onClick={handlePrint}>Print</PrintButton>
			<ControlPanelSection
				setprintAllChecked={setprintAllChecked}
				printAllChecked={printAllChecked}
				setnotesModeOn={setnotesModeOn}
				notesModeOn={notesModeOn}
			/>
			<PrintContentContainer ref={printContentRef}>
				<A4ratio>

					<Header>
						<PeriodHeading>
							<div style={{ display: 'flex', alignItems: 'flex-end' }}>
								<Period className='printSize'>Period: {months[monthIndex]}</Period>
							</div>
							<div style={{ textAlign: 'right' }}>
								<PrintLogo src="/sidnaByg_logo.png" alt="logo" />
								<Period className='printSize'>Year: 2021</Period>{/*TODO make year dynamic */}
							</div>
						</PeriodHeading>
					</Header>

					<FootHeadSeperator>
						<Heading className='printSize'>Sidna Byg {!notesModeOn ? dataModes[currentModeIndex] : 'Contractor Notes'} {!notesModeOn && 'Overview'}</Heading>
						{renderTable()}
					</FootHeadSeperator>

					<Footer>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<Period className='printSize'>Industrivej 27, 4652 Hårlev, Denmark</Period>
							<Period className='printSize'>CVR-Nr.: 40447571</Period>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<Period className='printSize'>info@sidnabyg.dk</Period>
							<Period className='printSize'>Tlf.: +45 71335109</Period>
						</div>
					</Footer>
				</A4ratio>
			</PrintContentContainer>
		</>
	)
};



const mapStateToProps = (state) =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timecards: getTimecardArray(state),
	monthIndex: getMonthIndex(state),
	currentAddress: getcurrentAddress(state),
	currentContractor: getcurrentContractor(state),
	currentModeIndex: getcurrentModeIndex(state),
	totalTime: gettotalTime(state),
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(PrintContent);







const FootHeadSeperator = ({ children }) => {

	return (
		<table >

			<thead>
				<tr>
					<td>
						<HeadHeight>&nbsp;</HeadHeight>
					</td>
				</tr>
			</thead>

			<tbody>
				<tr>
					<td>

						<div>
							{children}
						</div>

					</td>
				</tr>
			</tbody>

			<tfoot>
				<tr>
					<td>
						<FootHeight>&nbsp;</FootHeight>
					</td>
				</tr>
			</tfoot>

		</table>
	)
};
