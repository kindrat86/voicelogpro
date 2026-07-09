import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Mic, Clock, Shield, FileText, WifiOff, ChevronRight } from "lucide-react";
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
      event_label: `fieldwire_comparison_${location}`,
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
    { feature: "Primary Goal", fieldwire: "Manage tasks & plans", vlp: "Get paid for work & delays" },
    { feature: "User Experience", fieldwire: "Complex UI (pins, plans, boards)", vlp: "One-button voice recording" },
    { feature: "Data Entry", fieldwire: "Typing, tagging, pinning", vlp: "Voice-to-text with AI" },
    { feature: "Legal Value", fieldwire: "Shows intent", vlp: "Proves reality" },
    { feature: "Connectivity", fieldwire: "Requires sync", vlp: "Works fully offline" },
    { feature: "Data Ownership", fieldwire: "Usually GC-controlled", vlp: "Subcontractor-owned" },
    { feature: "Pricing", fieldwire: "Per-user, scales up", vlp: "Flat $49/month" },
    { feature: "Best For", fieldwire: "Plans & punch lists", vlp: "Daily logs & change orders" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left p-4 font-display text-lg uppercase"></th>
            <th className="text-center p-4 font-display text-lg uppercase text-muted-foreground">Fieldwire</th>
            <th className="text-center p-4 font-display text-lg uppercase text-primary">Voice Log Pro</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.feature} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
              <td className="p-4 font-semibold text-foreground">{row.feature}</td>
              <td className="p-4 text-center text-muted-foreground">{row.fieldwire}</td>
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
    q: "Is Fieldwire good for subcontractors?",
    a: "Fieldwire is a powerful project management tool primarily designed for General Contractors. While subcontractors can use it, the complex interface (pins, plans, task boards) often feels like extra admin work. It doesn't create the legal documentation subcontractors need to protect payment and lien rights.",
  },
  {
    q: "What is the best Fieldwire alternative for subcontractors?",
    a: "For subcontractors focused on payment protection rather than project management, Voice Log Pro is the best alternative. It creates court-ready documentation in seconds using voice—no typing, no pins, no plan navigation required.",
  },
  {
    q: "How do subcontractors document delays?",
    a: "Effective delay documentation requires contemporaneous records with timestamps, weather data, and specific details. Voice Log Pro automatically captures this information with every voice log, creating excusable delay evidence that holds up in disputes.",
  },
  {
    q: "How do subcontractors protect lien rights?",
    a: "Lien rights are protected through proper documentation of work performed, materials delivered, and timeline compliance. Voice Log Pro is engineered to support Texas 'Monthly Trapping' requirements and jurisdiction-specific notice deadlines—the documentation most subcontractors miss.",
  },
  {
    q: "Is Voice Log Pro project management software?",
    a: "No. Voice Log Pro is not project management software and doesn't compete with Fieldwire. It's a legal defense and payment protection tool that converts voice notes into court-ready PDFs with timestamps and weather data.",
  },
];

export default function FieldwireComparison() {
  return (
    <>
      <Helmet>
        <title>Fieldwire vs Voice Log Pro | Payment Protection for Subcontractors</title>
        <meta
          name="description"
          content="Compare Fieldwire vs Voice Log Pro. Fieldwire manages plans and tasks. Voice Log Pro protects subcontractors with court-ready voice logs, lien defense, and delay documentation."
        />
        <link rel="canonical" href="https://voicelogpro.com/fieldwire-vs-voice-log-pro" />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="section-container text-center">
          <h1 className="headline-primary text-foreground mb-6 max-w-4xl mx-auto">
            Fieldwire vs. Voice Log Pro: Managing the Job vs. Protecting the Paycheck
          </h1>
          <p className="body-large max-w-3xl mx-auto mb-8">
            Fieldwire helps manage the project.<br />
            Voice Log Pro protects subcontractors from unpaid work, delay claims, and lost lien rights.
          </p>
          <ComparisonCTA location="hero" />
        </section>

        {/* Two Tools, Two Problems */}
        <section className="section-container bg-secondary/30">
          <h2 className="headline-section text-foreground mb-8 text-center">Two Tools. Two Completely Different Problems.</h2>
          <p className="body-large text-center mb-8">Fieldwire and Voice Log Pro are not competitors — they solve fundamentally different problems.</p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            <div className="card-industrial">
              <p className="text-lg text-muted-foreground"><span className="text-foreground font-semibold">Fieldwire</span> is a Project Operating System.</p>
            </div>
            <div className="card-sunlight">
              <p className="text-lg text-foreground"><span className="text-primary font-semibold">Voice Log Pro</span> is a Legal Defense Weapon.</p>
            </div>
          </div>
          
          <p className="text-center text-foreground text-lg">
            Fieldwire is excellent for seeing <strong>what needs to be done</strong>.<br />
            Voice Log Pro is built to prove <strong>what was actually done</strong> — and why it took longer.
          </p>
        </section>

        {/* Fieldwire Section */}
        <section className="section-container">
          <h2 className="headline-section text-foreground mb-4">Fieldwire — The Digital Jobsite Headquarters</h2>
          <p className="body-large mb-6">Fieldwire is a comprehensive project management platform designed to replace paper plans and coordinate teams.</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card-industrial">
              <h3 className="font-display text-lg uppercase text-muted-foreground mb-2">Target Audience</h3>
              <p className="text-foreground">General Contractors, Project Managers, Architects</p>
            </div>
            <div className="card-industrial">
              <h3 className="font-display text-lg uppercase text-muted-foreground mb-2">Core Function</h3>
              <p className="text-foreground">Plan viewing, task management, issue tracking</p>
            </div>
          </div>

          <div className="card-industrial mb-8">
            <h3 className="font-display text-xl uppercase text-foreground mb-4">The "Tax" on Subcontractors</h3>
            <p className="text-muted-foreground mb-4">For subcontractors, Fieldwire often feels like homework:</p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li>• Navigating complex menus</li>
              <li>• Dropping pins on plan sheets</li>
              <li>• Tagging photos to coordinates</li>
              <li>• Managing task boards</li>
            </ul>
            <p className="text-foreground font-semibold">All of this pulls a foreman away from running the crew.</p>
          </div>

          <div className="card-industrial">
            <h3 className="font-display text-xl uppercase text-foreground mb-4">Key Strengths</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-muted-foreground" /> Live plan viewing with version control</li>
              <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-muted-foreground" /> Task and punch list management</li>
              <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-muted-foreground" /> BIM model viewing on mobile</li>
            </ul>
            <p className="text-muted-foreground">
              Fieldwire helps you understand <strong className="text-foreground">what to do</strong>.<br />
              It does not help you prove <strong className="text-foreground">why you deserve to be paid more</strong>.
            </p>
          </div>
        </section>

        {/* Voice Log Pro Section */}
        <section className="section-container bg-secondary/30">
          <h2 className="headline-section text-foreground mb-4">Voice Log Pro — The Subcontractor's Black Box</h2>
          <p className="body-large mb-6">Voice Log Pro removes reporting friction entirely.</p>
          <p className="text-foreground text-lg mb-8">
            It's designed for electrical, plumbing, and HVAC foremen who don't have time to type — and can't afford to forget delay details.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="card-sunlight">
              <h3 className="font-display text-lg uppercase text-primary mb-2">Target Audience</h3>
              <p className="text-foreground">Subcontractors, Foremen, Independent Trades</p>
            </div>
            <div className="card-sunlight">
              <h3 className="font-display text-lg uppercase text-primary mb-2">Core Function</h3>
              <p className="text-foreground">Payment protection and dispute defense</p>
            </div>
          </div>
        </section>

        {/* Why Subcontractors Choose Voice Log Pro */}
        <section className="section-container">
          <h2 className="headline-section text-foreground mb-8 text-center">Why Subcontractors Choose Voice Log Pro</h2>
          
          <div className="space-y-6">
            <div className="card-industrial">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground">1. Speed Over Structure</h3>
              </div>
              <p className="text-muted-foreground mb-4">Instead of clicking through plans and pins, a foreman says:</p>
              <blockquote className="border-l-4 border-primary pl-4 text-foreground italic mb-4">
                "Blocked in Zone A by framing crew. Standby for two hours."
              </blockquote>
              <p className="text-primary font-semibold">Voice Log Pro instantly converts this into a claim-ready, structured report.</p>
            </div>

            <div className="card-industrial">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground">2. Excusable Delay Defense</h3>
              </div>
              <p className="text-muted-foreground mb-4">Every voice log automatically captures:</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Timestamp</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Location</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Hyper-local weather data</li>
              </ul>
              <p className="text-muted-foreground">
                This creates independent proof for weather delays and protects against <strong className="text-foreground">constructive acceleration claims</strong>, especially in strict markets like data centers and fast-track jobs.
              </p>
            </div>

            <div className="card-industrial">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground">3. Lien Right Security</h3>
              </div>
              <p className="text-muted-foreground mb-4">Fieldwire reports are generic.</p>
              <p className="text-foreground mb-4">Voice Log Pro logs are engineered to support:</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Texas "Monthly Trapping Mechanism"</li>
                <li className="flex items-center gap-2 text-foreground"><Check className="w-4 h-4 text-primary" /> Jurisdiction-specific lien notice requirements</li>
              </ul>
              <p className="text-primary font-semibold">Missed documentation is the #1 reason subcontractors lose lien rights.</p>
            </div>

            <div className="card-industrial">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground">4. Private Evidence Ownership</h3>
              </div>
              <p className="text-muted-foreground mb-4">Fieldwire data is typically owned by the GC.</p>
              <p className="text-foreground">
                Voice Log Pro keeps the evidence in the <strong>subcontractor's control</strong>, ensuring you have your own paper trail when disputes happen.
              </p>
            </div>

            <div className="card-industrial">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <WifiOff className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg uppercase text-foreground">5. Adjudication-Ready by Default</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Courts in the UK and Australia prioritize contemporaneous site diaries over retroactive task lists.
              </p>
              <p className="text-primary font-semibold">Voice Log Pro automatically creates this evidentiary standard.</p>
            </div>
          </div>
        </section>

        {/* Mid-page CTA */}
        <section className="section-container bg-primary/10 text-center">
          <h2 className="headline-section text-foreground mb-6">Ready to Own Your Evidence?</h2>
          <ComparisonCTA location="mid" />
        </section>

        {/* Comparison Table */}
        <section className="section-container">
          <h2 className="headline-section text-foreground mb-8 text-center">Quick Comparison</h2>
          <div className="card-industrial">
            <ComparisonTable />
          </div>
        </section>

        {/* Strategic Verdict */}
        <section className="section-container bg-secondary/30">
          <h2 className="headline-section text-foreground mb-8 text-center">Strategic Verdict</h2>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="card-industrial">
              <p className="text-lg text-foreground mb-2"><strong>Use Fieldwire to build the building.</strong></p>
              <p className="text-muted-foreground">It's indispensable for plans, coordination, and punch lists.</p>
            </div>
            
            <div className="card-sunlight">
              <p className="text-lg text-foreground mb-2"><strong>Use Voice Log Pro to protect the business.</strong></p>
              <p className="text-foreground">It's the only tool that lets a foreman generate legally defensible proof in under 60 seconds a day.</p>
            </div>
            
            <div className="border-l-4 border-primary pl-6 py-4">
              <p className="text-foreground text-lg">
                <strong>For subcontractors:</strong><br />
                Fieldwire tells you <span className="text-muted-foreground">what to do</span>.<br />
                Voice Log Pro ensures you <span className="text-primary font-semibold">get paid for doing it</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="section-container text-center">
          <p className="text-2xl md:text-3xl font-display uppercase text-foreground mb-8">
            Voice Log Pro is payment insurance for the trades.
          </p>
          
          <h2 className="headline-section text-foreground mb-6">Ready to Protect Your Paycheck?</h2>
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
