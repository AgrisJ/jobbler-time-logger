import React, { useState, useEffect } from 'react'
import Joi from 'joi-browser';
import parse from "html-react-parser";
import { connect } from 'react-redux';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import { editUser } from '../../Store/slices/users';
import { FormInput, FormWrapper, FormButton, FormContent, Form, FormH1, FormLabel, ScrollAnchor, ErrorMessage, CautionContainer, CautionText } from './EditUsersFormElements';
import { getLoginData } from '../../Store/slices/login';
import { errorMessagePerType, scrollDownTo } from './../AddDataForm/index';
import { getcurrentContractor } from './../../Store/slices/currentContractor';
import { getUsersArray } from './../../Store/slices/users';
import { getlanguage } from './../../Store/slices/language';
import { languageData } from './../../languages/language_variables';
import { Notificator } from '../../pages/addRemove';


const EditUsersForm = ({ login, dispatch, currentContractor, language }) => {

	const {
		_NAME,
		_CHANGEWITHCAUTION,
		_TYPENEWPASSWORD,
		_EDITUSERDATA,
		_MAKEALLCHANGES,
		_CHANGESMESSAGE
	} = languageData.COMPONENTS.EditUsersForm;

	const {
		_EMAIL,
		_PASSWORD,
		_TELEPHONE,
		_CPRNR,
		_CONTRACTNR
	} = languageData.COMPONENTS.AddDataForm;

	const [{ nameInput }, setnameInput] = useState({ nameInput: '' });
	const [{ emailInput }, setemailInput] = useState({ emailInput: '' });
	const [{ passwordInput }, setpasswordInput] = useState({ passwordInput: '' });
	const [{ telephoneInput }, settelephoneInput] = useState({ telephoneInput: '' });
	const [{ cprInput }, setcprInput] = useState({ cprInput: '' });
	const [{ contractnrInput }, setcontractnrInput] = useState({ contractnrInput: '' });
	const [{ errors }, seterrors] = useState({ errors: {} });
	const [{ showNotificator }, setshowNotificator] = useState({ showNotificator: false });

	function handleNameChange(e) {
		setnameInput({ nameInput: e.target.value })
	}
	function handleEmailChange(e) {
		setemailInput({ emailInput: e.target.value })
	}
	function handlePasswordChange(e) {
		setpasswordInput({ passwordInput: e.target.value })
	}
	function handleTelephoneChange(e) {
		settelephoneInput({ telephoneInput: e.target.value })
	}
	function handleCPRChange(e) {
		setcprInput({ cprInput: e.target.value })
	}
	function handleContractnrChange(e) {
		setcontractnrInput({ contractnrInput: e.target.value })
	}

	useEffect(() => {
		const { name, email, telephone, cpr, contractNumber } = currentContractor;
		setnameInput({ nameInput: name });
		setemailInput({ emailInput: email });
		telephone ? settelephoneInput({ telephoneInput: telephone }) : settelephoneInput({ telephoneInput: '' });
		cpr ? setcprInput({ cprInput: cpr }) : setcprInput({ cprInput: '' });
		contractNumber ? setcontractnrInput({ contractnrInput: contractNumber }) : setcontractnrInput({ contractnrInput: '' });
	}, [currentContractor])

	// resetting notificator
	useEffect(() => {
		if (showNotificator) {
			setTimeout(() => {
				setshowNotificator({ showNotificator: false });
			}, 1000);

		}
	}, [showNotificator])

	function doSubmit() {
		dispatch(
			editUser(
				login.session,
				currentContractor.userId,
				{
					userId: currentContractor.userId,
					fullName: nameInput,
					email: emailInput,
					password: passwordInput && passwordInput,
					telephone: telephoneInput,
					cpr: cprInput,
					contractNumber: contractnrInput
				}
			)
		)

		// setshowNotificator({ showNotificator: false });
		setshowNotificator({ showNotificator: true });

		setpasswordInput({ passwordInput: '' });
		seterrors({ errors: {} });
	}

	const secondModeSchema = {
		nameInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-,._ ]+$/).min(3).max(30).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Name') }
		}),
		emailInput: Joi.string().email({ tlds: { allow: false } }).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Email') }
		}),
		passwordInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-_ !]+$/).min(6).max(16).allow(null, '').error(err => {
			return { message: errorMessagePerType(err[0], 'Password') }
		}),
		telephoneInput: Joi.string().regex(/^[a-zA-Z0-9 +]+$/).min(6).max(16).allow(null, '').error(err => {
			return { message: errorMessagePerType(err[0], 'Telephone') }
		}),
		cprInput: Joi.string().regex(/^[0-9]+$/).min(10).max(10).allow(null, '').error(err => {
			return { message: errorMessagePerType(err[0], 'Cpr') }
		}),
		contractnrInput: Joi.string().regex(/^[a-zA-Z0-9-_ ]+$/).min(6).max(16).allow(null, '').error(err => {
			return { message: errorMessagePerType(err[0], 'Contractnr') }
		})
	}

	function validate() {
		const options = { abortEarly: false };

		const secondModeFields = {
			...{ nameInput },
			...{ emailInput },
			...{ passwordInput },
			...{ telephoneInput },
			...{ cprInput },
			...{ contractnrInput }
		};

		const { error } = Joi.validate(secondModeFields, secondModeSchema, options);
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

	function INPUT_FIELDS() {
		return (
			<>
				<FormLabel htmlFor='for'>{_NAME[language]}</FormLabel>
				<FormInput
					onChange={handleNameChange}
					value={nameInput}
					type='text'
					hasErrors={errors['nameInput']}
					autocomplete="off"
					required />
				{errors['nameInput'] && <ErrorMessage>{errors['nameInput']}</ErrorMessage>}
				<FormLabel htmlFor='for'>{_TELEPHONE[language]}</FormLabel>
				<FormInput
					onChange={handleTelephoneChange}
					value={telephoneInput}
					type='tel'
					autocomplete="off"
					hasErrors={errors['telephoneInput']}
				/>
				{errors['telephoneInput'] && <ErrorMessage>{errors['telephoneInput']}</ErrorMessage>}
				<FormLabel htmlFor='for'>{_CPRNR[language]}</FormLabel>
				<FormInput
					onChange={handleCPRChange}
					value={cprInput}
					type='number'
					autocomplete="off"
					hasErrors={errors['cprInput']}
				/>
				{errors['cprInput'] && <ErrorMessage>{errors['cprInput']}</ErrorMessage>}
				<FormLabel htmlFor='for'>{_CONTRACTNR[language]}</FormLabel>
				<FormInput
					onClick={() => scrollDownTo(".scrollHere")}
					onChange={handleContractnrChange}
					value={contractnrInput}
					type='text'
					autocomplete="off"
					hasErrors={errors['contractnrInput']}
				/>
				{errors['contractnrInput'] && <ErrorMessage>{errors['contractnrInput']}</ErrorMessage>}
				<CautionContainer>
					<CautionText>{parse(_CHANGEWITHCAUTION[language])}</CautionText>
					<FormLabel htmlFor='for'>{_EMAIL[language]}</FormLabel>
					<FormInput
						// style={{ borderColor: '#d97a36' }}
						onClick={() => scrollDownTo(".scrollHere")}
						onChange={handleEmailChange}
						value={emailInput}
						type='email'
						hasErrors={errors['emailInput']}
						autocomplete="off"
						required />
					{errors['emailInput'] && <ErrorMessage>{errors['emailInput']}</ErrorMessage>}
					<FormLabel htmlFor='for'>{_PASSWORD[language]}</FormLabel>
					<FormInput
						// style={{ borderColor: '#d97a36' }}
						onClick={() => scrollDownTo(".scrollHere")}
						onChange={handlePasswordChange}
						value={passwordInput}
						type='password'
						placeholder={_TYPENEWPASSWORD[language]}
						autocomplete="off"
						hasErrors={errors['passwordInput']}
					/>
					{errors['passwordInput'] && <ErrorMessage>{errors['passwordInput']}</ErrorMessage>}
				</CautionContainer>
			</>
		)
	}

	return (
		<>
			<FormWrapper>
				<FormContent >
					<Form onSubmit={handleSubmit}>
						<FormH1>{_EDITUSERDATA[language]}</FormH1>
						{INPUT_FIELDS()}
						<FormButton>{_MAKEALLCHANGES[language]}</FormButton>
					</Form>
				</FormContent>
			</FormWrapper>
			{showNotificator && <Notificator message={`${_CHANGESMESSAGE[language]}`} />}

			<ScrollAnchor className={'scrollHere'} />
		</>
	)
}

const mapStateToProps = state =>
({
	currentModeIndex: getcurrentModeIndex(state),
	login: getLoginData(state),
	users: getUsersArray(state),
	currentContractor: getcurrentContractor(state),
	language: getlanguage(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(EditUsersForm);
