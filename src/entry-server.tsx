/**
 * Server-side render for prerendering routes.
 * Uses dynamic CJS-compatible imports to workaround ESM/CJS interop issues with react-helmet-async.
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Routes, Route } from 'react-router-dom';

// i18n for server-side rendering
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

// React Helmet Async - dynamically loaded to avoid CJS/ESM interop issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let HelmetProvider: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Helmet: any;

export async function initHelmet() {
  const helmetPkg = await import('react-helmet-async');
  // CJS modules export named exports directly; in ESM they're on default
  HelmetProvider = helmetPkg.HelmetProvider || helmetPkg.default?.HelmetProvider;
  Helmet = helmetPkg.Helmet || helmetPkg.default?.Helmet;
  return { HelmetProvider, Helmet };
}

// Direct imports for SSR (no lazy — must be synchronous for renderToString)
import Index from './pages/Index';
import CrewPlan from './pages/CrewPlan';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';

// Solutions pages
import TexasMechanicsLien from './pages/solutions/TexasMechanicsLien';
import ConstructiveAcceleration from './pages/solutions/ConstructiveAcceleration';
import GoldenThread from './pages/solutions/GoldenThread';
import FightUnfairDeductions from './pages/solutions/FightUnfairDeductions';
import PhasePaymentDisputes from './pages/solutions/PhasePaymentDisputes';
import ElectricalInventoryTracking from './pages/solutions/ElectricalInventoryTracking';
import SmallElectricalBusinessSoftware from './pages/solutions/SmallElectricalBusinessSoftware';

// Blog posts
import TexasLienLaw2025 from './pages/blog/TexasLienLaw2025';

// Comparison pages
import RakenComparison from './pages/RakenComparison';
import FieldwireComparison from './pages/FieldwireComparison';
import ComparisonPage from './pages/ComparisonPage';
import ComparisonsHub from './pages/ComparisonsHub';

// How-to guides
import HowToPage from './pages/HowToPage';
import HowToHub from './pages/HowToHub';

// Trade vertical pages
import TradePage from './pages/TradePage';
import TradesHub from './pages/TradesHub';

// Standalone
import BetaSignup from './pages/BetaSignup';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

interface RenderResult {
  html: string;
  head: string;
}

export async function render(url: string): Promise<RenderResult> {
  if (!HelmetProvider) {
    await initHelmet();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const helmetContext: Record<string, any> = {};
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnMount: false,
      },
    },
  });

  const html = renderToString(
    <I18nextProvider i18n={i18n}>
      <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <StaticRouter location={url}>
            <div className="pb-24 md:pb-0">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/crew-plan" element={<CrewPlan />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/blog/texas-lien-law" element={<TexasLienLaw2025 />} />
                <Route path="/blog/texas-property-code-chapter-53-guide-2025" element={<TexasLienLaw2025 />} />
                <Route path="/solutions/texas-mechanics-lien-compliance" element={<TexasMechanicsLien />} />
                <Route path="/solutions/texas-lien-law" element={<TexasMechanicsLien />} />
                <Route path="/solutions/constructive-acceleration-defense" element={<ConstructiveAcceleration />} />
                <Route path="/solutions/building-safety-act-golden-thread" element={<GoldenThread />} />
                <Route path="/solutions/uk-golden-thread" element={<GoldenThread />} />
                <Route path="/solutions/fight-unfair-gc-deductions" element={<FightUnfairDeductions />} />
                <Route path="/solutions/phase-payment-disputes" element={<PhasePaymentDisputes />} />
                <Route path="/solutions/electrical-inventory-tracking" element={<ElectricalInventoryTracking />} />
                <Route path="/solutions/small-electrical-business-software" element={<SmallElectricalBusinessSoftware />} />
                <Route path="/raken-vs-voice-log-pro" element={<RakenComparison />} />
                <Route path="/fieldwire-vs-voice-log-pro" element={<FieldwireComparison />} />
                <Route path="/compare" element={<ComparisonsHub />} />
                <Route path="/procore-vs-voice-log-pro" element={<ComparisonPage />} />
                <Route path="/buildertrend-vs-voice-log-pro" element={<ComparisonPage />} />
                <Route path="/contractor-foreman-vs-voice-log-pro" element={<ComparisonPage />} />
                <Route path="/jobnimbus-vs-voice-log-pro" element={<ComparisonPage />} />
                <Route path="/knowify-vs-voice-log-pro" element={<ComparisonPage />} />
                <Route path="/how-to" element={<HowToHub />} />
                <Route path="/how-to/:slug" element={<HowToPage />} />
                <Route path="/for" element={<TradesHub />} />
                <Route path="/for/:slug" element={<TradePage />} />
                <Route path="/beta" element={<BetaSignup />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </StaticRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
    </I18nextProvider>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const helmet = helmetContext.helmet as any;

  const head = helmet
    ? [
        helmet.title?.toString() || '',
        helmet.meta?.toString() || '',
        helmet.link?.toString() || '',
        helmet.script?.toString() || '',
      ].filter(Boolean).join('\n')
    : '';

  return { html, head };
}
