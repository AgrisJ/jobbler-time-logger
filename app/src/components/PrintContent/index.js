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
import { getlanguage } from './../../Store/slices/language';
import { languageData } from './../../languages/language_variables';
import { getSelectedYear, getYearNum } from './../../Store/slices/selectedYear';

const PrintContent = ({
	timecards,
	users,
	projects,
	monthIndex,
	currentModeIndex,
	currentAddress,
	currentContractor,
	language,
	selectedYear
}) => {
	const {
		_DATE,
		_NOTES,
		_WORKINTERVAL,
		_BREAKS,
		_TOTAL,
		_ASSIGNEDHOURS,
		_WITHNOTES,
		_TOTALHOURS,
		_INTOTAL,
		_HOURS,
		_PRINT,
		_PERIOD,
		_YEAR,
		_CONTRACTORNOTES,
		_OVERVIEW,
		_PROJECTHOURS,
		_CONTRACTORHOURS,
		_PROJECTS,
		_CONTRACTORS,
		_CONTRACT
	} = languageData.COMPONENTS.PrintContent;

	const {
		_JANUARY,
		_FEBRUARY,
		_MARCH,
		_APRIL,
		_MAY,
		_JUNE,
		_JULY,
		_AUGUST,
		_SEPTEMBER,
		_OCTOBER,
		_NOVEMBER,
		_DECEMBER
	} = languageData.COMPONENTS.ControlPanelSection;

	const selectedMonth = monthIndex;
	const firstMode = currentModeIndex === 0; // Project hours
	const secondMode = currentModeIndex === 1; // Contractor hours
	const months = [
		_JANUARY[language],
		_FEBRUARY[language],
		_MARCH[language],
		_APRIL[language],
		_MAY[language],
		_JUNE[language],
		_JULY[language],
		_AUGUST[language],
		_SEPTEMBER[language],
		_OCTOBER[language],
		_NOVEMBER[language],
		_DECEMBER[language]
	];
	const dataModes = [_PROJECTHOURS[language], _CONTRACTORHOURS[language]];
	const shortDataModes = [_PROJECTS[language], _CONTRACTORS[language]];
	const modeItem = shortDataModes[currentModeIndex];
	const reverseModeItem = shortDataModes[firstMode ? currentModeIndex + 1 : currentModeIndex - 1];
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
					const groupExists = entries.map(item => objKey(item)).includes(groupName);
					const lastIndexOfGroup = entries.map(item => objKey(item)).lastIndexOf(groupName);
					const foundGroup = entries[lastIndexOfGroup];
					const prevEntryUserId = entries[entries.length - 1] && entries[entries.length - 1].userId;
					const prevEntryProjectId = entries[entries.length - 1] && entries[entries.length - 1].projectId;
					const differentUser = prevEntryUserId ? prevEntryUserId !== userId : false;
					const differentProject = prevEntryProjectId ? prevEntryProjectId !== projectId : false;
					const entryContents = entry[groupName];

					let differentItem = null;
					if (firstMode) differentItem = differentProject;
					if (secondMode) differentItem = differentUser;

					if (groupExists && !differentItem)
						foundGroup[groupName].push(entryContents);
					else entries.push({ [groupName]: [entryContents], userId, projectId });


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
			.map((timeCard, index) => {
				rowCount = index + 1;
				const projectCardHours = [];
				const contractorCardHours = [];

				const projectCards = selection => timecards

					// view cards by selected year
					.filter(card => +card.startTime.split("T")[0].split("-")[0] === getYearNum(selectedYear))

					// show cards from selected month
					.filter(card => card.startTime.split('-')[1] - 1 === selectedMonth)

					// show only the particular project cards
					.filter((card, index) => {
						const cardIndexToRemove = card.projectId === itemId() ? index : null;
						return index === cardIndexToRemove
					})

					// show all projects
					.filter(c => printAllChecked ? c : c.projectId === currentAddress.projectId)

					// Show only selected cards (used by seperators)
					.filter(c => c.userId === selection.userId)

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

						countHoursPerCard(card, projectCardHours);

						return (
							<TableRow key={nanoid()}>
								<TableCell className={'dateColumn'} style={{ textAlign: 'start', border: 'unset' }}>{entryDate}</TableCell>
								<TableCell style={{ textAlign: 'end', border: 'unset' }}>{workInterval}</TableCell>
								<TableCell style={{ textAlign: 'end', color: '#c10a0a', border: 'unset' }}>{`-${isRounded(breakTime)}`}</TableCell>
								<TableCell style={{ textAlign: 'end', border: 'unset' }} className='hourLen'>{isRounded(card.hours)}</TableCell>
							</TableRow>
						)
					}); // end of projectCards


				const contractorCards = selection => timecards

					// view cards by selected year
					.filter(card => +card.startTime.split("T")[0].split("-")[0] === getYearNum(selectedYear))

					// show cards from selected month
					.filter(card => card.startTime.split('-')[1] - 1 === selectedMonth)

					// show only the particular user cards
					.filter((card, index) => {
						const cardIndexToRemove = card.userId === itemId() ? index : null;
						return index === cardIndexToRemove
					})

					// show all users
					.filter(c => printAllChecked ? c : users.find(user => user.userId === timeCard.userId).name === currentContractor.name)

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
					}); // end of contractorCards

				const ContractorEntryHeader = () => (
					<TableRow key={nanoid()}>
						<TableCell style={{ textAlign: 'start', border: 'unset', width: '30%' }}>{_DATE[language]}</TableCell>
						{notesModeOn &&
							<TableCell style={{ textAlign: 'start', border: 'unset' }}>{_NOTES[language]}</TableCell>}
						{!notesModeOn &&
							<><TableCell style={{ textAlign: 'end', border: 'unset' }}>{_WORKINTERVAL[language]}</TableCell>
								<TableCell style={{ textAlign: 'end', border: 'unset' }}>{_BREAKS[language]}</TableCell>
								<TableCell style={{ textAlign: 'end', border: 'unset' }}>{_TOTAL[language]}</TableCell></>}
					</TableRow>);

				function gatherPrintContent() {

					timecards
						// view cards by selected year
						.filter(card => +card.startTime.split("T")[0].split("-")[0] === getYearNum(selectedYear))

						// show cards from selected month
						.filter(card => card.startTime.split('-')[1] - 1 === selectedMonth)

						// show only particular user or project cards
						.filter((card, index) => {
							let cardIndexToRemove = '';
							if (firstMode) cardIndexToRemove = card.projectId === itemId() ? index : null;
							if (secondMode) cardIndexToRemove = card.userId === itemId() ? index : null;

							return index === cardIndexToRemove
						})

						// group cards by project or user name
						.reduce((cards, card) => {
							totalProjectHours.push(card);
							if (firstMode) return cards.find(x => x['userId'] === card['userId']) ? [...cards] : [...cards, card]
							if (secondMode) return cards.find(x => x['projectId'] === card['projectId']) ? [...cards] : [...cards, card]
						}, [])

						// prepare
						.forEach(card => {
							const userId = card.userId;
							const projectId = card.projectId;
							const projectName = projects.find(project => project.projectId === card.projectId).address;
							const contractorName = users.find(user => user.userId === card.userId).name;
							const pushCards = (source, name) => source(card).forEach(cardData => printPageSlicer.push({ [name]: cardData, userId, projectId }))

							if (firstMode) pushCards(projectCards, contractorName);
							if (secondMode) pushCards(contractorCards, projectName);
						});
				};

				// execute print data collecting
				gatherPrintContent();

				const PreparedForPrint = ({ linesPerPage, filterParam }) => {
					const sectionIdPerType = () => {
						let sectionId = '';
						if (firstMode) sectionId = projects.find(project => project.address === filterParam).projectId;
						if (secondMode) sectionId = users.find(user => user.name === filterParam).userId;
						return sectionId;
					}

					return pagesFactory(linesPerPage)

						// show only particular user or project cards
						.filter((card, index) => {
							let cardIndexToRemove = '';
							if (firstMode) cardIndexToRemove = sectionIdPerType() === card.projectId ? index : null;
							if (secondMode) cardIndexToRemove = sectionIdPerType() === card.userId ? index : null;

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
								<TableWrapper key={nanoid()} className='secondLevelTable breakThis'>
									<tbody>
										<TableRow>
											<TableCell style={{ fontWeight: 'bold' }}>{projectName}</TableCell>
											{!notesModeOn && <TableCell style={{ textAlign: 'end', fontWeight: 'bold' }}>{isRounded(timeSumPerProject)}</TableCell>}
										</TableRow>

										<TableRow>
											<TableCell colSpan="2">

												<TableWrapper style={{ border: 'unset' }} className='secondLevelTable'>
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
					// if (firstMode) return projectCards;
					if (firstMode) return <PreparedForPrint linesPerPage={27} filterParam={filterParam} />;
					if (secondMode) return <PreparedForPrint linesPerPage={27} filterParam={filterParam} />;
				}
				function itemName() {
					let itemName = null;
					if (firstMode) itemName = projects.find(project => project.projectId === timeCard.projectId).address;
					if (secondMode) itemName = users.find(user => user.userId === timeCard.userId).name;
					return itemName;
				}
				function itemId() {
					let itemId = null;
					if (firstMode) itemId = projects.find(project => project.projectId === timeCard.projectId).projectId;
					if (secondMode) itemId = users.find(user => user.userId === timeCard.userId).userId;

					return itemId;
				}
				const cardTimeSource = firstMode ? projectCardHours : contractorCardHours;
				const cardTimeCount = cardTimeSource.reduce((total, item) => (total + item.hours), 0)

				totalCardHours = totalCardHours + cardTimeCount

				function noCardData() {
					return cardTimeCount === 0;
				}

				const showContractors = item => users.find(user => user.userId === timeCard.userId)[item];

				if (noCardData()) return null;
				return (
					<TableRow key={nanoid()} className='breakThis'>
						<TableCell className='verticalTop profileData'>
							<p style={{ fontSize: '1.1em' }}>{itemName()}</p>
							{secondMode && <>
								<p>{showContractors('email')}</p>
								<p>{showContractors('telephone')}</p>
								<p>&nbsp;</p>
								<p>CPR Nr - {showContractors('cpr')}</p>
								<p>{_CONTRACT[language]} - {showContractors('contractNumber')}</p>
							</>}


						</TableCell>
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
						<TableCell>{`${reverseModeItem}`} {!notesModeOn ? _ASSIGNEDHOURS[language] : _WITHNOTES[language]}</TableCell>
						{!notesModeOn &&
							<TableCell className='ten'>{_TOTALHOURS[language]}</TableCell>}
					</TableRow>

					{renderDataItems}

					{printAllChecked &&
						<TableRow className='bold'>
							<TableCell className='verticalTop'>{_INTOTAL[language]}:</TableCell>
							<TableCell>{`${rowCount} ${modeItem}`}</TableCell>
							{!notesModeOn &&
								<TableCell className='alignCenter'>{isRounded(totalCardHours)} {_HOURS[language]}</TableCell>}
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
			<PrintButton onClick={handlePrint}>{_PRINT[language]}</PrintButton>
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
								<Period className='printSize'>{_PERIOD[language]}: {months[monthIndex]}</Period>
							</div>
							<div style={{ textAlign: 'right' }}>
								<PrintLogo src="/sidna_byg_logo.png" alt="logo" />
								<Period className='printSize'>{_YEAR[language]}: {selectedYear.getFullYear()}</Period>
							</div>
						</PeriodHeading>
					</Header>

					<FootHeadSeperator>
						<Heading className='printSize'>Sidna Byg {!notesModeOn ? dataModes[currentModeIndex] : _CONTRACTORNOTES[language]} {!notesModeOn && _OVERVIEW[language]}</Heading>
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



const mapStateToProps = state =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timecards: getTimecardArray(state),
	monthIndex: getMonthIndex(state),
	currentAddress: getcurrentAddress(state),
	currentContractor: getcurrentContractor(state),
	currentModeIndex: getcurrentModeIndex(state),
	totalTime: gettotalTime(state),
	language: getlanguage(state),
	selectedYear: getSelectedYear(state)
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
