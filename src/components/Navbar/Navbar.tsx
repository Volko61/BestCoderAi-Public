import React, { useState } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import HomeUpRight from '../Pannels/HomeUpRight';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { BsMoon, BsSun } from 'react-icons/bs';

const CustomNavbar: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const { t } = useTranslation();

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  const { theme, toggleTheme } = useTheme();
  const { user, isPremium } = useUser();

  return (
    <>
      <Navbar expand="lg" variant={theme} className={`bg-${theme} shadow-md py-3`}>
        <Container className="px-4 md:px-8">
          <Navbar.Brand href="#home" className="text-xl font-bold text-gray-800">
            <Nav.Link href="/">
              <img
                src="/BestCoderAi.svg"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt={t('navbar.logoAlt')}
              />{' '}
              {t('navbar.brandName')}</Nav.Link>
          </Navbar.Brand>          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto space-x-4">
              {/* <Nav.Link href="/pricing" className="font-medium text-gray-600 hover:text-blue-600">{t('navbar.pricing')}</Nav.Link> */}
            </Nav>
            <button
              onClick={togglePanel}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-l-lg focus:outline-none"
              aria-label={t('navbar.togglePanel')}
            >
              {isPanelOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
            </button>
            <Button
              onClick={toggleTheme}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white me-3"
              aria-label={t('navbar.toggleTheme')}
            >
              {theme === 'light' ? (
                <BsMoon size={18} className="mr-2" />
              ) : (
                <BsSun size={18} className="mr-2" />
              )}
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {isPanelOpen && <HomeUpRight />}
    </>
  );
};

export default CustomNavbar;

