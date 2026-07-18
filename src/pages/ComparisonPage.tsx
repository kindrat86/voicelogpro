import { Helmet } from "react-helmet-async";
import { useLocation, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { Check, X, Mic, Shield, ChevronRight, FileText, Wifi } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { competitors } from "@/content/comparisons";

const trackCTAClick = (location: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "cta_click", {
      event_category: "conversion",
      event_label: `comparison_${location}`,
    });
  }
};

function ComparisonCTA({ location }: { location: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Link to="/crew-plan" onClick={() => trackCTAClick(location)}>
        <Button variant="cta" size="lg" className="min-h-[60px] text-lg font-bold touch-manipulation active:scale-95 transition-transform duration-100">
          Access VoiceLogPro
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </Link>
      <span className="text-sm text-muted-foreground">Flat $49/month — no per-user fees</span>
    </div>
  );
}

export default function ComparisonPage() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  // These comparison routes are registered as static paths (e.g.
  // /procore-vs-voice-log-pro), not param routes, so useParams() returns no
  // slug. Derive the competitor slug from the pathname instead — works in both
  // the client BrowserRouter and the SSR StaticRouter used for prerendering.
  const slug = pathname.replace(/^\/+/, "").replace(/-vs-voice-log-pro\/?$/, "");
  const comp = competitors.find((c) => c.slug === slug);
  if (!comp) return <Navigate to="/blog" replace />;

  const competitorUrl = `https://${comp.website}`;
  const canonical = `https://voicelogpro.com/${comp.slug}-vs-voice-log-pro`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    mainEntity: comp.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{comp.metaTitle}</title>
        <meta name="description" content={comp.metaDescription} />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <JsonLd schema={faqSchema} />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="section-container max-w-4xl mx-auto text-center pt-16 pb-12 px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            {comp.h1}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {comp.intro}
          </p>
          <ComparisonCTA location="hero" />
        </section>

        {/* What {competitor} Is */}
        <section className="section-container bg-secondary/30 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">What {comp.name} Is</h2>
            <p className="text-muted-foreground text-lg mb-8">
              {comp.builtFor}. {comp.primaryGoal.toLowerCase()}.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-industrial p-6">
                <div className="flex items-center gap-3 mb-4">
                  <X className="w-6 h-6 text-destructive" />
                  <h3 className="font-display text-lg uppercase text-muted-foreground">{comp.name}</h3>
                </div>
                <ul className="space-y-3">
                  {comp.weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-2 text-muted-foreground text-sm">
                      <X className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-sunlight p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Check className="w-6 h-6 text-primary" />
                  <h3 className="font-display text-lg uppercase text-primary">VoiceLogPro</h3>
                </div>
                <ul className="space-y-3">
                  {comp.vlpStrengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-foreground text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Comparison Table */}
        <section className="section-container py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">Quick Comparison</h2>
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border bg-secondary/30">
                    <th className="text-left p-4 font-display uppercase text-sm"></th>
                    <th className="text-center p-4 font-display uppercase text-sm text-muted-foreground">{comp.name}</th>
                    <th className="text-center p-4 font-display uppercase text-sm text-primary">VoiceLogPro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Built For", compVal: comp.builtFor, vlpVal: "Subcontractors" },
                    { label: "Primary Goal", compVal: comp.primaryGoal, vlpVal: "Get you paid" },
                    { label: "Data Ownership", compVal: comp.dataOwnership, vlpVal: "You" },
                    { label: "Pricing", compVal: comp.pricing, vlpVal: "$49/month flat" },
                    { label: "Input Method", compVal: comp.inputMethod, vlpVal: "100% voice" },
                    { label: "Legal Focus", compVal: comp.legalFocus, vlpVal: "Payment & lien defense" },
                    { label: "Best For", compVal: comp.bestFor, vlpVal: "Trade subcontractors" },
                  ].map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className="p-4 font-semibold text-foreground">{row.label}</td>
                      <td className="p-4 text-center text-muted-foreground text-sm">{row.compVal}</td>
                      <td className="p-4 text-center text-primary font-semibold text-sm">{row.vlpVal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Two Philosophies */}
        <section className="section-container bg-secondary/30 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">Two Philosophies of Construction Software</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-industrial p-6">
                <h3 className="font-display text-xl uppercase text-muted-foreground mb-3">Top-Down Oversight ({comp.name})</h3>
                <p className="text-muted-foreground">
                  {comp.name} manages projects from the top down. Data flows from subcontractors to the GC or owner. Your documentation serves their reporting needs, not your payment protection.
                </p>
              </div>
              <div className="card-sunlight p-6">
                <h3 className="font-display text-xl uppercase text-primary mb-3">Bottom-Up Defense (VoiceLogPro)</h3>
                <p className="text-foreground">
                  VoiceLogPro protects subcontractors from the bottom up. You create documentation you own, optimized for legal defense, payment disputes, and lien rights — not a GC's dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Subs Choose VoiceLogPro */}
        <section className="section-container py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">Why Subcontractors Choose VoiceLogPro Over {comp.name}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-industrial p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mic className="w-6 h-6 text-primary" />
                  <h3 className="font-display text-lg uppercase text-foreground">1. Voice-First, Glove-On Usability</h3>
                </div>
                <p className="text-muted-foreground text-sm">Built for crews with tools in their hands. Speak for 30 seconds — VoiceLogPro structures the report automatically.</p>
              </div>
              
              <div className="card-industrial p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="font-display text-lg uppercase text-foreground">2. Lien Right Protection by Design</h3>
                </div>
                <p className="text-muted-foreground text-sm">Engineered to support Texas Property Code Chapter 53, monthly trapping notices, and lien documentation from day one.</p>
              </div>

              <div className="card-industrial p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                  <h3 className="font-display text-lg uppercase text-foreground">3. Court-Ready Evidence</h3>
                </div>
                <p className="text-muted-foreground text-sm">Timestamped, weather-tagged, geolocated PDFs that serve as contemporaneous business records in court and adjudication.</p>
              </div>

              <div className="card-industrial p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wifi className="w-6 h-6 text-primary" />
                  <h3 className="font-display text-lg uppercase text-foreground">4. Works Fully Offline</h3>
                </div>
                <p className="text-muted-foreground text-sm">Capture evidence in basements, mechanical rooms, and remote sites. Syncs automatically when you're back online.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="section-container bg-secondary/30 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">Who This Is (and Isn't) For</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-industrial p-6">
                <h3 className="font-display text-xl uppercase text-muted-foreground mb-4">Use {comp.name} If:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="text-muted-foreground">•</span>
                    You're a GC or owner managing large portfolios
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="text-muted-foreground">•</span>
                    You need enterprise-grade project lifecycle management
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="text-muted-foreground">•</span>
                    You have dedicated admin staff for data entry
                  </li>
                </ul>
              </div>
              
              <div className="card-sunlight p-6">
                <h3 className="font-display text-xl uppercase text-primary mb-4">Use VoiceLogPro If:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-foreground text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    You're a subcontractor protecting your scope and payment
                  </li>
                  <li className="flex items-start gap-2 text-foreground text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    You're tired of unpaid change orders and unfair deductions
                  </li>
                  <li className="flex items-start gap-2 text-foreground text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    You want proof before disputes happen, not after
                  </li>
                  <li className="flex items-start gap-2 text-foreground text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    You want court-ready documentation without admin work
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Mid-page CTA */}
        <section className="section-container bg-primary/10 py-16 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Ready to Own Your Documentation?</h2>
          <ComparisonCTA location="mid" />
        </section>

        {/* FAQ */}
        <section className="section-container py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {comp.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="card-industrial border-none">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Closing */}
        <section className="section-container py-16 text-center">
          <p className="text-2xl md:text-3xl font-display uppercase text-foreground mb-8">
            Payment protection starts with the right tool.
          </p>
          <ComparisonCTA location="bottom" />
        </section>

        <Footer />
      </main>
    </>
  );
}
