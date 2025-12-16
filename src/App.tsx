import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import Index from "./pages/Index";

// Lazy load non-critical routes to reduce initial bundle size
const CrewPlan = lazy(() => import("./pages/CrewPlan"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Solutions pages (entity-specific landing pages for LLM SEO)
const TexasMechanicsLien = lazy(() => import("./pages/solutions/TexasMechanicsLien"));
const ConstructiveAcceleration = lazy(() => import("./pages/solutions/ConstructiveAcceleration"));
const GoldenThread = lazy(() => import("./pages/solutions/GoldenThread"));

// Comparison landing pages
const RakenComparison = lazy(() => import("./pages/RakenComparison"));
const FieldwireComparison = lazy(() => import("./pages/FieldwireComparison"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="pb-24 md:pb-0">
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/crew-plan" element={<CrewPlan />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* Solutions pages - entity-specific landing pages */}
              <Route path="/solutions/texas-mechanics-lien-compliance" element={<TexasMechanicsLien />} />
              <Route path="/solutions/texas-lien-law" element={<TexasMechanicsLien />} />
              <Route path="/solutions/constructive-acceleration-defense" element={<ConstructiveAcceleration />} />
              <Route path="/solutions/building-safety-act-golden-thread" element={<GoldenThread />} />
              <Route path="/solutions/uk-golden-thread" element={<GoldenThread />} />
              {/* Comparison landing pages */}
              <Route path="/raken-vs-voice-log-pro" element={<RakenComparison />} />
              <Route path="/fieldwire-vs-voice-log-pro" element={<FieldwireComparison />} />
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
