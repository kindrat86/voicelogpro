import { CTAButton } from "@/components/CTAButton";
import { Mic, Cloud, AlertTriangle, FileCheck, Share2, WifiOff } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Hands-free voice capture",
    description: "contemporaneous records preserved as evidence",
  },
  {
    icon: Cloud,
    title: "Automatic weather tagging",
    description: "excusable delay proof for schedule compression claims",
  },
  {
    icon: AlertTriangle,
    title: "RFI detection",
    description: "dispute prevention and delay claim documentation",
  },
  {
    icon: FileCheck,
    title: "Legally defensible PDFs",
    description: "aligned with AIA A401 documentation expectations",
  },
  {
    icon: Share2,
    title: "One-click GC sharing",
    description: "supports payment applications and lien rights",
  },
  {
    icon: WifiOff,
    title: "Offline capture",
    description: "evidence-grade daily logs from anywhere",
  },
];

export function FeaturesSection() {
  return (
    <section className="section-container bg-secondary/30">
      <h2 className="headline-section text-foreground mb-4 text-center font-bold">
        Built for Subcontractors
      </h2>
      <p className="body-large text-center mb-12 font-medium text-foreground/80">
        Every feature designed for the field.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
        {features.map((feature) => (
          <div 
            key={feature.title}
            className="card-sunlight text-center group transition-all duration-200"
          >
            <div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
            <p className="text-foreground/70 text-sm font-medium">— {feature.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <CTAButton />
      </div>
    </section>
  );
}
