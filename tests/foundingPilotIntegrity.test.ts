import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("Founding Pilot operational and legal integrity", () => {
  it("states the one-time service and refund terms", () => {
    const terms = read("public/terms.html");
    expect(terms).toContain("VoiceLogPro Founding Pilot");
    expect(terms).toContain("one-time $49 payment");
    expect(terms).toContain("no automatic renewal");
    expect(terms).toContain("seven consecutive calendar days");
    expect(terms).toContain("within 7 calendar days after the final pilot report");
    expect(terms).toContain("customer-supplied information");
    expect(terms).toContain("not a law firm");
  });

  it("describes use of pilot notes, audio, and photos without overpromising retention", () => {
    const privacy = read("public/privacy.html");
    expect(privacy).toContain("pilot notes, audio, and photos");
    expect(privacy).toContain("produce the requested daily-report PDFs");
    expect(privacy).toContain("Do not send passwords");
  });

  it("ships a focused prohibited-claims guard and runs it during release builds", () => {
    const guard = read("scripts/guard-founding-pilot.mjs");
    const pkg = JSON.parse(read("package.json"));
    expect(guard).toContain("court-ready");
    expect(guard).toContain("OSHA compliant");
    expect(guard).toContain("evidence-grade");
    expect(pkg.scripts.build).toContain("guard-founding-pilot.mjs");
    expect(pkg.scripts["build:all"]).toContain("guard-founding-pilot.mjs");
  });

  it("removes the obsolete monthly waitlist funnel from the shared app shell", () => {
    const shell = read("index.html");
    expect(shell).not.toContain("Founding /mo");
    expect(shell).not.toContain("Nothing to pay yet");
    expect(shell).not.toContain("BRUNSON FALSE BELIEFS");
    expect(shell).not.toContain("How to create an OSHA-compliant daily construction report");
    expect(shell).toContain("Start the $49 Pilot");
    expect(shell).toContain("$49 one-time");
  });

  it("strips legacy structured data from conversion routes and verifies the built artifacts", () => {
    const prerender = read("scripts/prerender.mjs");
    const verifier = read("scripts/verify-founding-pilot-build.mjs");
    const pkg = JSON.parse(read("package.json"));
    expect(prerender).toContain("stripConversionStructuredData");
    expect(prerender).toContain("application\\/ld\\+json");
    expect(verifier).toContain("$49 per month");
    expect(verifier).toContain("automatic weather");
    expect(verifier).toContain("legally defensible");
    expect(pkg.scripts["build:all"]).toContain("verify-founding-pilot-build.mjs");
  });

  it("keeps conversion-page metadata aligned with the current human-assisted pilot", () => {
    const index = read("src/pages/Index.tsx");
    const crew = read("src/pages/CrewPlan.tsx");
    const beta = read("src/pages/BetaSignup.tsx");
    expect(index).not.toContain("daily construction reports in 60 seconds");
    expect(index).toContain("$49 one-time");
    expect(crew).not.toContain("unlimited voice logs, standard PDF reports");
    expect(beta).not.toContain("reports in 30 seconds");
  });

  it("keeps the report generator offline and the public fixture fictional", () => {
    const generator = read("scripts/generate-founding-pilot-report.mjs");
    const fixture = read("examples/founding-pilot-input.example.json");
    expect(generator).not.toMatch(/\bfetch\s*\(|https?:\/\//);
    expect(fixture).toContain("Example Electrical Co.");
    expect(fixture).toContain("fictional");
  });
});
