import { CheckCircle, FileText, ShieldCheck } from "lucide-react";
import { FoundingPilotCTA } from "@/components/FoundingPilotCTA";

const deliverables = [
  "One subcontractor company and one crew",
  "Seven consecutive calendar days",
  "Up to 5 human-assisted daily-report PDFs",
  "Voice notes, written notes, and optional photos accepted by email",
];

export function OrderBumpSection() {
  return (
    <section id="crew-plan" className="section-container bg-secondary/30">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">Available now</p>
          <h2 className="headline-section mb-3 text-foreground">Start with the Founding Pilot</h2>
          <p className="body-large mx-auto max-w-2xl">$49 one-time. One crew, 7 days, up to 5 finished daily-report PDFs.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <article className="card-industrial border-2 border-primary">
            <h3 className="mb-2 text-2xl font-bold">VoiceLogPro Founding Pilot</h3>
            <p className="mb-6 text-4xl font-bold text-primary">$49 <span className="text-base font-normal text-muted-foreground">one-time</span></p>
            <ul className="mb-7 space-y-3">
              {deliverables.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <FoundingPilotCTA placement="homepage_offer" className="w-full" />
            <p className="mt-3 text-center text-sm text-muted-foreground">One-time payment. No automatic renewal.</p>
          </article>

          <aside className="card-industrial">
            <ShieldCheck className="mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-3 text-xl font-bold">Useful-report guarantee</h3>
            <p className="mb-6 text-sm text-muted-foreground">If the pilot reports are not useful, email hello@voicelogpro.com within 7 calendar days after the final pilot report and we will refund the $49 pilot payment.</p>
            <FileText className="mb-3 h-7 w-7 text-primary" />
            <h3 className="mb-2 text-xl font-bold">Human-assisted delivery</h3>
            <p className="text-sm text-muted-foreground">This pilot sells the finished report outcome now. It does not claim that the unfinished self-serve app is already operating automatically.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
