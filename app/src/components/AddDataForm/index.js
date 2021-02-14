import React, { useState } from 'react'
import { connect } from 'react-redux';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import { projectAdded } from '../../Store/slices/projects';
import { userAdded } from '../../Store/slices/users';
import Joi from 'joi-browser';
import { FormInput, FormWrapper, FormButton, FormContent, Form, FormH1, FormLabel, ScrollAnchor, ErrorMessage } from './AddDataFormElements';
import { companyConfig } from '../../services/companyConfig';
import * as actions from '../../Store/api';
import { getLoginData } from '../../Store/slices/login';


const AddDataForm = ({ currentModeIndex, login, dispatch }) => {
	const dataType = ['Project', 'Contractor'][currentModeIndex];
	const FIRST_MODE = currentModeIndex === 0;
	const SECOND_MODE = currentModeIndex === 1;

	const [{ nameInput }, setnameInput] = useState({ nameInput: '' });
	const [{ emailInput }, setemailInput] = useState({ emailInput: '' });
	const [{ addressInput }, setaddressInput] = useState({ addressInput: '' });
	const [{ passwordInput }, setpasswordInput] = useState({ passwordInput: '' });
	const [{ errors }, seterrors] = useState({ errors: {} });

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
	function emptyInputs() {
		setnameInput({ nameInput: '' })
		setemailInput({ emailInput: '' })
		setaddressInput({ addressInput: '' })
		setpasswordInput({ passwordInput: '' })
	}
	function doSubmit() {
		if (FIRST_MODE) dispatch(actions.apiCallBegan({
			url: "/v1/project",
			method: "post",
			data: {
				companyId: companyConfig.companyId,
				name: nameInput,
				address: addressInput,
				active: true
			},
			headers: {
				session: login.session
			},
			onSuccess: "projects/projectReceived"
		}));
		if (SECOND_MODE) dispatch(actions.apiCallBegan({
			url: "/v1/user",
			method: "post",
			data: {
				companyId: companyConfig.companyId,
				fullName: nameInput,
				email: emailInput,
				password: passwordInput,
				role: "employee"
			},
			headers: {
				session: login.session
			},
			onSuccess: "users/userReceived"
		}));

		// dispatch(actions.apiCallBegan);

		emptyInputs();
	}



	const firstModeSchema = {
		nameInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-_ ]+$/).min(3).max(25).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Building Name') }
		}),
		addressInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-_ ]+$/).min(3).max(25).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Address') }
		})
	}
	const secondModeSchema = {
		nameInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-_ ]+$/).min(3).max(25).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Name') }
		}),
		emailInput: Joi.string().email({ tlds: { allow: false } }).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Email') }
		}),
		passwordInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-_ !]+$/).min(3).max(16).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Password') }
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
			...{ passwordInput }
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
					<FormLabel htmlFor='for'>Address</FormLabel>
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
					<FormLabel htmlFor='for'>Email</FormLabel>
					<FormInput
						onClick={() => scrollDownTo(".scrollHere")}
						onChange={handleEmailChange}
						value={emailInput}
						type='email'
						hasErrors={errors['emailInput']}
						required />
					{errors['emailInput'] && <ErrorMessage>{errors['emailInput']}</ErrorMessage>}
					<FormLabel htmlFor='for'>Password</FormLabel>
					<FormInput
						onClick={() => scrollDownTo(".scrollHere")}
						onChange={handlePasswordChange}
						value={passwordInput}
						type='password'
						hasErrors={errors['passwordInput']}
						required />
					{errors['passwordInput'] && <ErrorMessage>{errors['passwordInput']}</ErrorMessage>}
				</>
			)
	}

	return (
		<>
			<FormWrapper>
				<FormContent >
					<Form onSubmit={handleSubmit}>
						<FormH1>Add New {dataType}</FormH1>
						{ONLY_FIRSTMODE_MODULES()}
						<FormLabel htmlFor='for'>{FIRST_MODE && 'Building'} Name</FormLabel>
						<FormInput
							onChange={handleNameChange}
							value={nameInput}
							type='text'
							hasErrors={errors['nameInput']}
							required />
						{errors['nameInput'] && <ErrorMessage>{errors['nameInput']}</ErrorMessage>}
						{ONLY_SECONDMODE_MODULES()}
						<FormButton>Add</FormButton>
					</Form>
				</FormContent>
			</FormWrapper>
			<ScrollAnchor className={'scrollHere'} />
		</>
	)
}

const mapStateToProps = (state) =>
({
	currentModeIndex: getcurrentModeIndex(state),
	login: getLoginData(state)
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