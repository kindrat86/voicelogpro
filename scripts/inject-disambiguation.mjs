#!/usr/bin/env node
/**
 * Self-contained AEO durability step. Re-injects VoiceLogPro's canonical
 * Organization disambiguation into every built pSEO page in dist/ that lacks it,
 * so the entity-collision fix survives growth-engine regeneration of the static
 * pSEO pages. Runs at the END of the build (after copy-pseo). Idempotent.
 *
 * Mirrors ~/.growth-engine/inject-disambiguation.py (self-contained because
 * Vercel cloud builds can't reach ~/.growth-engine).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const MARKER = '<!-- canonical-disambiguation -->';
const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VoiceLogPro',
  url: 'https://voicelogpro.com',
  logo: 'https://voicelogpro.com/images/og-card.jpg',
  description: "VoiceLogPro is a voice-to-PDF daily construction log app for contractors — general contractors, electricians, plumbers, HVAC, and roofers speak their on-site daily report and it becomes a timestamped, court-admissible PDF with fields for weather, crew, work performed, and materials, protecting mechanic's-lien and delay claims.",
  disambiguatingDescription: 'VoiceLogPro is a voice-to-PDF daily construction log app (voice on-site → timestamped, court-admissible daily-report PDF) — not a general-purpose meeting/voice-transcription tool (Otter, Rev, Fireflies), and not a full construction-management platform (Procore, Raken).',
  foundingDate: '2024',
  sameAs: ['https://github.com/kindrat86', 'https://x.com/data_nerd', 'https://www.linkedin.com/in/kushnir-maryan/', 'https://sipiteno.com', 'https://invisibleexit.com', 'https://signals.gitdealflow.com', 'https://sanctionsai.dev'],
};
const BLOCK = MARKER + '<script type="application/ld+json">' + JSON.stringify(ORG) + '</script>';
const SKIP = new Set(['assets', 'og', '_app', 'node_modules']);

let injected = 0;
let fixedCorrupted = 0;

function fixCorruptedJsonLd(html) {
  // Fix the literal `https://***@type` corruption in all pSEO pages
  // The growth engine emits `"@context":"https://***@type"` instead of `"@context":"https://schema.org","@type"`
  return html.replace(/"@context":"https:\/\/\*\*\*@type"/g, '"@context":"https://schema.org","@type"');
}

function walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(join(dir, e.name)); continue; }
    if (extname(e.name) !== '.html') continue;
    const p = join(dir, e.name);
    let t;
    try { t = readFileSync(p, 'utf8'); } catch { continue; }
    // Fix corrupted JSON-LD blocks (https://***@type → https://schema.org","@type)
    if (t.includes('https://***@type')) {
      const before = t.match(/https:\/\/\*\*\*@type/g)?.length || 0;
      t = fixCorruptedJsonLd(t);
      if (t !== readFileSync(p, 'utf8')) {
        writeFileSync(p, t);
        fixedCorrupted += before;
      }
    }
    // Step 1: Replace any old MARKER-tagged injected block with current canonical
    if (t.includes(MARKER)) {
      const oldBlockPattern = new RegExp(MARKER + '<script type="application/ld\\+json">[^<]*</script>', 'g');
      t = t.replace(oldBlockPattern, BLOCK);
      writeFileSync(p, t);
      injected++;
      continue;
    }
    // Step 1b: Replace first-generation inject blocks — Organization with
    // disambiguatingDescription but no logo (incomplete, no MARKER).
    if (t.includes('disambiguatingDescription') && !t.includes('"logo"') && t.includes('</head>')) {
      // Remove any bare Organization blocks (incomplete legacy inject)
      const bareOrgRe = /<script type="application\/ld\+json">\s*\{[^}]*"@type"\s*:\s*"Organization"[^}]*\}[^}]*<\/script>/gi;
      t = t.replace(bareOrgRe, '');
      // Inject the current canonical Organization
      t = t.replace('</head>', BLOCK + '\n</head>');
      writeFileSync(p, t);
      injected++;
      continue;
    }
    // Check if page has a top-level Organization JSON-LD block (not nested
    // inside author/publisher of another schema like Article).
    const hasTopLevelOrg = (() => {
      const re = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
      let m;
      while ((m = re.exec(t)) !== null) {
        try {
          const d = JSON.parse(m[1]);
          if (d['@type'] === 'Organization') return true;
        } catch {}
      }
      return false;
    })();
    // Skip pages that already have a top-level Organization or aren't HTML
    if (hasTopLevelOrg || !t.includes('</head>')) continue;
    // Inject canonical Organization into pages that lack any entity markup
    writeFileSync(p, t.replace('</head>', BLOCK + '\n</head>'));
    injected++;
  }
}

if (existsSync(DIST)) {
  walk(DIST);
  console.log(`✓ disambiguation: injected into ${injected} built pages, fixed ${fixedCorrupted} corrupted JSON-LD blocks`);
} else {
  console.log('(no dist/ — skipping disambiguation injection)');
}
