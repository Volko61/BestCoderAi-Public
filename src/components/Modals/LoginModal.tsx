import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, twitterProvider } from '../../config/firebase';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../contexts/ModalContext';

interface LoginModalProps {
    show: boolean;
    onHide: () => void;
    switchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
    show,
    onHide,
    switchToRegister
}) => {
    const { t } = useTranslation();
    const [authError, setAuthError] = useState('');
    const { showLoginModal, setShowLoginModal } = useModal();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => setShowLoginModal(false);

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            handleClose();
        } catch (error: any) {
            setAuthError(error.message);
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            await signInWithPopup(auth, facebookProvider);
            handleClose();
        } catch (error: any) {
            setAuthError(error.message);
        }
    };

    const handleTwitterSignIn = async () => {
        try {
            await signInWithPopup(auth, twitterProvider);
            handleClose();
        } catch (error: any) {
            setAuthError(error.message);
        }
    };

    const handleLogin = async () => {
        try {
            console.log("hi", email, password)
            await signInWithEmailAndPassword(auth, email, password);
            handleClose();
        } catch (error: any) {
            setAuthError(error.message);
        }
    };

    return (
        <Modal show={showLoginModal} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">{t('Login')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex flex-column align-items-center">
                {error && <Alert variant="danger">{t(error)}</Alert>}
                {authError && <Alert variant="danger">{t(authError)}</Alert>}
                <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="w-100">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t('LoginModal.Email address')}</Form.Label>
                        <Form.Control type="email" placeholder={t('LoginModal.Enter email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>{t('LoginModal.Password')}</Form.Label>
                        <Form.Control type="password" placeholder={t('LoginModal.Password')} value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mt-3">
                        {t('LoginModal.Login')}
                    </Button>
                </Form>
                <div className="d-flex justify-content-center mt-3">
                    <Button variant="danger" onClick={handleGoogleSignIn} className="mx-2 d-flex align-items-center">
                        <i className="bi bi-google me-2"></i> {t('LoginModal.Login with Google')}
                    </Button>
                    <Button variant="primary" onClick={handleFacebookSignIn} className="mx-2 d-flex align-items-center">
                        <i className="bi bi-facebook me-2"></i> {t('LoginModal.Login with Facebook')}
                    </Button>
                    <Button variant="info" onClick={handleTwitterSignIn} className="mx-2 d-flex align-items-center">
                        <i className="bi bi-twitter me-2"></i> {t('LoginModal.Login with Twitter')}
                    </Button>
                </div>
                <Button variant="link" onClick={switchToRegister} className="mt-3">
                    {t("LoginModal.Don't have an account? Register here.")}
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;