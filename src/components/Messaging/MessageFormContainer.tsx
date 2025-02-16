import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MessageForm from './MessageForm';

interface MessageFormContainerProps {
    onSubmit: (content: string) => void;
    disabled: boolean;
}

function MessageFormContainer({ onSubmit, disabled }: MessageFormContainerProps) {
    return (
        <Container className="mb-3">
            <Row className='justify-content-center'>
                <Col xs={12} md={12} lg={10}>
                    <MessageForm onSubmit={onSubmit} disabled={disabled} />
                </Col>
            </Row>
        </Container>
    );
}

export default MessageFormContainer;
