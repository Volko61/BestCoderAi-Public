// src/components/Modals/PaymentModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useModal } from '../../contexts/ModalContext';
import { getCheckoutUrl } from '../../config/stripePayement';
import { app } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PaymentModal: React.FC = () => {
    const { showPaymentModal, setShowPaymentModal } = useModal();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation()


    const handleClose = () => setShowPaymentModal(false);

    const upgradeToPremium = async () => {
        setLoading(true)
        const priceId = 'price_1Pb2qK2L3CUWCWJsByX2RYkK';
        const checkoutUrl = await getCheckoutUrl(app, priceId);
        window.location.href = checkoutUrl;
        console.log("Upgraded to premium");
        setLoading(false)
    }

    return (
        <Modal show={showPaymentModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t('PayementModal.Payment')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {t('PayementModal.You need to pay to use the app.')}
                {error && <p className="text-danger">{error}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('PayementModal.Close')}
                </Button>
                <Button variant="primary" onClick={upgradeToPremium} className='d-flex flex-row align-items-center'>
                    {loading ? (
                        <div className="text-center mt-3">
                            <Spinner animation="border" role="status">
                                {/* <span className="visually-hidden">{t('Loading...')}</span> */}
                            </Spinner>
                        </div>
                    ):(
                        <div className='mr-3'>{t('PayementModal.Pay')}</div>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentModal;