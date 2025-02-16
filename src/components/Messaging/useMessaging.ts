import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useModal } from '../../contexts/ModalContext';
import { Message } from './types';
import { useTranslation } from 'react-i18next';
import OpenAI from 'openai';

const useMessaging = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageCount, setMessageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { setShowRegisterModal, setShowPaymentModal } = useModal();
    const { user, isPremium } = useUser();
    const { t } = useTranslation();

    const numberOfFreeMessages = 999;

    const client = new OpenAI({
        baseURL: 'URL',
        apiKey: 'dummy-key',
        dangerouslyAllowBrowser: true,
    });

    const systemPrompt = {
        role: 'system',
        content: t('useMessaging.systemPrompt'),
    };

    useEffect(() => {
        const storedMessageCount = localStorage.getItem('messageCount');
        if (storedMessageCount) {
            setMessageCount(parseInt(storedMessageCount, 10));
        }
    }, []);

    type ChatCompletionMessage = {
        role: 'system' | 'user' | 'assistant';
        content: string;
        name?: string;
    };
    
    const sendMessage = async (content: string) => {
        if (messageCount >= numberOfFreeMessages && !user) {
            setShowRegisterModal(true);
            return;
        }
        if (messageCount >= numberOfFreeMessages && !isPremium) {
            setShowPaymentModal(true);
            return;
        }
    
        setIsLoading(true);
    
        // Add user message
        const newUserMessage = {
            content,
            timestamp: new Date().toISOString(),
            isUser: true,
        };
        setMessages((prev) => [...prev, newUserMessage]);
    
        // Prepare the last 5 messages for the API
        const lastMessages = [...messages.slice(-4), newUserMessage].map((msg) => ({
            content: msg.content,
            role: msg.isUser ? 'user' as const : 'assistant' as const, // Ensure literal type
        }));
    
        const messagesForAPI: ChatCompletionMessage[] = [
            {
                role: 'system',
                content: systemPrompt.content,
            },
            ...lastMessages,
        ];
    
        try {
            // AI Streaming response
            const response = await client.chat.completions.create({
                model: 'dummy-model',
                messages: messagesForAPI,
                stream: true, // Ensures streaming
            });
    
            let aiResponse = '';
            for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content || '';
                aiResponse += content;
                setCurrentMessage((prev) => prev + content); // Update incrementally
            }
    
            // Finalize the AI message
            setMessages((prev) => [
                ...prev,
                { content: aiResponse.trim(), timestamp: new Date().toISOString(), isUser: false },
            ]);
            setCurrentMessage('');
        } catch (error) {
            console.error('Error during message processing:', error);
        } finally {
            setIsLoading(false);
            setMessageCount((prev) => prev + 1);
            localStorage.setItem('messageCount', (messageCount + 1).toString());
        }
    };
    

    return {
        messages,
        currentMessage,
        isLoading,
        sendMessage,
    };
};

export default useMessaging;

































// WHEN USING FIREBASE FUNCTIONS

// import { useState, useEffect, useRef } from 'react';
// import { useUser } from '../../contexts/UserContext';
// import { useModal } from '../../contexts/ModalContext';
// import { Message } from './types';
// import { useTranslation } from 'react-i18next';
// import OpenAI from 'openai';

// const useMessaging = () => {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [currentMessage, setCurrentMessage] = useState('');
//     const [messageCount, setMessageCount] = useState(0);
//     const [isLoading, setIsLoading] = useState(false);
//     const { setShowRegisterModal, setShowPaymentModal } = useModal();
//     const { user, isPremium } = useUser();
//     const { t } = useTranslation();

//     const numberOfFreeMessages = 10;

//     const client = new OpenAI({baseURL:'https://groq.volko.org/v1/chat/completions', apiKey:'dummy-key', dangerouslyAllowBrowser: true});

//     const systemPrompt = {
//         role: "system",
//         content: t('useMessaging.systemPrompt')
//     };

//     useEffect(() => {
//         const storedMessageCount = localStorage.getItem('messageCount');
//         if (storedMessageCount) {
//             setMessageCount(parseInt(storedMessageCount, 10));
//         }
//     }, []);

//     const sendMessage = async (content: string) => {
//         if (messageCount >= numberOfFreeMessages && !user) {
//             setShowRegisterModal(true);
//             return;
//         }
//         if (messageCount >= numberOfFreeMessages && !isPremium) {
//             setShowPaymentModal(true);
//             return;
//         }

//         setIsLoading(true);
//         // Add user message
//         const newUserMessage = { content, timestamp: new Date().toISOString(), isUser: true };
//         setMessages(prev => [...prev, newUserMessage]);

//         // Get the last 5 messages (including the new one)
//         const lastMessages = [...messages.slice(-4), newUserMessage].map(msg => ({
//             content: msg.content,
//             role: msg.isUser ? "user" : "assistant",
//         }));

//         // Prepare the messages array with the system prompt
//         const messagesForAPI = [
//             systemPrompt,
//             ...lastMessages
//         ];

//         console.log('Sending message:', messagesForAPI)

//         // Start streaming AI response
//         // const response = await fetch('https://stream-llm-response-eoodnycn6a-uc.a.run.app/stream_llm_response', {
//         //     method: 'POST',
//         //     headers: { 'Content-Type': 'application/json' },
//         //     body: JSON.stringify({
//         //         message: messagesForAPI,
//         //         user: user ? user.uid : 'trial',
//         //         trial: !user,
//         //         max_tokens: 8191,
//         //     }),
//         // });
//         const stream = await client.chat.completions.create({
//             model: 'dummy-model',
//             messages: [{ role: 'user', content: 'Say this is a test' }],
//             stream: true,
//           });
//           for await (const chunk of stream) {
//             process.stdout.write(chunk.choices[0]?.delta?.content || '');
//           }
//         const response = await fetch('https://groq.volko.org/v1/chat/completions', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 message: messagesForAPI,
//                 // stream: true
//             }),
//         });

//         const reader = response.body!.getReader();
//         const decoder = new TextDecoder();
//         let aiResponse = '';

//         while (true) {
//             const { value, done } = await reader.read();
//             if (done) break;

//             const chunk = decoder.decode(value);
//             console.log('Received chunk:', chunk)
//             // Remove the "data: " prefix
//             const jsonString = chunk.replace(/^data: /, '');

//             try {
//                 const data = JSON.parse(jsonString);
//                 console.log("Parsed data:", data);
//                 if (data.content && data.content.trim() !== '') {
//                     aiResponse = data.content;  // Just set it, don't concatenate
//                     setCurrentMessage(aiResponse);
//                 }
//             } catch (error) {
//                 console.error("Error parsing JSON:", error);
//             }

//         }

//         // Add complete AI message
//         setMessages(prev => [...prev, { content: aiResponse.trim(), timestamp: new Date().toISOString(), isUser: false }]);
//         setCurrentMessage('');
//         console.log('Raw AI response:', aiResponse);
//         setIsLoading(false);
//         setMessageCount(prev => prev + 1);
//         localStorage.setItem('messageCount', (messageCount + 1).toString());
//     };

//     return {
//         messages,
//         currentMessage,
//         isLoading,
//         sendMessage,
//     };
// };

// export default useMessaging;
