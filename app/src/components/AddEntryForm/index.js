import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import Joi from 'joi-browser';
import { FormInput, FormWrapper, FormButton, FormContent, Form, FormH1, FormLabel, ScrollAnchor, ErrorMessage, TotalHoursDisplay, DisplayLabel, FormTextArea } from './AddEntryFormElements';
import * as actions from '../../Store/api';
import { getLoginData } from '../../Store/slices/login';
import { errorMessagePerType, scrollDownTo } from '../AddDataForm';
import { getcurrentAddress } from '../../Store/slices/currentAddress';
import { getTimecardArray, timecardAdded } from '../../Store/slices/timecards';
import { useHistory } from 'react-router-dom';
import MobileDatePicker from 'react-mobile-datepicker';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../Styles/datePickerOverride.css"
import { getcurrentContractor } from '../../Store/slices/currentContractor';
import { noteAdded, getnotesArray } from '../../Store/slices/notes';


const AddDataForm = ({ login, currentAddress, timecards, dispatch, isAdmin, currentContractor, notes }) => {
	let history = useHistory();
	const dateNow = new Date();
	dateNow.setMinutes(0)
	const dateNowZeroMins = dateNow;

	const [{ isLoading }, setisLoading] = useState({ isLoading: true });
	const [{ isNoteInAction }, setisNoteInAction] = useState({ isNoteInAction: false });
	const [{ startTimeInput }, setstartTimeInput] = useState({ startTimeInput: dateNowZeroMins });
	const [{ endTimeInput }, setendTimeInput] = useState({ endTimeInput: dateNowZeroMins });
	const [{ breakTimeInput }, setbreakTimeInput] = useState({ breakTimeInput: new Date('January 1, 2000') });
	const [{ noteInput }, setnoteInput] = useState({ noteInput: '' });
	const [{ errors }, seterrors] = useState({ errors: {} });
	const [{ hideForms }, sethideForms] = useState({ hideForms: true });
	const [{ startTimePickerIsOpen }, setstartTimePickerIsOpen] = useState({ startTimePickerIsOpen: false });
	const [{ endTimePickerIsOpen }, setendTimePickerIsOpen] = useState({ endTimePickerIsOpen: false });
	const [{ breakTimePickerIsOpen }, setbreakTimePickerIsOpen] = useState({ breakTimePickerIsOpen: false });

	useEffect(() => {
		if (currentAddress.projectId !== null)
			!currentAddress.loading && setisLoading({ isLoading: false });
	}, [currentAddress])

	// const dateChange = startTimeInput.getDate();
	const monthChange = startTimeInput.getMonth();
	const yearChange = startTimeInput.getFullYear();
	const breakDateChange = breakTimeInput.getDate();

	// EndTime input sets the same date as StartTime input
	// useEffect(() => { 
	// 	if (endTimeInput.getDate() < startTimeInput.getDate())
	// 		setendTimeInput({ endTimeInput: new Date(endTimeInput.setDate(dateChange)) })
	// }, [dateChange])

	useEffect(() => {
		if (endTimeInput.getFullYear() !== startTimeInput.getFullYear())
			setendTimeInput({ endTimeInput: new Date(endTimeInput.setFullYear(yearChange)) })
	}, [yearChange])

	useEffect(() => {
		if (endTimeInput.getMonth() !== startTimeInput.getMonth())
			setendTimeInput({ endTimeInput: new Date(endTimeInput.setMonth(monthChange)) })
	}, [monthChange])

	//BreakTime input to not allow a date change as it's meant to change only hours and minutes
	useEffect(() => {
		if (breakTimeInput.getDate() !== startTimeInput.getDate()) {
			breakTimeInput.setDate(1)
			breakTimeInput.setMonth(0)
			breakTimeInput.setFullYear(2000)
			setbreakTimeInput({ breakTimeInput: new Date(breakTimeInput) })
		}
	}, [breakDateChange])

	useEffect(() => { !isLoading && sethideForms({ hideForms: false }); }, [currentAddress, isLoading])
	useEffect(() => { currentAddress && localStorage.setItem('currentAddress', JSON.stringify(currentAddress)) }, [currentAddress]);
	useEffect(() => {
		const findingError = timecards.find(timecard => Object.keys(timecard).includes('error'));
		const hasError = findingError === undefined ? false : true;

		if (!isLoading && !hasError) history.push("/");

		if (hasError) {
			const savedErrors = { ...errors };
			savedErrors['startTimeInput'] = findingError.error;
			savedErrors['endTimeInput'] = findingError.error;
			seterrors({ errors: savedErrors })
		}

	}, [timecards])

	function handleStartTimeChange(e) {
		setstartTimeInput({ startTimeInput: e.target.value })
	}
	function handleEndTimeChange(e) {
		setendTimeInput({ endTimeInput: e.target.value })
	}
	function handleBreakTimeChange(e) {
		setbreakTimeInput({ breakTimeInput: e.target.value })
	}
	function handleNoteChange(e) {
		setnoteInput({ noteInput: e.target.value })
	}
	function handleSelectStartTime(time) {
		setstartTimePickerIsOpen({ startTimePickerIsOpen: false });
		setstartTimeInput({ startTimeInput: time })
	}
	function handleSelectEndTime(time) {
		setendTimePickerIsOpen({ endTimePickerIsOpen: false });
		setendTimeInput({ endTimeInput: time })
	}
	function handleSelectBreakTime(time) {
		setbreakTimePickerIsOpen({ breakTimePickerIsOpen: false });
		setbreakTimeInput({ breakTimeInput: time })
	}
	function handleStartTimeDatePicker(time) {
		setstartTimeInput({ startTimeInput: time })
	}
	function handleEndTimeDatePicker(time) {
		setendTimeInput({ endTimeInput: time })
	}
	function handleBreakTimeDatePicker(time) {
		setbreakTimeInput({ breakTimeInput: time })
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
		if (timeType === 'note') {
			setisNoteInAction({ isNoteInAction: true });
		};
	}
	function handleCancelTimePicker(timeType) {
		if (timeType === 'start') setstartTimePickerIsOpen({ startTimePickerIsOpen: false });
		if (timeType === 'end') setendTimePickerIsOpen({ endTimePickerIsOpen: false });
		if (timeType === 'break') setbreakTimePickerIsOpen({ breakTimePickerIsOpen: false });
	}
	// function dateToday() {
	// 	const now = new Date();
	// 	const timezoneCorrectedNow = new Date(now - now.getTimezoneOffset() * 60000)
	// 	const formattedDate = timezoneCorrectedNow.toJSON().split("T")[0];
	// 	return formattedDate;
	// }




	function doSubmit() {
		const hasInputValue = startTimeInput !== endTimeInput;
		const adminEnding = isAdmin ? '/' + currentContractor.userId : '';
		const totalBreakTime = totalTime(false, new Date('January 1, 2000'), breakTimeInput);

		const changedStartTime = new Date(startTimeInput).toJSON();
		const changedEndTime = new Date(endTimeInput).toJSON();

		if (hasInputValue) {
			dispatch(actions.apiCallBegan({// TODO ...and here - dispatch(PostUserTimecards());

				url: `/v1/timecard${adminEnding}`,
				method: "post",
				data: {
					userId: isAdmin ? currentContractor.userId : login.userId,
					projectId: currentAddress.projectId,
					startTime: changedStartTime,
					endTime: changedEndTime,
					breakTime: totalBreakTime,
					hours: totalTime(false, startTimeInput, endTimeInput),
					notes: noteInput
				},
				headers: {
					session: login.session
				},
				onError: "timecards/error",
				onSuccess: "timecards/timecardsReceived"
			}));

			dispatch(actions.apiCallBegan({ // TODO ...and here - dispatch(loadUserTimecards());
				url: "/v1/user/hours",
				headers: {
					session: login.session
				},
				onSuccess: "timecards/timecardsReceived"
			}));
			isAdmin ? history.push("/") : history.push("/recordoverview");
		};

	};

	const schema = {
		startTimeInput: Joi.date().iso().required().error(err => {

			return { message: errorMessagePerType(err[0], 'Start Time') }
		}),
		endTimeInput: Joi.date().iso().required().error(err => {
			return { message: errorMessagePerType(err[0], 'End Time') }
		})
	}

	function validate() {
		const options = { abortEarly: false };
		const fields = {
			...{ startTimeInput },
			...{ endTimeInput } //TODO validate notes input too
		};

		const { error } = Joi.validate(fields, schema, options);
		if (!error) return null;

		const errors = {};

		for (let item of error.details)
			errors[item.path[0]] = item.message;
		return errors;
	}

	function handleSubmit(e) {
		e.preventDefault() // stops default reloading behaviour

		const allErrors = validate();
		seterrors({ errors: allErrors || {} });
		if (allErrors) return;

		doSubmit();
	}

	function hide() {
		return { display: 'none' }
	}


	const datePickerSettings = {
		theme: 'ios',
		confirmText: '',
		cancelText: '',
		showCaption: true,
		headerFormat: 'YYYY-MM-DD',
		dateConfig: {
			'hour': {
				format: 'hh',
				caption: 'Hour',
				step: 1,
			},
			'minute': {
				format: 'mm',
				caption: 'Min',
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
				caption: 'Hours',
				step: 1,
			},
			'minute': {
				format: 'mm',
				caption: 'Minutes',
				step: 5,
			}
		}
	};

	const customHeaderDatePicker = target => {
		const styles = {
			button: {
				cursor: 'pointer',
				borderRadius: '4px',
				fontFamily: 'Expletus Sans',
				fontSize: '18px',
				borderStyle: 'none',
				background: 'none',
				zIndex: 3,
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

		if (target === 'start')
			return {
				customHeader:
					<DatePicker
						selected={startTimeInput}
						onChange={date => handleStartTimeDatePicker(date)}
						customInput={<DateButton />}
						dateFormat="yyyy-MM-dd"
					/>
			};
		if (target === 'end')
			return {
				customHeader:
					<DatePicker
						selected={endTimeInput}
						onChange={date => handleEndTimeDatePicker(date)}
						customInput={<DateButton />}
						dateFormat="yyyy-MM-dd"
					/>
			};
	}


	const inputRefStart = useRef(null);
	const inputRefEnd = useRef(null);
	const inputRefBreak = useRef(null);
	const inputRefNote = useRef(null);

	function keepStartDate(date) {
		const now = Date.now();
		const inputDateChangedFromToday = new Date(now).getDate() !== new Date(date).getDate();
		const savedDate = startTimeInput.getDate();
		const savedMonth = startTimeInput.getMonth();
		const savedYear = startTimeInput.getFullYear();

		if (!inputDateChangedFromToday) {
			date = new Date(date.setDate(savedDate));
			date = new Date(date.setMonth(savedMonth));
			date = new Date(date.setFullYear(savedYear));
		}

		return date;
	}

	function renderMobileDataPicker() {
		return (
			<>
				<MobileDatePicker
					value={startTimeInput}
					isOpen={startTimePickerIsOpen}
					onSelect={handleSelectStartTime}
					onCancel={() => handleCancelTimePicker('start')}
					onChange={(e) => handleStartTimeDatePicker(keepStartDate(e))}
					{...{ ...datePickerSettings, ...customHeaderDatePicker('start') }} />
				<MobileDatePicker
					value={endTimeInput}
					isOpen={endTimePickerIsOpen}
					onSelect={handleSelectEndTime}
					onCancel={() => handleCancelTimePicker('end')}
					onChange={(e) => handleEndTimeDatePicker(/* keepStartDate( */e/* ) */)}
					{...{ ...datePickerSettings, ...customHeaderDatePicker('end') }} />
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
			{renderMobileDataPicker()}
			<FormWrapper>
				<FormContent style={hideForms ? hide() : null}>
					<Form onSubmit={handleSubmit}>
						<>
							<FormLabel htmlFor='for'>Start Time</FormLabel>
							<FormInput
								onClick={() => { scrollDownTo(".scrollHere"); handleClick('start'); }}
								onChange={handleStartTimeChange}
								value={getTimeFormat(startTimeInput)}
								type='text'
								hasErrors={errors['startTimeInput']}
								ref={inputRefStart}
								required />
							{errors['startTimeInput'] && <ErrorMessage>{errors['startTimeInput']}</ErrorMessage>}
						</>
						<>
							<FormLabel htmlFor='for'>End Time</FormLabel>
							<FormInput
								onClick={() => { handleClick('end'); }}
								onChange={handleEndTimeChange}
								value={getTimeFormat(endTimeInput)}
								type='text'
								ref={inputRefEnd}
								hasErrors={errors['endTimeInput']}
								required />
							{errors['endTimeInput'] && <ErrorMessage>{errors['endTimeInput']}</ErrorMessage>}
						</>
						<>
							<FormLabel htmlFor='for'>Break Time</FormLabel>
							<FormInput
								onClick={() => { handleClick('break'); }}
								onChange={handleBreakTimeChange}
								value={getTimeFormat(breakTimeInput)}
								type='text'
								ref={inputRefBreak}
								hasErrors={errors['breakTimeInput']}
								required />
							{errors['breakTimeInput'] && <ErrorMessage>{errors['breakTimeInput']}</ErrorMessage>}
						</>
						<DisplayLabel>Total</DisplayLabel>
						<TotalHoursDisplay>
							{totalTime(true, startTimeInput, endTimeInput)}
						</TotalHoursDisplay>
						<>
							<FormLabel htmlFor='for'>Note</FormLabel> {/*TODO add a character counter */}
							<FormTextArea
								onClick={() => { handleClick('note'); }}
								onChange={handleNoteChange}
								value={noteInput}
								ref={inputRefNote}
								hasErrors={errors['noteInput']}
								maxLength="500"
								isNoteInAction={isNoteInAction}
								rows={isNoteInAction ? '5' : '1'}
							/>
							{errors['noteInput'] && <ErrorMessage>{errors['noteInput']}</ErrorMessage>}
						</>
						<FormButton>DONE</FormButton>
					</Form>
				</FormContent>
			</FormWrapper>
			<ScrollAnchor className={'scrollHere'} />
		</>
	)
}

const mapStateToProps = (state) =>
({
	login: getLoginData(state),
	currentAddress: getcurrentAddress(state),
	timecards: getTimecardArray(state),
	currentContractor: getcurrentContractor(state),
	notes: getnotesArray(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AddDataForm);

export function getTimeFormat(current_datetime) {
	const minutes = (current_datetime.getMinutes() < 10 ? '0' : '') + current_datetime.getMinutes();
	const hours = (current_datetime.getHours() < 10 ? '0' : '') + current_datetime.getHours();
	return hours + ":" + minutes;
}

export function totalHours(startTime, endTime) {
	let msHour = 60 * 60 * 1000,
		msDay = 60 * 60 * 24 * 1000;
	const start = new Date(startTime);
	const end = new Date(endTime);
	const hours = Math.floor(((end - start) % msDay) / msHour)
	return hours;
}

export function totalMinutes(startTime, endTime) {
	let msMinute = 60 * 1000,
		msDay = 60 * 60 * 24 * 1000;
	const start = new Date(startTime);
	const end = new Date(endTime);
	const minutes = Math.floor(((end - start) % msDay) / msMinute) % 60;

	return minutes;
}

export function totalTime(
	formatted = false,
	start,
	end
) {
	const hours = totalHours(start, end);
	const minutes = totalMinutes(start, end);
	const timeFormat = (hours, minutes) => (`${Math.floor(hours)}h ${Math.abs(minutes)}min`);
	const readyToReturn = end !== '' && start !== '';

	const decimalMin = minutes / 60;
	const decimalTime = +(decimalMin + hours).toPrecision(3);

	if (formatted) {
		if (readyToReturn) return timeFormat(hours, minutes);
		else return timeFormat(0, 0);
	} else {
		return decimalTime;
	}
}

export function resultDate(date) {
	const DATE = new Date(date);
	const timezoneCorrectedNow = new Date(DATE - DATE.getTimezoneOffset() * 60000)
	const formattedDate = timezoneCorrectedNow.toJSON()/* .split("T")[0] */;
	return formattedDate;
}

export function decimalToTime(time) {
	let hrs = Math.floor(time)
	let min = Math.round(time % 1 * 60)
	min = min < 10 ? "0" + min : min.toString();
	return hrs + ":" + min;
};