#!/usr/bin/env python3
"""
pSEO Expansion Generator for VoiceLogPro (Vite SPA).
Generates pages for /alternatives/, /cities/, /integrations/ sections.
Pages go in public/<section>/<slug>/index.html.
Also patches vercel.json with needed rewrite rules.

Usage: python3 _pseo_expand.py [--dry-run]
"""

import json
import os
import sys
from datetime import date
from pathlib import Path

BASE = Path(__file__).resolve().parent
PUBLIC = BASE / "public"
TODAY = date.today().isoformat()
ROOT_URL = "https://voicelogpro.com"

DRY_RUN = "--dry-run" in sys.argv

# ---------------------------------------------------------------
# DATA
# ---------------------------------------------------------------

ALTERNATIVES = [
    {
        "slug": "raken",
        "name": "Raken",
        "desc": "Raken Construction Daily Reports",
        "tagline": "construction daily reporting",
        "voicelogpro_key": "voice-to-pdf daily reports completed in under 2 minutes from the field",
        "competitor_key": "typed daily reports with photo capture and toolbox talks",
        "price_note": "VoiceLogPro offers a free beta tier and transparent $12–$49/mo pricing; Raken pricing typically requires a sales call.",
    },
    {
        "slug": "busybusy",
        "name": "busybusy",
        "desc": "busybusy Time Tracking & Daily Reports",
        "tagline": "construction time tracking and daily reporting",
        "voicelogpro_key": "voice-first daily logs that auto-generate court-ready PDFs",
        "competitor_key": "GPS time tracking with basic daily report notes",
        "price_note": "VoiceLogPro plans start at $12/mo during beta with a generous free tier; busybusy requires a per-user subscription.",
    },
    {
        "slug": "notevault",
        "name": "NoteVault",
        "desc": "NoteVault Voice Site Reports",
        "tagline": "voice-based construction site reporting",
        "voicelogpro_key": "AI-powered voice-to-structured-PDF reports with weather, crew, and material fields — built for the trades",
        "competitor_key": "voice-to-text transcription for construction site notes with call-in recording",
        "price_note": "VoiceLogPro is in beta with a free Solo plan; NoteVault pricing is enterprise and requires a demo.",
    },
    {
        "slug": "site-max",
        "name": "SiteMax",
        "desc": "SiteMax Construction Site Management",
        "tagline": "construction site management and daily logs",
        "voicelogpro_key": "specialized voice daily report app — speak your report, get a PDF, done",
        "competitor_key": "full site management platform with daily logs as one module among many",
        "price_note": "VoiceLogPro is focused and affordable ($12–$49/mo); SiteMax is a broader platform with higher price points.",
    },
    {
        "slug": "crew-tracks",
        "name": "CrewTracks",
        "desc": "CrewTracks Daily Reporting",
        "tagline": "crew management and daily reporting",
        "voicelogpro_key": "voice-to-PDF reports that are timestamped, weather-attached, and court-admissible",
        "competitor_key": "crew tracking with integrated daily report forms",
        "price_note": "VoiceLogPro starts with a free tier during beta; CrewTracks pricing is per-user and requires inquiry.",
    },
    {
        "slug": "fieldlens",
        "name": "Fieldlens by RedTeam",
        "desc": "Fieldlens Construction Field Management",
        "tagline": "construction field management and daily reporting",
        "voicelogpro_key": "purpose-built voice daily reports — one tap, speak, PDF ready",
        "competitor_key": "issue tracking and field communication with daily report capabilities",
        "price_note": "VoiceLogPro is priced transparently at $12–$49/mo; Fieldlens is part of RedTeam and requires a bundled subscription.",
    },
]

CITIES = [
    {
        "slug": "houston",
        "name": "Houston",
        "state": "Texas",
        "fact": "One of the fastest-growing construction markets in the US, with over $30B in annual building permits. Hurricanes and expansive clay soils create unique documentation requirements.",
        "tip": "Document weather daily — Houston's humidity and sudden storms directly impact concrete curing and roofing schedules.",
    },
    {
        "slug": "dallas",
        "name": "Dallas-Fort Worth",
        "state": "Texas",
        "fact": "DFW leads the nation in new housing starts and commercial construction. The metroplex spans 13 counties, each with different permitting rules.",
        "tip": "Track which municipality your crew is in — permit requirements change at city limits, and daily logs prove jurisdictional compliance.",
    },
    {
        "slug": "phoenix",
        "name": "Phoenix",
        "state": "Arizona",
        "fact": "Phoenix issued over $15B in building permits in 2025. Extreme heat regulations (OSHA heat safety) require documented breaks and hydration logs.",
        "tip": "Log temperature and heat-safety measures in every daily report — Arizona L&I enforcement is aggressive during summer months.",
    },
    {
        "slug": "atlanta",
        "name": "Atlanta",
        "state": "Georgia",
        "fact": "Atlanta's construction boom is driven by corporate relocations and data-center builds. Georgia lien law has strict 90-day filing deadlines from last furnishing.",
        "tip": "Your daily report dates are your lien deadline evidence. Every day you don't document is a day you can't prove you worked.",
    },
    {
        "slug": "los-angeles",
        "name": "Los Angeles",
        "state": "California",
        "fact": "LA County construction exceeds $25B annually. California's 20-day preliminary notice rule is the strictest in the nation — miss it and you lose lien rights entirely.",
        "tip": "Voice-to-PDF daily reports create an automatic audit trail that satisfies California's contemporaneous-evidence standard in lien disputes.",
    },
    {
        "slug": "chicago",
        "name": "Chicago",
        "state": "Illinois",
        "fact": "Chicago's construction market includes massive infrastructure projects. Illinois mechanics lien law requires suit within 4 months of lien recording — one of the shortest enforcement windows in the country.",
        "tip": "Date-stamped daily reports are critical for proving last-furnishing dates when the 4-month enforcement clock starts ticking.",
    },
    {
        "slug": "denver",
        "name": "Denver",
        "state": "Colorado",
        "fact": "Denver's metro construction is booming with $10B+ in annual activity. Colorado lien law requires a Notice of Intent to Lien 10 days before filing — a step many subs overlook.",
        "tip": "Daily reports that document every day of work create the paper trail you need to justify lien amounts at notice time.",
    },
    {
        "slug": "miami",
        "name": "Miami",
        "state": "Florida",
        "fact": "Miami has one of the most active high-rise construction markets in the US. Florida lien law requires a Notice to Owner within 45 days of first furnishing for subs without a direct contract.",
        "tip": "Hurricane-season weather logs are essential — delays, material damage, and force majeure all start with a dated, timestamped report.",
    },
]

NEW_INTEGRATIONS = [
    {
        "slug": "sage",
        "name": "Sage 300 CRE",
        "desc": "Sync VoiceLogPro daily reports to Sage 300 Construction and Real Estate.",
    },
    {
        "slug": "viewpoint",
        "name": "Viewpoint Vista",
        "desc": "Connect VoiceLogPro reports to Viewpoint Vista for construction ERP.",
    },
    {
        "slug": "quickbooks",
        "name": "QuickBooks Contractor",
        "desc": "Export VoiceLogPro daily reports to QuickBooks for contractor billing and job costing.",
    },
]

# ---------------------------------------------------------------
# TEMPLATES
# ---------------------------------------------------------------

COMMON_META_TAIL = """\
<!-- AEO Definition Block -->
<section style="max-width:760px;margin:32px auto;padding:0 16px"><h2>Key terms, defined</h2><dl><dt style="font-weight:700;margin-top:14px">Daily construction report</dt><dd style="margin:4px 0 0;color:#555">A dated record of crew, work performed, materials, weather, and site conditions on a job site.</dd><dt style="font-weight:700;margin-top:14px">OSHA compliance</dt><dd style="margin:4px 0 0;color:#555">Adherence to Occupational Safety and Health Administration recordkeeping and safety requirements.</dd><dt style="font-weight:700;margin-top:14px">Dispute defense record</dt><dd style="margin:4px 0 0;color:#555">Contemporaneous documentation used to defend against payment or liability disputes.</dd></dl></section>
<!-- /AEO Definition Block -->
<!-- AEO HowTo Schema -->
<script type="application/ld+json">{"@context": "https://schema.org", "@type": "HowTo", "name": "How to create an OSHA-compliant daily construction report with VoiceLogPro", "step": [{"@type": "HowToStep", "position": 1, "name": "Speak your daily log", "text": "Dictate the day's work, crew, and site conditions instead of typing."}, {"@type": "HowToStep", "position": 2, "name": "Auto-format to a report", "text": "VoiceLogPro structures your speech into an OSHA-compliant daily report."}, {"@type": "HowToStep", "position": 3, "name": "Export a PDF", "text": "Download or share a timestamped PDF for records and dispute defense."}]}</script>
<!-- /AEO HowTo Schema -->
<!-- Brunson Trust Bar -->
<section style="background:linear-gradient(135deg,#f0f9ff,#e8f5e9);border-radius:16px;padding:32px 24px;margin:40px 0;border:2px solid #0066cc30;text-align:center">
  <h2 style="font-size:1.5rem;margin-bottom:16px;color:#1a1a1a">Stop Typing. Just Speak. Get a PDF.</h2>
  <div style="background:#fef3c7;border-radius:8px;padding:12px;margin:12px 0;text-align:center"><strong>🛡️ 30 Minutes Saved Per Day Guaranteed — Or Your Money Back</strong></div>
  <div style="background:white;border-radius:12px;padding:20px;max-width:500px;margin:0 auto 16px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <p style="font-size:1.1rem;font-weight:600;margin-bottom:8px">📥 Free Daily Report Defense Kit</p>
    <p style="color:#555;margin-bottom:12px;font-size:0.9rem">5 OSHA-compliant templates, Texas Chapter 53 checklist, and dispute defense swipe file. Free PDF.</p>
    <a href="https://voicelogpro.com/#defense-kit" style="display:inline-block;background:#0066cc;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:1.05rem">Get Free Defense Kit →</a>
    <p style="font-size:0.75rem;color:#888;margin-top:8px">No spam. Unsubscribe anytime.</p>
  </div>
  <p style="color:#cc3300;font-weight:600;margin-top:12px">⏰ Beta Access — Crew Plan at $12/mo (50% Off)</p>
</section>
"""

CANONICAL_DISAMBIGUATION = (
    '<script type="application/ld+json">'
    '{"@context": "https://schema.org", "@type": "Organization", '
    '"name": "VoiceLogPro", "url": "https://voicelogpro.com", '
    '"description": "VoiceLogPro is a voice-to-PDF daily construction log app for contractors — general contractors, electricians, plumbers, HVAC, and roofers speak their on-site daily report and it becomes a timestamped, court-admissible PDF with fields for weather, crew, work performed, and materials, protecting mechanic\'s-lien and delay claims.", '
    '"disambiguatingDescription": "VoiceLogPro is a voice-to-PDF daily construction log app (voice on-site → timestamped, court-admissible daily-report PDF) — not a general-purpose meeting/voice-transcription tool (Otter, Rev, Fireflies), and not a full construction-management platform (Procore, Raken)."}'
    "</script>"
)

DREAM100_FOOTER = """<!-- Dream-100 congregation footer -->
<div style="margin-top:16px;font-size:13px"><strong>Find us where builders are:</strong> <a href="https://github.com/kindrat86" rel="me noopener" style="color:inherit">GitHub</a></div>
<!-- Dream-100 congregation footer -->"""


def esc(s):
    """Basic HTML escape."""
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def json_ld(obj):
    """Minified JSON-LD script tag."""
    return f'<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "</script>"


# --- ALTERNATIVES PAGE ---
def build_alternative_page(data):
    """Generate an /alternatives/ index.html page — compact vs-style comparison."""
    slug = data["slug"]
    name = data["name"]
    desc = data["desc"]
    tagline = data["tagline"]
    vlp_key = data["voicelogpro_key"]
    comp_key = data["competitor_key"]
    price_note = data["price_note"]
    url = f"{ROOT_URL}/alternatives/{slug}"
    title = f"VoiceLogPro vs {name} [2026 Best Construction Daily Log Alternative]"
    meta_desc = f"Looking for a {name} alternative? Compare VoiceLogPro vs {name} for {tagline}. See feature comparison, pricing, and why contractors switch."

    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": ROOT_URL + "/"},
            {"@type": "ListItem", "position": 2, "name": "Alternatives", "item": ROOT_URL + "/alternatives/"},
            {"@type": "ListItem", "position": 3, "name": name},
        ],
    }
    article = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": meta_desc,
        "url": url,
        "publisher": {"@type": "Organization", "name": "VoiceLogPro", "url": ROOT_URL},
        "datePublished": TODAY,
        "dateModified": TODAY,
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": f"How is VoiceLogPro different from {name}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"VoiceLogPro focuses on {vlp_key}. {name} focuses on {comp_key}. This specialization means deeper features for daily construction logging and lien protection.",
                },
            },
            {
                "@type": "Question",
                "name": f"Can I switch from {name} to VoiceLogPro?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. VoiceLogPro is designed for quick onboarding — most teams are up and running within 5 minutes. Export your existing reports from the old tool and archive them for your records.",
                },
            },
            {
                "@type": "Question",
                "name": f"Is VoiceLogPro cheaper than {name}?",
                "acceptedAnswer": {"@type": "Answer", "text": price_note},
            },
        ],
    }

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(meta_desc)}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="article">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(meta_desc)}">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary">
{json_ld(article)}
{json_ld(breadcrumb)}
{json_ld(faq)}
{CANONICAL_DISAMBIGUATION}
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;color:#1a1a2e;max-width:820px;margin:0 auto;padding:20px}}
h1{{font-size:1.9rem;margin:16px 0 8px;line-height:1.3}}
h2{{font-size:1.4rem;margin:32px 0 12px;border-bottom:2px solid #e5e7eb;padding-bottom:6px}}
p{{margin-bottom:16px;color:#333}}
ul,ol{{margin:0 0 16px 20px}}li{{margin-bottom:8px}}
nav{{padding:12px 0;border-bottom:2px solid #f0f0f0;margin-bottom:24px}}
nav a{{margin-right:16px;color:#667eea;text-decoration:none;font-weight:500;font-size:.9rem}}
.lede{{font-size:1.12rem;color:#374151;margin-bottom:24px;line-height:1.6}}
table{{width:100%;border-collapse:collapse;margin:16px 0}}
th,td{{border:1px solid #e0e0e0;padding:10px 14px;text-align:left;font-size:.95rem}}
th{{background:#f8f9fa;font-weight:600}}
.callout{{background:#f0f7ff;border-left:4px solid #0066cc;padding:1rem 1.25rem;margin:1.5rem 0;border-radius:0 .375rem .375rem 0}}
.cta{{background:linear-gradient(135deg,#0066cc,#004499);color:#fff;padding:2rem;border-radius:.75rem;margin-top:2rem;text-align:center}}
.cta h2{{color:#fff;border:none;margin-top:0}}.cta .btn{{display:inline-block;background:#fff;color:#0066cc;padding:.75rem 1.5rem;border-radius:.375rem;font-weight:600;margin-top:.5rem;text-decoration:none}}
footer{{margin-top:3rem;padding-top:1.5rem;border-top:1px solid #e5e7eb;color:#6b7280;font-size:.9rem}}
details{{border:1px solid #e0e0e0;border-radius:8px;padding:12px 16px;margin-bottom:8px;background:#fafafa}}
summary{{cursor:pointer;font-size:1rem}}details[open]{{background:#fff}}
</style>
<!-- isenberg-round18 -->
</head>
<body>
<nav>
<a href="{ROOT_URL}/" style="font-weight:700;color:#1a1a2e">VoiceLogPro</a>
<a href="{ROOT_URL}/best">Best</a>
<a href="{ROOT_URL}/alternatives-to">Alternatives</a>
<a href="{ROOT_URL}/vs">Vs</a>
<a href="{ROOT_URL}/integrations">Integrations</a>
</nav>

<article>
<h1>VoiceLogPro vs {name}: Best {desc} Alternative in 2026</h1>
<p class="lede">A detailed comparison of VoiceLogPro and {name} for teams evaluating <strong>{tagline}</strong> solutions.</p>

<h2>Quick Comparison</h2>
<table>
<thead><tr><th>Feature</th><th>VoiceLogPro</th><th>{name}</th></tr></thead>
<tbody>
<tr><td>Primary focus</td><td>{vlp_key}</td><td>{comp_key}</td></tr>
<tr><td>Best for</td><td>Teams that need voice daily report app specifically</td><td>Broader / general use</td></tr>
<tr><td>Pricing model</td><td>Tiered with free tier during beta</td><td>Enterprise / contact sales</td></tr>
<tr><td>Setup time</td><td>Minutes</td><td>Varies</td></tr>
</tbody>
</table>

<h2>Where VoiceLogPro Wins</h2>
<p>VoiceLogPro is purpose-built for {tagline}. Unlike {name}, which takes a broader approach, every feature in VoiceLogPro is designed around {vlp_key}. This means tighter workflows, less configuration overhead, and faster time-to-value for teams whose core need is exactly this.</p>

<h2>When {name} Might Be Better</h2>
<p>If your use case extends beyond {tagline} into adjacent workflows that {name} also covers, its broader feature set may reduce tool sprawl. Evaluate your actual workflow before committing.</p>

<div class="callout"><strong>Bottom line:</strong> Choose VoiceLogPro if {tagline} is your core need. Choose {name} if you need broader coverage beyond this specific workflow.</div>

<h2>Frequently Asked Questions</h2>
<details><summary><strong>How is VoiceLogPro different from {name}?</strong></summary><p>VoiceLogPro focuses on {vlp_key}. {name} focuses on {comp_key}. This specialization means deeper features for daily construction logging and lien protection.</p></details>
<details><summary><strong>Can I switch from {name} to VoiceLogPro?</strong></summary><p>Yes. VoiceLogPro is designed for quick onboarding. Most teams are up and running within 5 minutes.</p></details>
<details><summary><strong>Is VoiceLogPro cheaper than {name}?</strong></summary><p>{price_note}</p></details>
</article>

<section class="cta"><h2>Try VoiceLogPro — Free Beta</h2><p>Voice-to-PDF daily reports for construction & trades. Start in minutes.</p><a href="{ROOT_URL}/" class="btn">Get started &rarr;</a></section>

<footer><p>&copy; 2026 VoiceLogPro. <a href="{ROOT_URL}/">voicelogpro.com</a></p>{DREAM100_FOOTER}</footer>
{COMMON_META_TAIL}
</body>
</html>"""
    return html


# --- CITIES PAGE ---
def build_city_page(data):
    """Generate a /cities/ index.html page — guide-style, similar to states pages."""
    slug = data["slug"]
    name = data["name"]
    state = data["state"]
    fact = data["fact"]
    tip = data["tip"]
    url = f"{ROOT_URL}/cities/{slug}/"
    title = f"Construction Daily Report Guide for {name}, {state} | VoiceLogPro"
    meta_desc = f"Voice-to-PDF daily construction reports for contractors in {name}, {state}. Lien protection, OSHA compliance, and dispute defense documentation tailored for {name} job sites."

    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": ROOT_URL + "/"},
            {"@type": "ListItem", "position": 2, "name": "City Construction Guides", "item": ROOT_URL + "/cities/"},
            {"@type": "ListItem", "position": 3, "name": f"{name}"},
        ],
    }
    article = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": meta_desc,
        "author": {"@type": "Organization", "name": "VoiceLogPro"},
        "publisher": {"@type": "Organization", "name": "VoiceLogPro", "url": ROOT_URL},
        "datePublished": TODAY,
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": f"How do daily reports help contractors in {name}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"Voice-to-PDF daily reports create court-ready timestamped records of work performed, weather, and crew — the exact evidence needed for lien enforcement, delay claims, and payment disputes in {name}.",
                },
            },
            {
                "@type": "Question",
                "name": f"What are the lien deadlines for {state}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"{state} has specific preliminary notice and lien filing deadlines. Dated daily reports are your proof of when work was performed — critical for meeting statutory deadlines. Check our state lien guides for complete details.",
                },
            },
            {
                "@type": "Question",
                "name": f"Can a voice daily report replace a written site log in {name}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"Your voice report is converted to a formal PDF daily log with timestamps, weather data, and structured fields for crew, materials, and work performed — more defensible than handwritten notes and far faster to produce.",
                },
            },
        ],
    }

    # Cross-link other city guides
    other_cities = [c for c in CITIES if c["slug"] != slug]
    cross_links = " · ".join(
        f'<a href="{ROOT_URL}/cities/{c["slug"]}/">{c["name"]}</a>' for c in other_cities
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{esc(meta_desc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(meta_desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="{url}">
{json_ld(article)}
{json_ld(breadcrumb)}
{json_ld(faq)}
{CANONICAL_DISAMBIGUATION}
</head>
<body>
<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">

<h1>Construction Daily Report Guide for {name}, {state}</h1>
<p><strong>TL;DR:</strong> {fact}</p>

<h2>{name} Construction Market Overview</h2>
<p>{name} is one of the most active construction markets in {state}. For contractors — general contractors, electricians, plumbers, HVAC subcontractors, and roofers — proper daily documentation is not optional. It is the difference between getting paid and writing off a receivable. VoiceLogPro turns 60 seconds of voice dictation into a timestamped, court-admissible PDF daily report that protects your lien rights and defends against payment disputes.</p>

<h2>Why Daily Reports Matter in {name}</h2>
<p>{fact} Whether you are framing a house, running conduit, or roofing a commercial building, your daily report is your contemporaneous record — the single most important document in a payment dispute. VoiceLogPro makes creating that record effortless: speak your update from the job site and the app timestamps it, attaches weather data, and formats it into a professional PDF.</p>

<h2>Pro Tip for {name} Contractors</h2>
<div style="background:#f0f7ff;border-left:4px solid #0066cc;padding:16px;margin:16px 0;border-radius:0 8px 8px 0">
<strong>💡 {tip}</strong>
</div>

<h2>What Your Daily Report Captures</h2>
<ul>
  <li><strong>Work performed</strong> — detailed description from voice dictation</li>
  <li><strong>Crew count and hours</strong> — who was on site and for how long</li>
  <li><strong>Materials and equipment</strong> — what was used and installed</li>
  <li><strong>Weather conditions</strong> — automatically attached to every report</li>
  <li><strong>Photo attachments</strong> — site progress, issues, verification</li>
  <li><strong>Issues and delays</strong> — change orders, RFIs, force majeure events</li>
</ul>

<h2>How VoiceLogPro Works</h2>
<ol>
  <li>Open the app at the job site</li>
  <li>Press record and speak your daily update</li>
  <li>AI transcribes and structures your report</li>
  <li>Timestamped PDF is generated instantly</li>
  <li>Share, file, or archive for lien protection</li>
</ol>

<h2>Frequently Asked Questions</h2>
<h3>How do daily reports help contractors in {name}?</h3>
<p>Voice-to-PDF daily reports create court-ready timestamped records of work performed, weather, and crew — the exact evidence needed for lien enforcement, delay claims, and payment disputes in {name}.</p>

<h3>What are the lien deadlines for {state}?</h3>
<p>{state} has specific preliminary notice and lien filing deadlines. Dated daily reports are your proof of when work was performed — critical for meeting statutory deadlines. Check our state lien guides for complete details.</p>

<h3>Can a voice daily report replace a written site log in {name}?</h3>
<p>Your voice report is converted to a formal PDF daily log with timestamps, weather data, and structured fields — more defensible than handwritten notes and far faster to produce.</p>

<h3>Does VoiceLogPro work offline on {name} job sites?</h3>
<p>Yes. Record your daily report offline and the app uploads it when you regain connectivity. VoiceLogPro is built for field conditions — no Wi-Fi required.</p>

<nav style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb">
  <p style="font-size:14px;color:#6b7280">More city construction guides: {cross_links}</p>
  <p style="margin-top:16px"><a href="{ROOT_URL}/crew-plan" style="display:inline-block;background:#0066cc;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700">Get Crew Plan — $49/month →</a></p>
  <p style="font-size:13px;color:#9ca3af;margin-top:8px">VoiceLogPro — Court-ready daily reports from your voice. Built for {name} contractors.</p>
</nav>
</main>
</body>
</html>"""
    return html


# --- INTEGRATIONS PAGE ---
def build_integration_page(data):
    """Generate an /integrations/ index.html page — matches existing procore/plangrid pattern."""
    slug = data["slug"]
    name = data["name"]
    desc = data["desc"]
    url = f"{ROOT_URL}/integrations/{slug}"
    title = f"{name} Integration — VoiceLogPro"
    meta_desc = desc

    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": ROOT_URL},
            {"@type": "ListItem", "position": 2, "name": name, "item": url},
        ],
    }
    webpage = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": name,
        "url": url,
        "description": desc,
        "isPartOf": {"@type": "WebSite", "name": "VoiceLogPro", "url": ROOT_URL},
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": f"How much does the {name} integration cost?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"The {name} integration is included in all VoiceLogPro plans at no extra cost.",
                },
            },
            {
                "@type": "Question",
                "name": f"Does the {name} sync work both ways?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"Yes, data flows bidirectionally between VoiceLogPro and {name}.",
                },
            },
            {
                "@type": "Question",
                "name": f"Is my {name} data secure?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"Yes. We use bank-grade encryption and never store your {name} credentials.",
                },
            },
        ],
    }

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(meta_desc)}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(meta_desc)}">
<meta property="og:url" content="{url}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
{json_ld(webpage)}
{json_ld(breadcrumb)}
{json_ld(faq)}
<style>
body{{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.6;color:#1a1a1a;max-width:760px;margin:0 auto;padding:20px}}
h1{{font-size:2rem;margin-bottom:8px}}
h2{{font-size:1.4rem;margin-top:32px;margin-bottom:12px}}
p{{margin-bottom:16px}}
ul{{margin-bottom:16px;padding-left:20px}}
li{{margin-bottom:6px}}
details{{border:1px solid #e0e0e0;border-radius:8px;padding:12px;margin-bottom:8px}}
summary{{cursor:pointer;font-size:1.05rem}}
details[open] summary{{margin-bottom:8px}}
nav{{margin:20px 0;padding:12px 0;border-bottom:1px solid #eee}}
nav a{{margin-right:16px;text-decoration:none;color:#0066cc}}
footer{{margin-top:40px;padding-top:20px;border-top:1px solid #eee;color:#666;font-size:0.85rem}}
</style>
{CANONICAL_DISAMBIGUATION}
</head>
<body>
<nav><a href="{ROOT_URL}/">VoiceLogPro</a><a href="{ROOT_URL}/about">About</a><a href="{ROOT_URL}/blog">Blog</a><a href="{ROOT_URL}/faq">FAQ</a></nav>
<h1>{name}</h1>
<p style="font-size:1.1rem;color:#555">{desc}</p>
<h2>VoiceLogPro + {name} Integration</h2>
<p>{desc}</p>
<h2>What You Get</h2>
<ul>
<li>Seamless data sync between {name} and VoiceLogPro</li>
<li>Automated workflows that eliminate manual data entry</li>
<li>Real-time updates across both platforms</li>
<li>Unified reporting and analytics</li>
</ul>
<h2>Setup Guide</h2>
<p>Connecting {name} to VoiceLogPro takes about 5 minutes. Navigate to Settings > Integrations, select {name}, and authorize the connection. Data begins syncing immediately.</p>
<div style="background:#f0f9ff;border-radius:12px;padding:24px;margin:24px 0;text-align:center"><h3>Ready to Connect {name}?</h3><p>Start using VoiceLogPro with {name} in minutes.</p><a href="{ROOT_URL}/" style="display:inline-block;background:#0066cc;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:12px">Get Started</a></div>

<h2>Frequently Asked Questions</h2>
<details><summary><strong>How much does the {name} integration cost?</strong></summary><p>The {name} integration is included in all VoiceLogPro plans at no extra cost.</p></details>
<details><summary><strong>Does the {name} sync work both ways?</strong></summary><p>Yes, data flows bidirectionally between VoiceLogPro and {name}.</p></details>
<details><summary><strong>Is my {name} data secure?</strong></summary><p>Yes. We use bank-grade encryption and never store your {name} credentials.</p></details>

<footer><p>&copy; 2026 VoiceLogPro. Voice-to-PDF Construction Daily Reports.</p>{DREAM100_FOOTER}</footer>
{COMMON_META_TAIL}
</body>
</html>"""
    return html


# ---------------------------------------------------------------
# UTILS
# ---------------------------------------------------------------

def write_page(path: Path, content: str):
    """Write a page to disk. Skip if exists (idempotent). Returns True if written."""
    if path.exists():
        return False, "skipped (exists)"
    if DRY_RUN:
        return False, "skipped (dry-run)"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True, "created"


# ---------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------

def main():
    """Generate all pSEO expansion pages and patch vercel.json."""
    results = {"alternatives": [], "cities": [], "integrations": [], "vercel": None}

    # --- ALTERNATIVES ---
    for item in ALTERNATIVES:
        path = PUBLIC / "alternatives" / item["slug"] / "index.html"
        html = build_alternative_page(item)
        created, status = write_page(path, html)
        results["alternatives"].append({"slug": item["slug"], "status": status, "created": created})

    # --- CITIES ---
    for item in CITIES:
        path = PUBLIC / "cities" / item["slug"] / "index.html"
        html = build_city_page(item)
        created, status = write_page(path, html)
        results["cities"].append({"slug": item["slug"], "status": status, "created": created})

    # --- INTEGRATIONS ---
    for item in NEW_INTEGRATIONS:
        path = PUBLIC / "integrations" / item["slug"] / "index.html"
        html = build_integration_page(item)
        created, status = write_page(path, html)
        results["integrations"].append({"slug": item["slug"], "status": status, "created": created})

    # --- VERCEL.JSON REWRITES ---
    vercel_path = BASE / "vercel.json"
    try:
        vercel = json.loads(vercel_path.read_text())
        rewrites = vercel.get("rewrites", [])

        existing_sources = {r.get("source", "") for r in rewrites}

        needed = [
            ("/alternatives/:slug", "/alternatives/:slug/index.html"),
            ("/cities/:slug", "/cities/:slug/index.html"),
        ]

        added = []
        for source, dest in needed:
            if source not in existing_sources:
                rewrites.insert(0, {"source": source, "destination": dest})
                added.append(source)

        if added:
            if not DRY_RUN:
                vercel["rewrites"] = rewrites
                vercel_path.write_text(json.dumps(vercel, indent=2, ensure_ascii=False) + "\n")
            results["vercel"] = f"added rewrites: {', '.join(added)}"
        else:
            results["vercel"] = "no new rewrites needed (already present)"

    except Exception as e:
        results["vercel"] = f"ERROR: {e}"

    # --- REPORT ---
    print("=" * 60)
    print("  pSEO EXPANSION GENERATOR — VoiceLogPro")
    print("=" * 60)

    for section, label in [("alternatives", "Alternatives"), ("cities", "Cities"), ("integrations", "Integrations")]:
        items = results[section]
        created_count = sum(1 for i in items if i["created"])
        skipped_count = sum(1 for i in items if not i["created"])
        print(f"\n  [{label}] {created_count} created, {skipped_count} skipped")
        for item in items:
            flag = "✓" if item["created"] else "○"
            print(f"    {flag} /{section}/{item['slug']} — {item['status']}")

    print(f"\n  [vercel.json] {results['vercel']}")
    total_created = (
        sum(1 for i in results["alternatives"] if i["created"])
        + sum(1 for i in results["cities"] if i["created"])
        + sum(1 for i in results["integrations"] if i["created"])
    )
    print(f"\n  TOTAL: {total_created} new pages written")
    if DRY_RUN:
        print("  MODE: dry-run (no files written)")

    print("\n" + "=" * 60)

    return results


if __name__ == "__main__":
    main()
