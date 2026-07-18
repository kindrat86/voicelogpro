import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

/**
 * Sitemap canonical-URL invariants.
 * Every <loc> must be a direct-200 canonical URL: apex host (never www),
 * no trailing slash (vercel.json sets trailingSlash:false), and unique.
 * Violations ship redirect entries to Google Search Console.
 */
const sitemaps = ["public/sitemap.xml", "public/sitemap-pseo.xml"];

describe.each(sitemaps)("%s", (file) => {
  const xml = readFileSync(path.resolve(__dirname, "..", file), "utf-8");
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  it("has at least one URL", () => {
    expect(locs.length).toBeGreaterThan(0);
  });

  it("uses only the apex host (no www)", () => {
    const www = locs.filter((l) => l.includes("//www."));
    expect(www).toEqual([]);
  });

  it("has no trailing-slash URLs (except bare root)", () => {
    const trailing = locs.filter(
      (l) => l.endsWith("/") && l !== "https://voicelogpro.com/"
    );
    expect(trailing).toEqual([]);
  });

  it("has no duplicate URLs", () => {
    expect(new Set(locs).size).toBe(locs.length);
  });

  it("only lists https://voicelogpro.com URLs", () => {
    const foreign = locs.filter(
      (l) => !l.startsWith("https://voicelogpro.com")
    );
    expect(foreign).toEqual([]);
  });
});
