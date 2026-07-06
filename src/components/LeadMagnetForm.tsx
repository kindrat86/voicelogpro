import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, Lock } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().email("Please enter a valid email address");

interface LeadMagnetFormProps {
  ctaLabel?: string;
  source?: string;
  variant?: "hero" | "default";
  placeholder?: string;
}

/**
 * Reusable lead-magnet opt-in (Brunson "bait" squeeze mechanic).
 * Captures email in exchange for the free "Daily Log Defense Kit" lead magnet,
 * seeding the value ladder's lowest rung before the paid offers.
 */
export function LeadMagnetForm({
  ctaLabel = "Get the Free Defense Kit",
  source = "lead_magnet",
  variant = "default",
  placeholder = "Enter your email",
}: LeadMagnetFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address. Try again.");
      return;
    }
    setStatus("loading");
    setIsDuplicate(false);
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: email.toLowerCase().trim(),
        source,
      });
      if (error) {
        if (error.code === "23505") {
          setIsDuplicate(true);
          setStatus("success");
          return;
        }
        throw error;
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="w-full max-w-md mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-success/20 rounded-full mb-3">
          <CheckCircle className="w-7 h-7 text-success" />
        </div>
        <p className="text-success font-bold text-lg mb-1">
          {isDuplicate ? "You're already on the list!" : "Defense Kit reserved!"}
        </p>
        <p className="text-muted-foreground text-sm">
          We'll send the Daily Log Defense Kit to your inbox. Your beta spot is locked in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          className={`h-12 md:h-14 text-base bg-input border-2 ${
            variant === "hero" ? "border-primary-foreground/20" : "border-border"
          } focus:border-primary flex-1`}
          disabled={status === "loading"}
          aria-label="Email address"
        />
        <Button
          type="submit"
          variant="cta"
          size="lg"
          className="h-12 md:h-14 px-6 whitespace-nowrap"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            ctaLabel
          )}
        </Button>
      </div>
      {status === "error" && errorMessage && (
        <p className="text-destructive text-sm mt-2 text-center">{errorMessage}</p>
      )}
      <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        100% Free. No credit card. Unsubscribe anytime.
      </p>
    </form>
  );
}
