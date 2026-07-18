import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://voicelogpro.com/#organization",
  name: "VoiceLogPro",
  url: "https://voicelogpro.com",
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/4B8rhitxuFfh01PdeqSXDugsqvg2/uploads/1765892927118-VoiceLogProFavicon.png",
  description:
    "VoiceLogPro builds voice-first daily reporting tools for construction subcontractors. Specializing in compliance documentation for Texas Property Code Chapter 53, NSW SOPA adjudications, and UK Building Safety Act Golden Thread requirements.",
  foundingDate: "2024",
  sameAs: [],
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
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://voicelogpro.com/contact" },
  ],
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact VoiceLogPro",
  description: "Get in touch with the VoiceLogPro team. Questions about daily construction reporting, partnership inquiries, or support.",
  mainEntity: { "@type": "Organization", "@id": "https://voicelogpro.com/#organization" },
  significantLink: ["https://voicelogpro.com/"],
};

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact VoiceLogPro | Daily Construction Reports Support</title>
        <meta
          name="description"
          content="Get in touch with VoiceLogPro. Questions about daily construction reports, partnership inquiries, or need help getting started? We're here for the crew."
        />
        <link rel="canonical" href="https://voicelogpro.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voicelogpro.com/contact" />
        <meta property="og:title" content="Contact VoiceLogPro" />
        <meta
          property="og:description"
          content="Get in touch with VoiceLogPro. Questions about daily construction reporting? We're here for the crew."
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/gpt-engineer-file-uploads/4B8rhitxuFfh01PdeqSXDugsqvg2/social-images/social-1765892945744-VoiceLogProFavicon.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact VoiceLogPro" />
        <meta name="twitter:description" content="Contact the VoiceLogPro crew." />
      </Helmet>

      <JsonLd schema={[organizationSchema, breadcrumbSchema, contactPageSchema]} />

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
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-primary font-semibold">
                Contact
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-xs uppercase tracking-wider text-primary font-bold mb-4">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-6xl uppercase text-foreground mb-6 leading-tight">
            Contact <span className="text-primary">VoiceLogPro</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Questions about daily reporting? Need help with a specific compliance requirement?
            Want to partner with us? We're a small crew building for real jobsites — we answer
            fast.
          </p>
        </section>

        {/* Contact Cards */}
        <section className="max-w-3xl mx-auto px-4 pb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">&#9993;</div>
              <h2 className="font-display text-xl uppercase text-foreground mb-2">Email</h2>
              <p className="text-sm text-muted-foreground mb-4">
                For general inquiries, partnership opportunities, and support.
              </p>
              <a
                href="mailto:hello@voicelogpro.com"
                className="text-primary font-semibold hover:underline"
              >
                hello@voicelogpro.com &rarr;
              </a>
            </div>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">&#127760;</div>
              <h2 className="font-display text-xl uppercase text-foreground mb-2">Website</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Start with the home page to see how it works, then check the comparisons.
              </p>
              <a href="https://voicelogpro.com" className="text-primary font-semibold hover:underline">
                voicelogpro.com &rarr;
              </a>
            </div>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">&#128196;</div>
              <h2 className="font-display text-xl uppercase text-foreground mb-2">Start Free</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Already ready to get started? Join the waitlist for the Crew Plan.
              </p>
              <Link to="/crew-plan" className="text-primary font-semibold hover:underline">
                Join the waitlist &rarr;
              </Link>
            </div>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">&#128214;</div>
              <h2 className="font-display text-xl uppercase text-foreground mb-2">Blog &amp; Guides</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our construction compliance guides and how-to documentation.
              </p>
              <Link to="/blog" className="text-primary font-semibold hover:underline">
                Read the blog &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ / Quick Answers */}
        <section className="bg-card border-y border-border py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-display text-3xl uppercase text-foreground mb-6 text-center">Quick Answers</h2>
            <div className="space-y-4">
              <div className="bg-background border border-border rounded-lg p-5">
                <h3 className="font-bold text-foreground mb-1">How much does it cost?</h3>
                <p className="text-sm text-muted-foreground">
                  The Crew Plan is $49/month. One price. Unlimited daily reports. No per-report fees.{' '}
                  <Link to="/crew-plan" className="text-primary hover:underline">See full details &rarr;</Link>
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg p-5">
                <h3 className="font-bold text-foreground mb-1">Which trades is this for?</h3>
                <p className="text-sm text-muted-foreground">
                  Electricians, plumbers, HVAC contractors, roofers, and general contractors. If
                  you work with your hands and need to document daily work, this is for you.{' '}
                  <Link to="/for" className="text-primary hover:underline">See by trade &rarr;</Link>
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg p-5">
                <h3 className="font-bold text-foreground mb-1">What compliance standards do you support?</h3>
                <p className="text-sm text-muted-foreground">
                  Texas Property Code Chapter 53 (Mechanics Liens), NSW Security of Payment Act
                  adjudications, and UK Building Safety Act Golden Thread requirements.{' '}
                  <Link to="/solutions/texas-mechanics-lien-compliance" className="text-primary hover:underline">Texas compliance &rarr;</Link>
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg p-5">
                <h3 className="font-bold text-foreground mb-1">Can I compare VoiceLogPro to other tools?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. We have honest, detailed comparisons vs Raken, Fieldwire, Procore,
                  Buildertrend, JobNimbus, and more.{' '}
                  <Link to="/compare" className="text-primary hover:underline">All comparisons &rarr;</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-3xl uppercase text-foreground mb-4">
            Not finding what you need?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            We're a small crew. When you email us, you're talking to the people who built the
            product. No bots. No ticket numbers.
          </p>
          <a
            href="mailto:hello@voicelogpro.com"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Email us &rarr;
          </a>
        </section>

        <Footer />
      </div>
    </>
  );
}
