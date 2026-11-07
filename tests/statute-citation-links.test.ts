import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";

/**
 * Official-citation URL repairs. These checks lock the hrefs that were
 * replaced or removed. They do not verify that a statute is current law.
 */
const ROOT = path.resolve(__dirname, "..");
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "coverage"]);

const BAD_URL_FRAGMENTS = [
  "legislature.mi.gov/(S(",
  "leg.colorado.gov/sites/default/files/2021-09/title-38.pdf",
  "crs2024-title-38.pdf",
  "akleg.gov/statutes/Title34/Chapter35",
  "nmonesource.com/nmos",
  "gencourt.state.nh.us/rsa/html/447/447-1.htm",
  "malegislature.gov/Laws/GeneralLaws/PartIII/TitleI/Chapter254",
  "osha.gov/recordkeeping/OSHA300-log",
  "ActID=2812",
];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const info = statSync(full);
    if (info.isDirectory()) walk(full, out);
    else if (info.isFile() && info.size < 2_000_000) out.push(full);
  }
  return out;
}

function textFiles(): { file: string; text: string }[] {
  return walk(ROOT)
    .filter((file) => !file.endsWith(".png") && !file.endsWith(".jpg") && !file.endsWith(".webp") && !file.endsWith(".pdf"))
    .filter((file) => path.relative(ROOT, file) !== "tests/statute-citation-links.test.ts")
    .map((file) => ({ file: path.relative(ROOT, file), text: readFileSync(file, "utf8") }));
}

describe("statute citation links", () => {
  const files = textFiles();
  const corpus = files.map((entry) => entry.text).join("\n");

  it("removes the broken and mismatched official URLs from site sources", () => {
    const hits = files.flatMap(({ file, text }) =>
      BAD_URL_FRAGMENTS.filter((fragment) => text.includes(fragment)).map(
        (fragment) => `${file} still contains ${fragment}`,
      ),
    );
    expect(hits).toEqual([]);
  });

  it("points the repaired citations at the checked official pages", () => {
    const required = [
      "https://www.legislature.mi.gov/Laws/MCL?objectName=MCL-Act-497-of-1980",
      "https://www.akleg.gov/basis/statutes.asp?statute=34.35",
      "https://gc.nh.gov/rsa/html/xli/447/447-mrg.htm",
      "https://malegislature.gov/Laws/GeneralLaws/PartIII/TitleIV/Chapter254",
      "https://www.osha.gov/recordkeeping",
      "https://www.ilga.gov/Legislation/ILCS/Articles?ActID=2254&ChapterID=63",
      "https://content.leg.colorado.gov/agencies/office-legislative-legal-services/colorado-revised-statutes",
      "Colorado Revised Statutes index",
    ];
    for (const url of required) expect(corpus).toContain(url);
  });

  it("keeps the Alabama, Connecticut, and Wisconsin links that resolve", () => {
    const hub = readFileSync(path.join(ROOT, "public/lien-law-deadlines/index.html"), "utf8");
    expect(hub).toContain("https://alison.legislature.state.al.us/code-of-alabama");
    expect(hub).toContain("https://www.cga.ct.gov/current/pub/chap_847.htm");
    expect(hub).toContain("https://docs.legis.wisconsin.gov/statutes/statutes/779");
  });

  it("drops the unverified New Mexico citation without rewriting its deadline row", () => {
    const nmPage = readFileSync(path.join(ROOT, "lien-law-deadlines/new-mexico/index.html"), "utf8");
    const hub = readFileSync(path.join(ROOT, "public/lien-law-deadlines/index.html"), "utf8");
    expect(nmPage).not.toContain("N.M. Stat");
    expect(nmPage).not.toContain("nmonesource.com");
    expect(nmPage).not.toContain("This page cites");
    expect(nmPage).toContain("60 days from first furnishing (commercial)");
    expect(nmPage).toContain("120 days from last furnishing");
    expect(nmPage).toContain("2 years after filing");
    expect(hub).toContain("Official citation not linked");
    expect(hub).not.toContain("N.M. Stat");
  });

  it("leaves the other Dream 100 OSHA links alone", () => {
    const dream = readFileSync(path.join(ROOT, "src/pages/Dream100.tsx"), "utf8");
    expect(dream).toContain('url: "https://www.osha.gov/recordkeeping"');
    expect(dream).toContain('url: "https://www.osha.gov/etools/construction"');
    expect(dream).toContain('url: "https://www.osha.gov/otiec"');
    expect(dream).not.toContain("OSHA300-log");
  });
});
