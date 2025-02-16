import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Container, Nav, Spinner } from 'react-bootstrap';
import { getPortalUrl } from '../../config/stripePayement';
import { app, auth } from '../../config/firebase';
import { useUser } from '../../contexts/UserContext';
import LanguageSelector from '../LanguageSelector';
import { useTheme } from '../../contexts/ThemeContext';
import { BsBoxArrowRight } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../contexts/ModalContext';

const HomeUpRight: React.FC = () => {
    const { user, isPremium } = useUser();
    const { theme } = useTheme();
    const { showLoginModal, setShowLoginModal } = useModal();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);


    const manageSubscription = async () => {
        setLoading(true)
        const portalUrl = await getPortalUrl(app);
        window.location.href = portalUrl;
        setLoading(false)
    }

    const logout = () => {
        auth.signOut();
    }

    const handleLogin = () => {
        setShowLoginModal(true);
    }

    return (
        <div className="position-absolute z-150" style={{ right: '80px', top: '60px', width: '350px', zIndex: 1}}>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`shadow-lg rounded-3 p-4 bg-${theme === 'light' ? 'white' : 'dark'}`}
                    style={{ border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#4a4a4a'}` }}
                >
                    <Container className="d-flex flex-column align-items-center justify-content-center">
                        {user ? (
                            <div className="d-flex align-items-center mb-4 w-100 gap-2">
                                {user.photoURL && (
                                    <img src={user.photoURL} alt="User" width="50" height="50" className="rounded-circle mr-3" />
                                )}
                                <div className="flex-grow-1">
                                    <h3 className={`mb-0 font-weight-bold text-${theme === 'light' ? 'dark' : 'light'}`}>
                                        {user.displayName || t('HomeUpRight.User')}
                                    </h3>
                                    {isPremium && (
                                        <small className="text-warning">{t('HomeUpRight.Premium Member')}</small>
                                    )}
                                </div>
                                {isPremium && (
                                    <Button variant="outline-warning" size="sm" onClick={manageSubscription}>
                                        {t('HomeUpRight.Manage')}
                                        {loading && (
                                            <div className="text-center mt-3">
                                                <Spinner animation="border" role="status">
                                                    <span className="visually-hidden">{t('Loading...')}</span>
                                                </Spinner>
                                            </div>
                                        )}
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                             {/* <Button variant="primary" href="#login" className="mb-4 w-100" onClick={handleLogin}>{t('HomeUpRight.Login')}</Button> */}
                            </>
                        )}

                        <Container className="d-flex justify-content-between w-100">
                            <LanguageSelector />

                            {user && (
                                <Button variant="danger" onClick={logout}>
                                    <BsBoxArrowRight className="mr-2" />
                                </Button>
                            )}
                        </Container>
                        <Nav.Link href="/privacypolicy" className="mt-3 font-medium text-gray-600 hover:text-blue-600">{t('navbar.privacyPolicy')}</Nav.Link>
                        <Nav.Link href="/deleteuserinfo" className="font-medium text-gray-600 hover:text-blue-600">{t('navbar.deleteuserinfo')}</Nav.Link>
                    </Container>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default HomeUpRight;