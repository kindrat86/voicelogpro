import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, ArrowLeft, Zap } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().email("Please enter a valid email address");

const freeFeatures = [
  "Unlimited Voice Logs",
  "Standard PDF Reports",
  "Email Support",
];

export default function BetaSignup() {
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
        source: "beta_free"
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
    <>
      <Helmet>
        <title>Join Solo Beta | VoiceLogPro</title>
        <meta name="description" content="Join the VoiceLogPro Solo Beta for free. Turn field voice notes into accurate labor logs and PDF reports. No credit card required." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://voicelogpro.com/beta" />
      </Helmet>

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
                    : "You're on the Solo Beta waitlist. We'll notify you when access opens."}
                </p>
                <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">No charge today.</p>
                  <p>
                    You've secured your free beta spot. We'll notify you when access opens.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Page Header */}
                <h1 className="headline-section text-foreground mb-8 text-center">
                  Join Solo Beta
                </h1>

                {/* Single Solo Beta Card */}
                <div className="card-industrial p-6 md:p-8 border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Solo Beta</h2>
                      <p className="text-3xl font-bold text-primary">$0 <span className="text-base font-normal text-muted-foreground">/ Free</span></p>
                    </div>
                  </div>

                  <Badge variant="default" className="mb-6">
                    No Credit Card Required
                  </Badge>

                  {/* Features List */}
                  <div className="bg-secondary/30 border border-border rounded-lg p-5 mb-6">
                    <p className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Includes:</p>
                    <ul className="space-y-3">
                      {freeFeatures.map((feature) => (
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

                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Risk Free. Cancel anytime.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="px-4 py-8 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VoiceLogPro. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
