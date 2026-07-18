/**
 * How-to guides for pSEO.
 * These target "how to X" search intents — the highest-volume content prefix on Google.
 * Each entry includes a step-by-step process for HowTo schema.
 */
export interface HowToEntry {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  steps: { task: string; outcome: string }[];
  totalTime: string;
  keyPoints: string[];
  faqs: { question: string; answer: string }[];
  /** ISO date (YYYY-MM-DD) of the last meaningful content review. Drives the
   *  visible "Last reviewed" line and schema dateModified for freshness. */
  lastReviewed?: string;
}

export const howToGuides: HowToEntry[] = [
  {
    slug: "document-construction-delays",
    metaTitle: "How to Document Construction Delays for Payment Claims | VoiceLogPro",
    metaDescription: "Learn how to document construction delays properly for payment claims and dispute resolution. Step-by-step guide with voice recording, timestamps, and weather data.",
    h1: "How to Document Construction Delays for Payment Claims",
    intro: "To document a construction delay so it survives a payment dispute, capture contemporaneous evidence the moment the delay happens: a timestamped voice note describing the cause and impact, automatic weather data, and geotagged photos — not a summary written at end of day. Records created at the time of the event carry far more evidentiary weight than reconstructed notes. Construction delays cost subcontractors billions in unpaid claims every year; this guide walks through the exact steps to protect yours.",
    totalTime: "PT10M",
    lastReviewed: "2026-07-18",
    steps: [
      {
        task: "Record site conditions immediately when the delay occurs",
        outcome: "Don't wait until end of day or end of week. Pull out your phone and record a 30-second voice note describing what's happening, why it's a delay, who is involved, and what work is being affected. Contemporaneous records carry maximum evidentiary weight.",
      },
      {
        task: "Capture weather conditions automatically",
        outcome: "Weather is one of the most common excusable delay factors. Use VoiceLogPro's automatic weather tagging to record temperature, precipitation, and wind conditions at the time of recording. This creates objective evidence that conditions were outside normal working parameters.",
      },
      {
        task: "Document the impact on your schedule",
        outcome: "Describe how the delay affects your specific scope of work. Be specific: 'Cannot install conduit on floor 3 because drywall hasn't been completed' is better than 'work delayed.' Include the number of crew members affected and the estimated time impact.",
      },
      {
        task: "Include photo evidence with timestamps",
        outcome: "Take photos showing the site conditions causing the delay. VoiceLogPro embeds photos with geolocation and timestamps directly into the daily report, creating a visual and data-rich record that leaves no room for dispute.",
      },
      {
        task: "Reference RFI or change order numbers",
        outcome: "If the delay relates to a design clarification (RFI) or change order, reference the tracking number in your voice note. This cross-references your daily log with the formal project documentation, creating a complete evidence chain.",
      },
      {
        task: "Generate and distribute the daily report",
        outcome: "At the end of the day, VoiceLogPro converts your voice notes into a court-ready PDF with all timestamps, weather data, and photos embedded. Send a copy to your project manager and save a copy for your records. This becomes your contemporaneous evidence package.",
      },
    ],
    keyPoints: [
      "Contemporaneous records (created at the time of delay) carry more weight than after-the-fact summaries",
      "Weather data turns subjective claims ('it was raining hard') into objective evidence ('1.2 inches of precipitation recorded')",
      "Specific impact descriptions ('3 electricians idle for 4 hours') are more valuable than general statements",
      "Photo evidence with embedded timestamps eliminates 'when was this photo taken' disputes",
      "Cross-referencing RFI numbers creates an auditable chain of causation",
      "Daily PDF reports with all metadata embedded are court-ready evidence packages",
    ],
    faqs: [
      {
        question: "What qualifies as an excusable delay in construction?",
        answer: "Excusable delays are events outside the subcontractor's control: severe weather, acts of God, owner-caused changes, design errors, delayed approvals, material shortages not caused by the subcontractor, and other force majeure events. Inexcusable delays are within your control: poor scheduling, labor shortages, or equipment failures you could have prevented.",
      },
      {
        question: "How soon after a delay should I document it?",
        answer: "Immediately. Contemporaneous documentation — records created at the time of the event — carries significantly more evidentiary weight in disputes and adjudications than notes written hours or days later. VoiceLogPro makes instant documentation easy with voice recording.",
      },
      {
        question: "Can voice notes really be used as evidence?",
        answer: "Yes. VoiceLogPro converts voice notes into timestamped, transcribed PDF reports that serve as contemporaneous business records. Courts and adjudicators (including SOPA adjudicators in NSW) consistently prioritize contemporaneous records over later witness statements or reconstructed timelines.",
      },
      {
        question: "What should I include in a delay documentation entry?",
        answer: "Include: the date and time, weather conditions, the specific cause of delay (with details), which crew members are affected and how many, what work was planned vs what was actually done, any RFI or change order numbers, and photos of the condition causing the delay.",
      },
    ],
  },
  {
    slug: "protect-lien-rights-as-subcontractor",
    metaTitle: "How to Protect Your Lien Rights as a Subcontractor | VoiceLogPro",
    metaDescription: "Complete guide to protecting mechanics lien rights. Learn monthly trapping notices, contemporaneous documentation, and how daily reports preserve your lien claims.",
    h1: "How to Protect Your Lien Rights as a Subcontractor",
    intro: "To protect your mechanics-lien rights as a subcontractor, do two things from day one: record the exact date you first furnished labor or materials, and keep a daily, timestamped log of everything you install. Lien claims are lost on missed statutory deadlines and thin paperwork — not on unfinished work. Mechanics liens are the most powerful tool subcontractors have to get paid; here's how to keep yours enforceable from day one.",
    totalTime: "PT15M",
    lastReviewed: "2026-07-18",
    steps: [
      {
        task: "Check your state's lien laws before starting work",
        outcome: "Every state has different notice deadlines, filing periods, and documentation requirements. In Texas, a subcontractor's fund-trapping notice is due by the 15th day of the third month following each month of unpaid labor or materials — HB 2237 (effective January 1, 2022) eliminated the older second-month notice and consolidated it into this single third-month notice. California has preliminary notice requirements within 20 days of first furnishing labor. Know your state's current rules before you break ground.",
      },
      {
        task: "Create a daily log the first day you start work",
        outcome: "Don't wait until there's a problem. Start documenting on day one. Record the date you first furnished labor or materials — this establishes the timeline for all subsequent notice periods. VoiceLogPro automatically timestamps every entry for a complete audit trail.",
      },
      {
        task: "Document labor and materials furnished every day",
        outcome: "Lien claims require proof that labor or materials were furnished on specific dates. VoiceLogPro creates a daily report for each day you work, documenting crew size, hours worked, materials installed, and equipment used. This creates an irrefutable record of your contribution to the project.",
      },
      {
        task: "Track billing periods for monthly notice requirements",
        outcome: "In Texas, you must serve the fund-trapping notice by the 15th day of the third month following each month in which you provided unpaid labor or materials (Texas Property Code Section 53.056, as amended by HB 2237 in 2022). VoiceLogPro tags each report with the billing month, making it easy to identify when notices are due and preventing missed deadlines.",
      },
      {
        task: "Serve preliminary and monthly notices on time",
        outcome: "Many states require preliminary notices (within 20-45 days of starting) and monthly notices to preserve lien rights. Use your daily log data to support these notices with specific dates, amounts, and descriptions of work performed.",
      },
      {
        task: "Generate and save court-ready PDF reports",
        outcome: "VoiceLogPro generates PDF reports with timestamps, weather data, geolocation, and photo attachments — all the metadata that makes a contemporaneous record court-ready. Store these reports for each month of work. If a payment dispute arises, you have complete, verifiable evidence of every day you worked.",
      },
    ],
    keyPoints: [
      "Lien rights are statutory — you must follow your state's specific rules or lose them",
      "Daily logs are the foundation of any lien claim: they prove labor and materials were furnished",
      "Monthly notice deadlines are strict — missed by one day can mean lost rights",
      "Contemporaneous records (created on the day of work) are far more valuable than after-the-fact spreadsheets",
      "Photo evidence with timestamps proves site presence and work completion",
      "A subscription to VoiceLogPro costs $49/month — losing a lien claim costs thousands",
    ],
    faqs: [
      {
        question: "How long do I have to file a mechanics lien?",
        answer: "It varies by state. Texas: generally within 4 months of completing work. California: 90 days from completion for private projects. Florida: 90 days from final furnishing of labor or materials. You must also serve notices before filing in most states. Check your specific state's property code for exact deadlines.",
      },
      {
        question: "What documentation do I need to file a lien?",
        answer: "You need: proof that labor or materials were furnished (daily logs, delivery receipts, photos), dates of work, the contract or purchase order amount, the amount unpaid, a description of work performed, and the property owner's name and address. Contemporaneous daily reports like those from VoiceLogPro serve as primary evidence.",
      },
      {
        question: "Can I lose my lien rights even if I did the work?",
        answer: "Yes, absolutely. Lien rights are statutory privileges, not automatic rights. You can lose them by: failing to serve a preliminary notice, missing a monthly notice deadline, filing after the statutory deadline, or failing to properly document your labor and materials. Good documentation is your safety net.",
      },
      {
        question: "Does VoiceLogPro automatically file liens?",
        answer: "No, VoiceLogPro is a documentation tool, not a legal filing service. We generate the court-ready evidence and compliance records you need to support a lien claim. You should consult with a construction attorney for actual lien filings and legal strategy. We provide the proof — they provide the legal representation.",
      },
    ],
  },
  {
    slug: "document-construction-change-orders",
    metaTitle: "How to Document Construction Change Orders for Payment | VoiceLogPro",
    metaDescription: "Learn how to document construction change orders properly. Voice-first daily reports that capture extra work, materials, and time for seamless change order approval.",
    h1: "How to Document Construction Change Orders for Payment",
    intro: "Unpaid change orders are the #1 source of profit erosion for subcontractors. The problem isn't usually that the work wasn't authorized — it's that the documentation wasn't sufficient to prove the extra work was done. Here's a documentation system that protects every dollar of change order work.",
    totalTime: "PT8M",
    steps: [
      {
        task: "Record verbal approvals immediately",
        outcome: "When a GC or owner asks for extra work verbally, record a voice note immediately describing what was requested, who requested it, and the scope of additional work. Verbal approvals are common but easily disputed later. A contemporaneous voice note creates a timestamped record of the request.",
      },
      {
        task: "Document before-and-after site conditions",
        outcome: "Take photos before you start the additional work and after completion. This visual evidence proves the scope change and the work performed. VoiceLogPro embeds photos with timestamps and geolocation directly into the daily report.",
      },
      {
        task: "Track additional materials and labor separately",
        outcome: "Record voice notes specifying the exact materials used for the change order (quantities, specifications) and the labor hours spent. This supports your change order pricing and prevents 'we didn't use that much material' disputes.",
      },
      {
        task: "Reference the change order number in every related entry",
        outcome: "If the change order has been issued a number, reference it in every related voice note. If not yet numbered, use a descriptive label like 'CO-pending-bathroom-fan-7-6.' This cross-references your daily logs with the formal change order process.",
      },
      {
        task: "Generate a consolidated change order report",
        outcome: "VoiceLogPro can compile all entries related to a specific change order into a single report. This gives you a complete, timestamped evidence package: the original request, the materials used, the labor hours, the before/after photos, and the site conditions during the work.",
      },
    ],
    keyPoints: [
      "Verbal change orders are enforceable in most states but only if you can prove the work was done",
      "Voice documentation at the time of the request eliminates 'I never asked for that' disputes",
      "Before-and-after photos with embedded timestamps are irrefutable proof of scope changes",
      "Separate material and labor tracking supports accurate change order pricing",
      "Cross-referencing change order numbers creates an auditable chain of authorization",
      "Daily reports covering change order work are admissible as business records in court",
    ],
    faqs: [
      {
        question: "Are verbal change orders legally binding?",
        answer: "In most states, verbal change orders can be binding if you can prove: (1) the request was made, (2) the work was performed, and (3) the other party accepted the work. Contemporaneous documentation — a voice note recorded at the time of the request — is your strongest evidence. However, written change orders are always preferable, and some contracts explicitly require written authorization.",
      },
      {
        question: "What if the GC denies authorizing extra work?",
        answer: "This is exactly why contemporaneous documentation matters. A timestamped voice note recorded at the time of the verbal request, combined with photos of the work performed, creates a credible evidence trail. In payment disputes, these records carry more weight than either party's after-the-fact recollection.",
      },
      {
        question: "How do I track change order materials separately?",
        answer: "VoiceLogPro lets you tag entries by category. Create a 'change order' tag and use it for any entry related to extra work. This automatically groups all related voice notes, photos, and materials into a change order package. At billing time, you have a complete, organized evidence file.",
      },
    ],
  },
  {
    slug: "defend-unfair-gc-deductions",
    metaTitle: "How to Defend Against Unfair GC Deductions | VoiceLogPro",
    metaDescription: "Learn how to defend against unfair GC deductions and backcharges. Document completed work with timestamped daily reports and protect your payment from disputed deductions.",
    h1: "How to Defend Against Unfair GC Deductions and Backcharges",
    intro: "Backcharges and deductions are one of the most common ways subcontractors lose money. A GC claims work was defective, incomplete, or late — and deducts from your payment. Often, these deductions are based on incomplete information or shifted blame. The only effective defense is proof — and that means documentation created before the dispute arises.",
    totalTime: "PT10M",
    steps: [
      {
        task: "Document completed work on the day it's finished",
        outcome: "Don't wait for punch lists. Record a voice note on the day you complete a scope of work, describing what was finished, that it meets specifications, and any relevant details. This creates a contemporaneous record that the work was done correctly before anyone claims otherwise.",
      },
      {
        task: "Take completion photos with geotags",
        outcome: "Photograph completed work from multiple angles. VoiceLogPro embeds these photos with timestamps and geolocation in your daily report. If a GC later claims work was 'never finished' or 'poorly done,' your photos prove otherwise with irrefutable metadata.",
      },
      {
        task: "Document site conditions outside your control",
        outcome: "Record conditions that could affect your work: unfinished work by other trades, damaged materials, weather exposure, or access issues. This creates context that preempts blame-shifting. If a GC tries to charge you for fixing adjacent damage, your records show it existed before your work.",
      },
      {
        task: "Maintain a daily record of crew hours on site",
        outcome: "Backcharges sometimes claim you 'didn't have enough crew' or 'took too long.' Your daily logs with crew counts, hours worked, and tasks completed prove your actual resource allocation. VoiceLogPro tracks this automatically through your daily voice reports.",
      },
      {
        task: "Save all correspondence related to the scope",
        outcome: "Reference emails, text messages, and RFI communications in your daily logs. This creates a complete timeline that shows if a GC changed requirements, delayed your access, or failed to provide necessary information before charging you for outcomes they caused.",
      },
    ],
    keyPoints: [
      "The best defense against a deduction is proof the work was done correctly on time",
      "Photos with embedded metadata are the most effective anti-backcharge evidence",
      "Documenting conditions outside your control preemptively defeats blame-shifting",
      "Crew time records disprove 'not enough labor' claims",
      "Correspondence records in daily logs create a complete project timeline",
      "VoiceLogPro costs $49/month — a single unfair deduction can cost thousands",
    ],
    faqs: [
      {
        question: "What are the most common unfair GC deductions?",
        answer: "The most common are: defective work claims (without proof it was your work), incomplete scope claims (when you completed the work but the GC changed the scope), delay-related backcharges (when the delay was caused by others), and material damage claims (when damage was pre-existing).",
      },
      {
        question: "Can photos really protect me from backcharges?",
        answer: "Yes — but only if the photos have verifiable metadata. A photo file with embedded timestamps and geolocation creates an objective record of site conditions on a specific date. VoiceLogPro embeds this metadata automatically. A photo without metadata can be disputed as 'taken at a different time or location.'",
      },
      {
        question: "What should I do if I receive an unfair deduction?",
        answer: "First, don't pay it. Respond with your contemporaneous documentation: the daily reports showing completed work, the photos proving conditions, and the timeline showing when work was done. Most GCs will drop a deduction when faced with timestamped evidence. If they don't, your documentation package is ready for legal escalation.",
      },
    ],
  },
  {
    slug: "track-construction-materials-inventory",
    metaTitle: "How to Track Construction Materials Inventory | VoiceLogPro",
    metaDescription: "Learn how to track construction materials with voice notes. Real-time inventory management for electrical, plumbing, and HVAC materials on job sites.",
    h1: "How to Track Construction Materials Inventory with Voice Notes",
    intro: "Materials tracking is one of the most overlooked aspects of construction documentation. Lost materials, incorrect counts, and unaccounted deliveries cost subcontractors thousands in waste and disputes. Voice-first inventory tracking is faster than spreadsheets and more reliable than memory.",
    totalTime: "PT7M",
    steps: [
      {
        task: "Record material deliveries as they arrive",
        outcome: "When materials are delivered to the job site, record a quick voice note describing what arrived: material type, quantity, condition upon arrival, and where it was stored. This creates a timestamped receipt record that protects you if materials are damaged or go missing.",
      },
      {
        task: "Photograph materials on delivery with geotags",
        outcome: "Take photos of delivered materials showing their condition and storage location. VoiceLogPro embeds these photos with timestamps and geolocation in your daily report. This creates visual proof that materials arrived undamaged and were properly stored.",
      },
      {
        task: "Log materials as they're installed",
        outcome: "When you install materials, record a voice note specifying what was installed, where, and in what quantity. This creates a usage trail that matches your delivery records. The difference between delivered and installed quantities is either waste, theft, or incorrect delivery counts.",
      },
      {
        task: "Flag damaged, stolen, or excess materials",
        outcome: "If materials are damaged on site, stolen, or there's excess after installation, record it immediately. This documentation supports claims against the responsible party (GC for site security, supplier for damaged goods) and helps adjust future material orders.",
      },
      {
        task: "Generate weekly inventory summary reports",
        outcome: "VoiceLogPro compiles your daily material entries into weekly summaries showing deliveries, installations, and discrepancies. This gives you a real-time inventory picture without manual spreadsheet work.",
      },
    ],
    keyPoints: [
      "Voice recording is faster than typing material counts — capture while you work",
      "Delivery photos with timestamps prove condition and quantity upon arrival",
      "Installation logs create a usage trail that reconciles with deliveries",
      "Immediate flagging of theft or damage creates evidence for claims",
      "Weekly summaries replace manual spreadsheet tracking",
      "Material discrepancy documentation supports change order pricing and dispute resolution",
    ],
    faqs: [
      {
        question: "Can I track materials per project in VoiceLogPro?",
        answer: "Yes. Each daily report is project-specific, so all material entries are organized by project. You can review material deliveries, installations, and discrepancies per project, creating a complete materials audit trail without additional data entry.",
      },
      {
        question: "What if materials are stolen from the job site?",
        answer: "Record the theft immediately in VoiceLogPro with details of what was taken, estimated value, and any security observations. Your timestamped report supports insurance claims and GC responsibility discussions. Combined with delivery records showing what was on site, you have complete theft documentation.",
      },
      {
        question: "How does material tracking help with payment?",
        answer: "Material documentation proves you furnished the materials specified in your contract. This supports lien claims (materials furnished is a required element), change order pricing (materials used on extra work), and defends against 'materials not on site' accusations from GCs.",
      },
    ],
  },
];
