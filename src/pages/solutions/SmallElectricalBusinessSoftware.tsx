import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, Mic, Cloud, Camera, ArrowRight, Shield, DollarSign, Clock, FileText } from "lucide-react";
import { Footer } from "@/components/Footer";

const faqs = [
  {
    question: "Is VoiceLogPro really enough for a small electrical shop?",
    answer: "Yes. Most 1–5 person crews don't need project management, RFIs, or Gantt charts. What they need is consistent documentation that backs up invoices and protects change orders. That's exactly what VoiceLogPro does."
  },
  {
    question: "What if I grow and need more features later?",
    answer: "Cross that bridge when you get there. Most shops stay lean for years. When you have 15+ crew members and dedicated project managers, then consider enterprise tools. Until then, don't pay for features you won't use."
  },
  {
    question: "How is this different from just taking notes on my phone?",
    answer: "Phone notes aren't structured, time-stamped, or professional. VoiceLogPro converts your spoken logs into clean daily reports that look like they came from an established operation — because they did."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. No contracts, no annual commitments. If it's not working for your shop, cancel. But most users find that one documented change order pays for months of service."
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

export default function SmallElectricalBusinessSoftware() {
  return (
    <>
      <Helmet>
        <title>Small Electrical Business Software | VoiceLogPro</title>
        <meta 
          name="description" 
          content="Skip the enterprise software trap. VoiceLogPro gives small electrical shops professional documentation for $49/month. No Procore. No consultants. Just clean logs that protect your margins." 
        />
        <meta name="keywords" content="small electrical business software, electrical contractor software, construction documentation, daily logs, change order protection" />
        <link rel="canonical" href="https://voicelogpro.com/solutions/small-electrical-business-software" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Built for 1–5 Person Crews
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Don't Buy a Ferrari to Drive to the Jobsite.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                You have two electricians. You don't need Procore, PlanHub, or enterprise bidding tools yet. You need a simple way to document work, protect change orders, and get paid — without the enterprise price tag.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/crew-plan">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 font-bold">
                    <DollarSign className="w-5 h-5 mr-2" />
                    See the Crew Plan — $49/month
                  </Button>
                </Link>
                <a href="#what-you-need">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                    See What You Actually Need
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Reality Check Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              The "Big Software" Trap
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-destructive mb-4">The Trap</h3>
                <p className="text-muted-foreground mb-4">
                  New shop owners think they need enterprise bidding platforms to look legitimate.
                </p>
                <p className="text-muted-foreground">
                  These tools cost thousands per year, take months to learn, and solve problems you don't have yet.
                </p>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-primary mb-4">Meanwhile...</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    Daily logs are inconsistent
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    Extra work goes undocumented
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    Change orders get disputed
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    Billable time disappears
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-6 md:p-8 text-center">
              <p className="text-lg md:text-xl font-medium text-foreground">
                Looking professional doesn't come from expensive software.<br />
                <span className="text-primary font-bold">It comes from clean documentation.</span>
              </p>
            </div>
          </div>
        </section>

        {/* The Pivot Section */}
        <section id="what-you-need" className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
              Bidding Wins the Job. Documentation Keeps the Money.
            </h2>
            
            <p className="text-lg text-muted-foreground text-center mb-8 max-w-3xl mx-auto">
              You can win a bid with a spreadsheet or a handshake. But if you can't prove delays, extra work, or site conditions — your margin evaporates.
            </p>
            
            <div className="bg-background border border-border rounded-xl p-6 md:p-8 text-center">
              <p className="text-xl font-bold text-primary">
                VoiceLogPro is built for the 2-person shop, not the enterprise.
              </p>
            </div>
          </div>
        </section>

        {/* Product Fit Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                No Consultants. No Setup Projects. No Learning Curve.
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Voice-First Logging</h3>
                <p className="text-muted-foreground">
                  Your electrician doesn't stop to type. They speak while walking to the truck.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Professional Records</h3>
                <p className="text-muted-foreground">
                  Spoken logs are converted into clean, structured daily reports that back up invoices and change orders.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Change Order Defense</h3>
                <p className="text-muted-foreground">
                  GC asks for extra outlets? Different conduit run? Record it immediately — that's billable work you would have lost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Focus Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              The Only Features You Actually Need.
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-background border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Voice-to-Text Daily Logs</h3>
                    <p className="text-muted-foreground">Done in under a minute, on site.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Cloud className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Automatic Weather Tagging</h3>
                    <p className="text-muted-foreground">Document conditions without checking another app.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Photo Attachments</h3>
                    <p className="text-muted-foreground">Snap blocked access, unfinished work, or completed installs — tied directly to the log.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 border border-border rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <X className="w-5 h-5 text-muted-foreground/50" />
                    <span>No Gantt Charts</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <X className="w-5 h-5 text-muted-foreground/50" />
                    <span>No RFIs</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <X className="w-5 h-5 text-muted-foreground/50" />
                    <span>No Enterprise Bloat</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xl font-bold text-primary text-center">
              Less software. More profit.
            </p>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-secondary/50 border border-border rounded-2xl p-8 md:p-10">
              <blockquote className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
                "I almost spent eight grand on construction management software for my three-man crew. Another contractor told me to stay lean. I use VoiceLogPro for $49 a month, and my invoices get paid faster because everything's documented."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">AR</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">Alex R.</p>
                  <p className="text-muted-foreground text-sm">Electrical Contractor, Phoenix</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              Common Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-background border border-border rounded-xl p-6">
                  <h3 className="font-bold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Stay Lean. Stay Profitable.
            </h2>
            
            <Link to="/crew-plan">
              <Button size="lg" className="text-xl px-10 py-7 font-bold mb-4">
                <DollarSign className="w-6 h-6 mr-2" />
                Get VoiceLogPro — $49/month
              </Button>
            </Link>
            
            <p className="text-muted-foreground">
              Built for the guys doing the work. Cancel anytime.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
