// @vitest-environment jsdom
/**
 * Printable Texas Chapter 53 checklist UI on the guide page.
 *
 * Covers: placement near the top of the guide, accessible checkboxes,
 * print action (window.print) tracked through the existing consent-gated
 * track() convention, print-mode visibility (chrome hidden, checklist
 * shown), and the no-broken-links contract for the checklist block.
 */
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import TexasLienLaw2025Page from "@/pages/blog/TexasLienLaw2025";
import { texasChapter53Checklist } from "@/content/blog/texas-chapter-53-checklist";
import { setConsentGranted } from "@/lib/posthog";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TexasLienLaw2025Page />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("Texas Chapter 53 printable checklist on the guide page", () => {
  beforeEach(() => {
    setConsentGranted(true);
    window.posthog = { capture: vi.fn() } as unknown as typeof window.posthog;
  });

  afterEach(() => {
    cleanup();
    setConsentGranted(false);
    vi.restoreAllMocks();
  });

  it("renders the checklist block near the top, before the article body", () => {
    renderPage();
    const block = screen.getByRole("region", { name: /printable chapter 53 checklist/i });
    expect(block).toBeTruthy();
    // Before the first markdown H2 ("What is Texas Property Code Chapter 53?")
    const firstH2 = screen.getAllByRole("heading", {
      level: 2,
      name: /What is Texas Property Code Chapter 53/i,
    })[0];
    expect(firstH2).toBeTruthy();
    expect(
      firstH2.compareDocumentPosition(block) & Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy(); // block precedes the guide body heading
  });

  it("renders every section and item as accessible checkboxes", () => {
    renderPage();
    const container = document.getElementById("tx53-checklist")!;
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (const section of texasChapter53Checklist) {
      // scoped: the guide body legitimately repeats section names
      expect(
        within(container).getByRole("heading", {
          level: 3,
          name: new RegExp(esc(section.heading), "i"),
        }),
      ).toBeTruthy();
    }
    const boxes = screen
      .getAllByRole("checkbox")
      .filter((el) => el.closest('[aria-label*="Chapter 53" i], #tx53-checklist'));
    expect(boxes.length).toBe(
      texasChapter53Checklist.reduce((n, s) => n + s.items.length, 0),
    );
    for (const box of boxes) {
      expect((box as HTMLInputElement).checked).toBe(false);
    }
  });

  it("print button calls window.print() and tracks checklist_print_clicked via track()", () => {
    renderPage();
    const printFn = vi.fn();
    Object.defineProperty(window, "print", {
      value: printFn,
      writable: true,
      configurable: true,
    });
    const btn = screen.getByRole("button", { name: /print this checklist/i });
    fireEvent.click(btn);
    expect(printFn).toHaveBeenCalledTimes(1);
    expect(window.posthog?.capture).toHaveBeenCalledWith(
      "checklist_print_clicked",
      expect.objectContaining({ page: "texas-property-code-chapter-53-guide-2025" }),
    );
  });

  it("hides site chrome and article body in print mode; keeps the checklist printable", () => {
    renderPage();
    const block = document.getElementById("tx53-checklist");
    expect(block).toBeTruthy();
    expect(block?.className).not.toMatch(/print:hidden/);
    // Article body, CTA, nav and footer are hidden in print (Tailwind print: variant).
    const hidden = Array.from(
      document.querySelectorAll(".print\\:hidden"),
    );
    expect(hidden.length).toBeGreaterThanOrEqual(3);
    // Checklist card chrome (the print button) must not appear on paper.
    const printBtn = screen.getByRole("button", { name: /print this checklist/i });
    expect(printBtn.className).toMatch(/print:hidden/);
  });

  it("checklist block carries the disclaimer and only verified links", () => {
    renderPage();
    const block = document.getElementById("tx53-checklist");
    expect(block?.textContent).toMatch(/not legal advice/i);
    const links = Array.from(block?.querySelectorAll("a") ?? []);
    const hrefs = links.map((a) => a.getAttribute("href"));
    // Internal anchor + the guide-verified statute URL only.
    expect(hrefs).toContain("#tx53-checklist");
    expect(
      hrefs.filter((h) => h?.startsWith("http")),
    ).toEqual(["https://statutes.capitol.texas.gov/Docs/PR/htm/PR.53.htm"]);
  });

  it("dedicated print stylesheet exists with @media print rules for the checklist", () => {
    const cssPath = path.join(
      repoRoot,
      "src",
      "content",
      "blog",
      "texas-chapter-53-checklist.css",
    );
    expect(fs.existsSync(cssPath)).toBe(true);
    const css = fs.readFileSync(cssPath, "utf-8");
    expect(css).toMatch(/@media print/);
    expect(css).toMatch(/#tx53-checklist/);
    // Checkboxes need real ink on paper: bordered square appearance.
    expect(css).toMatch(/appearance:\s*none|-webkit-appearance:\s*none/);
  });

  it("guide markdown links the checklist from the table of contents", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "src", "content", "blog", "texas-lien-law-2025.ts"),
      "utf-8",
    );
    expect(source).toMatch(/\[Printable one-page checklist\]\(#tx53-checklist\)/);
  });
});
