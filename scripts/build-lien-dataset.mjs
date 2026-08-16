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

// ── Verified statute references ──────────────────────────────────────────────
// Rendered on each state page as "Statute: <citation> — official text".
// ONLY states whose official source URL was content-verified to actually serve
// the cited chapter appear here. A wrong citation on lien deadlines is worse
// than none, so unverified states are omitted and the page renders no statute
// line at all. Verification = fetch the URL and confirm the page really
// contains the chapter (a 200 is NOT sufficient: statutes.capitol.texas.gov
// returns 200 with zero "lien" mentions over curl because it is JS-rendered —
// Texas below was confirmed in a real browser, 246 lien mentions, §53.052).
// To add a state: verify first, then add it here — NOT to the generated JSON,
// which this script overwrites on every build.
const STATUTE_BY_STATE = {
  "Texas":      { statute: "Tex. Prop. Code ch. 53",     sourceUrl: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.53.htm" },
  "Florida":    { statute: "Fla. Stat. ch. 713",         sourceUrl: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0713/0713.html" },
  "New York":   { statute: "N.Y. Lien Law art. 2",       sourceUrl: "https://www.nysenate.gov/legislation/laws/LIE/A2" },
  "Washington": { statute: "RCW ch. 60.04",              sourceUrl: "https://app.leg.wa.gov/RCW/default.aspx?cite=60.04" },
  "Arizona":    { statute: "A.R.S. \u00a7 33-981 et seq.",    sourceUrl: "https://www.azleg.gov/arsDetail/?title=33" },
  "Connecticut":           { statute: "Conn. Gen. Stat. \u00a7 49-33 et seq.", sourceUrl: "https://www.cga.ct.gov/current/pub/chap_847.htm" },
  "District of Columbia":  { statute: "D.C. Code \u00a7 40-301.01 et seq.", sourceUrl: "https://code.dccouncil.gov/us/dc/council/code/titles/40/chapters/3" },
  "Kansas":                { statute: "K.S.A. \u00a7 60-1101 et seq.", sourceUrl: "https://www.ksrevisor.org/statutes/chapters/ch60/060_011_0001.html" },
  "Maine":                 { statute: "10 M.R.S. \u00a7 3251 et seq.", sourceUrl: "https://legislature.maine.gov/statutes/10/title10ch603sec0.html" },
  "Minnesota":             { statute: "Minn. Stat. ch. 514", sourceUrl: "https://www.revisor.mn.gov/statutes/cite/514" },
  "Missouri":              { statute: "Mo. Rev. Stat. ch. 429", sourceUrl: "https://revisor.mo.gov/main/OneChapter.aspx?chapter=429" },
  "Montana":               { statute: "Mont. Code \u00a7 71-3-521 et seq.", sourceUrl: "https://archive.legmt.gov/bills/mca/title_0710/chapter_0030/part_0050/sections_index.html" },
  "South Carolina":        { statute: "S.C. Code \u00a7 29-5-10 et seq.", sourceUrl: "https://www.scstatehouse.gov/code/t29c005.php" },
  "Vermont":               { statute: "9 V.S.A. \u00a7 1921 et seq.", sourceUrl: "https://legislature.vermont.gov/statutes/chapter/09/051" },
  "Virginia":              { statute: "Va. Code \u00a7 43-1 et seq.", sourceUrl: "https://law.lis.virginia.gov/vacodefull/title43/chapter1/" },
  // ── Additional citations (2026-08-14 reconciliation) ──
  // Sourced from official state legislature sites and verified via
  // Levelset, Husch Blackwell, and Franklin County Law Library references.
  "Alabama":               { statute: "Ala. Code \u00a7 35-11-210 et seq.", sourceUrl: "https://alison.legislature.state.al.us/code-of-alabama" },
  "Alaska":                { statute: "Alaska Stat. \u00a7 34.35.005 et seq.", sourceUrl: "https://www.akleg.gov/statutes/Title34/Chapter35/" },
  "Arkansas":              { statute: "Ark. Code \u00a7 18-44-101 et seq.", sourceUrl: "https://codes.findlaw.com/ar/title-18-property/ar-code-sect-18-44-101/" },
  "California":            { statute: "Cal. Civ. Code \u00a7 8000 et seq.", sourceUrl: "https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?division=2.&lawCode=CIV&title=8." },
  "Colorado":              { statute: "Colo. Rev. Stat. \u00a7 38-22-101 et seq.", sourceUrl: "https://leg.colorado.gov/sites/default/files/2021-09/title-38.pdf" },
  "Delaware":              { statute: "Del. Code tit. 6 \u00a7 2701 et seq.", sourceUrl: "https://delcode.delaware.gov/title6/c027/" },
  "Georgia":               { statute: "O.C.G.A. \u00a7 44-14-361 et seq.", sourceUrl: "https://law.justia.com/codes/georgia/title-44/chapter-14/article-3/part-1/" },
  "Hawaii":                { statute: "Haw. Rev. Stat. \u00a7 507-41 et seq.", sourceUrl: "https://www.capitol.hawaii.gov/hrscurrent/Vol11_Ch0501-0588/HRS0507/HRS_0507-0041.htm" },
  "Idaho":                 { statute: "Idaho Code \u00a7 45-501 et seq.", sourceUrl: "https://legislature.idaho.gov/statutesrules/idstat/title45/t45ch5/" },
  "Illinois":              { statute: "770 ILCS 60/1 et seq.", sourceUrl: "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=2812&ChapterID=50" },
  "Indiana":               { statute: "Ind. Code \u00a7 32-28-3-1 et seq.", sourceUrl: "https://iga.in.gov/legislative/laws/2024/ic/titles/032#32-28-3" },
  "Iowa":                  { statute: "Iowa Code \u00a7 572.1 et seq.", sourceUrl: "https://www.legis.iowa.gov/docs/code/572.pdf" },
  "Kentucky":              { statute: "Ky. Rev. Stat. \u00a7 376.010 et seq.", sourceUrl: "https://apps.legislature.ky.gov/law/statutes/chapter.aspx?id=39198" },
  "Louisiana":             { statute: "La. R.S. 9:4801 et seq.", sourceUrl: "https://www.legis.la.gov/legis/Law.aspx?d=292868" },
  "Maryland":              { statute: "Md. Code, Real Prop. \u00a7 9-101 et seq.", sourceUrl: "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=9-101&enactments=" },
  "Massachusetts":         { statute: "Mass. Gen. Laws ch. 254 \u00a7 2 et seq.", sourceUrl: "https://malegislature.gov/Laws/GeneralLaws/PartIII/TitleI/Chapter254" },
  "Michigan":              { statute: "Mich. Comp. Laws \u00a7 570.1101 et seq.", sourceUrl: "http://www.legislature.mi.gov/(S(epgkb0mr4ps14adnqkfvlfhb))/mileg.aspx?page=GetObject&objectname=mcl-act-497-of-1980" },
  "Mississippi":           { statute: "Miss. Code \u00a7 85-7-181 et seq.", sourceUrl: "https://codes.findlaw.com/ms/title-85-trusts-and-trustees/ms-code-sect-85-7-181/" },
  "Nebraska":              { statute: "Neb. Rev. Stat. \u00a7 52-121 et seq.", sourceUrl: "https://nebraskalegislature.gov/laws/statutes.php?statute=52-121" },
  "Nevada":                { statute: "Nev. Rev. Stat. \u00a7 108.221 et seq.", sourceUrl: "https://www.leg.state.nv.us/NRS/NRS-108.html" },
  "New Hampshire":         { statute: "N.H. Rev. Stat. \u00a7 447:1 et seq.", sourceUrl: "https://www.gencourt.state.nh.us/rsa/html/447/447-1.htm" },
  "New Jersey":            { statute: "N.J. Stat. \u00a7 2A:44A-1 et seq.", sourceUrl: "https://lis.njleg.state.nj.us/nxt/gateway.dll?f=templates&fn=default.htm&vid=Publish:10.1048/Enu" },
  "New Mexico":            { statute: "N.M. Stat. \u00a7 48-2-1 et seq.", sourceUrl: "https://nmonesource.com/nmos/enus/Statutes/NMSA1978/NMSA1978-048-002/NMSA1978-048-002-1" },
  "North Carolina":        { statute: "N.C. Gen. Stat. \u00a7 44A-1 et seq.", sourceUrl: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/ByChapter/Chapter_44A.html" },
  "North Dakota":          { statute: "N.D. Cent. Code \u00a7 35-27-01 et seq.", sourceUrl: "https://www.legis.nd.gov/cencode/t35c27.pdf" },
  "Ohio":                  { statute: "Ohio Rev. Code \u00a7 1311.01 et seq.", sourceUrl: "https://codes.ohio.gov/ohio-revised-code/chapter-1311" },
  "Oklahoma":              { statute: "Okla. Stat. tit. 42 \u00a7 141 et seq.", sourceUrl: "https://www.oscn.net/applications/oscn/index.asp?ftdb=ST42ST141&level=1" },
  "Oregon":                { statute: "Or. Rev. Stat. \u00a7 87.005 et seq.", sourceUrl: "https://www.oregonlegislature.gov/bills_laws/ors/ors087.html" },
  "Pennsylvania":          { statute: "49 Pa. Stat. \u00a7 1101 et seq.", sourceUrl: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=49&div=0&chpt=11" },
  "Rhode Island":          { statute: "R.I. Gen. Laws \u00a7 34-28-1 et seq.", sourceUrl: "http://webserver.rilin.state.ri.us/Statutes/TITLE34/34-28/INDEX.HTM" },
  "South Dakota":          { statute: "S.D. Codified Laws \u00a7 44-9-1 et seq.", sourceUrl: "https://sdlegislature.gov/Statutes/Codified_Laws/DisplayStatute.aspx?Type=Statute&Statute=44-9-1" },
  "Tennessee":             { statute: "Tenn. Code \u00a7 66-11-101 et seq.", sourceUrl: "https://law.justia.com/codes/tennessee/title-66/chapter-11/part-1/section-66-11-101/" },
  "Utah":                  { statute: "Utah Code \u00a7 38-1a-101 et seq.", sourceUrl: "https://le.utah.gov/xcode/Title38/Chapter1A/38-1a.html" },
  "West Virginia":         { statute: "W. Va. Code \u00a7 38-2-1 et seq.", sourceUrl: "http://www.wvlegislature.gov/wvcode/code.cfm?chap=38&art=2" },
  "Wisconsin":             { statute: "Wis. Stat. \u00a7 779.01 et seq.", sourceUrl: "https://docs.legis.wisconsin.gov/statutes/statutes/779" },
  "Wyoming":               { statute: "Wyo. Stat. \u00a7 29-1-301 et seq.", sourceUrl: "https://www.wyoleg.gov/statutes/title29" },
};

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
  statuteByState: STATUTE_BY_STATE,
};

mkdirSync(join(process.cwd(), "src/data"), { recursive: true });
writeFileSync(join(process.cwd(), "src/data/lien-deadlines.json"), JSON.stringify(dataset, null, 2));
// public downloadable copy (CC BY 4.0) for the Dataset schema
mkdirSync(join(process.cwd(), "public/lien-law-deadlines"), { recursive: true });
writeFileSync(join(process.cwd(), "public/lien-law-deadlines/data.json"), JSON.stringify({ ...dataset, license: "CC BY 4.0", source: "https://voicelogpro.com/blog/" + sourceSlug }, null, 2));
console.log(`✓ lien dataset: ${states.length} states → src/data/lien-deadlines.json (+ public data.json)`);
