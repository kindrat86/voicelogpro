import { Helmet } from "react-helmet-async";
import { HeroSection } from "@/components/HeroSection";
import { SqueezeSection } from "@/components/SqueezeSection";
import { BuiltForJobsites } from "@/components/BuiltForJobsites";
import { InteractiveVoiceDemo } from "@/components/InteractiveVoiceDemo";
import { OrderBumpSection } from "@/components/OrderBumpSection";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { Footer } from "@/components/Footer";
import { organizationSchema } from "@/seo/softwareSchema";
import { JsonLd } from "@/components/JsonLd";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://voicelogpro.com/#person",
  name: "Maryan Kushnir",
  description: "Founder of VoiceLogPro. Electrical foreman turned software builder, building voice-first daily reporting tools for construction subcontractors.",
  sameAs: [
    "https://github.com/kindrat86",
    "https://x.com/sipiteno",
    "https://www.linkedin.com/in/kushnir-maryan/",
    "https://sipiteno.com",
    "https://invisibleexit.com",
    "https://signals.gitdealflow.com",
    "https://sanctionsai.dev",
    "https://www.indiehackers.com/product/unlock-saas"
  ],
  knowsAbout: [
    "Construction Daily Reporting",
    "Texas Property Code Chapter 53",
    "Mechanics Lien Documentation",
    "Voice-to-PDF Technology",
    "Construction Compliance",
    "AI-Powered Construction Software"
  ]
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>VoiceLogPro | Daily Construction Reports from Voice Notes</title>
        <meta name="description" content="VoiceLogPro Founding Pilot: $49 one-time for one crew, seven days, and up to five human-assisted daily-report PDFs. No subscription or automatic renewal." />
        <link rel="canonical" href="https://voicelogpro.com/" />
        <meta property="og:title" content="$49 VoiceLogPro Founding Pilot" />
        <meta property="og:description" content="One crew, seven days, and up to five human-assisted daily-report PDFs. One-time payment with no automatic renewal." />
        <meta property="og:url" content="https://voicelogpro.com/" />
        <meta name="twitter:title" content="$49 VoiceLogPro Founding Pilot" />
        <meta name="twitter:description" content="One-time human-assisted daily-report pilot for one crew. No subscription or automatic renewal." />
      </Helmet>
      <JsonLd schema={[organizationSchema, personSchema]} />
      <main className="min-h-screen bg-background">
        {/* 1. Hero with inline squeeze opt-in */}
        <HeroSection />

        {/* 2. Purchase-ready concierge offer */}
        <OrderBumpSection />

        {/* 3. Free path for visitors who are not ready to buy */}
        <div id="defense-kit">
          <SqueezeSection />
        </div>

        {/* 4. Trade context */}
        <div className="hidden md:block">
          <BuiltForJobsites />
        </div>

        {/* 5. Simulated product preview, explicitly labeled in the component */}
        <div id="demo">
          <InteractiveVoiceDemo />
        </div>

        {/* 6. Paid-pilot risk reversal */}
        <GuaranteeSection />

        {/* 7. Site footer */}
        <Footer />
      </main>
    </>
  );
};

export default Index;
