import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Users, CheckCircle, Loader2, Lock, Shield, FileText, Plus, Star } from "lucide-react";
import { z } from "zod";
import { subscribeToSequence } from "@/lib/subscribe";

const emailSchema = z.string().email("Please enter a valid email address");

const coreCrewFeatures = [
  "All Solo Beta features",
  "Up to 5 Crews",
  "Priority Onboarding",
  "Custom Branding on PDFs",
];

const bumpFeatures = [
  "Dispute-Ready Audit Trail add-on",
  "Automatic monthly Chapter 53 deadline reminders",
  "GC-facing cover-letter generator for pay apps",
  "Value: $19/mo — locked in at $0 during beta",
];

/**
 * Brunson ORDER BUMP + checkout-style conversion section.
 * The checkbox offer sits next to the paid plan so the buyer can self-upgrade
 * before even entering an email — classic bump mechanic.
 */
export function OrderBumpSection() {
  const [bumpAccepted, setBumpAccepted] = useState(true);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address. Try again.");
      return;
    }
    setStatus("loading");
    setIsDuplicate(false);
    // 2026-07-24: was supabase.from("waitlist").insert(...) against a
    // placeholder Supabase URL (VITE_SUPABASE_URL is empty) — every submit
    // errored out, losing 100% of order-bump signups. Repointed at the
    // working email-engine subscribe path (same as LeadMagnetForm/CrewPlan).
    const ok = await subscribeToSequence(
      email,
      bumpAccepted ? "crew_plan_bump" : "crew_plan"
    );
    if (ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <section id="crew-plan" className="section-container">
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <p className="text-success font-bold text-xl mb-2">
            {isDuplicate ? "You're already on the list!" : "You're in!"}
          </p>
          <p className="text-muted-foreground mb-4">
            {bumpAccepted
              ? "Crew Plan + Dispute-Ready Audit Trail reserved. We'll reach out the moment your beta slot opens."
              : "Crew Plan reserved. We'll reach out when your beta slot opens."}
          </p>
          <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">No charge today.</p>
            <p>
              This was a Letter of Intent — you're telling us you'll pay for VoiceLogPro when it's ready.
              You will not be billed $49/month until you sign up after launch.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="crew-plan" className="section-container bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="headline-section text-foreground mb-3">Join the Crew Plan</h2>
          <p className="body-large max-w-xl mx-auto">
            Reserve your beta seat now. Pay nothing until launch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Crew Plan card */}
          <div className="card-industrial border-primary border-2 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <div className="flex items-center gap-3 mb-4 pt-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Crew Plan</h3>
                <p className="text-3xl font-bold text-primary">$49 <span className="text-base font-normal text-muted-foreground">/ month</span></p>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-4">
              {[0,1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
              <span className="text-xs text-muted-foreground ml-2">Reserved by beta crews</span>
            </div>

            <ul className="space-y-3 mb-6 mt-6">
              {coreCrewFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Badge variant="default" className="bg-primary/15 text-primary mb-2">
              <Lock className="w-3 h-3 mr-1" /> No charge until launch
            </Badge>
          </div>

          {/* Order bump + checkout */}
          <div className="card-industrial border-border">
            {/* The Bump */}
            <button
              type="button"
              onClick={() => setBumpAccepted(!bumpAccepted)}
              className={`w-full text-left p-4 mb-4 border-2 rounded-lg transition-colors ${
                bumpAccepted ? "border-primary bg-primary/5" : "border-border"
              }`}
              aria-pressed={bumpAccepted}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 mt-0.5 rounded flex items-center justify-center flex-shrink-0 border-2 ${
                  bumpAccepted ? "bg-primary border-primary" : "border-border"
                }`}>
                  {bumpAccepted && <Check className="w-4 h-4 text-primary-foreground" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Plus className="w-4 h-4 text-primary" />
                    <span className="font-bold text-foreground">Yes! Add the Dispute-Ready Audit Trail</span>
                    <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full font-bold">FREE during beta</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Normally $19/mo. Lock it in at $0 today and keep the beta price forever.
                  </p>
                  <ul className="space-y-1">
                    {bumpFeatures.map((f) => (
                      <li key={f} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>

            {/* Checkout form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className="h-12 text-base bg-input border-2 border-border focus:border-primary"
                disabled={status === "loading"}
                autoFocus
              />
              {status === "error" && errorMessage && (
                <p className="text-destructive text-sm">{errorMessage}</p>
              )}
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Reserving...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Reserve My {bumpAccepted ? "Crew + Bump" : "Crew"} Spot
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                No charge today. Cancel anytime. 30-day money-back guarantee at launch.
              </p>
            </form>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-4 h-4" />
              You're reserving a spot — not paying. We email you when access opens.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
