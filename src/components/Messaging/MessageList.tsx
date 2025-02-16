import React, { useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MessageRenderer from './MessageRenderer';
import { Message } from './types';

interface MessageListProps {
    messages: Message[];
    currentMessage: string;
    isLoading: boolean;
}

function MessageList({ messages, currentMessage, isLoading }: MessageListProps) {
    const { t } = useTranslation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLoading) {
            scrollToBottom();
        } else {
            scrollToBottom();
        }
    }, [messages, isLoading]);

    useEffect(() => {
        console.log(currentMessage)
    }, [currentMessage])

    useEffect(() => {
        if (currentMessage) {
            scrollToBottom();
        }
    }, [currentMessage]); useEffect(() => {
        if (currentMessage) {
            scrollToBottom();
        }
    }, [currentMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Container className="d-flex flex-grow-1 mb-3" style={{ height: 'calc(100vh - 300px)' }}>
            <Container className="d-flex flex-column justify-content-end" style={{ overflowY: 'auto', maxHeight: '100%' }}>
                <div className="overflow-auto" style={{
                    scrollbarWidth: 'none',
                    ['&::WebkitScrollbar' as any]: { width: 0, height: 0 }
                }}>
                    {messages.map((msg, index) => (
                        <MessageRenderer key={index} {...msg} />
                    ))}
                    {currentMessage && (
                        <MessageRenderer content={currentMessage} timestamp={new Date().toISOString()} isUser={false} />
                    )}
                    {isLoading && (
                        <div className="text-center mt-3">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">{t('Loading...')}</span>
                            </Spinner>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </Container>
        </Container>
    );
}

export default MessageList;
