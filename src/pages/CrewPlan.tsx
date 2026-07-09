import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { CheckCircle, Loader2, ArrowLeft, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

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

export default function CrewPlan() {
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
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: email.toLowerCase().trim(),
        source: planType === "free" ? "beta_free" : "crew_plan"
      });
      if (error) {
        if (error.code === "23505") {
          setIsDuplicate(true);
          setSubmittedPlan(planType);
          setStatus("success");
          return;
        }
        throw error;
      }
      setSubmittedPlan(planType);
      setStatus("success");
    } catch (error) {
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
    <main className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Crew Plan Pricing — Voice Log Pro for Construction Teams</title>
        <meta name="description" content="Voice Log Pro offers two plans: a free Solo Beta (unlimited voice logs, standard PDF reports) and the $49/month Crew Plan for up to 5 crews with priority onboarding and custom branding. No credit card required to start." />
        <link rel="canonical" href="https://voicelogpro.com/crew-plan" />
      </Helmet>
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

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
                    : "This was a Letter of Intent — you're simply telling us you'd pay for Voice Log Pro when it's ready. You will not be billed $49/month until you sign up after launch."}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Page Header */}
              <h1 className="headline-section text-foreground mb-4 text-center">
                Choose your path
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
                Voice Log Pro has two plans. The <strong>Solo Beta is free</strong> — unlimited voice logs,
                standard PDF reports, and email support, no credit card required. The <strong>Crew Plan is
                $49/month</strong> and adds up to 5 crews, priority onboarding, and custom branding. Pick the
                one that fits how your team works today.
              </p>

              {/* Two-Option Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT CARD — Solo Beta */}
                <div className="card-industrial p-6 md:p-8 border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Solo Beta</h2>
                      <p className="text-3xl font-bold text-primary">$0 <span className="text-base font-normal text-muted-foreground">/ Free</span></p>
                    </div>
                  </div>

                  <Badge variant="default" className="mb-6">
                    No Credit Card Required
                  </Badge>

                  {/* Features List */}
                  <div className="bg-secondary/30 border border-border rounded-lg p-5 mb-6">
                    <p className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Includes:</p>
                    <ul className="space-y-3">
                      {freeFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Conditional: CTA or Email Form */}
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
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => handlePlanClick("free")}
                    >
                      Join Beta Free
                    </Button>
                  )}
                </div>

                {/* RIGHT CARD — Crew Plan */}
                <div className="card-industrial p-6 md:p-8 border-primary border-2 relative">
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
                      <h2 className="text-xl font-bold text-foreground">Crew Plan</h2>
                      <p className="text-3xl font-bold text-primary">$49 <span className="text-base font-normal text-muted-foreground">/ month</span></p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="bg-secondary/30 border border-border rounded-lg p-5 mb-6 mt-6">
                    <p className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Includes:</p>
                    <ul className="space-y-3">
                      {paidFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Conditional: CTA or Email Form */}
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
                          "Get Crew Access"
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
                      Get Crew Access
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
