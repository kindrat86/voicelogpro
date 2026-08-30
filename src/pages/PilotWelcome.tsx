import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { FOUNDING_PILOT } from "@/config/foundingPilot";
import { EVENTS, track } from "@/lib/posthog";

const intake = [
  "Company name",
  "Project or job name",
  "Project city and state, or country",
  "Report date",
  "Person submitting the report",
  "Voice note or written notes",
  "Crew size and hours, if known",
  "Work completed",
  "Materials, equipment, and deliveries, if relevant",
  "Delays, blockers, RFIs, change orders, or safety items, if relevant",
  "Optional photos with simple captions",
  "Desired company logo for branding, if any",
];

export default function PilotWelcome() {
  useEffect(() => {
    track(EVENTS.foundingPilotOnboardingViewed, {
      placement: "pilot_welcome",
      offer: "founding_pilot",
      price_usd: FOUNDING_PILOT.priceUsd,
      billing: "one_time",
    });
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Founding Pilot Onboarding | VoiceLogPro</title>
        <meta name="description" content="Onboarding instructions for the VoiceLogPro Founding Pilot." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://voicelogpro.com/pilot-welcome" />
      </Helmet>
      <section className="section-container">
        <div className="mx-auto max-w-3xl">
          <Link to="/founding-pilot" className="mb-8 inline-flex text-primary underline">Back to pilot details</Link>
          <h1 className="headline-primary mb-5">Send your pilot onboarding details</h1>
          <p className="body-large mb-8">If you just completed checkout, welcome. Stripe will email your receipt. Send the onboarding information below so we can begin.</p>

          <div className="card-industrial mb-8">
            <h2 className="mb-3 text-2xl font-bold">Email your intake</h2>
            <p>Send everything to <a className="font-bold text-primary underline" href={`mailto:${FOUNDING_PILOT.onboardingEmail}`}>{FOUNDING_PILOT.onboardingEmail}</a>.</p>
          </div>

          <h2 className="headline-section mb-4">Include these details</h2>
          <ul className="mb-8 list-disc space-y-2 pl-6">
            {intake.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h2 className="headline-section mb-4">Voice and photo submissions</h2>
          <p className="mb-8 text-muted-foreground">Attach common audio files or share written notes in the email body. Attach photos as separate files and give each a simple caption. Keep each report date in its own email thread when practical.</p>

          <h2 className="headline-section mb-4">Turnaround</h2>
          <p className="mb-8 text-muted-foreground">Our delivery target is the same business day for a complete submission received before noon US Eastern; otherwise by the next business day.</p>

          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-5">
            <h2 className="mb-2 text-xl font-bold">Keep sensitive data out</h2>
            <p>Do not send passwords, payment-card data, government IDs, medical information, or unrelated sensitive personal data.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
