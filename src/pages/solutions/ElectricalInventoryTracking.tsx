import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Mic, Package, ClipboardCheck, TrendingDown, Hand, Quote } from "lucide-react";

const faqs = [
  {
    question: "How does Voice Log Pro handle electrical material naming?",
    answer: "The system recognizes standard electrical terminology — MC cable, Romex, mud rings, wire nuts, breakers, and more. Foremen speak naturally, and the system structures it into usable material records."
  },
  {
    question: "Can I separate rough-in materials from trim materials?",
    answer: "Yes. Each log is time-stamped and can be tagged by phase. Your office sees exactly what went into rough-in versus trim, which improves job costing accuracy."
  },
  {
    question: "Will my foremen actually use this?",
    answer: "That's the entire point. One large button, no typing, no menus. Press, speak, done. If they can make a phone call, they can log materials."
  },
  {
    question: "Does this replace my existing inventory system?",
    answer: "No. Voice Log Pro captures field usage data in real-time. It feeds accurate information into whatever system you already use for purchasing and inventory management."
  },
  {
    question: "How quickly does the office see the logs?",
    answer: "Instantly. Logs sync the moment they're recorded. No waiting for end-of-day reports or chasing foremen for counts."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

export default function ElectricalInventoryTracking() {
  return (
    <>
      <Helmet>
        <title>Field-First Material Log for Electrical Shops | Voice Log Pro</title>
        <meta 
          name="description" 
          content="Stop chasing foremen for material counts. Voice Log Pro captures electrical material usage in the field — no typing, no spreadsheets, no end-of-day guessing." 
        />
        <link rel="canonical" href="https://voicelogpro.com/solutions/electrical-inventory-tracking" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Stop Chasing Foremen for Material Counts.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Your shop is growing, but your field reporting isn't. Stop forcing crews to type into inventory apps they hate. Let them speak — and get usable data instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                <Link to="/crew-plan">Get Voice Log Pro</Link>
              </Button>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                See How It Works in 30 Seconds →
              </a>
            </div>
          </div>
        </section>

        {/* Real Talk Section - The "All-in-One" Trap */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              The "All-in-One" Trap
            </h2>
            
            <div className="space-y-8">
              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">The Problem:</h3>
                <p className="text-muted-foreground text-lg">
                  You're looking for one system to handle scheduling, tools, materials, and reports — because growth is getting messy.
                </p>
              </div>
              
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-destructive mb-3">The Reality:</h3>
                <p className="text-muted-foreground text-lg mb-4">
                  Most "all-in-one" platforms fail in the field.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Too many menus</li>
                  <li>• Too much typing</li>
                  <li>• If foremen don't use it, the data is worthless</li>
                </ul>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-primary mb-3">The Fix:</h3>
                <p className="text-muted-foreground text-lg mb-4">
                  Use the best tool for each job:
                </p>
                <ul className="space-y-2 text-foreground font-medium">
                  <li>Plans → Fieldwire</li>
                  <li>Tools → ShareMyToolbox</li>
                  <li>Material usage → Voice Log Pro</li>
                </ul>
              </div>
            </div>
            
            <p className="text-center text-lg font-medium text-foreground mt-10">
              Accurate material data starts in the field — not the office.
            </p>
          </div>
        </section>

        {/* Core Solution - Voice-to-Inventory */}
        <section id="how-it-works" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Inventory Tracking Without Data Entry
              </h2>
              <p className="text-xl text-muted-foreground">
                No forms. No spreadsheets. No end-of-day guessing.
              </p>
            </div>
            
            <div className="bg-muted/30 border border-border rounded-xl p-8 mb-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">A foreman finishes a rough-in and says:</h3>
                  <blockquote className="text-lg text-muted-foreground italic border-l-4 border-primary/50 pl-4">
                    "Used 1,000 feet of 12/2 MC, 50 mud rings, 300 wire nuts."
                  </blockquote>
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">What happens next:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <ClipboardCheck className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Speech is converted into structured material records</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Logs are time-stamped and job-tagged</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">The office sees it instantly — clean and readable</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Operational Value */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
              Why This Actually Matters
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {[
                "Know what material went into which phase (rough-in vs trim)",
                "Reduce over-ordering and shortages",
                "Improve job costing accuracy",
                "Catch waste before it kills margins",
                "Stop relying on memory and texts"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-background p-5 rounded-lg border border-border">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            
            <p className="text-center text-lg font-medium text-foreground bg-primary/5 border border-primary/20 rounded-lg p-6">
              If material isn't logged at the moment it's used, it won't be logged accurately later.
            </p>
          </div>
        </section>

        {/* Foreman Approved Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <Hand className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Built for Gloved Hands.
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-6 bg-muted/30 rounded-lg border border-border">
                <p className="text-lg font-medium text-foreground">No drop-downs</p>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg border border-border">
                <p className="text-lg font-medium text-foreground">No tiny checkboxes</p>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg border border-border">
                <p className="text-lg font-medium text-foreground">No typing on a dusty phone</p>
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
              <p className="text-xl font-semibold text-foreground mb-4">
                One large button. Press. Speak. Done.
              </p>
              <p className="text-muted-foreground">
                This is the only kind of system foremen will actually use — consistently.
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-background border border-border rounded-xl p-8 md:p-10">
              <Quote className="w-10 h-10 text-primary/30 mb-4" />
              <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-6">
                "We tried forcing a full inventory app on our guys. Nobody used it. We switched to Voice Log Pro, and now we get accurate material logs every day — without chasing anyone."
              </blockquote>
              <footer className="text-muted-foreground font-medium">
                — Mark D., Master Electrician
              </footer>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
              Common Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-28 bg-primary/5">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Close the Inventory Gap.
            </h2>
            
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg mb-4">
              <Link to="/crew-plan">Get Voice Log Pro</Link>
            </Button>
            
            <p className="text-muted-foreground">
              Accurate material logs start on day one — not after training sessions.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
