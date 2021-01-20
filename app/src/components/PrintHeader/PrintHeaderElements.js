import styled from 'styled-components/macro';
import { FaTimes } from 'react-icons/fa';


export const PageWrapper = styled.div.attrs({
	className: 'noPrint'
})`

 @media print {
				&.noPrint {
					display: none;
				}
    }


display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
background-color: #f3f3f3;
padding: 1.5em 0;
height: 70px;
`

export const CloseIcon = styled(FaTimes)`
	color: #000;
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