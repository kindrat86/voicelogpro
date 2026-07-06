import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import { FileCheck, Shield, Download } from "lucide-react";

const kitIncludes = [
  {
    icon: FileCheck,
    title: "5 Daily Log Templates",
    description: "Copy-paste field-tested report formats electricians, plumbers & HVAC crews use to get paid.",
  },
  {
    icon: Shield,
    title: "Texas Chapter 53 Checklist",
    description: "The exact monthly documentation that protects your lien rights — deadline dates included.",
  },
  {
    icon: Download,
    title: "Dispute Defense Swipe File",
    description: "Scripts and phrasing that turn a 'he-said-she-said' into a documented, winnable payment claim.",
  },
];

/**
 * Brunson-style SQUEEZE PAGE section.
 * Trades a tangible lead magnet (the Daily Log Defense Kit) for the email —
 * the entry rung of the value ladder, ahead of the paid Crew Plan offer.
 */
export function SqueezeSection() {
  return (
    <section className="section-container">
      <div className="max-w-4xl mx-auto">
        {/* Urgency strip */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 bg-destructive/15 text-foreground px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
            <Download className="w-4 h-4" />
            Free Download — While It's Still Up
          </span>
        </div>

        <h2 className="headline-section text-foreground mb-4 text-center">
          Steal Our Daily Log Defense Kit
        </h2>
        <p className="body-large text-center mb-10 max-w-2xl mx-auto">
          The exact templates, checklists, and swipe files subcontractors use to defend payment disputes
          and win change orders — free. Enter your email and we'll send it instantly.
        </p>

        {/* Kit contents — value anchor */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {kitIncludes.map((item) => (
            <div key={item.title} className="card-sunlight text-center">
              <div className="w-12 h-12 bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-3" style={{ borderRadius: 'var(--radius)' }}>
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1 text-base">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Squeeze opt-in */}
        <LeadMagnetForm ctaLabel="Send Me the Kit" source="lead_magnet" />

        <p className="text-center text-xs text-muted-foreground mt-6 max-w-md mx-auto">
          Joining the list also reserves your beta spot — you'll be first in line when access opens.
        </p>
      </div>
    </section>
  );
}
