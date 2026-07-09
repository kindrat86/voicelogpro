import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { howToGuides } from "@/content/how-to-guides";

export default function HowToHub() {
  return (
    <>
      <Helmet>
        <title>How-To Guides for Construction Documentation | Voice Log Pro</title>
        <meta name="description" content="Step-by-step guides on documenting construction delays, protecting lien rights, tracking materials, defending against deductions, and managing change orders." />
        <link rel="canonical" href="https://voicelogpro.com/how-to" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <section className="section-container max-w-4xl mx-auto py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            How-To Guides for Subcontractors
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Practical, step-by-step guides to protect your payment with proper construction documentation.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {howToGuides.map((guide) => (
              <Link
                key={guide.slug}
                to={`/how-to/${guide.slug}`}
                className="card-industrial p-6 hover:border-primary/50 transition-colors group block"
              >
                <h2 className="font-display text-lg uppercase text-foreground mb-2 group-hover:text-primary transition-colors">
                  {guide.h1}
                </h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {guide.intro}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{guide.steps.length} steps</span>
                  <span className="flex items-center text-primary text-sm font-semibold">
                    Read guide <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/crew-plan">
              <Button size="lg" className="font-semibold">
                Start Documenting with Voice Log Pro
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
