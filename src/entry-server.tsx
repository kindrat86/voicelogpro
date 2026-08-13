/**
 * Server-side render for prerendering routes.
 * Uses dynamic CJS-compatible imports to workaround ESM/CJS interop issues with react-helmet-async.
 */
import { Suspense, type ComponentType } from 'react';
import { ROUTES } from './routes';
import NotFound from './pages/NotFound';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Routes, Route } from 'react-router-dom';

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









interface RenderResult {
  html: string;
  head: string;
}

export async function render(url: string): Promise<RenderResult> {
  if (!HelmetProvider) {
    await initHelmet();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // renderToString has no Suspense support: a React.lazy component would
  // render the fallback instead of the page. Await every route module first
  // and hand renderToString concrete components.
  const resolved: Record<string, ComponentType> = {};
  await Promise.all(
    ROUTES.map(async ({ path, load }) => {
      resolved[path] = (await load()).default;
    })
  );

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
              {/* MUST mirror App.tsx, which wraps Routes in this exact Suspense
                  boundary with this exact fallback. renderToString emits
                  <!--$--> / <!--/$--> markers for a Suspense boundary and
                  hydrateRoot looks for them; when the server omitted the
                  boundary the client found none, which failed hydration at
                  <Suspense> and made React discard the whole prerender
                  (#418 -> #423). Keep the two trees in step. */}
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                {/* Built from the SAME src/routes.tsx the client uses.
                    renderToString cannot suspend, so every component is
                    awaited in render() below and passed in resolved. */}
                {ROUTES.map(({ path }) => {
                  const C = resolved[path];
                  return C ? <Route key={path} path={path} element={<C />} /> : null;
                })}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
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
