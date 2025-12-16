import { CTAButton } from "@/components/CTAButton";
import { Mic, Cloud, AlertTriangle, FileCheck, Share2, WifiOff } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Hands-free voice capture",
    description: "just talk",
  },
  {
    icon: Cloud,
    title: "Automatic weather tagging",
    description: "stronger proof for disputes",
  },
  {
    icon: AlertTriangle,
    title: "RFI detection",
    description: "catch issues early",
  },
  {
    icon: FileCheck,
    title: "Legally defensible PDFs",
    description: "court-ready logs",
  },
  {
    icon: Share2,
    title: "One-click GC sharing",
    description: "send reports instantly",
  },
  {
    icon: WifiOff,
    title: "Offline capture",
    description: "works anywhere",
  },
];

export function FeaturesSection() {
  return (
    <section className="section-container bg-secondary/30">
      <h2 className="headline-section text-foreground mb-4 text-center">
        Built for Subcontractors
      </h2>
      <p className="body-large text-center mb-12">Every feature designed for the field.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
        {features.map((feature, index) => (
          <div 
            key={feature.title}
            className="card-industrial text-center group hover:border-primary/50 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">— {feature.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <CTAButton />
      </div>
    </section>
  );
}
