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
import * as actions from '../Store/api';
import { companyConfig } from '../services/companyConfig';
import { getLoginData } from '../Store/slices/login';


const AddRemove = ({ dispatch, projects, users, currentAddress, currentContractor, currentModeIndex, login, timecards }) => {
	const [{ isOpen }, setIsOpen] = useState({ isOpen: false });
	const [{ showModal }, setshowModal] = useState({ showModal: false });

	const toggle = () => setIsOpen({ isOpen: !isOpen });

	const firstMode = currentModeIndex === 0; // Project hours
	const secondMode = currentModeIndex === 1; // Contractor hours

	const handleRemove = () => {
		const currentUserId = (relativeId = false) => {
			const firstUserId = typeof users[0] !== 'undefined' ? users[0].userId : null;
			const firstUserRelativeId = typeof users[0] !== 'undefined' ? users[0].id : null;
			const selectedUser = users.find(user => user.userId === currentContractor.userId);

			if (!relativeId) {
				return typeof selectedUser !== 'undefined' ?
					selectedUser.userId :
					null || firstUserId
			} else {
				return typeof selectedUser !== 'undefined' ?
					selectedUser.id :
					null || firstUserRelativeId
			}

		};
		const currentProjectId = (relativeId = false) => {
			const firstProjectId = typeof projects[0] !== 'undefined' ? projects[0].projectId : null;
			const firstProjectRelativeId = typeof projects[0] !== 'undefined' ? projects[0].id : null;
			const selectedProject = projects.find(project => project.projectId === currentAddress.projectId);

			if (!relativeId) {
				return typeof selectedProject !== 'undefined' ?
					selectedProject.projectId :
					null || firstProjectId
			} else {
				return typeof selectedProject !== 'undefined' ?
					selectedProject.id :
					null || firstProjectRelativeId
			}


		};

		const handleRemoveUser = () => {

			// delete user
			dispatch(actions.apiCallBegan({
				url: `/v1/user/${currentUserId()}`,
				method: "PATCH",
				data: {
					"deleted": true
				},
				headers: {
					session: login.session
				},
				onSuccess: "users/userRemoved"
			}));

			timecards.forEach(card => {
				// delete all user cards
				if (card.userId === currentUserId()) {
					dispatch(actions.apiCallBegan({
						url: `/v1/timecard/${card.cardId}`,
						method: "DELETE",
						headers: {
							session: login.session
						},
						onSuccess: "timecards/timecardRemoved"
					}));
				}
			});

			// remove user and cards from Store
			dispatch(userRemoved({ userId: currentUserId() }))
			dispatch(timecardsOfUserRemoved({ id: currentUserId(true) }))

		};
		const handleRemoveProject = () => {

			// delete project
			dispatch(actions.apiCallBegan({
				url: `/v1/project/${currentProjectId()}`,
				method: "PATCH",
				data: {
					"active": false
				},
				headers: {
					session: login.session
				},
				onSuccess: "projects/projectRemoved"
			}));

			timecards.forEach(card => {
				// delete all project cards
				if (card.projectId === currentProjectId()) {
					dispatch(actions.apiCallBegan({
						url: `/v1/timecard/${card.cardId}`,
						method: "DELETE",
						headers: {
							session: login.session
						},
						onSuccess: "timecards/timecardRemoved"
					}));
				}
			});

			// remove user and cards from Store
			dispatch(projectRemoved({ projectId: currentProjectId() }));
			dispatch(timecardsOfProjectRemoved({ id: currentProjectId(true) }))
		}

		setshowModal({ showModal: true });

		const firstUser = users.length > 0 ? users.find(user => user.userId === currentUserId()) : null;

		if (showModal) {

			setshowModal({ showModal: false });
			if (firstMode) handleRemoveProject();
			if (secondMode) handleRemoveUser();

		} else {
			const selectedAddress = projects.length > 0 ? projects.find(project => project.id === currentProjectId(true)).address : null;
			if (firstMode) dispatch(currentAddressChanged({ address: selectedAddress, projectId: currentProjectId() }));
			if (secondMode) dispatch(currentContractorChanged(firstUser));
		}
	}

	const cancelModal = () => setshowModal({ showModal: false });
	const itemToRemove = () => {
		if (firstMode) return currentAddress.address;
		if (secondMode) return currentContractor.name
	}
	return (
		<>
			<Sidebar isOpen={isOpen} toggle={toggle} isAdmin={true} />
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
	timecards: getTimecardArray(state),
	// monthIndex: getMonthIndex(state),
	currentAddress: getcurrentAddress(state),
	currentContractor: getcurrentContractor(state),
	currentModeIndex: getcurrentModeIndex(state),
	login: getLoginData(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AddRemove);