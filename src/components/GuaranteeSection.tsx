import { Shield, RotateCcw, Lock, HeartHandshake } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    title: "No Charge Until Launch",
    description: "Reserve your seat for free. You only pay $49/mo once Voice Log Pro ships and you choose to subscribe.",
  },
  {
    icon: RotateCcw,
    title: "30-Day Money-Back",
    description: "At launch, if it doesn't save you hours and help you win disputes in the first 30 days, we refund every cent.",
  },
  {
    icon: Lock,
    title: "Your Data Stays Yours",
    description: "Daily logs export as standard PDFs. No lock-in. Leave anytime and keep every report you generated.",
  },
  {
    icon: HeartHandshake,
    title: "Built By Subcontractors",
    description: "We're not Big Tech. We've lost money to bad documentation — that's why this tool exists. We're on your side.",
  },
];

/**
 * Risk reversal / guarantees section.
 * Removes the buyer's four biggest fears (price, fit, lock-in, trust) —
 * a core Dotcom Secrets "stack" element.
 */
export function GuaranteeSection() {
  return (
    <section className="section-container">
      <div className="max-w-4xl mx-auto">
        <h2 className="headline-section text-foreground mb-3 text-center">
          Join With Zero Risk
        </h2>
        <p className="body-large text-center mb-10">
          We remove every reason to say "not yet."
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guarantees.map((g) => (
            <div key={g.title} className="card-sunlight text-center">
              <div className="w-12 h-12 bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-3" style={{ borderRadius: 'var(--radius)' }}>
                <g.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1 text-sm">{g.title}</h3>
              <p className="text-muted-foreground text-xs">{g.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
