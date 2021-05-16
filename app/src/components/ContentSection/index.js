import React, { useEffect, useRef, useState } from 'react'
import { ContentListItem, ListDate, ListPersonName, ListTime, ItemDeleteIcon, NotesIcon, NotesText, NotesContainer, TimeEditContainer, PickerLabel, TimeInput } from './ContentElements';
import { connect } from 'react-redux';
import { getProjectArray } from '../../Store/slices/projects';
import { getUsersArray } from '../../Store/slices/users';
import { editTimecard, getTimecardArray, timecardRemoved, timecardRenamed, timecardWorkingTimeEdited } from '../../Store/slices/timecards';
import { getMonthIndex } from '../../Store/slices/monthIndex';
import { getcurrentAddress } from '../../Store/slices/currentAddress';
import { currentContractorChanged, getcurrentContractor } from '../../Store/slices/currentContractor';
import { getcurrentModeIndex, currentModeIndexChanged } from '../../Store/slices/currentModeIndex';
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
import MobileDatePicker from 'react-mobile-datepicker';
import { languageData } from './../../languages/language_variables';
import { getlanguage } from './../../Store/slices/language';
import { Notificator } from '../../pages/addRemove';
import { decimalToTime, totalTime } from './../services/helpfulFunctions';
import { deleteTimecard } from './../../Store/slices/timecards';
import { getSelectedYear, getYearNum } from './../../Store/slices/selectedYear';

const ContentSection = (
	{
		currentModeIndex,
		dispatch,
		projects,
		timecards,
		currentAddress,
		monthIndex,
		currentContractor,
		users,
		isAdmin,
		login,
		language,
		selectedYear
	}
) => {

	const {
		_CONTRACTORNOEXIST,
		_PROJECTNOEXIST,
		_HOUR,
		_MIN,
		_HOURS,
		_MINUTES,
		_REMOVE,
		_THISTIMECARD,
		_HOURSHORT,
		_CARDERASED
	} = languageData.COMPONENTS.ContentSection;

	const {
		_STARTTIME,
		_ENDTIME,
		_BREAKTIME
	} = languageData.COMPONENTS.AddEntryForm;

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
	const [{ expandedTimeChangeCards }, setexpandedTimeChangeCards] = useState({ expandedTimeChangeCards: [] });
	const [{ startTimeInput }, setstartTimeInput] = useState({ startTimeInput: new Date() });
	const [{ breakTimeInput }, setbreakTimeInput] = useState({ breakTimeInput: new Date('January 1, 2000') });
	const [{ endTimeInput }, setendTimeInput] = useState({ endTimeInput: new Date() });
	const [{ startTimePickerIsOpen }, setstartTimePickerIsOpen] = useState({ startTimePickerIsOpen: false });
	const [{ endTimePickerIsOpen }, setendTimePickerIsOpen] = useState({ endTimePickerIsOpen: false });
	const [{ breakTimePickerIsOpen }, setbreakTimePickerIsOpen] = useState({ breakTimePickerIsOpen: false });
	const [{ errors }, seterrors] = useState({ errors: {} });
	const [{ showNotificator }, setshowNotificator] = useState({ showNotificator: false });

	const inputRefStart = useRef(null);
	const inputRefEnd = useRef(null);
	const inputRefBreak = useRef(null);

	const breakDateChange = new Date(breakTimeInput).getDate();

	useEffect(() => {
		const findingError = timecards.find(timecard => Object.keys(timecard).includes('error'));
		const hasError = findingError === undefined ? false : true;

		if (hasError) {
			const savedErrors = { ...errors };
			savedErrors['global'] = findingError.error;
			seterrors({ errors: savedErrors })
		}

	}, [timecards])

	useEffect(() => {
		dispatch(totalTimeChanged(savedTime));
	}, [savedTime])


	useEffect(() => {
		setSavedTime({ savedTime: calcTime() });
		timeWorked();
	}, [projectId, currentModeIndex, selectedContractor, selectedMonth, timecards, selectedYear])

	// BreakTime input to not allow a date change as it's meant to change only hours and minutes
	useEffect(() => {
		if (breakTimeInput.getDate() !== startTimeInput.getDate()) {
			breakTimeInput.setDate(1)
			breakTimeInput.setMonth(0)
			breakTimeInput.setFullYear(2000)
			setbreakTimeInput({ breakTimeInput: new Date(breakTimeInput) })
		}
	}, [breakDateChange])

	// Updating input time values from DB for the specific card
	useEffect(() => {
		const expandedCardId = expandedTimeChangeCards[0];
		const expandedCardData = timecards.find(card => card.cardId === expandedCardId);
		const dataExists = typeof expandedCardData !== 'undefined' &&
			typeof expandedCardData.startTime !== 'undefined' &&
			typeof expandedCardData.endTime !== 'undefined' &&
			typeof expandedCardData.breakTime !== 'undefined'

		if (dataExists) {
			const localStartTime = expandedCardData.startTime.slice(-expandedCardData.startTime.length, -5);
			const localEndTime = expandedCardData.endTime.slice(-expandedCardData.endTime.length, -5);
			const startTimeDB = Date.parse(localStartTime);
			const endTimeDB = Date.parse(localEndTime);
			const breakTimeDB = expandedCardData.breakTime;
			const formattedBreakTimeDB = new Date(`January 1, 2000 ${decimalToTime(breakTimeDB)}`);

			setstartTimeInput({ startTimeInput: startTimeDB });
			setendTimeInput({ endTimeInput: endTimeDB });
			setbreakTimeInput({ breakTimeInput: formattedBreakTimeDB });
		}
	}, [expandedTimeChangeCards])


	// Submiting Editing Time
	useEffect(() => {
		const cardId = expandedTimeChangeCards[0];
		const expandedCardData = timecards.find(card => card.cardId === cardId);

		if (typeof expandedCardData !== 'undefined') {

			if (cardId) {

				submitEditedTime(
					startTimeInput,
					endTimeInput,
					breakTimeInput,
					cardId
				);
			}
		}
	}, [startTimeInput, endTimeInput, breakTimeInput, expandedTimeChangeCards])


	function submitEditedTime(startTimeInput, endTimeInput, breakTimeInput, cardId) {
		const timezoneCorrectedDate = date => new Date(date - new Date(date).getTimezoneOffset() * 60000);


		// Changed data
		const changedHours = totalTime(false, startTimeInput, endTimeInput);
		const changedStartTime = timezoneCorrectedDate(startTimeInput).toJSON();
		const changedEndTime = timezoneCorrectedDate(endTimeInput).toJSON();
		const changedBreakTime = new Date(breakTimeInput).toJSON();
		const totalBreakTime = totalTime(false, new Date('January 1, 2000'), changedBreakTime);
		const dataObj =
		{
			"hours": changedHours
		}

		if (startTimeInput) dataObj['startTime'] = changedStartTime;
		if (endTimeInput) dataObj['endTime'] = changedEndTime;
		if (breakTimeInput) dataObj['breakTime'] = totalBreakTime;

		// Dispatch the changed date to database
		dispatch(
			editTimecard(
				login.session,
				`${cardId}`,
				dataObj
			)
		)

		// change card in Store
		dispatch(timecardWorkingTimeEdited(
			{
				cardId: cardId,
				startTime: changedStartTime,
				endTime: changedEndTime,
				breakTime: totalBreakTime,
				hours: changedHours
			}
		));

		const oneEditPaneOnlyConditions = expandedTimeChangeCards.length > 1;
		const newExpandedCards = expandedTimeChangeCards.slice(1, 2);

		if (oneEditPaneOnlyConditions)
			// close the previous time editing pane if new is open
			setexpandedTimeChangeCards({ expandedTimeChangeCards: newExpandedCards });
	};


	function timeWorked() {
		let totalTime = [0];
		let cardsCounted = 0;

		const projectTime = timecards
			.filter(card => +card.startTime.split("T")[0].split("-")[0] === getYearNum(selectedYear))
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

		const contractorTime = timecards
			.filter(card => +card.startTime.split("T")[0].split("-")[0] === getYearNum(selectedYear))
			.filter(card => card.startTime.split("T")[0].split("-")[1] - 1 === selectedMonth)
			.filter(card => {
				const _selectedContractor = users.find(user => user.userId === card.userId);
				const contractorName = _selectedContractor ? _selectedContractor.name : _CONTRACTORNOEXIST[language];
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
			dispatch(
				deleteTimecard(
					login.session,
					savedCardId
				)
			)

			// remove timecard from Store
			dispatch(timecardRemoved({ cardId: savedCardId }))
		}; // end of executeRemoveTimecard

		setshowModal({ showModal: true });


		if (showModal) {
			setshowModal({ showModal: false });
			executeRemoveTimecard();
			setshowNotificator({ showNotificator: true });
		} else {
			setshowNotificator({ showNotificator: false });
		}

	};

	function expandNote(cardId) {
		const removedCard = expandedNotesCards.filter(card => card !== cardId);
		setexpandedNotesCards({
			expandedNotesCards: [...expandedNotesCards, cardId]
		});
		if (expandedNotesCards.includes(cardId))
			setexpandedNotesCards({
				expandedNotesCards: removedCard
			});
	}

	function expandTimeChange(cardId) {
		const removedCard = expandedTimeChangeCards.filter(card => card !== cardId);
		setexpandedTimeChangeCards({
			expandedTimeChangeCards: [...expandedTimeChangeCards, cardId]
		});

		if (expandedTimeChangeCards.includes(cardId))
			setexpandedTimeChangeCards({
				expandedTimeChangeCards: removedCard
			});
	}

	function dateFormat(date) {
		const timezoneCorrectedNow = new Date(date - date.getTimezoneOffset() * 60000)
		const formattedDate = timezoneCorrectedNow.toJSON().split("T")[0];
		return formattedDate;
	}

	function handleSelectContractor(contractor) {
		const selectedContractor = users.find(user => user.name === contractor);
		dispatch(currentModeIndexChanged(1));
		dispatch(currentContractorChanged(selectedContractor));
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
				color: 'rgb(31 90 152)',
				zIndex: 0,
				userSelect: 'none',
				WebkitUserSelect: 'none', /* Safari */
				msUserSelect: 'none' /* IE 10 and IE 11 */
			}
		};
		const DateButton = React.forwardRef((props, ref) => {
			const { value, onClick } = props;
			return (<button style={styles.button} onClick={onClick} ref={ref}>
				{value}
			</button>
			)
		});

		const renameDate = (renamedDate, cardId) => {
			const selectedCardData = timecards.find(card => card.cardId === cardId);
			const savedStartTimeData = selectedCardData.startTime.split('T')[1];
			const savedEndTimeData = selectedCardData.endTime.split('T')[1];
			const constructedStartTime = `${renamedDate}T${savedStartTimeData}`;
			const constructedEndTime = `${renamedDate}T${savedEndTimeData}`;

			// change date in database
			dispatch(
				editTimecard(
					login.session,
					`${cardId}`,
					{
						"startTime": constructedStartTime,
						"endTime": constructedEndTime
					}
				)
			)

			// change card on Store
			dispatch(timecardRenamed({ cardId: cardId, startTime: constructedStartTime, endTime: constructedEndTime }));
		};

		// function handleSelectStartTime(time) {
		// 	setstartTimeInput({ startTimeInput: time })
		// }
		// function handleSelectEndTime(time) {
		// 	setendTimeInput({ endTimeInput: time })
		// }

		const projectCards = timecards

			// view cards by selected year
			.filter(card => +card.startTime.split("T")[0].split("-")[0] === getYearNum(selectedYear))

			// view cards by selected month
			.filter(card => card.startTime.split("T")[0].split("-")[1] - 1 === selectedMonth)

			// view cards by selected project
			.filter(c => c.projectId === projectId)

			// view all cards only if logged in as admin
			.filter(c => isAdmin ? c : c.userId === loggedInUserId)

			// sort by date (descending)
			// .sort((a, b) => {
			// 	const entryDateA = a.startTime.split('T')[0].split('-')[2];
			// 	const entryDateB = b.startTime.split('T')[0].split('-')[2];
			// 	return entryDateB - entryDateA;
			// })

			// sort by id (descending)
			.sort((a, b) => {
				const A = a.id;
				const B = b.id;
				return B - A;
			})

			// card visuals
			.map((card, index) => {
				const _selectedProject = projects.find(project => project.projectId === card.projectId);
				const _selectedContractor = users.find(user => {
					return user.userId === card.userId
				});
				const projectName = _selectedProject ? _selectedProject.name : _PROJECTNOEXIST[language];
				const contractorName = _selectedContractor ? _selectedContractor.name : _CONTRACTORNOEXIST[language];
				const contractorsName = isAdmin ? contractorName : projectName;
				const hasNotes = card.notes !== '' && typeof card.notes !== 'undefined';
				const noteExpandTrigger = id => expandedNotesCards.includes(id);
				const timeChangeExpandTrigger = id => expandedTimeChangeCards.includes(id);

				return (
					<ContentListItem key={card.id} listColor={listColor(index)}>

						{isAdmin &&
							<ItemDeleteIcon onClick={() => handleRemoveTimecard(card.cardId)} />}

						{isAdmin ?
							<DatePicker
								selected={new Date(card.startTime)}
								onChange={date => renameDate(dateFormat(date), card.cardId)}
								customInput={<DateButton />}
								dateFormat="yyyy-MM-dd"
							/> : <ListDate>{card.startTime.split("T")[0]}</ListDate>}

						<ListPersonName
							onClick={() => handleSelectContractor(contractorsName)}
						>{contractorsName}</ListPersonName>

						{hasNotes &&
							<NotesIcon onClick={() => expandNote(card.cardId)} />}

						{hasNotes && noteExpandTrigger(card.cardId) &&
							<NotesContainer>
								<NotesText>
									{card.notes}
								</NotesText>
							</NotesContainer>}

						{isAdmin ?
							<ListTime
								onClick={() => expandTimeChange(card.cardId)}
								style={{ cursor: 'pointer' }}
							>{timeFormat(card.hours, _HOURSHORT[language])}</ListTime>
							: <ListTime>{timeFormat(card.hours, _HOURSHORT[language])}</ListTime>}

						{timeChangeExpandTrigger(card.cardId) && <TimeEditPane />}

					</ContentListItem>
				)
			});

		const contractorCards = timecards

			// view cards by selected year
			.filter(card => +card.startTime.split("T")[0].split("-")[0] === getYearNum(selectedYear))

			// view cards by selected month
			.filter(card => card.startTime.split("T")[0].split("-")[1] - 1 === selectedMonth)

			// view cards by selected contractor
			.filter(card => {
				const _selectedContractor = users.find(user => user.userId === card.userId);
				const contractorName = _selectedContractor ? _selectedContractor.name : _CONTRACTORNOEXIST[language];
				if (isAdmin)
					return contractorName === selectedContractor.name;
				else
					return card
			})

			// sort by date (descending)
			// .sort((a, b) => {
			// 	const entryDateA = a.startTime.split('T')[0].split('-')[2];
			// 	const entryDateB = b.startTime.split('T')[0].split('-')[2];
			// 	return entryDateB - entryDateA;
			// })

			// sort by id (descending)
			.sort((a, b) => {
				const A = a.id;
				const B = b.id;
				return B - A;
			})
			// card visuals
			.map((card, index) => {
				const selectedProject = projects.find(project => project.projectId === card.projectId);
				const projectName = selectedProject ? selectedProject.address : _PROJECTNOEXIST[language];
				const hasNotes = card.notes !== '' && typeof card.notes !== 'undefined';
				const noteExpandTrigger = id => expandedNotesCards.includes(id);
				const timeChangeExpandTrigger = id => expandedTimeChangeCards.includes(id);
				const localStartTime = card.startTime.slice(-card.startTime.length, -5);

				return (
					<ContentListItem key={`${card.projectId}-${card.id}`} listColor={listColor(index)}>

						{isAdmin &&
							<ItemDeleteIcon onClick={() => handleRemoveTimecard(card.cardId)} />}

						{isAdmin ?
							<DatePicker
								selected={new Date(localStartTime)}
								onChange={date => renameDate(dateFormat(date), card.cardId)}
								customInput={<DateButton />}
								dateFormat="yyyy-MM-dd"
							/> : <ListDate>{card.startTime.split("T")[0]}</ListDate>}

						{isAdmin ?
							<AddressPicker
								cardId={card.cardId}
								projectName={projectName}
							/> : <ListPersonName>{projectName}</ListPersonName>}

						{hasNotes &&
							<NotesIcon onClick={() => expandNote(card.cardId)} />}

						{hasNotes && noteExpandTrigger(card.cardId) && // TODO if bottom note is expanded it should be all visible
							<NotesContainer>
								<NotesText>
									{card.notes}
								</NotesText>
							</NotesContainer>}

						{isAdmin ?
							<ListTime
								onClick={() => expandTimeChange(card.cardId)}
								style={{ cursor: 'pointer' }}
							>{timeFormat(card.hours, _HOURSHORT[language])}</ListTime>
							: <ListTime>{timeFormat(card.hours, _HOURSHORT[language])}</ListTime>}

						{timeChangeExpandTrigger(card.cardId) && <TimeEditPane />}

					</ContentListItem>
				)
			});
		if (firstMode) return projectCards;
		if (secondMode) return contractorCards;
	}

	function TimeEditPane() {
		const CustomStartTimeInput = React.forwardRef((props, ref) => {
			const { value } = props;
			return (
				<TimeInput
					value={value}
					onClick={() => { handleClick('start'); }}
					ref={inputRefStart}
					readOnly
				/>)
		});
		const CustomEndTimeInput = React.forwardRef((props, ref) => {
			const { value } = props;
			return (
				<TimeInput
					value={value}
					onClick={() => { handleClick('end'); }}
					ref={inputRefEnd}
					readOnly
				/>)
		});
		const CustomBreakTimeInput = React.forwardRef((props, ref) => {
			const { value } = props;
			return (
				<TimeInput
					value={value}
					onClick={() => { handleClick('break'); }}
					ref={inputRefBreak}
					readOnly
				/>)
		});

		return (
			<TimeEditContainer>
				<PickerLabel>{_STARTTIME[language]}</PickerLabel>
				<DatePicker
					selected={startTimeInput}
					onChange={date => handleSelectStartTime(date)}
					dateFormat="HH:mm"
					customInput={<CustomStartTimeInput />}
				/>
				<PickerLabel>{_ENDTIME[language]}</PickerLabel>
				<DatePicker
					selected={endTimeInput}
					onChange={date => handleSelectEndTime(date)}
					dateFormat="HH:mm"
					customInput={<CustomEndTimeInput />}
				/>
				<PickerLabel>{_BREAKTIME[language]}</PickerLabel>
				<DatePicker
					selected={breakTimeInput}
					onChange={date => handleSelectBreakTime(date)}
					dateFormat="HH:mm"
					customInput={<CustomBreakTimeInput />}
				/>
			</TimeEditContainer>
		)
	}

	function handleSelectStartTime(time) {
		setstartTimePickerIsOpen({ startTimePickerIsOpen: false });
		setstartTimeInput({ startTimeInput: time })
	}
	function handleSelectEndTime(time) {
		setendTimePickerIsOpen({ endTimePickerIsOpen: false });
		setendTimeInput({ endTimeInput: time })
	}
	function handleEndTimeDatePicker(time) {
		setendTimeInput({ endTimeInput: time })
	}
	function handleStartTimeDatePicker(time) {
		setstartTimeInput({ startTimeInput: time })
	}
	function handleBreakTimeDatePicker(time) {
		setbreakTimeInput({ breakTimeInput: time })
	}
	function handleSelectBreakTime(time) {
		setbreakTimePickerIsOpen({ breakTimePickerIsOpen: false });
		setbreakTimeInput({ breakTimeInput: time })
	}


	function handleCancelTimePicker(timeType) {
		if (timeType === 'start') setstartTimePickerIsOpen({ startTimePickerIsOpen: false });
		if (timeType === 'end') setendTimePickerIsOpen({ endTimePickerIsOpen: false });
		if (timeType === 'break') setbreakTimePickerIsOpen({ breakTimePickerIsOpen: false });
	}
	function handleClick(timeType) {
		if (timeType === 'start') {
			inputRefStart.current.blur();
			setstartTimePickerIsOpen({ startTimePickerIsOpen: true })
		};
		if (timeType === 'end') {
			inputRefEnd.current.blur();
			setendTimePickerIsOpen({ endTimePickerIsOpen: true })
		};
		if (timeType === 'break') {
			inputRefBreak.current.blur();
			setbreakTimePickerIsOpen({ breakTimePickerIsOpen: true })
		};
	}


	function renderMobileDataPicker() {
		const datePickerSettings = {
			theme: 'ios',
			confirmText: '',
			cancelText: '',
			showCaption: true,
			headerFormat: 'YYYY-MM-DD',
			dateConfig: {
				'hour': {
					format: 'hh',
					caption: _HOUR[language],
					step: 1,
				},
				'minute': {
					format: 'mm',
					caption: _MIN[language],
					step: 5,
				}
			}
		};
		const datePickerSettingsBreak = {
			theme: 'ios',
			confirmText: '',
			cancelText: '',
			showCaption: true,
			headerFormat: '',
			dateConfig: {
				'hour': {
					format: 'hh',
					caption: _HOURS[language],
					step: 1,
				},
				'minute': {
					format: 'mm',
					caption: _MINUTES[language],
					step: 5,
				}
			}
		};
		return (
			<>
				<MobileDatePicker
					value={new Date(startTimeInput)}
					isOpen={startTimePickerIsOpen}
					onSelect={handleSelectStartTime}
					onChange={(e) => handleStartTimeDatePicker(e)}
					onCancel={() => handleCancelTimePicker('start')}
					{...datePickerSettings} />
				<MobileDatePicker
					value={new Date(endTimeInput)}
					isOpen={endTimePickerIsOpen}
					onSelect={handleSelectEndTime}
					onChange={(e) => handleEndTimeDatePicker(e)}
					onCancel={() => handleCancelTimePicker('end')}
					{...datePickerSettings} />
				<MobileDatePicker
					value={breakTimeInput}
					isOpen={breakTimePickerIsOpen}
					onSelect={handleSelectBreakTime}
					onCancel={() => handleCancelTimePicker('break')}
					onChange={(e) => handleBreakTimeDatePicker(e)}
					{...datePickerSettingsBreak} />
			</>
		)
	}

	return (
		<>
			{errors['global'] && <ErrorMessage style={{ marginTop: 'unset' }}>{errors['global']}</ErrorMessage>}
			{renderMobileDataPicker()}
			{renderList()}
			{showNotificator && <Notificator message={`${_CARDERASED[language]}`} />}
			<Modal
				showModal={showModal}
				actionActivated={() => handleRemoveTimecard}
				highlightedText={_REMOVE[language]}
				modalText={_THISTIMECARD[language]}
				modalSubText={''}
				cancelModal={() => cancelModal()} />
		</>
	)
}

const mapStateToProps = (state) =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timecards: getTimecardArray(state),
	monthIndex: getMonthIndex(state),
	currentAddress: getcurrentAddress(state),
	currentContractor: getcurrentContractor(state),
	currentModeIndex: getcurrentModeIndex(state),
	login: getLoginData(state),
	notes: getnotesArray(state),
	language: getlanguage(state),
	selectedYear: getSelectedYear(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(ContentSection);



function hours(time) { return Math.floor(time) };
function minutes(time) { return Math.ceil(((time - hours(time)) * 60).toPrecision(2) / 1) };
function colorAlternator(id) { return id % 2 == (0) ? '22%' : '52%' };
export function listColor(id) { return (`linear-gradient(to right, rgb(7 60 91 / ${colorAlternator(id)}), rgb(255 255 255 / 0%));`) };
export function timeFormat(time, hourLanguageUnit) { return (`${hours(time)}${hourLanguageUnit} ${minutes(time)}min`) };
export function timezoneCorrect(date) {
	const convert = new Date(date);
	const selectedTime = convert.getTime();
	const timezoneAdjustedTime = convert.getTimezoneOffset() * 60000;
	let formattedTime = new Date(selectedTime - timezoneAdjustedTime)/* .toUTCString() */;
	return formattedTime;
}