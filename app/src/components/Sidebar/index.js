import React from 'react'
import { SidebarContainer, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarLink, SideBtnWrap, SidebarRoute } from './SidebarElements';

function Sidebar({ isOpen, toggle }) {
	return (
		<SidebarContainer isOpen={isOpen}>
			<Icon onClick={toggle}>
				<CloseIcon />
			</Icon>
			<SidebarWrapper>
				<SidebarMenu>
					<SidebarLink to="troubleshooting" onClick={toggle}>Help</SidebarLink>
					<SidebarLink to="contact" onClick={toggle}>Contact</SidebarLink>
				</SidebarMenu>
				<SideBtnWrap>
					<SidebarRoute to='/print' onClick={toggle}>Print Report</SidebarRoute>
				</SideBtnWrap>
			</SidebarWrapper>
		</SidebarContainer>
	)
}

export default Sidebar
