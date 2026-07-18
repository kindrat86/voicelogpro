import { Helmet } from "react-helmet-async";
import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { Check, Mic, Shield, ChevronRight, Wifi, Image } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trades } from "@/content/trades";

export default function TradePage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/for" replace />;
  const trade = trades.find((t) => t.slug === slug);
  if (!trade) return <Navigate to="/for" replace />;

  const canonical = `https://voicelogpro.com/for/${trade.slug}`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    mainEntity: trade.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{trade.metaTitle}</title>
        <meta name="description" content={trade.metaDescription} />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <JsonLd schema={faqSchema} />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="section-container max-w-4xl mx-auto pt-16 pb-12 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            {trade.h1}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {trade.intro}
          </p>
          <Link to="/crew-plan">
            <Button size="lg" className="font-semibold">
              Start Documenting — $49/month
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </section>

        {/* Pain Points */}
        <section className="section-container bg-secondary/30 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">
              The Documentation Problem for {trade.tradePlural}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Your work is physical. Your documentation shouldn't be.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {trade.painPoints.map((p, i) => (
                <div key={i} className="flex items-start gap-3 bg-background/50 p-4 rounded-lg border border-border">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-xs font-bold">!</span>
                  </div>
                  <p className="text-foreground text-sm">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How VLP Helps */}
        <section className="section-container max-w-4xl mx-auto py-16 px-4">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">
            How VoiceLogPro Helps {trade.tradePlural}
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Purpose-built for the way trades work.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {trade.howVlpHelps.map((h, i) => (
              <div key={i} className="card-industrial p-6">
                <div className="flex items-center gap-3 mb-3">
                  {i === 0 ? (
                    <Mic className="w-5 h-5 text-primary" />
                  ) : i === 1 || i === 4 ? (
                    <Shield className="w-5 h-5 text-primary" />
                  ) : i === 3 ? (
                    <Image className="w-5 h-5 text-primary" />
                  ) : (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                  <p className="text-foreground text-sm font-semibold">{h}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real-World Use Cases */}
        <section className="section-container bg-secondary/30 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">
              Real-World Examples
            </h2>
            
            <div className="space-y-6">
              {trade.useCaseExamples.map((ex, i) => (
                <div key={i} className="bg-background border border-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">The Situation</h3>
                      <p className="text-muted-foreground mb-4">{ex.situation}</p>
                      <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                        <p className="text-foreground text-sm"><span className="font-semibold">How VoiceLogPro Helps:</span> {ex.howVlpHelps}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-container bg-primary/10 py-16 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Built for {trade.tradePlural}. Ready in 30 Seconds.
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Speak your daily report. Get a court-ready PDF. Protect your payment.
          </p>
          <Link to="/crew-plan">
            <Button size="lg" className="font-semibold">
              Get VoiceLogPro — $49/month
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </section>

        {/* FAQ */}
        <section className="section-container max-w-3xl mx-auto py-16 px-4">
          <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {trade.faqs.map((faq, i) => (
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
        </section>

        <Footer />
      </main>
    </>
  );
}
