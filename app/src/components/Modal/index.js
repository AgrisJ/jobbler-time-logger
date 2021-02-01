import React from 'react'
import { ButtonWrap, ModalButton, ModalWrap, ModalText, ModalSubText, TextHighlight, ModalContainer, ModalBox } from './ModalElements';

function Modal({ showModal, actionActivated, highlightedText, modalText, modalSubText, cancelModal }) {

	const clickableFunction = actionActivated();

	return (
		<ModalBox showModal={showModal}>
			<ModalContainer>
				<ModalWrap>
					<ModalText><TextHighlight>{highlightedText} </TextHighlight>{modalText}</ModalText>
					<ModalSubText>{modalSubText}</ModalSubText>
					<ButtonWrap>
						<ModalButton onClick={() => clickableFunction(showModal)}>Yes</ModalButton>
						<ModalButton onClick={() => cancelModal()}>No</ModalButton>
					</ButtonWrap>
				</ModalWrap>
			</ModalContainer>
		</ModalBox>
	)
}

export default Modal
