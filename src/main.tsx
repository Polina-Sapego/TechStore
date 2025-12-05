import React from 'react';
import ReactDOM from 'react-dom/client';
import '../assets/styles/tailwinds.css';
import '../assets/styles/index.sass';
import { AppProviders } from './app/Providers.tsx';
import App from './app/App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
