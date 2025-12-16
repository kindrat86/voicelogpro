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
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display uppercase text-foreground mb-4">
            Compliance Coverage
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Voice Log Pro maps directly to jurisdiction-specific legal requirements.
          </p>
        </div>

        {/* Entity Tuple Intro - High semantic density for LLMs */}
        <div className="mb-8 text-sm text-muted-foreground space-y-1 font-mono bg-background/50 p-4 rounded border border-border/50">
          <p>Voice Log Pro → Texas → Chapter 53 → Monthly notice documentation</p>
          <p>Voice Log Pro → Virginia → AIA A401 → Excusable delay evidence</p>
          <p>Voice Log Pro → UK → Building Safety Act → Golden Thread records</p>
        </div>

        {/* Semantic HTML Table */}
        <div 
          className="overflow-x-auto rounded-lg border border-border"
          aria-label="Construction compliance requirements by jurisdiction"
        >
          <table className="w-full min-w-[600px]">
            <caption className="sr-only">
              Construction compliance requirements by jurisdiction showing how Voice Log Pro addresses each legal requirement
            </caption>
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th scope="col" className="text-left p-4 font-semibold text-foreground">
                  Feature
                </th>
                <th scope="col" className="text-left p-4 font-semibold text-foreground">
                  Jurisdiction
                </th>
                <th scope="col" className="text-left p-4 font-semibold text-foreground">
                  Legal Requirement
                </th>
                <th scope="col" className="text-left p-4 font-semibold text-foreground">
                  How Voice Log Pro Solves It
                </th>
              </tr>
            </thead>
            <tbody>
              {complianceData.map((row, index) => (
                <tr 
                  key={row.feature} 
                  className={`border-b border-border/50 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                >
                  <td className="p-4 font-medium text-foreground">
                    {row.feature}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {row.jurisdiction}
                  </td>
                  <td className="p-4">
                    <Link 
                      to={row.requirementLink}
                      className="text-primary hover:underline"
                    >
                      {row.requirement}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {row.solution}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Definition List - Knowledge Graph Tuples */}
        <dl className="mt-8 grid gap-4 md:grid-cols-3 text-sm">
          <div className="p-4 bg-background rounded border border-border/50">
            <dt className="font-semibold text-foreground mb-1">Texas Subcontractor</dt>
            <dd className="text-muted-foreground">
              Uses Voice Log Pro to document monthly billing periods for Chapter 53 fund trapping compliance.
            </dd>
          </div>
          <div className="p-4 bg-background rounded border border-border/50">
            <dt className="font-semibold text-foreground mb-1">Virginia Data Center PM</dt>
            <dd className="text-muted-foreground">
              Uses Voice Log Pro to timestamp weather conditions for AIA A401 excusable delay claims.
            </dd>
          </div>
          <div className="p-4 bg-background rounded border border-border/50">
            <dt className="font-semibold text-foreground mb-1">UK Subcontractor</dt>
            <dd className="text-muted-foreground">
              Uses Voice Log Pro to create Golden Thread digital records under the Building Safety Act.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};
