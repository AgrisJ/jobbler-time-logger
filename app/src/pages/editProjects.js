import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SelectUsers from '../components/SelectUsers';
import Sidebar from '../components/Sidebar'
import { connect } from 'react-redux';
import { getcurrentAddress } from '../Store/slices/currentAddress';
import EditProjectsForm from './../components/EditProjectsForm/index';


const EditProjects = ({ currentAddress }) => {

	const [{ isOpen }, setIsOpen] = useState({ isOpen: false });

	const toggle = () => setIsOpen({ isOpen: !isOpen });

	useEffect(() => {
		currentAddress &&
			localStorage.setItem('currentAddress', JSON.stringify(currentAddress))
	}, [currentAddress]);

	return (
		<>
			<Sidebar isOpen={isOpen} toggle={toggle} isAdmin={true} />
			<Navbar toggle={toggle} />
			<SelectUsers manualOverride={0} />
			<EditProjectsForm />
		</>
	)
}

const mapStateToProps = (state) =>
({
	currentAddress: getcurrentAddress(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(EditProjects);