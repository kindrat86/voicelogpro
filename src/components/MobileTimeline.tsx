import { useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface TimelineStep {
  icon: LucideIcon;
  number: string;
  text: string;
}

interface MobileTimelineProps {
  steps: TimelineStep[];
}

export function MobileTimeline({ steps }: MobileTimelineProps) {
  const [activeSteps, setActiveSteps] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveSteps(steps.length);
      return;
    }

    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSteps((prev) => Math.max(prev, index + 1));
            }
          });
        },
        { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [steps.length, prefersReducedMotion]);

  const fillPercentage = (activeSteps / steps.length) * 100;

  return (
    <div className="relative pl-8 md:hidden">
      {/* Dashed Conduit Line */}
      <div className="absolute left-3 top-8 bottom-8 w-0.5 border-l-2 border-dashed border-muted-foreground/30" />

      {/* Fill Line */}
      <div
        className="absolute left-3 top-8 w-0.5 bg-primary transition-all duration-500 ease-out"
        style={{
          height: prefersReducedMotion
            ? "calc(100% - 4rem)"
            : `calc(${fillPercentage}% - ${fillPercentage > 0 ? "2rem" : "0rem"})`,
        }}
      />

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isActive = index < activeSteps;
          const Icon = step.icon;

          return (
            <div
              key={step.number}
              ref={(el) => (stepRefs.current[index] = el)}
              className="relative py-4"
            >
              {/* Node Dot */}
              <div
                className={`absolute -left-5 top-6 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? "bg-primary border-primary scale-110"
                    : "bg-background border-muted-foreground/50"
                }`}
              />

              {/* Step Card */}
              <div
                className={`card-industrial flex items-start gap-4 transition-all duration-300 ${
                  isActive ? "border-primary/50" : ""
                }`}
              >
                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="font-display text-2xl text-primary mr-2">
                    {step.number}
                  </span>
                  <span className="text-foreground text-base leading-relaxed">
                    {step.text}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
