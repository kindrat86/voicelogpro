import { afterEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
// @ts-expect-error The production generator is an ESM CLI module.
import { generateFoundingPilotReport } from "../scripts/generate-founding-pilot-report.mjs";

const tempDirs: string[] = [];
afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const fictionalInput = {
  report: { id: "VLP-DEMO-001", reportDate: "2026-08-29" },
  company: { name: "Example Electrical Co." },
  project: { name: "Fictional Library Renovation", location: "Raleigh, NC" },
  submitter: "Casey Example, Foreperson",
  receivedAt: "2026-08-29T17:40:00-04:00",
  customerReportedEventTimes: [
    { time: "07:10", event: "Crew arrived and completed the pre-task briefing." },
  ],
  workPerformed: ["Installed fictional conduit on Level 2."],
  crewLabor: [{ trade: "Electricians", count: 4, hoursEach: 8 }],
  materialsEquipmentDeliveries: ["Received 200 ft of fictional conduit."],
  delaysBlockers: ["Access to Room 204 was unavailable for 30 minutes."],
  safetyObservations: ["No incidents reported by the customer."],
  rfisChangeOrders: ["RFI-EXAMPLE-7 remained open."],
  photoReferences: [{ file: "fictional-panel.jpg", caption: "Customer-supplied example photo." }],
  additionalNotes: "All facts in this fixture are fictional.",
};

describe("Founding Pilot PDF report generator", () => {
  it("writes a readable Letter PDF from documented customer-supplied fields", async () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "vlp-report-"));
    tempDirs.push(dir);
    const output = path.join(dir, "report.pdf");

    const result = await generateFoundingPilotReport(fictionalInput, output, {
      generatedAt: "2026-08-30T12:00:00Z",
    });

    expect(existsSync(output)).toBe(true);
    const pdf = readFileSync(output);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(1500);
    expect(result.pageCount).toBeGreaterThan(0);
    expect(result.pageSize).toBe("LETTER");
    expect(result.footerFontSize).toBeGreaterThanOrEqual(8);
    expect(result.sections.workPerformed).toEqual(fictionalInput.workPerformed);
    expect(result.legalDisclaimer).toMatch(/not a law firm/i);
  });

  it("keeps reported event time separate from received time and never invents weather", async () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "vlp-report-"));
    tempDirs.push(dir);
    const output = path.join(dir, "report.pdf");
    const result = await generateFoundingPilotReport(fictionalInput, output, {
      generatedAt: "2026-08-30T12:00:00Z",
    });

    expect(result.receivedAt).toBe(fictionalInput.receivedAt);
    expect(result.customerReportedEventTimes).toEqual(fictionalInput.customerReportedEventTimes);
    expect(result.weather).toBeNull();
    expect(result.sections).not.toHaveProperty("weather");
  });

  it("includes weather only when both customer-supplied weather and its source are present", async () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "vlp-report-"));
    tempDirs.push(dir);
    const output = path.join(dir, "report.pdf");
    const withWeather = {
      ...fictionalInput,
      weather: {
        summary: "Customer reported light rain at 10:20.",
        source: "Customer-supplied jobsite note",
        retrievedAt: "2026-08-29T10:25:00-04:00",
      },
    };

    const result = await generateFoundingPilotReport(withWeather, output, {
      generatedAt: "2026-08-30T12:00:00Z",
    });
    expect(result.weather).toEqual(withWeather.weather);
  });
});
