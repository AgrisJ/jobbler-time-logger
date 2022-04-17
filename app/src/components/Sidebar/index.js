import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { getLoginData, loggedOut } from '../../Store/slices/login';
import { projectsReset } from '../../Store/slices/projects';
import { usersReset } from '../../Store/slices/users';
import { currentModeIndexReset } from '../../Store/slices/currentModeIndex';
import { currentContractorReset } from '../../Store/slices/currentContractor';
import { currentAddressReset } from '../../Store/slices/currentAddress';
import { timecardsReset } from '../../Store/slices/timecards';
import { SidebarContainer, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarLink, SideBtnWrap, SidebarRoute, LogoutButton, LoggedInfo } from './SidebarElements';
import { languageData } from '../../languages/language_variables';
import { getlanguage, languageChanged } from './../../Store/slices/language';
import ReactFlagsSelect from 'react-flags-select';
import "../../Styles/languageDropdown.css"
import { postLogout } from './../../Store/slices/login';
function Sidebar({ isOpen, toggle, dispatch, isAdmin, login, language }) {

	const {
		_ADDREMOVE,
		_EDITUSERS,
		_EDITPROJECTS,
		_SEEALLENTRIES,
		_PRINTMODE,
		_SEEYOURENTRIES,
		_ADDNEWENTRY,
		_LOGGEDAS,
		_LOGOUT,
		_SELECTLANGUAGE
	} = languageData.COMPONENTS.Sidebar;

	const storedLogin = localStorage.getItem('login');
	const storedParsedLogin = JSON.parse(storedLogin);
	const storedLoggedUser = storedLogin && storedParsedLogin.name;
	const loggedUser = login.name || storedLoggedUser;

	const [selectedFlag, setSelectedFlag] = useState('GB');

	const storedLanguage = localStorage.getItem('language');

	useEffect(() => {
		const reverseCodeTranslation = {
			"en": "GB",
			"lv": "LV"
		};
		setSelectedFlag(reverseCodeTranslation[storedLanguage]);
	}, [storedLanguage])

	function handleLanguage(code) {
		const codeTranslation = {
			"GB": "en",
			"LV": "lv"
		};
		dispatch(languageChanged(codeTranslation[code]));
	}

	function handleLogout() {

		dispatch(currentAddressReset());
		dispatch(currentModeIndexReset());
		dispatch(currentContractorReset());
    localStorage.removeItem("currentContractor");
    localStorage.removeItem("currentAddress");
    localStorage.removeItem("currentModeIndex");
    localStorage.removeItem("login");

		dispatch(timecardsReset());
		dispatch(usersReset());
		dispatch(projectsReset());

		dispatch(loggedOut());
		dispatch(postLogout(login.session));
		localStorage.setItem('login', "{}");
	}

	function ADMIN_SECTIONS() {
		if (isAdmin)
			return (
				<>
					<SidebarMenu>
						<SidebarLink to="/addremove" onClick={toggle}>{_ADDREMOVE[language]}</SidebarLink>
						<SidebarLink to="/editusers" onClick={toggle}>{_EDITUSERS[language]}</SidebarLink>
						<SidebarLink to="/editprojects" onClick={toggle}>{_EDITPROJECTS[language]}</SidebarLink>
						<SidebarLink to="/admin" onClick={toggle}>{_SEEALLENTRIES[language]}</SidebarLink>
					</SidebarMenu>
					<SideBtnWrap>
						<SidebarRoute to='/print' onClick={toggle}>{_PRINTMODE[language]}</SidebarRoute>
					</SideBtnWrap>
				</>
			)
	}
	function USER_SECTIONS() {
		if (!isAdmin)
			return (
				<>
					<SidebarMenu>
						<SidebarLink to="/recordoverview" onClick={toggle}>{_SEEYOURENTRIES[language]}</SidebarLink>
					</SidebarMenu>
					<SideBtnWrap>
						<SidebarRoute to='/addentry' onClick={toggle}>{_ADDNEWENTRY[language]}</SidebarRoute>
					</SideBtnWrap>
				</>
			)
	}

	return (
		<SidebarContainer isOpen={isOpen}>
			<Icon onClick={toggle}>
				<CloseIcon />
			</Icon>
			{loggedUser && <LoggedInfo>{_LOGGEDAS[language]} <span style={{ color: '#c7ad9e', paddingTop: '4px' }}>{loggedUser}</span></LoggedInfo>}
			<LogoutButton to="/login" onClick={handleLogout}>
				{_LOGOUT[language]}
			</LogoutButton>
			<SidebarWrapper>
				{ADMIN_SECTIONS()}
				{USER_SECTIONS()}
				<ReactFlagsSelect
					countries={["GB", "LV"]}
					customLabels={{ "GB": "en", "LV": "lv" }}
					selected={selectedFlag}
					onSelect={
						code => {
							setSelectedFlag(code);
							handleLanguage(code);
						}
					}
					placeholder={_SELECTLANGUAGE[language]}
					selectedSize={20}
					className="menu-flags"
					selectButtonClassName="menu-flags-button"
					fullWidth={false}
				/>
			</SidebarWrapper>
		</SidebarContainer>
	)
}

const mapStateToProps = (state) =>
({
	login: getLoginData(state),
	language: getlanguage(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(Sidebar);
