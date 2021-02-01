import styled from 'styled-components/macro';


export const ControlPanelH1 = styled.h1`
	font-family: 'Expletus Sans';
	font-weight: normal;
	text-align: center;
	background: white;
	position: sticky;
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
