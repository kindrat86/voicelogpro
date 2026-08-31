/**
 * Zero-fabrication gate for the Texas Chapter 53 printable checklist.
 *
 * Derivation anchor: VERBATIM_OFFICIAL_EXCERPTS in the data module, whose
 * entries are verbatim substrings of the current official Texas statute
 * (statutes.capitol.texas.gov, verified 2026-08-31). The pre-correction
 * version derived from the published guide's prose; official validation
 * found that prose contains material errors, so the checklist now derives
 * ONLY from the statute excerpts and the guide is no longer a source.
 */
import { describe, expect, it } from "vitest";
import {
  texasChapter53Checklist,
  VERBATIM_OFFICIAL_EXCERPTS,
  tx53ChecklistIntro,
  tx53ChecklistDisclaimer,
  TX53_CHECKLIST_SOURCE_URL,
  TX53_CHECKLIST_SOURCE_LABEL,
} from "@/content/blog/texas-chapter-53-checklist";

const allExcerptText = VERBATIM_OFFICIAL_EXCERPTS.map((e) => e.text).join("\n");

describe("Texas Chapter 53 checklist derives only from official statute excerpts", () => {
  it("exposes a non-empty checklist with sections and items", () => {
    expect(Array.isArray(texasChapter53Checklist)).toBe(true);
    expect(texasChapter53Checklist.length).toBeGreaterThanOrEqual(4);
    for (const section of texasChapter53Checklist) {
      expect(section.heading.trim().length).toBeGreaterThan(0);
      expect(section.items.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("official excerpts are substantial and uniquely cited", () => {
    expect(VERBATIM_OFFICIAL_EXCERPTS.length).toBeGreaterThanOrEqual(20);
    const cites = new Set(VERBATIM_OFFICIAL_EXCERPTS.map((e) => e.cite));
    expect(cites.has("Sec. 53.056(a-1)(1)")).toBe(true);
    expect(cites.has("Sec. 53.158(a)")).toBe(true);
    expect(cites.has("Sec. 28.004(b)")).toBe(true);
    for (const e of VERBATIM_OFFICIAL_EXCERPTS) {
      expect(e.text.length).toBeGreaterThanOrEqual(15);
      expect(e.text).not.toMatch(/\u2014/);
    }
  });

  it("every sourceQuote is a verbatim official excerpt (no guide-derived claims)", () => {
    const failures: string[] = [];
    for (const section of texasChapter53Checklist) {
      for (const item of section.items) {
        for (const quote of item.sourceQuotes) {
          if (!allExcerptText.includes(quote)) {
            failures.push(`${section.id}/${item.id}: "${quote}"`);
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it("every deadline-bearing item cites an official excerpt (no unsourced deadlines)", () => {
    const deadlineRe =
      /\b(15th day|15th of|within \d+ days|30 days|5 days|one year|first anniversary|second anniversary|two-year|1-1\/2 percent|1\.5%|HB 2237|January 1, 2022|35th day|seventh day)\b/i;
    for (const section of texasChapter53Checklist) {
      for (const item of section.items) {
        if (deadlineRe.test(item.text)) {
          expect(
            item.sourceQuotes.length,
            `${section.id}/${item.id} mentions a deadline but has no official sourceQuotes`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  it("residential vs non-residential deadline split is present", () => {
    const all = texasChapter53Checklist
      .flatMap((s) => s.items.map((i) => i.text))
      .join("\n");
    expect(all).toContain("15th day of the second month");
    expect(all).toContain("15th day of the third month");
    expect(all).toContain("15th day of the fourth month");
    expect(all).toMatch(/residential/i);
  });

  it("no known-false claims survive from the pre-correction version", () => {
    const all = texasChapter53Checklist
      .flatMap((s) => s.items.map((i) => i.text))
      .join("\n");
    // The GC 30-day payment rule had no statutory basis:
    expect(all).not.toContain(
      "pay subcontractors within 30 days after the owner makes final payment",
    );
    // Interest belongs to Ch. 28, not Ch. 53:
    expect(all).not.toMatch(/penalty interest at 1\.5% per month/i);
    // Enforcement is one year (53.158), not two years from filing:
    expect(all).not.toContain(
      "two years from the date the lien affidavit is filed",
    );
    // Certified mail RRR is not the statutory requirement:
    expect(all).not.toContain("certified mail, return receipt requested");
    // 53.057 is retainage notice, not generic "fund trapping":
    const ft = texasChapter53Checklist.find((s) => s.id === "fund-trapping");
    expect(ft?.heading).toContain("Reserved Funds");
    expect(ft?.statute).toContain("53.101");
  });

  it("prompt payment content is explicitly attributed to Chapter 28", () => {
    const pp = texasChapter53Checklist.find(
      (s) => s.id === "retainage" || s.statute.includes("Chapter 28"),
    );
    expect(pp).toBeTruthy();
    expect(pp!.statute).toContain("Chapter 28");
    const all = pp!.items.map((i) => i.text).join("\n");
    expect(all).toContain("35th day");
    expect(all).toContain("7 days");
    expect(all).toContain("1-1/2 percent");
  });

  it("statutory citations used by the checklist match the official sections", () => {
    const statutes = texasChapter53Checklist
      .map((s) => s.statute.replace(/\s*\(.*\)\s*$/, ""))
      .join(" ");
    const cites = VERBATIM_OFFICIAL_EXCERPTS.map((e) => e.cite).join(" ");
    for (const s of ["53.056", "53.057", "53.052", "53.101", "53.055", "53.158"]) {
      expect(statutes + " " + cites).toContain(s);
    }
  });

  it("intro and disclaimer keep the no-legal-advice rule and project-type hedge", () => {
    expect(tx53ChecklistIntro).toMatch(/HB 2237/);
    expect(tx53ChecklistIntro).toMatch(/residential/i);
    expect(tx53ChecklistDisclaimer).toMatch(/not legal advice/i);
    expect(tx53ChecklistDisclaimer).toMatch(/licensed Texas (construction )?attorney/i);
  });

  it("links only the official statute source", () => {
    expect(TX53_CHECKLIST_SOURCE_URL).toBe(
      "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.53.htm",
    );
    expect(TX53_CHECKLIST_SOURCE_LABEL).toMatch(/Texas Property Code Chapter 53/);
  });

  it("checklist fits on one page: item budget is bounded", () => {
    const itemCount = texasChapter53Checklist.reduce(
      (n, s) => n + s.items.length,
      0,
    );
    expect(itemCount).toBeLessThanOrEqual(16);
    for (const section of texasChapter53Checklist) {
      for (const item of section.items) {
        expect(item.text.length).toBeLessThan(320);
      }
    }
  });

  it("no em dashes in checklist copy (repo style rule)", () => {
    for (const section of texasChapter53Checklist) {
      expect(section.heading).not.toMatch(/\u2014/);
      for (const item of section.items) {
        expect(item.text).not.toMatch(/\u2014/);
      }
    }
    expect(tx53ChecklistIntro).not.toMatch(/\u2014/);
    expect(tx53ChecklistDisclaimer).not.toMatch(/\u2014/);
  });
});
