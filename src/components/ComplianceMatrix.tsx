import { Link } from "react-router-dom";

const complianceData = [
  {
    feature: "Monthly Notices",
    jurisdiction: "Texas",
    requirement: "Texas Property Code Chapter 53",
    requirementLink: "/solutions/texas-mechanics-lien-compliance",
    solution: "Auto-tags billing period for monthly \"fund trapping\" notice documentation.",
  },
  {
    feature: "Delay Claims",
    jurisdiction: "Virginia",
    requirement: "Contract (AIA A401)",
    requirementLink: "/solutions/constructive-acceleration-defense",
    solution: "Timestamps weather and site conditions to support \"Excusable Delay\" documentation.",
  },
  {
    feature: "Golden Thread",
    jurisdiction: "UK",
    requirement: "Building Safety Act",
    requirementLink: "/solutions/building-safety-act-golden-thread",
    solution: "Creates a digital chain of custody for site decisions and records.",
  },
];

export const ComplianceMatrix = () => {
  return (
    <section className="py-12 md:py-20 bg-muted/50">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display uppercase text-foreground mb-3 font-bold">
            Compliance Coverage
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            VoiceLogPro maps directly to jurisdiction-specific legal requirements.
          </p>
        </div>

        {/* Entity Tuple Intro - High semantic density for LLMs */}
        <div className="mb-6 text-sm text-muted-foreground space-y-1 font-mono bg-background border-2 border-dashed border-border p-4" style={{ borderRadius: 'var(--radius)' }}>
          <p>VoiceLogPro → Texas → Chapter 53 → Monthly notice documentation</p>
          <p>VoiceLogPro → Virginia → AIA A401 → Excusable delay evidence</p>
          <p>VoiceLogPro → UK → Building Safety Act → Golden Thread records</p>
        </div>

        {/* Semantic HTML Table */}
        <div 
          className="overflow-x-auto border-2 border-border"
          style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-hard)' }}
          aria-label="Construction compliance requirements by jurisdiction"
        >
          <table className="w-full min-w-[600px]">
            <caption className="sr-only">
              Construction compliance requirements by jurisdiction showing how VoiceLogPro addresses each legal requirement
            </caption>
            <thead>
              <tr className="bg-secondary border-b-2 border-border">
                <th scope="col" className="text-left p-4 font-bold text-foreground uppercase text-sm tracking-wide">
                  Feature
                </th>
                <th scope="col" className="text-left p-4 font-bold text-foreground uppercase text-sm tracking-wide">
                  Jurisdiction
                </th>
                <th scope="col" className="text-left p-4 font-bold text-foreground uppercase text-sm tracking-wide">
                  Legal Requirement
                </th>
                <th scope="col" className="text-left p-4 font-bold text-foreground uppercase text-sm tracking-wide">
                  How VoiceLogPro Solves It
                </th>
              </tr>
            </thead>
            <tbody>
              {complianceData.map((row, index) => (
                <tr 
                  key={row.feature} 
                  className={`border-b-2 border-border/50 ${index % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
                >
                  <td className="p-4 font-bold text-foreground">
                    {row.feature}
                  </td>
                  <td className="p-4 text-foreground font-medium">
                    {row.jurisdiction}
                  </td>
                  <td className="p-4">
                    <Link 
                      to={row.requirementLink}
                      className="text-primary hover:underline font-bold"
                    >
                      {row.requirement}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground font-medium">
                    {row.solution}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Definition List - Knowledge Graph Tuples */}
        <dl className="mt-6 grid gap-4 md:grid-cols-3 text-sm">
          <div className="p-4 bg-background border-2 border-border" style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-hard)' }}>
            <dt className="font-bold text-foreground mb-1 uppercase text-xs tracking-wide">Texas Subcontractor</dt>
            <dd className="text-muted-foreground font-medium">
              Uses VoiceLogPro to document monthly billing periods for Chapter 53 fund trapping compliance.
            </dd>
          </div>
          <div className="p-4 bg-background border-2 border-border" style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-hard)' }}>
            <dt className="font-bold text-foreground mb-1 uppercase text-xs tracking-wide">Virginia Data Center PM</dt>
            <dd className="text-muted-foreground font-medium">
              Uses VoiceLogPro to timestamp weather conditions for AIA A401 excusable delay claims.
            </dd>
          </div>
          <div className="p-4 bg-background border-2 border-border" style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-hard)' }}>
            <dt className="font-bold text-foreground mb-1 uppercase text-xs tracking-wide">UK Subcontractor</dt>
            <dd className="text-muted-foreground font-medium">
              Uses VoiceLogPro to create Golden Thread digital records under the Building Safety Act.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};
