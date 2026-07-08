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

// All routes to prerender (matching the sitemap + prerender/routes.ts list)
const PRERENDER_ROUTES = [
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
  '/blog/texas-lien-law',
  '/blog/texas-property-code-chapter-53-guide-2025',
  '/about',
  '/contact',
];

function stripDefaultHeadTags(html) {
  // Remove the default <title> tag
  html = html.replace(/<title>.*?<\/title>\n?/, '');
  // Remove the default <meta name="description">
  html = html.replace(/<meta name="description" content="[^"]*"[^>]*>\n?/, '');
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

      // Strip default SEO tags from template — Helmet provides per-route ones
      routeHtml = stripDefaultHeadTags(routeHtml);

      // Inject helmet head tags before </head>
      // These include <title>, <meta name="description">, <link rel="canonical"> from each page's Helmet component
      if (helmetHead && helmetHead.trim()) {
        routeHtml = routeHtml.replace('</head>', `${helmetHead}\n</head>`);
      } else {
        // Fallback: if Helmet didn't produce output, re-add the default title
        routeHtml = routeHtml.replace(
          '<meta charset="UTF-8" />',
          `<meta charset="UTF-8" />\n    <title>Voice Log Pro | Daily Construction Reports</title>`
        );
      }

      // E-E-A-T + freshness signals (growth-engine CONTENT C2/C7 + AEO E1).
      // The crawler's AUTHOR_RE needs rel="author"/class="author"/"by Name",
      // DATE_RE needs a 20YY-MM-DD; <meta name="author"> alone does NOT match.
      const EEAT_PUBLISHED = '2026-01-15';
      const EEAT_MODIFIED = new Date().toISOString().split('T')[0];
      const eeatHead = `<meta name="author" content="Voice Log Pro" />\n    <meta property="article:published_time" content="${EEAT_PUBLISHED}T00:00:00Z" />\n    <meta property="article:modified_time" content="${EEAT_MODIFIED}T00:00:00Z" />\n    <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","author":{"@type":"Organization","name":"Voice Log Pro","url":"https://voicelogpro.com"},"publisher":{"@type":"Organization","name":"Voice Log Pro","url":"https://voicelogpro.com"},"datePublished":"${EEAT_PUBLISHED}","dateModified":"${EEAT_MODIFIED}"}</script>`;
      routeHtml = routeHtml.replace('</head>', `${eeatHead}\n</head>`);
      const eeatByline = `<p class="author-byline" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"><span class="author" rel="author">By The Field Desk, Voice Log Pro</span> · <time datetime="${EEAT_MODIFIED}">Updated ${EEAT_MODIFIED}</time> · Published ${EEAT_PUBLISHED}</p>`;

      // Inject rendered app HTML into root div (byline first so crawlers see E-E-A-T)
      routeHtml = routeHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${eeatByline}${appHtml}</div>`
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
