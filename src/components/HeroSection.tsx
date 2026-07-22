import { useEffect, useState } from "react";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Star } from "lucide-react";

// All hero images live in public/images so the SAME URL resolves in dev, the
// production SPA bundle, AND the prerendered HTML. (Importing from src/assets
// made the SSR prerender emit dev-only /src/assets/... URLs that 404 in prod.)
const heroElectrician = "/images/hero-electrician.webp";
const beforeMessyNotes = "/images/before-messy-notes.webp";
const afterCleanPdf = "/images/after-clean-pdf.webp";

// Social proof bar — Brunson "mass influence" pattern
const SocialProofBar = () => (
  <div className="flex items-center justify-center gap-3 mb-6 animate-fade-up" style={{ animationDelay: "0.05s" }}>
    <div className="flex">
      {[0,1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
    </div>
    <span className="text-sm text-muted-foreground font-medium">
      Built by subcontractors. Trusted on jobsites.
    </span>
  </div>
);

// Animated waveform component for voice-first trust signal
const HeroWaveform = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);
  if (prefersReducedMotion) return null;
  return <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20" aria-hidden="true">
      <div className="flex items-center gap-1">
        {Array.from({
        length: 16
      }).map((_, i) => <div key={i} className="w-1.5 bg-primary rounded-full animate-waveform" style={{
        animationDelay: `${i * 80}ms`
      }} />)}
      </div>
    </div>;
};

export function HeroSection() {
  return <section className="relative min-h-[100dvh] flex flex-col justify-center px-4 py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      
      {/* Background images - mobile stacked, desktop side by side */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 md:w-1/2 md:left-0">
          <img src="/images/hero-plumber.webp" alt="Plumber working on construction site" width={1024} height={768} className="w-full h-full object-cover" fetchPriority="high" decoding="async" />
        </div>
        <div className="hidden md:block absolute inset-0 w-1/2 right-0 left-auto">
          <img src={heroElectrician} alt="Electrician pulling wire" width={1024} height={768} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        <SocialProofBar />
        
        <h1 className="headline-primary text-foreground mb-6 animate-fade-up" style={{
        animationDelay: "0.1s"
      }}>
          Stop Typing Daily Reports.
          <span className="block text-primary">Just Speak.</span>
        </h1>

        <p className="text-sm font-semibold text-primary max-w-2xl mx-auto mb-4 animate-fade-up" style={{ animationDelay: "0.12s" }}>
          <strong>TL;DR:</strong> VoiceLogPro turns 30-second voice notes into timestamped, weather-corroborated,
          court-ready PDF daily reports. No typing. Works from any phone. Flat $49/month for your entire crew.
          Built for subcontractors who need payment protection, not project management.
        </p>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4 animate-fade-up" style={{
        animationDelay: "0.15s"
      }}>
          The AI Voice-to-PDF daily log tool for defending against payment disputes, lien waivers, and schedule compression claims.
        </p>
        
        <p className="sr-only">
          Construction daily logs for mechanics liens, delay claim documentation, excusable delay proof, and dispute-ready PDF reporting.
        </p>
        
        <p className="body-large max-w-2xl mx-auto mb-8 animate-fade-up" style={{
        animationDelay: "0.2s"
      }}>
          Turn glove-on voice notes into job-ready PDFs in 30 seconds.
          <span className="block mt-2">Built for subs who need to move fast — and prove work got done.</span>
        </p>
        
        {/* PRIMARY CTA: Lead magnet opt-in (Brunson squeeze in hero) */}
        <div className="relative animate-fade-up mb-8" style={{ animationDelay: "0.3s" }}>
          <HeroWaveform />
          <LeadMagnetForm ctaLabel="Get the Free Defense Kit" source="hero_lead_magnet" variant="hero" />
        </div>

        <p className="text-sm text-muted-foreground mb-10 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          Or <a href="#crew-plan" className="text-primary font-bold underline">learn about the Crew Plan →</a>
        </p>
        
        {/* Before/After Slider */}
        <div className="animate-fade-up" style={{
        animationDelay: "0.4s"
      }}>
          <BeforeAfterSlider beforeImage={beforeMessyNotes} afterImage={afterCleanPdf} beforeLabel="Before: Messy notes" afterLabel="After: Clean PDF" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        
      </div>
    </section>;
}
