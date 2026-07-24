import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Zap, Users, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { subscribeToSequence } from "@/lib/subscribe";

const emailSchema = z.string().email("Please enter a valid email address");

type ActivePlan = "free" | "paid" | null;

const freeFeatures = [
  "Unlimited Voice Logs",
  "Standard PDF Reports",
  "Email Support",
];

const paidFeatures = [
  "All Beta features",
  "Up to 5 Crews",
  "Priority Onboarding",
  "Custom Branding",
];

export function CrewPlanSection() {
  const [activePlan, setActivePlan] = useState<ActivePlan>(null);
  const [freeEmail, setFreeEmail] = useState("");
  const [paidEmail, setPaidEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [submittedPlan, setSubmittedPlan] = useState<"free" | "paid" | null>(null);

  const handleSubmit = async (e: React.FormEvent, planType: "free" | "paid") => {
    e.preventDefault();
    setErrorMessage("");

    const email = planType === "free" ? freeEmail : paidEmail;

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
    // errored out, losing 100% of signups on both plans. Repointed at the
    // working email-engine subscribe path (same as LeadMagnetForm/CrewPlan).
    const ok = await subscribeToSequence(
      email,
      planType === "free" ? "beta_free" : "crew_plan"
    );
    if (ok) {
      setSubmittedPlan(planType);
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handlePlanClick = (plan: "free" | "paid") => {
    setActivePlan(plan);
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <section className="section-container bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="headline-section text-foreground mb-8 text-center">Choose your path</h2>

        {status === "success" ? (
          <div className="card-industrial p-8 max-w-md mx-auto text-center animate-fade-in">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <p className="text-success font-semibold text-lg mb-2">
              {isDuplicate ? "You're already on the waitlist." : "Thank you for joining!"}
            </p>
            <p className="text-muted-foreground mb-4">
              {isDuplicate 
                ? "We've got your email and will reach out when your slot opens." 
                : `You're on the ${submittedPlan === "free" ? "Solo Beta" : "Crew Plan"} waitlist. We'll reach out when your beta slot opens.`}
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">No charge today.</p>
              <p>
                {submittedPlan === "free" 
                  ? "You've secured your free beta spot. We'll notify you when access opens."
                  : "This was a Letter of Intent — you're simply telling us you'd pay for VoiceLogPro when it's ready."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT CARD — Solo Beta */}
            <div className="card-industrial border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Solo Beta</h3>
                  <p className="text-3xl font-bold text-primary">$0 <span className="text-base font-normal text-muted-foreground">/ Free</span></p>
                </div>
              </div>

              <Badge variant="default" className="mb-6">
                No Credit Card Required
              </Badge>

              <ul className="space-y-3 mb-6">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {activePlan === "free" ? (
                <form onSubmit={(e) => handleSubmit(e, "free")} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={freeEmail}
                    onChange={(e) => {
                      setFreeEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="h-12 text-base bg-input border-border focus:border-primary"
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
                        Joining...
                      </>
                    ) : (
                      "Join Beta Free"
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Risk Free.
                  </p>
                </form>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => handlePlanClick("free")}
                  >
                    Join Beta Free
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Risk Free. Cancel anytime.
                  </p>
                </>
              )}
            </div>

            {/* RIGHT CARD — Crew Plan */}
            <div className="card-industrial border-primary border-2 relative">
              {/* Premium indicator */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
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

              <ul className="space-y-3 mb-6 mt-6">
                {paidFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {activePlan === "paid" ? (
                <form onSubmit={(e) => handleSubmit(e, "paid")} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={paidEmail}
                    onChange={(e) => {
                      setPaidEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="h-12 text-base bg-input border-border focus:border-primary"
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
                        Joining...
                      </>
                    ) : (
                      "Reserve a Crew Plan place"
                    )}
                  </Button>
                </form>
              ) : (
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full"
                  onClick={() => handlePlanClick("paid")}
                >
                  Reserve a Crew Plan place
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
