/**
 * Parse-check every inline <script> in the site's HTML.
 *
 * Why this exists: the homepage PostHog loader is a hand-maintained one-liner in
 * index.html. It has now been broken TWICE by a single dropped ")" — c4e01c1
 * fixed it, then 0f7afe0 (an unrelated canonical/sitemap sweep that rewrote the
 * snippet into a lazy loader) reintroduced it. Both times the page still rendered
 * fine and the build still passed; the only symptom was analytics silently
 * flatlining, which took days to notice.
 *
 * A SyntaxError in an inline <script> is invisible to Vite (it never parses the
 * HTML template's inline scripts) and to the prerenderer (it copies the template
 * byte-for-byte into all 41 routes). This gate is the thing that fails the build.
 *
 * Usage: node scripts/verify-inline-scripts.mjs [dir ...]   (default: repo root)
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set(['node_modules', '.git', '.vercel']);

// <script> types that are data, not JavaScript. Everything else — including a
// missing type attribute, the case that matters here — gets parse-checked.
const NON_JS_TYPES = /^(application\/(ld\+)?json|text\/(template|html|x-template)|application\/xml)$/i;

function collectHtml(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      collectHtml(path.join(dir, e.name), out);
    } else if (e.isFile() && e.name.endsWith('.html')) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

/** Line number of a character offset, for a clickable error location. */
function lineOf(text, offset) {
  return text.slice(0, offset).split('\n').length;
}

const targets = process.argv.slice(2);
// Default target is the repo root minus dist/ — dist is checked as its own
// explicit target after the build, so the pre-build pass stays fast.
const roots = targets.length
  ? targets.map((t) => path.resolve(repoRoot, t))
  : [repoRoot];
const excludeDist = targets.length === 0;

const files = [];
for (const root of roots) {
  if (!fs.existsSync(root)) {
    console.error(`❌ verify-inline-scripts: no such path: ${root}`);
    process.exit(1);
  }
  for (const f of collectHtml(root)) {
    if (excludeDist && f.startsWith(path.join(repoRoot, 'dist') + path.sep)) continue;
    files.push(f);
  }
}

const TAG_RE = /<script([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const failures = [];
let checked = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8');
  TAG_RE.lastIndex = 0;
  let m;
  while ((m = TAG_RE.exec(html)) !== null) {
    const [, attrs, body] = m;
    if (/\bsrc\s*=/i.test(attrs)) continue; // external script, nothing inline to parse
    if (!body.trim()) continue;

    const typeMatch = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i);
    const type = typeMatch ? typeMatch[1].trim() : '';
    if (type && NON_JS_TYPES.test(type)) continue;

    checked++;
    try {
      // Compiles (and therefore parses) without executing. Same syntax check
      // `node --check` performs, without spawning a process per script.
      new vm.Script(body, { filename: file });
    } catch (err) {
      failures.push({
        file: path.relative(repoRoot, file),
        line: lineOf(html, m.index),
        message: err.message,
        preview: body.trim().slice(0, 120).replace(/\s+/g, ' '),
      });
    }
  }
}

if (failures.length) {
  console.error(`\n❌ Inline <script> syntax errors (${failures.length}):\n`);
  for (const f of failures) {
    console.error(`   ${f.file}:${f.line}`);
    console.error(`      ${f.message}`);
    console.error(`      ${f.preview}…\n`);
  }
  console.error('A SyntaxError here silently kills everything in that script tag');
  console.error('(analytics, consent, capture) while the page still renders. Fix before deploy.\n');
  process.exit(1);
}

console.log(`✅ Inline scripts OK: ${checked} parsed across ${files.length} HTML files`);
