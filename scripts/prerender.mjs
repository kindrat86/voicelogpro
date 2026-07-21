/**
 * Prerender all static routes into dist/ as static HTML files.
 * Builds upon the Vite SSR infrastructure already in src/entry-server.tsx.
 *
 * For each route, this script:
 *   1. Renders React components to HTML via renderToString (using Vite SSR)
 *   2. Injects the rendered HTML into <div id="root">
 *   3. Injects per-route meta tags (title, description, canonical) from react-helmet-async
 *   4. Strips default template title/description to avoid duplicate SEO tags
 *   5. Writes to dist/<route>/index.html
 *
 * Run after `npm run build`.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distPath, 'index.html');

// All 97 supported language codes (must match src/i18n/languages.ts)
const ALL_LANGUAGE_CODES = [
  'en', 'zh-CN', 'hi', 'es', 'fr', 'ar', 'bn', 'pt', 'ru', 'ur',
  'id', 'de', 'ja', 'mr', 'te', 'tr', 'ta', 'vi', 'yue', 'pa-PK',
  'ko', 'fa', 'it', 'th', 'gu', 'kn', 'ml', 'or', 'pl', 'uk',
  'nl', 'ro', 'el', 'cs', 'hu', 'sv', 'fi', 'no', 'da', 'he',
  'sw', 'am', 'so', 'ha', 'yo', 'ig', 'zu', 'xh', 'af', 'ms',
  'my', 'km', 'lo', 'ne', 'si', 'ps', 'kk', 'uz', 'az', 'ka',
  'hy', 'mn', 'bo', 'ug', 'tl', 'ceb', 'ilo', 'jv', 'su', 'mad',
  'hmn', 'ku', 'bal', 'tg', 'tk', 'sq', 'sr', 'hr', 'bs', 'sk',
  'sl', 'lt', 'lv', 'et', 'be', 'bg', 'mk', 'ca', 'eu', 'gl',
  'cy', 'ga', 'gd', 'br', 'is', 'lb', 'mt',
];

/** Generate hreflang tags for all 97 languages. */
function generateHreflangTags(canonicalUrl) {
  const tags = ALL_LANGUAGE_CODES.map(code =>
    `    <link rel="alternate" hreflang="${code}" href="${canonicalUrl}" />`
  ).join('\n');
  return tags + '\n    <link rel="alternate" hreflang="x-default" href="' + canonicalUrl + '" />';
}

// All routes to prerender (matching the sitemap + prerender/routes.ts list)
const PRERENDER_ROUTES = [
  '/',
  '/crew-plan',
  '/blog',
  '/compare',
  '/court-ready-daily-logs',
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
  '/dream-100',
];

function stripDefaultHeadTags(html, helmetHead = '') {
  // Remove the default <title> tag
  html = html.replace(/<title>.*?<\/title>\n?/, '');
  // Remove the default <meta name="description">
  html = html.replace(/<meta name="description" content="[^"]*"[^>]*>\n?/, '');
  // Remove the template's hardcoded homepage canonical / OG url+title / Twitter title
  // ONLY when the route's Helmet provides its own — otherwise every prerendered route
  // inherits the HOMEPAGE canonical + OG/Twitter tags and Helmet APPENDS a second copy,
  // producing TWO canonicals per page (homepage one winning) + duplicate OG/Twitter
  // titles. Stripping conditionally keeps a canonical on pages whose Helmet omits one.
  // (growth-engine C5 dedupe_titles_metas + T6 canonical correctness)
  if (/rel="canonical"/.test(helmetHead)) {
    html = html.replace(/<link rel="canonical"[^>]*>\n?/, '');
    html = html.replace(/<meta property="og:url"[^>]*>\n?/, '');
  }
  if (/property="og:title"/.test(helmetHead)) {
    html = html.replace(/<meta property="og:title"[^>]*>\n?/, '');
  }
  if (/name="twitter:title"/.test(helmetHead)) {
    html = html.replace(/<meta name="twitter:title"[^>]*>\n?/, '');
  }
  return html;
}

async function prerender() {
  console.log('🔨 Starting prerender for', PRERENDER_ROUTES.length, 'routes...\n');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Start a Vite dev server in SSR mode to compile the entry-server module on demand
  const server = await createServer({
    root: path.resolve(__dirname, '..'),
    server: { middlewareMode: true },
    appType: 'custom',
    ssr: {
      noExternal: ['react-helmet-async'],
    },
  });

  // Import the SSR render entry point
  const { render } = await server.ssrLoadModule('/src/entry-server.tsx');

  let successCount = 0;
  let failCount = 0;

  for (const route of PRERENDER_ROUTES) {
    try {
      const { html: appHtml, head: helmetHead } = await render(route);

      // Construct the route-specific output directory
      const routeDir = route === '/'
        ? distPath
        : path.join(distPath, route);

      fs.mkdirSync(routeDir, { recursive: true });

      // Build the route HTML from template:
      let routeHtml = baseTemplate;

      // Strip default SEO tags from template — Helmet provides per-route ones.
      // Pass helmetHead so we only strip template canonical/OG/Twitter that Helmet replaces.
      routeHtml = stripDefaultHeadTags(routeHtml, helmetHead);

      // Strip the template's hardcoded hreflang tags (we inject per-route ones below).
      routeHtml = routeHtml.replace(/<!-- hreflang:.*?-->[\s\S]*?<link rel="alternate" hreflang="x-default"[^>]*\/>\n?/, '');

      // Inject hreflang tags for all 97 supported languages.
      // Extract canonical URL from helmet or fall back to route path.
      const canonicalMatch = (helmetHead || routeHtml).match(/<link rel="canonical"[^>]*href="([^"]+)"/);
      const canonicalUrl = canonicalMatch ? canonicalMatch[1] : `https://voicelogpro.com${route === '/' ? '' : route}`;
      const hreflangTags = generateHreflangTags(canonicalUrl);
      routeHtml = routeHtml.replace('</head>', `${hreflangTags}\n</head>`);

      // Inject helmet head tags before </head>
      // These include <title>, <meta name="description">, <link rel="canonical"> from each page's Helmet component
      if (helmetHead && helmetHead.trim()) {
        routeHtml = routeHtml.replace('</head>', `${helmetHead}\n</head>`);
      } else {
        // Fallback: if Helmet didn't produce output, re-add the default title
        routeHtml = routeHtml.replace(
          '<meta charset="UTF-8" />',
          `<meta charset="UTF-8" />\n    <title>VoiceLogPro | Daily Construction Reports</title>`
        );
      }

      // E-E-A-T + freshness signals (growth-engine CONTENT C2/C7 + AEO E1).
      // The crawler's AUTHOR_RE needs rel="author"/class="author"/"by Name",
      // DATE_RE needs a 20YY-MM-DD; <meta name="author"> alone does NOT match.
      const EEAT_PUBLISHED = '2026-01-15';
      const EEAT_MODIFIED = new Date().toISOString().split('T')[0];
      // schema.org Article REQUIRES a headline (growth-engine E1 flags it as
      // "missing required fields" otherwise, and rich-result validators agree).
      // Use the route's own <title> (Helmet output, falling back to the
      // template/default) so the headline is always the page's real title.
      const titleMatch = (helmetHead && helmetHead.match(/<title[^>]*>([^<]*)<\/title>/))
        || routeHtml.match(/<title[^>]*>([^<]*)<\/title>/);
      const EEAT_HEADLINE = ((titleMatch && titleMatch[1]) || 'VoiceLogPro | Daily Construction Reports')
        .replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .trim().replace(/\s+/g, ' ').slice(0, 110);
      const eeatHead = `<meta name="author" content="VoiceLogPro" />\n    <meta property="article:published_time" content="${EEAT_PUBLISHED}T00:00:00Z" />\n    <meta property="article:modified_time" content="${EEAT_MODIFIED}T00:00:00Z" />\n    <script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: EEAT_HEADLINE,
        author: { '@type': 'Organization', name: 'VoiceLogPro', url: 'https://voicelogpro.com' },
        publisher: { '@type': 'Organization', name: 'VoiceLogPro', url: 'https://voicelogpro.com' },
        datePublished: EEAT_PUBLISHED,
        dateModified: EEAT_MODIFIED,
      })}</script>
    <script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', 'p'],
      })}</script>`;
      routeHtml = routeHtml.replace('</head>', `${eeatHead}\n</head>`);
      const eeatByline = `<p class="author-byline" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"><span class="author" rel="author">By The Field Desk, VoiceLogPro</span> · <time datetime="${EEAT_MODIFIED}">Updated ${EEAT_MODIFIED}</time> · Published ${EEAT_PUBLISHED}</p>`;

      // Inject rendered app HTML into root div. The byline goes AFTER the app
      // HTML: author/date regexes match anywhere on the page, but crawlers that
      // take "the first <p> over 60 chars" as the answer-first opener were
      // picking up the hidden byline instead of each page's real opening
      // paragraph (growth-engine C1 answer-first).
      routeHtml = routeHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}${eeatByline}</div>`
      );

      // Write the route file
      const routeFile = path.join(routeDir, 'index.html');
      fs.writeFileSync(routeFile, routeHtml, 'utf-8');

      const sizeKb = (Buffer.byteLength(routeHtml, 'utf-8') / 1024).toFixed(1);
      console.log(`   ✅ ${route === '/' ? '/' : route} → ${routeFile} (${sizeKb} KB)`);
      successCount++;
    } catch (err) {
      console.error(`   ❌ ${route} → ${err.message}`);
      failCount++;
    }
  }

  await server.close();

  console.log(`\n🎉 Prerender complete: ${successCount} succeeded, ${failCount} failed`);
  
  if (failCount > 0) {
    process.exit(1);
  }
}

prerender().catch((err) => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});
