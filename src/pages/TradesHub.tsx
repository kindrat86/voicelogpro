import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { trades } from "@/content/trades";
import { JsonLd } from "@/components/JsonLd";

const tradesListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Construction Trades — Daily Report Solutions",
  description: "Voice-first daily construction reports tailored for each trade. Protect your payment with 30-second voice documentation.",
  url: "https://voicelogpro.com/for",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: trades.length,
  itemListElement: trades.map((trade, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `Daily Reports for ${trade.tradePlural}`,
    url: `https://voicelogpro.com/for/${trade.slug}`
  }))
};

export default function TradesHub() {
  return (
    <>
      <Helmet>
        <title>Daily Construction Reports by Trade | VoiceLogPro</title>
        <meta name="description" content="Voice-first daily reports built for electricians, plumbers, HVAC contractors, roofers, and general contractors. Protect your payment with 30-second voice documentation." />
        <link rel="canonical" href="https://voicelogpro.com/for" />
      </Helmet>
      <JsonLd schema={tradesListSchema} />

      <main className="min-h-screen bg-background">
        <section className="section-container max-w-4xl mx-auto py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Daily Reports Built for Your Trade
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            VoiceLogPro is purpose-built for the way trades work. See how your trade benefits from voice-first daily documentation.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {trades.map((trade) => (
              <Link
                key={trade.slug}
                to={`/for/${trade.slug}`}
                className="card-industrial p-6 hover:border-primary/50 transition-colors group block"
              >
                <h2 className="font-display text-xl uppercase text-foreground mb-2 group-hover:text-primary transition-colors">
                  For {trade.tradePlural}
                </h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {trade.intro.substring(0, 150)}...
                </p>
                <div className="flex items-center text-primary text-sm font-semibold">
                  See how it works <ChevronRight className="w-4 h-4 ml-1" />
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
