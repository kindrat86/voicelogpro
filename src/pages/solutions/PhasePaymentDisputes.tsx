import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Clock, Cloud, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";

const PhasePaymentDisputes = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a phase payment dispute in construction?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A phase payment dispute occurs when a contractor bills for a construction phase claimed as complete, but the work fails inspection, remains unfinished, or doesn't match contract specifications. Property owners often face pressure to release funds before verification."
        }
      },
      {
        "@type": "Question",
        "name": "How do I prove a contractor billed for incomplete work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Timestamped site documentation with photos, voice logs, and GPS location data creates irrefutable evidence of actual site conditions. Voice Log Pro generates immutable records that show exactly what existed—or didn't—at any point during construction."
        }
      },
      {
        "@type": "Question",
        "name": "Can subcontractors use Voice Log Pro to protect against GC disputes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Subcontractors use Voice Log Pro to document daily progress, creating separation between their completed work and upstream failures. When a GC is terminated, subcontractor evidence remains intact for payment claims."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if the contractor alters or removes work after I document it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Voice Log Pro syncs instantly to the cloud. Even if work is altered, damaged, or removed after documentation, the timestamped record of what existed remains intact and dispute-ready."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Phase Payment Disputes | Construction Dispute Defense Kit | Voice Log Pro</title>
        <meta 
          name="description" 
          content="Stop contractors billing for incomplete work. Voice Log Pro creates timestamped site evidence for phase payment disputes, failed inspections, and unauthorized change orders." 
        />
        <meta name="keywords" content="phase payment dispute, construction billing dispute, contractor incomplete work, failed inspection documentation, change order abuse" />
        <link rel="canonical" href="https://voicelogpro.com/solutions/phase-payment-disputes" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="text-xl font-bold text-foreground">
              Voice Log Pro
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-6">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Construction Dispute Defense Kit</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Is Your Contractor Demanding Payment for Work They Haven't Done?
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                From unauthorized five-figure change orders to billing for "completed" phases that failed inspection — stop the bleeding with irrefutable, timestamped site evidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                  <Link to="/crew-plan">Start Documenting Now — Free</Link>
                </Button>
                <a href="#how-it-protects" className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                  See How It Protects You in a Dispute →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Reality Check Section - The Phase Payment Trap */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-12">
                The "Phase Payment" Trap
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* GC Narrative */}
                <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-muted-foreground mb-4">What the GC Says</h3>
                  <blockquote className="text-xl md:text-2xl font-medium text-foreground italic border-l-4 border-primary pl-4">
                    "Interior framing is complete. We need the $90,000 phase release."
                  </blockquote>
                </div>
                
                {/* Reality */}
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-destructive mb-4">What's Actually Happening</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-foreground">Shear walls not signed off</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-foreground">Roofing failed inspection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-foreground">Phase labeled "complete" only on the invoice</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-foreground">Your money is being used to fix their mistakes</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-center text-lg md:text-xl font-medium text-foreground mt-10 bg-card border border-border rounded-lg p-6">
                Once you pay, leverage is gone.
              </p>
            </div>
          </div>
        </section>

        {/* Core Insight Section */}
        <section id="how-it-protects" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
                Opinions Don't Stop Invoices. Evidence Does.
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Courts, inspectors, attorneys, and insurers don't care what was said. They care what was documented, when, and by whom.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Time-Stamped Witness</h3>
                  <p className="text-sm text-muted-foreground">Every log locked to the exact moment it was recorded.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Chain-of-Custody Record</h3>
                  <p className="text-sm text-muted-foreground">Immutable logs that can't be altered or backdated.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <FileCheck className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Dispute-Ready Evidence</h3>
                  <p className="text-sm text-muted-foreground">Not a diary. A legal-grade site record.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-4">
                He Said / She Said Fails. Site Logs Don't.
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Voice Log Pro turns your phone into a dispute-ready documentation system.
              </p>
              
              <div className="space-y-8">
                {/* Feature 1 */}
                <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                  <h3 className="text-xl font-bold text-foreground mb-3">Instant Site Documentation</h3>
                  <p className="text-muted-foreground mb-4">
                    Walk the site and dictate exactly what exists — or doesn't.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm text-foreground">
                    "Framing incomplete in master bath. No inspector tag on shear wall. Roofing underlayment missing."
                  </div>
                </div>
                
                {/* Feature 2 */}
                <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                  <h3 className="text-xl font-bold text-foreground mb-3">Change Order Defense</h3>
                  <p className="text-muted-foreground mb-4">
                    The moment cost is mentioned verbally, record it.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm text-foreground">
                    "GC requested plumbing relocation. Reminded him contract requires written approval over $500. No approval given."
                  </div>
                </div>
                
                {/* Feature 3 */}
                <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <Cloud className="h-8 w-8 text-primary shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Anti-Retaliation Protection</h3>
                      <p className="text-muted-foreground">
                        Logs sync instantly to the cloud. Even if work is altered, damaged, or removed — the record of what existed remains intact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* High-Intent Education Block */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-10">
                What This Protects You From
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Paying for failed inspections",
                  "Funding rework you didn't authorize",
                  "Being pressured under artificial deadlines",
                  "Losing leverage after phase release",
                  '"Verbal approvals" that never existed'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-lg md:text-xl font-bold text-foreground mt-10 bg-primary/10 rounded-lg p-6">
                If it isn't logged, it didn't happen.
              </p>
            </div>
          </div>
        </section>

        {/* Subcontractors Section */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
                Subcontractors: Caught in the Crossfire?
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                If the GC billed the owner for your work but hasn't paid you, documentation protects you too.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-2">Daily Proof of Progress</h3>
                  <p className="text-sm text-muted-foreground">Every task documented as it happens.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-2">Direct, Timestamped Logs</h3>
                  <p className="text-sm text-muted-foreground">Your record, independent of the GC's narrative.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-2">Clear Separation</h3>
                  <p className="text-sm text-muted-foreground">What you completed vs. what failed upstream.</p>
                </div>
              </div>
              
              <p className="text-lg font-medium text-foreground bg-card border border-border rounded-lg p-6">
                When the GC gets fired, your evidence still stands.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                {faqSchema.mainEntity.map((faq: { name: string; acceptedAnswer: { text: string } }, index: number) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-3">{faq.name}</h3>
                    <p className="text-muted-foreground">{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
                Don't Write Another Check Without Proof.
              </h2>
              
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg mb-4">
                <Link to="/crew-plan">
                  Get Voice Log Pro — Monthly Protection Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <p className="text-muted-foreground">
                When thousands are on the line, evidence costs less than silence.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PhasePaymentDisputes;