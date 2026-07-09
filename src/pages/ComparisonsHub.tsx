import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { competitors } from "@/content/comparisons";

export default function ComparisonsHub() {
  return (
    <>
      <Helmet>
        <title>Voice Log Pro vs Competitors | Construction Daily Report Comparisons</title>
        <meta name="description" content="See how Voice Log Pro compares to Procore, Buildertrend, Contractor Foreman, JobNimbus, and Knowify. Honest comparisons for subcontractors who need payment protection." />
        <link rel="canonical" href="https://voicelogpro.com/compare" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <section className="section-container max-w-4xl mx-auto py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Voice Log Pro vs Competitors
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Honest, detailed comparisons showing why subcontractors choose Voice Log Pro for payment protection — not just project management.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {competitors.map((comp) => (
              <Link
                key={comp.slug}
                to={`/${comp.slug}-vs-voice-log-pro`}
                className="card-industrial p-6 hover:border-primary/50 transition-colors group block"
              >
                <h2 className="font-display text-xl uppercase text-foreground mb-2 group-hover:text-primary transition-colors">
                  {comp.name} vs. Voice Log Pro
                </h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {comp.intro.substring(0, 150)}...
                </p>
                <div className="flex items-center text-primary text-sm font-semibold">
                  Read full comparison <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/crew-plan">
              <Button size="lg" className="font-semibold">
                Start Protecting Your Payment — $49/month
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
