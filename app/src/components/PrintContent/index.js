import React, { useRef, useState } from 'react'
import { getProjectArray } from '../../Store/slices/projects'
import { getTimecardArray } from '../../Store/slices/timecards'
import { connect } from 'react-redux';
import { getUsersArray } from '../../Store/slices/users'
import { Heading, Period, PeriodHeading, PrintContentContainer, TableRow, TableWrapper } from './PrintContentElements'
import { getMonthIndex } from '../../Store/slices/monthIndex';
import { getcurrentAddress } from '../../Store/slices/currentAddress';
import { getcurrentContractor } from '../../Store/slices/currentContractor';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import { PrintButton, TableCell, A4ratio } from './PrintContentElements';
import { useReactToPrint } from "react-to-print";
import ControlPanelSection from './../ControlPanelSection/index';
import { gettotalTime } from '../../Store/slices/totalTime';

const PrintContent = ({
	timeCards,
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
			if (arr.find(x => x[idType()] !== card[idType()])) arr.push(card);
		}

		const renderDataItems = timeCards
			.filter(card => card.jobDate.split('.')[1] - 1 === selectedMonth)
			.reduce((items, item) => items.find(x => x[idType()] === item[idType()]) ? [...items] : [...items, item], [])
			.map((card, index) => {
				rowCount = index + 1;
				const projectCardHours = [];
				const contractorCardHours = [];

				const projectCards = timeCards
					.filter(card => card.jobDate.split('.')[1] - 1 === selectedMonth)
					.filter(c => printAllChecked ? c : c.projectId === currentAddress.projectId)
					.filter((card, index) => {
						const cardIndexToRemove = card.projectId === itemId() ? index : null;
						return index === cardIndexToRemove
					})
					.map(card => {
						const contractorsName = users.find(user => user.id === card.userId).name;
						countHoursPerCard(card, projectCardHours);

						return (
							<TableRow key={contractorsName + '-' + card.id}>
								<TableCell >{contractorsName}</TableCell>
								<TableCell className='hourLen'>{card.hours}</TableCell>
							</TableRow>
						)
					});

				const contractorCards = timeCards
					.filter(card => {
						return card.jobDate.split('.')[1] - 1 === selectedMonth
					})
					.filter((card, index) => {
						const cardIndexToRemove = card.userId === itemId() ? index : null;
						return index === cardIndexToRemove
					})
					.filter(c => printAllChecked ? c : users.find(user => user.id === card.userId).name === currentContractor)
					.map(card => {
						const projectName = projects.find(project => project.id === card.projectId).address;
						countHoursPerCard(card, contractorCardHours);

						return (
							<TableRow key={projectName + '-' + card.projectId}>
								<TableCell>{projectName}</TableCell>
								<TableCell className='hourLen'>{card.hours}</TableCell>
							</TableRow>
						)
					})
					;

				function cardList() {
					if (firstMode) return projectCards;
					if (secondMode) return contractorCards;
				}
				function itemName() {
					let itemName = null;
					if (firstMode) itemName = projects.find(project => project.id === card.projectId).address;
					if (secondMode) itemName = users.find(user => user.id === card.userId).name;
					return itemName;
				}
				function itemId() {
					let itemId = null;
					if (firstMode) itemId = projects.find(project => project.id === card.projectId).id;
					if (secondMode) itemId = users.find(user => user.id === card.userId).id;
					return itemId;
				}
				const cardTimeSource = firstMode ? projectCardHours : contractorCardHours;
				const cardTimeCount = cardTimeSource.reduce((total, item) => (total + item.hours), 0)
				const noCardData = cardList().length === 0;
				totalCardHours = totalCardHours + cardTimeCount

				if (noCardData) return null;

				return (
					<TableRow key={card.id + '-' + itemId()} className='breakThis'>
						<TableCell className='verticalTop'>{itemName()}</TableCell>
						<TableCell>
							<TableWrapper className='printSize'>
								<tbody>
									{cardList()}
								</tbody>
							</TableWrapper>

						</TableCell>
						<TableCell className='alignCenter'>{cardTimeCount.toPrecision(3)}</TableCell>
					</TableRow>
				)
			}); // End of renderDataItems


		return (
			<TableWrapper className='printSize'>
				<tbody>
					<TableRow className='bold'>
						<TableCell className='thirty'>{`${modeItem}`}</TableCell>
						<TableCell>{`${reverseModeItem}s`} assigned / hours</TableCell>
						<TableCell className='ten'>Total Hours</TableCell>
					</TableRow>

					{renderDataItems}

					{printAllChecked &&
						<TableRow className='bold'>
							<TableCell className='verticalTop'>IN TOTAL:</TableCell>
							<TableCell>{`${rowCount} ${modeItem}s`}</TableCell>
							<TableCell className='alignCenter'>{totalCardHours.toPrecision(3)} hours</TableCell>
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
			<ControlPanelSection setprintAllChecked={setprintAllChecked} printAllChecked={printAllChecked} />
			<PrintContentContainer ref={printContentRef}>
				<A4ratio>
					<PeriodHeading>
						<Period className='printSize'>Period: {months[monthIndex]}</Period>
						<Period className='printSize'>Year: 2020</Period>{/*TODO make year dynamic */}
					</PeriodHeading>

					<Heading className='printSize'>Sidna Byg {dataModes[currentModeIndex]} Overview</Heading>

					{renderTable()}
				</A4ratio>
			</PrintContentContainer>
		</>
	)
}

const mapStateToProps = (state) =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timeCards: getTimecardArray(state),
	monthIndex: getMonthIndex(state),
	currentAddress: getcurrentAddress(state),
	currentContractor: getcurrentContractor(state),
	currentModeIndex: getcurrentModeIndex(state),
	totalTime: gettotalTime(state),
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(PrintContent);

