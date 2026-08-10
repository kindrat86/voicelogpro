#!/usr/bin/env node
/**
 * check-capture-endpoints.mjs — uptime probe for BOTH live email-capture wings.
 *
 * WHY THIS EXISTS
 * Two silent capture outages landed inside one measurement window, and both
 * looked identical from the outside: the form still "sent", the visitor saw
 * nothing wrong, and every lead was discarded.
 *
 *   1. 2026-08-06 → 08-09 (fixed in `8aaef61`): the Vercel team consolidation
 *      deleted the `email-engine-fawn` project. The static tools wing kept
 *      POSTing to the dead host, which 404'd for 3 days.
 *   2. 2026-08-09 17:52 → (this task): `api.carshake.online` began returning
 *      502 on every path — the Mac mini listener behind the Cloudflare Tunnel
 *      was crash-looping, so cloudflared had nothing to proxy to.
 *
 * Neither was caught by anything. This script is the catch.
 *
 * NO FABRICATED SUCCESS: the probes below are chosen so that a passing run
 * genuinely means "a real submit from this site would be stored". Both are
 * side-effect free — no lead row is written and no email is sent (see each
 * probe's note) — so this is safe to run on a schedule forever.
 *
 * THE URLS ARE READ FROM SOURCE, NOT HARDCODED. Both outages were "the code
 * points somewhere the monitor doesn't know about". If a monitor hardcodes its
 * own copy of the host, it happily reports green while the site POSTs into a
 * void. So we parse the exact URL the shipped code uses and probe that.
 *
 * Usage:  node scripts/check-capture-endpoints.mjs
 * Exit 0 = every capture endpoint healthy. Exit 1 = at least one is broken.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const TIMEOUT_MS = 15_000;

/** Pull a URL out of a source file, so the monitor always tracks the real target. */
function urlFromSource(relPath, regex, label) {
  let text;
  try {
    text = readFileSync(join(REPO, relPath), 'utf8');
  } catch (e) {
    throw new Error(`${label}: cannot read ${relPath} — ${e.message}`);
  }
  const m = text.match(regex);
  if (!m) {
    throw new Error(
      `${label}: no capture URL found in ${relPath}. The capture code moved or was ` +
        `rewritten — update this probe so it keeps watching the real endpoint.`
    );
  }
  return m[1];
}

// --- Wing 1: React SPA (homepage hero, beta signup, crew plan) --------------
// src/lib/subscribe.ts POSTs here. Probe fills the `website` honeypot, which
// the Mac mini listener answers with ok:true *before* touching SQLite or Resend
// (src/routes/subscribe.js: "Honeypot: a real user never fills `website`.
// Accept silently, store nothing."). So this exercises tunnel → listener →
// routing → JSON parse → handler, and stores/sends nothing.
const spaUrl = urlFromSource(
  'src/lib/subscribe.ts',
  /SUBSCRIBE_URL\s*=\s*["']([^"']+)["']/,
  'SPA wing'
);

// --- Wing 2: static tools wing (lien calculator + 52 generated pages) -------
// scripts/lib/capture-snippet.mjs injects this fetch into every generated page.
// Probe sends an empty body: the engine replies 400 "product and valid email
// required", which proves the route exists and is validating without creating
// a subscriber. A deleted/renamed project answers 404 — the exact `8aaef61`
// failure mode — and a dead backend answers 5xx. Both fail this probe.
const staticUrl = urlFromSource(
  'scripts/lib/capture-snippet.mjs',
  /fetch\(['"](https?:\/\/[^'"]+\/subscribe)['"]/,
  'static tools wing'
);

const PROBES = [
  {
    name: 'SPA wing (homepage / beta signup)',
    url: spaUrl,
    source: 'src/lib/subscribe.ts',
    body: { product: 'voicelogpro', email: 'uptime-probe@example.invalid', website: 'uptime-probe' },
    // Honeypot path returns 200 {ok:true} and deliberately persists nothing.
    check: (status, json) =>
      status === 200 && json?.ok === true
        ? null
        : `expected 200 {ok:true} from the honeypot path, got ${status} ${JSON.stringify(json)?.slice(0, 200)}`,
  },
  {
    name: 'Static tools wing (lien calculator + state pages)',
    url: staticUrl,
    source: 'scripts/lib/capture-snippet.mjs',
    body: {},
    // 400 = route alive and validating. 404 = project gone. 5xx = backend down.
    check: (status) =>
      status === 400
        ? null
        : status === 404
          ? `404 — the engine project is gone or renamed (this is the 8aaef61 failure mode); ` +
            `update scripts/lib/capture-snippet.mjs and ~/unlocksaas/app/src/lib/email-engine.ts`
          : `expected 400 (route alive, validating input), got ${status}`,
  },
];

async function postOnce(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* non-JSON (e.g. a Cloudflare 502 error page) — the status still decides */
  }
  return { status: res.status, json, text };
}

/** One retry, so a single transient blip doesn't cry wolf on a schedule. */
async function probe(p) {
  let last;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { status, json, text } = await postOnce(p.url, p.body);
      const problem = p.check(status, json);
      if (!problem) return { ok: true, detail: `HTTP ${status}` };
      last = { ok: false, detail: problem, status, text };
    } catch (e) {
      last = { ok: false, detail: `request failed: ${e.message}` };
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, 3000));
  }
  return last;
}

const results = await Promise.all(PROBES.map(probe));

let failed = 0;
for (const [i, r] of results.entries()) {
  const p = PROBES[i];
  if (r.ok) {
    console.log(`PASS  ${p.name}\n      ${p.url} — ${r.detail}`);
  } else {
    failed++;
    console.error(
      `FAIL  ${p.name}\n      ${p.url}  (from ${p.source})\n      ${r.detail}` +
        (r.text ? `\n      body: ${r.text.slice(0, 300).replace(/\s+/g, ' ')}` : '')
    );
  }
}

if (failed) {
  console.error(
    `\n${failed} of ${PROBES.length} capture endpoint(s) DOWN — opt-ins are being ` +
      `silently discarded right now. Every minute here is lost leads.`
  );
  process.exit(1);
}
console.log(`\nAll ${PROBES.length} capture endpoints healthy.`);
