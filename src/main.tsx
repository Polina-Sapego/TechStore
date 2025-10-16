import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.sass';
import HomePage from './components/homePage/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HomePage/>
  </StrictMode>
);
