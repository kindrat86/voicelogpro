import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { CheckCircle, Loader2, ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().email("Please enter a valid email address");

const paidFeatures = [
  "All Beta features",
  "Up to 5 Crews",
  "Priority Onboarding",
  "Custom Branding",
];

export default function CrewPlan() {
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
        source: "crew_plan"
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

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {status === "success" ? (
            <div className="card-industrial p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <p className="text-success font-semibold text-lg mb-2">
                {isDuplicate ? "You're already on the waitlist." : "Thank you for joining!"}
              </p>
              <p className="text-muted-foreground mb-4">
                {isDuplicate 
                  ? "We've got your email and will reach out when your slot opens." 
                  : "You're on the Crew Plan waitlist. We'll reach out when your beta slot opens."}
              </p>
              <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">No charge today.</p>
                <p>
                  This was a Letter of Intent — you're simply telling us you'd pay for Voice Log Pro when it's ready. You will not be billed $49/month until you sign up after launch.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Page Header */}
              <h1 className="headline-section text-foreground mb-8 text-center">
                Get Crew Access
              </h1>

              {/* Single Crew Plan Card */}
              <div className="card-industrial p-6 md:p-8 border-primary border-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Crew Plan</h2>
                    <p className="text-3xl font-bold text-primary">$49 <span className="text-base font-normal text-muted-foreground">/ month</span></p>
                  </div>
                </div>

                {/* Features List */}
                <div className="bg-secondary/30 border border-border rounded-lg p-5 mb-6">
                  <p className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Includes:</p>
                  <ul className="space-y-3">
                    {paidFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="h-12 text-base bg-input border-border focus:border-primary"
                    disabled={status === "loading"}
                  />
                  {status === "error" && errorMessage && (
                    <p className="text-destructive text-sm">{errorMessage}</p>
                  )}

                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
