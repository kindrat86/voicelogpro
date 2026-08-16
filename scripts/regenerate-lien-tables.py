#!/usr/bin/env python3
"""Reconcile the lien datasets to ONE source of truth.

Reads scripts/_unified-lien-data.json (the externally-corroborated dataset: exact
per-state deadlines + statutory citation + last-verified date) and regenerates:
  1. the three markdown tables in the cheat-sheet article,
  2. the now-contradictory prose ("no preliminary notice" list, "longest filing"
     table, "strictest" numbers, and an unsourced "national average" claim),
  3. public/lien-law-deadlines-2026.csv.
The build pipeline (build-lien-dataset.mjs -> state pages -> calculator) then
re-derives JSON, the 51 state pages, and the calculator from the corrected tables.

Faithful trigger-wording normalisation only (number/unit never changes):
  'after first work'      -> 'from first furnishing'
  'after last work'       -> 'from last furnishing'
"""
import json, re
from collections import OrderedDict

U = "scripts/_unified-lien-data.json"
SHEET = "src/content/blog/construction-lien-deadlines-cheat-sheet.ts"
CSV = "public/lien-law-deadlines-2026.csv"

data = json.load(open(U))
by = {r["state"]: r for r in data}

ORDER = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado",
"Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii",
"Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine",
"Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri",
"Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
"New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
"Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
"Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin",
"Wyoming"]
ABBR = {"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA",
"Colorado":"CO","Connecticut":"CT","Delaware":"DE","District of Columbia":"DC",
"Florida":"FL","Georgia":"GA","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN",
"Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD",
"Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO",
"Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ",
"New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND","Ohio":"OH",
"Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC",
"South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA",
"Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY"}

def md_state(s): return "Washington DC" if s == "District of Columbia" else s

def norm(s):
    s = s.replace("after first work", "from first furnishing")
    s = s.replace("after last work", "from last furnishing")
    s = s.replace("after first furnishing", "from first furnishing")
    s = s.replace("after last furnishing", "from last furnishing")
    s = s.replace("before first work", "before first furnishing")
    return s

def not_required(v): return bool(re.search(r"not required", v, re.I))

# ---- 1. preliminary notice table (per-state) ----
prelim = ["| State | Preliminary Notice? | Deadline | Notes |",
          "|-------|-------------------|----------|-------|"]
for s in ORDER:
    r = by[s]; v = r["preliminaryNoticeDeadline"]
    if not_required(v):
        yesno = "No"; dl = "N/A"; note = re.sub(r"not required", "No notice required", v, flags=re.I)
    else:
        yesno = "Yes"; dl = norm(v); note = ""
    prelim.append(f"| {md_state(s)} | {yesno} | {dl} | {note} |")

# ---- 2. filing table (grouped by exact value) ----
fg = OrderedDict()
for s in ORDER: fg.setdefault(norm(by[s]["lienFilingDeadline"]), []).append(md_state(s))
filing = ["| Lien Filing Deadline | States |", "|---------------------|--------|"]
for v, sts in fg.items(): filing.append(f"| **{v}** | {', '.join(sts)} |")

# ---- 3. enforcement table ----
eg = OrderedDict()
for s in ORDER: eg.setdefault(norm(by[s]["enforcementDeadline"]), []).append(md_state(s))
enf = ["| Enforcement Deadline | States |", "|----------------------|--------|"]
for v, sts in eg.items(): enf.append(f"| **{v}** | {', '.join(sts)} |")

# ---- 4. derived prose: no-notice list ----
full = [s for s in ORDER if by[s]["preliminaryNoticeDeadline"].strip().lower() == "not required"]
partial = [s for s in ORDER if not_required(by[s]["preliminaryNoticeDeadline"])
           and by[s]["preliminaryNoticeDeadline"].strip().lower() != "not required"]
def join_states(names): 
    return ", ".join(md_state(s) for s in names)
no_notice_line = (f"{len(full)} states require no preliminary notice for private projects: "
    f"{join_states(full)}. A further {len(partial)} require notice only in specific "
    f"situations: {join_states(partial)}.")

# ---- 5. derived prose: longest filing windows (top, from data) ----
def filing_months(v):
    m = re.search(r"(\d+)\s*months", v)
    if m: return float(m.group(1))
    m = re.search(r"(\d+)\s*days", v)
    if m: return round(int(m.group(1)) / 30.0, 1)
    return 0.0
longest = sorted(ORDER, key=lambda s: filing_months(by[s]["lienFilingDeadline"]) or 0, reverse=True)[:8]
longest_lines = ["| Rank | State | Filing Window | Note |",
                 "|------|-------|---------------|------|"]
for i, s in enumerate(longest, 1):
    longest_lines.append(f"| {i} | {md_state(s)} | {norm(by[s]['lienFilingDeadline'])} | |")

# ---- apply via line-targeted replacement ----
lines = open(SHEET).read().split("\n")

def replace_table(lines, header_text, new_table):
    """Replace the contiguous |...| table (starting at header_text) with new_table."""
    out, i, replaced = [], 0, False
    while i < len(lines):
        if lines[i].strip() == header_text:
            j = i
            while j < len(lines) and lines[j].lstrip().startswith("|"):
                j += 1
            out.extend(new_table)
            i = j
            replaced = True
            continue
        out.append(lines[i])
        i += 1
    assert replaced, f"header not found: {header_text}"
    return out

lines = replace_table(lines, "| State | Preliminary Notice? | Deadline | Notes |", prelim)
lines = replace_table(lines, "| Deadline Range | States |", filing)
lines = replace_table(lines, "| Enforcement Window | States |", enf)
lines = replace_table(lines, "| Rank | State | Filing Window | Why It Matters |", longest_lines)

# replace the no-notice prose list (the bare comma-list line following its short answer)
out = []
for i, l in enumerate(lines):
    if l.strip().startswith("Alabama, Arkansas, Connecticut, Georgia, Idaho,"):
        out.append(no_notice_line); continue
    out.append(l)
lines = out

# fix strictest-compliance table: Texas notice deadline cell + remove unsourced average
out = []
for l in lines:
    if "15th of 3rd month" in l:
        l = l.replace("15th of 3rd month", "15th of 2nd month (monthly)")
    if "National average comparison" in l:
        continue  # drop unsourced "average US state requires..." claim (5.1)
    if "20 states do not require any preliminary notice" in l:
        l = l.replace("20 states do not require any preliminary notice",
                      f"{len(full)} states do not require any preliminary notice")
    out.append(l)
lines = out

open(SHEET, "w").write("\n".join(lines))

# ---- 6. CSV ----
import csv as _csv
with open(CSV, "w", newline="") as f:
    w = _csv.DictWriter(f, fieldnames=["State","Abbr","Preliminary Notice Deadline",
        "Lien Filing Deadline","Enforcement Deadline","Statute Citation",
        "Statute URL","Last Verified","Special Notes"])
    w.writeheader()
    for s in ORDER:
        r = by[s]
        pv = r["preliminaryNoticeDeadline"]
        w.writerow({
            "State": s, "Abbr": ABBR[s],
            "Preliminary Notice Deadline": "N/A" if not_required(pv) else norm(pv),
            "Lien Filing Deadline": norm(r["lienFilingDeadline"]),
            "Enforcement Deadline": norm(r["enforcementDeadline"]),
            "Statute Citation": r.get("statute",""),
            "Statute URL": r.get("statuteUrl",""),
            "Last Verified": r.get("lastVerified",""),
            "Special Notes": r.get("notes",""),
        })

print(f"filing groups={len(fg)} enforcement groups={len(eg)} prelim rows={len(prelim)-2}")
print(f"no-notice full={len(full)} partial={len(partial)}")
print(f"longest filing: {[md_state(s) for s in longest]}")
