import React, { useEffect, useState } from 'react'
import { scrollDownTo } from '../AddDataForm';
import { ScrollAnchor } from '../AddDataForm/AddDataFormElements';
import { FormInput, LoginFormWrapper, FormButton, FormContent, Form, FormH1, FormLabel, Text, ErrorMessage, LoginLogo } from './LoginFormElements';
import Joi from 'joi-browser';
import { errorMessagePerType } from './../AddDataForm/index';
import { connect } from 'react-redux';
import * as actions from '../../Store/api';
import { getLoginData, postLogin } from '../../Store/slices/login';
import { useHistory } from 'react-router-dom';
import { getlanguage } from './../../Store/slices/language';
import { languageData } from './../../languages/language_variables';

const LoginForm = ({ dispatch, login, language }) => {

	const {
		_EMAILPASSWORDINCORRECT,
		_SIGNINTOYOURACCOUNT,
		_EMAIL,
		_PASSWORD,
		_LOGIN
	} = languageData.COMPONENTS.LoginForm;

	const [{ emailInput }, setemailInput] = useState({ emailInput: '' });
	const [{ passwordInput }, setpasswordInput] = useState({ passwordInput: '' });
	const [{ errors }, seterrors] = useState({ errors: {} });
	let history = useHistory();

	function handleEmailChange(e) {
		setemailInput({ emailInput: e.target.value })
	}
	function handlePasswordChange(e) {
		setpasswordInput({ passwordInput: e.target.value })
	}
	function emptyInputs() {
		setemailInput({ emailInput: '' })
		setpasswordInput({ passwordInput: '' })
	}
	function doSubmit() {

		dispatch(
			postLogin(
				{
					email: emailInput,
					password: passwordInput
				}
			)
		)

		// emptyInputs();
	}

	useEffect(() => {
		const findingError = login.error;
		const hasError = findingError === undefined ? false : true;


		if (hasError) {
			const savedErrors = { ...errors };
			let message = login.error && login.error.message

			// Message type
			if (message.includes('404')) message = _EMAILPASSWORDINCORRECT[language];

			savedErrors['emailInput'] = message;
			savedErrors['passwordInput'] = message;
			seterrors({ errors: savedErrors })
		}

	}, [login])


	const loginSchema = {
		emailInput: Joi.string().email({ tlds: { allow: false } }).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Email') }
		}),
		passwordInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-_ !]+$/).min(3).max(16).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Password') }
		})
	}

	function validate() {
		const options = { abortEarly: false };

		const loginFields = {
			...{ emailInput },
			...{ passwordInput }
		};

		const { error } = Joi.validate(loginFields, loginSchema, options);
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

	return (
		<>
			<LoginFormWrapper>
				<LoginLogo src="/sidna_byg_logo.png" alt="logo" />
				<FormContent>
					<Form onSubmit={handleSubmit}>
						<FormH1>{_SIGNINTOYOURACCOUNT[language]}</FormH1>
						<FormLabel htmlFor='for'>{_EMAIL[language]}</FormLabel>
						<FormInput
							onClick={() => scrollDownTo(".scrollHere")}
							onChange={handleEmailChange}
							value={emailInput}
							type='email'
							hasErrors={errors['emailInput']}
							required />
						{errors['emailInput'] && <ErrorMessage>{errors['emailInput']}</ErrorMessage>}
						<FormLabel htmlFor='for'>{_PASSWORD[language]}</FormLabel>
						<FormInput
							onClick={() => scrollDownTo(".scrollHere")}
							onChange={handlePasswordChange}
							value={passwordInput}
							type='password'
							hasErrors={errors['passwordInput']}
							required />
						{errors['passwordInput'] && <ErrorMessage>{errors['passwordInput']}</ErrorMessage>}
						<FormButton>{_LOGIN[language]}</FormButton>
					</Form>
				</FormContent>
			</LoginFormWrapper>
			<ScrollAnchor className={'scrollHere'} />
		</>
	)
}

const mapStateToProps = (state) =>
({
	login: getLoginData(state),
	language: getlanguage(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(LoginForm);
