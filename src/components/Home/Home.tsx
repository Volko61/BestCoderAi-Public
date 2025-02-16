import React, { useState, useEffect } from 'react';
import MessagingSection from '../Messaging/MessagingSection';
import UserProvider from '../../contexts/UserContext';
import PWAPrompt from '../Toast/PWAPrompt';
import IntroModal from '../Modals/IntroModal';

function Home() {
    const [modalShow, setModalShow] = useState(false);
    const [messagingSectionShow, setMessagingSectionShow] = useState(true);
    const [doNotShowAgain, setDoNotShowAgain] = useState(false);

    useEffect(() => {
        const showModal = localStorage.getItem('showIntroModal');
        if (showModal !== 'false') {
            setModalShow(true);
        }
    }, []);

    function isRunningBrowser() {
        return (window.matchMedia('(display-mode: browser)').matches);
    }

    // useEffect(() => {
    //     // Force user to install the App
    //     if (!modalShow) {
    //         if (!isRunningBrowser()) {
    //             setMessagingSectionShow(false);
    //         }
    //     }else{
    //         setMessagingSectionShow(true);
    //     }
    // }, [modalShow]);

    const handleCloseModal = () => setModalShow(false);

    const handleDoNotShowAgain = () => {
        setDoNotShowAgain(true);
        localStorage.setItem('showIntroModal', 'false');
        handleCloseModal();
    };

    return (
        <UserProvider>
            {/* <PWAPrompt /> */}
            {isRunningBrowser() ?  <PWAPrompt/> : <MessagingSection />}
            <IntroModal
                show={modalShow}
                onHide={handleCloseModal}
                onDoNotShowAgain={handleDoNotShowAgain}
            />
        </UserProvider>
    );
}

export default Home;
