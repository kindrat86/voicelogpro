import { Link } from "react-router-dom";
import { Gift, Zap, Users, ChevronRight } from "lucide-react";

const ladderRungs = [
  {
    icon: Gift,
    tier: "Free",
    name: "Daily Log Defense Kit",
    price: "$0",
    sub: "Lead magnet",
    description: "Templates, Texas Chapter 53 checklist & dispute swipe file.",
    deliverable: "Instant PDF download",
    href: "#defense-kit",
    highlight: false,
  },
  {
    icon: Zap,
    tier: "Entry",
    name: "Solo Beta",
    price: "$0",
    sub: "Beta access",
    description: "Unlimited voice logs + standard PDF reports for one foreman.",
    deliverable: "Beta seat",
    href: "/crew-plan",
    highlight: false,
  },
  {
    icon: Users,
    tier: "Core",
    name: "Crew Plan",
    price: "$49",
    sub: "/month",
    description: "Up to 5 crews, priority onboarding, custom branding, dispute-ready exports.",
    deliverable: "Monthly subscription",
    href: "/crew-plan",
    highlight: true,
  },
];

/**
 * Visual VALUE LADDER (Brunson core concept).
 * Makes the free → entry → core progression explicit so the buyer
 * self-selects the rung that fits — and sees a clear upgrade path.
 */
export function ValueLadderSection() {
  return (
    <section className="section-container bg-secondary/30">
      <h2 className="headline-section text-foreground mb-3 text-center">
        Start Free. Grow Into The Crew.
      </h2>
      <p className="body-large text-center mb-10">
        Three steps from protecting your first job to running your whole company's reporting.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ladderRungs.map((rung) => (
          <div
            key={rung.name}
            className={`card-industrial flex flex-col ${rung.highlight ? "border-primary border-2 relative" : "border-border"}`}
          >
            {rung.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
            )}
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <rung.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
              {rung.tier}
            </p>
            <h3 className="text-lg font-bold text-foreground mb-1">{rung.name}</h3>
            <p className="mb-3">
              <span className="text-2xl font-bold text-primary">{rung.price}</span>
              <span className="text-sm text-muted-foreground"> {rung.sub}</span>
            </p>
            <p className="text-muted-foreground text-sm flex-1 mb-4">{rung.description}</p>
            <Link
              to={rung.href}
              className="text-primary font-bold text-sm inline-flex items-center gap-1 hover:underline uppercase tracking-wide"
            >
              {rung.deliverable}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
