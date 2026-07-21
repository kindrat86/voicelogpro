import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import Index from "./pages/Index";

// Lazy load non-critical routes to reduce initial bundle size
const CrewPlan = lazy(() => import("./pages/CrewPlan"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

// GEO-optimized blog posts
const TexasLienLaw2025 = lazy(() => import("./pages/blog/TexasLienLaw2025"));
const CaliforniaPreliminaryNotice = lazy(() => import("./pages/blog/CaliforniaPreliminaryNotice"));
const FloridaNoticeToOwner = lazy(() => import("./pages/blog/FloridaNoticeToOwner"));
const DailyLogBestPractices = lazy(() => import("./pages/blog/DailyLogBestPractices"));
const NewYorkLienLaw = lazy(() => import("./pages/blog/NewYorkLienLaw"));
const LienDeadlineCheatSheet = lazy(() => import("./pages/blog/LienDeadlineCheatSheet"));

// Solutions pages (entity-specific landing pages for LLM SEO)
const TexasMechanicsLien = lazy(() => import("./pages/solutions/TexasMechanicsLien"));
const ConstructiveAcceleration = lazy(() => import("./pages/solutions/ConstructiveAcceleration"));
const GoldenThread = lazy(() => import("./pages/solutions/GoldenThread"));
const FightUnfairDeductions = lazy(() => import("./pages/solutions/FightUnfairDeductions"));
const PhasePaymentDisputes = lazy(() => import("./pages/solutions/PhasePaymentDisputes"));
const ElectricalInventoryTracking = lazy(() => import("./pages/solutions/ElectricalInventoryTracking"));
const SmallElectricalBusinessSoftware = lazy(() => import("./pages/solutions/SmallElectricalBusinessSoftware"));

// Comparison landing pages
const RakenComparison = lazy(() => import("./pages/RakenComparison"));
const FieldwireComparison = lazy(() => import("./pages/FieldwireComparison"));
const ComparisonPage = lazy(() => import("./pages/ComparisonPage"));
const ComparisonsHub = lazy(() => import("./pages/ComparisonsHub"));

// How-to guides (search-intent prefix pages)
const HowToPage = lazy(() => import("./pages/HowToPage"));
const HowToHub = lazy(() => import("./pages/HowToHub"));

// Trade vertical pages (niche landing pages)
const TradePage = lazy(() => import("./pages/TradePage"));
const TradesHub = lazy(() => import("./pages/TradesHub"));

// Flagship topic pillar (claims the "court-ready daily log" wedge)
const CourtReadyDailyLogs = lazy(() => import("./pages/CourtReadyDailyLogs"));

// Standalone conversion landing page
const BetaSignup = lazy(() => import("./pages/BetaSignup"));

// Funnel delivery pages (lead magnet + double-opt-in confirmation)
const DefenseKit = lazy(() => import("./pages/DefenseKit"));
const Welcome = lazy(() => import("./pages/Welcome"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Dream100 = lazy(() => import("./pages/Dream100"));

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <div className="pb-24 md:pb-0">
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/crew-plan" element={<CrewPlan />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* Single blog post routes */}
              <Route path="/blog/texas-lien-law" element={<TexasLienLaw2025 />} />
              {/* GEO-optimized blog posts */}
              <Route path="/blog/texas-property-code-chapter-53-guide-2025" element={<TexasLienLaw2025 />} />
              <Route path="/blog/california-20-day-preliminary-notice-guide-2026" element={<CaliforniaPreliminaryNotice />} />
              <Route path="/blog/florida-notice-to-owner-45-day-guide-2026" element={<FloridaNoticeToOwner />} />
              <Route path="/blog/construction-daily-log-best-practices-legal-court" element={<DailyLogBestPractices />} />
              <Route path="/blog/new-york-lien-law-article-2-subcontractor-guide-2026" element={<NewYorkLienLaw />} />
              <Route path="/blog/construction-lien-deadlines-cheat-sheet-2026" element={<LienDeadlineCheatSheet />} />
              {/* Solutions pages - entity-specific landing pages */}
              <Route path="/solutions/texas-mechanics-lien-compliance" element={<TexasMechanicsLien />} />
              <Route path="/solutions/constructive-acceleration-defense" element={<ConstructiveAcceleration />} />
              <Route path="/solutions/building-safety-act-golden-thread" element={<GoldenThread />} />
              <Route path="/solutions/fight-unfair-gc-deductions" element={<FightUnfairDeductions />} />
              <Route path="/solutions/phase-payment-disputes" element={<PhasePaymentDisputes />} />
              <Route path="/solutions/electrical-inventory-tracking" element={<ElectricalInventoryTracking />} />
              <Route path="/solutions/small-electrical-business-software" element={<SmallElectricalBusinessSoftware />} />
              {/* Comparison landing pages */}
              <Route path="/raken-vs-voice-log-pro" element={<RakenComparison />} />
              <Route path="/fieldwire-vs-voice-log-pro" element={<FieldwireComparison />} />
              {/* Programmatic SEO comparison pages */}
              <Route path="/compare" element={<ComparisonsHub />} />
              <Route path="/procore-vs-voice-log-pro" element={<ComparisonPage />} />
              <Route path="/buildertrend-vs-voice-log-pro" element={<ComparisonPage />} />
              <Route path="/contractor-foreman-vs-voice-log-pro" element={<ComparisonPage />} />
              <Route path="/jobnimbus-vs-voice-log-pro" element={<ComparisonPage />} />
              <Route path="/knowify-vs-voice-log-pro" element={<ComparisonPage />} />
              {/* Flagship topic pillar */}
              <Route path="/court-ready-daily-logs" element={<CourtReadyDailyLogs />} />
              {/* How-to guides (search-intent prefix pages) */}
              <Route path="/how-to" element={<HowToHub />} />
              <Route path="/how-to/:slug" element={<HowToPage />} />
              {/* Trade vertical pages (niche landing pages) */}
              <Route path="/for" element={<TradesHub />} />
              <Route path="/for/:slug" element={<TradePage />} />
              {/* Standalone conversion landing page */}
              <Route path="/beta" element={<BetaSignup />} />

              <Route path="/defense-kit" element={<DefenseKit />} />
              <Route path="/welcome" element={<Welcome />} />
              {/* Trust pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dream-100" element={<Dream100 />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <MobileBottomBar />
        {/* Brunson Trust Bar — Dotcom Secrets Ch 7: social proof + lead magnet + urgency + guarantee */}
        <div dangerouslySetInnerHTML={{ __html: `<!-- BRUNSON TRUST BAR -- idempotency:trust-bar-v1 -->
<section class="brunson-trust-bar" style="background:linear-gradient(135deg, #0f172a, #1e293b);color:#e8eaed;padding:40px 24px;margin:60px 0 0;border-top:3px solid #00d4aa;text-align:center;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">
  <div style="max-width:900px;margin:0 auto">
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:28px;margin-bottom:28px">
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">60 sec</span><br><span style="font-size:.82rem;color:#94a3b8">Per Voice Report</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">30 min</span><br><span style="font-size:.82rem;color:#94a3b8">Saved Per Day</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">$49</span><br><span style="font-size:.82rem;color:#94a3b8">Monthly Plan</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">Free</span><br><span style="font-size:.82rem;color:#94a3b8">Defense Kit</span></div>
    </div>
    <p style="font-size:1.05rem;margin-bottom:24px;color:#cbd5e1">Stop typing daily reports. Speak them in 60 seconds and let AI handle the paperwork.</p>
    <a href="https://voicelogpro.com/" style="display:inline-block;background:linear-gradient(135deg,#00d4aa,#2deec0);color:#04130e;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none;font-size:.95rem;box-shadow:0 8px 24px -10px rgba(0,212,170,.5)">Get Free Defense Kit</a>
    <p style="margin-top:18px;font-size:.78rem;color:#6b7178">14-day free trial. No credit card required. Cancel anytime.</p>
  </div>
</section>` }} />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
