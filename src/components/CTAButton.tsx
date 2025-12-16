import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";
import { vibrate } from "@/lib/utils";

interface CTAButtonProps {
  className?: string;
  variant?: "hero" | "cta" | "jobsite";
}

export function CTAButton({ className, variant = "cta" }: CTAButtonProps) {
  // Use jobsite sizing on mobile for all primary CTAs
  const size = variant === "hero" ? "xl" : variant === "jobsite" ? "jobsite" : "lg";
  const buttonVariant = variant === "jobsite" ? "jobsite" : variant;
  
  return (
    <Link to="/crew-plan" onClick={vibrate}>
      <Button 
        variant={buttonVariant} 
        size={size} 
        className={`min-h-[60px] text-lg font-bold touch-manipulation active:scale-95 transition-transform duration-100 ${variant !== "jobsite" ? "md:h-auto md:min-h-0" : ""} ${className || ""}`}
      >
        <Unlock className="w-5 h-5" />
        Unlock Crew Plan
      </Button>
    </Link>
  );
}
