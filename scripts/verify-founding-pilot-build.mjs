#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const checkout = "https://buy.stripe.com/cNi9ASax5aJy5cig6s0x20K";
const routes = ["/", "/founding-pilot", "/pilot-welcome", "/crew-plan", "/beta"];
const forbiddenHeadClaims = [
  "$49 per month",
  "automatic weather",
  "legally defensible",
  "offline capability",
  "court-ready",
  "court-admissible",
  "30 seconds",
];
const violations = [];

for (const route of routes) {
  const file = route === "/"
    ? path.join(root, "dist/index.html")
    : path.join(root, "dist", route.slice(1), "index.html");
  const html = readFileSync(file, "utf8");
  const lower = html.toLowerCase();
  const head = (html.match(/<head>[\s\S]*?<\/head>/i)?.[0] || "").toLowerCase();

  for (const claim of forbiddenHeadClaims) {
    if (head.includes(claim.toLowerCase())) {
      violations.push(`${route}: legacy metadata claim: ${claim}`);
    }
  }
  if (html.includes("<!-- pSEO Footer Navigation -->")) {
    violations.push(`${route}: generic pSEO footer leaked into conversion route`);
  }
  if ((route === "/" || route === "/founding-pilot") && !html.includes(checkout)) {
    violations.push(`${route}: verified checkout link missing`);
  }
  if ((route === "/" || route === "/founding-pilot") && !lower.includes("$49 one-time")) {
    violations.push(`${route}: one-time pilot language missing`);
  }
  if (route === "/pilot-welcome") {
    const noindexCount = (lower.match(/name="robots"[^>]*content="noindex, nofollow"/g) || []).length;
    if (noindexCount !== 1) violations.push(`${route}: expected exactly one noindex tag, found ${noindexCount}`);
    if (lower.includes('name="robots" content="index')) violations.push(`${route}: conflicting index robots tag`);
  }
}

if (violations.length) {
  console.error("Founding Pilot build verification failed:");
  for (const violation of violations) console.error(` - ${violation}`);
  process.exit(1);
}
console.log(`founding pilot build verification: ${routes.length} conversion routes passed`);
