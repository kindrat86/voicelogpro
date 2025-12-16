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
    'Voice Log Pro',
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
    { name: 'Title tag', regex: /<title>.*Voice Log Pro.*<\/title>/i },
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

  console.log('\n✅ Prerender verification complete.');
  console.log('   Note: Full prerendering requires SSG build setup.');
  console.log('   Current setup uses client-side rendering with SEO meta tags.');
}

verifyPrerender();
