import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Container } from 'react-bootstrap';
import { 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    FacebookAuthProvider, 
    TwitterAuthProvider 
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider, twitterProvider } from '../../config/firebase';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../contexts/ModalContext';

interface RegisterModalProps {
    show: boolean;
    onHide: () => void;
    switchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
    show,
    onHide,
    switchToLogin
}) => {
    const { t } = useTranslation();
    const [authError, setAuthError] = useState('');
    const { showRegisterModal, setShowRegisterModal, setShowPaymentModal } = useModal();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => setShowRegisterModal(false);

    const switchToPayment = () => {
        handleClose();
    };

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            switchToPayment();
        } catch (error: any) {
            setAuthError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            switchToPayment();
        } catch (error: any) {
            setAuthError(error.message);
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            await signInWithPopup(auth, facebookProvider);
            switchToPayment();
        } catch (error: any) {
            setAuthError(error.message);
        }
    };

    const handleTwitterSignIn = async () => {
        try {
            await signInWithPopup(auth, twitterProvider);
            switchToPayment();
        } catch (error: any) {
            setAuthError(error.message);
        }
    };

    return (
        <Modal show={showRegisterModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t('RegisterModal.Register')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {authError && <Alert variant="danger">{authError}</Alert>}
                <Form onSubmit={(e) => e.preventDefault()}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t('RegisterModal.Email address')}</Form.Label>
                        <Form.Control type="email" placeholder={t('RegisterModal.Enter email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>{t('RegisterModal.Password')}</Form.Label>
                        <Form.Control type="password" placeholder={t('RegisterModal.Password')} value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button className='w-100 mt-3' variant="primary" onClick={handleRegister}>
                        {t('RegisterModal.Register via Email')}
                    </Button>
                    <div className="d-flex justify-content-center my-3">
                        <Button variant="danger" onClick={handleGoogleSignIn} className="mx-2 d-flex align-items-center">
                            <i className="bi bi-google me-2"></i> {t('RegisterModal.Sign up with Google')}
                        </Button>
                        <Button variant="primary" onClick={handleFacebookSignIn} className="mx-2 d-flex align-items-center">
                            <i className="bi bi-facebook me-2"></i> {t('RegisterModal.Sign up with Facebook')}
                        </Button>
                        <Button variant="info" onClick={handleTwitterSignIn} className="mx-2 d-flex align-items-center">
                            <i className="bi bi-twitter me-2"></i> {t('RegisterModal.Sign up with Twitter')}
                        </Button>
                    </div>
                </Form>
                <Button variant="link" onClick={switchToLogin}>{t('RegisterModal.Already have an account? Login here.')}</Button>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterModal;