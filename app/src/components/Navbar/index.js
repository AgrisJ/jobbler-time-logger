import React, { useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { MobileIcon, Nav, NavbarContainer, NavItem, NavLogo, NavMenu, NavLinks, NavLogoLink, NavSubLogo, NavBtn, NavBtnLink } from './NavbarElements';
import { languageData } from './../../languages/language_variables';
import { getlanguage } from './../../Store/slices/language';
import { connect } from 'react-redux';

const Navbar = ({ toggle, language }) => {
	const [{ scrollNav }, setScrollNav] = useState({ scrollNav: false });

	const {
		_TIMELOGGER
	} = languageData.COMPONENTS.Navbar;

	const changeNav = () => {
		if (window.scrollY >= 85)
			setScrollNav({ scrollNav: true });
		else
			setScrollNav({ scrollNav: false });
	}

	useEffect(() => {
		window.addEventListener('scroll', changeNav);

		return function cleanupListener() {
			window.removeEventListener('scroll', changeNav)
		}
	}, [])

	return (
		<>
			<Nav scrollNav={scrollNav}>
				<NavbarContainer>
					<MobileIcon onClick={toggle}><FaBars /></MobileIcon>
					<NavLogoLink to="/">
						<NavLogo src="/sidna_byg_logo.png" alt="logo" />
					</NavLogoLink>
					<NavSubLogo to="/">{_TIMELOGGER[language]}</NavSubLogo>
				</NavbarContainer>
			</Nav>
		</>
	)
}

const mapStateToProps = state =>
({
	language: getlanguage(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(Navbar);
