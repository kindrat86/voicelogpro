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
 Try the <a href="/free/lien-deadline-calculator">Lien Deadline Calculator →</a><br>Learn what makes a log hold up: <a href="/court-ready-daily-logs">court-ready daily logs →</a></div>
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
