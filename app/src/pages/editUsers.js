import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SelectUsers from '../components/SelectUsers';
import Sidebar from '../components/Sidebar'
import { connect } from 'react-redux';
import { getUsersArray } from '../Store/slices/users';
import { getProjectArray } from '../Store/slices/projects';
import { getcurrentAddress } from '../Store/slices/currentAddress';
import { getcurrentContractor } from '../Store/slices/currentContractor';
import { getcurrentModeIndex } from '../Store/slices/currentModeIndex';
import { getTimecardArray } from '../Store/slices/timecards';
import { getLoginData } from '../Store/slices/login';
import EditUsersForm from './../components/EditUsersForm/index';


const EditUsers = ({ currentContractor }) => {
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