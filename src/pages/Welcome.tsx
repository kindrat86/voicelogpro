import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { CheckCircle, ArrowRight, Mail, Lock, Users, Shield, FileText, HardHat, Plus } from "lucide-react";

/**
 * Double-opt-in confirmation landing (the email-engine's confirmed_url).
 * Brunson confirmation-page pattern: confirm the win, deliver the goods,
 * then immediately present the next rung of the value ladder.
 */
export default function Welcome() {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>You're in — VoiceLogPro</title>
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

	      {/* One-Time Offer — Brunson Stack-and-Bang
	          This section converts the confirmation page into a proper OTO step.
	          The email engine (subscribe.ts → Resend) already fired before the
	          user arrived here, so this is pure offer presentation — no form
	          logic, no risk of breaking the working opt-in flow.
	          
	          Honesty rules observed:
	          - No fake stars/ratings/reviews (CLAUDE.md + 1d83b7f)
	          - No money-back guarantee without "once billing starts" (d6a5d53)
	          - No fabricated crew counts or testimonials
	          - No charge today — this is a beta waitlist, not a checkout */}

	      <section className="section-container bg-secondary/30">
	        <div className="max-w-3xl mx-auto">
	          {/* Urgency header */}
	          <div className="text-center mb-8">
	            <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full mb-4 font-semibold uppercase tracking-wide text-sm">
	              <Lock className="w-4 h-4" />
	              <span>This page only — beta seat offer</span>
	            </div>
	            <h2 className="headline-section text-foreground mb-3">
	              Your Defense Kit documents your day.<br />
	              VoiceLogPro does the work for you.
	            </h2>
	            <p className="body-large max-w-xl mx-auto">
	              Press record, speak 30 seconds, and get a timestamped, weather-stamped,
	              court-ready PDF — even offline from a muddy jobsite.
	            </p>
	          </div>

	          {/* Value Stack — Crew Plan */}
	          <div className="card-industrial mb-6">
	            <div className="flex items-center gap-3 mb-4">
	              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
	                <Users className="w-5 h-5 text-primary" />
	              </div>
	              <div>
	                <h3 className="text-xl font-bold text-foreground">Crew Plan — $49/month</h3>
	                <p className="text-sm text-muted-foreground">Up to 5 foremen. Flat rate. No per-report fees.</p>
	              </div>
	            </div>

	            <ul className="space-y-3 mb-6">
	              {[
	                "Unlimited voice-to-PDF daily logs for up to 5 crews",
	                "Priority onboarding — we walk your first foreman through it live",
	                "Your company logo on every PDF",
	                "Works offline — logs sync when you're back on cell signal",
	              ].map((f) => (
	                <li key={f} className="flex items-start gap-3 text-muted-foreground">
	                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
	                  <span>{f}</span>
	                </li>
	              ))}
	            </ul>

	            {/* Order Bump */}
	            <div className="border-2 border-primary/30 bg-primary/5 rounded-lg p-5 mb-4">
	              <div className="flex items-start gap-3">
	                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
	                <div className="flex-1">
	                  <h4 className="font-bold text-foreground mb-1">
	                    Add the Dispute-Ready Audit Trail — FREE during beta
	                  </h4>
	                  <p className="text-sm text-muted-foreground mb-2">
	                    Monthly Chapter&nbsp;53 deadline reminders + a GC-facing cover-letter generator
	                    for your pay applications. Normally $19/month — yours at $0 as a beta partner.
	                  </p>
	                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wide">
	                    <Plus className="w-3 h-3" />
	                    Included with this page&rsquo;s offer
	                  </span>
	                </div>
	              </div>
	            </div>

	            {/* Trust bar — honest */}
	            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
	              <span className="flex items-center gap-1">
	                <Lock className="w-3 h-3" /> No charge until launch
	              </span>
	              <span className="flex items-center gap-1">
	                <FileText className="w-3 h-3" /> Your data stays yours — export anytime
	              </span>
	              <span className="flex items-center gap-1">
	                <HardHat className="w-3 h-3" /> Built by a former electrical foreman
	              </span>
	            </div>
	          </div>

	          {/* Main CTA */}
	          <div className="text-center mb-4">
	            <Link
	              to="/crew-plan"
	              className="inline-flex items-center justify-center h-14 px-8 bg-primary text-primary-foreground font-bold uppercase tracking-wide text-lg hover:opacity-90 transition-opacity"
	              style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow-hard-primary)" }}
	            >
	              Reserve a Crew Plan beta seat <ArrowRight className="w-5 h-5 ml-2" />
	            </Link>
	            <p className="text-sm text-muted-foreground mt-3">
	              Founding price locked for life. You will not be billed $49/month until you sign up after launch.
	            </p>
	          </div>

	          {/* Decline path — keeps them in the funnel */}
	          <div className="text-center pt-2 pb-4">
	            <Link
	              to="/defense-kit"
	              className="text-muted-foreground hover:text-foreground text-sm transition-colors underline underline-offset-4"
	            >
	              No thanks — just open my Defense Kit
	            </Link>
	          </div>

	          {/* Email sequence teaser */}
	          <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground text-sm">
	            <Mail className="w-4 h-4" />
	            <span>Also: over the next 4 days I&rsquo;ll share the $40k story — and how we stopped losing pay.</span>
	          </div>
	        </div>
	      </section>

      <Footer />
    </main>
  );
}
