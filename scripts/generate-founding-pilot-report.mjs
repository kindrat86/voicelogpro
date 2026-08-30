#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const LETTER = { width: 612, height: 792 };
const MARGIN = 54;
const FOOTER_HEIGHT = 76;
const FOOTER_FONT_SIZE = 8;
const DISCLAIMER =
  "VoiceLogPro is not a law firm. Reports are generated from customer-supplied information and do not guarantee admissibility, compliance, payment, lien rights, or a legal outcome.";

function asString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asStringList(value) {
  return Array.isArray(value) ? value.map(asString).filter(Boolean) : [];
}

function wrapText(text, font, size, maxWidth) {
  const words = String(text).replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : ["Not provided"];
}

function validateInput(input) {
  if (!input || typeof input !== "object") throw new Error("Input must be a JSON object.");
  const required = [
    ["report.id", input.report?.id],
    ["report.reportDate", input.report?.reportDate],
    ["company.name", input.company?.name],
    ["project.name", input.project?.name],
    ["receivedAt", input.receivedAt],
  ];
  const missing = required.filter(([, value]) => !asString(value)).map(([name]) => name);
  if (missing.length) throw new Error(`Missing required fields: ${missing.join(", ")}`);
  if (input.weather) {
    const complete = asString(input.weather.summary) && asString(input.weather.source) && asString(input.weather.retrievedAt);
    if (!complete) throw new Error("Weather requires summary, source, and retrievedAt. Omit weather when those facts are unavailable.");
  }
}

function normaliseInput(input) {
  validateInput(input);
  const sections = {};
  const addList = (key, value) => {
    const items = asStringList(value);
    if (items.length) sections[key] = items;
  };
  addList("workPerformed", input.workPerformed);
  if (Array.isArray(input.crewLabor) && input.crewLabor.length) {
    sections.crewLabor = input.crewLabor.map((row) => {
      const parts = [];
      if (asString(row.trade)) parts.push(asString(row.trade));
      if (Number.isFinite(row.count)) parts.push(`count: ${row.count}`);
      if (Number.isFinite(row.hoursEach)) parts.push(`hours each: ${row.hoursEach}`);
      return parts.length ? parts.join("; ") : "Not provided";
    });
  }
  addList("materialsEquipmentDeliveries", input.materialsEquipmentDeliveries);
  addList("delaysBlockers", input.delaysBlockers);
  addList("safetyObservations", input.safetyObservations);
  addList("rfisChangeOrders", input.rfisChangeOrders);
  if (Array.isArray(input.photoReferences) && input.photoReferences.length) {
    sections.photoReferences = input.photoReferences.map((photo) =>
      [asString(photo.file), asString(photo.caption)].filter(Boolean).join(" - ") || "Not provided",
    );
  }
  if (asString(input.additionalNotes)) sections.additionalNotes = [asString(input.additionalNotes)];

  const customerReportedEventTimes = Array.isArray(input.customerReportedEventTimes)
    ? input.customerReportedEventTimes
        .map((row) => ({ time: asString(row.time), event: asString(row.event) }))
        .filter((row) => row.time || row.event)
    : [];
  const weather = input.weather
    ? {
        summary: asString(input.weather.summary),
        source: asString(input.weather.source),
        retrievedAt: asString(input.weather.retrievedAt),
      }
    : null;
  if (weather) sections.weather = [`${weather.summary} Source: ${weather.source}. Retrieved: ${weather.retrievedAt}.`];

  return {
    report: { id: asString(input.report.id), reportDate: asString(input.report.reportDate) },
    company: { name: asString(input.company.name) },
    project: { name: asString(input.project.name), location: asString(input.project.location) },
    submitter: asString(input.submitter),
    receivedAt: asString(input.receivedAt),
    customerReportedEventTimes,
    weather,
    sections,
  };
}

export async function generateFoundingPilotReport(input, outputPath, options = {}) {
  const data = normaliseInput(input);
  const generatedAt = asString(options.generatedAt) || new Date().toISOString();
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Daily Report ${data.report.id}`);
  pdf.setAuthor("VoiceLogPro");
  pdf.setSubject("Human-assisted daily report generated from customer-supplied information");
  pdf.setKeywords(["daily report", "customer supplied", "VoiceLogPro"]);
  pdf.setProducer("VoiceLogPro Founding Pilot");

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page;
  let y;

  const newPage = () => {
    page = pdf.addPage([LETTER.width, LETTER.height]);
    y = LETTER.height - MARGIN;
    page.drawRectangle({ x: 0, y: LETTER.height - 12, width: LETTER.width, height: 12, color: rgb(0.92, 0.48, 0.12) });
  };

  const ensureSpace = (height) => {
    if (y - height < FOOTER_HEIGHT + 20) newPage();
  };

  const drawWrapped = (text, { size = 10, font = regular, color = rgb(0.16, 0.18, 0.22), indent = 0, gap = 4 } = {}) => {
    const lines = wrapText(text, font, size, LETTER.width - MARGIN * 2 - indent);
    const lineHeight = size + 3;
    ensureSpace(lines.length * lineHeight + gap);
    for (const line of lines) {
      page.drawText(line, { x: MARGIN + indent, y, size, font, color });
      y -= lineHeight;
    }
    y -= gap;
  };

  const drawHeading = (text) => {
    ensureSpace(34);
    y -= 6;
    page.drawText(text, { x: MARGIN, y, size: 15, font: bold, color: rgb(0.11, 0.19, 0.29) });
    y -= 23;
  };

  const drawLabelValue = (label, value) => {
    drawWrapped(`${label}: ${value || "Not provided"}`, { size: 10, font: regular, gap: 2 });
  };

  const drawList = (title, items) => {
    if (!items?.length) return;
    drawHeading(title);
    for (const item of items) drawWrapped(`• ${item}`, { indent: 8, gap: 3 });
  };

  newPage();
  page.drawText("VOICELOGPRO", { x: MARGIN, y, size: 11, font: bold, color: rgb(0.92, 0.48, 0.12) });
  y -= 30;
  page.drawText("Daily Report", { x: MARGIN, y, size: 26, font: bold, color: rgb(0.07, 0.12, 0.2) });
  y -= 34;
  drawLabelValue("Report ID", data.report.id);
  drawLabelValue("Report date", data.report.reportDate);
  drawLabelValue("Company", data.company.name);
  drawLabelValue("Project", data.project.name);
  drawLabelValue("Project location", data.project.location);
  drawLabelValue("Submitter", data.submitter);
  drawLabelValue("File received by VoiceLogPro", data.receivedAt);

  if (data.customerReportedEventTimes.length) {
    drawHeading("Customer-reported event times");
    for (const row of data.customerReportedEventTimes) {
      drawWrapped(`• ${row.time || "Time not provided"}: ${row.event || "Event not provided"}`, { indent: 8, gap: 3 });
    }
  }

  const titles = {
    workPerformed: "Work performed",
    crewLabor: "Crew and labor",
    materialsEquipmentDeliveries: "Materials, equipment, and deliveries",
    delaysBlockers: "Delays and blockers",
    safetyObservations: "Safety observations or incidents",
    rfisChangeOrders: "RFIs and change orders",
    weather: "Customer-supplied weather",
    photoReferences: "Photo references",
    additionalNotes: "Additional notes",
  };
  for (const [key, title] of Object.entries(titles)) drawList(title, data.sections[key]);

  for (const footerPage of pdf.getPages()) {
    footerPage.drawLine({ start: { x: MARGIN, y: FOOTER_HEIGHT }, end: { x: LETTER.width - MARGIN, y: FOOTER_HEIGHT }, thickness: 0.5, color: rgb(0.72, 0.74, 0.78) });
    const footerLines = wrapText(`${DISCLAIMER} Generated: ${generatedAt}`, regular, FOOTER_FONT_SIZE, LETTER.width - MARGIN * 2);
    let footerY = FOOTER_HEIGHT - 14;
    for (const line of footerLines.slice(0, 4)) {
      footerPage.drawText(line, { x: MARGIN, y: footerY, size: FOOTER_FONT_SIZE, font: regular, color: rgb(0.25, 0.27, 0.31) });
      footerY -= 10;
    }
  }

  const bytes = await pdf.save({ useObjectStreams: false });
  await mkdir(path.dirname(path.resolve(outputPath)), { recursive: true });
  await writeFile(outputPath, bytes);

  return {
    outputPath: path.resolve(outputPath),
    pageCount: pdf.getPageCount(),
    pageSize: "LETTER",
    footerFontSize: FOOTER_FONT_SIZE,
    generatedAt,
    receivedAt: data.receivedAt,
    customerReportedEventTimes: data.customerReportedEventTimes,
    weather: data.weather,
    sections: data.sections,
    legalDisclaimer: DISCLAIMER,
  };
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    console.error("Usage: node scripts/generate-founding-pilot-report.mjs <input.json> <output.pdf>");
    process.exitCode = 2;
    return;
  }
  const input = JSON.parse(await readFile(inputPath, "utf8"));
  const result = await generateFoundingPilotReport(input, outputPath);
  console.log(`Generated ${result.pageCount}-page report: ${result.outputPath}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
