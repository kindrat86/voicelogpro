import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { ConsentBanner } from "@/components/ConsentBanner";
import { useConsent } from "@/hooks/useConsent";
import { useMounted } from "@/hooks/useMounted";
import { ROUTES } from "./routes";

const NotFound = lazy(() => import("./pages/NotFound"));










const queryClient = new QueryClient();

/** Scroll to the #hash target after SPA navigation (react-router doesn't). */
const ScrollToHash = () => {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    // Wait a tick so lazy routes have rendered their sections.
    const t = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => clearTimeout(t);
  }, [hash, pathname]);
  return null;
};

/** GDPR consent banner (renders once, then never again).
 *
 * Deliberately renders nothing until mounted. `showBanner` is `choice === null`
 * and `choice` starts null, so this used to render on the client's FIRST pass
 * while the prerendered HTML contained no banner at all — a mismatch at the top
 * of the tree that made React discard the whole prerender (errors #418/#423).
 * Whether to show it depends on localStorage, which prerendering cannot know,
 * so post-mount is the only correct time to decide. */
const ConsentGate = () => {
  const mounted = useMounted();
  const consent = useConsent();
  if (!mounted || !consent.showBanner) return null;
  return <ConsentBanner onDecide={consent.decide} />;
};

/** Mobile nav is client-only chrome; the prerender emits none, so it must not
 *  appear on the hydrating render either. */
const MobileBottomBarGate = () => {
  const mounted = useMounted();
  if (!mounted) return null;
  return <MobileBottomBar />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <ConsentGate />
        <div className="pb-24 md:pb-0">
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              {/* Single source of truth: src/routes.tsx. Do NOT add a <Route>
                  here — add it to ROUTES so the prerenderer gets it too. */}
              {ROUTES.map(({ path, load, eager }) => {
                const C = eager ?? lazy(load);
                return <Route key={path} path={path} element={<C />} />;
              })}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <MobileBottomBarGate />
        {/* Brunson Trust Bar intentionally NOT rendered here.
            The build injects one copy into the static shell, OUTSIDE #root, on
            every prerendered route. Rendering it again inside #root produced two
            trust bars on every live page, and — because it was a root-level child
            the server never emitted — it was the last remaining hydration mismatch
            (React #418/#423, which discarded the whole prerender).
            Verified before removal: /, /about, /crew-plan, /court-ready-daily-logs,
            /for/plumbers and /contact each already ship exactly one copy. */}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
