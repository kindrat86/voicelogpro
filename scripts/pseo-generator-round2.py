#!/usr/bin/env python3
"""Greg Isenberg pSEO Round 2: voicelogpro.com — best-of lists, FAQs, weekly reports, missing hubs"""

import os

DOMAIN = "https://voicelogpro.com"
BRAND = "Voice Log Pro"
OUT = os.path.expanduser("~/voicelogpro/public")
PAGES = []

def page(section, slug, html):
    PAGES.append((section, slug, html))

# ═══════════════════════════════════════════════════════════════
# TYPE 1: /best/ pages — "best construction daily report app for [trade]"
# ═══════════════════════════════════════════════════════════════

BEST_PAGES = [
    ("electricians", "Electricians", ["Voice Log Pro — Voice-first daily reports built for electricians", "Raken — Good mobile app but built for GCs", "Procore — Enterprise-grade, expensive for small shops"]),
    ("general-contractors", "General Contractors", ["Voice Log Pro — Fastest daily reports with voice-to-PDF", "Procore — Full project management suite", "Buildertrend — Residential construction focus"]),
    ("plumbers", "Plumbers", ["Voice Log Pro — Voice reports for rough-in and finish work", "Raken — Decent daily log feature", "Fieldwire — Task management with reports"]),
    ("roofers", "Roofers", ["Voice Log Pro — Weather-verified roof reports from voice", "RoofSnap — Roofing-specific measurement + reports", "AccuLynx — Roofing CRM with daily logs"]),
    ("hvac-contractors", "HVAC Contractors", ["Voice Log Pro — Quick voice logs for ductwork and units", "ServiceTitan — HVAC dispatch + reporting", "Housecall Pro — Service business management"]),
]

for slug, trade, top_picks in BEST_PAGES:
    picks_html = "\n".join(f"<li>{p}</li>" for p in top_picks)
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Best Construction Daily Report App for {trade} (2026) | {BRAND}</title>
<meta name="description" content="The best daily construction report apps for {trade} in 2026. Compared by features, pricing, and ease of use. See why {trade} choose Voice Log Pro.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{DOMAIN}/best/{slug}/">
<meta property="og:title" content="Best Daily Report App for {trade} | 2026 Comparison">
<meta property="og:description" content="Top-rated construction daily report apps for {trade}. Features, pricing, and honest reviews.">
<meta property="og:type" content="article">
<meta property="og:url" content="{DOMAIN}/best/{slug}/">
<script type="application/ld+json">{{
  "@context":"https://schema.org","@type":"Article",
  "headline":"Best Construction Daily Report App for {trade} (2026)",
  "description":"Comparison of the best daily report apps for {trade}.",
  "author":{{"@type":"Organization","name":"{BRAND}"}},
  "publisher":{{"@type":"Organization","name":"{BRAND}","url":"{DOMAIN}"}},
  "datePublished":"2026-07-13"
}}</script>
<script type="application/ld+json">{{
  "@context":"https://schema.org","@type":"BreadcrumbList",
  "itemListElement":[
    {{"@type":"ListItem","position":1,"name":"Home","item":"{DOMAIN}/"}},
    {{"@type":"ListItem","position":2,"name":"Best Of","item":"{DOMAIN}/best/"}},
    {{"@type":"ListItem","position":3,"name":"Best for {trade}"}}
  ]
}}</script>
<script type="application/ld+json">{{
  "@context":"https://schema.org","@type":"FAQPage",
  "mainEntity":[
    {{"@type":"Question","name":"What is the best daily report app for {trade}?","acceptedAnswer":{{"@type":"Answer","text":"Voice Log Pro is the best for {trade} because it's voice-first — speak your report from the job site and get a court-ready PDF instantly. No typing required."}}}},
    {{"@type":"Question","name":"How much does a daily report app cost for {trade}?","acceptedAnswer":{{"@type":"Answer","text":"Voice Log Pro costs $49/month for unlimited reports. Most competitors charge $99-$599/month and require typing."}}}}
  ]
}}</script>
</head>
<body>
<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">
<h1>Best Construction Daily Report App for {trade} (2026)</h1>
<p><strong>TL;DR:</strong> The 3 best daily report apps for {trade} are: {', '.join(top_picks[:3])}.</p>

<h2>Our Top Picks for {trade}</h2>
<ol>
{picks_html}
</ol>

<h2>Why Voice Log Pro Wins for {trade}</h2>
<p>Voice Log Pro is purpose-built for {trade} who work with their hands. While other apps require you to type on a tiny phone screen while wearing work gloves, Voice Log Pro lets you speak your daily report in 60 seconds. The app handles the rest: timestamps, weather data, photo attachments, and professional PDF formatting.</p>

<h2>How We Evaluated</h2>
<p>We compared each app on: ease of use on a job site, speed of report creation, legal documentation quality, pricing transparency, and mobile experience. Voice Log Pro wins on speed and ease of use because it eliminates typing entirely.</p>

<h2>Frequently Asked Questions</h2>
<h3>Can I use Voice Log Pro if I have no cell service?</h3>
<p>Yes. Reports are cached offline and upload automatically when you're back in range. Your timestamp is locked at the moment you speak, not when you upload.</p>

<nav style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb">
<p style="margin-top:16px"><a href="{DOMAIN}/crew-plan" style="display:inline-block;background:#0066cc;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700">Get Crew Plan — $49/month →</a></p>
</nav>
</main>
</body>
</html>'''
    page("best", slug, html)

# ═══════════════════════════════════════════════════════════════
# TYPE 2: /faq/ — AEO goldmine
# ═══════════════════════════════════════════════════════════════

FAQ_ENTRIES = [
    ("what-is-a-daily-construction-report", "What is a daily construction report?", "A daily construction report is a contemporaneous written record of work performed, crew on site, materials delivered, weather conditions, equipment used, and any issues or delays on a construction project. It serves as legal documentation for payment disputes, lien claims, and project records.", ["project name and date", "weather conditions", "crew members and hours", "work performed summary", "materials and equipment", "delays or issues", "safety observations"]),
    ("who-needs-daily-construction-reports", "Who needs daily construction reports?", "Subcontractors, general contractors, and project managers need daily construction reports. They are critical for mechanics lien claims, payment disputes, insurance claims, and OSHA compliance documentation. Every subcontractor who wants to protect their payment rights should maintain daily reports.", ["Subcontractors (electricians, plumbers, HVAC, roofers)", "General contractors documenting project progress", "Project managers tracking schedule and costs", "Insurance and legal teams needing evidence"]),
    ("are-daily-construction-reports-legal-documents", "Are daily construction reports legal documents?", "Yes. Contemporaneous daily construction reports are admissible as evidence in payment disputes, mechanics lien claims, and construction defect litigation. Courts consider timestamped, weather-verified daily reports to be the most reliable form of construction documentation. Hand-written notes filled out days later carry less weight.", ["Mechanics lien claims — proving work dates", "Payment disputes — documenting completed work", "Construction defect cases — documenting conditions", "Delay claims — showing weather and site impacts"]),
    ("how-long-to-keep-construction-daily-reports", "How long should I keep construction daily reports?", "Retain daily construction reports for a minimum of 7 years. Mechanics lien enforcement periods vary by state (6 months to 6 years). Construction defect statutes of limitations can extend 10+ years. Digital daily reports (like Voice Log Pro) are stored indefinitely in the cloud with timestamps.", ["Minimum 7 years for general records", "10+ years for defect claims", "Until project warranty expires", "Indefinitely if stored digitally"]),
    ("what-makes-a-good-daily-report", "What makes a good daily construction report?", "A good daily report is: contemporaneous (created same day), detailed (specific work descriptions), verified (weather, timestamps, photos), and consistent (same format every day). Voice Log Pro meets all criteria automatically from a voice note — no typing, no office, no laptop.", ["Contemporaneous — created on the same day", "Specific — detailed work descriptions, not vague summaries", "Verified — timestamps, weather data, photos", "Consistent — same format every day for easy comparison"]),
]

for slug, question, answer, bullet_list in FAQ_ENTRIES:
    bullets = "\n".join(f"<li>{b}</li>" for b in bullet_list)
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{question} | {BRAND}</title>
<meta name="description" content="{answer[:155]}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{DOMAIN}/faq/{slug}/">
<meta property="og:title" content="{question}">
<meta property="og:description" content="{answer[:200]}">
<meta property="og:type" content="article">
<meta property="og:url" content="{DOMAIN}/faq/{slug}/">
<script type="application/ld+json">{{
  "@context":"https://schema.org","@type":"FAQPage",
  "mainEntity":[{{"@type":"Question","name":"{question}","acceptedAnswer":{{"@type":"Answer","text":"{answer}"}}}}]
}}</script>
<script type="application/ld+json">{{
  "@context":"https://schema.org","@type":"BreadcrumbList",
  "itemListElement":[
    {{"@type":"ListItem","position":1,"name":"Home","item":"{DOMAIN}/"}},
    {{"@type":"ListItem","position":2,"name":"FAQ","item":"{DOMAIN}/faq/"}},
    {{"@type":"ListItem","position":3,"name":"{question[:30]}..."}}
  ]
}}</script>
</head>
<body>
<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">
<h1>{question}</h1>
<p><strong>TL;DR:</strong> {answer}</p>
<p>{answer}</p>
<h2>Key Points</h2>
<ul>{bullets}</ul>
<nav style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb">
<p style="font-size:14px;color:#6b7280">More FAQ: <a href="{DOMAIN}/faq/what-is-a-daily-construction-report/">What is a daily report?</a> · <a href="{DOMAIN}/faq/who-needs-daily-construction-reports/">Who needs them?</a> · <a href="{DOMAIN}/faq/are-daily-construction-reports-legal-documents/">Are they legal?</a></p>
<p style="margin-top:16px"><a href="{DOMAIN}/crew-plan" style="display:inline-block;background:#0066cc;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700">Get Crew Plan — $49/month →</a></p>
</nav>
</main>
</body>
</html>'''
    page("faq", slug, html)

# ═══════════════════════════════════════════════════════════════
# TYPE 3: /weekly-reports/ — "weekly construction report template"
# ═══════════════════════════════════════════════════════════════

WEEKLY = [
    ("general-contractor", "General Contractor", "subcontractor coordination, schedule tracking, and owner updates", ["Daily reports compiled Mon-Fri", "Weekly progress summary vs baseline schedule", "Materials delivered and installed", "RFIs and change orders processed", "Safety incidents and near-misses", "Weather impact on schedule", "Photos of completed work"]),
    ("electrical-subcontractor", "Electrical Subcontractor", "conduit runs, panel installations, and circuit testing", ["Daily circuits/panels completed", "Weekly wire pulls (gauge and length)", "Inspection results (passed/failed)", "Materials consumed vs ordered", "Crew hours by task code"]),
    ("roofing-subcontractor", "Roofing Subcontractor", "squares installed, underlayment, and weather documentation", ["Daily squares installed", "Roof sections completed (sq ft)", "Weather days and temperature logs", "Materials used vs remaining", "Inspection-ready sections"]),
]

for slug, trade, context, fields in WEEKLY:
    fields_html = "\n".join(f"<li>{f}</li>" for f in fields)
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{trade} Weekly Construction Report Template | {BRAND}</title>
<meta name="description" content="Free weekly construction report template for {trade}. Includes {', '.join(fields[:3])}. Voice Log Pro compiles weekly reports automatically from daily voice notes.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{DOMAIN}/weekly-reports/{slug}/">
<meta property="og:title" content="{trade} Weekly Report Template | {BRAND}">
<meta property="og:description" content="Free weekly construction report template for {trade}.">
<meta property="og:type" content="article">
<meta property="og:url" content="{DOMAIN}/weekly-reports/{slug}/">
<script type="application/ld+json">{{
  "@context":"https://schema.org","@type":"Article",
  "headline":"{trade} Weekly Construction Report Template",
  "description":"{context}. Free template with Voice Log Pro automation.",
  "author":{{"@type":"Organization","name":"{BRAND}"}},
  "publisher":{{"@type":"Organization","name":"{BRAND}","url":"{DOMAIN}"}},
  "datePublished":"2026-07-13"
}}</script>
<script type="application/ld+json">{{
  "@context":"https://schema.org","@type":"BreadcrumbList",
  "itemListElement":[
    {{"@type":"ListItem","position":1,"name":"Home","item":"{DOMAIN}/"}},
    {{"@type":"ListItem","position":2,"name":"Weekly Report Templates","item":"{DOMAIN}/weekly-reports/"}},
    {{"@type":"ListItem","position":3,"name":"{trade}"}}
  ]
}}</script>
<script type="application/ld+json">{{
  "@context":"https://schema.org","@type":"FAQPage",
  "mainEntity":[
    {{"@type":"Question","name":"How do I compile a weekly report from daily reports?","acceptedAnswer":{{"@type":"Answer","text":"Voice Log Pro automatically compiles your daily voice notes into a weekly summary. Just speak your daily report each day — the app aggregates everything into the weekly format automatically."}}}},
    {{"@type":"Question","name":"What should a {trade} weekly report include?","acceptedAnswer":{{"@type":"Answer","text":"A complete weekly report includes: {', '.join(fields[:4])}."}}}}
  ]
}}</script>
</head>
<body>
<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">
<h1>{trade} Weekly Construction Report Template</h1>
<p><strong>TL;DR:</strong> This weekly template covers {context}. Voice Log Pro compiles it automatically from your daily voice notes — no manual aggregation needed.</p>

<h2>Weekly Report Fields</h2>
<ol>{fields_html}</ol>

<h2>How Voice Log Pro Automates Weekly Reports</h2>
<p>Instead of manually compiling 5 daily reports into a weekly summary, Voice Log Pro does it automatically. Speak your daily report each day — the app aggregates all data points into a professional weekly PDF with totals, trends, and photo highlights. No spreadsheets, no copy-paste.</p>

<nav style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb">
<p style="margin-top:16px"><a href="{DOMAIN}/crew-plan" style="display:inline-block;background:#0066cc;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700">Get Crew Plan — $49/month →</a></p>
</nav>
</main>
</body>
</html>'''
    page("weekly-reports", slug, html)

# ═══════════════════════════════════════════════════════════════
# HUB PAGES for all missing clusters
# ═══════════════════════════════════════════════════════════════

HUBS = {
    "faq": ("Construction Daily Report FAQ | Voice Log Pro", "Answers to the most common questions about construction daily reports, lien documentation, and payment protection.",
        [("what-is-a-daily-construction-report", "What is a daily construction report?"),
         ("who-needs-daily-construction-reports", "Who needs daily construction reports?"),
         ("are-daily-construction-reports-legal-documents", "Are daily construction reports legal documents?"),
         ("how-long-to-keep-construction-daily-reports", "How long should I keep daily reports?"),
         ("what-makes-a-good-daily-report", "What makes a good daily report?")]),
    "weekly-reports": ("Weekly Construction Report Templates | Voice Log Pro", "Free weekly report templates for every trade. Compiled automatically from daily voice notes.",
        [("general-contractor", "General Contractor Weekly Template"),
         ("electrical-subcontractor", "Electrical Subcontractor Weekly Template"),
         ("roofing-subcontractor", "Roofing Subcontractor Weekly Template")]),
    "free": ("Free Construction Tools | Voice Log Pro", "Free tools for subcontractors: lien deadline calculator, time tracking, weather logger, and daily report generator.",
        [("lien-deadline-calculator", None),
         ("time-tracking-calculator", "Time Tracking Calculator"),
         ("daily-report-generator", "Daily Report Generator"),
         ("weather-impact-logger", "Weather Impact Logger")]),
}

for hub, (title, desc, items) in HUBS.items():
    if hub == "free":
        links = []
        for slug, label in items:
            if slug == "lien-deadline-calculator":
                links.append(f'<li><a href="/tools/lien-deadline-calculator/">Lien Deadline Calculator</a></li>')
            elif label:
                links.append(f'<li><a href="/free/{slug}/">{label}</a></li>')
        links_html = "\n".join(links)
    else:
        links_html = "\n".join(f'<li><a href="/{hub}/{slug}/">{label}</a></li>' for slug, label in items)

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{DOMAIN}/{hub}/">
</head>
<body>
<main style="max-width:640px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">
<h1>{title.split(" | ")[0]}</h1>
<p style="color:#64748b;margin-bottom:24px">{desc}</p>
<ul style="font-size:16px;line-height:2.2">
{links_html}
</ul>
<p style="margin-top:32px"><a href="/crew-plan" style="display:inline-block;background:#0066cc;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700">Get Crew Plan — $49/month →</a></p>
</main>
</body>
</html>'''
    page(hub, "index", html)  # will write as hub/index.html, handled below

# ═══════════════════════════════════════════════════════════════
# WRITE ALL PAGES
# ═══════════════════════════════════════════════════════════════

total = 0
for section, slug, html in PAGES:
    if slug == "index":
        d = os.path.join(OUT, section)
    else:
        d = os.path.join(OUT, section, slug)
    os.makedirs(d, exist_ok=True)
    path = os.path.join(d, "index.html")
    with open(path, "w") as f:
        f.write(html)
    total += 1
    rel = os.path.relpath(path, OUT)
    print(f"  + {rel}")

print(f"\n✅ {total} pages written")

# Update sitemap
import re
SM = os.path.join(OUT, "sitemap.xml")
sm = open(SM).read()
existing = set(re.findall(r"<loc>(.*?)</loc>", sm))
new_urls = []
for section, slug, _ in PAGES:
    if slug == "index":
        url = f"{DOMAIN}/{section}/"
    else:
        url = f"{DOMAIN}/{section}/{slug}/"
    if url not in existing:
        new_urls.append(url)
        existing.add(url)

if new_urls:
    entries = "\n".join(f'  <url><loc>{u}</loc><lastmod>2026-07-13</lastmod></url>' for u in new_urls)
    sm = sm.replace("</urlset>", f"{entries}\n</urlset>")
    with open(SM, "w") as f:
        f.write(sm)
    print(f"📄 Sitemap: +{len(new_urls)} URLs (total: {len(existing)})")
