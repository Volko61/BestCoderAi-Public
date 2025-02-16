// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Home from './components/Home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserProvider from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import CustomNavbar from './components/Navbar/Navbar';
import '../CSS/App_build.css';
import ModalProvider from './contexts/ModalContext';
import PrivacyPolicy from './components/Terms/PrivacyPolicy';
import DeleteUserInfo from './components/Terms/DeleteUserInfo';
import Pricing from './components/Terms/Pricing';
import Features from './components/Terms/Features';
import { analytics } from './config/firebase';
import { logEvent } from 'firebase/analytics';
import PWAPrompt from './components/Toast/PWAPrompt';


const App: React.FC = () => {
    logEvent(analytics, 'page_view');
    return (
        <UserProvider>  
            <ThemeProvider>
                <ModalProvider>
                    <Router>
                        <div className={`h-100`}>
                            <Container className="d-flex flex-column h-100">
                                <CustomNavbar />
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/privacypolicy" element={<PrivacyPolicy />} ></Route>
                                    <Route path="/deleteuserinfo" element={<DeleteUserInfo />} ></Route>
                                    <Route path="/pricing" element={<Pricing />} ></Route>
                                    <Route path="/features" element={<Features />} ></Route>
                                </Routes>
                            </Container>
                        </div>
                    </Router>
                </ModalProvider>
            </ThemeProvider>
        </UserProvider >
    );
};

export default App;
