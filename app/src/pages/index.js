import React, { useState } from 'react'
import Sidebar from './../components/Sidebar';
import Navbar from './../components/Navbar';
import ControlPanelSection from '../components/ControlPanelSection';
import { connect } from 'react-redux';
import { getUsersArray } from './../Store/slices/users';

function Home() {
	const [{ isOpen }, setIsOpen] = useState({ isOpen: false });
	const toggle = () => {
		setIsOpen({ isOpen: !isOpen })
	}

	return (
		<>
			<Sidebar isOpen={isOpen} toggle={toggle} />
			<Navbar toggle={toggle} />
			<ControlPanelSection />
		</>
	)
}

const mapStateToProps = (state) =>
({
	users: getUsersArray(state),
	pauseTime: state.entities.pauseTime
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(Home);
