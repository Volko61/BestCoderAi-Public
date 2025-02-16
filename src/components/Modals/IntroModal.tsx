import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface IntroModalProps {
    show: boolean;
    onHide: () => void;
    onDoNotShowAgain: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ show, onHide, onDoNotShowAgain }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Welcome to BestCoderAi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    BestCoderAi is a chatbot like ChatGPT but specialized for coding. It's perfect for beginners to learn how to code, for medium programmers to learn a new language or be more productive, for expert programmers to delegate tasks to save time and energy. It's also perfect for those who don't like to code to focus on their favorite activity.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={onDoNotShowAgain}>
                    Do not show again
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default IntroModal;
