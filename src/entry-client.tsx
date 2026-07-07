import { hydrateRoot, createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './i18n';
import App from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

// Check if there's prerendered content to hydrate
const hasPrerenderedContent = container.innerHTML.trim().length > 0;

if (hasPrerenderedContent) {
  // Hydrate prerendered HTML
  hydrateRoot(
    container,
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
} else {
  // Fallback to client-side render for non-prerendered routes
  createRoot(container).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
