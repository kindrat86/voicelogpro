import { Helmet } from "react-helmet-async";
import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { howToGuides } from "@/content/how-to-guides";

export default function HowToPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/how-to" replace />;
  const guide = howToGuides.find((g) => g.slug === slug);
  if (!guide) return <Navigate to="/how-to" replace />;

  return (
    <>
      <Helmet>
        <title>{guide.metaTitle}</title>
        <meta name="description" content={guide.metaDescription} />
        <link rel="canonical" href={`https://voicelogpro.com/how-to/${guide.slug}`} />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Breadcrumb + Hero */}
        <section className="section-container max-w-4xl mx-auto pt-16 pb-8 px-4">
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/how-to" className="hover:text-primary transition-colors">How-To Guides</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground">{guide.h1}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            {guide.h1}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {guide.intro}
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-primary" />
              {guide.steps.length} steps · ~{Math.ceil(guide.steps.length * 1.5)} min read
            </div>
          </div>

          <Link to="/crew-plan">
            <Button size="lg" className="font-semibold">
              Start Using VoiceLogPro — $49/month
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </section>

        {/* Key Points */}
        <section className="section-container bg-secondary/30 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Key Points</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {guide.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="section-container max-w-4xl mx-auto py-16 px-4">
          <h2 className="text-2xl font-display font-bold text-foreground mb-8">Step-by-Step Guide</h2>
          
          <div className="space-y-8">
            {guide.steps.map((step, i) => (
              <div key={i} className="relative pl-12 pb-6 border-l-2 border-primary/30 last:border-l-0 last:pb-0">
                <div className="absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="font-display text-lg uppercase text-foreground mb-2">{step.task}</h3>
                <p className="text-muted-foreground">{step.outcome}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section-container bg-primary/10 py-16 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">Ready to Start Documenting?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            VoiceLogPro makes all of the above automatic. Record your day in 30 seconds.
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
            {guide.faqs.map((faq, i) => (
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
