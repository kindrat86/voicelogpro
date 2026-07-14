import { hydrateRoot, createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './i18n';
import App from './App';
// PostHog is initialized by the inline snippet in index.html (loads
// https://eu.i.posthog.com/static/array.js). Do NOT also init posthog-js
// here — two instances double-count every pageview.
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
