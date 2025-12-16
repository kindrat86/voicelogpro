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
};
