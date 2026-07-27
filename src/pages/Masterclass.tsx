import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { subscribeToSequence } from "@/lib/subscribe";
import { z } from "zod";
import {
  Play,
  Clock,
  Shield,
  FileText,
  CheckCircle,
  HardHat,
  ArrowRight,
  ChevronRight,
  Loader2,
} from "lucide-react";

const emailSchema = z.string().email("Please enter a valid email address");

/** DotCom Secrets #16-17 — Perfect Webinar / VSL registration page.
 *  Brunson: every funnel needs a video-based selling mechanism. This is the
 *  registration infrastructure for a recorded masterclass that, once the
 *  founder records the video, becomes the highest-converting page in the
 *  funnel.
 *
 *  Honesty: this is a "register for on-demand access when it launches"
 *  flow — no fake urgency, no fake attendee counts, no fabricated launch
 *  date. The offer is real: an email capture for the masterclass sequence. */

const LEARNING_POINTS = [
  "The three things a daily log must have to hold up in court (and none of them is typing)",
  "How to document a delay in 30 seconds with your gloves still on",
  "The \"Contemporaneous Record Rule\" — and why it's the difference between getting paid and eating a $40k loss",
  "VoiceLogPro's Speak → Structure → Submit workflow, demoed live on a real jobsite log",
  "The exact Chapter 53 deadline trigger system that traps funds before a GC can spend them",
];

export default function Masterclass() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    const ok = await subscribeToSequence(email, "masterclass");
    setStatus(ok ? "success" : "error");
    if (!ok) setErrorMessage("Something went wrong. Please try again.");
  };

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Free Masterclass — The Payment Dispute Shield | VoiceLogPro</title>
        <meta
          name="description"
          content="Register for our free on-demand masterclass: how to document a day's work in 30 seconds so it holds up in any payment dispute. Built for subcontractors."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://voicelogpro.com/masterclass" />
      </Helmet>
      <JsonLd
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Course",
            name: "The Payment Dispute Shield — Free Masterclass",
            description:
              "On-demand masterclass for construction subcontractors: how to document daily work in 30 seconds so it holds up in payment disputes, lien claims, and delay arbitrations.",
            provider: {
              "@type": "Organization",
              name: "VoiceLogPro",
              sameAs: "https://voicelogpro.com",
            },
            educationalLevel: "Beginner",
            teaches: [
              "Construction daily documentation best practices",
              "Lien rights documentation",
              "Court-ready daily logs",
            ],
          },
        ]}
      />

      {/* Hero */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full mb-6 font-semibold uppercase tracking-wide text-sm">
            <Play className="w-4 h-4" />
            <span>Free On-Demand Masterclass</span>
          </div>

          <h1 className="headline-section text-foreground mb-4">
            How to Never Lose a Payment Dispute Again
          </h1>
          <p className="body-large mb-3 max-w-xl mx-auto">
            A 15-minute recorded walkthrough for subcontractors who are tired of
            getting burned by missing paperwork — and want a system that actually
            holds up.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 15 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <HardHat className="w-4 h-4" /> Built by someone who lost $40k to bad docs
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> No fluff — only what holds up
            </span>
          </div>

          {/* Video placeholder */}
          <div className="relative bg-muted border-2 border-border max-w-2xl mx-auto mb-10" style={{ borderRadius: "var(--radius)", aspectRatio: "16/9" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Play className="w-10 h-10 text-primary" />
                </div>
                <p className="text-muted-foreground font-medium text-sm">
                  Register below to access on demand when the masterclass launches.
                </p>
              </div>
            </div>
          </div>

          {/* The draw */}
          <div className="max-w-md mx-auto mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">What you'll learn:</h2>
            <ul className="text-left space-y-3">
              {LEARNING_POINTS.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section className="section-container bg-secondary/30">
        <div className="max-w-md mx-auto text-center">
          {status === "success" ? (
            <div className="animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="headline-section text-foreground mb-3">You're registered.</h2>
              <p className="body-large mb-4">
                We'll let you know the moment the masterclass is available. In the
                meantime, go grab your free Defense Kit — it's the companion
                workbook.
              </p>
              <Link
                to="/defense-kit"
                className="inline-flex items-center justify-center h-14 px-8 bg-primary text-primary-foreground font-bold uppercase tracking-wide text-lg hover:opacity-90 transition-opacity"
                style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow-hard-primary)" }}
              >
                Open the Defense Kit <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          ) : (
            <>
              <h2 className="headline-section text-foreground mb-3">
                Register for free access
              </h2>
              <p className="body-large mb-6">
                Drop your email and we'll notify you the moment it's live.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                  placeholder="you@yourcompany.com"
                  required
                  className="h-14 text-base"
                  aria-label="Email address"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-14 text-lg font-bold uppercase tracking-wide"
                  style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow-hard-primary)" }}
                >
                  {status === "loading" ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Registering…</>
                  ) : (
                    <>Register Free <ArrowRight className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </form>

              {status === "error" && (
                <p className="text-destructive text-sm mt-3">{errorMessage}</p>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                No spam. Unsubscribe anytime. We don't share your email.
              </p>
            </>
          )}
        </div>
      </section>

      {/* About the instructor */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto">
          <h2 className="headline-section text-foreground mb-6 text-center">
            About the instructor
          </h2>
          <div className="card-industrial">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <HardHat className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Maryan Kushnir — Former Electrical Foreman
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  I spent years on real jobsites — conduit in one hand, change orders in
                  the other. In 2022 I lost $40,000 on a Dallas data-center project because
                  my daily logs were a mess. Not because the work wasn't done — because I
                  couldn't prove it in a format that held up.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I built VoiceLogPro so no crew ever gets burned by missing paperwork
                  again. This masterclass is the exact system we now use — 30 seconds,
                  gloves on, one take, court-ready PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-container bg-secondary/30">
        <div className="text-center">
          <h2 className="headline-section text-foreground mb-3">
            Ready to stop losing pay to bad documentation?
          </h2>
          <p className="body-large mb-6">
            Fifteen minutes. No fluff. Register free.
          </p>
          <Link
            to="/crew-plan"
            className="inline-flex items-center justify-center h-14 px-8 bg-primary text-primary-foreground font-bold uppercase tracking-wide text-lg hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow-hard-primary)" }}
          >
            Reserve a beta seat <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
