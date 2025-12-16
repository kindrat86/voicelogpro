import { CTAButton } from "@/components/CTAButton";
import plumberCard from "@/assets/plumber-card.jpg";
import electricianCard from "@/assets/electrician-card.jpg";

const tradeCards = [
  {
    image: plumberCard,
    alt: "Plumber working on construction site",
    quote: "Log work while you work.",
  },
  {
    image: electricianCard,
    alt: "Electrician installing light fixtures",
    quote: "Proof of work in seconds.",
  },
];

export function BuiltForJobsites() {
  return (
    <section className="section-container">
      <div className="text-center mb-12">
        <h2 className="headline-section text-foreground mb-4 font-bold">Built for the trades</h2>
        <p className="body-large font-medium text-foreground/80">Gloves on. Phone out. One take. Done.</p>
      </div>

      {/* Mobile: Horizontal snap-scroll | Desktop: Grid */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible md:pb-0 mb-12">
        {tradeCards.map((card) => (
          <div 
            key={card.alt}
            className="min-w-[85vw] snap-center md:min-w-0 card-sunlight group overflow-hidden shrink-0 md:shrink"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-md mb-4 border border-primary/30">
              <img 
                src={card.image} 
                alt={card.alt} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-foreground/80 text-lg font-medium">
              "{card.quote}"
            </p>
          </div>
        ))}
        {/* Ghost spacer for end padding on mobile */}
        <div className="w-4 md:hidden shrink-0" aria-hidden="true" />
      </div>

      <div className="text-center">
        <CTAButton />
      </div>
    </section>
  );
}
