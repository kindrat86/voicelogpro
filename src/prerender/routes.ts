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
  '/solutions/texas-mechanics-lien-compliance',
  '/solutions/constructive-acceleration-defense',
  '/solutions/building-safety-act-golden-thread',
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
    canonical: 'https://www.voicelogpro.com/',
  },
  '/crew-plan': {
    title: 'Crew Plan - $49/month | Voice Log Pro',
    description: 'Join the Voice Log Pro waitlist. $49/month gets you unlimited daily reports, timestamps, weather data, and legal protection for your crew.',
    canonical: 'https://www.voicelogpro.com/crew-plan',
  },
  '/blog': {
    title: 'Construction Law & Compliance Blog | Voice Log Pro',
    description: 'Expert guides on construction lien law, payment protection, and daily documentation for subcontractors and project managers.',
    canonical: 'https://www.voicelogpro.com/blog',
  },
  '/solutions/texas-mechanics-lien-compliance': {
    title: 'Texas Mechanics Lien Compliance | Property Code Chapter 53 | Voice Log Pro',
    description: 'Automate Texas Property Code Chapter 53 compliance with Voice Log Pro. Generate monthly trapping notices and preserve lien rights with timestamped daily logs.',
    canonical: 'https://www.voicelogpro.com/solutions/texas-mechanics-lien-compliance',
  },
  '/solutions/constructive-acceleration-defense': {
    title: 'Constructive Acceleration Defense | Virginia Data Center Evidence | Voice Log Pro',
    description: 'Build evidence for constructive acceleration claims in Virginia Data Center Alley. Document excusable delays and schedule compression with timestamped daily logs.',
    canonical: 'https://www.voicelogpro.com/solutions/constructive-acceleration-defense',
  },
  '/solutions/building-safety-act-golden-thread': {
    title: 'Building Safety Act Golden Thread | UK Subcontractor Compliance | Voice Log Pro',
    description: 'Meet UK Building Safety Act Golden Thread requirements with Voice Log Pro. Create digital daily records for Higher-Risk Buildings and BS 8670 competence.',
    canonical: 'https://www.voicelogpro.com/solutions/building-safety-act-golden-thread',
  },
};
