/**
 * routes.tsx — the ONE route table for this app.
 *
 * WHY THIS FILE EXISTS
 * App.tsx (client) and entry-server.tsx (prerender) each used to declare their
 * own copy of the route table and provider tree. They drifted, and the drift
 * shipped bugs:
 *
 *   - entry-server was missing /dream-100 entirely, so the prerenderer emitted
 *     a "404 Oops! Page not found" body for that URL and served it to crawlers.
 *   - App wrapped <Routes> in <Suspense> and entry-server did not, so the
 *     prerendered HTML carried no Suspense markers, hydration failed at that
 *     boundary and React threw away the whole prerender on every page view
 *     (#418 -> #423).
 *
 * Both sides now build from ROUTES below, so a route can only be added once.
 *
 * `load` is the shared dynamic import. The client wraps it in React.lazy;
 * the server awaits it, because renderToString cannot suspend — a lazy
 * component there renders the fallback instead of the page.
 *
 * `eager` opts a route out of lazy-loading on the CLIENT. The homepage needs
 * it: a lazy route suspends during hydration and React would swap the
 * prerendered HTML for the fallback, undoing the prerender we just fixed.
 */
import { type ComponentType } from "react";
import Index from "./pages/Index";

export interface RouteDef {
  path: string;
  load: () => Promise<{ default: ComponentType }>;
  /** Client-side only: render this synchronously instead of via React.lazy. */
  eager?: ComponentType;
}

export const ROUTES: RouteDef[] = [
  { path: "/", load: () => import("./pages/Index"), eager: Index },
  { path: "/crew-plan", load: () => import("./pages/CrewPlan") },
  { path: "/blog", load: () => import("./pages/Blog") },
  { path: "/blog/:slug", load: () => import("./pages/BlogPost") },
  { path: "/blog/texas-lien-law", load: () => import("./pages/blog/TexasLienLaw2025") },
  { path: "/blog/texas-property-code-chapter-53-guide-2025", load: () => import("./pages/blog/TexasLienLaw2025") },
  { path: "/blog/california-20-day-preliminary-notice-guide-2026", load: () => import("./pages/blog/CaliforniaPreliminaryNotice") },
  { path: "/blog/florida-notice-to-owner-45-day-guide-2026", load: () => import("./pages/blog/FloridaNoticeToOwner") },
  { path: "/blog/construction-daily-log-best-practices-legal-court", load: () => import("./pages/blog/DailyLogBestPractices") },
  { path: "/blog/new-york-lien-law-article-2-subcontractor-guide-2026", load: () => import("./pages/blog/NewYorkLienLaw") },
  { path: "/blog/construction-lien-deadlines-cheat-sheet-2026", load: () => import("./pages/blog/LienDeadlineCheatSheet") },
  { path: "/solutions/texas-mechanics-lien-compliance", load: () => import("./pages/solutions/TexasMechanicsLien") },
  { path: "/solutions/constructive-acceleration-defense", load: () => import("./pages/solutions/ConstructiveAcceleration") },
  { path: "/solutions/building-safety-act-golden-thread", load: () => import("./pages/solutions/GoldenThread") },
  { path: "/solutions/fight-unfair-gc-deductions", load: () => import("./pages/solutions/FightUnfairDeductions") },
  { path: "/solutions/phase-payment-disputes", load: () => import("./pages/solutions/PhasePaymentDisputes") },
  { path: "/solutions/electrical-inventory-tracking", load: () => import("./pages/solutions/ElectricalInventoryTracking") },
  { path: "/solutions/small-electrical-business-software", load: () => import("./pages/solutions/SmallElectricalBusinessSoftware") },
  { path: "/raken-vs-voice-log-pro", load: () => import("./pages/RakenComparison") },
  { path: "/fieldwire-vs-voice-log-pro", load: () => import("./pages/FieldwireComparison") },
  { path: "/compare", load: () => import("./pages/ComparisonsHub") },
  { path: "/procore-vs-voice-log-pro", load: () => import("./pages/ComparisonPage") },
  { path: "/buildertrend-vs-voice-log-pro", load: () => import("./pages/ComparisonPage") },
  { path: "/contractor-foreman-vs-voice-log-pro", load: () => import("./pages/ComparisonPage") },
  { path: "/jobnimbus-vs-voice-log-pro", load: () => import("./pages/ComparisonPage") },
  { path: "/knowify-vs-voice-log-pro", load: () => import("./pages/ComparisonPage") },
  { path: "/court-ready-daily-logs", load: () => import("./pages/CourtReadyDailyLogs") },
  { path: "/how-to", load: () => import("./pages/HowToHub") },
  { path: "/how-to/:slug", load: () => import("./pages/HowToPage") },
  { path: "/for", load: () => import("./pages/TradesHub") },
  { path: "/for/:slug", load: () => import("./pages/TradePage") },
  { path: "/beta", load: () => import("./pages/BetaSignup") },
  { path: "/defense-kit", load: () => import("./pages/DefenseKit") },
  { path: "/welcome", load: () => import("./pages/Welcome") },
  { path: "/about", load: () => import("./pages/AboutPage") },
  { path: "/contact", load: () => import("./pages/ContactPage") },
  { path: "/dream-100", load: () => import("./pages/Dream100") },
  { path: "*", load: () => import("./pages/NotFound") },
];
