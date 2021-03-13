import styled from 'styled-components/macro';
import { FaPen, FaRegCommentDots } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

export const ContentListItem = styled.div`
  position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${({ listColor }) => (listColor)};
	flex-direction: column;
  padding: 0.6em;
	width: -webkit-fill-available;
	width: -moz-available;
`
export const NotesContainer = styled.div`
  position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	/* background: #fffc; */
	background: rgb(255 255 255 / 69%);
	flex-direction: column;
  padding: 0.6em;
	border-radius: 5px;
  margin: 7px 0px;
  width: inherit;
`
export const TimeEditContainer = styled.div`
  position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fffc;
	flex-direction: column;
  padding: 0.6em;
	border-radius: 5px;
  margin: 7px 0px;
  width: inherit;
`
export const PickerLabel = styled.p`
	margin-bottom: 0px;
	font-size: 18px;
	/* color: #000; */
	color: rgb(31, 90, 152);
	text-align: center;
	font-family: 'Expletus Sans';
	-webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
`

export const TimeInput = styled.input`
	width: 40%;
	justify-self: center;
	padding: 8px 8px;
	margin-bottom: 14px;
	background: rgb(77 119 164 / 55%);
	color: rgb(255 255 255);
	/* background: #e8e8e8;
	color: #828282; */
	text-align: center;
	font-size: 26px;
	font-family: 'Expletus Sans';
	border-radius: 4px;
	border: none;
	cursor: pointer;
`

export const NotesText = styled.p`
font-family: 'Expletus Sans';
	font-weight: normal;
	font-size: 12px;
	color: #828282;
	 -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
`

export const ListEditIcon = styled(FaPen)`
	color: rgba(0, 0, 0, 0.54);
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(80%,53%);
	font-size: 0.9em;
`

export const ItemDeleteIcon = styled(TiDelete)`
	/* color: rgba(0, 0, 0, 0.34); */
	color: rgb(102 126 142 / 73%);
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(30%,30%);
	font-size: 1.6em;
	display: flex;
	align-items: center;
	cursor: pointer;

	& :hover {     
	color: #fff;
	}
`
export const NotesIcon = styled(FaRegCommentDots)`
	/* color: rgba(0, 0, 0, 0.24); */
	color: rgb(102 126 142 / 65%);
	position: absolute;
	top: 38px;
	right: 12px;
	transform: translate(30%,30%);
	transform: scaleX(-1);
	font-size: 1.6em;
	display: flex;
	align-items: center;
	cursor: pointer;

	& :hover {     
	/* color: #fff; */
	color: rgb(69 116 174 / 19%);
	}
`

export const ListDate = styled.div`
	font-family: 'Expletus Sans';
	font-weight: normal;
	font-size: 18px;
	color: #000000;
	cursor: pointer;

	& :hover {     
	font-weight: bold;
	color: #fff;
	}
	 -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
	 
`
export const ListPersonName = styled.div`
	font-family: 'Expletus Sans';
	font-weight: normal;
	font-size: 22px;
	/* color: #828282; */
	color: rgb(31 90 152 / 68%);
	 -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
`
export const ListTime = styled.div`
	font-family: 'Roboto Light';
	font-weight: normal;
	font-size: 15px;
	/* color: #828282; */
	color: rgb(31 90 152);
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(-30%,30%);
	 -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
`

export const DateInput = styled.div`
border-style: none;
background: none;
font-family: 'Expletus Sans';
font-weight: normal;
font-size: 18px;
color: #000000;
text-align: end;
cursor: pointer;

& :hover {     
font-weight: bold;
color: #fff;
}
`

export const DateForm = styled.form`

`
