import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { FileCheck, Shield, MessageSquareQuote, Printer, Copy, Check, ArrowRight } from "lucide-react";

/**
 * The Daily Log Defense Kit — the lead magnet the squeeze page promises.
 * Delivered instantly on opt-in and linked from the day-0 sequence email.
 * Print-friendly: the whole kit survives a trip through a jobsite printer.
 */

const TEMPLATES: { trade: string; body: string }[] = [
  {
    trade: "Electrician — Daily Log",
    body: `DAILY LOG — [Company] — [Project / Job #]
Date: ____  Foreman: ____  Crew size: ____  Hours: ____
Weather (source + time checked): ____
Areas worked (bldg/floor/room): ____
Work performed (circuits, panels, rough-in, trim, terminations): ____
Inspections called / passed / failed: ____
Delays (cause, start-stop time, who was notified): ____
Extra work found (potential change order — describe + who approved verbally): ____
Materials received / shortages: ____
Safety incidents or near-misses: ____
Photos taken (count + what they show): ____
Signature: ____________  Time submitted: ____`,
  },
  {
    trade: "Plumber — Daily Log",
    body: `DAILY LOG — [Company] — [Project / Job #]
Date: ____  Foreman: ____  Crew size: ____  Hours: ____
Weather (source + time checked): ____
Areas worked (riser, stack, fixture group): ____
Work performed (underground, rough-in, top-out, trim, test): ____
Tests performed (pressure/leak — result, witness): ____
Delays (cause, duration, other trades blocking access): ____
Extra work found (potential change order — describe + who approved verbally): ____
Materials received / shortages: ____
Safety incidents or near-misses: ____
Photos taken (count + what they show): ____
Signature: ____________  Time submitted: ____`,
  },
  {
    trade: "HVAC — Daily Log",
    body: `DAILY LOG — [Company] — [Project / Job #]
Date: ____  Foreman: ____  Crew size: ____  Hours: ____
Weather (source + time checked): ____
Areas worked (unit/zone/floor): ____
Work performed (duct, set equipment, controls, startup, balance): ____
Equipment delivered / staged / set (serial #s if set): ____
Delays (cause, duration, who was notified): ____
Extra work found (potential change order — describe + who approved verbally): ____
Materials received / shortages: ____
Safety incidents or near-misses: ____
Photos taken (count + what they show): ____
Signature: ____________  Time submitted: ____`,
  },
  {
    trade: "General Contractor — Daily Log",
    body: `DAILY LOG — [Company] — [Project / Job #]
Date: ____  Superintendent: ____  Total workers on site (by sub): ____
Weather (source + time checked, impact on critical path): ____
Work performed by area + trade: ____
Subcontractors on site (arrival/departure): ____
Deliveries received / rejected: ____
Delays (cause, trade(s) affected, schedule impact in days): ____
RFIs / change orders discussed (with whom, outcome): ____
Visitors / inspections (name, agency, result): ____
Safety incidents, toolbox talks: ____
Photos taken (count + what they show): ____
Signature: ____________  Time submitted: ____`,
  },
  {
    trade: "Concrete / Foundation — Daily Log",
    body: `DAILY LOG — [Company] — [Project / Job #]
Date: ____  Foreman: ____  Crew size: ____  Hours: ____
Weather (temp AM/PM, precipitation, source + time checked): ____
Pour details (location, CY placed, mix design, tickets #): ____
Testing (slump, cylinders cast, air %, who tested): ____
Cure/protection measures (blankets, additives, duration): ____
Delays (weather hold? pump/batch plant? duration + notified): ____
Extra work found (potential change order — describe + who approved verbally): ____
Safety incidents or near-misses: ____
Photos taken (count + what they show): ____
Signature: ____________  Time submitted: ____`,
  },
];

const SWIPES: { title: string; when: string; body: string }[] = [
  {
    title: "Weather-delay entry (write it the day it happens)",
    when: "Use in your daily log the moment weather stops work.",
    body: `Weather delay: [date], work stopped [time] to [time] ([hours] hrs). Conditions: [rain/wind/temp] per [weather source] checked at [time]. Areas affected: [areas]. Crew reassigned to [task] / sent home. [GC contact name] notified at [time] by [text/call/email]. Photos taken: [count].`,
  },
  {
    title: "Reply to a rejected pay application",
    when: "Send within 48 hours of any rejection. Attach the logs.",
    body: `[Name],

We received the rejection of Pay Application #[N] citing [stated reason].

Attached are our daily logs for [date range], recorded on the days in question, including timestamps, weather data, photos, and crew counts. Specifically, the log dated [date] documents [the disputed event].

Please confirm by [date, 5 business days] which line items remain in dispute in light of this documentation, and release payment on the undisputed balance per the contract terms.

[Name / Company]`,
  },
  {
    title: "Same-day change-order confirmation (text or email)",
    when: "Send before you do the extra work, even if they approved it verbally.",
    body: `[Name] — confirming our conversation at [time] today: you directed us to [describe extra work] at [location], which is outside our current scope. We'll proceed on a T&M basis per the contract and will submit the change order paperwork by [date]. Reply if that's not your understanding.`,
  },
  {
    title: "Notice of delay caused by others",
    when: "Send the day another trade or the GC blocks your work.",
    body: `[Name],

Formal notice: our crew was unable to perform [work] at [area] on [date] from [time] to [time] because [cause — e.g., areas not ready, trade X occupying the space, materials not released].

This impacts our schedule by [estimate]. We reserve our rights under the contract regarding time extension and associated costs. Our daily log for [date], with photos, documents the condition.

[Name / Company]`,
  },
];

function CopyBlock({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable (http/print) — text is selectable anyway */
    }
  };
  return (
    <div className="relative">
      <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-input border-2 border-border p-4 pr-12 text-foreground/90 overflow-x-auto" style={{ borderRadius: "var(--radius)" }}>
        {text}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="absolute top-2 right-2 p-2 bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors print:hidden"
        style={{ borderRadius: "var(--radius)" }}
      >
        {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function DefenseKit() {
  return (
    <main className="min-h-screen bg-background print:bg-white">
      <Helmet>
        <title>Daily Log Defense Kit — Voice Log Pro</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://voicelogpro.com/defense-kit" />
      </Helmet>

      {/* Header */}
      <section className="section-container pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Free download — yours to keep</p>
          <h1 className="headline-section text-foreground mb-4">The Daily Log Defense Kit</h1>
          <p className="body-large max-w-2xl mx-auto mb-6">
            Five field-tested daily log templates, the Texas Chapter&nbsp;53 lien-rights checklist, and the
            Dispute Defense Swipe File. Print it, tape it inside the truck, and never lose a
            &ldquo;he-said-she-said&rdquo; again.
          </p>
          <Button variant="outline" size="lg" onClick={() => window.print()} className="print:hidden">
            <Printer className="w-5 h-5" /> Print the whole kit
          </Button>
        </div>
      </section>

      {/* Part 1 — Templates */}
      <section className="section-container pt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FileCheck className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Part 1 — 5 Daily Log Templates</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            The fields below are the ones GCs, adjusters, and attorneys actually look for. Fill every line,
            every day — a blank field on the wrong day is how a $40k pay app gets rejected.
          </p>
          <div className="space-y-8">
            {TEMPLATES.map(t => (
              <div key={t.trade}>
                <h3 className="font-bold text-foreground mb-2">{t.trade}</h3>
                <CopyBlock text={t.body} label={t.trade} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Part 2 — Texas Chapter 53 checklist */}
      <section className="section-container bg-secondary/30 print:bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Part 2 — Texas Chapter 53 Lien-Rights Checklist</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            In Texas, lien rights run on <strong className="text-foreground">calendar deadlines, not fairness</strong>.
            Do these every month you're unpaid on a private commercial project:
          </p>
          <ul className="space-y-4 text-foreground/90">
            {[
              ["Every day", "Complete daily log with weather, crew, work areas, and delays — your affidavit is only as strong as the logs behind it."],
              ["Every month you go unpaid", "Send the monthly notice to the GC and the owner by the 15th — certified mail, return receipt requested. Keep the green card with that month's logs."],
              ["Before the filing deadline", "File your lien affidavit with the county clerk — commercial deadlines fall on the 15th day of the month, a set number of months after the work. Run your exact dates below; miss it and the lien is gone even though the debt is real."],
              ["Always", "Never pause the paperwork because someone promised a check is coming. Notices preserve rights; promises don't."],
            ].map(([when, what]) => (
              <li key={when as string} className="flex gap-3">
                <Check className="w-5 h-5 text-success shrink-0 mt-1" />
                <span><strong className="text-foreground">{when}:</strong> {what}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 print:hidden">
            <a
              href="/tools/lien-deadline-calculator/"
              className="inline-flex items-center justify-center h-12 px-6 bg-primary text-primary-foreground font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
              style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow-hard-primary)" }}
            >
              Run your exact deadlines — free calculator
            </a>
            <Link
              to="/solutions/texas-mechanics-lien-compliance"
              className="inline-flex items-center justify-center h-12 px-6 border-2 border-border text-foreground font-bold uppercase tracking-wide hover:border-primary transition-colors"
              style={{ borderRadius: "var(--radius)" }}
            >
              Full Chapter 53 guide
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Educational information, not legal advice. Deadlines vary by project type and role — confirm yours
            with a construction attorney.
          </p>
        </div>
      </section>

      {/* Part 3 — Swipe file */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquareQuote className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Part 3 — Dispute Defense Swipe File</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Word-for-word scripts. Change the brackets, hit send. Each one turns a verbal mess into a
            dated, documented record.
          </p>
          <div className="space-y-8">
            {SWIPES.map(s => (
              <div key={s.title}>
                <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-primary mb-2">{s.when}</p>
                <CopyBlock text={s.body} label={s.title} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next rung CTA */}
      <section className="section-container bg-secondary/30 print:hidden">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="headline-section text-foreground mb-4">Now stop typing all of this</h2>
          <p className="body-large mb-8">
            The kit works — if you fill it in every single day. Voice Log Pro fills it for you: press record,
            speak, and get a timestamped, weather-stamped, court-ready PDF. Even offline.
          </p>
          <Link
            to="/crew-plan"
            className="inline-flex items-center justify-center h-14 px-8 bg-primary text-primary-foreground font-bold uppercase tracking-wide text-lg hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow-hard-primary)" }}
          >
            Reserve my beta spot <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <p className="text-sm text-muted-foreground mt-4">Free during beta. No credit card. 3 crew seats per batch.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
