import React, { useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { MobileIcon, Nav, NavbarContainer, NavItem, NavLogo, NavMenu, NavLinks, NavSubLogo, NavBtn, NavBtnLink } from './NavbarElements';

const Navbar = ({ toggle }) => {
	const [{ scrollNav }, setScrollNav] = useState({ scrollNav: false });

	const changeNav = () => {
		if (window.scrollY >= 85)
			setScrollNav({ scrollNav: true });
		else
			setScrollNav({ scrollNav: false });
	}

	useEffect(() => {
		window.addEventListener('scroll', changeNav);
	}, [])

	return (
		<>
			<Nav scrollNav={scrollNav}>
				<NavbarContainer>
					<MobileIcon onClick={toggle}><FaBars /></MobileIcon>
					<NavLogo to="/">Sidna Byg</NavLogo>
					<NavSubLogo to="/">time logger</NavSubLogo>
					{/* <NavMenu>
						<NavItem>
							<NavLinks to="about">About</NavLinks>
						</NavItem>
						<NavItem>
							<NavLinks to="login">Login</NavLinks>
						</NavItem>
					</NavMenu> */}
					<NavBtn>
						<NavBtnLink to="/print">Print Report</NavBtnLink>
					</NavBtn>
				</NavbarContainer>
			</Nav>
		</>
	)
}

export default Navbar
