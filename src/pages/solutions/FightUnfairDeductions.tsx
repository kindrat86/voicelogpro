import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TldrSection } from "@/components/TldrSection";
import { Shield, AlertTriangle, CheckCircle2, Quote, DollarSign, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { softwareApplicationSchema, organizationSchema } from "@/seo/softwareSchema";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a deductive change order?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A deductive change order is a contract modification that reduces the contract amount, often used by GCs to claim credits for work they allege was not performed or for supervision fees they claim to have provided."
      }
    },
    {
      "@type": "Question",
      "name": "Can a GC charge a supervision fee if they weren't on site?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "While contracts may allow for supervision fees, these are typically only enforceable when supervision was actually provided. If the GC was not present or did not actively supervise, the subcontractor may have grounds to dispute the charge."
      }
    },
    {
      "@type": "Question",
      "name": "How do I dispute an unfair back charge from a GC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To dispute an unfair back charge, you need contemporaneous documentation proving who was on site, what work was performed, and who actually managed it. Time-stamped daily logs, photos, and written records create defensible evidence."
      }
    },
    {
      "@type": "Question",
      "name": "What documentation do I need to fight a construction credit dispute?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You need time-stamped records showing: who was on site each day, who was NOT on site (especially GC supervision), what work was performed, who managed and coordinated the work, and materials sourced by your crew."
      }
    }
  ]
};

const FightUnfairDeductions = () => {

  return (
    <>
      <Helmet>
        <title>Fight Unfair GC Deductions | Deductive Change Order Defense | VoiceLogPro</title>
        <meta name="description" content="Stop letting GCs slash your invoice with unfair credits. Dispute deductive change orders and supervision fees with timestamped jobsite documentation." />
        <link rel="canonical" href="https://voicelogpro.com/solutions/fight-unfair-gc-deductions" />
        <meta name="keywords" content="deductive change order, construction credit dispute, GC supervision fee, unfair back charges, subcontractor documentation" />
      </Helmet>
      <JsonLd schema={[softwareApplicationSchema, organizationSchema, faqSchema]} />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <p className="text-primary font-medium">Subcontractor Documentation</p>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Stop Letting GCs Slash Your Invoice with Unfair "Credits."
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-3xl">
              Disputes over Deductive Change Orders and so-called "Supervision Fees" cost subcontractors millions every year.
            </p>
            <p className="text-xl text-foreground font-medium mb-8 max-w-3xl">
              If you did the work — or if they didn't supervise it — you shouldn't pay for it.
            </p>
            <p className="text-muted-foreground mb-8">
              Most subs lose because they argue instead of proving.
            </p>
            <Link to="/crew-plan">
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                <Mic className="w-5 h-5 mr-2" />
                Start Recording Evidence
              </Button>
            </Link>
          </div>
        </section>

        {/* TL;DR */}
        <TldrSection summary="If a GC claims you owe a 'credit' for work you self-performed or demands a supervision fee they didn't provide, VoiceLogPro's timestamped daily logs prove who did the work and who was on site — making unfair deductions impossible to sustain." label="Bottom Line" />

        {/* The Problem Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Is Your GC Asking for a Credit on Work You Managed Yourself?
              </h2>
            </div>
            
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg">
                You know how this goes:
              </p>
              
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>GC demands a <strong className="text-foreground">20% markup</strong> or "supervision fee"</li>
                <li>GC claims <strong className="text-foreground">"it's in the contract"</strong></li>
                <li>GC was <strong className="text-foreground">not actually present</strong> on site</li>
                <li>GC was <strong className="text-foreground">not supervising</strong> your crew</li>
                <li>You feel boxed in — and under-documented</li>
              </ul>

              <div className="border-l-4 border-primary pl-6 py-4 my-8 bg-background/50">
                <h3 className="font-semibold text-foreground text-lg mb-2">The Trap</h3>
                <p>
                  Contracts allow supervision fees. But only if supervision was actually provided.
                </p>
              </div>

              <div className="border-l-4 border-destructive pl-6 py-4 bg-background/50">
                <h3 className="font-semibold text-foreground text-lg mb-2">The Reality</h3>
                <p>
                  If they weren't there, they don't get paid. But without proof, the GC controls the narrative.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Don't Argue. Show the Logs.
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              To win a deductive change order or construction credit dispute, you must prove:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground">Who was on site</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground">Who was <strong>not</strong> on site</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground">What work was performed</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground">Who actually managed it</p>
              </div>
            </div>

            <div className="bg-muted/30 border rounded-lg p-6 mb-8">
              <p className="text-lg text-foreground mb-6">
                <strong>VoiceLogPro</strong> allows subcontractors to create defensible, time-stamped jobsite records using short voice notes.
              </p>
              
              <h3 className="font-semibold text-foreground mb-4">Example Log Entries:</h3>
              <div className="space-y-3">
                <div className="bg-background border-l-4 border-primary pl-4 py-2 italic text-muted-foreground">
                  "GC superintendent not on site today."
                </div>
                <div className="bg-background border-l-4 border-primary pl-4 py-2 italic text-muted-foreground">
                  "Materials X, Y, Z sourced directly by our crew."
                </div>
                <div className="bg-background border-l-4 border-primary pl-4 py-2 italic text-muted-foreground">
                  "Crew of three installed vanity — no GC coordination or supervision."
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <p className="font-semibold text-foreground">Automatic timestamps</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="font-semibold text-foreground">GPS location tagging</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="font-semibold text-foreground">Immutable daily logs</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="font-semibold text-foreground">Searchable transcripts</p>
              </div>
            </div>

            <p className="text-center text-muted-foreground mt-6 italic">
              Documentation for disputes, not productivity tracking.
            </p>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="border rounded-lg p-8 bg-muted/20">
              <Quote className="h-10 w-10 text-primary mb-6" />
              <blockquote className="text-xl text-foreground mb-6 leading-relaxed">
                "GC tried to hit us with a $5,000 credit for 'supervision and coordination' on a bathroom rough-in. Said it was standard. I pulled up three weeks of VoiceLogPro transcripts — every single one noted 'GC superintendent not present.' Sent them over. Never heard about that credit again."
              </blockquote>
              <div>
                <p className="font-bold text-foreground">Marcus D.</p>
                <p className="text-muted-foreground">Plumbing Foreman, Commercial Projects</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            
            <dl className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">What is a deductive change order?</dt>
                <dd className="text-muted-foreground mt-2">
                  A deductive change order is a contract modification that reduces the contract amount, often used by GCs to claim credits for work they allege was not performed or for supervision fees they claim to have provided.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">Can a GC charge a supervision fee if they weren't on site?</dt>
                <dd className="text-muted-foreground mt-2">
                  While contracts may allow for supervision fees, these are typically only enforceable when supervision was actually provided. If the GC was not present or did not actively supervise, the subcontractor may have grounds to dispute the charge.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">How do I dispute an unfair back charge from a GC?</dt>
                <dd className="text-muted-foreground mt-2">
                  To dispute an unfair back charge, you need contemporaneous documentation proving who was on site, what work was performed, and who actually managed it. Time-stamped daily logs, photos, and written records create defensible evidence.
                </dd>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <dt className="font-semibold text-foreground text-lg">What documentation do I need to fight a construction credit dispute?</dt>
                <dd className="text-muted-foreground mt-2">
                  You need time-stamped records showing: who was on site each day, who was NOT on site (especially GC supervision), what work was performed, who managed and coordinated the work, and materials sourced by your crew.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <DollarSign className="h-12 w-12 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Protect Your Profit.
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ongoing protection that works silently in the background. Built for disputes, not busywork.
            </p>
            <Link to="/crew-plan">
              <Button size="lg" className="font-semibold text-lg px-8 py-6">
                Get VoiceLogPro — $49/month
              </Button>
            </Link>
            <p className="text-muted-foreground mt-4">
              Cheaper than a single unfair back charge.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> VoiceLogPro provides documentation tools to support your record-keeping. This information is for educational purposes only and does not constitute legal advice. Consult a licensed attorney for specific guidance on contract disputes and construction law.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default FightUnfairDeductions;