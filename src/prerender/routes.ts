/**
 * Marketing routes to prerender at build time.
 * These pages will have full static HTML for AI crawlers and SEO.
 * 
 * Dynamic routes like /blog/:slug are NOT prerendered - they use SPA fallback.
 * Authenticated routes should NEVER be added here.
 */
export const PRERENDER_ROUTES: string[] = [
  '/',
  '/crew-plan',
  '/blog',
  '/compare',
  '/how-to',
  '/for',
  '/solutions/texas-mechanics-lien-compliance',
  '/solutions/constructive-acceleration-defense',
  '/solutions/building-safety-act-golden-thread',
  '/solutions/fight-unfair-gc-deductions',
  '/solutions/phase-payment-disputes',
  '/solutions/electrical-inventory-tracking',
  '/solutions/small-electrical-business-software',
  '/procore-vs-voice-log-pro',
  '/buildertrend-vs-voice-log-pro',
  '/contractor-foreman-vs-voice-log-pro',
  '/jobnimbus-vs-voice-log-pro',
  '/knowify-vs-voice-log-pro',
  '/raken-vs-voice-log-pro',
  '/fieldwire-vs-voice-log-pro',
  '/how-to/document-construction-delays',
  '/how-to/protect-lien-rights-as-subcontractor',
  '/how-to/document-construction-change-orders',
  '/how-to/defend-unfair-gc-deductions',
  '/how-to/track-construction-materials-inventory',
  '/for/electricians',
  '/for/plumbers',
  '/for/hvac-contractors',
  '/for/roofers',
  '/for/general-contractors',
  '/beta',
  '/defense-kit',
  '/welcome',
  '/blog/texas-lien-law',
  '/blog/texas-property-code-chapter-53-guide-2025',
  '/about',
  '/contact',
];

/**
 * Route metadata for SEO purposes.
 * Used by the Seo component to set proper meta tags per route.
 */
export const ROUTE_METADATA: Record<string, {
  title: string;
  description: string;
  canonical: string;
}> = {
  '/': {
    title: 'Voice Log Pro | Daily Construction Reports from Voice Notes',
    description: 'Turn voice notes into court-ready daily construction reports with timestamps and photos. Built for subcontractors who work with their hands.',
    canonical: 'https://voicelogpro.com/',
  },
  '/crew-plan': {
    title: 'Crew Plan - $49/month | Voice Log Pro',
    description: 'Join the Voice Log Pro waitlist. $49/month gets you unlimited daily reports, timestamps, weather data, and legal protection for your crew.',
    canonical: 'https://voicelogpro.com/crew-plan',
  },
  '/blog': {
    title: 'Construction Law & Compliance Blog | Voice Log Pro',
    description: 'Expert guides on construction lien law, payment protection, and daily documentation for subcontractors and project managers.',
    canonical: 'https://voicelogpro.com/blog',
  },
  '/compare': {
    title: 'Voice Log Pro vs Competitors | Construction Daily Report Comparisons',
    description: 'Honest comparisons showing why subcontractors choose Voice Log Pro for payment protection — not just project management.',
    canonical: 'https://voicelogpro.com/compare',
  },
  '/how-to': {
    title: 'How-To Guides for Construction Documentation | Voice Log Pro',
    description: 'Step-by-step guides on documenting construction delays, protecting lien rights, tracking materials, and managing change orders.',
    canonical: 'https://voicelogpro.com/how-to',
  },
  '/for': {
    title: 'Daily Construction Reports by Trade | Voice Log Pro',
    description: 'Voice-first daily reports built for electricians, plumbers, HVAC contractors, roofers, and general contractors.',
    canonical: 'https://voicelogpro.com/for',
  },
  '/solutions/texas-mechanics-lien-compliance': {
    title: 'Texas Mechanics Lien Compliance | Property Code Chapter 53 | Voice Log Pro',
    description: 'Automate Texas Property Code Chapter 53 compliance with Voice Log Pro. Generate monthly trapping notices and preserve lien rights with timestamped daily logs.',
    canonical: 'https://voicelogpro.com/solutions/texas-mechanics-lien-compliance',
  },
  '/solutions/constructive-acceleration-defense': {
    title: 'Constructive Acceleration Defense | Virginia Data Center Evidence | Voice Log Pro',
    description: 'Build evidence for constructive acceleration claims in Virginia Data Center Alley. Document excusable delays and schedule compression with timestamped daily logs.',
    canonical: 'https://voicelogpro.com/solutions/constructive-acceleration-defense',
  },
  '/solutions/building-safety-act-golden-thread': {
    title: 'Building Safety Act Golden Thread | UK Subcontractor Compliance | Voice Log Pro',
    description: 'Meet UK Building Safety Act Golden Thread requirements with Voice Log Pro. Create digital daily records for Higher-Risk Buildings and BS 8670 competence.',
    canonical: 'https://voicelogpro.com/solutions/building-safety-act-golden-thread',
  },
  '/solutions/fight-unfair-gc-deductions': {
    title: 'Fight Unfair GC Deductions & Backcharges | Voice Log Pro',
    description: 'Defend against unfair GC deductions and backcharges. Document completed work with timestamped daily reports and protect your payment with Voice Log Pro.',
    canonical: 'https://voicelogpro.com/solutions/fight-unfair-gc-deductions',
  },
  '/solutions/phase-payment-disputes': {
    title: 'Phase Payment Dispute Documentation | Voice Log Pro',
    description: 'Document phased payment disputes with contemporaneous daily logs. Protect your staged payment rights with timestamped, court-ready evidence from Voice Log Pro.',
    canonical: 'https://voicelogpro.com/solutions/phase-payment-disputes',
  },
  '/solutions/electrical-inventory-tracking': {
    title: 'Electrical Inventory Tracking Software | Voice Log Pro',
    description: 'Track electrical materials inventory with voice notes. Real-time inventory management for electrical subcontractors. Voice-first material tracking for job sites.',
    canonical: 'https://voicelogpro.com/solutions/electrical-inventory-tracking',
  },
  '/solutions/small-electrical-business-software': {
    title: 'Small Electrical Business Software | Voice Log Pro',
    description: 'All-in-one software for small electrical businesses. Voice-first daily reporting, material tracking, and legal documentation for electrical contractors.',
    canonical: 'https://voicelogpro.com/solutions/small-electrical-business-software',
  },
  '/raken-vs-voice-log-pro': {
    title: 'Raken vs Voice Log Pro | Daily Report Comparison | Voice Log Pro',
    description: 'Compare Raken vs Voice Log Pro for construction daily reports. See why subcontractors choose Voice Log Pro for payment protection over Raken.',
    canonical: 'https://voicelogpro.com/raken-vs-voice-log-pro',
  },
  '/fieldwire-vs-voice-log-pro': {
    title: 'Fieldwire vs Voice Log Pro | Construction Field Report Comparison',
    description: 'Compare Fieldwire vs Voice Log Pro. Fieldwire manages tasks and plans. Voice Log Pro gets you paid for work and delays. Voice-first daily reports for subs.',
    canonical: 'https://voicelogpro.com/fieldwire-vs-voice-log-pro',
  },
  '/beta': {
    title: 'Beta Access | Voice Log Pro',
    description: 'Get early beta access to Voice Log Pro. Join the waitlist for voice-first daily construction reports for subcontractors.',
    canonical: 'https://voicelogpro.com/beta',
  },
  '/about': {
    title: 'About Voice Log Pro — Voice-to-PDF Daily Construction Reports',
    description: 'Voice Log Pro turns voice notes into court-ready daily construction reports. Built by subcontractors who learned that missing reports cost more than bad work.',
    canonical: 'https://voicelogpro.com/about',
  },
  '/contact': {
    title: 'Contact Voice Log Pro | Daily Construction Reports Support',
    description: 'Get in touch with Voice Log Pro. Questions about daily construction reports, partnership inquiries, or support. We answer fast.',
    canonical: 'https://voicelogpro.com/contact',
  },
};
