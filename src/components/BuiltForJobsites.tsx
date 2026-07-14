import { CTAButton } from "@/components/CTAButton";

// Served from public/images so dev, SPA bundle, and prerendered HTML all
// resolve the same URL (src/assets imports broke the prerendered pages).
const plumberCard = "/images/plumber-card.webp";
const electricianCard = "/images/electrician-card.webp";

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
      <div className="text-center mb-10">
        <h2 className="headline-section text-foreground mb-3">Built for the trades</h2>
        <p className="body-large">Gloves on. Phone out. One take. Done.</p>
      </div>

      {/* Mobile: Horizontal snap-scroll | Desktop: Grid */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible md:pb-0 mb-10">
        {tradeCards.map((card) => (
          <div 
            key={card.alt}
            className="min-w-[85vw] snap-center md:min-w-0 card-sunlight group overflow-hidden shrink-0 md:shrink"
          >
            <div className="aspect-[4/3] overflow-hidden mb-4 border-2 border-primary/50" style={{ borderRadius: 'var(--radius)' }}>
              <img
                src={card.image}
                alt={card.alt}
                width={1024}
                height={768}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-foreground text-lg font-bold">
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
