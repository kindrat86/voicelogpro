#!/usr/bin/env node
/**
 * Blocking JSON-LD gate on the BUILT output.
 *
 * Why this exists separately from scripts/validate_jsonld.py:
 * that one is the portfolio-wide guard and only ever sees checked-out
 * source (CI runs it at checkout, and it skips dist/ by design). The
 * corruption that actually reached Google — Search Console
 * "Unparsable structured data / Parsing error: Missing ',' or '}'" on
 * voicelogpro.com — is introduced *during* the build, by the centrally
 * generated pSEO pages, so source-only linting cannot see it.
 *
 * The failure mode: the growth engine emits
 *   "@context":"https://***@type":"WebPage"
 * where it meant
 *   "@context":"https://schema.org","@type":"WebPage"
 * i.e. the `schema.org","` was clobbered. The result is a key followed
 * by a second `:` — exactly "Expecting ',' delimiter".
 *
 * inject-disambiguation.mjs repairs that pattern, but a repair with no
 * verification is not a guarantee: a new variant of the corruption slips
 * straight through to production. This runs LAST, after the repair, and
 * fails the build so broken structured data cannot ship.
 *
 * Node (not Python) on purpose: every deploy path runs `npm run build:all`
 * — Vercel cloud builds and local `vercel build --prod && vercel deploy
 * --prebuilt` alike — and Node is guaranteed in all of them.
 *
 * Usage: node scripts/verify-jsonld.mjs [dir]   (default: dist)
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), process.argv[2] || 'dist');
const SKIP = new Set(['assets', 'node_modules', '.git']);

const BLOCK_RE =
  /<script[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

// Corruption signatures that can survive JSON.parse and still poison the
// entity graph, so a plain parse check would wave them through.
const SUSPECT = [
  { re: /https:\/\/\*{3}/, msg: 'clobbered @context (https://*** — expected https://schema.org)' },
  { re: /"@context"\s*:\s*"[^"]*@type/, msg: '@type swallowed into the @context string' },
];

const errors = [];
let files = 0;
let blocks = 0;

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) walk(join(dir, e.name));
      continue;
    }
    if (extname(e.name) !== '.html') continue;
    check(join(dir, e.name));
  }
}

function check(path) {
  const rel = path.replace(process.cwd() + '/', '');
  let html;
  try {
    html = readFileSync(path, 'utf8');
  } catch {
    return;
  }
  files++;

  BLOCK_RE.lastIndex = 0;
  let m;
  let i = -1;
  while ((m = BLOCK_RE.exec(html)) !== null) {
    i++;
    const raw = m[1].trim();
    if (!raw) continue;
    blocks++;

    for (const { re, msg } of SUSPECT) {
      if (re.test(raw)) errors.push(`${rel} [block ${i}]: ${msg}`);
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      errors.push(`${rel} [block ${i}]: invalid JSON — ${err.message}`);
      continue;
    }

    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      if (!node || typeof node !== 'object') continue;
      if (!('@context' in node)) errors.push(`${rel} [block ${i}]: missing @context`);
      if (!('@type' in node) && !('@graph' in node))
        errors.push(`${rel} [block ${i}]: missing @type (and no @graph)`);
    }
  }
}

if (!existsSync(ROOT)) {
  console.error(`❌ verify-jsonld: ${ROOT} not found — run the build first.`);
  process.exit(1);
}

walk(ROOT);

console.log(`[verify-jsonld] scanned ${files} HTML file(s), ${blocks} JSON-LD block(s) in ${ROOT}`);

if (errors.length) {
  console.error(`\n❌ verify-jsonld: ${errors.length} error(s) — refusing to ship broken structured data:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('[verify-jsonld] OK — all built JSON-LD parses');
