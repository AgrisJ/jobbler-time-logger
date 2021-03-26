import React from 'react'
import { ButtonWrap, ModalButton, ModalWrap, ModalText, ModalSubText, TextHighlight, ModalContainer, ModalBox } from './ModalElements';
import { languageData } from './../../languages/language_variables';
import { getlanguage } from './../../Store/slices/language';
import { connect } from 'react-redux';

function Modal({ showModal, actionActivated, highlightedText, modalText, modalSubText, cancelModal, language }) {

	const clickableFunction = actionActivated();

	const {
		_YES,
		_NO
	} = languageData.COMPONENTS.Modal;

	return (
		<ModalBox showModal={showModal}>
			<ModalContainer>
				<ModalWrap>
					<ModalText><TextHighlight>{highlightedText} </TextHighlight>{modalText}</ModalText>
					<ModalSubText>{modalSubText}</ModalSubText>
					<ButtonWrap>
						<ModalButton onClick={() => clickableFunction(showModal)}>{_YES[language]}</ModalButton>
						<ModalButton onClick={() => cancelModal()}>{_NO[language]}</ModalButton>
					</ButtonWrap>
				</ModalWrap>
			</ModalContainer>
		</ModalBox>
	)
}

const mapStateToProps = state =>
({
	language: getlanguage(state)
})

// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(Modal);