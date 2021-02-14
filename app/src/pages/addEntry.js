import React, { useState } from 'react'
import { ActionButton, Container } from '../components/common/commonElements';
import Navbar from '../components/Navbar'
import SelectUsers from '../components/SelectUsers';
import Sidebar from '../components/Sidebar'
import ModeSwitcher from '../components/ModeSwitcher/index';
import { connect } from 'react-redux';
import { getUsersArray, userRemoved } from '../Store/slices/users';
import { getProjectArray, projectRemoved } from '../Store/slices/projects';
import { currentAddressChanged, getcurrentAddress } from '../Store/slices/currentAddress';
import { currentContractorChanged, getcurrentContractor } from '../Store/slices/currentContractor';
import { getcurrentModeIndex } from '../Store/slices/currentModeIndex';
import Modal from '../components/Modal';
import { getTimecardArray, timecardsOfUserRemoved, timecardsOfProjectRemoved } from '../Store/slices/timecards';
import * as actions from '../Store/api';
import { companyConfig } from '../services/companyConfig';
import { getLoginData } from '../Store/slices/login';
import AddEntryForm from '../components/AddEntryForm';


const AddEntry = ({ dispatch, projects, users, currentAddress, currentContractor, currentModeIndex, login }) => {
	const [{ isOpen }, setIsOpen] = useState({ isOpen: false });
	const toggle = () => setIsOpen({ isOpen: !isOpen });

	return (
		<>
			<Sidebar isOpen={isOpen} toggle={toggle} isAdmin={false} />
			<Navbar toggle={toggle} />
			{/* <h1>Choose an Object</h1> */}
			<SelectUsers />
			<AddEntryForm />
			{/*TODO Add animated notification - 'name' erased  */}
		</>
	)
}

const mapStateToProps = (state) =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timeCards: getTimecardArray(state),
	// monthIndex: getMonthIndex(state),
	currentAddress: getcurrentAddress(state),
	currentContractor: getcurrentContractor(state),
	currentModeIndex: getcurrentModeIndex(state),
	login: getLoginData(state),
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AddEntry);