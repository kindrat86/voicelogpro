import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");
const source = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("Founding Pilot high-intent integrations", () => {
  it("makes the paid pilot the homepage hero primary action while preserving the free kit", () => {
    const hero = source("src/components/HeroSection.tsx");
    expect(hero).toContain("FoundingPilotCTA");
    expect(hero).toContain("#defense-kit");
  });

  it("uses high-contrast text on every shared pilot checkout CTA", () => {
    const cta = source("src/components/FoundingPilotCTA.tsx");
    expect(cta).toContain("text-[#0b0f14]");
    expect(cta).not.toContain("text-primary-foreground");
  });

  it("uses the real paid offer in the homepage conversion block without waitlist contradictions", () => {
    const section = source("src/components/OrderBumpSection.tsx");
    expect(section).toContain("FoundingPilotCTA");
    expect(section).toContain("$49 one-time");
    expect(section).not.toContain("Pay nothing until launch");
    expect(section).not.toContain("You're reserving a spot");
    expect(section).not.toContain("No charge today");
  });

  it("uses the paid pilot guarantee next to the paid offer", () => {
    const guarantee = source("src/components/GuaranteeSection.tsx");
    expect(guarantee).toContain("7 calendar days after the final pilot report");
    expect(guarantee).toContain("No Automatic Renewal");
    expect(guarantee).not.toContain("No Charge Until Launch");
  });

  it("keeps consent in document flow at every viewport", () => {
    const banner = source("src/components/ConsentBanner.tsx");
    expect(banner).toContain("relative inset-x-0");
    expect(banner).not.toContain("md:fixed");
  });

  it("puts the paid offer before the free kit and removes legacy automated-product sections", () => {
    const index = source("src/pages/Index.tsx");
    expect(index.indexOf("<OrderBumpSection />")).toBeLessThan(index.indexOf("<SqueezeSection />"));
    expect(index).not.toContain("<ComplianceMatrix />");
    expect(index).not.toContain("<HowItWorks />");
    expect(index).not.toContain("<FeaturesSection />");
    expect(index).not.toContain("<ValueLadderSection />");
    expect(index).not.toContain("<FAQSection />");
  });

  it("removes beta and monthly-plan language from current offer surfaces", () => {
    expect(source("src/components/SqueezeSection.tsx")).not.toMatch(/beta spot|waitlist/i);
    expect(source("src/components/GuaranteeSection.tsx")).not.toContain("monthly Crew Plan");
  });

  it("hides fixed mobile navigation on conversion routes", () => {
    const app = source("src/App.tsx");
    expect(app).toContain("CONVERSION_PATHS");
    for (const route of ["/", "/founding-pilot", "/pilot-welcome", "/crew-plan", "/beta"]) {
      expect(app).toContain(`"${route}"`);
    }
  });

  it("does not place unverified scarcity below the paid offer", () => {
    expect(source("src/pages/Index.tsx")).not.toContain("<LimitedBetaSection />");
  });

  it("offers the paid pilot directly from crew-plan and beta routes", () => {
    expect(source("src/pages/CrewPlan.tsx")).toContain("FoundingPilotCTA");
    expect(source("src/pages/BetaSignup.tsx")).toContain("FoundingPilotCTA");
  });
});
