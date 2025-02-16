import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
    return (
        <footer className="bg-light text-center text-lg-start">
            <Container className="p-4">
                <p>© 2023 My App. All rights reserved.</p>
            </Container>
        </footer>
    );
};

export default Footer;