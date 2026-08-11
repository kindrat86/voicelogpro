import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distPath, 'index.html');

/**
 * Verify that prerendered HTML contains expected marketing content.
 * Run after build to ensure AI crawlers will see actual content.
 */
async function verifyPrerender() {
  console.log('🔍 Verifying prerendered HTML...\n');

  // Check if dist exists
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist/ folder not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Check if index.html exists
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ dist/index.html not found.');
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Required strings that should appear in prerendered HTML
  const requiredStrings = [
    // Hero section content
    'VoiceLogPro',
    'Daily report',
    // Value proposition
    'court-ready',
    // CTA
    'Crew Plan',
  ];

  const missingStrings = [];
  const foundStrings = [];

  for (const str of requiredStrings) {
    if (indexHtml.includes(str)) {
      foundStrings.push(str);
    } else {
      missingStrings.push(str);
    }
  }

  console.log('✅ Found in HTML:');
  foundStrings.forEach(s => console.log(`   - "${s}"`));

  if (missingStrings.length > 0) {
    console.log('\n⚠️  Missing from HTML (may indicate prerender issue):');
    missingStrings.forEach(s => console.log(`   - "${s}"`));
    
    // Check if it's just an empty shell
    if (indexHtml.includes('<div id="root"></div>') && !indexHtml.includes('<div id="root">')) {
      console.log('\n❌ FAIL: HTML appears to be empty shell (no prerendered content)');
      console.log('   AI crawlers will not see your marketing content!');
      process.exit(1);
    }
  }

  // Check for SEO meta tags
  console.log('\n🔍 Checking SEO meta tags...');
  
  const seoChecks = [
    { name: 'Title tag', regex: /<title>.*VoiceLogPro.*<\/title>/i },
    { name: 'Meta description', regex: /<meta\s+name="description"[^>]*>/i },
    { name: 'Canonical link', regex: /<link\s+rel="canonical"[^>]*>/i },
  ];

  for (const check of seoChecks) {
    if (check.regex.test(indexHtml)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ⚠️  ${check.name} not found`);
    }
  }

  // Check other prerendered routes if they exist
  const prerenderRoutes = ['crew-plan', 'blog'];
  
  console.log('\n🔍 Checking prerendered routes...');
  for (const route of prerenderRoutes) {
    const routePath = path.join(distPath, route, 'index.html');
    if (fs.existsSync(routePath)) {
      console.log(`   ✅ /${route}/index.html exists`);
    } else {
      console.log(`   ⚠️  /${route}/index.html not found (SPA fallback will be used)`);
    }
  }

  // --- BLOCKING GATE: hidden text / cloaking + fabricated bylines ------------
  // Until 2026-08-11 prerender.mjs injected a fabricated byline ("By The Field
  // Desk, VoiceLogPro") inside
  //   position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)
  // on every prerendered route. That is hidden text under Google's spam
  // policies, and "The Field Desk" is not a person or a team. It existed purely
  // to make an external crawler's AUTHOR_RE/DATE_RE fire — optimising an audit
  // score against a signal no human could see. sipiteno.com shipped the
  // identical pattern on 52% of its URLs; both were fixed on 2026-08-11.
  //
  // It survived for months because nothing inspected the built bytes: curl
  // returned 200 with full markup, the browser rendered correctly, Lighthouse
  // passed, and Search Console showed no manual action. The only way to catch
  // it is to look at WHERE the text sits. So: check every built HTML file.
  //
  // Scope is the inline style attribute, NOT the compiled CSS — Tailwind's
  // `sr-only` uses the same declarations legitimately for skip-links and form
  // labels, and screen-reader-only text is explicitly permitted. A gate that
  // false-positives on accessibility markup gets switched off by whoever hits
  // it next, which defeats the purpose.
  console.log('\n🔍 Checking for hidden text / fabricated bylines...');

  const CLOAK_RE = /style="[^"]*?(?:clip:\s*rect\(0 0 0 0\)|clip-path:\s*inset\(50%\)|width:\s*1px;\s*height:\s*1px;\s*overflow:\s*hidden)[^"]*"/i;
  const BYLINE_RE = /class="[^"]*author-byline[^"]*"|By The Field Desk/i;

  const htmlFiles = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) htmlFiles.push(p);
    }
  })(distPath);

  const cloaked = [];
  const bylined = [];
  for (const f of htmlFiles) {
    const html = fs.readFileSync(f, 'utf-8');
    if (CLOAK_RE.test(html)) cloaked.push(path.relative(distPath, f));
    if (BYLINE_RE.test(html)) bylined.push(path.relative(distPath, f));
  }

  if (cloaked.length || bylined.length) {
    console.error(`\n❌ PRERENDER GATE FAILED — scanned ${htmlFiles.length} HTML files`);
    if (cloaked.length) {
      console.error(`   ${cloaked.length} file(s) contain hidden-text inline styles:`);
      cloaked.slice(0, 5).forEach(f => console.error(`     ${f}`));
    }
    if (bylined.length) {
      console.error(`   ${bylined.length} file(s) contain a fabricated author byline:`);
      bylined.slice(0, 5).forEach(f => console.error(`     ${f}`));
    }
    console.error('   See scripts/prerender.mjs. Do not "improve" the hiding — remove it.');
    process.exit(1);
  }
  console.log(`   ✅ ${htmlFiles.length} HTML files clean (no hidden text, no fabricated byline)`);

  console.log('\n✅ Prerender verification complete.');
  console.log('   Note: Full prerendering requires SSG build setup.');
  console.log('   Current setup uses client-side rendering with SEO meta tags.');
}

verifyPrerender();
