import { CTAButton } from "@/components/CTAButton";
import { Mic, FileText, Send, Wifi } from "lucide-react";

const steps = [
  {
    icon: Mic,
    number: "01",
    text: "Speak your update while walking the site",
  },
  {
    icon: FileText,
    number: "02",
    text: "Voice Log Pro transcribes and adds timestamps, weather, and safety tags",
  },
  {
    icon: Send,
    number: "03",
    text: "A job-ready PDF is generated — ready to send",
  },
  {
    icon: Wifi,
    number: "04",
    text: "Works offline — logs sync when you're back online",
  },
];

export function HowItWorks() {
  return (
    <section className="section-container">
      <h2 className="headline-section text-foreground mb-4 text-center">How It Works</h2>
      <p className="body-large text-center mb-12">Built for muddy gloves and long days.</p>

      <div className="grid gap-4 md:gap-6 mb-12">
        {steps.map((step, index) => (
          <div 
            key={step.number}
            className="card-industrial flex items-center gap-4 md:gap-6 transition-all duration-300 hover:border-primary/50"
          >
            <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <step.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            </div>
            <div className="flex-1">
              <span className="font-display text-2xl md:text-3xl text-primary mr-3">{step.number}</span>
              <span className="text-foreground text-base md:text-lg">{step.text}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <CTAButton />
      </div>
    </section>
  );
}
