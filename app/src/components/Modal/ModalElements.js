import styled from 'styled-components/macro';

export const ModalButton = styled.button`
	//button
	border-color: #dbdbdb;
	border: solid;
	border-width: 1px;
	cursor: pointer;
	justify-content: center;
	text-align: center;
	white-space: nowrap;
	
	padding: 1.3rem 1.8rem;
	margin: 0 1rem;
	color: white;
	font-size: 1.2rem;
	background-color: transparent;
	font-family: Expletus Sans;

	//is-rounded
	border-radius: 500px;

	&:active {
		border-color: #4a4a4a;
	}

    align-items: center;
    box-shadow: none;
    display: inline-flex;
    height: 2.5em;
    line-height: 1.5;
		position: relative;
    vertical-align: top;

`

export const ButtonWrap = styled.div`
	//mt-4
	margin-top: 1rem;

	//is-justify-content-center
	justify-content: center;

	//is-flex
	display: flex;	
`
export const ModalText = styled.p`
	font-size: 0.7em;
	color: white;
	font-family: Expletus Sans;
	text-transform: uppercase;
`
export const ModalSubText = styled.p`
	font-size: 0.4em;
	color: white;
	font-family: Expletus Sans;
	font-weight: normal;
	margin-top: 0.4rem;
	/* text-transform: uppercase; */
`
export const TextHighlight = styled.span`
	color: rgb(255 212 56);
`
export const ModalWrap = styled.div`
	width: 60rem;
	padding: 4rem 2rem;
	border-radius: 0.8rem;
	position: relative;
	overflow: hidden;
	color: rgb(255, 179, 40);
	background: linear-gradient(rgb(187 187 187 / 91%) 29.99%,rgb(80 80 80) 100%);
`
export const ModalContainer = styled.div`
	  display: flex;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    font-family: Expletus Sans;
    text-align: center;
    font-weight: bold;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000000;
`
export const ModalBox = styled.div`
    display: ${({ showModal }) => (showModal ? 'flex' : 'none')};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 0px 4rem 2rem;
    background-color: unset;
`


