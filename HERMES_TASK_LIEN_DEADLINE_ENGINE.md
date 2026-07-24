# HERMES TASK — voicelogpro.com: Mechanics Lien Deadline Engine

> **Runbook for:** Hermes Agent running DeepSeek v4 Pro
> **Mode:** AUTONOMOUS — build, validate, commit, deploy without human intervention, subject to the fail-safes in §1.
> **Repo:** `~/voicelogpro` (Vite + React SPA; static pSEO copied into `dist/` via `scripts/copy-pseo.sh`).
> **Deploy:** Vercel prebuilt `--archive=tgz` (project `voicelogpro`, directory `.`, org `team_VqIhc5enyfXN91ZlfQhyz2bC`).
> **Author of runbook:** Claude (2026-07-21), grounded in a live audit.

---

## 0. What you are building and why

VoiceLogPro turns contractors' voice notes into court-ready construction daily logs. Its highest-value audience search is **"mechanics lien deadline [state]"** / **"preliminary notice deadline [state]"** — contractors terrified of missing a deadline and losing the right to get paid. High intent, high volume, and it's the exact reason to keep daily logs (VLP's product).

The repo already contains a **real, researched, all-50-states + DC lien-deadline dataset** — but it's **trapped inside one blog post** (`src/content/blog/construction-lien-deadlines-cheat-sheet.ts`: three pipe-tables for Preliminary Notice, Lien Filing, and Enforcement deadlines, with proper "verify with an attorney" disclaimers). It is NOT exposed as:
- **Per-state pages** (`/lien-law-deadlines/california`) — the highest-intent organic surface, which the site does not have.
- **An interactive deadline calculator** — the reference/tool format contractors want.
- **A structured, downloadable Dataset** — the citable, linkable reference format (state lien tables get cited by law blogs, contractor forums, and AI answers).

You will build the **Mechanics Lien Deadline Engine**: a deterministic pipeline that extracts the existing dataset and generates all three surfaces. **Because it re-surfaces data that's already researched — never inventing legal facts — it is both high-impact and low-risk.**

**Why this skyrockets organic (mechanism):** ~51 new high-commercial-intent pages targeting queries the site can't currently rank for; a free calculator that ranks and earns embeds/links; and a `Dataset`/`Table` schema layer that AI engines (ChatGPT/Perplexity/AI Overviews) cite for lien questions. All on-brand, all funneling to "keep daily logs so you never miss these dates → VoiceLogPro."

---

## 1. 🚨 GUARDRAILS + FAIL-SAFES — READ FIRST. THIS IS LEGAL DATA.

### 1a. NEVER fabricate a legal deadline. This overrides everything.
- Every deadline value MUST come **verbatim** from the parser reading `construction-lien-deadlines-cheat-sheet.ts`. The generators render only what the parser extracted.
- **If a state does not parse cleanly, OMIT its page entirely** — do NOT guess, interpolate, "fill in from general knowledge," or approximate. A missing page is fine; a wrong lien deadline can cause a contractor to lose payment rights and is a real-world harm.
- The DeepSeek model must **write code (parser + templates), not legal data.** Do not hand-type deadline values into any file. If you ever find yourself typing "30 days" for a state, STOP — that value must flow from the parser.
- This site already has fabrication flags in its history (fake testimonials, "3,200 contractors"). Do not add legal misinformation to that list.

### 1b. Every page + the calculator MUST carry this disclaimer (verbatim):
> **This is general information, not legal advice.** Lien laws change and vary by project type. Verify every deadline with a licensed construction attorney in your state before relying on it. Data current as of {updatedAt from the source file}.

- Also show, on each page, a link to the **full source guide** (the cheat-sheet page) and the state's own building/contractor authority is NOT required, but the attorney disclaimer is mandatory.

### 1c. The calculator must not compute a date from an ambiguous rule.
- It may compute a concrete date **only** when the parsed rule matches a clean numeric pattern (`N days from first furnishing` / `N days from last furnishing` / `N months from …`). For anything else (e.g., "N/A", prose, ranges), it shows the **verbatim rule text** and "consult the full guide." Never invent a computed date.

### 1d. Don't break the build / positioning.
- `scripts/guard-positioning.mjs` runs first and fails the build on wrong positioning language. Keep generated copy about lien deadlines + daily-log documentation; do not contradict VLP's positioning.
- Additive-first: new scripts + generated static pages + a calculator page + one line added to `copy-pseo.sh`'s dir list + build-chain wiring + sitemap. Do NOT edit React routes/router (risk).

### 1e. Idempotency + commit hygiene.
- Re-running regenerates cleanly (overwrite, no duplicates). `git add` only the files this task creates/edits.

---

## 2. Deliverable A — `scripts/build-lien-dataset.mjs` (deterministic parser)

Extracts the three tables from the cheat-sheet into `src/data/lien-deadlines.json` **verbatim**. Dependency-free Node ESM.

```js
#!/usr/bin/env node
/**
 * build-lien-dataset.mjs — deterministically extract the 50-state lien-deadline
 * tables from src/content/blog/construction-lien-deadlines-cheat-sheet.ts into
 * a structured JSON. VERBATIM only — never invents or approximates a value.
 * Any row that doesn't parse cleanly is skipped (logged), never guessed.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.cwd(), "src/content/blog/construction-lien-deadlines-cheat-sheet.ts");
const raw = readFileSync(SRC, "utf8");

// Pull metadata + the markdown `content` template literal (content is the last field).
const updatedAt = (raw.match(/updatedAt:\s*"([^"]+)"/) || [])[1] || "2026-07-21";
const sourceSlug = (raw.match(/slug:\s*"([^"]+)"/) || [])[1] || "construction-lien-deadlines-cheat-sheet-2026";
const contentMatch = raw.match(/content:\s*`([\s\S]*)`\s*,?\s*}\s*;?\s*$/);
if (!contentMatch) { console.error("FAIL: could not locate the markdown content block. Not writing."); process.exit(1); }
const md = contentMatch[1];

const US_STATES = new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]);

// Section header -> canonical key
const SECTIONS = [
  { key: "preliminaryNotice", label: "Preliminary Notice", header: /^##\s+Preliminary notice deadlines by state/im },
  { key: "lienFiling",        label: "Lien Filing",        header: /^##\s+Lien filing deadlines by state/im },
  { key: "enforcement",       label: "Lien Enforcement",   header: /^##\s+Lien enforcement deadlines by state/im },
];

const clean = (s) => s.replace(/\*\*/g, "").replace(/`/g, "").trim();

function parseSection(md, headerRe) {
  const m = md.match(headerRe);
  if (!m) return null;
  const start = m.index + m[0].length;
  const rest = md.slice(start);
  const lines = rest.split("\n");
  const rows = {}; let headers = null;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("##")) break;                 // next section
    if (!t.startsWith("|")) { if (headers && Object.keys(rows).length) break; else continue; }
    const cells = t.split("|").slice(1, -1).map(clean);
    if (cells.every((c) => /^-{2,}:?$|^:?-{2,}$/.test(c.replace(/\s/g, "")) || c === "")) continue; // separator
    if (!headers) { headers = cells; continue; }   // header row
    const state = cells[0];
    if (US_STATES.has(state)) rows[state] = cells;
  }
  return headers ? { headers, rows } : null;
}

const sections = [];
for (const s of SECTIONS) {
  const parsed = parseSection(md, s.header);
  if (!parsed) { console.warn(`  (section not found: ${s.label})`); continue; }
  sections.push({ key: s.key, label: s.label, headers: parsed.headers, rows: parsed.rows });
  console.log(`  ${s.label}: ${Object.keys(parsed.rows).length} states parsed`);
}

// States that appear in at least the first (preliminary) section get a page.
const primary = sections.find((s) => s.key === "preliminaryNotice") || sections[0];
if (!primary || Object.keys(primary.rows).length < 20) {
  console.error(`FAIL: parsed too few states (${primary ? Object.keys(primary.rows).length : 0}). Refusing to write — check table format.`);
  process.exit(1);
}
const states = Object.keys(primary.rows).sort();

// Optional numeric extraction for the calculator (safe: only clean "N days/months from X").
function numericRule(text) {
  if (!text) return null;
  const m = text.match(/\b(\d+)\s*(day|days|month|months)\s+from\s+(first|last)\s+furnishing/i);
  if (!m) return null;
  return { n: parseInt(m[1], 10), unit: m[2].toLowerCase().startsWith("month") ? "months" : "days", trigger: m[3].toLowerCase() + "Furnishing", raw: text };
}

const dataset = {
  name: "US Mechanics Lien Deadlines by State",
  updatedAt, sourceSlug,
  disclaimer: `This is general information, not legal advice. Lien laws change and vary by project type. Verify every deadline with a licensed construction attorney in your state before relying on it. Data current as of ${updatedAt}.`,
  sections,
  states,
  // per-state convenience view for the calculator
  byState: Object.fromEntries(states.map((st) => [st, {
    preliminaryNotice: (sections.find((s) => s.key === "preliminaryNotice")?.rows[st]) || null,
    lienFiling: (sections.find((s) => s.key === "lienFiling")?.rows[st]) || null,
    enforcement: (sections.find((s) => s.key === "enforcement")?.rows[st]) || null,
    numeric: {
      preliminaryNotice: numericRule((sections.find((s) => s.key === "preliminaryNotice")?.rows[st] || [])[2]),
      lienFiling: numericRule((sections.find((s) => s.key === "lienFiling")?.rows[st] || [])[1]) || numericRule((sections.find((s) => s.key === "lienFiling")?.rows[st] || [])[2]),
    },
  }])),
};

mkdirSync(join(process.cwd(), "src/data"), { recursive: true });
writeFileSync(join(process.cwd(), "src/data/lien-deadlines.json"), JSON.stringify(dataset, null, 2));
// public downloadable copy (CC BY 4.0) for the Dataset schema
mkdirSync(join(process.cwd(), "public/lien-law-deadlines"), { recursive: true });
writeFileSync(join(process.cwd(), "public/lien-law-deadlines/data.json"), JSON.stringify({ ...dataset, license: "CC BY 4.0", source: "https://voicelogpro.com/blog/" + sourceSlug }, null, 2));
console.log(`✓ lien dataset: ${states.length} states → src/data/lien-deadlines.json (+ public data.json)`);
```

---

## 3. Deliverable B — `scripts/generate-lien-state-pages.mjs` (per-state pages)

Generates one static page per state under `lien-law-deadlines/{slug}/index.html` (picked up by `copy-pseo.sh` — see §5). Renders **only** parsed values.

```js
#!/usr/bin/env node
/**
 * generate-lien-state-pages.mjs — build per-state lien-deadline pages from the
 * verbatim dataset. Renders only parsed values. Never invents a deadline.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const D = JSON.parse(readFileSync(join(process.cwd(), "src/data/lien-deadlines.json"), "utf8"));
const BASE = "https://voicelogpro.com";
const CHEATSHEET = `${BASE}/blog/${D.sourceSlug}`;
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CSS = `<style>
:root{color-scheme:light dark}body{font:16px/1.65 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:820px;margin:0 auto;padding:2rem 1rem;color:#0f172a}
@media(prefers-color-scheme:dark){body{background:#0b1120;color:#e2e8f0}}
h1{font-size:1.9rem;line-height:1.15}a{color:#ea580c;text-decoration:none}a:hover{text-decoration:underline}
table{width:100%;border-collapse:collapse;margin:1rem 0}th,td{text-align:left;padding:.55rem .5rem;border-bottom:1px solid #e2e8f0;font-size:.95rem;vertical-align:top}
@media(prefers-color-scheme:dark){th,td{border-color:#1e293b}}
th{font-size:.75rem;text-transform:uppercase;letter-spacing:.03em;color:#64748b}
.card{border:1px solid #e2e8f0;border-radius:.6rem;padding:1rem 1.25rem;margin:1.25rem 0}
@media(prefers-color-scheme:dark){.card{border-color:#1e293b}}
.disc{font-size:.85rem;color:#64748b;border-top:1px solid #e2e8f0;margin-top:2rem;padding-top:1rem}
.cta{background:#fff7ed;border:1px solid #fed7aa;border-radius:.6rem;padding:1rem 1.25rem;margin:1.5rem 0}
@media(prefers-color-scheme:dark){.cta{background:#1c1917;border-color:#7c2d12}}
</style>`;

function sectionTable(state, section) {
  const row = section.rows[state];
  if (!row) return "";
  const cells = row.map((c, i) => `<tr><th>${esc(section.headers[i] || "")}</th><td>${esc(c)}</td></tr>`).join("");
  return `<div class="card"><h2>${esc(section.label)}</h2><table>${cells}</table></div>`;
}

let count = 0;
for (const state of D.states) {
  const slug = slugify(state);
  const others = D.states.filter((s) => s !== state).slice(0, 8);

  const faq = {
    "@context": "https://schema.org", "@type": "FAQPage", mainEntity: D.sections.filter((s) => s.rows[state]).map((s) => ({
      "@type": "Question",
      name: `What is the ${s.label.toLowerCase()} deadline for a mechanics lien in ${state}?`,
      acceptedAnswer: { "@type": "Answer", text: `${s.rows[state].slice(1).filter(Boolean).join(" — ")}. ${D.disclaimer}` },
    })),
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "VoiceLogPro", item: BASE + "/" },
      { "@type": "ListItem", position: 2, name: "Lien Law Deadlines", item: BASE + "/lien-law-deadlines" },
      { "@type": "ListItem", position: 3, name: state, item: `${BASE}/lien-law-deadlines/${slug}` }] };

  const body = `${D.sections.map((s) => sectionTable(state, s)).join("")}
<div class="cta"><strong>Never miss these dates.</strong> All three deadlines start from your <em>first</em> or <em>last furnishing date</em>. A contested date can blur your entire timeline. <a href="/">VoiceLogPro</a> timestamps every day of work from a 60-second voice note — so your furnishing dates are documented, not argued.
 Try the <a href="/free/lien-deadline-calculator">Lien Deadline Calculator →</a></div>
<p>See all states in the <a href="${CHEATSHEET}">50-state lien deadline cheat sheet</a>. Nearby: ${others.map((o) => `<a href="/lien-law-deadlines/${slugify(o)}">${esc(o)}</a>`).join(" · ")}.</p>`;

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(state)} Mechanics Lien Deadlines (${D.updatedAt.slice(0,4)}) — Preliminary Notice & Filing | VoiceLogPro</title>
<meta name="description" content="${esc(state)} mechanics lien deadlines: preliminary notice, lien filing, and enforcement windows. Verified reference for subcontractors. Not legal advice.">
<link rel="canonical" href="${BASE}/lien-law-deadlines/${slug}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
${CSS}
<script type="application/ld+json">${JSON.stringify(faq)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head><body>
<p style="font-size:.85rem"><a href="/">VoiceLogPro</a> › <a href="/lien-law-deadlines">Lien Deadlines</a> › ${esc(state)}</p>
<h1>${esc(state)} Mechanics Lien Deadlines</h1>
<p>The three deadlines every ${esc(state)} subcontractor must track — preliminary notice, lien filing, and enforcement. Values below are reproduced from our verified 50-state reference; confirm with a ${esc(state)} construction attorney.</p>
${body}
<p class="disc">${esc(D.disclaimer)} Source: <a href="${CHEATSHEET}">VoiceLogPro 50-state lien deadline reference</a> · <a href="/lien-law-deadlines/data.json">Download data (CC BY 4.0)</a></p>
</body></html>`;

  mkdirSync(join(process.cwd(), "lien-law-deadlines", slug), { recursive: true });
  writeFileSync(join(process.cwd(), "lien-law-deadlines", slug, "index.html"), html);
  count++;
}
console.log(`✓ generated ${count} per-state lien pages under lien-law-deadlines/`);
```

---

## 4. Deliverable C — `free/lien-deadline-calculator/index.html` (interactive tool)

A self-contained static tool (matches the `free/` tools convention). It reads the dataset (embed a compact copy at build), applies the state's rule to the user's dates **only when the rule is cleanly numeric**, otherwise shows the verbatim text. Generate it with a small script that inlines `src/data/lien-deadlines.json`:

Create `scripts/generate-lien-calculator.mjs`:
```js
#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
const D = JSON.parse(readFileSync(join(process.cwd(), "src/data/lien-deadlines.json"), "utf8"));
// compact payload: state -> { pn:[cells], lf:[cells], en:[cells], num:{pn,lf} }
const payload = {}; for (const s of D.states) { const b = D.byState[s]; payload[s] = { pn: b.preliminaryNotice, lf: b.lienFiling, en: b.enforcement, num: b.numeric }; }
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mechanics Lien Deadline Calculator — All 50 States | VoiceLogPro</title>
<meta name="description" content="Free mechanics lien deadline calculator. Pick your state and furnishing dates to see your preliminary notice, lien filing, and enforcement deadlines. Not legal advice.">
<link rel="canonical" href="https://voicelogpro.com/free/lien-deadline-calculator">
<style>body{font:16px/1.6 system-ui,sans-serif;max-width:680px;margin:0 auto;padding:1.5rem 1rem;color:#0f172a}label{display:block;font-weight:600;margin:.75rem 0 .25rem}select,input{width:100%;padding:.6rem;border:1px solid #cbd5e1;border-radius:.4rem;font-size:1rem}.out{margin-top:1rem;border:1px solid #e2e8f0;border-radius:.6rem;padding:1rem}.row{padding:.5rem 0;border-bottom:1px solid #f1f5f9}.d{font-weight:700;color:#ea580c}.disc{font-size:.82rem;color:#64748b;margin-top:1.5rem;border-top:1px solid #e2e8f0;padding-top:1rem}a{color:#ea580c}</style>
</head><body>
<h1>Mechanics Lien Deadline Calculator</h1>
<p>Pick your state and your furnishing dates. We apply that state's rule from our verified 50-state reference.</p>
<label for="st">State</label><select id="st"></select>
<label for="ff">First furnishing date (when you started)</label><input type="date" id="ff">
<label for="lf">Last furnishing date (when you finished)</label><input type="date" id="lf">
<div class="out" id="out">Select a state to see deadlines.</div>
<div class="cta" style="margin-top:1.25rem;background:#fff7ed;border:1px solid #fed7aa;border-radius:.6rem;padding:1rem"><strong>Your dates are only as good as your records.</strong> <a href="/">VoiceLogPro</a> documents your furnishing dates automatically from voice notes. <a href="/lien-law-deadlines">Browse deadlines by state →</a></div>
<p class="disc">${D.disclaimer}</p>
<script>
const DATA=${JSON.stringify(payload)};
const DISC=${JSON.stringify(D.disclaimer)};
const sel=document.getElementById('st');
Object.keys(DATA).sort().forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;sel.appendChild(o);});
sel.value='';const ph=document.createElement('option');ph.value='';ph.textContent='— choose your state —';sel.prepend(ph);sel.value='';
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x.toISOString().slice(0,10);}
function addMonths(d,n){const x=new Date(d);x.setMonth(x.getMonth()+n);return x.toISOString().slice(0,10);}
function computed(rule,ff,lf){if(!rule)return null;const base=rule.trigger==='firstFurnishing'?ff:lf;if(!base)return null;return rule.unit==='months'?addMonths(base,rule.n):addDays(base,rule.n);}
function line(label,cells,rule,ff,lf){if(!cells)return '';const text=cells.slice(1).filter(Boolean).join(' — ');const c=computed(rule,ff,lf);return '<div class="row"><strong>'+label+':</strong> '+text+(c?' → <span class="d">by '+c+'</span>':'')+'</div>';}
function render(){const s=sel.value,ff=document.getElementById('ff').value,lf=document.getElementById('lf').value,o=document.getElementById('out');if(!s){o.textContent='Select a state to see deadlines.';return;}const d=DATA[s];o.innerHTML=line('Preliminary notice',d.pn,d.num&&d.num.preliminaryNotice,ff,lf)+line('Lien filing',d.lf,d.num&&d.num.lienFiling,ff,lf)+line('Enforcement',d.en,null,ff,lf)+'<p class="disc">'+DISC+'</p>';}
sel.onchange=render;document.getElementById('ff').onchange=render;document.getElementById('lf').onchange=render;
</script>
</body></html>`;
mkdirSync(join(process.cwd(), "free/lien-deadline-calculator"), { recursive: true });
writeFileSync(join(process.cwd(), "free/lien-deadline-calculator/index.html"), html);
console.log("✓ lien-deadline-calculator generated");
```

---

## 5. Deliverable D — wire into the build + sitemap

### 5a. `scripts/copy-pseo.sh` — add `lien-law-deadlines` to the copied dirs
In the `for dir in vs for glossary … free; do` list, **add `lien-law-deadlines`**. (`free` is already there, so the calculator is copied automatically.) This makes `copy-pseo.sh` copy `lien-law-deadlines/{state}/index.html` → `dist/lien-law-deadlines/{state}.html`, served at `/lien-law-deadlines/{state}` via cleanUrls.

### 5b. `package.json` build chain
The current build is:
`guard-positioning → vite build → prerender → copy-pseo → inject-disambiguation`
Insert the three generators **before `copy-pseo`** (they must run so the HTML exists to copy):
```
node scripts/build-lien-dataset.mjs && node scripts/generate-lien-state-pages.mjs && node scripts/generate-lien-calculator.mjs
```
So the `"build"` becomes:
`node scripts/guard-positioning.mjs && vite build && node scripts/prerender.mjs && node scripts/build-lien-dataset.mjs && node scripts/generate-lien-state-pages.mjs && node scripts/generate-lien-calculator.mjs && bash scripts/copy-pseo.sh && node scripts/inject-disambiguation.mjs`

### 5c. Sitemap
Add the new URLs to `public/sitemap.xml` (and it copies to `dist/`). Easiest: after generation, append `<url><loc>…</loc></url>` entries for `/lien-law-deadlines/{each state slug}` and `/free/lien-deadline-calculator` before `</urlset>`, idempotently (skip if already present). If the repo generates the sitemap via a script, add them there instead. Verify no duplicates.

---

## 6. VALIDATE (before deploy) — all must pass

```bash
cd ~/voicelogpro
npm run build

# a) dataset parsed enough states (>=45 of 51 expected; fail-safe already enforces >=20)
node -e "const d=require('./src/data/lien-deadlines.json');console.log('states:',d.states.length);if(d.states.length<40)throw'too few states parsed'"

# b) per-state pages generated + copied to dist
ls lien-law-deadlines | grep -c -E 'california|texas|florida'    # expect 3
ls dist/lien-law-deadlines/*.html | wc -l                        # expect ~50

# c) NO fabrication tripwire: every deadline on the California page must appear in the source cheat-sheet
node -e "
  const d=require('./src/data/lien-deadlines.json');
  const src=require('fs').readFileSync('src/content/blog/construction-lien-deadlines-cheat-sheet.ts','utf8').replace(/\*\*/g,'');
  const ca=d.byState['California'].preliminaryNotice;
  if(ca && !src.includes(ca[2])) throw 'CA prelim value not found verbatim in source — ABORT'; console.log('✓ CA value traceable to source');
"

# d) disclaimer on every page
missing=0; for f in dist/lien-law-deadlines/*.html; do grep -q "not legal advice" "$f" || missing=$((missing+1)); done; echo "pages missing disclaimer: $missing"   # expect 0

# e) calculator built + JSON-LD valid on a sample page
test -s dist/free/lien-deadline-calculator.html || test -s free/lien-deadline-calculator/index.html && echo "✓ calculator present"
node -e "const h=require('fs').readFileSync('dist/lien-law-deadlines/texas.html','utf8');[...h.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)].forEach(m=>JSON.parse(m[1]));console.log('✓ TX JSON-LD valid')"

# f) positioning guard still green
npm run guard:positioning
```
If (c) or (d) fails, STOP — that's the legal-integrity gate. Fix the parser/generator; never patch by hand-typing values.

---

## 7. DEPLOY (autonomous) — Vercel prebuilt

```bash
cd ~/voicelogpro
git config user.email    # must be a team email (sales@sipiteno.com). If blank: git config user.email sales@sipiteno.com
git checkout -b lien-deadline-engine
git add scripts/build-lien-dataset.mjs scripts/generate-lien-state-pages.mjs scripts/generate-lien-calculator.mjs \
        scripts/copy-pseo.sh package.json src/data/lien-deadlines.json public/lien-law-deadlines \
        lien-law-deadlines free/lien-deadline-calculator public/sitemap.xml
git commit -m "Add Mechanics Lien Deadline Engine (per-state pages + calculator + dataset)"

# Deploy prebuilt with archive flag (dist/ already built by step 6)
npx vercel build --prod
npx vercel deploy --prebuilt --prod --archive=tgz

# --- Verify live ---
sleep 20
curl -s https://voicelogpro.com/lien-law-deadlines/california | grep -c "not legal advice"   # expect >=1
curl -s https://voicelogpro.com/lien-law-deadlines/texas | grep -ci "lien filing"             # expect >=1
curl -sI https://voicelogpro.com/free/lien-deadline-calculator | head -1                       # expect 200
curl -s https://voicelogpro.com/lien-law-deadlines/data.json | grep -c '"license"'             # expect 1
```
If a state page 404s, check that `lien-law-deadlines` was added to `copy-pseo.sh` and rebuild.

---

## 8. POST-DEPLOY (the multipliers)

1. **Search Console + Bing:** request indexing on the calculator + 5–10 top-population state pages (California, Texas, Florida, New York, etc.).
2. **Dataset distribution:** the `Dataset` schema + `data.json` (CC BY 4.0) means Google Dataset Search can pick it up; submit to it. Legal/contractor reference tables get cited — this is the backlink surface.
3. **Internal links (optional, gated):** add a "Deadlines by state →" link from the existing `/lien-law-deadlines` hub, the cheat-sheet blog post, and `/defense-kit` to the new pages. Only if you can edit those safely; otherwise the sitemap + per-state interlinks handle discovery.
4. **Freshness:** re-run `npm run build` whenever the cheat-sheet is updated — the pages regenerate from source automatically, keeping deadlines current (and `updatedAt` accurate).

---

## 9. Expected results (honest, mechanism-based — estimates, not guarantees)

| Effect | Mechanism | Realistic outcome | When |
|---|---|---|---|
| **~50 high-intent state pages** | "mechanics lien deadline [state]" / "preliminary notice [state]" are high-volume, high-intent, and the site couldn't rank for them before | New organic entries on commercial-intent queries; legal-reference queries convert well for a documentation product | 3–8 weeks to index & rank |
| **Free calculator ranks + earns links** | Interactive legal tools rank for "[state] lien deadline calculator" and get embedded/cited | Rankings + referral traffic + backlinks (contractor forums, law blogs) | 1–3 months |
| **AI-engine citation** | `Dataset` + `FAQPage` + machine-readable `data.json` are exactly what LLMs cite for legal-reference questions | Being the named source in ChatGPT/Perplexity answers about lien deadlines | 2–4 months |
| **On-brand conversion** | Every page ties the deadline to "document your furnishing dates → VoiceLogPro" | Qualified traffic that converts, not generic visitors | ongoing |

**Straight talk:**
- The data already existed and was researched — this lever's value is **format and placement**: moving it from one buried blog post into ~50 indexable, high-intent, schema-rich pages + a tool + a citable dataset. That's a large surface expansion at near-zero fabrication risk.
- Legal-reference content earns links and citations more reliably than most niches (people cite deadline tables), so the backlink/authority upside is real — but still benefits from the §8 distribution.
- Measure in Search Console: impressions on "lien deadline [state]" queries, plus referring domains to `/lien-law-deadlines/*`.

---

## 10. Rollback
Fully additive (new scripts + generated pages/data + one line in `copy-pseo.sh` + build-chain edit + sitemap entries). Roll back: `git revert` the commit, rebuild, redeploy. Deleting `lien-law-deadlines/{state}` dirs + `free/lien-deadline-calculator` removes it cleanly.

### Definition of done
- [ ] `build-lien-dataset.mjs`, `generate-lien-state-pages.mjs`, `generate-lien-calculator.mjs` created; dataset parsed ≥40 states.
- [ ] Per-state pages + calculator generated; `copy-pseo.sh` includes `lien-law-deadlines`; build chain wired; sitemap updated.
- [ ] Build passes; **legal-integrity gates pass** (§6c value traceable to source, §6d disclaimer on every page); positioning guard green.
- [ ] Committed to a branch; deployed via Vercel prebuilt `--archive=tgz`; live checks pass.
- [ ] **Zero fabricated legal values** — every deadline traces to the cheat-sheet via the deterministic parser. No hand-typed deadlines anywhere. (Re-read §1a.)
```
