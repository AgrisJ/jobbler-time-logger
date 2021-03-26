import React, { useEffect, useState } from 'react'
import { ActionButton, Container } from '../components/common/commonElements';
import Navbar from '../components/Navbar'
import SelectUsers from '../components/SelectUsers';
import Sidebar from '../components/Sidebar'
import ModeSwitcher from './../components/ModeSwitcher/index';
import { connect } from 'react-redux';
import { getUsersArray, userRemoved } from '../Store/slices/users';
import { getProjectArray, deleteProject, projectRemoved } from '../Store/slices/projects';
import { currentAddressChanged, getcurrentAddress } from '../Store/slices/currentAddress';
import { currentContractorChanged, getcurrentContractor } from '../Store/slices/currentContractor';
import { getcurrentModeIndex } from '../Store/slices/currentModeIndex';
import Modal from '../components/Modal';
import { getTimecardArray, timecardsOfUserRemoved, timecardsOfProjectRemoved, } from '../Store/slices/timecards';
import AddDataForm from '../components/AddDataForm';
import * as actions from '../Store/api';
import { getLoginData } from '../Store/slices/login';
import { getlanguage } from './../Store/slices/language';
import { languageData } from './../languages/language_variables';
import { deleteUser } from './../Store/slices/users';
import { deleteTimecard } from './../Store/slices/timecards';


const AddRemove = ({ dispatch, projects, users, currentAddress, currentContractor, currentModeIndex, login, timecards, language }) => {
	const {
		_PROJECTS,
		_CONTRACTORS,
		_REMOVE,
		_ALLDATAALSODELETED,
		_PROJECT,
		_USER,
		_ERASED
	} = languageData.COMPONENTS.AddRemove;

	const {

	} = languageData.COMPONENTS.AddDataForm;

	const [{ isOpen }, setIsOpen] = useState({ isOpen: false });
	const [{ showModal }, setshowModal] = useState({ showModal: false });
	const [{ showNotificator }, setshowNotificator] = useState({ showNotificator: false });

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
			dispatch(
				deleteUser(
					login.session,
					currentUserId(),
					{
						"deleted": true
					}
				)
			)

			timecards.forEach(card => {
				// delete all user cards
				if (card.userId === currentUserId()) {
					dispatch(
						deleteTimecard(
							login.session,
							card.cardId
						)
					)
				}
			});

			// remove user and cards from Store
			dispatch(userRemoved({ userId: currentUserId() }))
			dispatch(timecardsOfUserRemoved({ id: currentUserId(true) }))

		};
		const handleRemoveProject = () => {

			// delete project
			dispatch(
				deleteProject(
					login.session,
					currentProjectId()
				)
			)

			timecards.forEach(card => {
				// delete all project cards
				if (card.projectId === currentProjectId()) {
					dispatch(
						deleteTimecard(
							login.session,
							card.cardId
						)
					)
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
			setshowNotificator({ showNotificator: true });

		} else {
			const selectedAddress = projects.length > 0 ? projects.find(project => project.id === currentProjectId(true)).address : null;
			if (firstMode) dispatch(currentAddressChanged({ address: selectedAddress, projectId: currentProjectId() }));
			if (secondMode) dispatch(currentContractorChanged(firstUser));
			setshowNotificator({ showNotificator: false });
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
			<ModeSwitcher titles={[_PROJECTS[language], _CONTRACTORS[language]]} />
			<SelectUsers />
			<Container>
				<ActionButton onClick={handleRemove} color={'rgb(252, 67, 100)'}>{_REMOVE[language]}</ActionButton>
			</Container>
			<Modal
				showModal={showModal}
				actionActivated={() => handleRemove}
				highlightedText={_REMOVE[language]}
				modalText={itemToRemove()}
				modalSubText={_ALLDATAALSODELETED[language]}
				cancelModal={() => cancelModal()} />
			<AddDataForm />
			{showNotificator && <Notificator message={`${firstMode && _PROJECT[language] || secondMode && _USER[language]} ${_ERASED[language]}`} />}
		</>
	)
}

const mapStateToProps = state =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timecards: getTimecardArray(state),
	currentAddress: getcurrentAddress(state),
	currentContractor: getcurrentContractor(state),
	currentModeIndex: getcurrentModeIndex(state),
	login: getLoginData(state),
	language: getlanguage(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AddRemove);


export function Notificator({ message }) {
	const [{ changingHeight }, setchangingHeight] = useState({ changingHeight: 55 })
	const [{ changingOpacity }, setchangingOpacity] = useState({ changingOpacity: 1 })

	const styles = {
		container: {
			background: 'rgb(94 150 52 / 87%)',
			position: 'fixed',
			transform: 'translate(calc(50vw - 50%))',
			zIndex: '100000',
			padding: '1em',
			borderRadius: '12px',
			color: 'white',
			transition: 'all 0.5s',
			opacity: changingOpacity,
			top: changingHeight + 'vh'
		}
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			setchangingHeight({ changingHeight: 45 });
			setchangingOpacity({ changingOpacity: 0 });
		}, 450);
		return () => {
			clearTimeout(timeout);
		}
	}, [])


	return (
		<div style={styles.container}>
			{message}
		</div>
	)
}