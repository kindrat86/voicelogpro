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

// Standalone conversion landing page
const BetaSignup = lazy(() => import("./pages/BetaSignup"));

// Funnel delivery pages (lead magnet + double-opt-in confirmation)
const DefenseKit = lazy(() => import("./pages/DefenseKit"));
const Welcome = lazy(() => import("./pages/Welcome"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <MobileBottomBar />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
