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

// Section header -> canonical key.
//
// `inverted` marks the two tables that are laid out the OTHER way round from
// the preliminary-notice one: their first column is a deadline bucket
// ("30-60 days", "2 years") and their second column is a comma-separated list
// of the states in that bucket. Keyed by column 0 they yield zero states, which
// is why both sections silently produced nothing and 2 of the 3 "critical
// dates" never reached the per-state pages. See invertSection() below.
const SECTIONS = [
  { key: "preliminaryNotice", label: "Preliminary Notice", header: /^##\s+Preliminary notice deadlines by state/im },
  { key: "lienFiling",        label: "Lien Filing",        header: /^##\s+Lien filing deadlines by state/im, inverted: true },
  { key: "enforcement",       label: "Lien Enforcement",   header: /^##\s+Lien enforcement deadlines by state/im, inverted: true },
];

const clean = (s) => s.replace(/\*\*/g, "").replace(/`/g, "").trim();

function parseSection(md, headerRe) {
  const m = md.match(headerRe);
  if (!m) return null;
  const start = m.index + m[0].length;
  const rest = md.slice(start);
  const lines = rest.split("\n");
  const rows = {}; const dataRows = []; let headers = null;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("##")) break;                 // next section
    if (!t.startsWith("|")) { if (headers && dataRows.length) break; else continue; }
    const cells = t.split("|").slice(1, -1).map(clean);
    if (cells.every((c) => /^-{2,}:?$|^:?-{2,}$/.test(c.replace(/\s/g, "")) || c === "")) continue; // separator
    if (!headers) { headers = cells; continue; }   // header row
    dataRows.push(cells);
    const state = cells[0];
    if (US_STATES.has(state)) rows[state] = cells;
  }
  return headers ? { headers, rows, dataRows } : null;
}

// Split "Alaska (30 days), Oregon (30 days after written demand)" on the
// top-level commas only, so a comma inside a parenthetical can never split an
// entry in half.
function splitTopLevel(list) {
  const out = []; let buf = ""; let depth = 0;
  for (const ch of list) {
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) { out.push(buf); buf = ""; continue; }
    buf += ch;
  }
  if (buf.trim()) out.push(buf);
  return out.map((s) => s.trim()).filter(Boolean);
}

// Turn a bucket-keyed table into per-state rows. VERBATIM only: a state's
// deadline is its own parenthetical when the source gives one, otherwise the
// bucket label exactly as written. Nothing is normalised, averaged or resolved
// — "30/60 days" and "15th of 4th month" pass through untouched, and anything
// that doesn't resolve to exactly one known state is dropped and logged.
function invertSection(parsed, label) {
  const rows = {}; const seen = new Map(); const skipped = [];
  for (const cells of parsed.dataRows) {
    const bucket = cells[0];
    const list = cells[1] || "";
    if (!bucket || !list) { skipped.push(`empty row`); continue; }
    for (const entry of splitTopLevel(list)) {
      const m = entry.match(/^(.+?)\s*\((.+)\)\s*$/);
      const name = clean(m ? m[1] : entry);
      const detail = m ? clean(m[2]) : null;
      if (!US_STATES.has(name)) { skipped.push(entry); continue; }
      // A parenthetical only overrides the bucket when it is itself a concrete
      // deadline. "New York (longest in nation)" is an editorial aside, not a
      // filing window — treating it as one would print "Lien Filing Deadline:
      // longest in nation". Require a digit; otherwise the bucket label stands
      // and the aside is carried as a note.
      const isDeadline = detail !== null && /\d/.test(detail);
      // A state landing in two buckets is ambiguous — omit it rather than
      // pick a winner.
      if (seen.has(name)) {
        skipped.push(`${name} (appears in both "${seen.get(name)}" and "${bucket}" — omitted as ambiguous)`);
        delete rows[name];
        continue;
      }
      seen.set(name, bucket);
      rows[name] = isDeadline ? [name, detail] : (detail ? [name, bucket, detail] : [name, bucket]);
    }
  }
  if (skipped.length) console.log(`    ${label}: omitted ${skipped.length} unresolvable entr(y/ies): ${skipped.slice(0, 4).join("; ")}${skipped.length > 4 ? " …" : ""}`);
  return { headers: ["State", `${label} Deadline`, "Note"], rows };
}

const sections = [];
for (const s of SECTIONS) {
  const parsed = parseSection(md, s.header);
  if (!parsed) { console.warn(`  (section not found: ${s.label})`); continue; }
  const { headers, rows } = s.inverted ? invertSection(parsed, s.label) : parsed;
  sections.push({ key: s.key, label: s.label, headers, rows });
  console.log(`  ${s.label}: ${Object.keys(rows).length} states parsed`);
}

// Legal-integrity gate: every deadline string we emit must appear verbatim in
// the source markdown. Catches any future edit that starts synthesising values.
{
  const violations = [];
  for (const s of sections) {
    for (const [state, cells] of Object.entries(s.rows)) {
      for (const cell of cells.slice(1)) {
        if (cell && !md.includes(cell)) violations.push(`${s.label}/${state}: "${cell}" not found verbatim in source`);
      }
    }
  }
  if (violations.length) {
    console.error(`FAIL: ${violations.length} value(s) not traceable to source. Refusing to write.`);
    for (const v of violations.slice(0, 10)) console.error(`  - ${v}`);
    process.exit(1);
  }
  console.log(`  ✓ legal-integrity: every emitted deadline traces verbatim to source`);
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
