import styled from 'styled-components/macro';

export const ActionButton = styled.button`
	border-radius: 50px;
	background: #01bf71;
	white-space: nowrap;
	padding: 10px 22px;
	color: #FFF;
	background: ${({ color }) => (color ? color : '#010606')};
	font-size: 16px;
	outline: none;
	border: none;
	cursor: pointer;
	transition: all 0.2 ease-in-out;
	text-decoration: none;

	&:hover {
		transition: all 0.2 ease-in-out;
		background: #cecece;
		color: #010606;
	}
`

export const Container = styled.div`
	display: flex;
	justify-content: center;
	height: 40px;
	z-index: 1;
	width: 100%;
	padding: 0 24px;
	/* max-width: 1100px; */
	align-items: center;
  flex-direction: column;
	line-height: 1;
`