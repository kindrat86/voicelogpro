/**
 * Texas Property Code Chapter 53 printable checklist — derived data.
 *
 * ZERO-FABRICATION RULE: every checklist item must be derivable from
 * VERBATIM official statute excerpts (VERBATIM_OFFICIAL_EXCERPTS below),
 * each tagged with its section and traced to the current official text at
 * statutes.capitol.texas.gov (verified 2026-08-31, current through the
 * 89th 2nd C.S., 2025). tests/texasChapter53ChecklistData.test.ts enforces
 * the derivability gate. Do not add deadline language here that has no
 * official excerpt.
 *
 * Provenance: the pre-correction version derived from the published guide's
 * prose. Official-source validation found material errors in that prose
 * (53.057 mislabeled, a GC 30-day payment rule with no statutory basis,
 * interest attributed to Ch. 53 instead of the Prompt Payment Act, a
 * two-year enforcement claim contradicted by Sec. 53.158). This version is
 * re-anchored to the statute itself. The published guide still needs its
 * own correction pass (flagged separately; do not cite it here).
 */

export interface Tx53ChecklistItem {
  id: string;
  text: string;
  /** Verbatim substrings of official statute excerpts proving this item. */
  sourceQuotes: string[];
}

export interface Tx53ChecklistSection {
  id: string;
  heading: string;
  /** Statutory citation as printed in the official statute. */
  statute: string;
  items: Tx53ChecklistItem[];
}

export const TX53_CHECKLIST_SOURCE_URL =
  "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.53.htm";

export const TX53_CHECKLIST_SOURCE_LABEL = "Texas Property Code Chapter 53";

export const tx53ChecklistIntro =
  "Printable compliance checklist for Texas subcontractors. Since HB 2237 (effective January 1, 2022) consolidated the former monthly notices, each month of unpaid work has one notice deadline. Deadlines differ for residential and non-residential projects; confirm which applies before you calendar anything. Print this page and work it top to bottom for each billing period.";

export const tx53ChecklistDisclaimer =
  "This checklist is for educational purposes only and is not legal advice. Chapter 53 is subject to change and deadlines vary by project type. Confirm exact dates for your situation with a licensed Texas construction attorney.";

/**
 * Verbatim quotes from the current official statute (see file header).
 * The data test enforces that every checklist item's sourceQuotes appear
 * here, and that these quotes appear in the official captured extracts.
 */
export const VERBATIM_OFFICIAL_EXCERPTS: { cite: string; text: string }[] = [
  {
    cite: "Sec. 53.056(a-1)(1)",
    text: "not later than the 15th day of the third month after the month during which",
  },
  {
    cite: "Sec. 53.056(a-1)(2)",
    text: "for residential construction projects, not later than the 15th day of the second month after the month during which",
  },
  {
    cite: "Sec. 53.056(a-1)",
    text: "the claimant must send a notice of claim for unpaid labor or materials to the owner or reputed owner and the original contractor",
  },
  {
    cite: "Sec. 53.056(a-2) (statutory form fields)",
    text: "Claimant's name: _______________",
  },
  {
    cite: "Sec. 53.056(a-2) (statutory form fields)",
    text: "(Claimant's address)",
  },
  {
    cite: "Sec. 53.056(a-2) (statutory form fields)",
    text: "Type of labor or materials provided: _______________",
  },
  {
    cite: "Sec. 53.056(a-2) (statutory form fields)",
    text: "Project description and/or address: _______________",
  },
  {
    cite: "Sec. 53.056(a-2) (statutory form fields)",
    text: "Claim amount: _______________",
  },
  {
    cite: "Sec. 53.056(a-2) (statutory form fields)",
    text: "Original contractor's name: _______________",
  },
  {
    cite: "Sec. 53.057(a-1)",
    text: "must send the notice of claim for unpaid retainage to the owner or reputed owner and the original contractor not later than the earlier of",
  },
  {
    cite: "Sec. 53.057(a-1)(1)",
    text: "the 30th day after the date the claimant's contract is completed, terminated, or abandoned",
  },
  {
    cite: "Sec. 53.057(a-1)(2)",
    text: "the 30th day after the date the original contract is terminated or abandoned",
  },
  {
    cite: "Sec. 53.103(2)",
    text: "files an affidavit claiming a lien not later than the 30th day after the earliest of the date",
  },
  {
    cite: "Sec. 53.052(d)",
    text: "not later than the 15th day of the third month after the month in which the original contract under which the claimant performed was completed, terminated, or abandoned",
  },
  {
    cite: "Sec. 53.101(a)",
    text: "During the progress of work under an original contract for which a mechanic's lien may be claimed and for 30 days after the work under the contract is completed, the owner shall reserve",
  },
  {
    cite: "Sec. 53.101(a)(1)",
    text: "10 percent of the contract price of the work to the owner",
  },
  {
    cite: "Sec. 53.052(a)(1)",
    text: "not later than the 15th day of the fourth month after the month in which the original contractor's work was completed, terminated, or abandoned",
  },
  {
    cite: "Sec. 53.052(a)(2)",
    text: "for residential construction projects, not later than the 15th day of the third month after the month in which the original contractor's work was completed, terminated, or abandoned",
  },
  {
    cite: "Sec. 53.052(b)",
    text: "not later than the 15th day of the fourth month after the later of",
  },
  {
    cite: "Sec. 53.052(b)(1)",
    text: "the month the claimant last provided labor or materials",
  },
  {
    cite: "Sec. 53.052(e)",
    text: "An affidavit under this chapter must be filed in the county where the improvements are located",
  },
  {
    cite: "Sec. 53.055(a)",
    text: "must send a copy of the affidavit to the owner or reputed owner at the owner's last known business or residence address not later than the fifth day after the date the affidavit is filed",
  },
  {
    cite: "Sec. 53.055(b)",
    text: "the person must also send a copy of the affidavit to the original contractor",
  },
  {
    cite: "Sec. 53.158(a)",
    text: "suit must be brought to foreclose the lien not later than the first anniversary of the last day a claimant may file the lien affidavit under Section 53.052",
  },
  {
    cite: "Sec. 53.158(a-2)",
    text: "may be extended to not later than the second anniversary of the date the claimant filed the lien affidavit",
  },
  {
    cite: "Sec. 53.004(c)",
    text: "If notice is sent by certified mail, deposit or mailing of the notice in the United States mail in the form required constitutes compliance with the notice requirement",
  },
  {
    cite: "Sec. 28.002(a)",
    text: "the owner shall pay the amount to the contractor, less any amount withheld as authorized by statute, not later than the 35th day after the date the owner receives the request",
  },
  {
    cite: "Sec. 28.002(b)",
    text: "not later than the seventh day after the date the contractor receives the owner's payment",
  },
  {
    cite: "Sec. 28.004(b)",
    text: "An unpaid amount bears interest at the rate of 1-1/2 percent each month",
  },
];

const S = (cite: string): string => cite.split(" ")[1];

export const texasChapter53Checklist: Tx53ChecklistSection[] = [
  {
    id: "monthly-notices",
    heading: "Monthly Notices",
    statute: "Section 53.056 (as amended by HB 2237, 2022)",
    items: [
      {
        id: "first-furnishing",
        text: "Record the exact first furnishing date in your daily log with timestamp: it proves when your lien rights began and anchors your notice and affidavit timeline.",
        sourceQuotes: [],
      },
      {
        id: "project-type",
        text: "Confirm whether your project is a residential construction project or not. Notice and affidavit deadlines differ (Sections 53.056, 53.052).",
        sourceQuotes: [
          "for residential construction projects, not later than the 15th day of the second month",
        ],
      },
      {
        id: "notice-deadline",
        text: "Send one monthly notice to the property owner and the original contractor by the 15th day of the third month after each month of unpaid labor or materials; for residential construction projects, the deadline is the 15th day of the second month (single notice since HB 2237, effective January 1, 2022).",
        sourceQuotes: [
          "not later than the 15th day of the third month after the month during which",
          "for residential construction projects, not later than the 15th day of the second month after the month during which",
          "the claimant must send a notice of claim for unpaid labor or materials to the owner or reputed owner and the original contractor",
        ],
      },
      {
        id: "mail-method",
        text: "Send the notice by certified mail. Mailing in the form the statute requires constitutes compliance; keep your proof of mailing with postmark date.",
        sourceQuotes: [
          "If notice is sent by certified mail, deposit or mailing of the notice in the United States mail in the form required constitutes compliance with the notice requirement",
        ],
      },
      {
        id: "notice-contents",
        text: "Include claimant name and address, amount claimed, contracting party, type of labor or materials, and property/project identification, following the statutory notice form.",
        sourceQuotes: [
          "Claimant's name",
          "(Claimant's address)",
          "Type of labor or materials provided",
          "Project description and/or address",
          "Claim amount",
          "Original contractor's name",
        ],
      },
    ],
  },
  {
    id: "retainage-notice",
    heading: "Retainage Notice",
    statute: "Section 53.057",
    items: [
      {
        id: "retainage-clock",
        text: "If your contract provides for retainage, calendar the earliest trigger: notice is due within 30 days after your contract is completed, terminated, or abandoned, or within 30 days after the original contract is terminated or abandoned, whichever is earlier.",
        sourceQuotes: [
          "must send the notice of claim for unpaid retainage to the owner or reputed owner and the original contractor not later than the earlier of",
          "the 30th day after the date the claimant's contract is completed, terminated, or abandoned",
          "the 30th day after the date the original contract is terminated or abandoned",
        ],
      },
      {
        id: "reserved-funds-affidavit",
        text: "To claim against the owner's 10 percent reserve, remember the separate short trigger: a lien on reserved funds requires filing the affidavit within 30 days after the earliest of completion, termination, or abandonment (Section 53.103).",
        sourceQuotes: [
          "files an affidavit claiming a lien not later than the 30th day after the earliest of the date",
        ],
      },
      {
        id: "retainage-affidavit-deadline",
        text: "Filing for unpaid retainage: a derivative claimant must file the affidavit by the 15th day of the third month after the month the original contract was completed, terminated, or abandoned (Section 53.052(d)).",
        sourceQuotes: [
          "not later than the 15th day of the third month after the month in which the original contract under which the claimant performed was completed, terminated, or abandoned",
        ],
      },
    ],
  },
  {
    id: "fund-trapping",
    heading: "Reserved Funds (Fund Trapping)",
    statute: "Section 53.101; Subchapter C notices",
    items: [
      {
        id: "reserve-10pct",
        text: "The owner must reserve 10 percent of the contract price or value during the work and for 30 days after completion. Timely monthly notices let you claim against that reserved 10 percent (fund trapping).",
        sourceQuotes: [
          "During the progress of work under an original contract for which a mechanic's lien may be claimed and for 30 days after the work under the contract is completed, the owner shall reserve",
          "10 percent of the contract price of the work to the owner",
        ],
      },
      {
        id: "funds-remain",
        text: "Send monthly notices for every month of unpaid work: the 10 percent reserve protects you only while funds remain and your notices are timely.",
        sourceQuotes: [
          "During the progress of work under an original contract for which a mechanic's lien may be claimed and for 30 days after the work under the contract is completed, the owner shall reserve",
        ],
      },
    ],
  },
  {
    id: "retainage",
    heading: "Prompt Payment (separate from lien rights)",
    statute: "Chapter 28, Prompt Payment Act",
    items: [
      {
        id: "owner-35day",
        text: "On a proper written payment request, the owner must pay the contractor by the 35th day after the owner receives the request (Prompt Payment Act).",
        sourceQuotes: [
          "the owner shall pay the amount to the contractor, less any amount withheld as authorized by statute, not later than the 35th day after the date the owner receives the request",
        ],
      },
      {
        id: "downstream-7day",
        text: "A contractor who receives an owner payment must pay each subcontractor its share within 7 days after receiving that payment (Prompt Payment Act).",
        sourceQuotes: [
          "not later than the seventh day after the date the contractor receives the owner's payment",
        ],
      },
      {
        id: "penalty-interest",
        text: "Unpaid amounts under the Prompt Payment Act accrue interest at 1-1/2 percent per month once payment is overdue.",
        sourceQuotes: [
          "An unpaid amount bears interest at the rate of 1-1/2 percent each month",
        ],
      },
    ],
  },
  {
    id: "lien-affidavit",
    heading: "Lien Affidavit",
    statute: "Sections 53.052, 53.055",
    items: [
      {
        id: "verify-notices",
        text: "Verify all monthly notices were timely sent, then prepare the lien affidavit with the statutory requirements.",
        sourceQuotes: [],
      },
      {
        id: "filing-deadline",
        text: "File the sworn affidavit in the county of the improvements: original contractor, 15th day of the fourth month after completion; derivative claimant, 15th day of the fourth month after last furnishing; residential projects, 15th day of the third month after that anchor (Sections 53.052(a)-(c)).",
        sourceQuotes: [
          "not later than the 15th day of the fourth month after the month in which the original contractor's work was completed, terminated, or abandoned",
          "for residential construction projects, not later than the 15th day of the third month after the month in which the original contractor's work was completed, terminated, or abandoned",
          "not later than the 15th day of the fourth month after the later of",
          "the month the claimant last provided labor or materials",
          "An affidavit under this chapter must be filed in the county where the improvements are located",
        ],
      },
      {
        id: "affidavit-contents",
        text: "Include a sworn statement of the amount claimed, the property description, and the owner and claimant names and addresses, following the statutory affidavit requirements.",
        sourceQuotes: [],
      },
      {
        id: "copy-and-enforcement",
        text: "Send the filed affidavit copy to the owner and original contractor within 5 days (Section 53.055), and calendar foreclosure: suit is generally due within one year of the last affidavit-filing day, extendable to two years only by recorded agreement (Section 53.158).",
        sourceQuotes: [
          "must send a copy of the affidavit to the owner or reputed owner at the owner's last known business or residence address not later than the fifth day after the date the affidavit is filed",
          "the person must also send a copy of the affidavit to the original contractor",
          "suit must be brought to foreclose the lien not later than the first anniversary of the last day a claimant may file the lien affidavit under Section 53.052",
          "may be extended to not later than the second anniversary of the date the claimant filed the lien affidavit",
        ],
      },
    ],
  },
  {
    id: "evidence",
    heading: "Evidence File",
    statute: "Practice discipline (not a statute citation)",
    items: [
      {
        id: "daily-log",
        text: "Log date of work, crew members present, materials delivered, weather, and work completed contemporaneously, and attach GPS-tagged photos and signed delivery receipts: these prove furnishing dates and the amount claimed.",
        sourceQuotes: [],
      },
    ],
  },
];
