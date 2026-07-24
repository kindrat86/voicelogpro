import { CTAButton } from "@/components/CTAButton";
import { AlertTriangle, Clock } from "lucide-react";

/**
 * Scarcity + urgency section.
 * Brunson principle: real or perceived scarcity drives action.
 * Frames the beta as capacity-limited (we can only onboard N crews
 * while keeping support quality high).
 */
export function LimitedBetaSection() {
  return (
    <section className="section-container">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-destructive/20 text-foreground px-4 py-2 rounded-full mb-6">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold uppercase tracking-wide text-sm">Private Beta — Limited Places</span>
        </div>

        <h2 className="headline-section text-foreground mb-6">
          We're Keeping The Beta Small On Purpose
        </h2>

        <p className="body-large mb-4">
          VoiceLogPro is built by a working crew, not a venture-funded startup.
          We onboard <span className="text-foreground font-semibold">crews in small groups</span> so every
          beta partner gets real support — not a help-desk ticket.
        </p>

        <div className="flex items-center justify-center gap-2 mb-8 text-foreground font-medium">
          <Clock className="w-5 h-5 text-destructive" />
          <span>New beta cohorts open as capacity allows.</span>
        </div>

        <p className="text-xl text-foreground font-medium mb-8">
          If you're serious about reporting done right — lock in now.
        </p>

        <CTAButton variant="hero" label="Reserve My Beta Spot" />
      </div>
    </section>
  );
}
