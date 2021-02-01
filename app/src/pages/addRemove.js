import React, { useState } from 'react'
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


const AddRemove = ({ dispatch, projects, users, currentAddress, currentContractor, currentModeIndex }) => {
	const [{ isOpen }, setIsOpen] = useState({ isOpen: false });
	const [{ showModal }, setshowModal] = useState({ showModal: false });

	const toggle = () => setIsOpen({ isOpen: !isOpen });

	const firstMode = currentModeIndex === 0; // Project hours
	const secondMode = currentModeIndex === 1; // Contractor hours

	const handleRemove = () => {
		const currentUserId = () => {
			const firstUserId = typeof users[0] !== 'undefined' ? users[0].id : null;

			return typeof users.find(user => user.name === currentContractor) !== 'undefined' ?
				users.find(user => user.name === currentContractor).id :
				null || firstUserId
		};
		const currentProjectId = () => {
			const firstProjectId = typeof projects[0] !== 'undefined' ? projects[0].id : null;

			return typeof projects.find(project => project.id === currentAddress.projectId) !== 'undefined' ?
				projects.find(project => project.address === currentAddress.address).id :
				null || firstProjectId
		};

		const handleRemoveUser = () => {
			dispatch(userRemoved({ id: currentUserId() }))
			dispatch(timecardsOfUserRemoved({ id: currentUserId() }))

		};
		const handleRemoveProject = () => {
			dispatch(projectRemoved({ id: currentProjectId() }));
			dispatch(timecardsOfProjectRemoved({ id: currentProjectId() }))
		}

		setshowModal({ showModal: true });

		const firstUser = users.length > 0 ? users.find(user => user.id === currentUserId()).name : null;

		if (showModal) {
			setshowModal({ showModal: false });
			if (firstMode) handleRemoveProject();
			if (secondMode) handleRemoveUser();

		} else {
			const selectedAddress = projects.length > 0 ? projects.find(project => project.id === currentProjectId()).address : null;
			if (firstMode) dispatch(currentAddressChanged({ address: selectedAddress, projectId: currentProjectId() }));
			if (secondMode) dispatch(currentContractorChanged(firstUser));
		}
	}

	const cancelModal = () => setshowModal({ showModal: false });
	const itemToRemove = () => {
		if (firstMode) return currentAddress.address;
		if (secondMode) return currentContractor
	}
	return (
		<>
			<Sidebar isOpen={isOpen} toggle={toggle} />
			<Navbar toggle={toggle} />
			<ModeSwitcher titles={['Projects', 'Contractors']} />
			<SelectUsers />
			<Container>
				<ActionButton onClick={handleRemove} color={'rgb(252, 67, 100)'}>Remove</ActionButton>
			</Container>
			<Modal
				showModal={showModal}
				actionActivated={() => handleRemove}
				highlightedText={'Remove'}
				modalText={itemToRemove()}
				modalSubText={'* All data will be also deleted'}
				cancelModal={() => cancelModal()} />
			<AddDataForm />
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
	currentModeIndex: getcurrentModeIndex(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AddRemove);