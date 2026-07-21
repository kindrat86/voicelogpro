import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Clock,
  MapPin,
  CloudSun,
  Camera,
  ListChecks,
  Scale,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { softwareApplicationSchema, organizationSchema } from "@/seo/softwareSchema";

const REVIEWED = "2026-07-18";
const CANONICAL = "https://voicelogpro.com/court-ready-daily-logs";

/** The five elements that make a daily log hold up as evidence. */
const ELEMENTS = [
  {
    icon: Clock,
    title: "Contemporaneous",
    body: "Created at the time of the event, not reconstructed weeks later from memory. A record written the day the delay happened carries far more weight in a dispute than a summary assembled after a claim arises.",
  },
  {
    icon: Clock,
    title: "Timestamped",
    body: "Each entry carries an objective date and time it was captured, so no one can argue about when it was written. Reliable timestamps are what turn a note into a dated business record.",
  },
  {
    icon: CloudSun,
    title: "Objectively corroborated",
    body: "Independent data — like weather conditions at the time — converts a subjective claim ('it was raining hard') into verifiable evidence ('0.8 in. of rain recorded at 7:30 AM'). Objective corroboration is what defeats a 'he said, she said'.",
  },
  {
    icon: Camera,
    title: "Photo evidence with metadata",
    body: "Photographs with embedded timestamp and geolocation prove what a site looked like, where, and when. A photo without metadata can be disputed as 'taken somewhere else, some other day'; one with it usually can't.",
  },
  {
    icon: ListChecks,
    title: "Complete and consistent",
    body: "A daily habit, not selective record-keeping. Continuous logs read as routine business records; gaps and one-off entries invite the argument that documentation was created for the dispute.",
  },
];

/** Each dispute type links to the jurisdiction/scenario page that covers it in depth. */
const DISPUTES = [
  {
    title: "Payment disputes",
    body: "Prove what work you performed, when, and that it met spec — before a general contractor reframes the story.",
    href: "/solutions/phase-payment-disputes",
    linkText: "Phase vs. actual payment disputes",
  },
  {
    title: "Mechanics liens",
    body: "Lien claims require proof that labor and materials were furnished on specific dates. A dated daily log is the primary evidence, and it keeps your notice deadlines visible.",
    href: "/solutions/texas-mechanics-lien-compliance",
    linkText: "Texas mechanics-lien compliance",
  },
  {
    title: "Delay & constructive-acceleration claims",
    body: "A delay claim lives or dies on contemporaneous documentation of the delay event, its cause, and any directive to accelerate anyway.",
    href: "/solutions/constructive-acceleration-defense",
    linkText: "Constructive-acceleration defense",
  },
  {
    title: "GC backcharges & deductions",
    body: "Timestamped completion photos and crew-hour records preempt blame-shifting when a GC claims work was late, defective, or never done.",
    href: "/how-to/defend-unfair-gc-deductions",
    linkText: "Defend against unfair deductions",
  },
];

const FAQS = [
  {
    question: "What makes a construction daily log court-ready?",
    answer:
      "A court-ready daily log is a contemporaneous business record: created at the time of the work, with reliable timestamps, objective corroborating data (such as weather), photos carrying embedded metadata, and a complete, consistent history. Those qualities are what let adjudicators and courts treat it as trustworthy evidence rather than after-the-fact recollection.",
  },
  {
    question: "Are voice-generated or AI-generated daily logs admissible as evidence?",
    answer:
      "What matters legally is not how a record was typed but whether it is a contemporaneous business record with reliable metadata. A VoiceLogPro PDF preserves the capture time, weather, and geotagged photos, which is exactly the kind of contemporaneous record admitted under the business-records exception (for example, Texas Rule of Evidence 803(6) and Federal Rule of Evidence 803(6)). Keep exported PDFs unaltered and stored alongside the source project file, and consult your attorney on admissibility in your jurisdiction.",
  },
  {
    question: "What does 'contemporaneous' mean and why does it matter so much?",
    answer:
      "Contemporaneous means the record was made at or near the time of the event it describes. Courts and adjudicators consistently give contemporaneous records more weight than testimony or documents reconstructed after a dispute begins, because there was no motive to shade the facts when the entry was made. A daily log recorded on the jobsite is contemporaneous; a timeline rebuilt months later for a claim is not.",
  },
  {
    question: "Do jobsite photos need metadata to hold up in a dispute?",
    answer:
      "Metadata makes photos far harder to challenge. A photo file with an embedded timestamp and GPS coordinates establishes an objective record of site conditions on a specific date and place. Without that metadata, the other side can argue the image was taken at a different time or location. VoiceLogPro embeds timestamp and geolocation automatically when photos are attached to a daily report.",
  },
  {
    question: "How long should I keep my daily logs?",
    answer:
      "Keep them at least through every applicable notice deadline, lien-filing deadline, and the enforcement or limitations period for a potential claim — these vary by state and contract, and some run for years after the last day worked. Because deadlines are strict, retain complete records for the full project and beyond, and confirm the exact periods with a construction attorney in your jurisdiction.",
  },
];

const CourtReadyDailyLogs = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${CANONICAL}#article`,
    headline: "Court-Ready Construction Daily Logs: How to Document Disputes, Liens & Delay Claims",
    description:
      "What makes a construction daily log hold up as evidence in a payment dispute, mechanics lien, or delay claim — and how voice-to-PDF logging captures it.",
    dateModified: REVIEWED,
    author: { "@type": "Organization", name: "VoiceLogPro" },
    publisher: { "@type": "Organization", name: "VoiceLogPro" },
    mainEntityOfPage: CANONICAL,
  };
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${CANONICAL}#howto`,
    name: "How to keep a court-ready construction daily log",
    description:
      "Create daily logs that hold up as evidence by capturing contemporaneous, timestamped, corroborated, photo-backed, and consistent records.",
    dateModified: REVIEWED,
    tool: { "@type": "HowToTool", name: "VoiceLogPro" },
    step: ELEMENTS.map((e, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: e.title,
      text: e.body,
    })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${CANONICAL}#faq`,
    dateModified: REVIEWED,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const qaPageSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": `${CANONICAL}#qa`,
    dateModified: REVIEWED,
    mainEntity: {
      "@type": "Question",
      name: "What makes a construction daily log court-ready?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A construction daily log is court-ready when it is a contemporaneous business record — created at the time of the work, timestamped, corroborated by objective data (weather reports, geotagged photos), maintained as part of regular business practice, and consistent across entries. The five elements — contemporaneous creation, timestamp verification, corroboration, photo evidence, and consistency — make the record admissible under the business-records exception to the hearsay rule (e.g., Federal Rule of Evidence 803(6)). VoiceLogPro captures all five by voice in about 30 seconds on-site.",
        dateModified: REVIEWED,
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>Court-Ready Construction Daily Logs | Evidence for Disputes, Liens & Delays | VoiceLogPro</title>
        <meta
          name="description"
          content="What makes a construction daily log court-ready — contemporaneous, timestamped, weather-corroborated, photo-backed evidence for payment disputes, mechanics liens, and delay claims. Built for subcontractors."
        />
        <link rel="canonical" href={CANONICAL} />
      </Helmet>
      <JsonLd schema={[softwareApplicationSchema, organizationSchema, articleSchema, howToSchema, faqSchema, qaPageSchema]} />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="mx-2">›</span>
              <span className="text-foreground">Court-Ready Daily Logs</span>
            </nav>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Court-Ready Construction Daily Logs
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl">
              A construction daily log is court-ready when it is a <strong className="text-foreground">contemporaneous
              business record</strong> — created at the time of the work, timestamped, corroborated by objective
              data like weather, backed by geotagged photos, and kept consistently. Those five qualities are what
              let it defend a payment dispute, mechanics lien, or delay claim.
            </p>
            <p className="text-sm text-muted-foreground mb-8">Reviewed July 2026 · For subcontractors in the trades</p>
            <Link to="/beta">
              <Button size="lg" className="font-semibold">
                Start a court-ready log by voice
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* The five elements */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              The five elements of a court-ready daily log
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Miss any one and the record gets easier to challenge. Each element stands on its own — and each is
              something you can capture in seconds from the jobsite.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {ELEMENTS.map((el) => (
                <div key={el.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <el.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{el.title}</h3>
                    <p className="text-muted-foreground text-sm">{el.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why courts weight contemporaneous records */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="h-8 w-8 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Why courts weight contemporaneous records
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground max-w-2xl">
              <p>
                A daily log is the single most important piece of evidence in most construction disputes because it
                is <strong className="text-foreground">contemporaneous</strong> — written on the day it describes,
                not reconstructed from memory once a claim is on the line. That real-time quality is what gives it
                weight.
              </p>
              <p>
                Contemporaneous entries are admitted under the business-records exception to the hearsay rule (for
                example, Texas Rule of Evidence 803(6) and Federal Rule of Evidence 803(6)). A timestamped daily log
                noting that steel arrived two weeks late tends to carry more weight than a memo written months later
                recalling the same event.
              </p>
              <p>
                The practical takeaway: don't wait until there's a problem to start documenting. The record you
                create routinely, before any dispute, is the one that holds up when a dispute finally arrives.
              </p>
            </div>
          </div>
        </section>

        {/* The four disputes — interlinking hub */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Four disputes a court-ready log wins
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              The same daily habit protects you across the situations subcontractors most often lose money to.
              Each links to a detailed, jurisdiction-aware guide.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {DISPUTES.map((d) => (
                <div key={d.title} className="rounded-lg border border-border bg-background p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{d.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{d.body}</p>
                  <Link to={d.href} className="text-sm font-medium text-primary hover:underline inline-flex items-center">
                    {d.linkText}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-8 text-sm text-muted-foreground">
              See also:{" "}
              <Link to="/how-to/document-construction-delays" className="text-primary hover:underline">document construction delays</Link>{" · "}
              <Link to="/how-to/protect-lien-rights-as-subcontractor" className="text-primary hover:underline">protect your lien rights</Link>{" · "}
              <Link to="/solutions/building-safety-act-golden-thread" className="text-primary hover:underline">UK Building Safety Act golden thread</Link>
            </div>
          </div>
        </section>

        {/* How VoiceLogPro does it */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              How VoiceLogPro captures all five — by voice
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Clock className="h-7 w-7 text-primary" />
                <h3 className="font-semibold text-foreground">Speak your day</h3>
                <p className="text-muted-foreground text-sm">
                  Dictate the day's work, crew, and conditions in about 30 seconds — gloves on, no typing. Every
                  entry is timestamped as it's captured.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1"><CloudSun className="h-7 w-7 text-primary" /><MapPin className="h-7 w-7 text-primary" /></div>
                <h3 className="font-semibold text-foreground">Auto-corroborated</h3>
                <p className="text-muted-foreground text-sm">
                  Weather and geolocation are tagged automatically, and attached photos keep their embedded
                  timestamp and GPS metadata.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <ShieldCheck className="h-7 w-7 text-primary" />
                <h3 className="font-semibold text-foreground">Court-ready PDF</h3>
                <p className="text-muted-foreground text-sm">
                  Export a clean, dispute-ready PDF with all metadata embedded — no lock-in. Keep every report you
                  generate.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/beta">
                <Button size="lg" className="font-semibold">
                  Join the beta — Solo plan is free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-muted/30" id="faq">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border/50 rounded-lg px-2">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> VoiceLogPro provides documentation tools to support your record-keeping.
              This page is for educational purposes only and is not legal advice. Rules of evidence, lien deadlines,
              and claim requirements vary by jurisdiction and contract — consult a licensed construction attorney
              for guidance on your situation.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default CourtReadyDailyLogs;
