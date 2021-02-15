import React, { useEffect, useState } from 'react'
import { ContentListItem, ListEditIcon, ListDate, ListPersonName, ListTime } from './ContentElements';
import { connect } from 'react-redux';
import { getProjectArray } from '../../Store/slices/projects';
import { getUsersArray } from '../../Store/slices/users';
import { getTimecardArray } from '../../Store/slices/timecards';
import { getMonthIndex } from '../../Store/slices/monthIndex';
import { getcurrentAddress } from '../../Store/slices/currentAddress';
import { getcurrentContractor } from '../../Store/slices/currentContractor';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import { totalTimeChanged } from '../../Store/slices/totalTime';
import { cardCountChanged } from '../../Store/slices/cardCount';
import { getLoginData } from '../../Store/slices/login';

const ContentSection = (
	{
		currentModeIndex,
		dispatch,
		projects,
		timeCards,
		currentAddress,
		monthIndex,
		currentContractor,
		users,
		isAdmin,
		login
	}
) => {
	const [{ savedTime }, setSavedTime] = useState({ savedTime: 0 })

	const projectId = currentAddress.projectId;
	const loggedInUserId = login.userId;
	const selectedMonth = monthIndex;
	const selectedContractor = currentContractor;
	const firstMode = currentModeIndex === 0; // Project hours
	const secondMode = currentModeIndex === 1; // Contractor hours

	useEffect(() => {
		dispatch(totalTimeChanged(savedTime));
	}, [savedTime])

	useEffect(() => {
		setSavedTime({ savedTime: calcTime() });
		timeWorked();
	}, [projectId, currentModeIndex, selectedContractor, selectedMonth, timeCards])

	function timeWorked() {
		let totalTime = [0];
		let cardsCounted = 0;

		const projectTime = timeCards
			.filter(card => card.jobDate.split('-')[1] - 1 === selectedMonth)
			.filter(c => c.projectId === projectId)
			.filter(c => isAdmin ? c : c.userId === loggedInUserId)
			.map((card, index) => {

				const timeWorked = card.hours;

				if (firstMode) {
					cardsCounted = index + 1;
					totalTime.push(timeWorked);
				}
				return totalTime;
			})[0] || [0]

		const contractorTime = timeCards
			.filter(card => card.jobDate.split('-')[1] - 1 === selectedMonth)
			.filter(card => isAdmin ? users.find(user => user.userId === card.userId).name === selectedContractor.name : card)
			.map((card, index) => {
				const timeWorked = card.hours;
				if (secondMode) {
					cardsCounted = index + 1;
					totalTime.push(timeWorked);
				}
				return totalTime;
			})[0] || [0]

		if (secondMode) dispatch(cardCountChanged(totalTime.length - 1));
		if (firstMode) dispatch(cardCountChanged(cardsCounted));

		return totalTime;
	};

	function calcTime() { return timeWorked().reduce((acc, curr) => acc + curr) }



	function renderList() {
		const projectCards = timeCards
			.filter(card => card.jobDate.split('-')[1] - 1 === selectedMonth)
			.filter(c => c.projectId === projectId)
			.filter(c => isAdmin ? c : c.userId === loggedInUserId)
			.map((card, index) => {
				const projectName = projects.find(project => project.projectId === card.projectId).name;
				const calculatedTime = card.hours;
				const contractorsName = isAdmin ? users.find(user => user.userId === card.userId).name : projectName;

				return (
					<ContentListItem key={card.id} listColor={listColor(index)}>
						{isAdmin ? <ListEditIcon /> : null}
						<ListDate>{card.jobDate}</ListDate>
						<ListPersonName>{contractorsName}</ListPersonName>
						<ListTime>{timeFormat(calculatedTime)}</ListTime>
					</ContentListItem>
				)
			});

		const contractorCards = timeCards
			.filter(card => card.jobDate.split('-')[1] - 1 === selectedMonth)
			.filter(card => isAdmin ? users.find(user => user.userId === card.userId).name === selectedContractor.name : card)
			.map((card, index) => {
				const selectedProject = projects.find(project => project.projectId === card.projectId);
				const projectName = selectedProject ? selectedProject.address : "--project don't exist--";
				return (
					<ContentListItem key={`${card.projectId}-${card.id}`} listColor={listColor(index)}>
						{isAdmin ? <ListEditIcon /> : null}
						<ListDate>{card.jobDate}</ListDate>
						<ListPersonName>{projectName}</ListPersonName>
						<ListTime>{timeFormat(card.hours)}</ListTime>
					</ContentListItem>
				)
			});
		if (firstMode) return projectCards;
		if (secondMode) return contractorCards;
	}



	return (<>{renderList()}</>)
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
	login: getLoginData(state),
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(ContentSection);



function hours(time) { return Math.floor(time) };
function minutes(time) { return ((time - hours(time)) * 60).toPrecision(2) / 1 };
function colorAlternator(id) { return id % 2 == (0) ? '0.1' : '0.2' };
export function listColor(id) { return (`rgb(0 0 0 / ${colorAlternator(id)})`) };
export function timeFormat(time) { return (`${hours(time)}h ${minutes(time)}min`) };