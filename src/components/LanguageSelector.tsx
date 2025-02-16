import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Globe } from 'react-bootstrap-icons';

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <div className="d-flex align-items-center">
            <Globe className="me-2" />
            <Form.Select onChange={changeLanguage} value={i18n.language} style={{ width: 'auto' }}>
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="fr">Français</option>
            </Form.Select>
        </div>
    );
};

export default LanguageSelector;