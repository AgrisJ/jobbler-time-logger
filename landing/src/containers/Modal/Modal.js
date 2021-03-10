import React from 'react';
import ReactModal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';

const Modal = (props) => {
    function closeModal() {
        props.onCloseModal();
    }

    return (
        <>
            {props.open ?
                <div className="modal-bg">
                    <ReactModal.Dialog size="xl">
                        <ReactModal.Header closeButton onClick={() => closeModal()}>
                            <ReactModal.Title>{props.title}</ReactModal.Title>
                        </ReactModal.Header>

                        <ReactModal.Body>
                            <>
                                {props.image ?
                                        <>
                                            <Image src={props.imageSrc} className="modal-image" onClick={() => closeModal()} fluid />
                                            <p className="modal-text">{props.content}</p>
                                        </>
                                    :
                                        props.content
                                }
                            </>
                        </ReactModal.Body>
                    </ReactModal.Dialog>
                </div>
            :
                ""
            }
        </>
    );
}

export default Modal;