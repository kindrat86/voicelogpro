import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().email("Please enter a valid email address");

export default function CrewPlan() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address. Try again.");
      return;
    }

    setStatus("loading");

    try {
      const { error } = await supabase
        .from("waitlist")
        .upsert(
          { email: email.toLowerCase().trim(), source: "crew-plan" },
          { onConflict: "email" }
        );

      if (error) throw error;
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
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="card-industrial p-8">
            <h1 className="headline-section text-foreground mb-2 text-center">
              Get Crew Plan Access
            </h1>
            <p className="text-2xl font-bold text-primary text-center mb-2">
              $49/month
            </p>
            <p className="body-large text-center mb-8">
              Drop your email. We'll reach out as soon as your beta slot opens.
            </p>

            {status === "success" ? (
              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <p className="text-success font-semibold text-lg mb-2">
                  You're on the waitlist.
                </p>
                <p className="text-muted-foreground">
                  We'll contact you soon with next steps.
                  <span className="block">Check your inbox for confirmation.</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
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
                    <p className="text-destructive text-sm mt-2">{errorMessage}</p>
                  )}
                </div>

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
                    "Join Waitlist"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
