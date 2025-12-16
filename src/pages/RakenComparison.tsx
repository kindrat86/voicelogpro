import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, Shield, Mic, Clock, FileText, Wifi, ChevronRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const trackCTAClick = (location: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "cta_click", {
      event_category: "conversion",
      event_label: `raken_comparison_${location}`,
    });
  }
  console.log(`CTA clicked: ${location}`);
};

function ComparisonCTA({ location }: { location: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Link to="/crew-plan" onClick={() => trackCTAClick(location)}>
        <Button variant="cta" size="lg" className="min-h-[60px] text-lg font-bold touch-manipulation active:scale-95 transition-transform duration-100">
          Access Voice Log Pro
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </Link>
      <span className="text-sm text-muted-foreground">Redirects to secure paywall</span>
    </div>
  );
}

function ComparisonTable() {
  const rows = [
    { feature: "Built For", raken: "General Contractors", vlp: "Subcontractors" },
    { feature: "Primary Goal", raken: "Monitor job progress", vlp: "Get you paid" },
    { feature: "Input Method", raken: "Typing & forms", vlp: "100% voice" },
    { feature: "Legal Focus", raken: "General compliance", vlp: "Payment & lien defense" },
    { feature: "Data Ownership", raken: "GC", vlp: "You" },
    { feature: "Pricing", raken: "Seat-based", vlp: "$49/month" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left p-4 font-display text-lg uppercase"></th>
            <th className="text-center p-4 font-display text-lg uppercase text-muted-foreground">Raken</th>
            <th className="text-center p-4 font-display text-lg uppercase text-primary">Voice Log Pro</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.feature} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
              <td className="p-4 font-semibold text-foreground">{row.feature}</td>
              <td className="p-4 text-center text-muted-foreground">{row.raken}</td>
              <td className="p-4 text-center text-primary font-semibold">{row.vlp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const faqs = [
  {
    q: "Is Raken good for subcontractors?",
    a: "Raken is designed primarily for General Contractors who need standardized reporting across multiple trades. While subcontractors can use it, the data flows upward to the GC and doesn't provide the legal documentation subcontractors need to protect payment and lien rights.",
  },
  {
    q: "What is the best daily report app for subcontractors?",
    a: "The best daily report app for subcontractors is one that creates legally defensible documentation you own. Voice Log Pro is built specifically for subcontractors—voice-first input, court-ready PDFs with timestamps and weather data, and automatic lien right protection.",
  },
  {
    q: "How do subcontractors protect lien rights?",
    a: "Subcontractors protect lien rights through contemporaneous documentation—daily logs with timestamps, photos, and weather conditions. Voice Log Pro automatically generates this evidence and supports compliance with Texas Property Code Chapter 53 and monthly notice requirements.",
  },
  {
    q: "How do you document delays in construction?",
    a: "Effective delay documentation requires timestamped records created at the time of the event. Voice Log Pro automatically tags every log with time, location, and historical weather data—creating excusable delay evidence that holds up in disputes and adjudications.",
  },
  {
    q: "Is Voice Log Pro a project management tool?",
    a: "No. Voice Log Pro is not project management software. It's a legal defense and compliance engine that converts your voice notes into court-ready documentation. It protects payment, not manages projects.",
  },
];

export default function RakenComparison() {
  return (
    <>
      <Helmet>
        <title>Raken vs Voice Log Pro | Payment Protection for Subcontractors</title>
        <meta
          name="description"
          content="Compare Raken vs Voice Log Pro. Raken is built for GCs. Voice Log Pro is built for subcontractors to create court-ready proof, preserve lien rights, and protect payment—using voice."
        />
        <link rel="canonical" href="https://www.voicelogpro.com/raken-vs-voice-log-pro" />
      </Helmet>

      <main className="min-h-screen bg-background pb-24 md:pb-0">
        {/* Hero */}
        <section className="section-container text-center">
          <h1 className="headline-primary text-foreground mb-6 max-w-4xl mx-auto">
            Raken vs. Voice Log Pro: Why Subcontractors Need Payment Defense — Not Oversight
          </h1>
          <p className="body-large max-w-3xl mx-auto mb-8">
            Raken monitors jobsites for General Contractors. Voice Log Pro protects subcontractors from unpaid work, delay claims, and lost lien rights.
          </p>
          <ComparisonCTA location="hero" />
        </section>

        {/* The Core Difference */}
        <section className="section-container bg-secondary/30">
          <h2 className="headline-section text-foreground mb-8 text-center">The Core Difference</h2>
          <p className="body-large text-center mb-8">There are two philosophies in construction software:</p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="card-industrial">
              <h3 className="font-display text-xl uppercase text-muted-foreground mb-3">Top-Down Management (Raken)</h3>
              <p className="text-muted-foreground">
                Built for General Contractors to standardize reporting across multiple companies and feed centralized systems.
              </p>
            </div>
            <div className="card-sunlight">
              <h3 className="font-display text-xl uppercase text-primary mb-3">Bottom-Up Defense (Voice Log Pro)</h3>
              <p className="text-foreground">
                Built for subcontractors to create legally defensible proof of delays, extra work, and site conditions — automatically, using voice.
              </p>
            </div>
          </div>
        </section>

        {/* Why Raken Fails Subcontractors */}
        <section className="section-container">
          <h2 className="headline-section text-foreground mb-4">Why Raken Fails Subcontractors</h2>
          <p className="body-large mb-8">Raken is a strong tool — for General Contractors.</p>
          <p className="text-foreground font-semibold mb-6">But for subcontractors, it creates three problems:</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex gap-4 items-start">
              <X className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <p className="text-foreground font-semibold">You type. They own the data.</p>
                <p className="text-muted-foreground">Reports flow upward to the GC and rarely help you in disputes.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <X className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <p className="text-foreground font-semibold">Documentation isn't legally optimized.</p>
                <p className="text-muted-foreground">Standardized PDFs don't preserve lien rights or defend delay claims.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <X className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <p className="text-foreground font-semibold">Admin replaces protection.</p>
                <p className="text-muted-foreground">Time spent filling forms doesn't stop unpaid change orders.</p>
              </div>
            </div>
          </div>
          
          <p className="text-foreground font-bold text-lg border-l-4 border-primary pl-4">
            Raken monitors work. It does not protect payment.
          </p>
        </section>

        {/* What Voice Log Pro Does Differently */}
        <section className="section-container bg-secondary/30">
          <h2 className="headline-section text-foreground mb-4">What Voice Log Pro Does Differently</h2>
          <p className="body-large mb-6">Voice Log Pro is not field management software.</p>
          <p className="text-foreground font-semibold text-lg mb-8">
            It is a legal defense and compliance engine designed for Electrical, Plumbing, and HVAC subcontractors.
          </p>
          
          <div className="card-sunlight max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Mic className="w-8 h-8 text-primary" />
              <h3 className="font-display text-2xl uppercase text-foreground">Compliance in Your Pocket</h3>
            </div>
            <p className="text-foreground text-lg mb-4">
              Speak for 30 seconds. Voice Log Pro converts your voice into a court-ready, timestamped PDF.
            </p>
            <p className="text-primary font-bold">No typing. No forms. No chasing foremen.</p>
          </div>
        </section>

        {/* Why Subcontractors Use Voice Log Pro */}
        <section className="section-container">
          <h2 className="headline-section text-foreground mb-8 text-center">Why Subcontractors Use Voice Log Pro</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-industrial">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground">1. Voice-First, Glove-On Usability</h3>
              </div>
              <p className="text-muted-foreground mb-4">Built for crews with tools in their hands.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Speak naturally</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> AI structures the report</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Documentation is done before you leave the site</li>
              </ul>
            </div>

            <div className="card-industrial">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground">2. Automated Delay & Acceleration Defense</h3>
              </div>
              <p className="text-muted-foreground mb-4">Every log is automatically tagged with:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Time & location</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Historical weather (temperature, precipitation)</li>
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">
                This creates excusable delay evidence and protects against constructive acceleration claims.
              </p>
            </div>

            <div className="card-industrial">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground">3. Lien Right Protection by Design</h3>
              </div>
              <p className="text-muted-foreground mb-4">Voice Log Pro is engineered to support:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Texas Property Code Chapter 53</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Monthly notice ("trapping") requirements</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Notice to Owner workflows</li>
              </ul>
              <p className="text-primary font-semibold mt-4 text-sm">
                Most lien rights are lost due to poor documentation — not bad work.
              </p>
            </div>

            <div className="card-industrial">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground">4. Adjudication-Ready Evidence</h3>
              </div>
              <p className="text-muted-foreground mb-4">Creates contemporaneous site diaries courts trust more than memory:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> SOPA adjudications (Australia)</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> "Smash and Grab" disputes (UK)</li>
              </ul>
            </div>

            <div className="card-industrial md:col-span-2 max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground">5. Works Offline — Always</h3>
              </div>
              <p className="text-foreground">
                Basements. Mechanical rooms. Remote sites.<br />
                <span className="text-primary font-semibold">Your evidence is captured even without signal.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Mid-page CTA */}
        <section className="section-container bg-primary/10 text-center">
          <h2 className="headline-section text-foreground mb-6">Ready to Own Your Documentation?</h2>
          <ComparisonCTA location="mid" />
        </section>

        {/* Comparison Table */}
        <section className="section-container">
          <h2 className="headline-section text-foreground mb-8 text-center">Quick Comparison</h2>
          <div className="card-industrial">
            <ComparisonTable />
          </div>
        </section>

        {/* Who This Is For */}
        <section className="section-container bg-secondary/30">
          <h2 className="headline-section text-foreground mb-8 text-center">Who This Is (and Isn't) For</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="card-industrial">
              <h3 className="font-display text-xl uppercase text-muted-foreground mb-4">Use Raken If:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-muted-foreground">•</span>
                  You're a GC managing large multi-trade projects
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-muted-foreground">•</span>
                  You need standardized reporting for ERP systems
                </li>
              </ul>
            </div>
            
            <div className="card-sunlight">
              <h3 className="font-display text-xl uppercase text-primary mb-4">Use Voice Log Pro If:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  You're a subcontractor protecting your scope
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  You're tired of unpaid change orders
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  You want proof before disputes happen
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  You want compliance without admin
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="section-container text-center">
          <p className="text-2xl md:text-3xl font-display uppercase text-foreground mb-8">
            Voice Log Pro is payment insurance for the trades.
          </p>
          
          <h2 className="headline-section text-foreground mb-6">Ready to Protect Your Payment?</h2>
          <ComparisonCTA location="bottom" />
        </section>

        {/* FAQ */}
        <section className="section-container bg-secondary/30">
          <h2 className="headline-section text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="card-industrial border-none">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
