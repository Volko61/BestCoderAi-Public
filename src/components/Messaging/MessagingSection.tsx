import { Container } from 'react-bootstrap';
import useMessaging from './useMessaging';
import MessageList from './MessageList';
import MessageFormContainer from './MessageFormContainer';
import ModalManager from '../Modals/ModalManager';

function MessagingSection() {
    const {
        messages,
        currentMessage,
        isLoading,
        sendMessage,
    } = useMessaging();

    return (
        <Container className="d-flex flex-column">
            <MessageList
                messages={messages}
                currentMessage={currentMessage}
                isLoading={isLoading}
            />
            <MessageFormContainer onSubmit={sendMessage} disabled={isLoading} />
            <ModalManager />
        </Container>
    );
}

export default MessagingSection;
