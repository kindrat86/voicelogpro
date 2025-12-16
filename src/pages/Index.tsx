import { Helmet } from "react-helmet-async";
import { HeroSection } from "@/components/HeroSection";
import { BuiltForJobsites } from "@/components/BuiltForJobsites";
import { WhySitelogExists } from "@/components/WhySitelogExists";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ComplianceMatrix } from "@/components/ComplianceMatrix";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CrewPlanSection } from "@/components/CrewPlanSection";
import { LimitedBetaSection } from "@/components/LimitedBetaSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Voice Log Pro | Daily Construction Reports from Voice Notes</title>
        <meta name="description" content="Turn voice notes into court-ready daily construction reports with timestamps, weather, and photos. Built for subcontractors who work with their hands. $49/month." />
        <link rel="canonical" href="https://www.voicelogpro.com/" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <HeroSection />
        <BuiltForJobsites />
        <WhySitelogExists />
        <ComplianceMatrix />
        <HowItWorks />
        <FeaturesSection />
        <TestimonialsSection />
        <CrewPlanSection />
        <LimitedBetaSection />
        <FAQSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
