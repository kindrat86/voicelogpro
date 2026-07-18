import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Mic, FileText, Clock, Shield, FileCheck, Users, Smartphone, CheckCircle, Loader2, Zap } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { subscribeToSequence } from "@/lib/subscribe";
// Served from public/images so dev, SPA bundle, and prerendered HTML all
// resolve the same URL (src/assets imports broke the prerendered pages).
const beforeImage = "/images/before-messy-notes.webp";
const afterImage = "/images/after-clean-pdf.webp";

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

export default function BetaSignup() {
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
    // Enroll in the email sequence in parallel — never blocks the signup UX.
    void subscribeToSequence(email);
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
    <>
      <Helmet>
        <title>VoiceLogPro Beta | Stop Chasing Paper Timesheets</title>
        <meta name="description" content="Turn field voice notes into accurate labor logs and Phase vs. Actual reports in 30 seconds. No typing. No apps. No crew accounts. Join the beta." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://voicelogpro.com/beta" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="px-4 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight mb-6">
              Stop Chasing Paper Timesheets.<br />
              <span className="text-primary">Just Speak.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              VoiceLogPro turns field voice notes into accurate labor logs and Phase vs. Actual reports in 30 seconds.
              <br className="hidden md:block" />
              <strong className="text-foreground">No typing. No apps. No crew accounts.</strong>
            </p>

            {/* Before/After Slider */}
            <div className="mt-8">
              <BeforeAfterSlider
                beforeImage={beforeImage}
                afterImage={afterImage}
                beforeLabel="Before: Messy notes"
                afterLabel="After: Clean PDF"
              />
            </div>
          </div>
        </section>

        {/* Problem Agitation */}
        <section className="px-4 py-16 bg-muted/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-8">
              If It's Not Written Down,<br />
              <span className="text-destructive">It Doesn't Get Paid.</span>
            </h2>
            
            <div className="space-y-4 text-lg text-muted-foreground text-center max-w-xl mx-auto">
              <p>Hours get forgotten.</p>
              <p>Photos get buried in WhatsApp.</p>
              <p>Excel gets updated days later—if at all.</p>
            </div>

            <p className="mt-8 text-center text-foreground font-medium text-lg max-w-xl mx-auto">
              Those missing details turn into lost revenue, rejected change orders, and arguments you can't win.
            </p>
          </div>
        </section>

        {/* Solution Snapshot */}
        <section className="px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
              Capture the Work While It's Happening.
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
              VoiceLogPro lets you record a quick daily summary by voice.
              The system turns it into structured labor data and a professional report—automatically.
            </p>

            <div className="flex flex-col items-center gap-2 text-xl font-semibold text-primary">
              <span>You speak.</span>
              <span>It documents.</span>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="px-4 py-16 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">No Manual Entry</h3>
                <p className="text-muted-foreground">
                  Foremen dictate hours and progress while walking the job. No end-of-day paperwork.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Structured Labor Data</h3>
                <p className="text-muted-foreground">
                  Labor hours, materials, and work phases are pulled directly from your voice notes.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Built for Disputes</h3>
                <p className="text-muted-foreground">
                  Every report is time-stamped and formatted for payment approvals, delay claims, and backup documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-12">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Speak</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  Record your daily summary on your phone—no training, no logins for your crew.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Analyze</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  VoiceLogPro structures your notes into Labor, Delays, Materials, and Phases.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Deliver</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  A clean PDF report lands in your email, ready to send or file.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Proof Without Testimonials */}
        <section className="px-4 py-16 bg-muted/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-8">
              What You Get Every Day
            </h2>

            <div className="bg-background rounded-xl border border-border p-6 md:p-8">
              <ul className="space-y-4">
                {[
                  { icon: Clock, text: "Date-stamped labor summary" },
                  { icon: Users, text: "Crew hours by phase" },
                  { icon: Shield, text: "Noted delays and impacts" },
                  { icon: FileCheck, text: "Professional PDF format" },
                  { icon: FileText, text: "Consistent documentation trail" },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground">
                  No chasing notes.<br />
                  No rebuilding the day from memory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing / Beta Gate - Two-Option System with Expand-to-Enter */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8 text-center">
              Choose your path
            </h2>

            {status === "success" ? (
              <div className="bg-background rounded-xl border border-border p-8 max-w-md mx-auto text-center animate-fade-in">
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
                <div className="bg-background rounded-xl border border-border p-6 md:p-8">
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
                    {freeFeatures.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {activePlan === "free" ? (
                    <form onSubmit={(e) => handleSubmit(e, "free")} className="space-y-4">
                      <Input
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        enterKeyHint="go"
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
                <div className="bg-background rounded-xl border-2 border-primary p-6 md:p-8 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
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

                  <ul className="space-y-3 mb-6 mt-6">
                    {paidFeatures.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {activePlan === "paid" ? (
                    <form onSubmit={(e) => handleSubmit(e, "paid")} className="space-y-4">
                      <Input
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        enterKeyHint="go"
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
            )}
          </div>
        </section>

        {/* Strategic Positioning */}
        <section className="px-4 py-16 bg-muted/50">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
              Built for Heavy Gloves,<br />
              Not Thin Screens.
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Most tools are built for GCs in an office.
              VoiceLogPro is built for subcontractors in the field—voice-first, jobsite-ready, and trained on real construction language.
            </p>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="px-4 py-8 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VoiceLogPro. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
