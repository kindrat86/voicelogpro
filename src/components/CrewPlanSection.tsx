import { CTAButton } from "@/components/CTAButton";
import { Check } from "lucide-react";

const features = [
  "Unlimited voice logs",
  "Unlimited PDF exports",
  "All jobsite reporting features",
  "Built for teams in the field",
  "Timestamps & photos for legal protection",
];

export function CrewPlanSection() {
  return (
    <section className="section-container bg-secondary/30">
      <div className="max-w-xl mx-auto text-center">
        
        <h2 className="headline-section text-foreground mb-2">Crew Plan</h2>
        <p className="font-display text-5xl md:text-6xl text-primary mb-8">$49/month</p>

        <div className="card-industrial text-left mb-8">
          <h3 className="font-semibold text-foreground mb-4 text-lg">Includes:</h3>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <CTAButton />
      </div>
    </section>
  );
}
