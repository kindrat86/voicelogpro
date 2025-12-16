import { useEffect, useState } from "react";
import { CTAButton } from "@/components/CTAButton";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import heroPlumber from "@/assets/hero-plumber.jpg";
import heroElectrician from "@/assets/hero-electrician.jpg";
import beforeMessyNotes from "@/assets/before-messy-notes.jpg";
import afterCleanPdf from "@/assets/after-clean-pdf.jpg";

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
  return <section className="relative min-h-[100dvh] flex flex-col justify-center px-4 py-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/40" />
      
      {/* Background images - mobile stacked, desktop side by side */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 md:w-1/2 md:left-0">
          <img src={heroPlumber} alt="Plumber working on construction site" className="w-full h-full object-cover" fetchPriority="high" />
        </div>
        <div className="hidden md:block absolute inset-0 w-1/2 right-0 left-auto">
          <img src={heroElectrician} alt="Electrician pulling wire" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        <h1 className="headline-primary text-foreground mb-5 animate-fade-up" style={{
        animationDelay: "0.1s"
      }}>
          Stop Typing Daily Reports.
          <span className="block text-primary">Just Speak.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-3 animate-fade-up font-medium" style={{
        animationDelay: "0.15s"
      }}>
          The AI Voice-to-PDF daily log tool for defending against payment disputes, lien waivers, and schedule compression claims.
        </p>
        
        <p className="sr-only">
          Construction daily logs for mechanics liens, delay claim documentation, excusable delay proof, and dispute-ready PDF reporting.
        </p>
        
        <p className="body-large max-w-2xl mx-auto mb-6 animate-fade-up" style={{
        animationDelay: "0.2s"
      }}>
          Turn glove-on voice notes into job-ready PDFs in 30 seconds.
          <span className="block mt-2 font-bold text-foreground">Built for subs who need to move fast — and prove work got done.</span>
        </p>
        
        {/* CTA with waveform background */}
        <div className="relative animate-fade-up mb-10" style={{
        animationDelay: "0.3s"
      }}>
          <HeroWaveform />
          <CTAButton variant="hero" />
        </div>

        {/* Before/After Slider */}
        <div className="animate-fade-up" style={{
        animationDelay: "0.4s"
      }}>
          <BeforeAfterSlider beforeImage={afterCleanPdf} afterImage={beforeMessyNotes} beforeLabel="Before: Messy notes" afterLabel="After: Clean PDF" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        
      </div>
    </section>;
}