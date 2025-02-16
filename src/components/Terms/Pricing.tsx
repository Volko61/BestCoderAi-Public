import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Image } from 'react-bootstrap';
import { useModal } from '../../contexts/ModalContext';
import PaymentModal from '../Modals/PaymentModal';
import { useUser } from '../../contexts/UserContext';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';

const Pricing: React.FC = () => {
    const { showPaymentModal, showLoginModal, showRegisterModal,setShowPaymentModal, setShowLoginModal, setShowRegisterModal } = useModal()
    const { user, isPremium } = useUser();

    const switchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const switchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const handleSignUpPremium = () => {
        if (!user) {
            setShowLoginModal(true)
        } else {
            if (isPremium) { return alert('You are already a premium member!') }
            else {
                setShowPaymentModal(true)
            }
        }
    }
    const cardStyles = {
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    };

    const cardTitleStyles = {
        fontFamily: 'Roboto, sans-serif',
        marginBottom: '20px'
    };

    const cardTextStyles = {
        fontFamily: 'Roboto, sans-serif',
        color: '#6c757d'
    };

    const buttonStyles = {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        transition: 'background-color 0.3s ease',
        fontSize: '18px',
        padding: '10px 20px',
        borderRadius: '10px'
    };

    const buttonHoverStyles = {
        backgroundColor: '#0056b3'
    };

    const listItemStyles = {
        fontSize: '1.1rem',
        marginBottom: '10px'
    };

    return (
        <>
            <Container fluid className="py-5">
                <Row className="justify-content-center">
                    <Col md={10} lg={8} xl={6}>
                        <Card style={cardStyles} className="shadow-lg border-0 rounded-lg">
                            <CardBody className="px-5 py-4">
                                <CardTitle as="h1" className="text-center mb-4" style={cardTitleStyles}>
                                    <Image src={'/premiumLogo.png'} alt="BestCoderAi" width={100} height={100} className="mr-2 d-inline-block" />
                                    BestCoderAi Pricing
                                </CardTitle>
                                <CardText as="h2" className="text-center mb-5" style={cardTextStyles}>
                                    Unlock the Power of AI with our Premium Plan
                                </CardText>
                                <Row className="justify-content-center">
                                    <Col sm={8} md={6} xl={5}>
                                        <Card className="mb-4 border-0 shadow-sm">
                                            <CardBody className="text-center">
                                                <CardTitle as="h3" className="mb-3">Premium Plan</CardTitle>
                                                <CardText style={cardTextStyles}>
                                                    <h4 className="text-primary">€15/month</h4>
                                                    <p>Almost unlimited* access to the AI (up to 10,000,000 tokens)</p>
                                                </CardText>
                                                <Button
                                                    variant="primary"
                                                    size="lg"
                                                    style={buttonStyles}
                                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyles.backgroundColor)}
                                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyles.backgroundColor)}
                                                    onClick={handleSignUpPremium}
                                                >
                                                    Sign up for Premium
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <CardText as="p" className="text-muted mt-4">
                                    *Fair use policy applies. See our Privacy Policy for details.
                                </CardText>
                                <CardText as="h4" className="mt-5" style={cardTextStyles}>
                                    What You Get with Premium:
                                </CardText>
                                <ul className="list-unstyled mb-4">
                                    <li style={listItemStyles}>
                                        <i className="fas fa-lock text-primary" /> Unrestricted access to AI models
                                    </li>
                                    <li style={listItemStyles}>
                                        <i className="fas fa-file-alt text-primary" /> Up to 10,000,000 tokens per month
                                    </li>
                                    <li style={listItemStyles}>
                                        <i className="fas fa-book text-primary" /> Priority support
                                    </li>
                                </ul>
                                <CardText as="p" className="text-muted mt-4">
                                    By signing up for Premium, you agree to our Terms of Service and Privacy Policy.
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {(showPaymentModal && user) && (<PaymentModal />)}

            <RegisterModal
                show={showRegisterModal}
                onHide={() => setShowRegisterModal(false)}
                switchToLogin={switchToLogin}
            />
            <LoginModal
                show={showLoginModal}
                onHide={() => setShowLoginModal(false)}
                switchToRegister={switchToRegister}
            />

        </>
    );
};

export default Pricing;
