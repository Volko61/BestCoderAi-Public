import React, { useState } from 'react';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { XCircleFill } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

interface MessageFormProps {
    onSubmit: (message: string) => void;
    disabled?: boolean;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSubmit, disabled }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            setLoading(true);
            await onSubmit(message);
            setLoading(false);
            setMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setMessage(suggestion);
    };

    const codeSuggestions = [
        "Create a for loop in C",
        "Make a snake game in python",
        "Learn me data-structures in Java",
        "I want to create an app"
    ];

    return (
        <Form onSubmit={handleSubmit} className='d-flex flex-column flex-grow-1'>
            <div className="suggestion-buttons d-flex mb-2 flex-grow-1 justify-content-stretch gap-3">
                {codeSuggestions.map((suggestion, index) => (
                    <Button
                        key={index}
                        variant="outline-secondary"
                        className="mr-2 flex-fill "
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        {suggestion}
                    </Button>
                ))}
            </div>
            <InputGroup>
                <Form.Control
                    as="textarea"
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("MessageForm.Type your message here...")}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <Button variant="outline-secondary" onClick={() => setMessage('')}>
                    <XCircleFill />
                </Button>
                <Button type="submit" disabled={loading || disabled}>
                    {loading ? <Spinner animation="border" size="sm" /> : t("MessageForm.Send")}
                </Button>
            </InputGroup>
        </Form>
    );
};

export default MessageForm;
