#!/usr/bin/env python3
"""Greg Isenberg pSEO: construction daily report SaaS — state lien guides + templates + more trades.
Writes static HTML to public/<section>/<slug>/index.html, no React routing needed."""

import json, os, sys

DOMAIN = "https://voicelogpro.com"
BRAND = "Voice Log Pro"
OUT = os.path.expanduser("~/voicelogpro/public")
PAGES = []  # (section, slug, html)

def page(section, slug, html):
    PAGES.append((section, slug, html))

# ═══════════════════════════════════════════════════════════════
# TYPE 1: State Lien Law Guides — targets "mechanics lien [state]", "lien deadline [state]"
# 8 states, ~500-600 words each
# ═══════════════════════════════════════════════════════════════

STATES = [
    ("california", "California", "20-day preliminary notice", "90 days after completion", "90 days"),
    ("florida", "Florida", "Notice to Owner within 45 days", "90 days from last furnishing", "1 year"),
    ("new-york", "New York", "no preliminary notice (private)", "8 months (single-family) / 4 months (commercial)", "1 year"),
    ("illinois", "Illinois", "60-day notice for owner-occupied", "4 months from completion", "2 years"),
    ("ohio", "Ohio", "no preliminary notice required", "75 days from last work", "6 years"),
    ("georgia", "Georgia", "Notice of Commencement check", "90 days from last delivery", "365 days"),
    ("north-carolina", "North Carolina", "Notice of Contract to owner", "120 days from last furnishing", "180 days"),
    ("colorado", "Colorado", "Notice of Intent within 10 days", "4 months from last work", "6 months"),
]

for slug, name, prelim, deadline, enforce in STATES:
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{name} Mechanics Lien Law Guide for Subcontractors | {BRAND}</title>
<meta name="description" content="{name} mechanics lien deadlines, preliminary notice rules, and enforcement timelines for subcontractors. Protect your lien rights with daily reports from Voice Log Pro.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{DOMAIN}/states/{slug}-lien-law/">
<meta property="og:title" content="{name} Mechanics Lien Law for Subcontractors | {BRAND}">
<meta property="og:description" content="Deadlines, notice rules, enforcement. How {name} subcontractors protect lien rights with daily logs.">
<meta property="og:type" content="article">
<meta property="og:url" content="{DOMAIN}/states/{slug}-lien-law/">
<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{name} Mechanics Lien Law Guide for Subcontractors",
  "description": "Preliminary notice and lien deadlines for {name} subcontractors. Step-by-step guide to preserving payment rights.",
  "author": {{"@type": "Organization", "name": "{BRAND}"}},
  "publisher": {{"@type": "Organization", "name": "{BRAND}", "url": "{DOMAIN}"}},
  "datePublished": "2026-07-09"
}}</script>
<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{"@type": "ListItem", "position": 1, "name": "Home", "item": "{DOMAIN}/"}},
    {{"@type": "ListItem", "position": 2, "name": "State Lien Guides", "item": "{DOMAIN}/states/"}},
    {{"@type": "ListItem", "position": 3, "name": "{name} Lien Law"}}
  ]
}}</script>
<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {{"@type": "Question", "name": "What is the preliminary notice deadline in {name}?", "acceptedAnswer": {{"@type": "Answer", "text": "{prelim}."}}}},
    {{"@type": "Question", "name": "How long do I have to file a mechanics lien in {name}?", "acceptedAnswer": {{"@type": "Answer", "text": "{deadline}."}}}},
    {{"@type": "Question", "name": "How do daily reports help with {name} lien rights?", "acceptedAnswer": {{"@type": "Answer", "text": "Voice-to-PDF daily reports create court-ready timestamped documentation of work performed, weather, and crew on site — the exact evidence needed to enforce lien rights in {name}."}}}}
  ]
}}</script>
</head>
<body>
<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">
<h1>{name} Mechanics Lien Law Guide for Subcontractors</h1>
<p><strong>TL;DR:</strong> In {name}, the preliminary notice rule is: {prelim}. You must file your lien within {deadline}, and the enforcement deadline is {enforce}. Daily construction reports are critical evidence for every step.</p>

<h2>Preliminary Notice Requirements</h2>
<p>In {name}, subcontractors must follow strict notice rules to preserve lien rights. The key requirement: {prelim}. Missing this deadline forfeits your lien rights entirely — no exceptions. Voice Log Pro's voice-to-PDF daily reports timestamp every notice delivery automatically, creating an audit trail that holds up in court.</p>

<h2>Lien Filing Deadline</h2>
<p>After your last day of work or material delivery, you have a window of {deadline} to file your mechanics lien. This deadline is absolute. Late filing = no lien. Your daily reports serve as the definitive record of when work was performed, eliminating disputes about the last-furnishing date that GCs and owners commonly exploit.</p>

<h2>Enforcement Period</h2>
<p>Once filed, your lien is valid for {enforce}. If payment is not received, you must initiate foreclosure proceedings within this window. Without contemporaneous daily documentation, proving your case in court becomes your word against theirs. Voice Log Pro creates timestamped, weather-verified, photo-attached PDFs that judges and arbitrators accept.</p>

<h2>Why Daily Reports Are Your Best Lien Protection</h2>
<p>Every lien dispute comes down to one question: "What work was done, and when?" Subcontractors who rely on memory or sparse notes lose. Subcontractors who produce dated, timestamped daily reports with crew lists, material logs, and weather data win. Voice Log Pro turns 60 seconds of voice dictation into a court-ready PDF — no typing, no laptop, no office. Speak your report from the job site. The app timestamps it, attaches the weather, and stores it in the cloud.</p>

<h2>Frequently Asked Questions</h2>
<h3>Do I need an attorney to file a {name} mechanics lien?</h3>
<p>While not legally required, construction lien law is specialized. Most subcontractors work with a construction attorney for the actual filing. However, the evidence supporting the lien — your daily reports — is entirely your responsibility. Voice Log Pro ensures that evidence exists and is defensible.</p>

<h3>Can a daily voice report replace a written lien notice in {name}?</h3>
<p>Your voice report is converted to a formal PDF daily log, which serves as supporting evidence for your lien claim. The lien notice itself must follow {name} statutory forms. Your Voice Log Pro reports document the facts that justify the lien amount — work dates, crew, materials, and conditions.</p>

<h3>What other states does Voice Log Pro support?</h3>
<p>Voice Log Pro works in all 50 states. Daily report formats adapt to local compliance needs. See our other state guides for jurisdiction-specific deadlines and notice rules.</p>

<nav style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb">
  <p style="font-size:14px;color:#6b7280">More state lien guides: <a href="{DOMAIN}/states/texas-lien-law/">Texas</a> · <a href="{DOMAIN}/states/florida-lien-law/">Florida</a> · <a href="{DOMAIN}/states/new-york-lien-law/">New York</a> · <a href="{DOMAIN}/states/illinois-lien-law/">Illinois</a> · <a href="{DOMAIN}/states/ohio-lien-law/">Ohio</a></p>
  <p style="margin-top:16px"><a href="{DOMAIN}/crew-plan" style="display:inline-block;background:#0066cc;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700">Get Crew Plan — $49/month →</a></p>
  <p style="font-size:13px;color:#9ca3af;margin-top:8px">Voice Log Pro — Court-ready daily reports from your voice. Built for subcontractors.</p>
</nav>
</main>
</body>
</html>'''
    page("states", f"{slug}-lien-law", html)

# ═══════════════════════════════════════════════════════════════
# TYPE 2: Daily Report Templates — "construction daily report template [trade]"
# 5 trades, ~450 words each
# ═══════════════════════════════════════════════════════════════

TEMPLATES = [
    ("general-contractor", "General Contractor", "subcontractor management, schedule tracking, and owner communication", ["Project name and date", "Crew headcount by trade", "Work performed summary", "Materials delivered", "Equipment on site", "Weather conditions", "Delays or issues", "Safety observations", "GC sign-off"]),
    ("electrician", "Electrician", "conduit runs, panel installations, and circuit work", ["Project and date", "Circuits/panels worked on", "Wire pulls completed", "Materials used (gauge, length)", "Inspections passed/failed", "Weather and site conditions", "Photos of completed work"]),
    ("plumber", "Plumber", "pipe runs, fixture installations, and pressure tests", ["Project and date", "Piping installed (type, length)", "Fixtures set", "Pressure test results", "Materials list", "Inspections", "Weather notes"]),
    ("hvac-contractor", "HVAC Contractor", "ductwork, unit installations, and system testing", ["Project and date", "Equipment installed", "Ductwork completed", "Refrigerant charged", "System test results", "Materials used", "Weather/conditions"]),
    ("roofer", "Roofer", "underlayment, shingle/membrane installation, and weather documentation", ["Project and date", "Roof sections completed (sq ft)", "Materials used (type, squares)", "Underlayment inspection", "Weather — temperature, wind", "Photos of completed sections", "Crew count"]),
]

for slug, trade, context, fields in TEMPLATES:
    fields_html = "\n".join(f"  <li>{f}</li>" for f in fields)
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{trade} Daily Construction Report Template | {BRAND}</title>
<meta name="description" content="Free {trade} daily construction report template. Includes: {', '.join(fields[:4])}. Voice-to-PDF with Voice Log Pro — no typing required.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{DOMAIN}/templates/{slug}-daily-report/">
<meta property="og:title" content="{trade} Daily Report Template | {BRAND}">
<meta property="og:description" content="Free template for {trade}s. Voice Log Pro turns voice notes into these reports automatically.">
<meta property="og:type" content="article">
<meta property="og:url" content="{DOMAIN}/templates/{slug}-daily-report/">
<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{trade} Daily Construction Report Template",
  "description": "{context}. Free template with Voice Log Pro voice-to-PDF automation.",
  "author": {{"@type": "Organization", "name": "{BRAND}"}},
  "publisher": {{"@type": "Organization", "name": "{BRAND}", "url": "{DOMAIN}"}},
  "datePublished": "2026-07-09"
}}</script>
<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{"@type": "ListItem", "position": 1, "name": "Home", "item": "{DOMAIN}/"}},
    {{"@type": "ListItem", "position": 2, "name": "Daily Report Templates", "item": "{DOMAIN}/templates/"}},
    {{"@type": "ListItem", "position": 3, "name": "{trade} Template"}}
  ]
}}</script>
<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {{"@type": "Question", "name": "What should a {trade} daily report include?", "acceptedAnswer": {{"@type": "Answer", "text": "A complete {trade} daily report includes: {', '.join(fields[:5])}. Voice Log Pro captures all of this from a single voice note."}}}},
    {{"@type": "Question", "name": "Can I use Voice Log Pro instead of filling out templates?", "acceptedAnswer": {{"@type": "Answer", "text": "Yes. Voice Log Pro eliminates paper templates entirely. Speak your daily log, and the app automatically formats it into a professional PDF with timestamps, weather, and photo attachments — exactly matching this template's structure."}}}},
    {{"@type": "Question", "name": "Is this template accepted for lien claims?", "acceptedAnswer": {{"@type": "Answer", "text": "Yes. Voice Log Pro daily reports have been used to support mechanics lien claims and payment disputes. The timestamped, weather-verified, and crew-documented format meets the contemporaneous evidence standard required by courts."}}}}
  ]
}}</script>
</head>
<body>
<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">
<h1>{trade} Daily Construction Report Template</h1>
<p><strong>TL;DR:</strong> This template covers everything a {trade} needs: {', '.join(fields[:3])}. Voice Log Pro fills it automatically from a 60-second voice note — no typing, no Excel, no office.</p>

<h2>Template Fields</h2>
<p>Every {trade} daily report should capture these data points:</p>
<ol>
{fields_html}
</ol>

<h2>Why {trade}s Use Voice Log Pro Instead of Paper</h2>
<p>{context.capitalize()}. Paper templates get lost, forgotten, or filled out days later from memory. Voice Log Pro's voice-to-PDF system means you dictate your report from the job site — conduit in one hand, phone in the other. The PDF is generated instantly with timestamps, weather data, and photo attachments. Court-ready. Insurance-ready. Lien-ready.</p>

<h2>How It Works</h2>
<ol>
  <li><strong>Hit Record</strong> — Speak your daily update: what you did, materials used, crew on site</li>
  <li><strong>Auto-Format</strong> — Voice Log Pro structures your voice note into a professional daily report matching this template</li>
  <li><strong>Export PDF</strong> — Download or share a timestamped, weather-verified PDF for records and payment protection</li>
</ol>

<nav style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb">
  <p style="font-size:14px;color:#6b7280">More templates: <a href="{DOMAIN}/templates/general-contractor-daily-report/">General Contractor</a> · <a href="{DOMAIN}/templates/plumber-daily-report/">Plumber</a> · <a href="{DOMAIN}/templates/hvac-contractor-daily-report/">HVAC</a> · <a href="{DOMAIN}/templates/roofer-daily-report/">Roofer</a></p>
  <p style="margin-top:16px"><a href="{DOMAIN}/crew-plan" style="display:inline-block;background:#0066cc;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700">Get Crew Plan — $49/month →</a></p>
  <p style="font-size:13px;color:#9ca3af;margin-top:8px">Voice Log Pro — Court-ready daily reports from your voice. No typing required.</p>
</nav>
</main>
</body>
</html>'''
    page("templates", f"{slug}-daily-report", html)

# ═══════════════════════════════════════════════════════════════
# TYPE 3: More Trade pages — expanding /for/ from 9 to 14
# ═══════════════════════════════════════════════════════════════

MORE_TRADES = [
    ("concrete-contractors", "Concrete Contractors", "pour logs, cure time documentation, and weather verification", "Concrete pour documentation — timestamped, weather-verified daily logs of pours, finishing, and curing conditions."),
    ("drywall-contractors", "Drywall Contractors", "board count, taping stages, and finish levels", "Daily hanging and finishing logs with board counts, compound stages, and inspection readiness."),
    ("painters", "Painting Contractors", "surface prep, coating specs, and coverage area", "Paint application logs with surface prep verification, coating specifications, and square footage tracking."),
    ("landscapers", "Landscaping Contractors", "plant material, irrigation, and site conditions", "Landscape installation logs with plant material verification, irrigation testing, and site condition documentation."),
    ("framing-contractors", "Framing Contractors", "lumber delivery, wall sections, and inspection status", "Framing progress logs — lumber counts, wall/floor sections completed, and inspection gate tracking."),
]

for slug, trade, context, meta_desc in MORE_TRADES:
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Daily Construction Reports for {trade} | {BRAND}</title>
<meta name="description" content="{meta_desc} Voice-first daily reports for {trade}. $49/month. No typing — speak your report.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{DOMAIN}/for/{slug}/">
<meta property="og:title" content="Daily Reports for {trade} | {BRAND}">
<meta property="og:description" content="{meta_desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="{DOMAIN}/for/{slug}/">
<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "{BRAND}",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "iOS, Android, Web",
  "offers": {{"@type": "Offer", "price": "49", "priceCurrency": "USD"}},
  "description": "Voice-to-PDF daily construction reports for {trade}. {context}."
}}</script>
<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{"@type": "ListItem", "position": 1, "name": "Home", "item": "{DOMAIN}/"}},
    {{"@type": "ListItem", "position": 2, "name": "For Your Trade", "item": "{DOMAIN}/for/"}},
    {{"@type": "ListItem", "position": 3, "name": "{trade}"}}
  ]
}}</script>
<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {{"@type": "Question", "name": "How does Voice Log Pro help {trade}?", "acceptedAnswer": {{"@type": "Answer", "text": "Voice Log Pro captures {context}. Speak your report from the job site — the app timestamps it, attaches weather data, and generates a court-ready PDF."}}}},
    {{"@type": "Question", "name": "Can {trade} use voice reports for payment disputes?", "acceptedAnswer": {{"@type": "Answer", "text": "Yes. Voice Log Pro daily reports have been used to support payment claims. Timestamped, weather-verified documentation meets the contemporaneous evidence standard courts require."}}}}
  ]
}}</script>
</head>
<body>
<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">
<h1>Daily Construction Reports for {trade}</h1>
<p><strong>TL;DR:</strong> {meta_desc}</p>

<h2>Built for {trade}</h2>
<p>Voice Log Pro captures {context}. Every daily report is automatically timestamped, weather-verified, and formatted into a professional PDF. No typing. No Excel. No office. Speak your report from the job site while the work is fresh.</p>

<h2>What Your Daily Report Captures</h2>
<ul>
  <li>Work performed — detailed description from voice</li>
  <li>Crew count and hours</li>
  <li>Materials and equipment used</li>
  <li>Weather conditions (auto-attached)</li>
  <li>Photo attachments</li>
  <li>Issues, delays, or change orders</li>
</ul>

<h2>Why {trade} Choose Voice Log Pro</h2>
<p>Paper logs get lost, filled out days late, or skipped entirely. Voice Log Pro removes every friction point. Press one button, speak your update, and the PDF is generated instantly. Court-ready. Insurance-ready. Payment-protection-ready.</p>

<nav style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb">
  <p style="font-size:14px;color:#6b7280">More trades: <a href="{DOMAIN}/for/electricians/">Electricians</a> · <a href="{DOMAIN}/for/plumbers/">Plumbers</a> · <a href="{DOMAIN}/for/hvac-contractors/">HVAC</a> · <a href="{DOMAIN}/for/general-contractors/">General Contractors</a> · <a href="{DOMAIN}/for/roofers/">Roofers</a></p>
  <p style="margin-top:16px"><a href="{DOMAIN}/crew-plan" style="display:inline-block;background:#0066cc;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700">Get Crew Plan — $49/month →</a></p>
  <p style="font-size:13px;color:#9ca3af;margin-top:8px">Voice Log Pro — Voice-to-PDF daily reports. Built for subcontractors who work with their hands.</p>
</nav>
</main>
</body>
</html>'''
    page("for", slug, html)

# ═══════════════════════════════════════════════════════════════
# WRITE ALL PAGES
# ═══════════════════════════════════════════════════════════════

total = 0
for section, slug, html in PAGES:
    d = os.path.join(OUT, section, slug)
    os.makedirs(d, exist_ok=True)
    path = os.path.join(d, "index.html")
    with open(path, "w") as f:
        f.write(html)
    total += 1
    print(f"  ✓ {section}/{slug}/index.html")

print(f"\n✅ {total} pSEO pages written to {OUT}/")
print(f"   States: {sum(1 for s,_,_ in PAGES if s=='states')}")
print(f"   Templates: {sum(1 for s,_,_ in PAGES if s=='templates')}")
print(f"   Trades: {sum(1 for s,_,_ in PAGES if s=='for')}")

# Update sitemap
SITEMAP = os.path.expanduser("~/voicelogpro/public/sitemap.xml")
existing_urls = set()
if os.path.exists(SITEMAP):
    import re
    existing = open(SITEMAP).read()
    existing_urls = set(re.findall(r"<loc>(.*?)</loc>", existing))

new_urls = []
for section, slug, _ in PAGES:
    url = f"{DOMAIN}/{section}/{slug}/"
    if url not in existing_urls:
        new_urls.append(url)

if new_urls:
    entries = "\n".join(f"  <url><loc>{u}</loc></url>" for u in new_urls)
    # Insert before closing </urlset>
    sitemap_content = open(SITEMAP).read()
    sitemap_content = sitemap_content.replace("</urlset>", f"{entries}\n</urlset>")
    with open(SITEMAP, "w") as f:
        f.write(sitemap_content)
    print(f"\n📄 Sitemap: added {len(new_urls)} new URLs ({len(existing_urls)} -> {len(existing_urls)+len(new_urls)})")
else:
    print(f"\n📄 Sitemap: no new URLs (all already present)")
