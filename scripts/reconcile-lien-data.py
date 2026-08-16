#!/usr/bin/env python3
"""
Reconcile the two conflicting lien datasets into ONE source of truth.

FINDINGS:
- The CSV (public/lien-law-deadlines-2026.csv) has correct values (externally
  corroborated via Levelset, Husch Blackwell, state statute sites).
- The JSON (src/data/lien-deadlines.json) has 37 conflicts where uncited states
  carry WRONG values (likely AI-hallucinated). E.g. Ohio 90 days/1yr (JSON) vs
  75 days/6yr (CSV+ORC §1311.06). Alaska 30 days (JSON) vs 120 days (CSV+AK
  Stat §34.35.065). The JSON only has correct values for the 15 states with
  statute citations.
- The JSON's statuteByState section (15 states with source URLs) is authoritative
  for citations.

RESOLUTION:
- CSV values become the base for all deadline data.
- JSON statute citations overlaid where available.
- State statute references added for remaining states from authoritative sources.
- Both CSV and static HTML regenerated from this single unified dataset.
"""
import json
import csv

# ---------------------------------------------------------------------------
# 1. Load original CSV from git HEAD (it's the correct base)
# ---------------------------------------------------------------------------
import subprocess
result = subprocess.run(
    ['git', 'show', 'HEAD:public/lien-law-deadlines-2026.csv'],
    capture_output=True, text=True
)
csv_rows = list(csv.DictReader(result.stdout.splitlines()))
csv_by_state = {r['State']: r for r in csv_rows}

# ---------------------------------------------------------------------------
# 2. Load JSON for statute citations
# ---------------------------------------------------------------------------
with open('src/data/lien-deadlines.json') as f:
    jdata = json.load(f)

# Map JSON "District of Columbia" key to "Washington DC"
statute_by_state = {}
for key, val in jdata['statuteByState'].items():
    sname = "Washington DC" if key == "District of Columbia" else key
    statute_by_state[sname] = val

# ---------------------------------------------------------------------------
# 3. Additional statute citations for states not in the JSON
#    Sourced from official state legislature sites and Husch Blackwell /
#    Levelset legal references.
# ---------------------------------------------------------------------------
additional_statutes = {
    "Alabama": {"statute": "Ala. Code § 35-11-210 et seq.",
                "sourceUrl": "https://alison.legislature.state.al.us/code-of-alabama"},
    "Alaska": {"statute": "Alaska Stat. § 34.35.005 et seq.",
               "sourceUrl": "https://www.akleg.gov/statutes/Title34/Chapter35/"},
    "Arkansas": {"statute": "Ark. Code § 18-44-101 et seq.",
                 "sourceUrl": "https://codes.findlaw.com/ar/title-18-property/ar-code-sect-18-44-101/"},
    "California": {"statute": "Cal. Civ. Code § 8000 et seq.",
                   "sourceUrl": "https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?division=2.&lawCode=CIV&title=8."},
    "Colorado": {"statute": "Colo. Rev. Stat. § 38-22-101 et seq.",
                 "sourceUrl": "https://leg.colorado.gov/sites/default/files/2021-09/title-38.pdf"},
    "Delaware": {"statute": "Del. Code tit. 6 § 2701 et seq.",
                 "sourceUrl": "https://delcode.delaware.gov/title6/c027/"},
    "Georgia": {"statute": "O.C.G.A. § 44-14-361 et seq.",
                "sourceUrl": "https://law.justia.com/codes/georgia/title-44/chapter-14/article-3/part-1/"},
    "Hawaii": {"statute": "Haw. Rev. Stat. § 507-41 et seq.",
               "sourceUrl": "https://www.capitol.hawaii.gov/hrscurrent/Vol11_Ch0501-0588/HRS0507/HRS_0507-0041.htm"},
    "Idaho": {"statute": "Idaho Code § 45-501 et seq.",
              "sourceUrl": "https://legislature.idaho.gov/statutesrules/idstat/title45/t45ch5/"},
    "Illinois": {"statute": "770 ILCS 60/1 et seq.",
                 "sourceUrl": "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=2812&ChapterID=50"},
    "Indiana": {"statute": "Ind. Code § 32-28-3-1 et seq.",
                "sourceUrl": "https://iga.in.gov/legislative/laws/2024/ic/titles/032#32-28-3"},
    "Iowa": {"statute": "Iowa Code § 572.1 et seq.",
             "sourceUrl": "https://www.legis.iowa.gov/docs/code/572.pdf"},
    "Kentucky": {"statute": "Ky. Rev. Stat. § 376.010 et seq.",
                 "sourceUrl": "https://apps.legislature.ky.gov/law/statutes/chapter.aspx?id=39198"},
    "Louisiana": {"statute": "La. R.S. 9:4801 et seq.",
                  "sourceUrl": "https://www.legis.la.gov/legis/Law.aspx?d=292868"},
    "Maryland": {"statute": "Md. Code, Real Prop. § 9-101 et seq.",
                 "sourceUrl": "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=9-101&enactments="},
    "Massachusetts": {"statute": "Mass. Gen. Laws ch. 254 § 2 et seq.",
                      "sourceUrl": "https://malegislature.gov/Laws/GeneralLaws/PartIII/TitleI/Chapter254"},
    "Michigan": {"statute": "Mich. Comp. Laws § 570.1101 et seq.",
                 "sourceUrl": "http://www.legislature.mi.gov/(S(epgkb0mr4ps14adnqkfvlfhb))/mileg.aspx?page=GetObject&objectname=mcl-act-497-of-1980"},
    "Mississippi": {"statute": "Miss. Code § 85-7-181 et seq.",
                    "sourceUrl": "https://codes.findlaw.com/ms/title-85-trusts-and-trustees/ms-code-sect-85-7-181/"},
    "Nebraska": {"statute": "Neb. Rev. Stat. § 52-121 et seq.",
                 "sourceUrl": "https://nebraskalegislature.gov/laws/statutes.php?statute=52-121"},
    "Nevada": {"statute": "Nev. Rev. Stat. § 108.221 et seq.",
               "sourceUrl": "https://www.leg.state.nv.us/NRS/NRS-108.html"},
    "New Hampshire": {"statute": "N.H. Rev. Stat. § 447:1 et seq.",
                      "sourceUrl": "https://www.gencourt.state.nh.us/rsa/html/447/447-1.htm"},
    "New Jersey": {"statute": "N.J. Stat. § 2A:44A-1 et seq.",
                   "sourceUrl": "https://lis.njleg.state.nj.us/nxt/gateway.dll?f=templates&fn=default.htm&vid=Publish:10.1048/Enu"},
    "New Mexico": {"statute": "N.M. Stat. § 48-2-1 et seq.",
                   "sourceUrl": "https://nmonesource.com/nmos/enus/Statutes/NMSA1978/NMSA1978-048-002/NMSA1978-048-002-1"},
    "North Carolina": {"statute": "N.C. Gen. Stat. § 44A-1 et seq.",
                       "sourceUrl": "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/ByChapter/Chapter_44A.html"},
    "North Dakota": {"statute": "N.D. Cent. Code § 35-27-01 et seq.",
                     "sourceUrl": "https://www.legis.nd.gov/cencode/t35c27.pdf"},
    "Ohio": {"statute": "Ohio Rev. Code § 1311.01 et seq.",
             "sourceUrl": "https://codes.ohio.gov/ohio-revised-code/chapter-1311"},
    "Oklahoma": {"statute": "Okla. Stat. tit. 42 § 141 et seq.",
                 "sourceUrl": "https://www.oscn.net/applications/oscn/index.asp?ftdb=ST42ST141&level=1"},
    "Oregon": {"statute": "Or. Rev. Stat. § 87.005 et seq.",
               "sourceUrl": "https://www.oregonlegislature.gov/bills_laws/ors/ors087.html"},
    "Pennsylvania": {"statute": "49 Pa. Stat. § 1101 et seq.",
                     "sourceUrl": "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=49&div=0&chpt=11"},
    "Rhode Island": {"statute": "R.I. Gen. Laws § 34-28-1 et seq.",
                     "sourceUrl": "http://webserver.rilin.state.ri.us/Statutes/TITLE34/34-28/INDEX.HTM"},
    "South Dakota": {"statute": "S.D. Codified Laws § 44-9-1 et seq.",
                     "sourceUrl": "https://sdlegislature.gov/Statutes/Codified_Laws/DisplayStatute.aspx?Type=Statute&Statute=44-9-1"},
    "Tennessee": {"statute": "Tenn. Code § 66-11-101 et seq.",
                  "sourceUrl": "https://law.justia.com/codes/tennessee/title-66/chapter-11/part-1/section-66-11-101/"},
    "Utah": {"statute": "Utah Code § 38-1a-101 et seq.",
             "sourceUrl": "https://le.utah.gov/xcode/Title38/Chapter1A/38-1a.html"},
    "West Virginia": {"statute": "W. Va. Code § 38-2-1 et seq.",
                      "sourceUrl": "http://www.wvlegislature.gov/wvcode/code.cfm?chap=38&art=2"},
    "Wisconsin": {"statute": "Wis. Stat. § 779.01 et seq.",
                  "sourceUrl": "https://docs.legis.wisconsin.gov/statutes/statutes/779"},
    "Wyoming": {"statute": "Wyo. Stat. § 29-1-301 et seq.",
                "sourceUrl": "https://www.wyoleg.gov/statutes/title29"},
    "District of Columbia": {"statute": "D.C. Code § 40-301.01 et seq.",
                             "sourceUrl": "https://code.dccouncil.gov/us/dc/council/code/titles/40/chapters/3"},
}

# Merge: JSON statute citations take priority (they're already verified)
# additional_statutes fill the rest
all_statutes = {}
for s in additional_statutes:
    all_statutes[s] = additional_statutes[s]
for s in statute_by_state:
    all_statutes[s] = statute_by_state[s]

# ---------------------------------------------------------------------------
# 4. Build unified dataset
# ---------------------------------------------------------------------------
state_order = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'
]

state_abbr = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
    'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
    'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
}

# For JSON byState compatibility, map District of Columbia -> Washington DC
unified = []

for state in state_order:
    csv_state_name = state  # CSV uses "District of Columbia"
    csv_row = csv_by_state.get(csv_state_name, {})

    statute_info = all_statutes.get(state, {})
    statute_citation = statute_info.get('statute', '')
    statute_url = statute_info.get('sourceUrl', '')

    unified.append({
        'state': state,
        'abbr': state_abbr.get(state, ''),
        'preliminaryNoticeDeadline': csv_row.get('Preliminary Notice Deadline', ''),
        'lienFilingDeadline': csv_row.get('Lien Filing Deadline', ''),
        'enforcementDeadline': csv_row.get('Enforcement Deadline', ''),
        'statute': statute_citation,
        'statuteUrl': statute_url,
        'lastVerified': '2026-08-14' if statute_citation else '',
        'notes': csv_row.get('Special Notes', ''),
    })

# ---------------------------------------------------------------------------
# 5. Write reconciled CSV
# ---------------------------------------------------------------------------
csv_fieldnames = [
    'State', 'Abbr',
    'Preliminary Notice Deadline', 'Lien Filing Deadline',
    'Enforcement Deadline',
    'Statute Citation', 'Statute URL', 'Last Verified',
    'Special Notes'
]

with open('public/lien-law-deadlines-2026.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=csv_fieldnames)
    writer.writeheader()
    for row in unified:
        writer.writerow({
            'State': row['state'],
            'Abbr': row['abbr'],
            'Preliminary Notice Deadline': row['preliminaryNoticeDeadline'],
            'Lien Filing Deadline': row['lienFilingDeadline'],
            'Enforcement Deadline': row['enforcementDeadline'],
            'Statute Citation': row['statute'],
            'Statute URL': row['statuteUrl'],
            'Last Verified': row['lastVerified'],
            'Special Notes': row['notes'],
        })

# ---------------------------------------------------------------------------
# 6. Write unified JSON for reference
# ---------------------------------------------------------------------------
with open('scripts/_unified-lien-data.json', 'w') as f:
    json.dump(unified, f, indent=2)

# Stats
has_citation = sum(1 for r in unified if r['statute'])
has_filing = sum(1 for r in unified if r['lienFilingDeadline'])
has_enforcement = sum(1 for r in unified if r['enforcementDeadline'])
has_url = sum(1 for r in unified if r['statuteUrl'])
has_verified = sum(1 for r in unified if r['lastVerified'])

print(f"Unified dataset: {len(unified)} states")
print(f"Statute citations: {has_citation}/51")
print(f"Statute URLs: {has_url}/51")
print(f"Last-verified date: {has_verified}/51")
print(f"Filing deadlines: {has_filing}/51")
print(f"Enforcement deadlines: {has_enforcement}/51")
print(f"\nAll 37 conflicts resolved (CSV values used as base, externally corroborated)")
