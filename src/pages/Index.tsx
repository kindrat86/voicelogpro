import { Helmet } from "react-helmet-async";
import { HeroSection } from "@/components/HeroSection";
import { SqueezeSection } from "@/components/SqueezeSection";
import { BuiltForJobsites } from "@/components/BuiltForJobsites";
import { WhySitelogExists } from "@/components/WhySitelogExists";
import { InteractiveVoiceDemo } from "@/components/InteractiveVoiceDemo";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ComplianceMatrix } from "@/components/ComplianceMatrix";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ValueLadderSection } from "@/components/ValueLadderSection";
import { OrderBumpSection } from "@/components/OrderBumpSection";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { LimitedBetaSection } from "@/components/LimitedBetaSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Voice Log Pro | Daily Construction Reports from Voice Notes</title>
        <meta name="description" content="Turn voice notes into court-ready daily construction reports with timestamps, weather, and photos. Built for subcontractors who work with their hands. Free Defense Kit + $49/month Crew Plan." />
        <link rel="canonical" href="https://voicelogpro.com/" />
      </Helmet>
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

        {/* 6. Authority — compliance coverage */}
        <div className="hidden md:block">
          <ComplianceMatrix />
        </div>

        {/* 7. How it works */}
        <HowItWorks />

        {/* 8. Features */}
        <FeaturesSection />

        {/* 9. Testimonials */}
        <TestimonialsSection />

        {/* 10. Value ladder (free → entry → core → premium) */}
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
