import { useEffect, useState } from "react";
import { FoundingPilotCTA } from "@/components/FoundingPilotCTA";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { HardHat } from "lucide-react";

// All hero images live in public/images so the SAME URL resolves in dev, the
// production SPA bundle, AND the prerendered HTML. (Importing from src/assets
// made the SSR prerender emit dev-only /src/assets/... URLs that 404 in prod.)
const heroElectrician = "/images/hero-electrician.webp";
const beforeMessyNotes = "/images/before-messy-notes.webp";
const afterCleanPdf = "/images/after-clean-pdf.webp";

// Credibility bar. This deliberately does NOT render a five-star rating: the
// stars were paired with "Trusted on jobsites" on a product that has not started
// billing and has no reviews, which reads as an aggregate rating nobody gave.
// Say who built it instead — that part is true and it is the stronger claim.
const SocialProofBar = () => (
  <div className="flex items-center justify-center gap-3 mb-6 animate-fade-up" style={{ animationDelay: "0.05s" }}>
    <div className="flex">
      <HardHat className="w-4 h-4 text-primary" aria-hidden="true" />
    </div>
    <span className="text-sm text-muted-foreground font-medium">
      Built by subcontractors, for subcontractors. Human-assisted founding pilot available now.
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
      
      {/* NOTE: fetchpriority is intentionally lowercase. React 18 does not
          recognise the camelCase `fetchPriority` prop, so it serialised
          differently on the server than on the client and was the last
          hydration mismatch on this site — it made React discard the whole
          prerender (#418 -> #423). Lowercase passes through unchanged on
          both sides. Do not "fix" the casing. */}
      {/* Background images - mobile stacked, desktop side by side */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 md:w-1/2 md:left-0">
          <img src="/images/hero-plumber.webp" alt="Plumber working on construction site" width={1024} height={768} className="w-full h-full object-cover" {...({ fetchpriority: "high" } as Record<string, string>)} decoding="async" />
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
          Your crew talks.
          <span className="block text-primary">We deliver the daily report.</span>
        </h1>

        <p className="text-sm font-semibold text-primary max-w-2xl mx-auto mb-4 animate-fade-up" style={{ animationDelay: "0.12s" }}>
          <strong>Founding pilot:</strong> $49 one-time for one crew, 7 days, and up to 5 human-assisted daily-report PDFs.
          No subscription and no automatic renewal.
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
          Send a voice note, written notes, and optional photos after the jobsite walk.
          <span className="block mt-2">We structure the facts you supply and return a finished PDF.</span>
        </p>
        
        {/* PRIMARY CTA: paid pilot, with the free kit preserved as the secondary path. */}
        <div className="relative animate-fade-up mb-5" style={{ animationDelay: "0.3s" }}>
          <HeroWaveform />
          <FoundingPilotCTA placement="homepage_hero" />
        </div>

        <p className="text-sm text-muted-foreground mb-10 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          Not ready to pay? <a href="#defense-kit" className="text-primary font-bold underline">Get the free Daily Log Defense Kit.</a>
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
