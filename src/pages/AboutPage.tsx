import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About VoiceLogPro",
  description:
    "Learn about VoiceLogPro — the voice-to-PDF daily construction log app built by subcontractors, for subcontractors.",
  mainEntity: { "@type": "Organization", "@id": "https://voicelogpro.com/#organization" },
  significantLink: [
    "https://voicelogpro.com/",
    "https://voicelogpro.com/crew-plan",
    "https://voicelogpro.com/blog",
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://voicelogpro.com/#organization",
  name: "VoiceLogPro",
  url: "https://voicelogpro.com",
  logo: "https://voicelogpro.com/images/og-card.jpg",
  description:
    "VoiceLogPro builds voice-first daily reporting tools for construction subcontractors. Specializing in compliance documentation for Texas Property Code Chapter 53, NSW SOPA adjudications, and UK Building Safety Act Golden Thread requirements.",
  disambiguatingDescription:
    "VoiceLogPro is a voice-to-PDF daily construction log app (voice on-site → timestamped, court-admissible daily-report PDF) — not a general-purpose meeting/voice-transcription tool (Otter, Rev, Fireflies), and not a full construction-management platform (Procore, Raken).",
  foundingDate: "2024",
  sameAs: [
    "https://github.com/kindrat86",
    "https://x.com/sipiteno",
    "https://x.com/data_nerd",
    "https://www.linkedin.com/in/kushnir-maryan/",
    "https://sipiteno.com",
    "https://invisibleexit.com",
    "https://signals.gitdealflow.com",
    "https://sanctionsai.dev",
    "https://www.indiehackers.com/product/unlock-saas"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hello@voicelogpro.com",
    url: "https://voicelogpro.com/contact",
    availableLanguage: ["English"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://voicelogpro.com/" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://voicelogpro.com/about" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About VoiceLogPro — Voice-to-PDF Daily Construction Reports</title>
        <meta
          name="description"
          content="VoiceLogPro turns voice notes into court-ready daily construction reports. Built by subcontractors who learned that missing daily reports cost more than bad work. Learn our story."
        />
        <link rel="canonical" href="https://voicelogpro.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voicelogpro.com/about" />
        <meta property="og:title" content="About VoiceLogPro — Voice-to-PDF Daily Construction Reports" />
        <meta
          property="og:description"
          content="VoiceLogPro turns voice notes into court-ready daily construction reports. Built by subcontractors who learned that missing reports cost more than bad work."
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/gpt-engineer-file-uploads/4B8rhitxuFfh01PdeqSXDugsqvg2/social-images/social-1765892945744-VoiceLogProFavicon.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About VoiceLogPro" />
        <meta
          name="twitter:description"
          content="Voice-to-PDF daily reports built by subcontractors who learned the hard way."
        />
      </Helmet>

      <JsonLd schema={[organizationSchema, breadcrumbSchema, aboutSchema]} />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
            <Link
              to="/"
              className="font-display text-2xl uppercase text-foreground hover:text-primary transition-colors"
            >
              VoiceLogPro
            </Link>
            <nav className="flex gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/crew-plan" className="text-muted-foreground hover:text-foreground transition-colors">
                Crew Plan
              </Link>
              <Link to="/about" className="text-primary font-semibold">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-xs uppercase tracking-wider text-primary font-bold mb-4">About VoiceLogPro</p>
          <h1 className="font-display text-4xl md:text-6xl uppercase text-foreground mb-6 leading-tight">
            Built for the <span className="text-primary">crew</span> who works with their hands
          </h1>
          <p className="text-sm font-semibold text-primary max-w-2xl mx-auto mb-4">
            <strong>TL;DR:</strong> VoiceLogPro was built on actual jobsites by an electrical foreman who got tired
            of fighting backcharges. It turns voice notes into court-ready daily construction reports —
            timestamped, weather-tagged, and formatted as PDFs. One price: $49/month for the whole crew.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            VoiceLogPro turns voice notes into timestamped, court-ready daily construction reports.
            It was built by subcontractors who learned the hard way that what kills your pay isn't bad
            work — it's late or missing paperwork.
          </p>
        </section>

        {/* The Problem */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="font-display text-3xl uppercase text-foreground mb-8 text-center">The Problem We Solve</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-primary font-display text-3xl mb-3">01</div>
              <h3 className="font-bold text-foreground mb-2">Missing Reports Cost You</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A GC can't bill for work you didn't document. Without a daily log, the hours disappear.
                One missed report can cost an entire day's labor.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-primary font-display text-3xl mb-3">02</div>
              <h3 className="font-bold text-foreground mb-2">Typing Doesn't Work On-Site</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Foremen don't sit at desks. They're pulling wire, running pipe, or on a roof. Voice notes
                are the only way to document without putting down the tools.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-primary font-display text-3xl mb-3">03</div>
              <h3 className="font-bold text-foreground mb-2">Courts Demand Contemporaneous Records</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In lien disputes and payment claims, the party with timestamped daily logs wins.
                After-the-fact recollections don't hold up in adjudication.
              </p>
            </div>
          </div>
        </section>

        {/* The Story / Epiphany */}
        <section className="bg-card border-y border-border py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-display text-3xl uppercase text-foreground mb-6 text-center">The Story</h2>
            <div className="border-l-4 border-primary pl-6 py-4 mb-8">
              <p className="text-lg text-foreground font-semibold italic leading-relaxed">
                "What killed our pay wasn't bad work. It was late or missing daily reports. I watched
                40 hours of electrical work disappear because nobody documented it happened. That's when
                I knew we needed a tool that worked the same way we do — with our voices."
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              VoiceLogPro was born on actual jobsites — not in a Silicon Valley accelerator. The
              founder was an electrical foreman who got tired of fighting backcharges and defending
              completed work against GCs who claimed it never happened.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              After researching the legal frameworks — Texas Property Code Chapter 53, the NSW
              Security of Payment Act, the UK Building Safety Act — it became clear that contemporaneous
              daily logs are the single most important piece of evidence in any payment dispute. The
              problem was that nobody had time to type them. VoiceLogPro was built to solve that.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-display text-3xl uppercase text-foreground mb-8 text-center">What VoiceLogPro Does</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-2">&#127897; Voice-to-PDF in 30 Seconds</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hit record, speak your day, and get a professional PDF with timestamps, weather data,
                and crew details. No typing required.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-2">&#128274; Court-Ready Documentation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Timestamped, geolocated, and formatted for legal use. Supports Texas Chapter 53, NSW
                SOPA adjudications, and UK Golden Thread compliance.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-2">&#127748; Automatic Weather &amp; Location</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Weather data and GPS coordinates are attached automatically. No more arguing about
                whether it rained on a particular day.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-2">&#128247; Photo Attachments</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Snap photos of completed work, material deliveries, or site conditions. Every photo
                is geotagged and timestamped to the report.
              </p>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="bg-muted/30 border-y border-border py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl uppercase text-foreground mb-4">Why Trust VoiceLogPro?</h2>
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              <div>
                <div className="text-primary font-display text-4xl font-bold mb-2">49+</div>
                <p className="text-sm text-muted-foreground">Jurisdictions supported with compliance docs</p>
              </div>
              <div>
                <div className="text-primary font-display text-4xl font-bold mb-2">7</div>
                <p className="text-sm text-muted-foreground">Competitors analyzed and compared honestly</p>
              </div>
              <div>
                <div className="text-primary font-display text-4xl font-bold mb-2">$49</div>
                <p className="text-sm text-muted-foreground">Per month. One price. No per-report fees.</p>
              </div>
              <div>
                <div className="text-primary font-display text-4xl font-bold mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Voice-first. Built for hands-on crews.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-3xl uppercase text-foreground mb-4">
            Ready to protect your pay?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Stop losing money to missing reports. Join the crew that documents every day.
          </p>
          <Link
            to="/crew-plan"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Get the Crew Plan &rarr;
          </Link>
        </section>

        <Footer />
      </div>
    </>
  );
}
