import styled from 'styled-components/macro';
import { FaPen } from 'react-icons/fa';

export const ContentListItem = styled.div`
  position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${({ listColor }) => (listColor)};
	flex-direction: column;
  padding: 0.6em;
	width: -webkit-fill-available;
`

export const ListEditIcon = styled(FaPen)`
	color: rgba(0, 0, 0, 0.54);
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(80%,53%);
	font-size: 0.9em;
`

export const ListDate = styled.div`
	font-family: 'Expletus Sans';
	font-weight: normal;
	font-size: 18px;
	color: #000000;
	 
`
export const ListPersonName = styled.div`
	font-family: 'Expletus Sans';
	font-weight: normal;
	font-size: 22px;
	color: #828282;;
`
export const ListTime = styled.div`
	font-family: 'Roboto Light';
	font-weight: normal;
	font-size: 15px;
	color: #828282;
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(-30%,30%);
`