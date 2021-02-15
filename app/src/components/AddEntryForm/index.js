import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import Joi from 'joi-browser';
import { FormInput, FormWrapper, FormButton, FormContent, Form, FormH1, FormLabel, ScrollAnchor, ErrorMessage, TotalHoursDisplay, DisplayLabel } from './AddEntryFormElements';
import { companyConfig } from '../../services/companyConfig';
import * as actions from '../../Store/api';
import { getLoginData } from '../../Store/slices/login';
import { errorMessagePerType, scrollDownTo } from '../AddDataForm';
import { getcurrentAddress } from '../../Store/slices/currentAddress';
import { getTimecardArray } from '../../Store/slices/timecards';
import { useHistory } from 'react-router-dom';


const AddDataForm = ({ login, currentAddress, timecards, dispatch }) => {
	let history = useHistory();

	const [{ isLoading }, setisLoading] = useState({ isLoading: true });
	const [{ startTimeInput }, setstartTimeInput] = useState({ startTimeInput: '' });
	const [{ endTimeInput }, setendTimeInput] = useState({ endTimeInput: '' });
	const [{ errors }, seterrors] = useState({ errors: {} });
	const [{ hideForms }, sethideForms] = useState({ hideForms: true });

	// useEffect(() => { currentAddress && localStorage.setItem('currentAddress', JSON.stringify(currentAddress)) }, [currentAddress]);

	useEffect(() => {
		if (currentAddress.projectId !== null)
			!currentAddress.loading && setisLoading({ isLoading: false });
	}, [currentAddress])

	useEffect(() => { !isLoading && sethideForms({ hideForms: false }); }, [currentAddress, isLoading])
	useEffect(() => { currentAddress && localStorage.setItem('currentAddress', JSON.stringify(currentAddress)) }, [currentAddress]);
	useEffect(() => {
		const findingError = timecards.find(timecard => Object.keys(timecard).includes('error'));
		const hasError = findingError === undefined ? false : true;

		if (!isLoading && !hasError) history.push("/recordoverview");

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
	function emptyInputs() {
		setstartTimeInput({ startTimeInput: '' })
		setendTimeInput({ endTimeInput: '' })
	}
	function dateToday() {
		const now = new Date();
		const timezoneCorrectedNow = new Date(`${now} GMT+00:00`)
		const dateToday = timezoneCorrectedNow.toJSON().split("T")[0];
		return dateToday;
	}
	function totalHours(startTime, endTime) {
		let dateFirst = new Date(`${dateToday()} ${startTime}`);
		let dateSecond = new Date(`${dateToday()} ${endTime}`); //TODO make it - if endTime is smaller than start Time - switch to tomorrows day

		// time difference
		let timeDiff = Math.abs(dateSecond.getTime() - dateFirst.getTime());
		let hours = timeDiff / 60 / 60 / 1000;
		return hours;
	}
	function totalMinutes(startTime, endTime) {
		let dateFirst = new Date(`${dateToday()} ${startTime}`);
		let dateSecond = new Date(`${dateToday()} ${endTime}`); //TODO make it - if endTime is smaller than start Time - switch to tomorrows day

		// time difference
		let timeDiff = (dateSecond.getTime() - dateFirst.getTime()) / 1000;
		let minutes = (timeDiff / 60) % 60;
		return minutes;
	}


	function doSubmit() {
		dispatch(actions.apiCallBegan({// TODO ...and here - dispatch(PostUserTimecards());
			url: "/v1/timecard",
			method: "post",
			data: {
				userId: login.userId,
				projectId: currentAddress.projectId,
				date: dateToday(),
				hours: totalHours(startTimeInput, endTimeInput)
			},
			headers: {
				session: login.session
			},
			onError: "timecards/error"
		}));

		dispatch(actions.apiCallBegan({ // TODO ...and here - dispatch(loadUserTimecards());
			url: "/v1/user/hours",
			headers: {
				session: login.session
			},
			onSuccess: "timecards/timecardsReceived"
		}));



		emptyInputs();

		// history.push("/recordoverview");
	}

	const schema = {
		startTimeInput: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Start Time') }
		}),
		endTimeInput: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/).required().error(err => {
			return { message: errorMessagePerType(err[0], 'End Time') }
		})
	}

	function validate() {
		const options = { abortEarly: false };
		const fields = {
			...{ startTimeInput },
			...{ endTimeInput }
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

	function totalTime() {
		const hours = parseInt(totalHours(startTimeInput, endTimeInput));
		const minutes = totalMinutes(startTimeInput, endTimeInput);
		const timeFormat = (hours, minutes) => (`${hours}h ${minutes}min`);
		const readyToReturn = endTimeInput !== '' && startTimeInput !== '';
		if (readyToReturn) return timeFormat(hours, minutes);
		else return timeFormat(0, 0);
	}

	return (
		<>
			<FormWrapper>
				<FormContent style={hideForms ? hide() : null}>
					<Form onSubmit={handleSubmit}>
						<>
							<FormLabel htmlFor='for'>End Time</FormLabel>
							<FormInput
								onChange={handleEndTimeChange}
								value={endTimeInput}
								type='time'
								hasErrors={errors['endTimeInput']}
								required />
							{errors['endTimeInput'] && <ErrorMessage>{errors['endTimeInput']}</ErrorMessage>}
						</>
						<>
							<FormLabel htmlFor='for'>Start Time</FormLabel>
							<FormInput
								onClick={() => scrollDownTo(".scrollHere")}
								onChange={handleStartTimeChange}
								value={startTimeInput}
								type='time'
								hasErrors={errors['startTimeInput']}
								required />
							{errors['startTimeInput'] && <ErrorMessage>{errors['startTimeInput']}</ErrorMessage>}
						</>
						<DisplayLabel>Total</DisplayLabel>
						<TotalHoursDisplay>
							{totalTime()}
						</TotalHoursDisplay>
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
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AddDataForm);