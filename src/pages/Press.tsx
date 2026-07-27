import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://voicelogpro.com/" },
    { "@type": "ListItem", position: 2, name: "Press", item: "https://voicelogpro.com/press" },
  ],
};

const pressSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "VoiceLogPro Press & Media Kit",
  description:
    "Media kit and podcast one-sheet for VoiceLogPro — the voice-to-PDF daily construction report tool built by subcontractors. Founder bio, show topics, and contact for podcast hosts and journalists.",
};

const showTopics = [
  {
    title: "The $40,000 daily log",
    angle:
      "How one missing daily report on a Dallas data-center build turned a profitable job into a loss — and why the problem was documentation, not workmanship.",
    link: "/about",
  },
  {
    title: "Why subcontractors lose payment disputes",
    angle:
      "He-said-she-said disputes are won by whoever has the timestamped record. How daily logs become court-ready evidence under Texas Property Code Chapter 53 and similar lien laws.",
    link: "/solutions/texas-mechanics-lien-compliance",
  },
  {
    title: "Gloves-on reporting: voice instead of typing",
    angle:
      "Field crews lose 30+ minutes a day typing reports at the end of a shift. What changes when a 30-second voice note becomes a formatted, weather-tagged PDF.",
    link: "/court-ready-daily-logs",
  },
  {
    title: "Constructive acceleration & delay claims",
    angle:
      "When a GC compresses the schedule, the subcontractor eats the cost unless the delay is documented in real time. How contemporaneous logs defend acceleration claims.",
    link: "/solutions/constructive-acceleration-defense",
  },
];

const sampleQuestions = [
  "Why do subcontractors keep losing money on work they actually completed?",
  "What makes a daily log 'court-ready' — and why do most field notes fail that test?",
  "How does a 30-second voice note hold up in a payment dispute?",
  "What's the one report a subcontractor should never end a shift without?",
  "How is AI changing construction compliance without replacing the crew?",
];

export default function Press() {
  return (
    <>
      <Helmet>
        <title>VoiceLogPro Press & Media Kit — Podcast One-Sheet</title>
        <meta
          name="description"
          content="Media kit and podcast one-sheet for VoiceLogPro. Founder bio, show topics, sample questions, and press contact for construction, trades, and legal podcasts."
        />
        <link rel="canonical" href="https://voicelogpro.com/press" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="VoiceLogPro Press & Media Kit — Podcast One-Sheet" />
        <meta
          property="og:description"
          content="Founder bio, show topics, and sample questions for podcast hosts and journalists covering construction, the trades, and payment protection."
        />
        <meta property="og:url" content="https://voicelogpro.com/press" />
        <meta property="og:image" content="https://voicelogpro.com/images/og-card.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VoiceLogPro Press & Media Kit" />
        <meta
          name="twitter:description"
          content="Podcast one-sheet and media kit for VoiceLogPro — voice-to-PDF daily construction reports."
        />
      </Helmet>

      <JsonLd schema={[breadcrumbSchema, pressSchema]} />

      <section
        className="press-hero"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#f1f5f9",
          padding: "60px 24px 48px",
          borderBottom: "3px solid #00d4aa",
        }}
      >
        <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              color: "#00d4aa",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              margin: "0 0 12px",
            }}
          >
            Press &amp; Media Kit
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.15,
              margin: "0 0 16px",
              background: "linear-gradient(135deg, #fff, #94a3b8)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            For podcast hosts &amp; journalists covering the trades
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#cbd5e1",
              maxWidth: "680px",
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}
          >
            VoiceLogPro turns voice notes into court-ready daily construction reports for
            subcontractors. If your audience is electricians, plumbers, HVAC crews, GCs, or
            construction-tech buyers — here's everything you need to book the show.
          </p>
          <a
            href="mailto:hello@voicelogpro.com?subject=Podcast%20%2F%20Press%20Inquiry"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #00d4aa, #2deec0)",
              color: "#04130e",
              padding: "14px 32px",
              borderRadius: "10px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.95rem",
              boxShadow: "0 8px 24px -10px rgba(0,212,170,0.5)",
            }}
          >
            Book the founder →
          </a>
        </div>
      </section>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 20px", color: "#cbd5e1" }}>
        <Section title="At a glance" accent="#00d4aa">
          <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            <Fact label="Product" value="Voice-to-PDF daily construction reports" />
            <Fact label="Who it's for" value="Subcontractors: electrical, plumbing, HVAC, roofing, GC crews" />
            <Fact label="Founded" value="2024" />
            <Fact label="Price" value="$49/month per crew. Flat." />
            <Fact label="Headline benefit" value="Defend payment disputes & lien rights with timestamped logs" />
            <Fact label="Based" value="Remote-first, built on real U.S. jobsites" />
          </div>
        </Section>

        <Section title="About the founder" accent="#00d4aa">
          <p style={{ color: "#cbd5e1", lineHeight: 1.7, margin: "0 0 12px" }}>
            VoiceLogPro was built by an electrical foreman who spent years on real jobsites —
            conduit in one hand, change orders in the other. The idea came after a Dallas
            data-center build where a single missing daily log turned a profitable job into a
            loss. The work was sound; the documentation wasn't.
          </p>
          <p style={{ color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
            The mission is straightforward: the trades shouldn't have to choose between doing
            the work and documenting it. VoiceLogPro turns a 30-second gloves-on voice note
            into a timestamped, weather-corroborated, court-ready PDF — so the crew can go home
            on time and still get paid.
          </p>
          <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <OutLink href="https://x.com/sipiteno">X / Twitter</OutLink>
            <OutLink href="https://www.linkedin.com/in/kushnir-maryan/">LinkedIn</OutLink>
            <OutLink href="https://voicelogpro.com/about">Full story</OutLink>
          </div>
        </Section>

        <Section title="Show topics & segment ideas" accent="#f97316">
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "0 0 16px" }}>
            Each topic maps to a real resource on the site — no invented stats, just problems
            subcontractors actually face.
          </p>
          <div style={{ display: "grid", gap: "12px" }}>
            {showTopics.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderLeft: "3px solid #f97316",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <h3 style={{ margin: "0 0 6px", color: "#f1f5f9", fontSize: "1rem" }}>{t.title}</h3>
                <p style={{ margin: "0 0 8px", color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>{t.angle}</p>
                <Link
                  to={t.link}
                  style={{ color: "#00d4aa", fontSize: "0.82rem", textDecoration: "underline" }}
                >
                  Supporting resource →
                </Link>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Sample questions to ask" accent="#f97316">
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#cbd5e1", lineHeight: 1.9 }}>
            {sampleQuestions.map((q, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>{q}</li>
            ))}
          </ul>
        </Section>

        <Section title="Booking logistics" accent="#00d4aa">
          <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <Fact label="Format" value="Audio or video. Remote only." />
            <Fact label="Length" value="15–60 min. Flexible." />
            <Fact label="Lead time" value="Book within 48 hours where possible." />
            <Fact label="Promotion" value="We will share every episode with our crew audience." />
          </div>
          <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "16px 0 0" }}>
            Bio, headshot, and intro copy available on request — email and we'll send same-day.
          </p>
        </Section>

        <section style={{ textAlign: "center", padding: "40px 0 20px" }}>
          <h2 style={{ fontSize: "1.5rem", margin: "0 0 12px", color: "#f1f5f9" }}>Ready to book?</h2>
          <p style={{ color: "#94a3b8", maxWidth: "560px", margin: "0 auto 24px" }}>
            Email us and we'll send the one-sheet, coordinate timing, and promote the episode.
          </p>
          <a
            href="mailto:hello@voicelogpro.com?subject=Podcast%20%2F%20Press%20Inquiry"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #00d4aa, #2deec0)",
              color: "#04130e",
              padding: "14px 32px",
              borderRadius: "10px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow: "0 8px 24px -10px rgba(0,212,170,0.5)",
            }}
          >
            Email the founder →
          </a>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "28px 0 0" }}>
            <Link to="/dream-100" style={{ color: "#00d4aa", textDecoration: "underline" }}>See the Dream 100</Link>
            {" · "}
            <Link to="/affiliates" style={{ color: "#00d4aa", textDecoration: "underline" }}>Affiliate program</Link>
            {" · "}
            <Link to="/about" style={{ color: "#00d4aa", textDecoration: "underline" }}>About VoiceLogPro</Link>
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "36px" }}>
      <h2 style={{ fontSize: "1.4rem", margin: "0 0 16px", color: accent }}>{title}</h2>
      {children}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "14px" }}>
      <div style={{ color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{label}</div>
      <div style={{ color: "#e2e8f0", fontSize: "0.92rem", lineHeight: 1.4 }}>{value}</div>
    </div>
  );
}

function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer me" style={{ display: "inline-block", background: "rgba(0,212,170,0.12)", color: "#00d4aa", border: "1px solid rgba(0,212,170,0.3)", padding: "6px 14px", borderRadius: "20px", fontSize: "0.82rem", textDecoration: "none" }}>
      {children}
    </a>
  );
}
