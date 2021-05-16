import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import Joi from 'joi-browser';
import { FormInput, FormWrapper, FormButton, FormContent, Form, FormH1, FormLabel, ScrollAnchor, ErrorMessage } from './AddDataFormElements';
import { getLoginData } from '../../Store/slices/login';
import { getlanguage } from './../../Store/slices/language';
import { languageData } from './../../languages/language_variables';
import { postProject } from './../../Store/slices/projects';
import { postUser } from './../../Store/slices/users';
import { Notificator } from '../../pages/addRemove';


const AddDataForm = ({ currentModeIndex, login, dispatch, language }) => {

	const {
		_ADDRESS,
		_EMAIL,
		_PASSWORD,
		_TELEPHONE,
		_CPRNR,
		_CONTRACTNR,
		_PROJECT,
		_CONTRACTOR,
		_ADDNEW,
		_ADD,
		_BUILDING,
		_NAME,
		_ADDED
	} = languageData.COMPONENTS.AddDataForm;

	const {
		_PROJECT: _PROJECT_,
		_USER
	} = languageData.COMPONENTS.AddRemove;

	const dataType = [_PROJECT[language], _CONTRACTOR[language]][currentModeIndex];
	const FIRST_MODE = currentModeIndex === 0;
	const SECOND_MODE = currentModeIndex === 1;

	const [{ nameInput }, setnameInput] = useState({ nameInput: '' });
	const [{ emailInput }, setemailInput] = useState({ emailInput: '' });
	const [{ addressInput }, setaddressInput] = useState({ addressInput: '' });
	const [{ passwordInput }, setpasswordInput] = useState({ passwordInput: '' });
	const [{ telephoneInput }, settelephoneInput] = useState({ telephoneInput: '' });
	const [{ cprInput }, setcprInput] = useState({ cprInput: '' });
	const [{ contractnrInput }, setcontractnrInput] = useState({ contractnrInput: '' });
	const [{ errors }, seterrors] = useState({ errors: {} });
	const [{ showNotificator }, setshowNotificator] = useState({ showNotificator: false });

	// resetting notificator
	useEffect(() => {
		if (showNotificator) {
			setTimeout(() => {
				setshowNotificator({ showNotificator: false });
			}, 1000);

		}
	}, [showNotificator])

	function handleNameChange(e) {
		setnameInput({ nameInput: e.target.value })
	}
	function handleEmailChange(e) {
		setemailInput({ emailInput: e.target.value })
	}
	function handleAddressChange(e) {
		setaddressInput({ addressInput: e.target.value })
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

	function emptyInputs() {
		setnameInput({ nameInput: '' })
		setemailInput({ emailInput: '' })
		setaddressInput({ addressInput: '' })
		setpasswordInput({ passwordInput: '' })
		settelephoneInput({ telephoneInput: '' })
		setcprInput({ cprInput: '' })
		setcontractnrInput({ contractnrInput: '' })
	}
	function doSubmit() {
		if (FIRST_MODE) dispatch(
			postProject(
				login.session,
				{
					companyId: login.companyId || process.env.REACT_APP_COMPANY_ID,
					name: nameInput,
					address: addressInput,
					active: true
				}
			)
		);
		if (SECOND_MODE) dispatch(
			postUser(
				login.session,
				{
					companyId: login.companyId || process.env.REACT_APP_COMPANY_ID,
					fullName: nameInput,
					email: emailInput,
					password: passwordInput,
					telephone: telephoneInput,
					cpr: cprInput,
					contractNumber: contractnrInput,
					role: "employee"
				}
			)
		);

		setshowNotificator({ showNotificator: true });
		emptyInputs();
	}



	const firstModeSchema = {
		nameInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-,._ ]+$/).min(3).max(30).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Building Name') }
		}),
		addressInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-,._ ]+$/).min(3).max(30).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Address') }
		})
	}
	const secondModeSchema = {
		nameInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-,._ ]+$/).min(3).max(30).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Name') }
		}),
		emailInput: Joi.string().email({ tlds: { allow: false } }).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Email') }
		}),
		passwordInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-_ !]+$/).min(3).max(16).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Password') }
		}),
		telephoneInput: Joi.string().regex(/^[a-zA-Z0-9 +]+$/).min(3).max(16).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Telephone') }
		}),
		cprInput: Joi.string().regex(/^[0-9]+$/).min(3).max(16).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Cpr') }
		}),
		contractnrInput: Joi.string().regex(/^[a-zA-Z0-9-_ ]+$/).min(3).max(16).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Contractnr') }
		})
	}

	function validate() {
		const options = { abortEarly: false };
		const firstModeFields = {
			...{ addressInput },
			...{ nameInput }
		};
		const secondModeFields = {
			...{ nameInput },
			...{ emailInput },
			...{ passwordInput },
			...{ telephoneInput },
			...{ cprInput },
			...{ contractnrInput }
		};

		const fieldSwitcher = () => {
			if (FIRST_MODE) return firstModeFields;
			if (SECOND_MODE) return secondModeFields;
		}
		const schemaSwitcher = () => {
			if (FIRST_MODE) return firstModeSchema;
			if (SECOND_MODE) return secondModeSchema;
		}

		const { error } = Joi.validate(fieldSwitcher(), schemaSwitcher(), options);
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

	function ONLY_FIRSTMODE_MODULES() {
		if (FIRST_MODE)
			return (
				<>
					<FormLabel htmlFor='for'>{_ADDRESS[language]}</FormLabel>
					<FormInput
						onClick={() => scrollDownTo(".scrollHere")}
						onChange={handleAddressChange}
						value={addressInput}
						type='text'
						hasErrors={errors['addressInput']}
						required />
					{errors['addressInput'] && <ErrorMessage>{errors['addressInput']}</ErrorMessage>}
				</>
			)
	}
	function ONLY_SECONDMODE_MODULES() {
		if (SECOND_MODE)
			return (
				<>
					<FormLabel htmlFor='for'>{_EMAIL[language]}</FormLabel>
					<FormInput
						// onClick={() => scrollDownTo(".scrollHere")}
						onChange={handleEmailChange}
						value={emailInput}
						type='email'
						hasErrors={errors['emailInput']}
						autocomplete="off"
						required />
					{errors['emailInput'] && <ErrorMessage>{errors['emailInput']}</ErrorMessage>}
					<FormLabel htmlFor='for'>{_PASSWORD[language]}</FormLabel>
					<FormInput
						// onClick={() => scrollDownTo(".scrollHere")}
						onChange={handlePasswordChange}
						value={passwordInput}
						type='password'
						hasErrors={errors['passwordInput']}
						autocomplete="off"
						required />
					{errors['passwordInput'] && <ErrorMessage>{errors['passwordInput']}</ErrorMessage>}
					<FormLabel htmlFor='for'>{_TELEPHONE[language]}</FormLabel>
					<FormInput
						onClick={() => scrollDownTo(".scrollHere")}
						onChange={handleTelephoneChange}
						value={telephoneInput}
						type='tel'
						hasErrors={errors['telephoneInput']}
						autocomplete="off"
						required />
					{errors['telephoneInput'] && <ErrorMessage>{errors['telephoneInput']}</ErrorMessage>}
					<FormLabel htmlFor='for'>{_CPRNR[language]}</FormLabel>
					<FormInput
						onClick={() => scrollDownTo(".scrollHere")}
						onChange={handleCPRChange}
						value={cprInput}
						type='number'
						hasErrors={errors['cprInput']}
						autocomplete="off"
						required />
					{errors['cprInput'] && <ErrorMessage>{errors['cprInput']}</ErrorMessage>}
					<FormLabel htmlFor='for'>{_CONTRACTNR[language]}</FormLabel>
					<FormInput
						onClick={() => scrollDownTo(".scrollHere")}
						onChange={handleContractnrChange}
						value={contractnrInput}
						type='text'
						hasErrors={errors['contractnrInput']}
						autocomplete="off"
						required />
					{errors['contractnrInput'] && <ErrorMessage>{errors['contractnrInput']}</ErrorMessage>}
				</>
			)
	}



	return (
		<>
			<FormWrapper>
				<FormContent >
					<Form onSubmit={handleSubmit}>
						<FormH1>{_ADDNEW[language]} {dataType}</FormH1>
						{ONLY_FIRSTMODE_MODULES()}
						<FormLabel htmlFor='for'>{FIRST_MODE && _BUILDING[language]} {_NAME[language]}</FormLabel>
						<FormInput
							onChange={handleNameChange}
							value={nameInput}
							type='text'
							hasErrors={errors['nameInput']}
							required />
						{errors['nameInput'] && <ErrorMessage>{errors['nameInput']}</ErrorMessage>}
						{ONLY_SECONDMODE_MODULES()}
						<FormButton>{_ADD[language]}</FormButton>
					</Form>
				</FormContent>
			</FormWrapper>
			{showNotificator && <Notificator message={`${FIRST_MODE && _PROJECT_[language] || SECOND_MODE && _USER[language]} ${_ADDED[language]}`} />} {/*TODO email already exists message needs to add. eriks@gmail.com*/}
			<ScrollAnchor className={'scrollHere'} />{/*TODO Also if error, have to catch it and keep data in form */}
		</>
	)
}

const mapStateToProps = (state) =>
({
	currentModeIndex: getcurrentModeIndex(state),
	login: getLoginData(state),
	language: getlanguage(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AddDataForm);


export function scrollDownTo(cssQuerry) {
	setTimeout(() => {
		document.querySelector(cssQuerry) && document.querySelector(cssQuerry).scrollIntoView(false);
	}, 200);
}
export function errorMessagePerType(error, fieldName) {
	let result = '';

	switch (error.type) {
		case "any.empty":
			result = `${fieldName} should not be empty!`;
			break;
		case "any.allowOnly":
			result = `${fieldName} allows only ${error.context.valids}`;
			break;
		case "string.min":
			result = `${fieldName} should have at least ${error.context.limit} characters!`;
			break;
		case "string.max":
			result = `${fieldName} should have at most ${error.context.limit} characters!`;
			break;
		case "string.regex.base":
			result = `${fieldName} contains wrong symbols!`;
			break;
		default:
			break;
	}
	return result;
};