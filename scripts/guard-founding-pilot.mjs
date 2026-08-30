#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "src/config/foundingPilot.ts",
  "src/components/FoundingPilotCTA.tsx",
  "src/pages/FoundingPilot.tsx",
  "src/pages/PilotWelcome.tsx",
  "scripts/generate-founding-pilot-report.mjs",
  "docs/founding-pilot-ops.md",
];
const prohibited = /\b(court-ready|legally defensible|evidence-grade|verified timestamp|OSHA compliant|lien compliant|automatically transcribes|works offline|automatically geolocates|automatically adds weather|processes voice in 30 seconds)\b/i;
const negation = /\b(not|does not|do not|never|without|no guarantee|cannot|isn't|is not)\b/i;
const violations = [];

for (const relative of files) {
  const file = path.join(root, relative);
  if (!existsSync(file)) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (prohibited.test(line) && !negation.test(line)) {
      violations.push(`${relative}:${index + 1} ${line.trim()}`);
    }
  });
}

if (violations.length) {
  console.error("Founding Pilot claim guard failed:");
  for (const violation of violations) console.error(` - ${violation}`);
  process.exit(1);
}
console.log("founding pilot claim guard: passed");
