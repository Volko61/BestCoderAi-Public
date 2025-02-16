import { useModal } from '../../contexts/ModalContext';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import PaymentModal from '../Modals/PaymentModal';

function ModalManager() {
    const { setShowRegisterModal, setShowLoginModal, showRegisterModal, showLoginModal } = useModal();

    const switchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const switchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    return (
        <>
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
            <PaymentModal />
        </>
    );
}

export default ModalManager;
