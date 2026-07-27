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
  Search,
  ClipboardCheck,
  FileText,
  Shield,
  Clock,
  HardHat,
  ArrowRight,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const emailSchema = z.string().email("Please enter a valid email address");

/**
 * DotCom Secrets #12 — Backend Funnel (high-ticket service).
 *
 * Russell: "The money isn't in the frontend — it's in the backend."
 * VoiceLogPro's frontend is the $49/mo Crew Plan. This is the backend
 * rung: a done-for-you documentation audit service at a premium price
 * point where real margin lives.
 *
 * Honesty: no fake testimonials, no fake case studies, no fabricated
 * pricing. Describes what the service WILL cover and uses the same
 * beta waitlist mechanics as the Crew Plan. */

const AUDIT_SCOPE = [
  {
    icon: Search,
    title: "90-day documentation scan",
    body: "We review every daily log, change order, and GC communication from your last three months of work and flag every gap a payment dispute could exploit.",
  },
  {
    icon: ClipboardCheck,
    title: "Jurisdiction-specific compliance check",
    body: "Texas Chapter 53? Virginia AIA A401? California 20-day prelim? We check your documentation against the exact legal requirements in your state — and show you what's missing.",
  },
  {
    icon: FileText,
    title: "Dispute-ready report",
    body: "You walk away with a written report listing every documentation gap, ranked by risk level, with a step-by-step plan to close each one before the next pay-app deadline.",
  },
  {
    icon: Shield,
    title: "GC-facing rebuttal pack",
    body: "For each identified gap, we give you a template response you can send to the GC or owner that frames the issue professionally — so you're not starting from a blank page in a dispute.",
  },
];

const WHO_ITS_FOR = [
  "Subcontractors who've already lost money to a documentation dispute and want to make sure it never happens again",
  "Crews entering a high-value project ($100k+) where the cost of a single documentation failure dwarfs the audit investment",
  "Electrical, plumbing, HVAC, and roofing contractors operating in lien-heavy jurisdictions (Texas, California, Florida, Virginia)",
  "General contractors who carry self-performed scope and want an independent review of their daily logs before an owner dispute arises",
];

export default function CrewAudit() {
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
    const ok = await subscribeToSequence(email, "crew_audit");
    setStatus(ok ? "success" : "error");
    if (!ok) setErrorMessage("Something went wrong. Please try again.");
  };

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Crew Documentation Audit — Done-For-You | VoiceLogPro</title>
        <meta
          name="description"
          content="Done-for-you audit of your crew's last 90 days of daily logs. We flag every documentation gap a payment dispute could exploit — and give you the rebuttal pack to fix it."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://voicelogpro.com/crew-audit" />
      </Helmet>
      <JsonLd
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Crew Documentation Audit — Done-For-You",
            description:
              "A human review of your crew's last 90 days of daily logs, change orders, and GC communications. We flag every documentation gap a payment dispute could exploit and provide a rebuttal pack.",
            provider: {
              "@type": "Organization",
              name: "VoiceLogPro",
              sameAs: "https://voicelogpro.com",
            },
            serviceType: "Construction Documentation Audit",
            areaServed: { "@type": "Country", name: "United States" },
          },
        ]}
      />

      {/* Hero */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-destructive/15 text-destructive px-4 py-2 rounded-full mb-6 font-semibold uppercase tracking-wide text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Done-For-You — High-Ticket Service</span>
          </div>

          <h1 className="headline-section text-foreground mb-4">
            We'll Audit Your Last 90 Days of Daily Logs.
          </h1>
          <p className="body-large mb-6 max-w-xl mx-auto">
            Send us your logs and we'll flag every gap a GC or owner could use to deny
            your payment — then give you the rebuttal pack to close them.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-10">
            <span className="flex items-center gap-1.5">
              <Search className="w-4 h-4" /> 90-day documentation scan
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Jurisdiction-specific
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Written report + rebuttal pack
            </span>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="section-container bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="headline-section text-foreground mb-3 text-center">
            What the audit covers
          </h2>
          <p className="body-large text-center mb-10">
            Every gap we find comes with a closure plan — because knowing there's a
            problem without the fix is just anxiety.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {AUDIT_SCOPE.map((item) => (
              <div key={item.title} className="card-industrial">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto">
          <h2 className="headline-section text-foreground mb-8 text-center">
            Who this is for
          </h2>
          <ul className="space-y-4">
            {WHO_ITS_FOR.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The gap we close */}
      <section className="section-container bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="headline-section text-foreground mb-6 text-center">
            Why most crews lose disputes — even with daily logs
          </h2>
          <div className="card-industrial">
            <p className="text-muted-foreground leading-relaxed mb-3">
              Having daily logs isn't the same as having <em>defensible</em> daily
              logs. Most crews write down what happened — but they miss the three things
              a lawyer or arbitrator actually looks for: objective corroboration
              (timestamps, weather), jurisdiction-specific triggers (preliminary notice
              windows, lien filing deadlines), and a consistent format that a third
              party can read without knowing the jobsite.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This audit is a human review of your last 90 days by someone who knows
              exactly what those three things look like — and who writes you a plan to
              close every gap before the next pay-application deadline.
            </p>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="section-container">
        <div className="max-w-md mx-auto text-center">
          {status === "success" ? (
            <div className="animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="headline-section text-foreground mb-3">
                Audit slot reserved.
              </h2>
              <p className="body-large mb-4">
                We'll reach out when the DFY audit service opens — beta partners get
                priority access and, like the Crew Plan, the founding rate.
              </p>
              <Link
                to="/crew-plan"
                className="inline-flex items-center justify-center h-14 px-8 bg-primary text-primary-foreground font-bold uppercase tracking-wide text-lg hover:opacity-90 transition-opacity"
                style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow-hard-primary)" }}
              >
                Also reserve a Crew Plan seat <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full mb-6 font-semibold uppercase tracking-wide text-sm">
                <Clock className="w-4 h-4" />
                <span>Coming soon — reserve your slot</span>
              </div>
              <h2 className="headline-section text-foreground mb-3">
                Reserve an audit slot
              </h2>
              <p className="body-large mb-6">
                Drop your email and we'll reach out when the DFY audit service opens.
                No obligation. Beta partners lock the founding rate.
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
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Reserving…</>
                  ) : (
                    <>Reserve My Audit Slot <ArrowRight className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </form>

              {status === "error" && (
                <p className="text-destructive text-sm mt-3">{errorMessage}</p>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                We'll email you once — when the audit service opens. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
