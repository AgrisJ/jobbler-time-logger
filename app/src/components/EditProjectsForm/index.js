import React, { useState, useEffect } from 'react'
import Joi from 'joi-browser';
import { connect } from 'react-redux';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import { editProject } from '../../Store/slices/projects';
import { FormInput, FormWrapper, FormButton, FormContent, Form, FormH1, FormLabel, ScrollAnchor, ErrorMessage } from './EditProjectsFormElements';
import { getLoginData } from '../../Store/slices/login';
import { errorMessagePerType, scrollDownTo } from './../AddDataForm/index';
import { getUsersArray } from './../../Store/slices/users';
import { getlanguage } from './../../Store/slices/language';
import { languageData } from './../../languages/language_variables';
import { Notificator } from '../../pages/addRemove';
import { currentAddressChanged, getcurrentAddress } from './../../Store/slices/currentAddress';


const EditProjectsForm = ({ login, dispatch, currentAddress, language }) => {

	const {
		_NAME,
		_EDITPROJECTDATA,
		_MAKEALLCHANGES,
		_CHANGESMESSAGE
	} = languageData.COMPONENTS.EditProjectsForm;

	const {
		_ADDRESS
	} = languageData.COMPONENTS.AddDataForm;

	const [{ nameInput }, setnameInput] = useState({ nameInput: '' });
	const [{ addressInput }, setaddressInput] = useState({ addressInput: '' });
	const [{ errors }, seterrors] = useState({ errors: {} });
	const [{ showNotificator }, setshowNotificator] = useState({ showNotificator: false });

	function handleNameChange(e) {
		setnameInput({ nameInput: e.target.value })
	}
	function handleAddressChange(e) {
		setaddressInput({ addressInput: e.target.value })
	}

	useEffect(() => {
		const { name, address } = currentAddress;
		setnameInput({ nameInput: name });
		setaddressInput({ addressInput: address });
	}, [currentAddress])

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
			currentAddressChanged({
				name: nameInput,
				projectId: currentAddress.projectId,
				address: addressInput
			}));

		dispatch(
			editProject(
				login.session,
				currentAddress.projectId,
				{
					name: nameInput,
					projectId: currentAddress.projectId,
					address: addressInput,
				}
			)
		)

		setshowNotificator({ showNotificator: true });
		seterrors({ errors: {} });
	}

	const secondModeSchema = {
		nameInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-,._ ]+$/).min(3).max(30).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Name') }
		}),
		addressInput: Joi.string().regex(/^[a-zA-Z0-9ÆæØøÅåĀāĒēĪīŪūĻļĶķŠšČčŅņ\-,._ ]+$/).min(3).max(30).required().error(err => {
			return { message: errorMessagePerType(err[0], 'Address') }
		})
	}

	function validate() {
		const options = { abortEarly: false };

		const secondModeFields = {
			...{ nameInput },
			...{ addressInput }
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
				<FormLabel htmlFor='for'>{_ADDRESS[language]}</FormLabel>
				<FormInput
					onClick={() => scrollDownTo(".scrollHere")}
					onChange={handleAddressChange}
					value={addressInput}
					type='text'
					hasErrors={errors['addressInput']}
					autocomplete="off"
					required />
				{errors['addressInput'] && <ErrorMessage>{errors['addressInput']}</ErrorMessage>}
			</>
		)
	}

	return (
		<>
			<FormWrapper>
				<FormContent>
					<Form onSubmit={handleSubmit}>
						<FormH1>{_EDITPROJECTDATA[language]}</FormH1>
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
	currentAddress: getcurrentAddress(state),
	language: getlanguage(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(EditProjectsForm);
