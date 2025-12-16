import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";

interface CTAButtonProps {
  className?: string;
  variant?: "hero" | "cta";
}

export function CTAButton({ className, variant = "cta" }: CTAButtonProps) {
  return (
    <Link to="/crew-plan">
      <Button variant={variant} size={variant === "hero" ? "xl" : "lg"} className={className}>
        <Unlock className="w-5 h-5" />
        Unlock Crew Plan
      </Button>
    </Link>
  );
}
