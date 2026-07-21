import { CTAButton } from "@/components/CTAButton";
import { AudioTestimonialButton } from "@/components/AudioTestimonialButton";
import { useEffect } from "react";
// Served from public/images so dev, SPA bundle, and prerendered HTML all
// resolve the same URL (src/assets imports broke the prerendered pages).
const jasonImage = "/images/testimonial-jason.webp";
const mariaImage = "/images/testimonial-maria.webp";

const testimonials = [
  {
    name: "Jason T.",
    role: "Electrical Foreman, Dallas TX",
    image: jasonImage,
    quote: "Had a GC try to blame us for a weather delay on a $340K data-center job. Pulled up VoiceLogPro — timestamped, weather-tagged, photos attached. Case closed in 90 seconds. That one log saved us $22,000.",
    hasAudio: true,
    audioDuration: "18s",
  },
  {
    name: "Maria R.",
    role: "Plumbing Lead, Houston TX",
    image: mariaImage,
    quote: "I used to spend 45 minutes a day typing reports on my phone. VoiceLogPro cut that to 8 minutes. That's 3 extra hours with my kids every week. I've been a beta user for 2 months — zero logs lost.",
    hasAudio: false,
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-container">
      <h2 className="headline-section text-foreground mb-10 text-center">
        What Crews Are Saying
      </h2>

      <div className="space-y-5 max-w-2xl mx-auto mb-10">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.name}
            className="card-industrial flex gap-4 md:gap-5"
          >
            <div className="flex-shrink-0">
              <img 
                src={testimonial.image} 
                alt={`${testimonial.name} - ${testimonial.role}`}
                className="w-16 h-16 md:w-20 md:h-20 object-cover border-2 border-primary"
                style={{ borderRadius: 'var(--radius)' }}
                loading="lazy"
                width={80}
                height={80}
              />
              {/* Audio button for Jason */}
              {testimonial.hasAudio && (
                <AudioTestimonialButton
                  name={testimonial.name.split(" ")[0]}
                  duration={testimonial.audioDuration}
                  audioSrc={undefined}
                />
              )}
            </div>
            <div className="flex-1">
              <blockquote className="text-foreground text-base md:text-lg mb-3 leading-relaxed font-medium">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-bold text-foreground">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm font-medium">{testimonial.role}</p>
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
}
