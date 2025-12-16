import { CTAButton } from "@/components/CTAButton";
import heroPlumber from "@/assets/hero-plumber.jpg";
import heroElectrician from "@/assets/hero-electrician.jpg";

export function BuiltForJobsites() {
  return (
    <section className="section-container">
      <div className="text-center mb-12">
        
        <h2 className="headline-section text-foreground mb-4">Built for the trades</h2>
        <p className="body-large">Gloves on. Phone out. One take. Done.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Plumber Card */}
        <div className="card-industrial group overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden rounded-md mb-4">
            <img 
              src={heroPlumber} 
              alt="Plumber working on construction site" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <p className="text-muted-foreground text-lg">
            "Log work while you work."
          </p>
        </div>

        {/* Electrician Card */}
        <div className="card-industrial group overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden rounded-md mb-4">
            <img 
              src={heroElectrician} 
              alt="Electrician pulling wire on site" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <p className="text-muted-foreground text-lg">
            "Proof of work in seconds."
          </p>
        </div>
      </div>

      <div className="text-center">
        <CTAButton />
      </div>
    </section>
  );
}
