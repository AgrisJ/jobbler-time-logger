import styled from 'styled-components/macro';
import { Link as LinkR } from 'react-router-dom';
import { Link as LinkS } from 'react-scroll';
import { globalConfig } from '../../config/global_config';
const themeVariables = globalConfig.CONFIG_themeVariables;
const { THEME_navLogo_width, THEME_navLogo_margin, THEME_navSubLogo } = themeVariables;

export const Nav = styled.nav`
	background:white;
	height: 136px;
	// margin-top: -80px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1rem;
	position: sticky;
	top: ${({ scrollNav }) => (scrollNav ? '-130px' : '0')};
	z-index: 10;
	margin-bottom: -0.5em;

	@media screen and (max-width: 960px) {
		transition: 0.5s all ease;
	}
`

export const NavbarContainer = styled.div`
	display: flex;
	justify-content: center;
	height: 80px;
	z-index: 1;
	width: 100%;
	padding: 0 24px;
	max-width: 1100px;
	align-items: center;
  flex-direction: column;
	line-height: 1;
	-webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
	margin-bottom: 1.2em;
`

export const NavLogoLink = styled(LinkR)`
	font-family: 'Expletus Sans';
	color: #636363;
	justify-self: center;
	cursor: pointer;
	/* font-size: 2.6rem; */
	display: flex;
	align-items: center;
	text-decoration: none;
	`

export const NavLogo = styled.img`
	width: ${THEME_navLogo_width};
  margin: ${THEME_navLogo_margin};
`
export const NavSubLogo = styled(LinkR)`
	font-family: 'Expletus Sans';
	color: ${THEME_navSubLogo};
	justify-self: center;
	cursor: pointer;
	font-size: 1.1rem;
	display: flex;
	align-items: center;
	text-decoration: none;
`

export const MobileIcon = styled.div`
	/* display: none; */

	/* @media screen and (max-width: 760px) { */
		display: block;
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(-60%,70%);
		font-size: 1.8rem;
		cursor: pointer;
		color: #636363;
	/* } */
`

export const NavMenu = styled.ul`
	display: flex;
	align-items: center;
	list-style: none;
	text-align: center;
	margin-right: -22px;

	@media screen and (max-width: 768px) {
		display: none;
	}
`

export const NavItem = styled.li`
	height: 80px;
`

export const NavLinks = styled(LinkS)`
	color: #fff;
	display: flex;
	align-items: center;
	text-decoration: none;
	padding: 0 1rem;
	height: 100%;
	cursor: pointer;

	&.active {
		border-bottom: 3px solid #01bf71;
	}
`

export const NavBtn = styled.nav`
	position: absolute;
	display: flex;
	align-items: center;
	right: 0;
  transform: translate(-50%);

	@media screen and (max-width: 768px) {
		display: none;
	}
`

export const NavBtnLink = styled(LinkR)`
	border-radius: 50px;
	background: #01bf71;
	white-space: nowrap;
	padding: 10px 22px;
	color: #010606;
	font-size: 16px;
	outline: none;
	border: none;
	cursor: pointer;
	transition: all 0.2 ease-in-out;
	text-decoration: none;

	&:hover {
		transition: all 0.2 ease-in-out;
		background: #fff;
		color: #010606;
	}
`