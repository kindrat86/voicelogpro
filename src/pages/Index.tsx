import { Helmet } from "react-helmet-async";
import { HeroSection } from "@/components/HeroSection";
import { SqueezeSection } from "@/components/SqueezeSection";
import { BuiltForJobsites } from "@/components/BuiltForJobsites";
import { WhySitelogExists } from "@/components/WhySitelogExists";
import { InteractiveVoiceDemo } from "@/components/InteractiveVoiceDemo";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ComplianceMatrix } from "@/components/ComplianceMatrix";
import { ValueLadderSection } from "@/components/ValueLadderSection";
import { OrderBumpSection } from "@/components/OrderBumpSection";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { LimitedBetaSection } from "@/components/LimitedBetaSection";
import { FAQSection } from "@/components/FAQSection";
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
    "https://x.com/data_nerd",
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
        <meta name="description" content="VoiceLogPro turns voice notes into daily construction reports in 60 seconds. No typing. Works from any phone. Built for subcontractors." />
        <link rel="canonical" href="https://voicelogpro.com/" />
      </Helmet>
      <JsonLd schema={[organizationSchema, personSchema]} />
      <main className="min-h-screen bg-background">
        {/* 1. Hero with inline squeeze opt-in */}
        <HeroSection />

        {/* 2. Dedicated squeeze (lead magnet value anchor) */}
        <div id="defense-kit">
          <SqueezeSection />
        </div>

        {/* 3. Social proof — trade imagery */}
        <div className="hidden md:block">
          <BuiltForJobsites />
        </div>

        {/* 4. Epiphany Bridge story */}
        <WhySitelogExists />

        {/* 5. Interactive demo (show the thing) */}
        <div id="demo">
          <InteractiveVoiceDemo />
        </div>

        {/* 6. Authority — compliance coverage (table scrolls horizontally on mobile) */}
        <ComplianceMatrix />

        {/* 7. How it works */}
        <HowItWorks />

        {/* 8. Features */}
        <FeaturesSection />

        {/* 10. Value ladder (free → entry → core) */}
        <ValueLadderSection />

        {/* 11. Order bump + checkout-style conversion */}
        <OrderBumpSection />

        {/* 12. Risk reversal */}
        <GuaranteeSection />

        {/* 13. Scarcity / urgency */}
        <LimitedBetaSection />

        {/* 14. Objection handling */}
        <FAQSection />

        <Footer />
      </main>
    </>
  );
};

export default Index;
