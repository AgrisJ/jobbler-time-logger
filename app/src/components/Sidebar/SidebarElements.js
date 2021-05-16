import styled from 'styled-components/macro';
import { FaTimes } from 'react-icons/fa';
// import { Link as LinkS } from 'react-scroll';
import { Link as LinkR } from 'react-router-dom';

export const SidebarContainer = styled.aside`
	position: fixed;
	z-index: 999;
	width: 100%;
	height: 100%;
	background: #152630;
	display: grid;
	align-items: center;
	top: 0;
	left: 0;
	transition: all 0.3s ease-in-out;
	opacity: ${({ isOpen }) => (isOpen ? '100%' : '0')};
	top: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
	/* top:0; */
`

export const CloseIcon = styled(FaTimes)`
	color: #fff;
`

export const Icon = styled.div`
	position: absolute;
	top: 1.2rem;
	right: 1.5rem;
	background: transparent;
	font-size: 2rem;
	cursor: pointer;
	outline: none;
`
export const LogoutButton = styled(LinkR)`
	position: absolute;
	top: 1rem;
	left: 1.5rem;

	border-radius: 50px;
	background: #215c87fc;
	white-space: nowrap;
	padding: 8px 10px;
	color: #fff;
	font-size: 14px;
	outline: none;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	text-decoration: none;

	&:hover {
		transition: all 0.2s ease-in-out;
		background: #cecece;
		color: red;
	}
`
export const LoggedInfo = styled.p`
	color: #31a8ff9e;
	position: absolute;
	top: 1rem;
	display: flex;
  flex-direction: column;
	font-size: 14px;
	text-align: center;
	transform: translate(calc(50vw - 50%));
	-webkit-user-select: none; /* Safari */
	-ms-user-select: none; /* IE 10 and IE 11 */
	user-select: none; /* Standard syntax */
`

export const SidebarWrapper = styled.div`
	color: #fff;
`
export const SidebarMenu = styled.ul`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: repeat(6, 80px);
	text-align: center;

	@media screen and (max-width: 480px) {
		grid-template-rows: repeat(6, 60px);
	}
	
`

export const SidebarLink = styled(LinkR)`
	display:flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	text-decoration: none;
	list-style: none;
	transition: all 0.2s ease-in-out;
	text-decoration: none;
	color: #fff;
	cursor: pointer;

	&:hover {
		color: #01bf71;
		transition: all 0.2s ease-in-out
	}
`

export const SideBtnWrap = styled.div`
	display:flex;
	justify-content: center;
`

export const SidebarRoute = styled(LinkR)`
	border-radius: 50px;
	background: #01bf71;
	white-space: nowrap;
	padding: 16px 64px;
	color: #010606;
	font-size: 16px;
	outline: none;border: one;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	text-decoration: none;

	&:hover {
		transition: all 0.2s ease-in-out;
		background: #fff;
		color: #010606;
	}
`