import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://voicelogpro.com/" },
    { "@type": "ListItem", position: 2, name: "Dream 100", item: "https://voicelogpro.com/dream-100" },
  ],
};

const dream100Schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "VoiceLogPro Dream 100 — Where Construction Subcontractors Gather",
  description:
    "Complete directory of construction trade associations, Reddit communities, LinkedIn groups, podcasts, YouTube channels, and trade publications where VoiceLogPro connects with subcontractors, electricians, plumbers, HVAC contractors, and roofers.",
};

// Dream 100 categories with detailed entries
const associations = [
  { name: "National Association of Home Builders (NAHB)", url: "https://www.nahb.org", desc: "Largest U.S. trade association for residential home builders and remodelers." },
  { name: "Associated General Contractors of America (AGC)", url: "https://www.agc.org", desc: "Premier association for commercial construction contractors." },
  { name: "National Electrical Contractors Association (NECA)", url: "https://www.necanet.org", desc: "Leading voice for electrical contractors in the U.S." },
  { name: "Independent Electrical Contractors (IEC)", url: "https://www.ieci.org", desc: "Trade association for merit-shop electrical and systems contractors." },
  { name: "Plumbing-Heating-Cooling Contractors Association (PHCC)", url: "https://www.phccweb.org", desc: "National association for plumbing and HVAC contractors." },
  { name: "Air Conditioning Contractors of America (ACCA)", url: "https://www.acca.org", desc: "HVAC contracting industry authority." },
  { name: "National Roofing Contractors Association (NRCA)", url: "https://www.nrca.net", desc: "One of the largest roofing trade associations in the world." },
  { name: "Sheet Metal and Air Conditioning Contractors' National Association (SMACNA)", url: "https://www.smacna.org", desc: "Trade association for sheet metal and HVAC contractors." },
  { name: "American Subcontractors Association (ASA)", url: "https://www.asaonline.com", desc: "National association dedicated to the needs of subcontractors." },
  { name: "Associated Builders and Contractors (ABC)", url: "https://www.abc.org", desc: "National trade association representing merit shop contractors." },
];

const redditCommunities = [
  { name: "r/Construction", url: "https://www.reddit.com/r/Construction/", subs: "900k+", desc: "The largest construction community on Reddit." },
  { name: "r/electricians", url: "https://www.reddit.com/r/electricians/", subs: "550k+", desc: "Community for electrical professionals." },
  { name: "r/plumbing", url: "https://www.reddit.com/r/plumbing/", subs: "300k+", desc: "Pro plumbers and apprentices sharing trade knowledge." },
  { name: "r/HVAC", url: "https://www.reddit.com/r/HVAC/", subs: "250k+", desc: "HVAC professionals discussion." },
  { name: "r/Roofing", url: "https://www.reddit.com/r/Roofing/", subs: "100k+", desc: "Roofing contractors and industry talk." },
  { name: "r/GeneralContractor", url: "https://www.reddit.com/r/GeneralContractor/", subs: "75k+", desc: "GC-specific community." },
  { name: "r/ConstructionManagers", url: "https://www.reddit.com/r/ConstructionManagers/", subs: "60k+", desc: "Project management and construction leadership." },
  { name: "r/estimators", url: "https://www.reddit.com/r/estimators/", subs: "40k+", desc: "Construction estimating and takeoffs." },
  { name: "r/ConstructionTech", url: "https://www.reddit.com/r/ConstructionTech/", subs: "25k+", desc: "Construction technology and software discussions." },
];

const linkedinGroups = [
  { name: "Construction Industry Professionals", url: "https://www.linkedin.com/groups/1234/", desc: "Largest construction LinkedIn group." },
  { name: "Electrical Contractors Network", url: "https://www.linkedin.com/groups/", desc: "NECA-affiliated electrical contractor discussions." },
  { name: "Plumbing & HVAC Contractors", url: "https://www.linkedin.com/groups/", desc: "Trade-specific networking for plumbing and HVAC pros." },
  { name: "Subcontractor Success", url: "https://www.linkedin.com/groups/", desc: "Peer support and business growth for subcontractors." },
  { name: "Construction Law & Lien Rights", url: "https://www.linkedin.com/groups/", desc: "Legal aspects of construction payment protection." },
];

const podcasts = [
  { name: "The Constructor Podcast (AGC)", url: "https://www.agc.org/constructor-podcast", desc: "AGC's official construction industry podcast." },
  { name: "Construction Brothers Podcast", url: "https://constructionbrotherspodcast.com", desc: "Story-driven podcast about life in construction." },
  { name: "The Build Show Podcast", url: "https://buildshownetwork.com", desc: "Matt Risinger's construction science podcast." },
  { name: "Construction Leading Edge", url: "https://constructionleadingedge.com", desc: "Business growth for construction contractors." },
  { name: "Elevate Construction Podcast", url: "https://elevateconstructionist.com", desc: "Interviews with construction industry leaders." },
  { name: "The Electrical Contractor Podcast", url: "https://www.ecmag.com", desc: "NECA-backed electrical contracting news." },
  { name: "PHCC Contractor Podcast", url: "https://www.phccweb.org", desc: "Plumbing and HVAC contractor insights." },
];

const oshaResources = [
  { name: "OSHA Recordkeeping Handbook", url: "https://www.osha.gov/recordkeeping", desc: "Official OSHA recordkeeping requirements for construction." },
  { name: "OSHA 300 Log", url: "https://www.osha.gov/recordkeeping/OSHA300-log", desc: "Required injury and illness log for contractors." },
  { name: "OSHA Construction eTool", url: "https://www.osha.gov/etools/construction", desc: "Interactive safety guide for construction sites." },
  { name: "OSHA Training Institute", url: "https://www.osha.gov/otiec", desc: "Authorized OSHA training for construction safety." },
];

const lienLawAttorneys = [
  { name: "Texas Lien Law (Chapter 53)", url: "https://voicelogpro.com/blog/texas-property-code-chapter-53-guide-2025", desc: "Complete guide to Texas Property Code Chapter 53 for subcontractors." },
  { name: "NCS Credit — Lien & Bond Claim Services", url: "https://www.ncscredit.com", desc: "National lien management and filing service." },
  { name: "Levelset (Formerly Zlien)", url: "https://www.levelset.com", desc: "Lien waiver and payment protection platform." },
  { name: "Lien Lawyers Network", url: "https://voicelogpro.com/solutions/texas-mechanics-lien-compliance", desc: "Mechanics lien compliance and attorney referrals." },
];

const youtubeChannels = [
  { name: "The Engineering Mindset", url: "https://www.youtube.com/@EngineeringMindset", subs: "8M+", desc: "HVAC, electrical, and plumbing engineering explained." },
  { name: "Matt Risinger (The Build Show)", url: "https://www.youtube.com/@MattRisinger", subs: "1.2M+", desc: "High-quality construction science and building practices." },
  { name: "Electrician U", url: "https://www.youtube.com/@ElectricianU", subs: "1M+", desc: "Electrical code training and exam prep." },
  { name: "HVAC School", url: "https://www.youtube.com/@HVACSchool", subs: "400k+", desc: "HVACR training videos for techs." },
  { name: "Roger Wakefield Plumbing", url: "https://www.youtube.com/@RogerWakefield", subs: "1M+", desc: "Plumbing education and trade stories." },
  { name: "Perkins Builder Brothers", url: "https://www.youtube.com/@PerkinsBuilderBrothers", subs: "550k+", desc: "Real job-site build projects and construction tips." },
  { name: "Essential Craftsman", url: "https://www.youtube.com/@EssentialCraftsman", subs: "1M+", desc: "Trade skills, ethics, and construction philosophy." },
];

const tradePublications = [
  { name: "Engineering News-Record (ENR)", url: "https://www.enr.com", desc: "The construction industry's leading news magazine." },
  { name: "EC&M Magazine", url: "https://www.ecmweb.com", desc: "Electrical construction and maintenance news." },
  { name: "SNIPS Magazine", url: "https://www.snipsmag.com", desc: "Sheet metal, HVAC, and roofing industry news." },
  { name: "ForConstructionPros.com", url: "https://www.forconstructionpros.com", desc: "Construction equipment and technology news." },
  { name: "Construction Dive", url: "https://www.constructiondive.com", desc: "Daily construction industry news briefing." },
  { name: "Plumbing & Mechanical Magazine", url: "https://www.pmmag.com", desc: "Plumbing and mechanical contracting news." },
  { name: "Roofing Contractor Magazine", url: "https://www.roofingcontractor.com", desc: "Roofing industry news and best practices." },
];

export default function Dream100() {
  return (
    <>
      <Helmet>
        <title>VoiceLogPro Dream 100 — Construction Community Directory</title>
        <meta
          name="description"
          content="The complete VoiceLogPro Dream 100 directory: construction trade associations, Reddit communities, LinkedIn groups, podcasts, OSHA resources, lien law attorneys, YouTube channels, and trade publications for subcontractors."
        />
        <link rel="canonical" href="https://voicelogpro.com/dream-100" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="VoiceLogPro Dream 100 — Construction Community Directory" />
        <meta
          property="og:description"
          content="Complete directory of construction trade associations, Reddit communities, LinkedIn groups, podcasts, OSHA resources, lien law attorneys, YouTube channels, and trade publications for subcontractors."
        />
        <meta property="og:url" content="https://voicelogpro.com/dream-100" />
        <meta name="twitter:title" content="VoiceLogPro Dream 100 — Construction Community Directory" />
        <meta name="twitter:description" content="Complete directory for construction subcontractor communities and resources." />
      </Helmet>

      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={dream100Schema} />

      {/* Hero Section */}
      <section className="dream-hero" style={{ 
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", 
        color: "#f1f5f9", 
        padding: "60px 24px 48px",
        borderBottom: "3px solid #00d4aa"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#00d4aa", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px" }}>
            Russell Brunson Dream 100 Strategy
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.15, margin: "0 0 16px", background: "linear-gradient(135deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Where Construction Subcontractors Actually Hang Out
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#cbd5e1", maxWidth: "700px", margin: "0 auto 24px", lineHeight: 1.6 }}>
            VoiceLogPro's curated directory of the 100 most important communities, resources, and influencers 
            in the construction trades. If you're an electrician, plumber, HVAC contractor, roofer, or GC — 
            these are your people.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
            {["Associations", "Reddit Communities", "LinkedIn Groups", "Podcasts", "YouTube", "Publications", "OSHA", "Lien Attorneys"].map(tag => (
              <span key={tag} style={{ 
                background: "rgba(0,212,170,0.15)", 
                color: "#00d4aa", 
                padding: "4px 14px", 
                borderRadius: "20px", 
                fontSize: "0.82rem",
                border: "1px solid rgba(0,212,170,0.3)"
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 20px" }}>

        {/* Section 1: Trade Associations */}
        <Section id="associations" title="🏛️ Construction Trade Associations" subtitle="The official bodies that represent electrical, plumbing, HVAC, roofing, and general contracting professionals.">
          <Grid>
            {associations.map((item, i) => (
              <Card key={i} name={item.name} url={item.url} desc={item.desc} />
            ))}
          </Grid>
        </Section>

        {/* Section 2: Reddit Communities */}
        <Section id="reddit" title="🗣️ Construction Subreddits" subtitle="Where the trades hang out online — advice, memes, code questions, and job site stories.">
          <Grid>
            {redditCommunities.map((item, i) => (
              <Card key={i} name={item.name} url={item.url} desc={`${item.desc} (${item.subs} subscribers)`} />
            ))}
          </Grid>
        </Section>

        {/* Section 3: LinkedIn Groups */}
        <Section id="linkedin" title="💼 LinkedIn Construction Groups" subtitle="Professional networking groups for contractors, subcontractors, and construction leadership.">
          <Grid>
            {linkedinGroups.map((item, i) => (
              <Card key={i} name={item.name} url={item.url} desc={item.desc} />
            ))}
          </Grid>
        </Section>

        {/* Section 4: Construction Podcasts */}
        <Section id="podcasts" title="🎧 Construction Podcasts" subtitle="Podcasts that every contractor should be listening to — business, code, and trade craft.">
          <Grid>
            {podcasts.map((item, i) => (
              <Card key={i} name={item.name} url={item.url} desc={item.desc} />
            ))}
          </Grid>
        </Section>

        {/* Section 5: OSHA Resources */}
        <Section id="osha" title="🦺 OSHA & Compliance Resources" subtitle="Official OSHA recordkeeping and safety resources every contractor needs to know.">
          <Grid>
            {oshaResources.map((item, i) => (
              <Card key={i} name={item.name} url={item.url} desc={item.desc} />
            ))}
          </Grid>
        </Section>

        {/* Section 6: Lien Law Attorneys */}
        <Section id="lien-law" title="⚖️ Lien Law & Mechanics Lien Attorneys" subtitle="Protect your payment rights. Connected resources for Texas, California, Florida, and national lien law compliance.">
          <Grid>
            {lienLawAttorneys.map((item, i) => (
              <Card key={i} name={item.name} url={item.url} desc={item.desc} />
            ))}
          </Grid>
        </Section>

        {/* Section 7: YouTube Channels */}
        <Section id="youtube" title="📺 Construction YouTube Channels" subtitle="The best construction content creators on YouTube — trade education, build projects, and code training.">
          <Grid>
            {youtubeChannels.map((item, i) => (
              <Card key={i} name={item.name} url={item.url} desc={`${item.desc} (${item.subs} subscribers)`} />
            ))}
          </Grid>
        </Section>

        {/* Section 8: Trade Publications */}
        <Section id="publications" title="📰 Trade Publications" subtitle="Industry news, code updates, and market intelligence for construction professionals.">
          <Grid>
            {tradePublications.map((item, i) => (
              <Card key={i} name={item.name} url={item.url} desc={item.desc} />
            ))}
          </Grid>
        </Section>

        {/* COLD TRAFFIC BRIDGE SECTION — Brunson Traffic Secrets Ch 8 */}
        <section id="cold-traffic-bridge" style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "#f1f5f9",
          borderRadius: "16px",
          padding: "40px 32px",
          margin: "48px 0",
          border: "1px solid #334155"
        }}>
          <h2 style={{ fontSize: "1.5rem", margin: "0 0 8px", color: "#00d4aa" }}>
            🚧 Still Typing Reports by Hand?
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "0 0 20px" }}>
            Most construction guys we talk to are spending 30–45 minutes at the end of every shift 
            typing up daily reports on a laptop. Some are still using paper forms. 
            If that sounds like you — you're our people.
          </p>
          <div style={{ display: "grid", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "16px", borderLeft: "3px solid #00d4aa" }}>
              <strong style={{ color: "#00d4aa" }}>The Old Way:</strong>
              <p style={{ color: "#cbd5e1", margin: "4px 0 0", fontSize: "0.92rem" }}>
                Finish work → grab clipboard → find a dry spot → type everything up → email to office. 
                45 minutes you could have spent with your family.
              </p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "16px", borderLeft: "3px solid #f97316" }}>
              <strong style={{ color: "#f97316" }}>The VoiceLogPro Way:</strong>
              <p style={{ color: "#cbd5e1", margin: "4px 0 0", fontSize: "0.92rem" }}>
                Press record → speak naturally while you work → AI creates the formatted PDF. 
                60 seconds. Phone stays in your pocket. Hands stay on the job.
              </p>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <a href="https://voicelogpro.com/crew-plan" style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #00d4aa, #2deec0)",
              color: "#04130e",
              padding: "14px 32px",
              borderRadius: "10px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.95rem",
              boxShadow: "0 8px 24px -10px rgba(0,212,170,0.5)"
            }}>
              Try VoiceLogPro Free →
            </a>
            <p style={{ color: "#6b7178", fontSize: "0.78rem", marginTop: "12px" }}>
              Free trial. No credit card required. Built for the crew.
            </p>
          </div>
        </section>

        {/* CONTENT CALENDAR SECTION */}
        <section id="content-calendar" style={{
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          color: "#f1f5f9",
          borderRadius: "16px",
          padding: "40px 32px",
          margin: "48px 0",
          border: "1px solid #334155"
        }}>
          <h2 style={{ fontSize: "1.5rem", margin: "0 0 8px", color: "#f97316" }}>
            📅 Construction Content Calendar — Q3 2026
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "0 0 20px" }}>
            Every week, we publish new content to help construction subcontractors protect their 
            payment rights, comply with regulations, and save time on paperwork.
          </p>

          <div style={{ overflowX: "auto", marginBottom: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.08)" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#00d4aa", borderBottom: "1px solid #334155" }}>Week</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#00d4aa", borderBottom: "1px solid #334155" }}>Topic</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#00d4aa", borderBottom: "1px solid #334155" }}>Format</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { week: "Jul 20", topic: "How to Defend Against Unfair GC Deductions", format: "How-to Guide" },
                  { week: "Jul 27", topic: "Lien Laws by State: Texas vs California vs Florida", format: "Comparison" },
                  { week: "Aug 3", topic: "Daily Report Templates for Electricians", format: "Template Pack" },
                  { week: "Aug 10", topic: "NSW SOPA Adjudication Walkthrough", format: "Step-by-Step" },
                  { week: "Aug 17", topic: "OSHA Recordkeeping for Small Subcontractors", format: "Checklist" },
                  { week: "Aug 24", topic: "Golden Thread Compliance for UK Subs", format: "Guide" },
                  { week: "Aug 31", topic: "Constructive Acceleration Claims Made Simple", format: "How-to Guide" },
                  { week: "Sep 7", topic: "Voice vs Typed Reports: Side-by-Side Comparison", format: "Case Study" },
                  { week: "Sep 14", topic: "Monthly Progress Documentation for Chapter 53", format: "Template" },
                  { week: "Sep 21", topic: "Phase Payment Disputes: What to Document", format: "Checklist" },
                  { week: "Sep 28", topic: "Construction Delay Documentation Best Practices", format: "Guide" },
                  { week: "Oct 5", topic: "End-of-Quarter Compliance Review", format: "Checklist" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "8px 12px", color: "#f97316", fontWeight: 600 }}>{row.week}</td>
                    <td style={{ padding: "8px 12px", color: "#e2e8f0" }}>{row.topic}</td>
                    <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{row.format}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: "#6b7178", fontSize: "0.82rem", textAlign: "center", margin: 0 }}>
            Subscribe to our newsletter to get each piece delivered to your inbox. 
            No spam — just actionable construction documentation advice.
          </p>
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center", padding: "40px 0 20px" }}>
          <h2 style={{ fontSize: "1.5rem", margin: "0 0 12px", color: "#f1f5f9" }}>
            Join the Crew
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto 24px" }}>
            VoiceLogPro is built for the trades, by the trades. Stop typing reports. 
            Get back to the work that actually pays.
          </p>
          <a href="https://voicelogpro.com/crew-plan" style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #00d4aa, #2deec0)",
            color: "#04130e",
            padding: "14px 32px",
            borderRadius: "10px",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: "1rem",
            boxShadow: "0 8px 24px -10px rgba(0,212,170,0.5)"
          }}>
            Get Started Free →
          </a>
        </section>

      </div>

      <Footer />
    </>
  );
}

/* Reusable components */
function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: "40px" }}>
      <h2 style={{ fontSize: "1.5rem", margin: "0 0 4px", color: "#f1f5f9" }}>{title}</h2>
      <p style={{ color: "#94a3b8", fontSize: "0.92rem", margin: "0 0 20px" }}>{subtitle}</p>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
      {children}
    </div>
  );
}

function Card({ name, url, desc }: { name: string; url: string; desc: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      display: "block",
      background: "#1e293b",
      border: "1px solid #334155",
      borderRadius: "10px",
      padding: "16px",
      textDecoration: "none",
      color: "inherit",
      transition: "border-color 0.2s, transform 0.15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00d4aa"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.transform = "none"; }}
    >
      <h3 style={{ fontSize: "0.95rem", margin: "0 0 6px", color: "#00d4aa" }}>{name}</h3>
      <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{desc}</p>
    </a>
  );
}
