import { CTAButton } from "@/components/CTAButton";
import heroPlumber from "@/assets/hero-plumber.jpg";
import heroElectrician from "@/assets/hero-electrician.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      
      {/* Background images - mobile stacked, desktop side by side */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 md:w-1/2 md:left-0">
          <img 
            src={heroPlumber} 
            alt="Plumber working on construction site" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden md:block absolute inset-0 w-1/2 right-0 left-auto">
          <img 
            src={heroElectrician} 
            alt="Electrician pulling wire" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-4xl md:text-5xl mb-4 animate-fade-up">🔥</p>
        
        <h1 className="headline-primary text-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Stop Typing Daily Reports.
          <span className="block text-primary">Just Speak.</span>
        </h1>
        
        <p className="body-large max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Turn glove-on voice notes into job-ready PDFs in 30 seconds.
          <span className="block mt-2">Built for subs who need to move fast — and prove work got done.</span>
        </p>
        
        <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <CTAButton variant="hero" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </section>
  );
}
