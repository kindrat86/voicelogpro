import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioTestimonialButtonProps {
  audioSrc?: string;
  name: string;
  duration?: string;
}

export function AudioTestimonialButton({
  audioSrc,
  name,
  duration,
}: AudioTestimonialButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDisabled, setIsDisabled] = useState(!audioSrc);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioSrc) {
      setIsDisabled(true);
      return;
    }

    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    audio.addEventListener("ended", () => setIsPlaying(false));
    audio.addEventListener("error", () => setIsDisabled(true));

    return () => {
      audio.pause();
      audio.removeEventListener("ended", () => setIsPlaying(false));
      audio.removeEventListener("error", () => setIsDisabled(true));
    };
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current || isDisabled) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (isDisabled) {
    return (
      <div className="flex items-center gap-2 mt-2">
        <button
          disabled
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center opacity-50 cursor-not-allowed"
          aria-label="Audio coming soon"
        >
          <Volume2 className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-xs text-muted-foreground">Audio coming soon</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
        aria-label={isPlaying ? `Pause ${name}'s testimonial` : `Play ${name}'s testimonial`}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-primary" />
        ) : (
          <Play className="w-4 h-4 text-primary ml-0.5" />
        )}
      </button>
      <span className="text-xs text-muted-foreground">
        Hear {name} {duration && `(${duration})`}
      </span>
    </div>
  );
}
