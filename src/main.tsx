import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// import i18n (needs to be bundled ;))
import './config/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);