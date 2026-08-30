import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle, FileText, Mic, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/Footer";
import { FoundingPilotCTA } from "@/components/FoundingPilotCTA";
import {
  FOUNDING_PILOT,
  FOUNDING_PILOT_DISCLAIMER,
  FOUNDING_PILOT_GUARANTEE,
} from "@/config/foundingPilot";
import { EVENTS, track } from "@/lib/posthog";

const submissionItems = [
  "Company and project name",
  "Report date and project location",
  "Voice note or written notes describing the work",
  "Crew size and hours, if known",
  "Materials, equipment, deliveries, delays, RFIs, change orders, or safety items, if relevant",
  "Optional photos with short captions",
];

export default function FoundingPilot() {
  useEffect(() => {
    track(EVENTS.foundingPilotViewed, {
      placement: "founding_pilot_page",
      offer: "founding_pilot",
      price_usd: FOUNDING_PILOT.priceUsd,
      billing: "one_time",
    });
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>$49 Founding Pilot | VoiceLogPro Daily Reports</title>
        <meta
          name="description"
          content="$49 one-time VoiceLogPro founding pilot: one crew, 7 days, and up to 5 human-assisted daily-report PDFs. No subscription or automatic renewal."
        />
        <link rel="canonical" href="https://voicelogpro.com/founding-pilot" />
        <meta property="og:title" content="$49 VoiceLogPro Founding Pilot" />
        <meta property="og:description" content="One crew, 7 days, up to 5 daily-report PDFs. One-time payment with no automatic renewal." />
        <meta property="og:url" content="https://voicelogpro.com/founding-pilot" />
      </Helmet>

      <section className="section-container border-b border-border bg-secondary/20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Human-assisted founding pilot</p>
          <h1 className="headline-primary mb-6">Your crew talks. We deliver the daily report.</h1>
          <p className="mx-auto mb-3 max-w-3xl text-xl text-muted-foreground">
            $49 one-time founding pilot. One crew, 7 days, up to 5 daily-report PDFs. No subscription.
          </p>
          <p className="mb-8 font-semibold">One-time payment. No automatic renewal.</p>
          <FoundingPilotCTA placement="founding_pilot_hero" />
        </div>
      </section>

      <section className="section-container">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            { icon: Mic, title: "Send the jobsite facts", text: "Email a voice note, written notes, and optional jobsite photos after the walk." },
            { icon: FileText, title: "We structure the report", text: "VoiceLogPro turns only the information you supply into a clear daily-report PDF." },
            { icon: ShieldCheck, title: "Keep a clearer record", text: "Use the finished PDF as structured documentation intended to support your project records." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="card-industrial">
              <Icon className="mb-4 h-7 w-7 text-primary" aria-hidden="true" />
              <h2 className="mb-2 text-xl font-bold">{title}</h2>
              <p className="text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-container bg-secondary/20">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div>
            <h2 className="headline-section mb-5">What the pilot includes</h2>
            <ul className="space-y-3">
              {["One subcontractor company", "One crew", "Seven consecutive calendar days starting from onboarding confirmation", "Up to 5 daily-report PDFs"].map((item) => (
                <li key={item} className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{item}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="headline-section mb-5">What to submit</h2>
            <ul className="space-y-3">
              {submissionItems.map((item) => (
                <li key={item} className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-container">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h2 className="headline-section mb-3">Turnaround</h2>
            <p className="body-large">Delivery target: same business day for a complete submission received before noon US Eastern; otherwise by the next business day.</p>
          </div>
          <div>
            <h2 className="headline-section mb-3">What this pilot does not include</h2>
            <p className="text-muted-foreground">This is a human-assisted concierge service, not the finished self-serve app. It does not promise automatic transcription, offline processing, automatic geolocation, automatic weather, legal compliance, or a 30-second automated result.</p>
          </div>
          <div className="card-industrial border-primary">
            <h2 className="mb-3 text-2xl font-bold">Useful-report guarantee</h2>
            <p>{FOUNDING_PILOT_GUARANTEE}</p>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Important limitation</p>
            <p>{FOUNDING_PILOT_DISCLAIMER}</p>
            <p className="mt-2">Customer-reported event times are kept separate from file-received times. Missing details are shown as Not provided or omitted. Weather is included only when a source and retrieval time are supplied.</p>
          </div>
          <div className="text-center">
            <FoundingPilotCTA placement="founding_pilot_bottom" />
            <p className="mt-4 text-sm text-muted-foreground">Not ready to pay? <Link className="font-semibold text-primary underline" to="/defense-kit">Get the free Daily Log Defense Kit.</Link></p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
