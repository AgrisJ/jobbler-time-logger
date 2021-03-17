import React, { useState, useEffect } from 'react'
import { ActionButton, Container } from '../components/common/commonElements';
import Navbar from '../components/Navbar'
import SelectUsers from '../components/SelectUsers';
import Sidebar from '../components/Sidebar'
import ModeSwitcher from './../components/ModeSwitcher/index';
import { connect } from 'react-redux';
import { getUsersArray, userRemoved } from '../Store/slices/users';
import { getProjectArray, projectRemoved } from '../Store/slices/projects';
import { currentAddressChanged, getcurrentAddress } from '../Store/slices/currentAddress';
import { currentContractorChanged, getcurrentContractor } from '../Store/slices/currentContractor';
import { getcurrentModeIndex } from '../Store/slices/currentModeIndex';
import Modal from '../components/Modal';
import { getTimecardArray, timecardsOfUserRemoved, timecardsOfProjectRemoved } from '../Store/slices/timecards';
import AddDataForm from '../components/AddDataForm';
import * as actions from '../Store/api';
import { companyConfig } from '../services/companyConfig';
import { getLoginData } from '../Store/slices/login';
import EditUsersForm from './../components/EditUsersForm/index';


const EditUsers = ({ dispatch, users, currentContractor, currentModeIndex, login }) => {
	const [{ isOpen }, setIsOpen] = useState({ isOpen: false });

	const toggle = () => setIsOpen({ isOpen: !isOpen });

	useEffect(() => {
		currentContractor &&
			localStorage.setItem('currentContractor', JSON.stringify(currentContractor))
	}, [currentContractor]);

	return (
		<>
			<Sidebar isOpen={isOpen} toggle={toggle} isAdmin={true} />
			<Navbar toggle={toggle} />
			<SelectUsers manualOverride={1} />
			<EditUsersForm />
		</>
	)
}

const mapStateToProps = (state) =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timecards: getTimecardArray(state),
	// monthIndex: getMonthIndex(state),
	currentAddress: getcurrentAddress(state),
	currentContractor: getcurrentContractor(state),
	currentModeIndex: getcurrentModeIndex(state),
	login: getLoginData(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(EditUsers);