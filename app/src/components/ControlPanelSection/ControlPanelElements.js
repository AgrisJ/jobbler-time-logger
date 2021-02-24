import styled from 'styled-components/macro';
import { AiFillCaretRight, AiFillCaretLeft } from 'react-icons/ai';
import { AiOutlineFileAdd } from 'react-icons/ai';

export const ControlPanelContainer = styled.div`
	  background: #fff;
    display: flex;
    /* height: 800px; */
    position: relative;
    z-index: 1;
    flex-direction: column;
		align-items: center;

	// text unselectable
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
	/** Add :before styles */
`

export const ControlPanelBg = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
`

export const ControlPanelContent = styled.div`
	z-index: 3;
	/* max-width: 1200px; */
	width: 100vw;
	padding: 8px 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 2em;
	position: sticky;
	top: 0;
	background: white;
	
`

export const ControlPanelH1 = styled.h1`
	font-family: 'Expletus Sans';
	font-weight: normal;
	/* color: #000; */
	/* font-size: 35px; */
	text-align: center;
	background: white;
	position: sticky;
	/* top: ${({ scrollTitle }) => (scrollTitle ? '-95px' : '0px')}; */
	top: '0px';
	z-index: 15;
	padding-top: 0.4em;
  padding-bottom: 0.4em;
	color: rgb(10 119 197);
	text-shadow: 3px 2px 3px #0000000d;
	text-transform: uppercase;
	font-size: 1.5em;
	cursor: pointer;

	@media screen and (max-width: 768px) {
		font-size: 32px;
	}

	@media screen and (max-width: 480px) {
		font-size: 26px;
	}
`
export const ControlPanelMonth = styled.h2`
	font-family: 'Expletus Sans';
	font-weight: normal;
	/* margin-top: 0.5em; */
	color: #4F4F4F;
	font-size: 23px;
	text-align: center;
	display: flex;
  align-items: center;
	cursor: pointer;

	@media screen and (max-width: 768px) {
		font-size: 22px;
	}

	@media screen and (max-width: 480px) {
		font-size: 20px;
	}
`

export const TotalDisplayWrapper = styled.div`
	/* margin-top: 1.2em; */
	display: flex;
	flex-direction: column;
	align-items: center;
`

export const TotalDisplay = styled.div`
	font-family: 'Expletus Sans';
	background: #F2F2F2;
	padding: 0.2em 0.5em;
`
export const TotalTime = styled.span`
	font-family: 'Expletus Sans';
	color: #828282;
	font-size: 1.2em;
	font-weight: normal;
`

export const ForwardCaret = styled(AiFillCaretRight)`
	color: #828282;
	margin-left: 0.5em;
`

export const BackwardCaret = styled(AiFillCaretLeft)`
	color: #828282;
	margin-right: 0.5em;
`

export const CardCounter = styled.div`
	display: flex;
	align-self: flex-end;
  color: black;
	position: absolute;
  bottom: 0.5em;
	font-family: 'Expletus Sans';
  color: #4F4F4F;
  font-size: 14px;
`
export const AddCardButton = styled(AiOutlineFileAdd)`
	color: rgba(0,0,0,0.6);
	position: absolute;
	bottom: 25px;
	left: 0;
	transform: translate(30%,30%);
	font-size: 1.6em;
	display: flex;
	align-items: center;
	cursor: pointer;

	& :hover {     
	  color: #dfdfdf;
	}
`