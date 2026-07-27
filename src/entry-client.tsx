import { hydrateRoot, createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './i18n';
import App from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

// Check if there's prerendered content to hydrate
const hasPrerenderedContent = container.innerHTML.trim().length > 0;

const app = (
  <HelmetProvider>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </HelmetProvider>
);

if (hasPrerenderedContent) {
  // Hydrate prerendered HTML
  hydrateRoot(container, app);
} else {
  // Fallback to client-side render for non-prerendered routes
  createRoot(container).render(app);
}
