#!/usr/bin/env node
/**
 * build-lien-dataset.mjs — deterministically extract the 50-state lien-deadline
 * tables from src/content/blog/construction-lien-deadlines-cheat-sheet.ts into
 * a structured JSON. VERBATIM only — never invents or approximates a value.
 * Any row that doesn't parse cleanly is skipped (logged), never guessed.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.cwd(), "src/content/blog/construction-lien-deadlines-cheat-sheet.ts");
const raw = readFileSync(SRC, "utf8");

// Pull metadata + the markdown `content` template literal (content is the last field).
const updatedAt = (raw.match(/updatedAt:\s*"([^"]+)"/) || [])[1] || "2026-07-21";
const sourceSlug = (raw.match(/slug:\s*"([^"]+)"/) || [])[1] || "construction-lien-deadlines-cheat-sheet-2026";
const contentMatch = raw.match(/content:\s*`([\s\S]*?)`\s*,/);
if (!contentMatch) { console.error("FAIL: could not locate the markdown content block. Not writing."); process.exit(1); }
const md = contentMatch[1];

const US_STATES = new Set(["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","Washington DC","West Virginia","Wisconsin","Wyoming"]);

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
