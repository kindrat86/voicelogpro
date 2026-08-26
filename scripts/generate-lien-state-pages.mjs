#!/usr/bin/env node
/**
 * generate-lien-state-pages.mjs — build per-state lien-deadline pages from the
 * verbatim dataset. Renders only parsed values. Never invents a deadline.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { POSTHOG_SNIPPET, captureBlock } from "./lib/capture-snippet.mjs";

const D = JSON.parse(readFileSync(join(process.cwd(), "src/data/lien-deadlines.json"), "utf8"));
const BASE = "https://voicelogpro.com";
const CHEATSHEET = `${BASE}/blog/${D.sourceSlug}`;
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const DEEP_STATES = new Set(["California", "Florida", "New York", "Pennsylvania", "Texas", "Alabama", "Alaska", "Arizona", "Arkansas", "Colorado", "Connecticut", "Delaware", "Georgia", "Hawaii", "Idaho"]);

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

function depthSection(state) {
  if (!DEEP_STATES.has(state)) return "";

  const rows = Object.fromEntries(D.sections
    .filter((section) => section.rows[state])
    .map((section) => [section.key, section.rows[state]]));
  const notice = rows.preliminaryNotice;
  const filing = rows.lienFiling;
  const enforcement = rows.enforcement;
  const st = (D.statuteByState || {})[state];
  if (!notice || !filing || !enforcement || !st) return "";
  const filingDeadline = filing[2] || filing[1];
  const enforcementDeadline = enforcement[2] || enforcement[1];

  return `<section aria-labelledby="timeline-${slugify(state)}">
<h2 id="timeline-${slugify(state)}">How to read the ${esc(state)} lien timeline</h2>
<p>A lien timeline is not one date. It is a sequence of separate steps. For ${esc(state)}, start by identifying whether the preliminary-notice rule applies to your role and project. The reference above records that requirement as <strong>${esc(notice[1])}</strong> and gives the deadline as <strong>${esc(notice[2])}</strong>${notice[3] ? `, with this qualification: ${esc(notice[3])}` : ""}. Do not substitute the date of an invoice, payment application, or internal reminder unless the statute makes that event the trigger.</p>
<p>The filing window is a different step. The source data states <strong>${esc(filingDeadline)}</strong>${filing[3] ? ` and notes: ${esc(filing[3])}` : ""}. The enforcement window starts after a lien has been filed. For ${esc(state)}, that period is <strong>${esc(enforcementDeadline)}</strong>${enforcement[3] ? `, subject to this note: ${esc(enforcement[3])}` : ""}. Keeping these events separate helps prevent a notice deadline from being mistaken for a filing deadline.</p>

<h2>A worked ${esc(state)} timeline</h2>
<p>Suppose a subcontractor is reviewing an unpaid project. This example does not invent calendar dates. It shows which project records must be matched to each sourced rule before a calendar date is calculated.</p>
<ol>
<li><strong>Find the notice trigger.</strong> Check the daily log and contract record for the event named in <strong>${esc(notice[2])}</strong>. Confirm whether the stated project or role qualification applies.</li>
<li><strong>Find the filing trigger.</strong> Use the project record required by <strong>${esc(filingDeadline)}</strong>. Record the underlying event and the filing deadline as separate entries.</li>
<li><strong>Start enforcement tracking only after filing.</strong> Once the lien is filed, preserve the filing receipt and track <strong>${esc(enforcementDeadline)}</strong>. Do not count this period from the first or last furnishing date unless the official law says to do so.</li>
</ol>
<p>The result is an auditable chain: the project event, the applicable rule, the calculated deadline, and the document that proves when each event occurred. VoiceLogPro can preserve daily work records, but it does not decide whether a statutory exception applies. A licensed ${esc(state)} construction attorney should confirm the final dates before anyone relies on them.</p>

<h2>What to preserve in the project file</h2>
<p>Keep the contract, notices, proof of service, daily logs, delivery records, change orders, completion records, the recorded lien, and court or filing receipts together. Label the first furnishing, last furnishing, completion, notice, filing, and enforcement events plainly. If two records conflict, flag the conflict rather than silently choosing the date that leaves more time.</p>
<p>This page cites <strong>${esc(st.statute)}</strong>. Read the <a href="${esc(st.sourceUrl)}" rel="nofollow noopener" target="_blank">official text</a> for definitions, claimant-specific rules, service requirements, exceptions, and any event that can shorten a period. The table is a planning reference, not a substitute for the statute or legal advice.</p>
</section>`;
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
${depthSection(state)}
<div class="cta"><strong>Keep each lien event documented.</strong> Notice, filing, and enforcement periods can use different triggers. A contested furnishing or filing date can blur the timeline. <a href="/">VoiceLogPro</a> timestamps daily work from a voice note, so the project record can show what happened and when.
 Try the <a href="/free/lien-deadline-calculator">Lien Deadline Calculator →</a><br>Learn what makes a log hold up: <a href="/court-ready-daily-logs">court-ready daily logs →</a></div>
<p>See all states in the <a href="${CHEATSHEET}">50-state lien deadline cheat sheet</a>. Nearby: ${others.map((o) => `<a href="/lien-law-deadlines/${slugify(o)}">${esc(o)}</a>`).join(" · ")}.</p>`;

  // Statute reference is rendered ONLY for states whose official source URL has been
  // content-verified to serve the cited chapter. Unverified states render nothing —
  // an absent citation is safer than a wrong one on compliance content.
  const st = (D.statuteByState || {})[state];
  const statuteLine = st
    ? ` Statute: ${esc(st.statute)} — <a href="${esc(st.sourceUrl)}" rel="nofollow noopener" target="_blank">official text</a>.`
    : "";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(state)} Mechanics Lien Deadlines (${D.updatedAt.slice(0,4)}) — Preliminary Notice & Filing | VoiceLogPro</title>
<meta name="description" content="${esc(state)} mechanics lien deadlines: preliminary notice, lien filing, and enforcement windows. Verified reference for subcontractors. Not legal advice.">
<link rel="canonical" href="${BASE}/lien-law-deadlines/${slug}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
${CSS}
${POSTHOG_SNIPPET}
<script type="application/ld+json">${JSON.stringify(faq)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head><body>
<p style="font-size:.85rem"><a href="/">VoiceLogPro</a> › <a href="/lien-law-deadlines">Lien Deadlines</a> › ${esc(state)}</p>
<h1>${esc(state)} Mechanics Lien Deadlines</h1>
<p>The three deadlines every ${esc(state)} subcontractor must track — preliminary notice, lien filing, and enforcement. Values below are reproduced from our verified 50-state reference; confirm with a ${esc(state)} construction attorney.</p>
${body}
${captureBlock(`/lien-law-deadlines/${slug}`, esc(state), `${esc(state)}'s`)}
<p class="disc">${esc(D.disclaimer)}${statuteLine} Compiled reference: <a href="${CHEATSHEET}">VoiceLogPro 50-state lien deadline reference</a> · <a href="/lien-law-deadlines/data.json">Download data (CC BY 4.0)</a></p>
</body></html>`;

  mkdirSync(join(process.cwd(), "lien-law-deadlines", slug), { recursive: true });
  writeFileSync(join(process.cwd(), "lien-law-deadlines", slug, "index.html"), html);
  count++;
}
console.log(`✓ generated ${count} per-state lien pages under lien-law-deadlines/`);
