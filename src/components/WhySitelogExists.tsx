import { CTAButton } from "@/components/CTAButton";
export function WhySitelogExists() {
  return <section className="section-container bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="headline-section text-foreground mb-8 text-center">Why Voice Log Pro Exists</h2>
        
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I've spent years on real jobsites — conduit in one hand, change orders in the other.
          </p>
          
          <p>
            What killed our pay wasn't bad work.
            <span className="block font-semibold text-foreground">It was missing records leading to denied payment applications and unenforceable mechanics liens.</span>
          </p>
          
          <p>
            In markets like Dallas and Northern Virginia, a missing report means losing your Delay Claim.
            <span className="block">Payment disputes and lien waivers stack up when you can't prove schedule compression or excusable delay.</span>
          </p>
          
          <p className="text-foreground font-medium text-xl">
            Voice Log Pro was built for guys like us.
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