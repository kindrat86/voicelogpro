import { useState, useEffect, useRef } from "react";
import { Mic, Square, RotateCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type DemoState = "idle" | "recording" | "transcribing" | "done";

const SAMPLE_TRANSCRIPT = `Daily Log — December 16, 2024
Location: 4200 Commerce Dr, Unit B
Crew: 4 electricians on-site

Weather: 42°F, clear skies

Work Completed:
• Pulled 200ft of 12/2 Romex through second floor
• Installed 8 recessed LED fixtures in main hallway
• Completed rough-in for panel upgrade in basement

Blockers:
• Waiting on GC for drywall schedule — cannot proceed with finish work until walls are closed

Materials Used:
• 2 boxes 12/2 NM-B wire
• 8x Lithonia 6" LED trims
• 1 box wire nuts, assorted

Safety: Hardhats and safety glasses worn. No incidents.`;

// Animated waveform bars
const WaveformBars = ({ active, barCount = 12 }: { active: boolean; barCount?: number }) => {
  return (
    <div className="flex items-center justify-center gap-0.5 h-8" aria-hidden="true">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-primary rounded-full transition-all duration-150 ${
            active ? "animate-waveform" : "h-1"
          }`}
          style={{
            animationDelay: active ? `${i * 50}ms` : "0ms",
            height: active ? undefined : "4px",
          }}
        />
      ))}
    </div>
  );
};

export function InteractiveVoiceDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const [timer, setTimer] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
    };
  }, []);

  const startRecording = () => {
    setState("recording");
    setTimer(0);
    setDisplayedText("");

    // Timer countdown
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t >= 3) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          startTranscribing();
          return 3;
        }
        return t + 1;
      });
    }, 1000);
  };

  const startTranscribing = () => {
    setState("transcribing");

    // If reduced motion, show full text immediately
    if (prefersReducedMotion) {
      setDisplayedText(SAMPLE_TRANSCRIPT);
      setTimeout(() => setState("done"), 300);
      return;
    }

    // Typewriter effect - word by word for performance
    const words = SAMPLE_TRANSCRIPT.split(" ");
    let currentIndex = 0;

    const typeWord = () => {
      if (currentIndex < words.length) {
        setDisplayedText((prev) => 
          prev + (currentIndex === 0 ? "" : " ") + words[currentIndex]
        );
        currentIndex++;
        typewriterRef.current = setTimeout(typeWord, 25);
      } else {
        setState("done");
      }
    };

    typewriterRef.current = setTimeout(typeWord, 500);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
    setState("idle");
    setTimer(0);
    setDisplayedText("");
  };

  return (
    <section className="section-container">
      <h2 className="headline-section text-foreground mb-4 text-center font-bold">
        See It In Action
      </h2>
      <p className="body-large text-center mb-8 font-medium text-foreground/80">
        Try the voice-to-log experience. No microphone needed.
      </p>

      <div className="max-w-2xl mx-auto">
        {/* Demo Panel - Reserved height to prevent layout shift */}
        <div className="card-sunlight min-h-[400px] flex flex-col">
          {/* Recording Controls */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/20">
            <div className="flex items-center gap-3">
              {state === "idle" && (
                <Button
                  variant="jobsite"
                  size="jobsite"
                  onClick={startRecording}
                  aria-label="Start recording a test daily log"
                  className="gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Record a Test Log
                </Button>
              )}

              {state === "recording" && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                    Recording... {timer}s
                  </div>
                  <WaveformBars active={!prefersReducedMotion} />
                </div>
              )}

              {state === "transcribing" && (
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <FileText className="w-5 h-5 animate-pulse" />
                  Transcribing...
                </div>
              )}

              {state === "done" && (
                <div className="flex items-center gap-2 text-success font-semibold">
                  <FileText className="w-5 h-5" />
                  Log Generated
                </div>
              )}
            </div>

            {state !== "idle" && (
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                aria-label="Reset demo and try again"
                className="gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>

          {/* Output Panel */}
          <div className="flex-1 relative">
            {state === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <Mic className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-center font-medium">
                  Tap "Record a Test Log" to see how Voice Log Pro works
                </p>
              </div>
            )}

            {(state === "recording" || state === "transcribing" || state === "done") && (
              <div className="bg-background/50 rounded-lg p-4 h-full overflow-auto border border-border/50">
                <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-mono leading-relaxed">
                  {displayedText}
                  {state === "transcribing" && !prefersReducedMotion && (
                    <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
                  )}
                </pre>
              </div>
            )}
          </div>

          {/* PDF Preview Teaser */}
          {state === "done" && (
            <div className="mt-4 pt-4 border-t border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-12 bg-destructive/10 border border-destructive/30 rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">DailyLog_2024-12-16.pdf</p>
                  <p className="text-xs text-muted-foreground">Ready to export</p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled className="opacity-50">
                Download Sample
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
