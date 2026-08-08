#!/usr/bin/env node
/**
 * SITEMAP URL GUARDRAIL — validates every <loc> in the generated sitemap(s).
 *
 * Crawls each URL and fails the build if:
 *   1. A URL returns HTTP 4xx or 5xx (dead pages in sitemap)
 *   2. A URL's HTML contains a meta robots "noindex" directive
 *   3. A URL's HTTP response includes an X-Robots-Tag: noindex header
 *
 * Run locally:  node scripts/verify-sitemap-urls.mjs
 * In CI:        added to "build:all" and "build" scripts in package.json
 *
 * Self-contained — no external dependencies beyond Node.js stdlib.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const SITEMAP_FILES = [
  "dist/sitemap.xml",
  "dist/image-sitemap.xml",
];
const CONCURRENCY = 10;
const TIMEOUT_MS = 15_000;
const USER_AGENT = "VoiceLogPro-SitemapGuard/1.0 (pre-deploy check; +https://voicelogpro.com)";

// ── helpers ──────────────────────────────────────────────────────────

function extractUrls(xml) {
  const re = /<loc>([^<]+)<\/loc>/g;
  const urls = [];
  let m;
  while ((m = re.exec(xml)) !== null) urls.push(m[1]);
  return urls;
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    });
    clearTimeout(timer);

    const status = resp.status;
    const xRobots = resp.headers.get("X-Robots-Tag") || "";
    const body = await resp.text();
    const bodyHead = body.slice(0, 30_000).toLowerCase();

    const issues = [];

    if (status >= 400) {
      issues.push(`HTTP ${status}`);
    }

    if (xRobots.toLowerCase().includes("noindex")) {
      issues.push(`X-Robots-Tag: ${xRobots.trim()}`);
    }

    // Check meta robots for noindex
    const metaMatch = bodyHead.match(
      /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i
    );
    if (metaMatch && metaMatch[1].toLowerCase().includes("noindex")) {
      issues.push(`meta robots: ${metaMatch[1]}`);
    }

    return { url, status, issues };
  } catch (err) {
    clearTimeout(timer);
    return { url, status: "ERR", issues: [err.message] };
  }
}

async function checkAll(urls) {
  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);

    // Progress
    const done = Math.min(i + CONCURRENCY, urls.length);
    process.stderr.write(
      `\r  sitemap guard: ${done}/${urls.length} URLs checked...`
    );
  }
  process.stderr.write("\n");
  return results;
}

// ── main ─────────────────────────────────────────────────────────────

let totalUrls = 0;
const allViolations = [];
const allErrors = [];

for (const file of SITEMAP_FILES) {
  const filePath = resolve(ROOT, file);
  let xml;
  try {
    xml = readFileSync(filePath, "utf-8");
  } catch {
    console.error(`\n❌ Sitemap file not found: ${file}`);
    process.exit(1);
  }

  const urls = extractUrls(xml);
  if (urls.length === 0) {
    console.error(`\n❌ No URLs found in ${file}`);
    process.exit(1);
  }

  console.error(`\n📄 ${file} — ${urls.length} URLs`);
  totalUrls += urls.length;

  const results = await checkAll(urls);

  for (const r of results) {
    if (r.issues.length > 0) {
      const label = r.issues.join("; ");
      if (r.status >= 400 || r.status === "ERR") {
        allErrors.push({ url: r.url, file, issues: r.issues });
        console.error(`  ✗ ${label} — ${r.url}`);
      } else {
        allViolations.push({ url: r.url, file, issues: r.issues });
        console.error(`  ⚠ ${label} — ${r.url}`);
      }
    }
  }
}

// ── report ───────────────────────────────────────────────────────────

console.error(`\n${"═".repeat(60)}`);
console.error(
  `Sitemap guard: ${totalUrls} URLs checked across ${SITEMAP_FILES.length} sitemap(s)`
);
console.error(`  Errors (4xx/5xx):     ${allErrors.length}`);
console.error(`  Warnings (noindex):    ${allViolations.length}`);
console.error(`${"═".repeat(60)}`);

if (allErrors.length > 0) {
  console.error(
    `\n❌ GUARD FAILED — ${allErrors.length} dead URL(s) in sitemap.`
  );
  console.error("   Remove dead URLs before deploying.\n");
  process.exit(1);
}

if (allViolations.length > 0) {
  console.error(
    `\n❌ GUARD FAILED — ${allViolations.length} noindex URL(s) in sitemap.`
  );
  console.error("   Either remove the URL from sitemap or remove its noindex directive.\n");
  process.exit(1);
}

console.error("\n✅ Sitemap guard: all URLs valid (200 OK, no noindex).\n");
process.exit(0);
