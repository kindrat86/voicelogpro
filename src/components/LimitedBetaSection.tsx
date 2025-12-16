import { CTAButton } from "@/components/CTAButton";
import { AlertTriangle } from "lucide-react";

export function LimitedBetaSection() {
  return (
    <section className="section-container">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-destructive/20 text-destructive px-4 py-2 rounded-full mb-6">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold uppercase tracking-wide text-sm">Limited Beta Access</span>
        </div>

        <h2 className="headline-section text-foreground mb-6">
          Only 3 Beta Slots Open
        </h2>

        <p className="body-large mb-4">
          We're keeping the beta small to maintain quality.
        </p>
        <p className="body-large mb-8">
          Once they're filled, <span className="text-foreground font-semibold">access closes.</span>
        </p>

        <p className="text-xl text-foreground font-medium mb-8">
          If you're serious about reporting done right — lock in now.
        </p>

        <CTAButton variant="hero" />
      </div>
    </section>
  );
}
