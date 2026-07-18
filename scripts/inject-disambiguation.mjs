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
  description: "VoiceLogPro is a voice-to-PDF daily construction log app for contractors — general contractors, electricians, plumbers, HVAC, and roofers speak their on-site daily report and it becomes a timestamped, court-admissible PDF with fields for weather, crew, work performed, and materials, protecting mechanic's-lien and delay claims.",
  disambiguatingDescription: 'VoiceLogPro is a voice-to-PDF daily construction log app (voice on-site → timestamped, court-admissible daily-report PDF) — not a general-purpose meeting/voice-transcription tool (Otter, Rev, Fireflies), and not a full construction-management platform (Procore, Raken).',
};
const BLOCK = MARKER + '<script type="application/ld+json">' + JSON.stringify(ORG) + '</script>';
const SKIP = new Set(['assets', 'og', '_app', 'node_modules']);

let injected = 0;
function walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(join(dir, e.name)); continue; }
    if (extname(e.name) !== '.html') continue;
    const p = join(dir, e.name);
    let t;
    try { t = readFileSync(p, 'utf8'); } catch { continue; }
    if (t.includes('disambiguatingDescription') || !t.includes('</head>')) continue;
    writeFileSync(p, t.replace('</head>', BLOCK + '\n</head>'));
    injected++;
  }
}

if (existsSync(DIST)) {
  walk(DIST);
  console.log(`✓ disambiguation: injected into ${injected} built pages`);
} else {
  console.log('(no dist/ — skipping disambiguation injection)');
}
