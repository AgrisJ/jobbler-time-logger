import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import SelectUsers from '../components/SelectUsers';
import Sidebar from '../components/Sidebar'
import { connect } from 'react-redux';
import AddEntryForm from '../components/AddEntryForm';

const AddEntry = ({ isAdmin }) => {
	const [{ isOpen }, setIsOpen] = useState({ isOpen: false });
	const toggle = () => setIsOpen({ isOpen: !isOpen });

	return (
		<>
			<Sidebar isOpen={isOpen} toggle={toggle} isAdmin={false} />
			<Navbar toggle={toggle} />
			<SelectUsers labelText={'Time spent in:'} manualOverride={0} />
			<AddEntryForm isAdmin={isAdmin} />
			{/*TODO Add animated notification - 'name' erased  */}
		</>
	)
}

const mapStateToProps = (state) =>
({

})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AddEntry);