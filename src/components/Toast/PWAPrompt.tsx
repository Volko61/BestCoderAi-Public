import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { usePWAInstall } from 'react-use-pwa-install'

import myLogo from '/BestCoderAi.svg'

const PWAPrompt: React.FC = () => {
  const { t } = useTranslation();

  const install = usePWAInstall()

  return (
    <>
      {install && (
        <Modal show={true} centered>
          <Modal.Header>
            <Modal.Title>{t('PWAPrompt.Install BestCoderAi App')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {t('PWAPrompt.You have to install this app to use it')}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center w-100">
            <Button
              variant="primary"
              size="lg"
              className="w-50"
              style={{ padding: '12px 20px', fontSize: '18px' }}
              onClick={install}
            >
              {t('PWAPrompt.Install App')}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default PWAPrompt;