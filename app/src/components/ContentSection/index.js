import React, { useEffect, useRef, useState } from 'react'
import { ContentListItem, ListEditIcon, ListDate, ListPersonName, ListTime, ItemDeleteIcon, DateInput, DateForm, DateButton, NotesIcon, NotesText, NotesContainer } from './ContentElements';
import { connect } from 'react-redux';
import { getProjectArray } from '../../Store/slices/projects';
import { getUsersArray } from '../../Store/slices/users';
import { getTimecardArray, timecardRemoved, timecardRenamed } from '../../Store/slices/timecards';
import { getMonthIndex } from '../../Store/slices/monthIndex';
import { currentAddressChanged, getcurrentAddress } from '../../Store/slices/currentAddress';
import { getcurrentContractor } from '../../Store/slices/currentContractor';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import { totalTimeChanged } from '../../Store/slices/totalTime';
import { cardCountChanged } from '../../Store/slices/cardCount';
import { getLoginData } from '../../Store/slices/login';
import * as actions from '../../Store/api';
import Modal from '../Modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../Styles/datePickerOverride.css"
import { ErrorMessage } from '../AddEntryForm/AddEntryFormElements';
import AddressPicker from './../AddressPicker/index';
import { getnotesArray } from '../../Store/slices/notes';

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
		login,
		notes
	}
) => {
	const [{ savedTime }, setSavedTime] = useState({ savedTime: 0 })

	const projectId = currentAddress.projectId;
	const loggedInUserId = login.userId;
	const selectedMonth = monthIndex;
	const selectedContractor = currentContractor;
	const firstMode = currentModeIndex === 0; // Project hours
	const secondMode = currentModeIndex === 1; // Contractor hours
	const [{ showModal }, setshowModal] = useState({ showModal: false });
	const [{ savedCardId }, setsavedCardId] = useState({ savedCardId: null });
	const [{ expandedNotesCards }, setexpandedNotesCards] = useState({ expandedNotesCards: [] });
	const [{ errors }, seterrors] = useState({ errors: {} });
	useEffect(() => {
		const findingError = timeCards.find(timecard => Object.keys(timecard).includes('error'));
		const hasError = findingError === undefined ? false : true;

		if (hasError) {
			const savedErrors = { ...errors };
			savedErrors['global'] = findingError.error;
			seterrors({ errors: savedErrors })
		}

	}, [timeCards])

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
			.filter(card => card.startTime.split("T")[0].split("-")[1] - 1 === selectedMonth)
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
			.filter(card => card.startTime.split("T")[0].split("-")[1] - 1 === selectedMonth)
			.filter(card => {
				const _selectedContractor = users.find(user => user.userId === card.userId);
				const contractorName = _selectedContractor ? _selectedContractor.name : "--contractor doesn't exist--";
				if (isAdmin)
					return contractorName === selectedContractor.name;
				else
					return card
			})
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


	const cancelModal = () => setshowModal({ showModal: false });

	function handleRemoveTimecard(cardId) {
		setsavedCardId({ savedCardId: cardId });

		function executeRemoveTimecard() {

			// delete timecard
			dispatch(actions.apiCallBegan({
				url: `/v1/timecard/${savedCardId}`,
				method: "DELETE",
				headers: {
					session: login.session
				}
			}));

			// remove timecard from Store
			dispatch(timecardRemoved({ cardId: savedCardId }))
		}; // end of executeRemoveTimecard

		setshowModal({ showModal: true });


		if (showModal) {
			setshowModal({ showModal: false });
			executeRemoveTimecard();
		}

	};

	function expandNotes(cardId) {
		setexpandedNotesCards(
			{
				expandedNotesCards: [...expandedNotesCards, cardId]
			}
		);
	}

	function dateFormat(date) {
		const timezoneCorrectedNow = new Date(date - date.getTimezoneOffset() * 60000)
		const formattedDate = timezoneCorrectedNow.toJSON().split("T")[0];
		return formattedDate;
	}

	function renderList() {
		const styles = {
			button: {
				cursor: 'pointer',
				borderRadius: '4px',
				fontFamily: 'Expletus Sans',
				fontSize: '18px',
				borderStyle: 'none',
				background: 'none',
				zIndex: 0,
				userSelect: 'none',
				webkitUserSelect: 'none', /* Safari */
				msUserSelect: 'none' /* IE 10 and IE 11 */
			}
		};
		const DateButton = ({ value, onClick }) => (
			<button style={styles.button} onClick={onClick}>
				{value}
			</button>
		);

		const renameCard = (renamedDate, cardId) => {

			// change date in database
			dispatch(actions.apiCallBegan({
				url: `/v1/timecard/${cardId}`,
				method: "PATCH",
				data: {
					"startTime": renamedDate
				},
				headers: {
					session: login.session
				},
				onError: 'timecards/error'
			}));

			// change card on Store
			dispatch(timecardRenamed({ cardId: cardId, startTime: renamedDate }));
		};

		const projectCards = timeCards //TODO should order cards by date
			.filter(card => card.startTime.split("T")[0].split("-")[1] - 1 === selectedMonth)
			.filter(c => c.projectId === projectId)
			.filter(c => isAdmin ? c : c.userId === loggedInUserId)
			.map((card, index) => {
				const _selectedProject = projects.find(project => project.projectId === card.projectId);
				const _selectedContractor = users.find(user => {
					return user.userId === card.userId
				});
				const projectName = _selectedProject ? _selectedProject.name : "--project doesn't exist--";
				const contractorName = _selectedContractor ? _selectedContractor.name : "--contractor doesn't exist--";
				const calculatedTime = card.hours;
				const contractorsName = isAdmin ? contractorName : projectName;
				const hasNotes = card.notes !== '' && typeof card.notes !== 'undefined';

				return (
					<ContentListItem key={card.id} listColor={listColor(index)}>
						{isAdmin ? <ItemDeleteIcon onClick={() => handleRemoveTimecard(card.cardId)} /> : null}
						{isAdmin ? <DatePicker
							selected={new Date(card.startTime)}
							onChange={date => renameCard(dateFormat(date), card.cardId)}
							customInput={<DateButton />}
							dateFormat="yyyy-MM-dd"
						/> : <ListDate>{card.startTime.split("T")[0]}</ListDate>}
						<ListPersonName>{contractorsName}</ListPersonName>
						{hasNotes ?
							<NotesIcon onClick={() => expandNotes(card.cardId)} /> : null}
						{hasNotes && expandedNotesCards.includes(card.cardId) ?
							<NotesContainer>
								<NotesText>
									{card.notes}
								</NotesText>
							</NotesContainer> : null}
						<ListTime>{timeFormat(calculatedTime)}</ListTime>
					</ContentListItem>
				)
			});

		const contractorCards = timeCards //TODO should order cards by date
			.filter(card => card.startTime.split("T")[0].split("-")[1] - 1 === selectedMonth)
			.filter(card => {
				const _selectedContractor = users.find(user => user.userId === card.userId);
				const contractorName = _selectedContractor ? _selectedContractor.name : "--contractor doesn't exist--";
				if (isAdmin)
					return contractorName === selectedContractor.name;
				else
					return card
			})
			.map((card, index) => {
				const selectedProject = projects.find(project => project.projectId === card.projectId);
				const projectName = selectedProject ? selectedProject.address : "--project doesn't exist--";
				const hasNotes = card.notes !== '' && typeof card.notes !== 'undefined';


				return (
					<ContentListItem key={`${card.projectId}-${card.id}`} listColor={listColor(index)}>
						{isAdmin ?
							<ItemDeleteIcon onClick={() => handleRemoveTimecard(card.cardId)} /> : null}
						{isAdmin ?
							<DatePicker
								selected={new Date(card.startTime)}
								onChange={date => renameCard(dateFormat(date), card.cardId)}
								customInput={<DateButton />}
								dateFormat="yyyy-MM-dd"
							/> : <ListDate>{card.startTime.split("T")[0]}</ListDate>}
						{isAdmin ?
							<AddressPicker
								cardId={card.cardId}
								projectName={projectName}
							/> : <ListPersonName>{projectName}</ListPersonName>}
						{hasNotes ?
							<NotesIcon onClick={() => expandNotes(card.cardId)} /> : null}
						{hasNotes && expandedNotesCards.includes(card.cardId) ?
							<NotesContainer>
								<NotesText>
									{card.notes}
								</NotesText>
							</NotesContainer> : null}
						<ListTime>{timeFormat(card.hours)}</ListTime>
					</ContentListItem>
				)
			});
		if (firstMode) return projectCards;
		if (secondMode) return contractorCards;
	}



	return (<>
		{errors['global'] && <ErrorMessage style={{ marginTop: 'unset' }}>{errors['global']}</ErrorMessage>}
		{renderList()}
		<Modal
			showModal={showModal}
			actionActivated={() => handleRemoveTimecard}
			highlightedText={'Remove'}
			modalText={'this timecard'}
			modalSubText={''}
			cancelModal={() => cancelModal()} />
	</>)
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
	notes: getnotesArray(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(ContentSection);



function hours(time) { return Math.floor(time) };
function minutes(time) { return Math.ceil(((time - hours(time)) * 60).toPrecision(2) / 1) };
function colorAlternator(id) { return id % 2 == (0) ? '0.1' : '0.2' };
export function listColor(id) { return (`rgb(0 0 0 / ${colorAlternator(id)})`) };
export function timeFormat(time) { return (`${hours(time)}h ${minutes(time)}min`) };