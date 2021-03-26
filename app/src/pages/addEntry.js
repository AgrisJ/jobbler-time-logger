import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import SelectUsers from '../components/SelectUsers';
import Sidebar from '../components/Sidebar'
import { connect } from 'react-redux';
import AddEntryForm from '../components/AddEntryForm';
import { getlanguage } from './../Store/slices/language';
import { languageData } from './../languages/language_variables';

const AddEntry = ({ isAdmin, language }) => {

	const {
		_TIMESPENTIN
	} = languageData.COMPONENTS.AddEntry;

	const [{ isOpen }, setIsOpen] = useState({ isOpen: false });
	const toggle = () => setIsOpen({ isOpen: !isOpen });

	return (
		<>
			<Sidebar isOpen={isOpen} toggle={toggle} isAdmin={isAdmin} />
			<Navbar toggle={toggle} />
			<SelectUsers labelText={`${_TIMESPENTIN[language]}:`} manualOverride={0} />
			<AddEntryForm isAdmin={isAdmin} />
		</>
	)
}

const mapStateToProps = state =>
({
	language: getlanguage(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AddEntry);