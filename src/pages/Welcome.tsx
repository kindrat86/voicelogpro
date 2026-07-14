import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { CheckCircle, ArrowRight, Mail, AlertTriangle } from "lucide-react";

/**
 * Double-opt-in confirmation landing (the email-engine's confirmed_url).
 * Brunson confirmation-page pattern: confirm the win, deliver the goods,
 * then immediately present the next rung of the value ladder.
 */
export default function Welcome() {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>You're in — Voice Log Pro</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://voicelogpro.com/welcome" />
      </Helmet>

      <section className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-6">
            <CheckCircle className="w-9 h-9 text-success" />
          </div>
          <h1 className="headline-section text-foreground mb-4">You're confirmed. Kit's inside.</h1>
          <p className="body-large mb-8">
            Your Daily Log Defense Kit is ready — five daily log templates, the Texas Chapter&nbsp;53
            checklist, and the dispute scripts.
          </p>
          <Link
            to="/defense-kit"
            className="inline-flex items-center justify-center h-14 px-8 bg-primary text-primary-foreground font-bold uppercase tracking-wide text-lg hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow-hard-primary)" }}
          >
            Open my Defense Kit <ArrowRight className="w-5 h-5 ml-2" />
          </Link>

          <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground text-sm">
            <Mail className="w-4 h-4" />
            <span>Over the next 4 days I'll send you the $40k story — and what it taught us about getting paid.</span>
          </div>
        </div>
      </section>

      {/* Next rung — the one-time-offer style bridge */}
      <section className="section-container bg-secondary/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-destructive/20 text-foreground px-4 py-2 rounded-full mb-6">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold uppercase tracking-wide text-sm">While you're here — 3 beta seats open</span>
          </div>
          <h2 className="headline-section text-foreground mb-4">
            The kit documents your day.<br />Voice Log Pro does it for you.
          </h2>
          <p className="body-large mb-6">
            Press record, speak your update, and get a timestamped, weather-stamped, court-ready PDF —
            even offline. Free during beta, no card required, and beta partners lock the $49/month
            Crew Plan rate for good.
          </p>
          <Link
            to="/crew-plan"
            className="inline-flex items-center justify-center h-14 px-8 bg-primary text-primary-foreground font-bold uppercase tracking-wide text-lg hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow-hard-primary)" }}
          >
            Claim a beta seat <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <p className="text-sm text-muted-foreground mt-4">30-day money-back guarantee once billing starts. Cancel anytime.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
