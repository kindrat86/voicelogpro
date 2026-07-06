/**
 * Comparison data for programmatic SEO competitor pages.
 * Each entry generates a full comparison landing page.
 */
export interface CompetitorEntry {
  slug: string;
  name: string;
  website: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  builtFor: string;
  primaryGoal: string;
  dataOwnership: string;
  pricing: string;
  inputMethod: string;
  legalFocus: string;
  bestFor: string;
  weaknesses: string[];
  vlpStrengths: string[];
  faqs: { question: string; answer: string }[];
}

export const competitors: CompetitorEntry[] = [
  {
    slug: "procore",
    name: "Procore",
    website: "procore.com",
    metaTitle: "Procore vs Voice Log Pro | Smarter Daily Reports for Subs",
    metaDescription: "Procore is enterprise construction management. Voice Log Pro is voice-first daily reporting built for subcontractors who need court-ready documentation, not project oversight.",
    h1: "Procore vs. Voice Log Pro: Enterprise Overkill Meets Subcontractor Defense",
    intro: "Procore is the 800-pound gorilla of construction management software. It handles everything from bidding to closeout — but it was built for General Contractors managing massive portfolios. Subcontractors using Procore are paying for features they don't need and missing the one thing they do: payment protection.",
    builtFor: "Enterprise General Contractors & Owners",
    primaryGoal: "Manage entire project lifecycle from bid to closeout",
    dataOwnership: "GC or Owner (you're a line item)",
    pricing: "Custom per-enterprise (typically $400+/month per user)",
    inputMethod: "Typing, forms, mobile app with photo capture",
    legalFocus: "General project record — not lien or payment defense optimized",
    bestFor: "Large GCs managing $50M+ projects with dedicated admin staff",
    weaknesses: [
      "Designed for desktop-first workflows, not field use with gloves on",
      "No voice-to-report capability — every entry requires typing",
      "Data belongs to the GC, not the subcontractor who created it",
      "Pricing is prohibitive for small and mid-sized subcontractors",
      "No automated lien right protection or delay documentation features",
      "Over 50 modules you'll never use, each adding complexity and cost",
    ],
    vlpStrengths: [
      "Voice-first input designed for crews with tools in hand",
      "You own your data — reports don't flow upward to the GC",
      "Court-ready PDFs with timestamps, weather, and photos",
      "Flat $49/month pricing — no surprise enterprise fees",
      "Built for legal defense: lien rights, delay claims, payment disputes",
      "Works fully offline in basements, mechanical rooms, and remote sites",
    ],
    faqs: [
      {
        question: "Can subcontractors use Procore for daily reporting?",
        answer: "Yes, but Procore was designed for General Contractors. Subcontractors using Procore create data that flows upward to the GC and rarely helps them in payment disputes. Voice Log Pro is built specifically for subcontractors — you own your data and it's optimized for legal defense, not project oversight.",
      },
      {
        question: "Is Procore worth it for small subcontractors?",
        answer: "Usually not. Procore's enterprise pricing ($400+/month per user) and complexity are designed for large GCs. Most small subcontractors need payment protection and lien documentation, not project management modules. Voice Log Pro delivers legal-grade documentation at $49/month with zero training required.",
      },
      {
        question: "Does Procore help with mechanics lien rights?",
        answer: "Procore provides general document storage but isn't optimized for lien rights preservation. Voice Log Pro is engineered to support Texas Property Code Chapter 53, monthly trapping notices, and contemporaneous evidence for lien claims — features built into the core product, not bolted on.",
      },
      {
        question: "What's the biggest difference between Procore and Voice Log Pro?",
        answer: "Procore manages projects. Voice Log Pro protects payment. Procore is top-down management software for GCs. Voice Log Pro is bottom-up defense software for subcontractors. They solve different problems for different users.",
      },
    ],
  },
  {
    slug: "buildertrend",
    name: "Buildertrend",
    website: "buildertrend.com",
    metaTitle: "Buildertrend vs Voice Log Pro | Field Reporting for Subs",
    metaDescription: "Buildertrend is built for residential builders. Voice Log Pro is built for trade subcontractors who need payment protection and court-ready documentation — not another project dashboard.",
    h1: "Buildertrend vs. Voice Log Pro: Residential Builder Tool Meets Trade Defense",
    intro: "Buildertrend is popular with residential builders for scheduling, change orders, and client communication. But it's designed for the builder — the person running the project — not the subcontractors doing the work. If you're a trade contractor using Buildertrend at a GC's request, your documentation is working for them, not you.",
    builtFor: "Residential Builders & Remodelers",
    primaryGoal: "Streamline client communication and project scheduling",
    dataOwnership: "Builder/GC owns the data",
    pricing: "$499+/month (Starts at $499 for 3 users)",
    inputMethod: "Typing, forms, mobile app",
    legalFocus: "Client communication records, not legal defense",
    bestFor: "Small-to-mid-size residential builders managing 5-20 projects",
    weaknesses: [
      "Residential-focused — lacks commercial construction legal features",
      "No voice-to-report capability for field use",
      "High starting price ($499/month) for basic reporting needs",
      "Data belongs to the builder, not the trade subcontractor",
      "No special optimization for lien rights or payment disputes",
      "Requires training and daily manual data entry",
    ],
    vlpStrengths: [
      "Voice-first: 30-second recording becomes a PDF report",
      "Built for trade subcontractors — not GCs or builders",
      "$49/month flat pricing — no per-user fees",
      "You own your data and your legal documentation",
      "Court-ready PDFs with automatic timestamps and weather data",
      "Works offline in any job site condition",
    ],
    faqs: [
      {
        question: "Can trade subcontractors use Buildertrend?",
        answer: "Technically yes, but it's designed for the builder/GC. Trade subcontractors using Buildertrend at a GC's request are creating documentation the GC owns. If a payment dispute arises, you don't control the evidence. Voice Log Pro puts documentation in your hands with legal-grade formatting.",
      },
      {
        question: "Is Buildertrend good for lien rights protection?",
        answer: "Buildertrend is project management software, not legal defense software. It stores documents but doesn't generate the specific contemporaneous records needed for mechanics lien claims. Voice Log Pro automatically creates timestamped, weather-tagged daily logs that support lien rights preservation and payment disputes.",
      },
      {
        question: "Which is cheaper — Buildertrend or Voice Log Pro?",
        answer: "Voice Log Pro is significantly cheaper at $49/month flat. Buildertrend starts at $499/month for 3 users and scales up from there. For a small subcontractor crew, Voice Log Pro delivers specialized legal documentation at a fraction of the cost.",
      },
      {
        question: "Does Buildertrend work offline?",
        answer: "Buildertrend has some offline capability but requires periodic syncing. Voice Log Pro is fully functional offline — record notes, attach photos, and generate reports even in basements or remote sites with zero connectivity. Reports sync automatically when you're back online.",
      },
    ],
  },
  {
    slug: "contractor-foreman",
    name: "Contractor Foreman",
    website: "contractorforeman.com",
    metaTitle: "Contractor Foreman vs Voice Log Pro | Daily Report Showdown",
    metaDescription: "Contractor Foreman is a general construction management tool. Voice Log Pro is a specialized legal defense engine for subcontractors. Compare features, pricing, and legal value.",
    h1: "Contractor Foreman vs. Voice Log Pro: General Tool vs. Legal Defense Engine",
    intro: "Contractor Foreman offers a broad set of construction management features at a competitive price. But broad doesn't mean deep. For subcontractors who need ironclad daily documentation, a general tool misses the mark where it matters most: legal defense, lien support, and payment protection.",
    builtFor: "General Contractors & Construction Businesses",
    primaryGoal: "Centralize project management, scheduling, and financials",
    dataOwnership: "The contractor who pays for the account",
    pricing: "$83/month (Starter) to $167/month (Pro)",
    inputMethod: "Desktop forms, mobile app with checklists",
    legalFocus: "Administrative records, not payment-defense optimized",
    bestFor: "Small contractors who want an all-in-one business management tool",
    weaknesses: [
      "Generalist tool — does many things but none at legal-grade depth",
      "No voice-to-report capability",
      "No specialized lien right protection workflows",
      "Daily reports lack the timestamped, weather-tagged format courts expect",
      "Designed for the office, not the field with tools in hand",
      "Setup and customization required to make it useful for subs",
    ],
    vlpStrengths: [
      "Specialized for one thing: legal-grade daily documentation",
      "Voice-first input — speak your report in 30 seconds",
      "Automated timestamps, geolocation, and historical weather data",
      "Collateral lien-right-protection workflows (Texas, UK, NSW SOPA)",
      "$49/month flat — one tool, one price, full functionality",
      "Works offline in any condition",
    ],
    faqs: [
      {
        question: "Is Contractor Foreman good for daily reports?",
        answer: "Contractor Foreman includes daily log functionality as part of its suite, but it's generalized project management — not specialized legal documentation. The reports lack the forensic-grade metadata (timestamps, weather, geolocation) that makes Voice Log Pro reports court-ready.",
      },
      {
        question: "Does Contractor Foreman help with lien rights?",
        answer: "Not specifically. Contractor Foreman manages projects and documents but doesn't have workflows designed for mechanics lien preservation. Voice Log Pro is engineered around legal frameworks like Texas Property Code Chapter 53 and NSW SOPA requirements.",
      },
      {
        question: "What's the price difference?",
        answer: "Contractor Foreman starts at $83/month. Voice Log Pro is $49/month flat with no per-user fees. For a crew of 5-10 subcontractors, Voice Log Pro delivers specialized legal documentation at about 40% less cost.",
      },
    ],
  },
  {
    slug: "jobnimbus",
    name: "JobNimbus",
    website: "jobnimbus.com",
    metaTitle: "JobNimbus vs Voice Log Pro | CRM Meets Legal Defense",
    metaDescription: "JobNimbus is a CRM for roofing and construction. Voice Log Pro is a legal defense engine for subcontractors. See why payment protection needs a specialized tool.",
    h1: "JobNimbus vs. Voice Log Pro: CRM Workflow Meets Payment Protection",
    intro: "JobNimbus is a popular CRM and project management tool for roofing, solar, and construction companies. It excels at lead tracking, estimates, and customer communications. But CRM is not legal defense. JobNimbus manages your customer relationships — it doesn't protect your payment rights when disputes arise.",
    builtFor: "Roofing, Solar & Construction Companies (CRM-first)",
    primaryGoal: "Manage leads, estimates, and customer relationships",
    dataOwnership: "Company that holds the account",
    pricing: "$45-$99/month per user (Team plan)",
    inputMethod: "Web forms, mobile forms, checklists",
    legalFocus: "Estimates and invoices, not litigation-ready documentation",
    bestFor: "Roofing and solar companies focused on sales pipeline management",
    weaknesses: [
      "CRM-first design means daily documentation is an afterthought",
      "No voice-to-report capability for field crews",
      "Per-user pricing penalizes subcontractor crews",
      "No specialized legal framework support for lien or delay claims",
      "Reports are customer-facing, not court-facing",
      "No automated weather tagging for excusable delay evidence",
    ],
    vlpStrengths: [
      "Built for legal defense, not CRM — one focused purpose",
      "Voice-first daily reports optimized for evidential weight",
      "$49/month flat — covers your entire crew",
      "Automatic timestamps, weather data, and geolocation on every report",
      "Designed for trades: electrical, plumbing, HVAC subcontractors",
      "Works fully offline in any job site environment",
    ],
    faqs: [
      {
        question: "Can I use JobNimbus for daily construction reports?",
        answer: "JobNimbus offers job logs and notes, but they're designed as CRM activity records — not as legally defensible daily construction reports. The format, metadata, and structure don't meet the evidentiary standards needed for lien claims or payment disputes.",
      },
      {
        question: "Does JobNimbus help with payment disputes?",
        answer: "Not specifically. JobNimbus stores estimates and invoices, which show what you agreed to charge. Voice Log Pro creates contemporaneous evidence of what you actually did on site — which is what courts and adjudicators rely on in payment disputes.",
      },
      {
        question: "Which is better for subcontractors?",
        answer: "If you need CRM for sales and lead tracking, JobNimbus is fine for that. If you need payment protection, legal documentation, and lien right preservation, Voice Log Pro is purpose-built for it. Many subcontractors use both — JobNimbus for sales, Voice Log Pro for site documentation.",
      },
    ],
  },
  {
    slug: "knowify",
    name: "Knowify",
    website: "knowify.com",
    metaTitle: "Knowify vs Voice Log Pro | Field Documentation for Trades",
    metaDescription: "Knowify is trade contractor software for job costing and invoicing. Voice Log Pro is daily documentation defense. See why your evidence matters more than your budget.",
    h1: "Knowify vs. Voice Log Pro: Back Office Meets Field Evidence",
    intro: "Knowify is a solid back-office tool for trade contractors — job costing, change orders, invoicing, and scheduling. It handles what happens AFTER the work is done. But it doesn't handle what happens DURING the work: the real-time documentation that protects you when a payment dispute arises.",
    builtFor: "Trade Contractors (job costing & invoicing focus)",
    primaryGoal: "Manage job costs, invoicing, and financial operations",
    dataOwnership: "The contractor account holder",
    pricing: "$59-$179/month (per user pricing)",
    inputMethod: "Desktop forms, mobile time tracking",
    legalFocus: "Financial records, not forensic site documentation",
    bestFor: "Trade contractors who need robust job costing and financial tools",
    weaknesses: [
      "Back-office focused — no field-first daily documentation",
      "No voice input capability — reports require typing",
      "Financial data doesn't equal legal evidence",
      "No automated weather data or timestamped site diaries",
      "Per-user pricing adds up for crews",
      "No support for jurisdiction-specific lien frameworks",
    ],
    vlpStrengths: [
      "Field-first design — capture evidence while you work",
      "30-second voice recording generates a court-ready PDF",
      "$49/month flat for your entire crew",
      "Automatic weather, time, and location metadata on every report",
      "Built for legal frameworks: Texas, Virginia, UK, NSW SOPA",
      "Works offline — capture evidence anywhere",
    ],
    faqs: [
      {
        question: "Does Knowify generate daily construction reports?",
        answer: "Knowify focuses on financial tracking (job costing, invoicing, change orders) rather than daily field reports. It tracks what work cost — not what work happened on site each day. Voice Log Pro fills that gap with voice-generated, court-ready daily logs.",
      },
      {
        question: "Can Knowify help with lien rights?",
        answer: "Knowify's financial records (invoices, change orders) support lien claims indirectly, but you need contemporaneous daily documentation to prove labor and materials were furnished. That's what Voice Log Pro provides — timestamped, weather-tagged daily reports that directly support lien filings.",
      },
      {
        question: "Which one do subcontractors need more?",
        answer: "Both serve different needs. Knowify handles your back office — budgeting and billing. Voice Log Pro handles your legal defense — daily evidence and payment protection. If you can only afford one, Voice Log Pro protects you from not getting paid at all. If you can afford both, they complement each other perfectly.",
      },
    ],
  },
];
