import styled from 'styled-components/macro';
import { AiFillCaretRight, AiFillCaretLeft } from 'react-icons/ai';
import { globalConfig } from '../../config/global_config';
const themeVariables = globalConfig.CONFIG_themeVariables;
const { THEME_caret, THEME_modeSwitcherH1, THEME_modeSwitcherH1_fontFamily } = themeVariables;

export const ModeSwitcherH1 = styled.h1`
	font-family: ${THEME_modeSwitcherH1_fontFamily};
	font-weight: normal;
	color:  ${THEME_modeSwitcherH1};
	text-shadow: 3px 2px 3px #0000000d;
	text-transform: uppercase;
	font-size: 1.5em;

	@media screen and (max-width: 768px) {
		font-size: 32px;
	}

	@media screen and (max-width: 480px) {
		font-size: 26px;
	}
`

export const ModeSwitcher_ForwardCaret = styled(AiFillCaretRight)`
	/* color: #828282; */
	color: ${THEME_caret};
	margin-left: 0.5em;
`

export const ModeSwitcher_BackwardCaret = styled(AiFillCaretLeft)`
	/* color: #828282; */
	color: ${THEME_caret}; 
	margin-right: 0.5em;
`
export const ModeSwitcher_Container = styled.div`
display: flex;
align-items: center;
text-align: center;
justify-content: center;
	position: sticky;
	top: '0px';
	z-index: 15;
	background: white;
	padding-top: 0.4em;
  padding-bottom: 0.4em;
cursor: pointer;
`
