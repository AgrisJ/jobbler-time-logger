import React, { useEffect, useState } from 'react'
import { projectsData } from '../ControlPanelSection';
// import { projectsData } from '../ControlPanelSection';
import { ContentListItem, ListEditIcon, ListDate, ListPersonName, ListTime } from './ContentElements';
import { connect } from 'react-redux';
import { getProjectArray, projectAdded } from '../../Store/slices/projects';
import { getUsersArray } from '../../Store/slices/users';
import { getTimecardArray } from '../../Store/slices/timecards';

const ContentSection = (
	{
		projectId,
		setTotalTime,
		setCardCount,
		selectedMonth,
		selectedContractor,
		currentModeIndex,
		dispatch,
		projects,
		timeCards,
		users
	}
) => {

	const [{ savedTime }, setSavedTime] = useState({ savedTime: 0 })
	// const [{ cardCount }, setCardCount] = useState({ cardCount: 0 })
	const firstMode = currentModeIndex === 0; // Project hours
	const secondMode = currentModeIndex === 1; // Contractor hours

	useEffect(() => {
		setTotalTime({ totalTime: savedTime })
	}, [savedTime, projectId, setTotalTime, selectedMonth, currentModeIndex, selectedContractor])

	useEffect(() => {
		setSavedTime({ savedTime: calcTime() });
		timeWorked();
	}, [projectId, currentModeIndex, selectedContractor, selectedMonth])


	const hours = time => Math.floor(time);
	const minutes = time => ((time - hours(time)) * 60).toPrecision(2) / 1;
	const colorAlternator = id => id % 2 === 0 ? '0.1' : '0.2';
	const listColor = id => (`rgb(0 0 0 / ${colorAlternator(id)})`);
	const timeFormat = time => (`${hours(time)}h ${minutes(time)}min`);

	function timeWorked() {
		let totalTime = [0];
		let cardsCounted = 0;

		const projectTime = timeCards
			.filter(card => card.jobDate.split('.')[1] - 1 === selectedMonth)
			.filter(c => c.projectId === projectId)
			.map((card, index) => {
				const timeWorked = card.hours;

				if (firstMode) {
					cardsCounted = index + 1;
					totalTime.push(timeWorked);
				}
				return totalTime;
			})[0] || [0]

		const contractorTime = timeCards
			.filter(card => card.jobDate.split('.')[1] - 1 === selectedMonth)
			.filter(card => users.find(user => user.id === card.userId).name === selectedContractor)
			.map((card, index) => {
				const timeWorked = card.hours;

				if (secondMode) {
					cardsCounted = index + 1;
					totalTime.push(timeWorked);
				}
				return totalTime;
			})[0] || [0]

		if (secondMode) setCardCount({ cardCount: totalTime.length - 1 });
		if (firstMode) setCardCount({ cardCount: cardsCounted });

		return totalTime;
	};

	function calcTime() { return timeWorked().reduce((acc, curr) => acc + curr) }



	function renderList() {
		const projectCards = timeCards
			.filter(card => card.jobDate.split('.')[1] - 1 === selectedMonth)
			.filter(c => c.projectId === projectId)
			.map((card, index) => {
				const calculatedTime = card.hours;
				const contractorsName = users.find(user => user.id === card.userId).name;

				return (
					<ContentListItem key={card.id} listColor={listColor(index)}>
						<ListEditIcon />
						<ListDate>{card.jobDate}</ListDate>
						<ListPersonName>{contractorsName}</ListPersonName>
						<ListTime>{timeFormat(calculatedTime)}</ListTime>
					</ContentListItem>
				)
			});

		const contractorCards = timeCards
			.filter(card => card.jobDate.split('.')[1] - 1 === selectedMonth)
			.filter(card => users.find(user => user.id === card.userId).name === selectedContractor)
			.map((card, index) => {
				const projectName = projects.find(project => project.id === card.projectId).address;
				return (
					<ContentListItem key={card.projectId} listColor={listColor(index)}>
						<ListEditIcon />
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
	timeCards: getTimecardArray(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(ContentSection);


// export const cardsData = [
// 	{
// 		id: 1,
// 		date: '22.09.2020',
// 		name: 'Egils Zariņš',
// 		workingData: [
// 			{
// 				projectId: 1,
// 				timeWorked: 14.5
// 			},
// 			{
// 				projectId: 2,
// 				timeWorked: 9.1
// 			},
// 			{
// 				projectId: 3,
// 				timeWorked: 2.3
// 			},
// 			{
// 				projectId: 4,
// 				timeWorked: 5
// 			}
// 		]
// 	},
// 	{
// 		id: 2,
// 		date: '25.12.2020',
// 		name: 'Dainis Vītols',
// 		workingData: [
// 			{
// 				projectId: 1,
// 				timeWorked: 14.8
// 			},
// 			{
// 				projectId: 2,
// 				timeWorked: 15.4
// 			}
// 		]
// 	},
// 	{
// 		id: 3,
// 		date: '30.09.2020',
// 		name: 'Jānis Paugurs',
// 		workingData: [
// 			{
// 				projectId: 6,
// 				timeWorked: 21.2
// 			},
// 			{
// 				projectId: 2,
// 				timeWorked: 11.4
// 			}
// 		]
// 	},
// 	{
// 		id: 4,
// 		date: '25.09.2020',
// 		name: 'Pēteris Siliņš',
// 		workingData: [
// 			{
// 				projectId: 7,
// 				timeWorked: 3.7
// 			},
// 			{
// 				projectId: 2,
// 				timeWorked: 17.8
// 			}
// 		]
// 	},
// 	{
// 		id: 5,
// 		date: '22.12.2020',
// 		name: 'Artūrs Laksts',
// 		workingData: [
// 			{
// 				projectId: 7,
// 				timeWorked: 24.1
// 			}
// 		]
// 	},
// 	{
// 		id: 6,
// 		date: '25.09.2020',
// 		name: 'Matīss Rītiņš',
// 		workingData: [
// 			{
// 				projectId: 4,
// 				timeWorked: 6.1
// 			},
// 			{
// 				projectId: 3,
// 				timeWorked: 9.3
// 			},
// 			{
// 				projectId: 8,
// 				timeWorked: 22.1
// 			}
// 		]
// 	},
// 	{
// 		id: 7,
// 		date: '25.09.2020',
// 		name: 'Kaspars Zuksis',
// 		workingData: [
// 			{
// 				projectId: 5,
// 				timeWorked: 14.8
// 			},
// 			{
// 				projectId: 2,
// 				timeWorked: 15.4
// 			}
// 		]
// 	},
// 	{
// 		id: 8,
// 		date: '30.09.2020',
// 		name: 'Raitis Zauss',
// 		workingData: [
// 			{
// 				projectId: 6,
// 				timeWorked: 21.2
// 			},
// 			{
// 				projectId: 2,
// 				timeWorked: 11.4
// 			}
// 		]
// 	},
// 	{
// 		id: 9,
// 		date: '25.12.2020',
// 		name: 'Edgars Koksis',
// 		workingData: [
// 			{
// 				projectId: 7,
// 				timeWorked: 3.7
// 			},
// 			{
// 				projectId: 2,
// 				timeWorked: 17.8
// 			}
// 		]
// 	},
// 	{
// 		id: 10,
// 		date: '22.09.2020',
// 		name: 'Kristaps Egle',
// 		workingData: [
// 			{
// 				projectId: 7,
// 				timeWorked: 24.1
// 			}
// 		]
// 	},
// 	{
// 		id: 11,
// 		date: '25.09.2020',
// 		name: 'Reinis Feinis',
// 		workingData: [
// 			{
// 				projectId: 4,
// 				timeWorked: 6.1
// 			},
// 			{
// 				projectId: 3,
// 				timeWorked: 9.3
// 			},
// 			{
// 				projectId: 8,
// 				timeWorked: 22.1
// 			}
// 		]
// 	}
// ];