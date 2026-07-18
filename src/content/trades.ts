/**
 * Trade vertical landing pages — target-specific pages for each trade.
 * These target "construction daily report for [trade]" searches.
 */
export interface TradeEntry {
  slug: string;
  tradeName: string;
  tradePlural: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  painPoints: string[];
  howVlpHelps: string[];
  useCaseExamples: { situation: string; howVlpHelps: string }[];
  faqs: { question: string; answer: string }[];
}

export const trades: TradeEntry[] = [
  {
    slug: "electricians",
    tradeName: "Electrician",
    tradePlural: "Electricians",
    metaTitle: "Daily Construction Reports for Electricians | VoiceLogPro",
    metaDescription: "Voice-first daily reports built for electricians. Track conduit runs, cable pulls, panel installations, and change orders with 30-second voice notes. Court-ready PDFs in seconds.",
    h1: "Daily Construction Reports Built for Electricians",
    intro: "Electricians work with their hands, not keyboards. Between pulling cable, terminating panels, and troubleshooting circuits, there's no time to fill out forms. VoiceLogPro turns a 30-second voice recording into a professional, court-ready daily report — so you can document without stopping work.",
    painPoints: [
      "Typing reports at the end of the day after a full shift of physical work",
      "Forgetting details about specific circuits, panels, or conduit runs hours later",
      "No way to easily document change orders for extra electrical work",
      "Losing track of materials used vs. materials delivered for each job",
      "GCs claiming work wasn't completed or wasn't done to spec",
      "No contemporaneous evidence to support electrical lien claims",
    ],
    howVlpHelps: [
      "30-second voice recording captures conduit runs, panel terminations, and circuit details while you're standing at the panel",
      "Automatic timestamps and weather data — ideal for weather-related delay documentation",
      "Photo attachments with geolocation prove completed work before it's covered by drywall",
      "Court-ready PDFs support change order pricing and lien right preservation",
      "Flat $49/month for your entire crew — no per-user fees",
      "Works fully offline in basements, mechanical rooms, and service tunnels",
    ],
    useCaseExamples: [
      {
        situation: "You complete a panel changeout but the GC claims it wasn't finished",
        howVlpHelps: "Your VoiceLogPro entry from that day includes a timestamped voice note describing the completed work plus photos of the finished panel with geotags — irrefutable proof the work was done.",
      },
      {
        situation: "You're asked to pull extra circuits as a verbal change order",
        howVlpHelps: "Record a voice note at the time of the request describing the extra work. Later, VoiceLogPro compiles all change order entries into a single report supporting your invoice.",
      },
      {
        situation: "Weather delays your rooftop conduit installation",
        howVlpHelps: "Your voice note captures the weather condition, and VoiceLogPro automatically tags it with historical weather data. This creates excusable delay evidence without any extra effort.",
      },
    ],
    faqs: [
      {
        question: "Is VoiceLogPro designed for electricians specifically?",
        answer: "Yes. VoiceLogPro was built with input from electrical subcontractors. The voice-first interface is designed for electricians who need to document while keeping their hands free and their tools accessible. No typing, no forms, no stopping work to fill out paperwork.",
      },
      {
        question: "Can I document electrical change orders easily?",
        answer: "Yes. Just record a voice note when the change order is requested, describing the extra work, materials, and location. VoiceLogPro creates a timestamped entry that supports your change order pricing. Multiple change order entries can be compiled into a single report.",
      },
      {
        question: "Does VoiceLogPro help with electrical lien rights?",
        answer: "Yes. Electrical subcontractors have strong lien rights in most states, but they depend on proper documentation. VoiceLogPro creates the contemporaneous records that prove labor and materials were furnished — the foundation of any mechanics lien claim.",
      },
    ],
  },
  {
    slug: "plumbers",
    tradeName: "Plumber",
    tradePlural: "Plumbers",
    metaTitle: "Daily Construction Reports for Plumbers | VoiceLogPro",
    metaDescription: "Voice-first daily reports for plumbing contractors. Document pipe runs, fixture installations, and material usage with voice notes. Protect your payment with court-ready PDFs.",
    h1: "Daily Construction Reports Built for Plumbers",
    intro: "Plumbers are on their feet all day — in crawl spaces, on rooftops, and behind walls. The last thing you want to do at the end of a shift is type up reports. VoiceLogPro captures your day in 30 seconds of speaking while you're standing at the job.",
    painPoints: [
      "Typing reports after a long day of physical installation work",
      "Forgetting pipe run details, fixture specs, or material counts later",
      "No easy way to prove rough-in inspection readiness",
      "GCs claiming work wasn't completed or had defects after walls are sealed",
      "Change orders for extra pipe runs that never get paid",
      "No contemporaneous documentation for lien claims on unpaid work",
    ],
    howVlpHelps: [
      "Record pipe runs, fixture installations, and material usage with voice — not typing",
      "Automatic timestamps prove when each phase of work was completed",
      "Photo attachments with geolocation prove completed rough-ins before walls are closed",
      "Court-ready PDFs support payment applications and lien right preservation",
      "Flat $49/month for your entire crew — no per-user fees",
      "Works fully offline in basements, crawl spaces, and new construction sites",
    ],
    useCaseExamples: [
      {
        situation: "Your rough-in inspection is delayed, pushing your schedule",
        howVlpHelps: "Record the delay with details about the inspection issue. VoiceLogPro tags it with time and weather data, creating contemporaneous evidence for excusable delay claims.",
      },
      {
        situation: "The GC asks you to add an extra bathroom rough-in verbally",
        howVlpHelps: "Record the request immediately. Your voice note with timestamp becomes the starting evidence for your change order documentation.",
      },
      {
        situation: "A GC claims you damaged pre-existing pipes during installation",
        howVlpHelps: "Your daily reports documenting site conditions before you started — with photos — prove the pipes were already damaged, protecting you from backcharges.",
      },
    ],
    faqs: [
      {
        question: "Can plumbers use VoiceLogPro without stopping work?",
        answer: "Absolutely. That's exactly what it was designed for. Record a 30-second voice note while you're working — hands-free. VoiceLogPro transcribes it and formats it into a professional daily report automatically.",
      },
      {
        question: "Does VoiceLogPro track plumbing materials?",
        answer: "Yes. Record voice notes describing materials you install: pipe type and size, fittings, fixtures, valves. This creates a usage record that supports your material billing and change order pricing. VoiceLogPro also tracks photos of material delivery.",
      },
      {
        question: "How does VoiceLogPro help plumbers get paid faster?",
        answer: "By creating complete, contemporaneous documentation that eliminates disputes. Completed work is proven by timestamped voice notes and photos. Change orders are documented at the time of request. Delays are recorded with weather data. This documentation accelerates payment approvals and defeats deduction attempts.",
      },
    ],
  },
  {
    slug: "hvac-contractors",
    tradeName: "HVAC Contractor",
    tradePlural: "HVAC Contractors",
    metaTitle: "Daily Construction Reports for HVAC Contractors | VoiceLogPro",
    metaDescription: "Voice-first daily reports for HVAC contractors. Document ductwork, equipment installations, and commissioning with voice notes. Protect payment with court-ready PDF documentation.",
    h1: "Daily Construction Reports Built for HVAC Contractors",
    intro: "HVAC work is complex — ductwork runs, equipment installations, refrigerant lines, and commissioning. Documentation is critical for payment and liability protection, but typing reports between jobs is impractical. VoiceLogPro lets you document while you work.",
    painPoints: [
      "Complex installations that are hard to document hours later from memory",
      "Commissioning records that need detailed descriptions of system parameters",
      "Equipment deliveries and model numbers that need accurate documentation",
      "GCs claiming equipment wasn't installed correctly or on time",
      "Change orders for additional ductwork or equipment upgrades",
      "No contemporaneous records for warranty or liability protection",
    ],
    howVlpHelps: [
      "Record equipment model numbers, serial numbers, and installation details by voice at the unit",
      "Automatic timestamps prove commissioning dates for warranty purposes",
      "Photo attachments with geolocation document installed equipment and ductwork before ceilings are closed",
      "Court-ready PDFs support payment applications and protect against liability claims",
      "Flat $49/month for your entire crew — no per-user fees",
      "Works fully offline in mechanical rooms, rooftops, and new construction",
    ],
    useCaseExamples: [
      {
        situation: "You commission an air handler but the GC claims it wasn't tested",
        howVlpHelps: "Your voice note describing the commissioning process and parameters, combined with photos of the running equipment with timestamps, proves the work was completed and tested.",
      },
      {
        situation: "An equipment delivery is missing units",
        howVlpHelps: "Record the delivery count on arrival. When units are short, your timestamped voice note proves what arrived and when, supporting your shortage claim with the supplier.",
      },
      {
        situation: "Additional ductwork is needed due to architectural changes",
        howVlpHelps: "Record a voice note at the time describing the extra ductwork required. This creates contemporaneous evidence supporting your change order for the additional materials and labor.",
      },
    ],
    faqs: [
      {
        question: "Is VoiceLogPro useful for HVAC commissioning records?",
        answer: "Yes. Commissioning documentation is critical for warranty validation and liability protection. VoiceLogPro creates timestamped records of system startup, parameter readings, and testing — all captured while you're at the equipment, not hours later from memory.",
      },
      {
        question: "Can I document equipment serial numbers with VoiceLogPro?",
        answer: "Yes. Record a voice note with the model and serial numbers at the equipment, or take a photo of the nameplate. VoiceLogPro attaches this documentation to your daily report with automatic timestamps and project association.",
      },
      {
        question: "Does VoiceLogPro help with HVAC lien rights?",
        answer: "Yes. HVAC contractors have strong lien rights for equipment and labor furnished. VoiceLogPro creates the contemporaneous records proving you delivered and installed equipment — the foundation of any lien claim for unpaid HVAC work.",
      },
    ],
  },
  {
    slug: "roofers",
    tradeName: "Roofer",
    tradePlural: "Roofers",
    metaTitle: "Daily Construction Reports for Roofers | VoiceLogPro",
    metaDescription: "Voice-first daily reports for roofing contractors. Document tear-offs, underlayment, and final roofing with voice notes. Protect payment with weather-tagged, court-ready PDFs.",
    h1: "Daily Construction Reports Built for Roofers",
    intro: "Roofing work is weather-dependent, physical, and time-sensitive. The last thing a roofer wants at the end of a day on a hot roof is more paperwork. VoiceLogPro captures your daily documentation in 30 seconds — and automatically tags it with the weather data that protects your delay claims.",
    painPoints: [
      "Weather conditions that constantly disrupt schedules and need documentation",
      "Tear-off records and debris disposal documentation for compliance",
      "Before-and-after photos needed to prove completed scope",
      "GCs claiming delays were your fault when weather was the cause",
      "Material delivery discrepancies (shingles, underlayment, flashing)",
      "No easy way to document punch list completion for final payment",
    ],
    howVlpHelps: [
      "Automatic weather tagging — every daily report includes temperature, precipitation, and wind data",
      "Voice recording takes 30 seconds — no typing on the roof",
      "Photo attachments with timestamps and geolocation prove completed work",
      "Weather-tagged reports create excusable delay evidence that shifts liability to weather events",
      "Flat $49/month for your entire crew — no per-user fees",
      "Works fully offline in any location",
    ],
    useCaseExamples: [
      {
        situation: "A rain day forces you off the roof, pushing the schedule",
        howVlpHelps: "Your voice note says 'rain delay' and VoiceLogPro automatically tags it with the actual precipitation data. This creates objective excusable delay evidence that prevents the GC from charging you for schedule impact.",
      },
      {
        situation: "The GC claims the tear-off wasn't complete before your crew arrived",
        howVlpHelps: "Your daily log from the previous day documents the completed tear-off with photos. The timestamped record proves the work was done, defeating the backcharge attempt.",
      },
      {
        situation: "Shingles are delivered short, stopping your installation",
        howVlpHelps: "Record your material count on arrival. VoiceLogPro creates a delivery record. When shingles are short, the record supports your delay claim against the supplier and protects you from GC schedule penalties.",
      },
    ],
    faqs: [
      {
        question: "Can roofers use VoiceLogPro on the roof?",
        answer: "Yes. Voice recording works one-handed and doesn't require looking at a screen. You can record a daily note while standing on the roof without stopping work or risking your balance by typing on a phone.",
      },
      {
        question: "How does weather tagging help roofers?",
        answer: "Weather is the #1 variable in roofing schedules. VoiceLogPro automatically records temperature, precipitation, and wind for every daily entry. This creates objective evidence that weather — not your crew — caused schedule delays, protecting you from backcharges and liquidated damages.",
      },
      {
        question: "Does VoiceLogPro help with roofing lien rights?",
        answer: "Yes. Roofing suppliers and contractors have strong lien rights in most states. VoiceLogPro creates the contemporaneous records proving labor and materials were furnished — essential for any mechanics lien filing on unpaid roofing work.",
      },
    ],
  },
  {
    slug: "general-contractors",
    tradeName: "General Contractor",
    tradePlural: "General Contractors",
    metaTitle: "Daily Construction Reports for General Contractors | VoiceLogPro",
    metaDescription: "Voice-first daily reports for GCs managing trade crews. Document sitewide conditions, track subcontractor progress, and maintain project records with 30-second voice notes.",
    h1: "Daily Construction Reports Built for General Contractors",
    intro: "General Contractors juggle multiple trades, changing conditions, and constant communication demands. You need documentation from every corner of the site, but you're not the one doing the typing. VoiceLogPro lets you capture sitewide conditions, crew progress, and issues in seconds — by voice, while walking the job.",
    painPoints: [
      "Walking the site and needing to remember details for end-of-day reports",
      "Subcontractor disputes about who was on site and what they did",
      "Owner requests for progress documentation that's hard to produce",
      "Safety incidents that need immediate, detailed documentation",
      "Weather impacts across multiple work areas that need coordinated records",
      "No unified system for sitewide daily documentation across trades",
    ],
    howVlpHelps: [
      "Walk the site and record observations by voice — captures conditions, crew counts, and progress naturally",
      "Court-ready PDFs with timestamps support owner reporting and dispute resolution",
      "Photo attachments with geolocation document sitewide conditions for each area",
      "Automatic weather data supports overall project delay documentation",
      "Flat $49/month for your entire team — covers unlimited daily reports",
      "Works fully offline in any job site condition",
    ],
    useCaseExamples: [
      {
        situation: "An owner asks for a progress update mid-week",
        howVlpHelps: "Your daily reports from the week already contain all the documentation. Compile them into a single PDF progress package in minutes — no scrambling for notes or photos.",
      },
      {
        situation: "A subcontractor claims they weren't on site when they were",
        howVlpHelps: "Your daily log has timestamped entries noting every crew on site. The VoiceLogPro record proves who was there, when, and what they were doing.",
      },
      {
        situation: "Weather delays multiple work areas simultaneously",
        howVlpHelps: "One voice note captures the sitewide condition, and weather tagging applies to the entire project log. This creates coordinated delay documentation for owner reporting and force majeure claims.",
      },
    ],
    faqs: [
      {
        question: "Is VoiceLogPro useful for GCs or just subcontractors?",
        answer: "Both. While VoiceLogPro was designed with subcontractors in mind, GCs benefit from the same voice-first documentation. Walking the site and recording observations by voice is faster and more natural than typing notes. The court-ready PDFs serve owner reporting and project documentation needs equally well.",
      },
      {
        question: "Can GCs track multiple subcontractors with VoiceLogPro?",
        answer: "Yes. Your daily log can include observations about each trade on site — who was working, what they were doing, and any issues. This creates a sitewide picture that's invaluable for progress tracking and dispute resolution.",
      },
      {
        question: "Does VoiceLogPro replace project management software?",
        answer: "No. VoiceLogPro replaces paper daily logs and typed daily reports — it's a documentation tool, not a project management system. It complements tools like Procore or Buildertrend by providing voice-first field documentation that feeds into your broader project management workflow.",
      },
    ],
  },
];
