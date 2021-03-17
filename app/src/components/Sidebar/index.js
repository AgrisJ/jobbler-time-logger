import React from 'react'
import { connect } from 'react-redux';
import { getLoginData, loggedOut } from '../../Store/slices/login';
import { projectsReset } from '../../Store/slices/projects';
import { usersReset, getUsersArray } from '../../Store/slices/users';
import { currentModeIndexReset } from '../../Store/slices/currentModeIndex';
import { currentContractorReset } from '../../Store/slices/currentContractor';
import { currentAddressReset } from '../../Store/slices/currentAddress';
import { timecardsReset } from '../../Store/slices/timecards';
import { SidebarContainer, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarLink, SideBtnWrap, SidebarRoute, LogoutButton, LoggedInfo } from './SidebarElements';

function Sidebar({ isOpen, toggle, dispatch, isAdmin, login }) {

	const loggedUser = login.name;

	function handleLogout() {
		// TODO add a logout API route

		dispatch(currentAddressReset());
		dispatch(currentModeIndexReset());
		dispatch(currentContractorReset());

		dispatch(timecardsReset());
		dispatch(usersReset());
		dispatch(projectsReset());

		dispatch(loggedOut());
		localStorage.setItem('login', "{}");
	}

	function ADMIN_SECTIONS() {
		if (isAdmin)
			return (
				<>
					<SidebarMenu>
						<SidebarLink to="/addremove" onClick={toggle}>Add/Remove</SidebarLink>
						<SidebarLink to="/editusers" onClick={toggle}>Edit Users</SidebarLink>
						<SidebarLink to="/admin" onClick={toggle}>See All Entries</SidebarLink>
					</SidebarMenu>
					<SideBtnWrap>
						<SidebarRoute to='/print' onClick={toggle}>Print Mode</SidebarRoute>
					</SideBtnWrap>
				</>
			)
	}
	function USER_SECTIONS() {
		if (!isAdmin)
			return (
				<>
					<SidebarMenu>
						<SidebarLink to="/recordoverview" onClick={toggle}>See Your Entries</SidebarLink>
					</SidebarMenu>
					<SideBtnWrap>
						<SidebarRoute to='/addentry' onClick={toggle}>Add New Entry</SidebarRoute>
					</SideBtnWrap>
				</>
			)
	}

	return (
		<SidebarContainer isOpen={isOpen}>
			<Icon onClick={toggle}>
				<CloseIcon />
			</Icon>
			<LoggedInfo>Logged in as <span style={{ color: '#ec6c22' }}>{loggedUser}</span></LoggedInfo>
			<LogoutButton to="/login" onClick={handleLogout}>
				Logout
			</LogoutButton>
			<SidebarWrapper>
				{ADMIN_SECTIONS()}
				{USER_SECTIONS()}
			</SidebarWrapper>
		</SidebarContainer>
	)
}

const mapStateToProps = (state) =>
({
	login: getLoginData(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(Sidebar);
