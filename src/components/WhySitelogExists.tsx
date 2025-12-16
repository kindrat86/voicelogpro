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
            <span className="block font-semibold text-foreground">It was late or missing daily reports.</span>
          </p>
          
          <p>
            "I'll write it later" always meant it never got done.
            <span className="block">That led to disputes, delays, and unpaid change orders.</span>
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
            SiteLog turns what you say into clean, court-ready PDFs with timestamps, weather, and safety notes — instantly.
            <span className="block font-semibold text-primary">Even works offline.</span>
          </p>
        </div>

        <div className="text-center mt-12">
          <CTAButton />
        </div>
      </div>
    </section>;
}