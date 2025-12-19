import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Zap, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { vibrate } from "@/lib/utils";

const freeFeatures = [
  "Unlimited Voice Logs",
  "Standard PDF Reports",
  "Email Support",
];

const paidFeatures = [
  "All Beta features",
  "Up to 5 Crews",
  "Priority Onboarding",
  "Custom Branding",
];

export function CrewPlanSection() {
  return (
    <section className="section-container bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="headline-section text-foreground mb-8 text-center">Choose your path</h2>

        {/* Two-Option Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT CARD — Free Gate (Solo Beta) */}
          <div className="card-industrial border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Solo Beta</h3>
                <p className="text-3xl font-bold text-primary">$0 <span className="text-base font-normal text-muted-foreground">/ Free</span></p>
              </div>
            </div>

            <Badge variant="default" className="mb-6">
              No Credit Card Required
            </Badge>

            <ul className="space-y-3 mb-6">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link to="/crew-plan" onClick={vibrate}>
              <Button variant="outline" size="lg" className="w-full">
                Join Beta Free
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Risk Free. Cancel anytime.
            </p>
          </div>

          {/* RIGHT CARD — Paid Gate (Crew Plan) */}
          <div className="card-industrial border-primary border-2 relative">
            {/* Premium indicator */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            </div>

            <div className="flex items-center gap-3 mb-4 pt-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Crew Plan</h3>
                <p className="text-3xl font-bold text-primary">$49 <span className="text-base font-normal text-muted-foreground">/ month</span></p>
              </div>
            </div>

            <ul className="space-y-3 mb-6 mt-6">
              {paidFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link to="/crew-plan" onClick={vibrate}>
              <Button variant="cta" size="lg" className="w-full">
                Get Crew Access
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
