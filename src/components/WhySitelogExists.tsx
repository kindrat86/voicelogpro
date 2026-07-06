import { CTAButton } from "@/components/CTAButton";

/**
 * Epiphany Bridge story (Brunson framework).
 * Structured as Backstory → Wall → Epiphany → Plan → the offer.
 * The "I almost lost $40k" hook anchors the emotional stakes.
 */
export function WhySitelogExists() {
  return <section className="section-container bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="headline-section text-foreground mb-8 text-center">Why Voice Log Pro Exists</h2>
        
        {/* Backstory */}
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I spent years on real jobsites — conduit in one hand, change orders in the other.
          </p>

          {/* The Wall — the pain that creates the buyer */}
          <p className="border-l-4 border-destructive pl-5">
            <span className="block font-bold text-destructive uppercase text-sm tracking-wide mb-1">The Day It Almost Killed Us</span>
            In 2022 a GC on a Dallas data-center build rejected $40,000 of our pay app.
            His excuse? "Your daily logs don't show the weather delay on the 14th."
            We had the photos. We had the notes. But they were scattered across a foreman's truck, a WhatsApp group, and a notebook that had coffee on it.
            <span className="block font-semibold text-foreground mt-2">We couldn't prove it in time. We ate the $40k.</span>
          </p>

          {/* The Epiphany */}
          <p className="border-l-4 border-primary pl-5">
            <span className="block font-bold text-primary uppercase text-sm tracking-wide mb-1">The Epiphany</span>
            Walking to the truck that night I realized the problem wasn't bad work. It wasn't lazy crews.
            <span className="block font-semibold text-foreground">It was that our documentation lived in places a glove can't reach.</span>
            If I could just press a button and speak — and have a clean, timestamped PDF come out the other side — we'd never lose a dispute we deserved to win.
          </p>

          {/* The Plan */}
          <p className="text-foreground font-medium text-xl">
            So I built it. For guys like us.
            <span className="block">Not office staff. Not big tech. The crew.</span>
          </p>
          
          <p>
            You don't change how you work.
            <span className="block">You press record, speak your update, and move on.</span>
          </p>
          
          <p>
            Voice Log Pro turns what you say into evidence-grade daily logs with timestamps, weather, and safety notes — documentation that supports your payment disputes and lien rights.
            <span className="block font-semibold text-primary">Even works offline.</span>
          </p>
        </div>

        <div className="text-center mt-12">
          <CTAButton />
        </div>
      </div>
    </section>;
}
