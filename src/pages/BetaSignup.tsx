import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Mic, FileText, Clock, Shield, FileCheck, Users, Smartphone } from "lucide-react";
import { vibrate } from "@/lib/utils";
import beforeImage from "@/assets/before-messy-notes.jpg";
import afterImage from "@/assets/after-clean-pdf.jpg";

function BetaCTA({ className }: { className?: string }) {
  return (
    <Link to="/crew-plan" onClick={vibrate}>
      <Button 
        variant="cta" 
        size="xl" 
        className={`min-h-[60px] text-lg font-bold touch-manipulation active:scale-95 transition-transform duration-100 ${className || ""}`}
      >
        Secure Your Beta Spot
      </Button>
    </Link>
  );
}

export default function BetaSignup() {
  return (
    <>
      <Helmet>
        <title>VoiceLogPro Beta | Stop Chasing Paper Timesheets</title>
        <meta name="description" content="Turn field voice notes into accurate labor logs and Phase vs. Actual reports in 30 seconds. No typing. No apps. No crew accounts. Join the beta." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://voicelogpro.com/beta" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="px-4 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight mb-6">
              Stop Chasing Paper Timesheets.<br />
              <span className="text-primary">Just Speak.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              VoiceLogPro turns field voice notes into accurate labor logs and Phase vs. Actual reports in 30 seconds.
              <br className="hidden md:block" />
              <strong className="text-foreground">No typing. No apps. No crew accounts.</strong>
            </p>

            <BetaCTA className="mb-12" />

            {/* Before/After Slider */}
            <div className="mt-8">
              <BeforeAfterSlider
                beforeImage={beforeImage}
                afterImage={afterImage}
                beforeLabel="Before: Messy notes"
                afterLabel="After: Clean PDF"
              />
            </div>
          </div>
        </section>

        {/* Problem Agitation */}
        <section className="px-4 py-16 bg-muted/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-8">
              If It's Not Written Down,<br />
              <span className="text-destructive">It Doesn't Get Paid.</span>
            </h2>
            
            <div className="space-y-4 text-lg text-muted-foreground text-center max-w-xl mx-auto">
              <p>Hours get forgotten.</p>
              <p>Photos get buried in WhatsApp.</p>
              <p>Excel gets updated days later—if at all.</p>
            </div>

            <p className="mt-8 text-center text-foreground font-medium text-lg max-w-xl mx-auto">
              Those missing details turn into lost revenue, rejected change orders, and arguments you can't win.
            </p>
          </div>
        </section>

        {/* Solution Snapshot */}
        <section className="px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
              Capture the Work While It's Happening.
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
              VoiceLogPro lets you record a quick daily summary by voice.
              The system turns it into structured labor data and a professional report—automatically.
            </p>

            <div className="flex flex-col items-center gap-2 text-xl font-semibold text-primary">
              <span>You speak.</span>
              <span>It documents.</span>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="px-4 py-16 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">No Manual Entry</h3>
                <p className="text-muted-foreground">
                  Foremen dictate hours and progress while walking the job. No end-of-day paperwork.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Structured Labor Data</h3>
                <p className="text-muted-foreground">
                  Labor hours, materials, and work phases are pulled directly from your voice notes.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Built for Disputes</h3>
                <p className="text-muted-foreground">
                  Every report is time-stamped and formatted for payment approvals, delay claims, and backup documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-12">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Speak</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  Record your daily summary on your phone—no training, no logins for your crew.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Analyze</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  VoiceLogPro structures your notes into Labor, Delays, Materials, and Phases.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Deliver</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  A clean PDF report lands in your email, ready to send or file.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Proof Without Testimonials */}
        <section className="px-4 py-16 bg-muted/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-8">
              What You Get Every Day
            </h2>

            <div className="bg-background rounded-xl border border-border p-6 md:p-8">
              <ul className="space-y-4">
                {[
                  { icon: Clock, text: "Date-stamped labor summary" },
                  { icon: Users, text: "Crew hours by phase" },
                  { icon: Shield, text: "Noted delays and impacts" },
                  { icon: FileCheck, text: "Professional PDF format" },
                  { icon: FileText, text: "Consistent documentation trail" },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground">
                  No chasing notes.<br />
                  No rebuilding the day from memory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing / Beta Gate - Two-Option System */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8 text-center">
              Choose your path
            </h2>

            {/* Two-Option Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT CARD — Free Gate (Solo Beta) */}
              <div className="bg-background rounded-xl border border-border p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Solo Beta</h3>
                    <p className="text-3xl font-bold text-primary">$0 <span className="text-base font-normal text-muted-foreground">/ Free</span></p>
                  </div>
                </div>

                <div className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-6">
                  No Credit Card Required
                </div>

                <ul className="space-y-3 mb-6">
                  {["Unlimited Voice Logs", "Standard PDF Reports", "Email Support"].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/crew-plan" onClick={vibrate}>
                  <Button variant="outline" size="xl" className="w-full min-h-[52px] text-base font-bold">
                    Join Beta Free
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Risk Free. Cancel anytime.
                </p>
              </div>

              {/* RIGHT CARD — Paid Gate (Crew Plan) */}
              <div className="bg-background rounded-xl border-2 border-primary p-6 md:p-8 relative">
                {/* Premium indicator */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>

                <div className="flex items-center gap-3 mb-4 pt-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Crew Plan</h3>
                    <p className="text-3xl font-bold text-primary">$49 <span className="text-base font-normal text-muted-foreground">/ month</span></p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 mt-6">
                  {["All Beta features", "Up to 5 Crews", "Priority Onboarding", "Custom Branding"].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Access is limited to ensure high-touch support for early users.
                </p>

                <Link to="/crew-plan" onClick={vibrate}>
                  <Button variant="cta" size="xl" className="w-full min-h-[52px] text-base font-bold">
                    Get Crew Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Positioning */}
        <section className="px-4 py-16 bg-muted/50">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
              Built for Heavy Gloves,<br />
              Not Thin Screens.
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Most tools are built for GCs in an office.
              VoiceLogPro is built for subcontractors in the field—voice-first, jobsite-ready, and trained on real construction language.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
              Stop Letting Billable Work Go Missing.
            </h2>

            <BetaCTA className="mb-6" />

            <p className="text-muted-foreground">
              Speak once. Document everything.
            </p>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="px-4 py-8 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VoiceLogPro. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
