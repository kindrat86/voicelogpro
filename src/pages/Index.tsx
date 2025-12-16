import { HeroSection } from "@/components/HeroSection";
import { BuiltForJobsites } from "@/components/BuiltForJobsites";
import { WhySitelogExists } from "@/components/WhySitelogExists";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CrewPlanSection } from "@/components/CrewPlanSection";
import { LimitedBetaSection } from "@/components/LimitedBetaSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <BuiltForJobsites />
      <WhySitelogExists />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />
      <CrewPlanSection />
      <LimitedBetaSection />
      <Footer />
    </main>
  );
};

export default Index;
