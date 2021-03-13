import React, { useEffect, useState } from 'react'
import { scrollDownTo } from '../AddDataForm';
import { ScrollAnchor } from '../AddDataForm/AddDataFormElements';
import { FormInput, LoginFormWrapper, FormButton, FormContent, Form, FormH1, FormLabel, Text, ErrorMessage, LoginLogo } from './LoginFormElements';
import Joi from 'joi-browser';
import { errorMessagePerType } from './../AddDataForm/index';
import { connect } from 'react-redux';
import * as actions from '../../Store/api';
import { getLoginData } from '../../Store/slices/login';
import { useHistory } from 'react-router-dom';

const LoginForm = ({ dispatch, login }) => {

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

		dispatch(actions.apiCallBegan({
			url: "/v1/login",
			method: "post",
			data: {
				email: emailInput,
				password: passwordInput
			},
			onSuccess: "login/loggedIn",
			onError: "login/errorHandled"
		}));

		// emptyInputs();
	}

	useEffect(() => {
		const findingError = login.error;
		const hasError = findingError === undefined ? false : true;


		if (hasError) {
			const savedErrors = { ...errors };
			let message = login.error && login.error.message

			// Message type
			if (message.includes('404')) message = "Email/Password is not correct";

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
						<FormH1>Sign in to your account</FormH1>
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
						<FormButton>Login</FormButton>
						{/* <Text>Enjoy!</Text> */}
					</Form>
				</FormContent>
			</LoginFormWrapper>
			<ScrollAnchor className={'scrollHere'} />
		</>
	)
}

const mapStateToProps = (state) =>
({
	login: getLoginData(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(LoginForm);
