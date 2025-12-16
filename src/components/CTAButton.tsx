import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";

interface CTAButtonProps {
  className?: string;
  variant?: "hero" | "cta" | "jobsite";
}

export function CTAButton({ className, variant = "cta" }: CTAButtonProps) {
  // Use jobsite sizing on mobile for all primary CTAs
  const size = variant === "hero" ? "xl" : variant === "jobsite" ? "jobsite" : "lg";
  const buttonVariant = variant === "jobsite" ? "jobsite" : variant;
  
  return (
    <Link to="/crew-plan">
      <Button 
        variant={buttonVariant} 
        size={size} 
        className={`${variant !== "jobsite" ? "md:h-auto" : ""} ${className || ""}`}
      >
        <Unlock className="w-5 h-5" />
        Unlock Crew Plan
      </Button>
    </Link>
  );
}
