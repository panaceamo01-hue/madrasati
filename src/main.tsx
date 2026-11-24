import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './kid-theme.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* إن تعذّر التسجيل يبقى التطبيق صالحًا على الشبكة. */
    });
  });
}
