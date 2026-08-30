import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ROUTES } from "@/routes";

const root = path.resolve(__dirname, "..");

describe("Founding Pilot route registration", () => {
  it("registers both public routes in the shared route table", () => {
    const paths = ROUTES.map((route) => route.path);
    expect(paths).toContain("/founding-pilot");
    expect(paths).toContain("/pilot-welcome");
  });

  it("prerenders both routes", () => {
    const source = readFileSync(path.join(root, "scripts/prerender.mjs"), "utf8");
    expect(source).toContain("'/founding-pilot'");
    expect(source).toContain("'/pilot-welcome'");
  });

  it("strips generic SEO shell extras from conversion routes", () => {
    const source = readFileSync(path.join(root, "scripts/prerender.mjs"), "utf8");
    for (const route of ["'/'", "'/founding-pilot'", "'/pilot-welcome'", "'/crew-plan'", "'/beta'"]) {
      expect(source).toContain(route);
    }
    expect(source).toContain("CONVERSION_ROUTES");
    expect(source).toContain("<!-- pSEO Footer Navigation -->");
    expect(source).toContain("<!-- /AEO Definition Block -->");
  });

  it("deduplicates the template robots tag when a route supplies noindex", () => {
    const source = readFileSync(path.join(root, "scripts/prerender.mjs"), "utf8");
    expect(source).toContain('if (/name="robots"/.test(helmetHead))');
    expect(source).toContain('html.replace(/<meta name="robots"');
  });

  it("lists only the indexable pilot page in the sitemap", () => {
    const sitemap = readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
    expect(sitemap).toContain("https://voicelogpro.com/founding-pilot");
    expect(sitemap).not.toContain("https://voicelogpro.com/pilot-welcome");
  });
});
