import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './kid-theme.css';
import { App } from './App';
import { initSwUpdate } from './lib/swUpdate';
import { initPwaInstall } from './lib/pwaInstall';

initPwaInstall();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => initSwUpdate(registration))
      .catch(() => {
        /* إن تعذّر التسجيل يبقى التطبيق صالحًا على الشبكة. */
      });
  });
}
