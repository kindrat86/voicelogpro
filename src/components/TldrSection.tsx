/**
 * TL;DR Section — injects a high-affinity summary box below the hero.
 *
 * A TL;DR (Too Long; Didn't Read) / BLUF (Bottom Line Up Front) box gives
 * readers the core takeaway in ~30 words before they scroll. This pattern
 * improves engagement, dwell time, and AI-answer-engine extractability by
 * putting the answer ahead of the explanation.
 *
 * Uses existing <section> + card styling consistent with the site's design
 * system: bg-muted/30, card-industrial border, and a prominent label.
 *
 * Props:
 *   summary — the TL;DR text itself (required)
 *   icon — optional lucide icon component (defaults to FileText)
 *   label — optional label text (defaults to "TL;DR")
 */
import { FileText } from "lucide-react";

interface TldrSectionProps {
  /** The TL;DR summary — concise, factual, benefit-forward. ~20–40 words. */
  summary: string;
  /** Optional lucide icon component (default: FileText). */
  icon?: React.ComponentType<{ className?: string }>;
  /** Optional label text (default: "TL;DR"). Use "Bottom Line" or "Key Takeaway" for variety. */
  label?: string;
}

export function TldrSection({
  summary,
  icon: Icon = FileText,
  label = "TL;DR",
}: TldrSectionProps) {
  return (
    <section className="section-container max-w-4xl mx-auto px-4">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              {label}
            </p>
            <p className="text-sm md:text-base text-foreground leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
