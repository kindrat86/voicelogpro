import { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before: Messy notes",
  afterLabel = "After: Clean PDF",
}: BeforeAfterSliderProps) {
  const [sliderValue, setSliderValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(e.target.value));
  };

  const handlePointerDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderValue(percentage);
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Labels */}
      <div className="flex justify-between mb-2 text-sm font-medium">
        <span className="text-muted-foreground">{beforeLabel}</span>
        <span className="text-primary">{afterLabel}</span>
      </div>

      {/* Slider Container */}
      <div
        ref={containerRef}
        className="relative aspect-[16/10] overflow-hidden rounded-xl border-2 border-border bg-muted select-none touch-none"
      >
        {/* Before Image (Base Layer) */}
        <img
          src={beforeImage}
          alt="Before - messy handwritten notes"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* After Image (Clipped Layer) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderValue}%` }}
        >
          <img
            src={afterImage}
            alt="After - clean PDF report"
            className="absolute inset-0 h-full object-cover"
            style={{ 
              width: sliderValue > 0 ? `${10000 / sliderValue}%` : '100%',
              maxWidth: 'none'
            }}
            draggable={false}
          />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
          style={{ left: `${sliderValue}%`, transform: "translateX(-50%)" }}
          onPointerDown={handlePointerDown}
        >
          {/* Grab Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-primary-foreground"
            >
              <path
                d="M6 10L3 7M3 7L6 4M3 7H8M14 10L17 13M17 13L14 16M17 13H12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Hidden Range Input for Accessibility */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
          aria-label="Slide to compare before and after"
        />
      </div>

      {/* Caption */}
      <p className="text-center text-sm text-muted-foreground mt-2">
        ← Slide to compare →
      </p>
    </div>
  );
}
