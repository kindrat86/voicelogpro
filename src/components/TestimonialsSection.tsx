import { CTAButton } from "@/components/CTAButton";
import { AudioTestimonialButton } from "@/components/AudioTestimonialButton";
import jasonImage from "@/assets/testimonial-jason.jpg";
import mariaImage from "@/assets/testimonial-maria.jpg";

const testimonials = [
  {
    name: "Jason T.",
    role: "Electrical Foreman",
    image: jasonImage,
    quote: "Had a GC try to blame us for a delay. Pulled up the daily log with timestamps and photos — case closed. Voice Log Pro has my back.",
    hasAudio: true,
    audioDuration: "12s",
  },
  {
    name: "Maria R.",
    role: "Plumbing Lead",
    image: mariaImage,
    quote: "I was skeptical — beta tools usually break. But Voice Log Pro ran smooth. It's saving our crew hours every week.",
    hasAudio: false,
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-container">
      <h2 className="headline-section text-foreground mb-12 text-center">
        What Crews Are Saying
      </h2>

      <div className="space-y-6 max-w-2xl mx-auto mb-12">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.name}
            className="card-industrial flex gap-4 md:gap-6"
          >
            <div className="flex-shrink-0">
              <img 
                src={testimonial.image} 
                alt={`${testimonial.name} - ${testimonial.role}`}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-primary/30"
              />
              {/* Audio button for Jason */}
              {testimonial.hasAudio && (
                <AudioTestimonialButton
                  name={testimonial.name.split(" ")[0]}
                  duration={testimonial.audioDuration}
                  audioSrc={undefined} // Will show "Audio coming soon" until asset is added
                />
              )}
            </div>
            <div className="flex-1">
              <blockquote className="text-foreground text-base md:text-lg mb-3 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm">{testimonial.role}</p>
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
