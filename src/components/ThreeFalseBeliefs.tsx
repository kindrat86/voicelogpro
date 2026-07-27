import { Brain, Hand, Building2 } from "lucide-react";
import { CTAButton } from "@/components/CTAButton";

/**
 * Three False Beliefs — DotCom Secrets (Secret #10, Seven Phases) +
 * Expert Secrets (Three False Beliefs framework).
 *
 * Russell's rule: before the offer, name the three objections that stop a
 * dream customer from buying — the Vehicle belief, the Internal belief, and
 * the External belief — and crush each one explicitly. Objections that are
 * never surfaced are never defeated.
 *
 * This component sits between FeaturesSection (proof it works) and
 * ValueLadderSection (the offer), so every false belief is demolished before
 * the price is revealed.
 *
 * Honesty rules (CLAUDE.md): no fabricated stats, no invented testimonials.
 * Each "truth" here is a structural fact about the product, not a claim that
 * needs a citation.
 */
const beliefs = [
  {
    icon: Brain,
    type: "The Vehicle Belief",
    lie: "\u201CAnother app won\u2019t stick. We\u2019ve tried field software before and the crew quit using it in a week.\u201D",
    truth:
      "VoiceLogPro isn\u2019t another tap-tap-tap form. It\u2019s a 30-second voice note from the cab of your truck \u2014 no typing, no login dance, no tablet to carry. The thing crews quit is the typing. Remove the typing and the habit stays.",
  },
  {
    icon: Hand,
    type: "The Internal Belief",
    lie: "\u201CI\u2019m not a paperwork person. I\u2019ll never keep up with it, so why start.\u201D",
    truth:
      "You don\u2019t have to become a paperwork person. You already talk through your day on the drive home \u2014 VoiceLogPro just listens, structures it, and turns it into the PDF. The discipline you need is \u2018press record,\u2019 not \u2018become an admin.\u2019",
  },
  {
    icon: Building2,
    type: "The External Belief",
    lie: "\u201CEven with good records, the GC or owner will just deny it anyway. My logs won\u2019t hold up.\u201D",
    truth:
      "A contemporaneous, timestamped, weather-corroborated record is exactly what holds up \u2014 in pay-application disputes, lien enforcement, and delay arbitration. The reason records \u2018don\u2019t hold up\u2019 is they\u2019re reconstructed days later from memory. VoiceLogPro makes them same-day and verifiable.",
  },
];

export const ThreeFalseBeliefs = () => {
  return (
    <section className="section-container">
      <h2 className="headline-section text-foreground mb-4 text-center">
        The Three Lies That Cost Subcontractors Their Pay
      </h2>
      <p className="body-large text-center mb-12">
        Before you decide, let&rsquo;s kill the three stories that lose crews money.
      </p>

      <div className="grid gap-4 md:gap-6 mb-12">
        {beliefs.map((belief, index) => (
          <div
            key={belief.type}
            className="card-industrial transition-all duration-300 hover:border-primary/50"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
              {/* Number + icon */}
              <div className="flex-shrink-0 flex items-center gap-3 md:flex-col md:items-center md:gap-2">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                  <belief.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <span className="font-display text-xl md:text-2xl text-primary/90">
                  0{index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <span className="block font-display text-sm md:text-base uppercase tracking-wide text-primary font-bold mb-2">
                  {belief.type}
                </span>

                {/* The lie */}
                <div className="mb-3 pl-4 border-l-2 border-red-500/60">
                  <p className="text-muted-foreground italic text-sm md:text-base">
                    {belief.lie}
                  </p>
                </div>

                {/* The truth */}
                <div className="pl-4 border-l-2 border-primary">
                  <p className="text-foreground text-sm md:text-base leading-relaxed">
                    {belief.truth}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <CTAButton />
      </div>
    </section>
  );
};
