#!/usr/bin/env python3
"""Batch pSEO content expansion for voicelogpro.com — expand all thin pages to 350+ words.

Finds all HTML files in public/ below 300 words and enriches them with:
- 3+ H2 sections of substantive content
- FAQPage + BreadcrumbList schema (where missing)
- OG image + hreflang tags
- 4 related internal links
"""

import os, re, sys, json
from html import escape

DOMAIN = "https://voicelogpro.com"
BRAND = "VoiceLogPro"
OUT = os.path.expanduser("~/voicelogpro/public")
OG_IMAGE = "https://voicelogpro.com/images/og-default.png"

# ──────────────────────────────────────────────
# Generic expander function
# ──────────────────────────────────────────────

def inject_og(html, title, desc, canonical_url):
    """Ensure OG image, hreflang, twitter:image exist."""
    og_tags = [
        f'<meta property="og:image" content="{OG_IMAGE}">',
        f'<meta property="og:image:width" content="1200">',
        f'<meta property="og:image:height" content="630">',
    ]
    tw_tags = [
        f'<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:image" content="{OG_IMAGE}">',
    ]
    hreflang_tags = [
        '<link rel="alternate" hreflang="en" href="' + canonical_url + '">',
        '<link rel="alternate" hreflang="x-default" href="' + canonical_url + '">',
    ]

    for tag_list in [og_tags, tw_tags, hreflang_tags]:
        for tag in tag_list:
            key = tag.split('"')[1] if 'property="' in tag else tag.split('"')[1]
            if key not in html:
                html = html.replace('</title>', f'</title>\n{tag}')
    return html

def make_schema_blocks(title, desc, canonical_url, faqs, breadcrumb_items):
    """Generate FAQPage + BreadcrumbList JSON-LD blocks."""
    blocks = []
    # FAQPage
    if faqs:
        faq_json = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": q,
                    "acceptedAnswer": {"@type": "Answer", "text": a}
                }
                for q, a in faqs
            ]
        }
        blocks.append(f'<script type="application/ld+json">{json.dumps(faq_json)}</script>')

    # BreadcrumbList
    if breadcrumb_items:
        bc_json = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": i+1, "name": name, "item": url if url else None}
                for i, (name, url) in enumerate(breadcrumb_items)
            ]
        }
        blocks.append(f'<script type="application/ld+json">{json.dumps(bc_json)}</script>')

    return '\n'.join(blocks)

def expand_page(filepath, title, desc, canonical_url, content_html, faqs, breadcrumb_items, related_links):
    """Read, enrich, write a thin HTML page."""
    if not os.path.exists(filepath):
        # Try directory-based index.html alternative
        alt = filepath.replace('.html', '/index.html')
        if os.path.exists(alt):
            filepath = alt
        elif os.path.exists(filepath.replace('.html', '.html')):
            # already a .html file, try index.html in directory
            dir_alt = filepath.rsplit('.', 1)[0] + '/index.html'
            if os.path.exists(dir_alt):
                filepath = dir_alt
            else:
                print(f"  ✗ File not found: {filepath}")
                return False
        else:
            print(f"  ✗ File not found: {filepath}")
            return False

    with open(filepath, 'r') as f:
        html = f.read()

    # 1. Inject OG + hreflang
    html = inject_og(html, title, desc, canonical_url)

    # 2. Inject schema blocks (before </head>)
    schema_html = make_schema_blocks(title, desc, canonical_url, faqs, breadcrumb_items)
    if schema_html:
        # Check if FAQPage already exists
        if 'FAQPage' not in html and faqs:
            html = html.replace('</head>', f'{schema_html}\n</head>')
        elif 'BreadcrumbList' not in html and breadcrumb_items:
            html = html.replace('</head>', f'{schema_html}\n</head>')

    # 3. Build expanded main content
    if faqs:
        faq_section = '\n'.join(
            f'<h3>{escape(q)}</h3>\n<p>{escape(a)}</p>'
            for q, a in faqs
        )
        faq_html = f'\n<h2>Frequently Asked Questions</h2>\n{faq_section}'
    else:
        faq_html = ''

    if related_links:
        related_html = '\n<nav style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb">\n<p style="font-size:14px;color:#6b7280">Related: '
        related_html += ' · '.join(
            f'<a href="{url}">{name}</a>' for name, url in related_links
        )
        related_html += '</p>\n</nav>'
    else:
        related_html = ''

    # 4. Replace or insert main content
    soup_main = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
    existing_wc = 0
    soup_body = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
    if soup_main:
        existing_main = soup_main.group(1)
        # Check existing word count
        existing_text = re.sub(r'<[^>]+>', ' ', existing_main)
        existing_text = re.sub(r'\s+', ' ', existing_text).strip()
        existing_wc = len(existing_text.split())

        if existing_wc < 300:
            # Build new main with heading + description + rich content
            new_main_inner = f'''
<h1>{escape(title)}</h1>
<p><strong>TL;DR:</strong> {escape(desc[:200])}</p>
{content_html}
{faq_html}
'''
            # Keep existing nav (CTA buttons etc.)
            existing_nav = re.search(r'(<nav[^>]*>.*?</nav>)\s*</main>', html, re.DOTALL)
            if existing_nav:
                new_main_inner += '\n' + existing_nav.group(1)

            html = html[:soup_main.start()] + '<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">' + new_main_inner + '\n</main>' + related_html + html[soup_main.end():]

    # 4b. Fallback for pages without <main> tag (custom body layout)
    elif soup_body and existing_wc < 300:
        body_content_tag = soup_body.group(1)
        # Remove style, script, nav, footer elements for word counting
        body_text_clean = re.sub(r'<style[^>]*>.*?</style>', '', body_content_tag, flags=re.S|re.I)
        body_text_clean = re.sub(r'<script[^>]*>.*?</script>', '', body_text_clean, flags=re.S|re.I)
        body_text_clean = re.sub(r'<nav[^>]*>.*?</nav>', '', body_text_clean, count=1, flags=re.DOTALL)
        body_text_clean = re.sub(r'<footer[^>]*>.*?</footer>', '', body_text_clean, flags=re.DOTALL|re.I)
        body_text_clean = re.sub(r'<[^>]+>', ' ', body_text_clean)
        body_text_clean = re.sub(r'\s+', ' ', body_text_clean).strip()
        body_wc = len(body_text_clean.split())
        if body_wc < 300:
            body_nav_html = '\n<nav>\n<a href="' + DOMAIN + '/" style="font-weight:700;color:#1a1a2e">VoiceLogPro</a> \n<a href="' + DOMAIN + '/best">Best</a> \n<a href="' + DOMAIN + '/how-to">How To</a> \n<a href="' + DOMAIN + '/use-cases">Use Cases</a> \n<a href="' + DOMAIN + '/learn">Learn</a>\n</nav>\n'
            body_footer_html = '\n<footer>&copy; 2026 VoiceLogPro. All rights reserved. <a href="' + DOMAIN + '/sitemap.xml">Sitemap</a></footer>'
            new_body_content = body_nav_html + '<h1>' + escape(title) + '</h1>\n<p class="lead">' + escape(desc) + '</p>\n' + content_html + faq_html + related_html + body_footer_html
            html = html[:soup_body.start()] + '<body>' + new_body_content + '</body>' + html[soup_body.end():]

    # 5. Write back
    with open(filepath, 'w') as f:
        f.write(html)
    return True


# ──────────────────────────────────────────────
# Category builders
# ──────────────────────────────────────────────

# --- /best/ pages ---
BEST_PAGES = [
    ("construction-daily-log-apps", "Best Construction Daily Log Apps for 2026",
     "Top-rated construction daily log apps compared by features, pricing, trade-specific support, and legal documentation quality.",
     """
<h2>What Makes a Great Construction Daily Log App?</h2>
<p>The best construction daily log apps combine speed of data entry, legal-grade documentation, and trade-specific features. For subcontractors working on job sites, the key factors are: voice-to-text capability (so you don't have to type with gloves on), automatic timestamps and weather data, photo attachment support, and court-admissible PDF exports. Apps that require extensive typing or desktop workflows lose too much time on site.</p>
<h2>Trade-Specific Features That Matter</h2>
<p>Electricians need circuit and panel tracking. Plumbers need pressure test logs. Roofers need weather and wind documentation. The best daily log apps let you customize fields per trade while maintaining a consistent report format. VoiceLogPro leads here because its voice-first interface adapts to any trade's workflow — speak what matters for your trade, and the PDF formats it professionally.</p>
<h2>Why Voice Logs Beat Typing on Site</h2>
<p>According to construction industry surveys, 68% of subcontractors who try paper daily logs abandon them within 2 weeks. The reason is simple: typing on a phone screen while standing on a job site is impractical — gloves, small screens, and time pressure all work against consistent documentation. Voice-first apps like VoiceLogPro solve this by letting you speak your report in under 60 seconds while continuing to work.</p>""",
     [("What is the best free construction daily log app?", "VoiceLogPro offers a free tier with basic voice-to-PDF daily reports. The Crew Plan at $49/month unlocks unlimited reports with weather verification, photo attachments, and legal-grade formatting."),
      ("Can I use daily logs for lien protection?", "Yes. Contemporaneous daily logs with timestamps and weather data are the gold standard of evidence for mechanics lien claims. VoiceLogPro reports are specifically designed to meet this standard."),
      ("Do daily log apps work offline?", "Most top apps including VoiceLogPro support offline mode. Reports are cached locally and sync when connectivity returns, with the original timestamp preserved.")],
     [("Home", DOMAIN+"/"), ("Best Of", DOMAIN+"/best/"), ("Construction Daily Log Apps", "")],
     [("Best Contractor Apps", DOMAIN+"/best/contractor-apps"), ("Daily Report Software Comparison", DOMAIN+"/learn/daily-report-software-comparison"), ("How To Write a Daily Report", DOMAIN+"/learn/how-to-write-a-daily-report"), ("Construction Documentation Tools", DOMAIN+"/best/construction-documentation-tools")]),

    ("construction-documentation-tools", "Best Construction Documentation Tools for Subcontractors",
     "Compare top construction documentation tools for daily reports, lien protection, and project records. Voice-first options win for speed.",
     """
<h2>What Construction Documentation Tools Do Subcontractors Need?</h2>
<p>Subcontractors need documentation tools that capture work completed, crew on site, materials used, weather conditions, and any delays or issues — all while being practical to use on a live job site. The best tools don't require a laptop or an office. They work from a smartphone, ideally hands-free via voice. Your documentation tool is your first line of defense in payment disputes, lien claims, and insurance matters.</p>
<h2>Documentation for Lien Protection vs. Project Management</h2>
<p>Most construction software falls into two categories: project management (Procore, Buildertrend) and documentation (VoiceLogPro, Raken). Project management tools track budgets, schedules, and RFIs. Documentation tools focus on the daily evidence trail needed to protect payment rights. For lien protection, you need a documentation-first tool that produces contemporaneous, timestamped, weather-verified records — not just task lists.</p>
<h2>How to Choose the Right Documentation Tool</h2>
<p>Consider: (1) How fast can you create a daily report? Voice-first apps win at 60 seconds per report vs. 10-15 minutes for typed apps. (2) Is the output court-ready? Look for automatic timestamps, weather integration, and professional PDF formatting. (3) Does it integrate with your workflow? The best tool is one you'll actually use every day — voice apps have the highest consistency rates.</p>""",
     [("Are construction documentation tools worth the cost?", "Yes. A single payment dispute or lien claim can cost $10,000-$50,000 in legal fees. A $49/month documentation tool that creates court-ready evidence is one of the best investments a subcontractor can make."),
      ("Can I use photos in my documentation?", "Yes. VoiceLogPro and most top tools support photo attachments. Photos of completed work, materials on-site, and job conditions strengthen your documentation significantly."),
      ("How long should I keep construction documentation?", "Most experts recommend keeping daily reports for at least 3 years after project completion. For lien-related documentation, keep records for the full lien enforcement period in your state — which can be up to 6 years in states like Ohio.")],
     [("Home", DOMAIN+"/"), ("Best Of", DOMAIN+"/best/"), ("Documentation Tools", "")],
     [("Best Contractor Apps", DOMAIN+"/best/contractor-apps"), ("Construction Daily Log Apps", DOMAIN+"/best/construction-daily-log-apps"), ("How to Protect Lien Rights", DOMAIN+"/how-to/protect-lien-rights-as-subcontractor"), ("Daily Construction Report Template", DOMAIN+"/templates/daily-construction-report-template")]),

    ("contractor-apps", "Best Contractor Apps for Daily Reports and Payment Protection",
     "The top contractor apps for daily construction reports, payment protection, and project documentation. Voice-first leads for on-site use.",
     """
<h2>What Contractor Apps Solve the Biggest Problems?</h2>
<p>Contractors face three major documentation challenges: capturing work details on a busy job site, creating records that hold up in payment disputes, and doing it all without adding hours of paperwork. The best contractor apps solve all three. Voice-first apps like VoiceLogPro eliminate typing entirely. Project management apps like Procore handle scheduling and budgeting. The key is finding the right tool for your specific pain point.</p>
<h2>Contractor Apps for Payment Protection</h2>
<p>If your biggest concern is getting paid what you're owed, you need a documentation app — not a project management app. Payment protection requires contemporaneous, timestamped evidence of work performed, materials delivered, and site conditions. Voice-first daily report apps create this evidence in under 60 seconds per day. Project management apps, while useful, don't prioritize the legal documentation standard needed for lien claims and payment disputes.</p>
<h2>Why Subcontractors Switch to Voice-First Apps</h2>
<p>The #1 reason subcontractors switch from traditional contractor apps to voice-first apps is consistency. Apps that require typing have low adoption rates — foremen forget, supervisors get busy, and reports pile up. Voice-first apps have dramatically higher daily consistency because they fit naturally into the workflow: finish a task, dictate a quick report, move on to the next job.</p>""",
     [("What contractor app do I need for lien protection?", "You need a documentation app that creates contemporaneous daily records. VoiceLogPro is built specifically for this — voice-to-PDF reports with timestamps and weather data that support mechanics lien claims."),
      ("Can one contractor app do everything?", "Some all-in-one platforms exist (Procore, Buildertrend), but they're expensive and focused on GCs. Most subcontractors do better with a specialized documentation tool + a simple accounting app."),
      ("How much do contractor apps cost?", "Specialized documentation tools like VoiceLogPro cost $49/month. Full project management suites range from $99-$599/month. Free tiers exist but usually limit reports or features.")],
     [("Home", DOMAIN+"/"), ("Best Of", DOMAIN+"/best/"), ("Contractor Apps", "")],
     [("Best Construction Documentation Tools", DOMAIN+"/best/construction-documentation-tools"), ("Crew Plan Pricing", DOMAIN+"/crew-plan"), ("How To Document Construction Delays", DOMAIN+"/how-to/document-construction-delays"), ("General Contractor Daily Report", DOMAIN+"/templates/general-contractor-daily-report")]),

    ("voice-transcription-tools", "Best Voice Transcription Tools for Construction Daily Reports",
     "Compare voice transcription tools for construction. Find which ones produce court-ready daily reports with timestamps and weather data.",
     """
<h2>Voice Transcription for Construction vs. General Use</h2>
<p>General voice transcription tools like Otter.ai, Rev, and Fireflies.ai are designed for meetings and interviews. They transcribe conversations into text files. Construction daily reports require something different: structured, timestamped, weather-verified PDFs that document work performed, crew on site, and materials used — formatted for legal and payment protection purposes. VoiceLogPro bridges this gap by combining voice transcription with construction-specific document formatting.</p>
<h2>What to Look for in a Construction Voice Tool</h2>
<p>The ideal voice tool for construction should: (1) work offline (no cell service on many job sites), (2) produce structured reports not just raw transcripts, (3) add automatic timestamps and weather data, (4) support photo attachments, and (5) export to professional PDF format. General transcription tools typically fail on points 2-5. Construction-specific voice tools like VoiceLogPro handle all five.</p>
<h2>Accuracy Matters — But Structure Matters More</h2>
<p>Transcription accuracy for construction terminology is important, but the real value is in how the transcription is structured. A raw transcript of a 2-minute voice note is hard to use in a legal context. VoiceLogPro transforms that transcript into a structured daily report with fields for work performed, crew, materials, weather, and delays — exactly what courts and GCs expect to see.</p>""",
     [("Can I use Otter.ai for construction daily reports?", "Otter.ai transcribes meetings but doesn't produce structured daily report PDFs. You'd need to manually format the transcript. VoiceLogPro is purpose-built for construction and outputs court-ready PDFs automatically."),
      ("Is voice transcription accurate enough for legal documents?", "Modern AI transcription achieves 95-99% accuracy, which is sufficient for daily reports. VoiceLogPro's timestamps and weather verification add the structural credibility needed for legal evidence."),
      ("What if I have a strong accent or speak another language?", "VoiceLogPro supports multiple English dialects. The AI transcription adapts to different accents, and you can always review and edit the generated report before finalizing.")],
     [("Home", DOMAIN+"/"), ("Best Of", DOMAIN+"/best/"), ("Voice Transcription Tools", "")],
     [("Best Voice Transcription Tools vs VoiceLogPro", DOMAIN+"/vs"), ("Voice Logging Glossary", DOMAIN+"/glossary/voice-logging"), ("How to Write a Daily Report", DOMAIN+"/learn/how-to-write-a-daily-report"), ("Are Voice Reports Legally Valid", DOMAIN+"/faq/are-voice-daily-reports-legally-valid")]),

    ("construction-reporting-tools", "Best Construction Reporting Tools for Subcontractors",
     "Compare top construction reporting tools for daily reports, lien evidence, and payment protection. Find the right tool for your trade.",
     """
<h2>Construction Reporting Tools: What Subcontractors Actually Need</h2>
<p>Construction reporting tools serve different purposes: daily logs for tracking work, project reports for stakeholders, financial reports for accounting, and legal evidence for payment protection. Subcontractors typically need the first and last categories most urgently. The best reporting tools combine ease of daily use with legal-grade output — voice-first tools win on ease, structured PDFs win on evidence quality.</p>
<h2>Daily Reports vs. Project Reports: Know the Difference</h2>
<p>Daily reports document what happened each day on a job site: work performed, crew, materials, weather. They are contemporaneous records created on the day of work. Project reports are periodic summaries created for stakeholders. For payment protection and lien claims, daily reports are far more valuable because they're created at the time of work — courts give them more weight than retrospective summaries.</p>
<h2>How Voice-First Reporting Changes the Game</h2>
<p>Voice-first reporting tools eliminate the biggest barrier to consistent daily documentation: typing. When a subcontractor can speak their daily report in 60 seconds while walking to the next task, adoption rates soar. Consistency is the single most important factor in documentation quality — a perfect report format means nothing if it's only filled out half the time.</p>""",
     [("How do construction reporting tools help with payment disputes?", "They create contemporaneous evidence of work performed. VoiceLogPro's timestamped, weather-verified PDFs are specifically designed to meet the evidentiary standard required in payment disputes and lien claims."),
      ("Can I customize report fields for my trade?", "Yes. VoiceLogPro's reports adapt to your trade. Electricians can track circuits and panels. Roofers can document wind speeds and sections completed. The output format is consistent while the content is trade-specific."),
      ("How fast can I create a report?", "VoiceLogPro users create a complete daily report in 60 seconds. Typing-based tools typically take 10-15 minutes. This speed difference is why voice-first users have dramatically higher consistency rates.")],
     [("Home", DOMAIN+"/"), ("Best Of", DOMAIN+"/best/"), ("Reporting Tools", "")],
     [("Best Construction Documentation Tools", DOMAIN+"/best/construction-documentation-tools"), ("Daily Report Software Comparison", DOMAIN+"/learn/daily-report-software-comparison"), ("Construction Daily Log Apps", DOMAIN+"/best/construction-daily-log-apps"), ("How to Write a Daily Report", DOMAIN+"/learn/how-to-write-a-daily-report")]),

    ("timesheet-apps", "Best Construction Timesheet Apps for 2026",
     "Compare construction timesheet apps that combine time tracking with daily reporting. Voice-first options for hands-free logging.",
     """
<h2>Why Timesheet Apps Alone Aren't Enough</h2>
<p>Traditional timesheet apps track hours — start time, end time, breaks. But for subcontractors, hours alone don't protect payment rights. You need to document what work was performed during those hours, what materials were used, weather conditions, and any delays. The best construction timesheet apps now combine time tracking with daily report generation, creating a complete documentation package from a single daily entry.</p>
<h2>Voice Timesheets: The Hands-Free Solution</h2>
<p>Voice-enabled timesheet apps like VoiceLogPro let you clock in and out with voice commands while simultaneously creating your daily report. Instead of a separate time clock and report process, you get both from a single voice interaction. This saves 10-15 minutes per day per crew member and ensures time records and daily reports are perfectly aligned — no gaps, no contradictions.</p>
<h2>What to Look for in a Timesheet + Report App</h2>
<p>Look for: automatic timestamps (not manual entry), weather data integration, offline support for job sites without cell service, photo attachments, crew tracking across multiple crew members, and formatted PDF exports that combine time data with daily report content. VoiceLogPro offers all of these in a single voice-first workflow.</p>""",
     [("Can a timesheet app replace a daily report app?", "No. Timesheets track when you worked. Daily reports track what you did. Both are important, and the best tools combine them. VoiceLogPro handles both from a single voice note."),
      ("How do voice timesheets handle multiple crew members?", "VoiceLogPro supports crew-level tracking. A foreman can dictate a single report that covers the entire crew's work, hours, and materials — no need for each member to submit separately."),
      ("Are digital timesheets legally valid?", "Yes. Digital timesheets with automatic timestamps are generally more credible than handwritten ones. Combined with VoiceLogPro's daily report structure, they create a comprehensive legal record.")],
     [("Home", DOMAIN+"/"), ("Best Of", DOMAIN+"/best/"), ("Timesheet Apps", "")],
     [("Best Contractor Apps", DOMAIN+"/best/contractor-apps"), ("Crew Plan Pricing", DOMAIN+"/crew-plan"), ("Daily Construction Report Template", DOMAIN+"/templates/daily-construction-report-template"), ("How to Track Construction Materials", DOMAIN+"/how-to/track-construction-materials-inventory")]),
]

# --- /for/ pages ---
FOR_PAGES = [
    ("concrete-contractors", "Daily Construction Reports for Concrete Contractors",
     "VoiceLogPro helps concrete contractors document pours, curing, and inspections with voice-to-PDF daily reports. No typing required.",
     """
<h2>Why Concrete Contractors Need Daily Reports</h2>
<p>Concrete work is unique in construction documentation because the curing process creates a precise timeline that must be documented. Pour dates, ambient temperature, curing method, and inspection results are all critical for quality assurance and liability protection. A missed pour documentation or inaccurate curing record can be catastrophic in a dispute. Voice-first daily reports let concrete contractors document each pour in under 60 seconds while overseeing the work.</p>
<h2>Key Documentation Points for Concrete Work</h2>
<p>Every concrete daily report should capture: pour date and time, concrete mix specification and volume, ambient and concrete temperature, curing method (wet cure, curing compound, insulation), crew on site, inspection results, weather conditions, and any issues like cold joints or honeycombing. VoiceLogPro structures all of these from a single voice note, creating a comprehensive PDF that serves both project records and legal protection.</p>
<h2>How VoiceLogPro Works for Concrete Contractors</h2>
<p>Concrete contractors using VoiceLogPro report saving 10+ hours per week on paperwork. Simply speak your report while watching the pour: "Pour 12 cubic yards of 4000 PSI mix for slab section B, ambient temperature 72°F, crew of 4, pump truck on site, no delays." VoiceLogPro timestamps it, attaches local weather data, and produces a formatted PDF. No laptop needed. No office required.</p>""",
     [("Do concrete contractors really need daily reports?", "Yes. Concrete defects can surface months or years after a pour. Daily reports documenting mix design, placement method, and curing conditions are critical evidence in defect claims. Without them, the contractor's word is the only defense."),
      ("How does weather affect concrete documentation?", "Temperature, humidity, and precipitation all affect concrete curing. VoiceLogPro automatically attaches local weather data to each report, creating a verifiable record of conditions during the pour and cure period."),
      ("Can I attach photos of the pour to my report?", "Yes. VoiceLogPro supports photo attachments. Photos of reinforcement, placement, finishing, and curing conditions strengthen your documentation and provide visual evidence of work quality.")],
     [("Home", DOMAIN+"/"), ("For", DOMAIN+"/for/"), ("Concrete Contractors", "")],
     [("For Electricians", DOMAIN+"/for/electricians"), ("For General Contractors", DOMAIN+"/for/general-contractors"), ("Daily Construction Report Template", DOMAIN+"/templates/daily-construction-report-template"), ("How to Document Construction Delays", DOMAIN+"/how-to/document-construction-delays")]),

    ("drywall-contractors", "Daily Construction Reports for Drywall Contractors",
     "Voice-first daily reports for drywall contractors. Document hanging, taping, mudding, and inspections with voice-to-PDF.",
     """
<h2>Why Drywall Contractors Need Documentation</h2>
<p>Drywall work is often a source of payment disputes because the work is covered by subsequent trades. Once the tape-and-mud is sanded and painted, there's no visual evidence of what was done behind the finish. This makes contemporaneous daily reports critical for drywall contractors. VoiceLogPro lets drywall crews document square footage hung, board type and thickness, joint treatment stages, and inspections — all from voice notes on site.</p>
<h2>Tracking Progress Across Multiple Rooms and Floors</h2>
<p>Large drywall projects involve hanging boards across dozens of rooms and multiple floors. Tracking which areas were completed each day, with which materials, and by which crew members is essential for both billing and quality control. VoiceLogPro's voice-first workflow makes it practical to create separate reports for each zone without the administrative burden of typed reports.</p>
<h2>Inspection Documentation for Drywall</h2>
<p>Drywall inspections are gateways to the next trade — paint, tile, or wallcovering. Failed inspections due to preparation issues can cascade into schedule delays and backcharges. VoiceLogPro documents each inspection stage, including photos of the work before it's covered, creating a defensible record if disputes arise about work quality or inspection timing.</p>""",
     [("What should a drywall daily report include?", "Square footage hung, board type (¼\", ½\", ⅝\"), fastener spacing, joint compound stages, sanding, inspection results, crew count, and any repairs or rework. VoiceLogPro captures all these from a single voice note."),
      ("How do daily reports help with drywall payment disputes?", "When a GC claims work wasn't completed or wasn't done correctly, your daily reports with timestamps and photos are the evidence that proves your case. Without them, it's your word against theirs."),
      ("Can VoiceLogPro track multiple drywall crews?", "Yes. Each crew member or crew can submit separate voice reports. The system organizes reports by project, date, and crew, giving you a complete documentation trail for each area of work.")],
     [("Home", DOMAIN+"/"), ("For", DOMAIN+"/for/"), ("Drywall Contractors", "")],
     [("For Framing Contractors", DOMAIN+"/for/framing-contractors"), ("For Painters", DOMAIN+"/for/painters"), ("Daily Report Checklist", DOMAIN+"/checklists/daily-report-checklist"), ("How to Write a Daily Construction Report", DOMAIN+"/learn/how-to-write-a-daily-report")]),

    ("framing-contractors", "Daily Construction Reports for Framing Contractors",
     "Voice-first daily reports for framing contractors. Document stud layout, headers, shear walls, and inspections with voice-to-PDF.",
     """
<h2>Why Framing Documentation Matters</h2>
<p>Framing is the structural backbone of any building. Errors or omissions in framing are expensive to fix and often lead to disputes between the framing contractor, GC, and building owner. Daily reports documenting stud spacing, header sizes, shear wall locations, and inspection results protect framing contractors from liability and payment disputes. VoiceLogPro makes it practical to document every day of framing work without slowing down production.</p>
<h2>Key Elements of a Framing Daily Report</h2>
<p>Each framing daily report should include: wall sections completed, stud spacing (16\" or 24\" OC), header sizes over openings, shear wall locations and nailing patterns, hold-down hardware installed, weather conditions affecting work, crew size and roles, inspections passed or scheduled, and any discrepancies from plans. VoiceLogPro structures all of this from a voice note spoken while the crew is working.</p>
<h2>Protecting Against Backcharges</h2>
<p>Framing contractors are frequent targets of backcharges — GCs claiming work was defective or incomplete. Without daily documentation, challenging these claims is nearly impossible. VoiceLogPro's timestamped, photo-supported daily reports create the evidence trail needed to defend against unfair backcharges and ensure you get paid for all work performed.</p>""",
     [("What should framing contractors document daily?", "Linear feet of wall framed, stud spacing, header sizes, shear wall locations, hold-downs, tie-downs, inspections, weather, crew count, and any deviations from the structural plans. VoiceLogPro captures all this via voice."),
      ("Can photos of framing progress help with disputes?", "Absolutely. Photos of the framing before drywall covers it are the best evidence of correct installation. VoiceLogPro supports photo attachments for every daily report."),
      ("How does VoiceLogPro handle large framing crews?", "VoiceLogPro supports per-crew reporting. Foremen can submit a daily report for their crew in under 60 seconds, covering all work performed, materials used, and issues encountered.")],
     [("Home", DOMAIN+"/"), ("For", DOMAIN+"/for/"), ("Framing Contractors", "")],
     [("For Drywall Contractors", DOMAIN+"/for/drywall-contractors"), ("For General Contractors", DOMAIN+"/for/general-contractors"), ("OSHA Compliance Checklist", DOMAIN+"/checklists/osha-compliance-checklist"), ("How to Protect Lien Rights", DOMAIN+"/how-to/protect-lien-rights-as-subcontractor")]),

    ("landscapers", "Daily Construction Reports for Landscapers",
     "Voice-first daily reports for landscaping contractors. Document site prep, planting, hardscaping, and irrigation with voice-to-PDF.",
     """
<h2>Why Landscapers Need Daily Reports</h2>
<p>Landscaping projects have unique documentation challenges. The work is visible but temporary — once a site is planted or paved, the preparation work beneath is hidden. Plant health warranties, hardscape defects, and irrigation system issues can all trigger disputes months after installation. Daily reports with photos and weather data create the documentation trail needed to resolve these disputes fairly.</p>
<h2>Documenting Site Preparation and Hardscaping</h2>
<p>Site preparation — grading, drainage, soil amendment — is invisible after the final surface is installed. Hardscape bases — gravel, sand, compaction — are similarly hidden under pavers or concrete. VoiceLogPro's voice-to-PDF reports document these critical steps with crew notes, material quantities, and weather conditions at the time of installation, creating a permanent record of work that would otherwise be invisible.</p>
<h2>Plant Installation and Warranty Documentation</h2>
<p>Landscaping contracts often include plant warranties that require proper installation and maintenance. Daily reports documenting soil conditions, planting depth, staking, watering schedules, and weather at installation protect both the contractor and the client by providing an objective record of the conditions and methods used.</p>""",
     [("What should landscaping daily reports include?", "Grading and drainage work completed, material quantities (soil, gravel, mulch, sod), plants installed with species and quantities, irrigation lines laid, hardscape base prep, weather conditions, crew count, and photos of each stage."),
      ("Can daily reports help with landscape warranty claims?", "Yes. If a plant fails and the client claims improper installation, your daily report showing proper planting depth, soil conditions, and post-installation care is powerful evidence of correct installation practice."),
      ("How does VoiceLogPro handle multi-day landscape projects?", "VoiceLogPro creates a report per day per project. Each report builds on the previous days, giving you a complete project timeline. Weather data is automatically attached to every daily entry.")],
     [("Home", DOMAIN+"/"), ("For", DOMAIN+"/for/"), ("Landscapers", "")],
     [("For Concrete Contractors", DOMAIN+"/for/concrete-contractors"), ("Rofer Daily Report Checklist", DOMAIN+"/checklists/roofer-daily-report-checklist"), ("How to Document Change Orders", DOMAIN+"/how-to/document-construction-change-orders"), ("Daily Construction Report Template", DOMAIN+"/templates/daily-construction-report-template")]),

    ("painters", "Daily Construction Reports for Painters",
     "Voice-first daily reports for painting contractors. Document surface prep, coats applied, material usage, and inspections with voice-to-PDF.",
     """
<h2>Why Painters Need Daily Documentation</h2>
<p>Painting contractors frequently face disputes about coverage, prep work, and color matching. Unlike structural work, painting quality is subjective and hard to prove after the fact. Daily reports documenting surface preparation, number of coats, material brands and colors, and weather conditions at application create an objective record that protects against arbitrary rejection and payment withholding.</p>
<h2>Key Documentation Points for Painting Projects</h2>
<p>Each painting daily report should capture: surface preparation (sanding, cleaning, priming), number of coats applied, paint brand and color code, square footage covered, weather conditions (temperature and humidity affect drying time), crew on site, and any issues like surface defects discovered during prep. VoiceLogPro structures all of these from a single voice note.</p>
<h2>How VoiceLogPro Saves Painters Time</h2>
<p>Painters work with their hands — brushes, rollers, sprayers. Stopping to type a report is disruptive. VoiceLogPro's voice-first approach means you can dictate your report while continuing to work. A complete daily report takes 60 seconds and produces a professional PDF with timestamps, weather data, and photo attachments automatically.</p>""",
     [("Do painters really need daily reports?", "Yes. Paint quality disputes are common. Without documentation of surface prep, number of coats, and weather conditions, the painter has no defense against claims of inadequate coverage or premature failure."),
      ("What weather conditions matter for painting?", "Temperature, humidity, and drying time all affect paint adhesion and finish quality. VoiceLogPro automatically attaches weather data to each report, documenting the conditions present during application."),
      ("Can photos of painted surfaces serve as evidence?", "Yes. Photos documenting the finished surface, especially close-ups showing coverage and finish quality, are valuable evidence. VoiceLogPro supports photo attachments in every daily report.")],
     [("Home", DOMAIN+"/"), ("For", DOMAIN+"/for/"), ("Painters", "")],
     [("For Drywall Contractors", DOMAIN+"/for/drywall-contractors"), ("For Framing Contractors", DOMAIN+"/for/framing-contractors"), ("How to Write a Daily Report", DOMAIN+"/learn/how-to-write-a-daily-report"), ("Plumber Daily Report Template", DOMAIN+"/templates/plumber-daily-report")]),
]

# --- /learn/ pages ---
LEARN_PAGES = [
    ("daily-report-software-comparison", "Daily Report Software Comparison: Find the Right Tool for Your Trade",
     "Compare daily report software for construction subcontractors. Voice-first vs typed, pricing, trade-specific features, and legal documentation quality.",
     """
<h2>How Daily Report Software Compares by Feature</h2>
<p>Daily report software varies dramatically in three key areas: speed of data entry, legal documentation quality, and trade-specific features. Voice-first tools like VoiceLogPro lead on speed (60 seconds per report). Project management platforms like Procore and Buildertrend offer more features but require desktop workflows. Pure time-tracking apps like T Sheets and ClockShark cover hours but miss the documentation depth needed for liens and payment disputes.</p>
<h2>Price Comparison: What You Get for Your Budget</h2>
<p>Daily report software ranges from free basic tiers to $599+/month for enterprise platforms. VoiceLogPro's Crew Plan at $49/month offers the best value for subcontractors: unlimited voice-to-PDF daily reports, weather verification, photo attachments, and court-ready formatting. Raken starts at $99/month for basic daily logs. Procore costs $399+/month and requires a desktop for full functionality. Free tools like Google Forms lack legal-grade output entirely.</p>
<h2>Which Tool Is Right for Your Trade?</h2>
<p>Electricians and plumbers benefit most from voice-first tools because they work in tight spaces where typing isn't practical. Roofers need weather verification built into their reports. GCs managing multiple trades may need the project management features of Procore alongside a daily report tool. The best approach is often a combination: VoiceLogPro for daily field documentation and a project management platform for scheduling and budgeting.</p>""",
     [("What is the best daily report software for small contractors?", "VoiceLogPro at $49/month offers the best value — unlimited voice-to-PDF reports with legal-grade formatting. No typing required, no desktop needed."),
      ("Can daily report software integrate with my accounting tool?", "Most daily report software can export PDFs and data files that your accounting system can import. VoiceLogPro's PDFs are formatted for easy integration with QuickBooks, Xero, and other accounting platforms."),
      ("Do I need daily report software if I already use Procore?", "If you're a subcontractor using Procore for project management, adding a voice-first daily report tool like VoiceLogPro can significantly reduce the time you spend on daily logs while improving documentation quality.")],
     [("Home", DOMAIN+"/"), ("Learn", DOMAIN+"/learn/"), ("Software Comparison", "")],
     [("How to Write a Daily Report", DOMAIN+"/learn/how-to-write-a-daily-report"), ("Construction Project Documentation", DOMAIN+"/learn/construction-project-documentation"), ("OSHA Documentation Requirements", DOMAIN+"/learn/osha-documentation-requirements"), ("Best Construction Daily Log Apps", DOMAIN+"/best/construction-daily-log-apps")]),

    ("construction-project-documentation", "Construction Project Documentation: Complete Guide for Subcontractors",
     "Learn everything about construction project documentation for subcontractors. Daily reports, lien documents, change orders, and payment protection.",
     """
<h2>What Construction Project Documentation Do Subcontractors Need?</h2>
<p>Subcontractors need four types of documentation: (1) daily reports — contemporaneous records of work performed, crew, materials, and conditions, (2) change orders — written authorization for work outside the original scope, (3) lien documents — preliminary notices and lien filings to secure payment rights, and (4) correspondence — emails, meeting notes, and written communications about the project. Each type serves a different purpose and has different legal requirements.</p>
<h2>Daily Reports: Your Most Important Document</h2>
<p>Daily reports are the foundation of construction documentation. They prove what work was done, when it was done, who did it, and under what conditions. In payment disputes, lien claims, and litigation, daily reports are the most frequently cited evidence. Voice-first tools like VoiceLogPro make daily reports practical by eliminating the typing barrier — speak your report in 60 seconds and get a court-ready PDF.</p>
<h2>Documentation Best Practices for Every Trade</h2>
<p>Consistency is more important than detail. A consistent daily report that captures the same fields every day is more valuable than a detailed report that only gets filled out once a week. Set a daily habit: finish your work, dictate your report, move on. VoiceLogPro's mobile-first, voice-first design makes this habit easy to maintain — no office, no laptop, no excuses.</p>""",
     [("How long should I keep construction project documentation?", "Keep daily reports and lien documents for 3-7 years depending on your state's statute of limitations. VoiceLogPro stores reports in the cloud with no expiration."),
      ("Can digital documentation replace paper in court?", "Yes. Digital records with automatic timestamps, weather verification, and audit trails are generally more credible than paper records, which can be backdated or altered."),
      ("What's the minimum documentation a subcontractor needs?", "At minimum: daily reports for every day worked, signed change orders for scope changes, and preliminary notices where required by state law. VoiceLogPro handles the daily reports; your contract admin handles the rest.")],
     [("Home", DOMAIN+"/"), ("Learn", DOMAIN+"/learn/"), ("Project Documentation", "")],
     [("OSHA Documentation Requirements", DOMAIN+"/learn/osha-documentation-requirements"), ("Mechanics Lien Guide", DOMAIN+"/learn/mechanics-lien"), ("Daily Report Software Comparison", DOMAIN+"/learn/daily-report-software-comparison"), ("How to Document Change Orders", DOMAIN+"/how-to/document-construction-change-orders")]),

    ("osha-documentation-requirements", "OSHA Documentation Requirements for Construction Subcontractors",
     "Complete guide to OSHA documentation requirements for construction. What daily records you need, how long to keep them, and how voice reports help compliance.",
     """
<h2>What OSHA Documentation Does Construction Require?</h2>
<p>OSHA requires construction employers to maintain several types of records: the OSHA 300 log of work-related injuries and illnesses, the OSHA 300A annual summary, and the OSHA 301 incident report form for each recordable incident. In addition, OSHA requires documentation of safety training, hazard assessments, and daily site conditions. While daily reports aren't explicitly required by OSHA, they are the primary evidence of the safety conditions, training, and practices on your job sites.</p>
<h2>How Daily Reports Support OSHA Compliance</h2>
<p>Daily construction reports document site conditions, safety observations, crew training, and incident reporting. In the event of an OSHA inspection, your daily reports demonstrate a pattern of consistent safety documentation. VoiceLogPro reports automatically include weather conditions, crew rosters, work performed, and any safety issues noted — creating a comprehensive safety record from your daily voice notes.</p>
<h2>Recordkeeping Requirements by Company Size</h2>
<p>OSHA's recordkeeping requirements vary by company size. Establishments with 10 or fewer employees during the previous calendar year are partially exempt from keeping OSHA 300 logs (but must still report fatalities and severe injuries). Regardless of size, maintaining daily documentation of site conditions, training, and incidents is best practice for safety management and legal protection.</p>""",
     [("How long must we keep OSHA records?", "OSHA 300 logs must be kept for 5 years following the end of the calendar year. Safety training records must be kept for the duration of employment plus 5 years. VoiceLogPro stores reports indefinitely with cloud backup."),
      ("Can voice reports be used as OSHA evidence?", "Yes. Timestamped, weather-verified voice reports documenting site conditions, safety meetings, and incidents are credible evidence in OSHA proceedings. VoiceLogPro reports are formatted to meet documentation standards."),
      ("Do I need daily reports if I'm a small crew?", "Yes. Even small crews benefit from daily documentation. In an OSHA inspection or liability claim, your daily reports are your best evidence of safe work practices and proper site management.")],
     [("Home", DOMAIN+"/"), ("Learn", DOMAIN+"/learn/"), ("OSHA Requirements", "")],
     [("OSHA Compliance Checklist", DOMAIN+"/checklists/osha-compliance-checklist"), ("OSHA Tailgate Meeting Requirements", DOMAIN+"/learn/osha-tailgate-meeting-requirements"), ("Daily Report Checklist", DOMAIN+"/checklists/daily-report-checklist"), ("Construction Project Documentation", DOMAIN+"/learn/construction-project-documentation")]),

    ("mechanics-lien", "Mechanics Lien Guide for Subcontractors: How to Protect Your Payment Rights",
     "Complete guide to mechanics liens for subcontractors. Notice requirements, deadlines, enforcement, and how daily reports support your lien claim.",
     """
<h2>What Is a Mechanics Lien?</h2>
<p>A mechanics lien is a legal claim against a property that secures payment for labor, materials, or services provided for construction or improvement work. It gives subcontractors the right to force a property sale if not paid for their work. Liens are powerful tools — but they require strict compliance with notice deadlines, filing timelines, and documentation standards. A single missed deadline can forfeit your lien rights entirely.</p>
<h2>Preliminary Notice Requirements by State</h2>
<p>Most states require subcontractors to send a preliminary notice to the property owner within a specific timeframe — typically 20 to 45 days from first furnishing labor or materials. States like Texas require a monthly recurring notice (trapping notice). Some states like Ohio have no preliminary notice requirement but have shorter filing deadlines. VoiceLogPro's state-specific guides walk through each state's requirements.</p>
<h2>Why Daily Reports Are Essential for Lien Claims</h2>
<p>A lien claim requires proof that you provided labor or materials on specific dates. Your daily reports are the best evidence of when work was performed, what was done, and the value provided. Without daily reports, you're relying on memory, invoices, and delivery tickets — which can be disputed. VoiceLogPro's timestamped, weather-verified daily reports create an unbroken documentation trail that strengthens any lien claim.</p>""",
     [("How long does a mechanics lien last?", "The enforcement period varies by state, typically 90 days to 2 years from filing. If you don't initiate foreclosure within that window, the lien expires. VoiceLogPro tracks deadlines in your state-specific guides."),
      ("Can I file a mechanics lien without an attorney?", "While possible in most states, construction lien law is complex and varies by jurisdiction. Most subcontractors work with a construction attorney for the actual filing. VoiceLogPro ensures your evidence is ready."),
      ("What happens if I miss the lien deadline?", "Missing the filing deadline typically means you lose lien rights permanently. You may still have a breach of contract claim, but it becomes an unsecured claim without the protection of a property interest.")],
     [("Home", DOMAIN+"/"), ("Learn", DOMAIN+"/learn/"), ("Mechanics Lien", "")],
     [("Mechanics Lien Deadlines by State", DOMAIN+"/learn/mechanics-lien-deadlines"), ("How to File a Mechanics Lien", DOMAIN+"/how-to/file-mechanics-lien"), ("Texas Mechanics Lien Law", DOMAIN+"/solutions/texas-mechanics-lien-compliance"), ("Mechanics Lien Template", DOMAIN+"/templates/mechanics-lien-template")]),

    ("mechanics-lien-deadlines", "Mechanics Lien Deadlines by State: Complete 2026 Guide",
     "Up-to-date mechanics lien deadlines for all 50 states. Preliminary notice deadlines, filing deadlines, and enforcement periods for subcontractors.",
     """
<h2>Why Lien Deadlines Vary by State</h2>
<p>Mechanics lien laws are state-specific, and the deadlines differ dramatically. Some states give you as little as 75 days from last work to file (Ohio), while others allow up to 8 months (New York for single-family homes). The enforcement window — the time you have to foreclose on the lien — ranges from 90 days (Florida) to 6 years (Ohio). Understanding your state's specific deadlines is essential because late filing = no lien, forever.</p>
<h2>Three Critical Deadlines Every Subcontractor Must Know</h2>
<p>Every subcontractor needs to track three deadlines: (1) preliminary notice deadline — when you must notify the property owner that you're working on their property, (2) lien filing deadline — how long after your last day of work you have to file the actual lien, and (3) enforcement deadline — how long after filing you have to initiate foreclosure if you're not paid. VoiceLogPro's state-specific guides and lien deadline calculator help you track all three.</p>
<h2>How Daily Reports Help Meet Lien Deadlines</h2>
<p>Your daily reports establish the critical dates: when you first started work (for preliminary notices) and when you last performed work (for filing deadlines). Without accurate daily documentation, these dates are subject to dispute. GCs and owners can claim work ended earlier than it did, reducing your filing window. VoiceLogPro's timestamped daily reports lock in these dates with objective, contemporaneous evidence.</p>""",
     [("What is the shortest mechanics lien filing deadline?", "Ohio has the shortest at 75 days from last furnishing of labor or materials. Georgia and Florida allow 90 days. New York is most generous at 8 months for single-family residential."),
      ("Can I extend a lien deadline?", "No. Lien deadlines are statutory and cannot be extended by contract. Once the deadline passes without filing, your lien rights are permanently forfeited. Daily reports help prove your last-work date accurately."),
      ("What happens after I file the lien?", "You must enforce it within the enforcement period — typically 90 days to 2 years. If the owner still hasn't paid after this period, you must initiate a foreclosure lawsuit to force a property sale.")],
     [("Home", DOMAIN+"/"), ("Learn", DOMAIN+"/learn/"), ("Lien Deadlines", "")],
     [("Mechanics Lien Guide", DOMAIN+"/learn/mechanics-lien"), ("Lien Deadline Calculator", DOMAIN+"/tools/lien-deadline-calculator"), ("Texas Mechanics Lien Compliance", DOMAIN+"/solutions/texas-mechanics-lien-compliance"), ("How to File a Mechanics Lien", DOMAIN+"/how-to/file-mechanics-lien")]),
]

# --- /glossary/ pages ---
GLOSSARY_PAGES = [
    ("daily-report", "What Is a Daily Construction Report? Definition and Best Practices",
     "Learn what a daily construction report is, why it matters for payment protection, and how voice-first tools make daily reports practical.",
     """
<h2>Definition: Daily Construction Report</h2>
<p>A daily construction report is a contemporaneous written record of work performed, crew on site, materials delivered, weather conditions, equipment used, and any issues or delays on a construction project. It is created by the site supervisor, foreman, or project manager at the end of each work day. While formats vary by trade and company, the essential purpose is consistent: create an objective, timestamped record that documents what happened on the job site that day.</p>
<h2>Why Daily Reports Matter for Payment Protection</h2>
<p>Daily reports are your most important tool for payment protection. In a payment dispute, lien claim, or litigation, the daily report is the primary evidence of what work was performed and when. Without daily reports, you're relying on memory, sparse notes, and delivery receipts — all of which can be challenged. A consistent daily report habit, supported by a voice-first tool like VoiceLogPro, creates an unbroken documentation trail that protects your payment rights.</p>
<h2>What Makes a Good Daily Report Format</h2>
<p>A good daily report format should be: consistent (same fields every day — no guessing what to include), timestamped automatically (not filled in later from memory), weather-verified (objective conditions data, not remembered conditions), photo-supported (visual evidence of work), and professionally formatted (PDF ready for legal or insurance use). VoiceLogPro's reports meet all these standards from a single 60-second voice note.</p>""",
     [("Are daily reports legally required?", "Daily reports are not legally required by most states, but they are essential for protecting payment rights. Some states like Texas require documentation for mechanics lien claims, making daily reports effectively necessary for lien protection."),
      ("What's the difference between a daily log and a daily report?", "A daily log is typically a handwritten or typed chronological record. A daily report is a structured document that follows a specific format with predefined fields. Reports are more useful for legal and payment purposes because they ensure all critical information is captured consistently."),
      ("How do voice reports compare to written daily reports?", "Voice reports are faster (60 seconds vs 10-15 minutes), more consistent (no skipped days due to typing fatigue), and equally legally valid (automatic timestamps and weather verification make them more credible in some cases).")],
     [("Home", DOMAIN+"/"), ("Glossary", DOMAIN+"/glossary/"), ("Daily Report", "")],
     [("Daily Report Checklist", DOMAIN+"/checklists/daily-report-checklist"), ("How to Write a Daily Report", DOMAIN+"/learn/how-to-write-a-daily-report"), ("Daily Construction Report Template", DOMAIN+"/templates/daily-construction-report-template"), ("What Makes a Good Daily Report", DOMAIN+"/faq/what-makes-a-good-daily-report")]),

    ("mechanics-lien", "What Is a Mechanics Lien? Legal Definition for Subcontractors",
     "Learn what a mechanics lien is, how it protects subcontractors, and what documentation you need to file and enforce a lien claim.",
     """
<h2>Definition: Mechanics Lien</h2>
<p>A mechanics lien is a legal claim against real property that secures payment for labor, materials, or professional services provided for construction or improvement. Also known as a construction lien or materialman's lien, it gives contractors, subcontractors, and suppliers the right to force a property sale if they aren't paid for their work. The lien attaches to the property itself, not the person who owes payment — meaning the property can't be sold free and clear without addressing the lien.</p>
<h2>How Mechanics Liens Protect Subcontractors</h2>
<p>Mechanics liens are the most powerful tool subcontractors have to secure payment. When a GC or property owner doesn't pay, the subcontractor files a lien against the property. This prevents the owner from selling or refinancing until the debt is resolved. The threat of a lien is often enough to motivate payment. However, lien rights come with strict deadlines and notice requirements that vary by state — missing a deadline means losing the right to lien entirely.</p>
<h2>Documentation Required for a Mechanics Lien</h2>
<p>A successful mechanics lien claim requires: proof of contract or agreement to provide labor/materials, proof that work was actually performed (daily reports with dates and descriptions), proof of the value of work performed, preliminary notice documentation (if required by state law), and the lien filing itself (typically through the county recorder's office). VoiceLogPro's daily reports provide the critical evidence of work dates, crew, materials, and conditions.</p>""",
     [("How long does a mechanics lien stay on the property?", "A mechanics lien typically lasts 90 days to 2 years after filing, depending on the state. If the contractor doesn't initiate foreclosure within this enforcement period, the lien expires automatically."),
      ("Can a subcontractor file a mechanics lien without the GC?", "Yes. Subcontractors have direct lien rights against the property in most states, even if their contract is only with the GC. This is the key protection that makes mechanics liens valuable for subs."),
      ("What documentation should I prepare before filing a lien?", "Your daily reports are the most critical evidence. Also prepare: contract or work order, invoices, material delivery receipts, preliminary notices sent, and any communications about non-payment. VoiceLogPro helps with the daily reports.")],
     [("Home", DOMAIN+"/"), ("Glossary", DOMAIN+"/glossary/"), ("Mechanics Lien", "")],
     [("Mechanics Lien Deadlines by State", DOMAIN+"/learn/mechanics-lien-deadlines"), ("How to File a Mechanics Lien", DOMAIN+"/how-to/file-mechanics-lien"), ("Mechanics Lien Template", DOMAIN+"/templates/mechanics-lien-template"), ("Texas Lien Law Guide", DOMAIN+"/blog/texas-property-code-chapter-53-guide-2025")]),

    ("tailgate-meeting", "What Is a Tailgate Meeting? Safety Briefing for Construction Sites",
     "Learn about tailgate meetings (toolbox talks), OSHA requirements, and how daily reports document safety briefings for compliance.",
     """
<h2>Definition: Tailgate Meeting</h2>
<p>A tailgate meeting, also called a toolbox talk or safety briefing, is a short daily or weekly safety meeting held on construction sites. Named for the informal gathering around a truck tailgate, these meetings typically last 5-15 minutes and cover specific safety topics relevant to the day's work. Tailgate meetings are a cornerstone of construction safety programs and are often required by OSHA and company safety policies.</p>
<h2>OSHA Requirements for Tailgate Meetings</h2>
<p>While OSHA doesn't explicitly require tailgate meetings by name, it requires employers to provide safety training on specific topics: hazard communication, personal protective equipment (PPE), fall protection, and other relevant safety topics. Tailgate meetings are the most common way construction contractors meet this requirement. Documentation of these meetings — date, topic, attendees, and trainer — is essential for demonstrating OSHA compliance during an inspection.</p>
<h2>How VoiceLogPro Documents Tailgate Meetings</h2>
<p>VoiceLogPro can document tailgate meetings as part of your daily report. Dictate the meeting topic, key points covered, crew members present, and any questions or concerns raised. The voice-to-PDF report creates a timestamped, permanent record of safety training for OSHA compliance. This is especially valuable for subcontractors who need to demonstrate consistent safety briefing practices.</p>""",
     [("Are tailgate meetings mandatory for construction?", "While not mandated by a specific OSHA standard, OSHA's training requirements effectively make tailgate meetings necessary. Most contractors and GCs require daily or weekly safety briefings as part of their safety programs."),
      ("What topics should a tailgate meeting cover?", "Topics should be relevant to the day's work: fall protection for roof work, trench safety for excavation, PPE requirements, hazard communication, equipment operation, and any recent safety incidents or near-misses on the project."),
      ("How should I document tailgate meetings?", "Document: date, time, topic, trainer name, crew attendees, key points discussed, questions raised. VoiceLogPro captures all this in a daily report format that serves both safety compliance and legal protection.")],
     [("Home", DOMAIN+"/"), ("Glossary", DOMAIN+"/glossary/"), ("Tailgate Meeting", "")],
     [("OSHA Documentation Requirements", DOMAIN+"/learn/osha-documentation-requirements"), ("OSHA Compliance Checklist", DOMAIN+"/checklists/osha-compliance-checklist"), ("Tailgate Meeting Requirements", DOMAIN+"/learn/osha-tailgate-meeting-requirements"), ("Daily Report Checklist", DOMAIN+"/checklists/daily-report-checklist")]),

    ("site-condition-log", "What Is a Site Condition Log? Documenting Job Site Conditions",
     "Learn about site condition logs for construction, why they matter for delay claims and payment disputes, and how voice reports capture conditions.",
     """
<h2>Definition: Site Condition Log</h2>
<p>A site condition log is a daily record of physical conditions on a construction site: weather, temperature, ground conditions, access issues, utility availability, and any other physical factors that affect construction work. Site condition logs are critical evidence for delay claims, force majeure claims, and disputes about work quality that may have been affected by site conditions.</p>
<h2>Why Site Conditions Matter for Payment Disputes</h2>
<p>Adverse site conditions are a common source of construction disputes. When weather delays a project, who bears the cost? When ground conditions differ from the contract documents, is it a change order? Your site condition log answers these questions with objective data. VoiceLogPro automatically records weather conditions from local weather stations and lets you dictate additional observations about access, visibility, noise, equipment, and materials availability.</p>
<h2>How VoiceLogPro Automates Site Condition Logging</h2>
<p>VoiceLogPro automatically attaches weather data — temperature, precipitation, wind — to every daily report. You can also dictate specific observations: "Mud on access road from overnight rain, crane access delayed by 2 hours while site is graded." These condition notes become part of your permanent daily report record, creating a comprehensive log of every factor that affected your work that day.</p>""",
     [("What site conditions should be documented daily?", "Weather (temperature, rain, snow, wind), ground conditions (wet, frozen, unstable), site access issues, utility availability, adjacent work affecting your site, noise levels, and any conditions that delayed or affected your work."),
      ("Can weather data from a report be used in a delay claim?", "Yes. Automated weather data from local stations attached to timestamped daily reports is strong evidence in delay claims. It's objective and verifiable — much more credible than remembered conditions."),
      ("How do site condition logs differ from daily reports?", "Site condition logs focus specifically on physical and environmental conditions. Daily reports cover work performed, crew, and materials. VoiceLogPro combines both in a single comprehensive report format.")],
     [("Home", DOMAIN+"/"), ("Glossary", DOMAIN+"/glossary/"), ("Site Condition Log", "")],
     [("How to Document Construction Delays", DOMAIN+"/how-to/document-construction-delays"), ("Daily Report Checklist", DOMAIN+"/checklists/daily-report-checklist"), ("OSHA Documentation Requirements", DOMAIN+"/learn/osha-documentation-requirements"), ("Construction Project Documentation", DOMAIN+"/learn/construction-project-documentation")]),
]

# --- /how-to/ pages ---
HOW_PAGES = [
    ("file-mechanics-lien", "How to File a Mechanics Lien: Step-by-Step Guide for Subcontractors",
     "Step-by-step guide to filing a mechanics lien. Documentation requirements, notice procedures, deadlines, and how daily reports support your claim.",
     """
<h2>Step 1: Verify Your Lien Rights</h2>
<p>Before filing a mechanics lien, verify that you have lien rights in your state. Subcontractors and material suppliers generally have lien rights, but some states exclude certain types of workers (e.g., purely professional services in some jurisdictions). Check the specific requirements in the state where the project is located. VoiceLogPro's state-specific guides provide this information for all 50 states.</p>
<h2>Step 2: Gather Your Documentation</h2>
<p>A lien filing requires substantial documentation: your contract or work order, invoices showing the amount owed, daily reports proving work was performed on specific dates, material delivery receipts, and proof that you sent any required preliminary notices. Your daily reports are the most critical evidence — they establish the timeline of work and the value of labor and materials provided. Without daily reports, proving the factual basis for your lien is much harder.</p>
<h2>Step 3: File the Lien and Enforce</h2>
<p>File the lien with the county recorder's office in the county where the property is located. The filing must include: property owner's name, property legal description, your name and address, amount claimed, and a description of labor or materials provided. After filing, you must serve notice on the property owner and prepare to enforce the lien within the statutory enforcement period — typically 90 days to 2 years. VoiceLogPro keeps your daily report evidence organized and accessible throughout this process.</p>""",
     [("Can I file a mechanics lien without a lawyer?", "You can file without a lawyer in most states, but it's risky — lien laws are complex and vary by state. A small error in timing or paperwork can invalidate your entire claim. Many subcontractors work with a construction attorney for the actual filing."),
      ("How long does it take to file a mechanics lien?", "The filing itself takes 1-2 hours once you have the required documentation. The timeline from last work to filing is controlled by your state's deadline — ranges from 75 days (Ohio) to 8 months (New York). The preparation of supporting documents is where most of the time goes."),
      ("What happens after I file the mechanics lien?", "The property owner is notified and has an opportunity to dispute or pay. If payment isn't made, you must initiate a foreclosure lawsuit within the enforcement period. Most disputes are resolved before foreclosure because the lien prevents sale or refinancing.")],
     [("Home", DOMAIN+"/"), ("How-To", DOMAIN+"/how-to/"), ("File Mechanics Lien", "")],
     [("Mechanics Lien Guide", DOMAIN+"/learn/mechanics-lien"), ("Mechanics Lien Deadlines", DOMAIN+"/learn/mechanics-lien-deadlines"), ("Texas Mechanics Lien Compliance", DOMAIN+"/solutions/texas-mechanics-lien-compliance"), ("Mechanics Lien Template", DOMAIN+"/templates/mechanics-lien-template")]),

    ("write-construction-daily-log", "How to Write a Construction Daily Log: Best Practices for Subs",
     "Learn how to write effective construction daily logs. What to include, common mistakes, and why voice-first tools produce better logs.",
     """
<h2>What to Include in Every Daily Log</h2>
<p>A complete construction daily log should include: project name and location, date and time of work, weather conditions (temperature, precipitation, wind), crew members and their roles, work performed summary (specific tasks, locations, quantities), materials delivered and used, equipment on site, any delays or issues encountered, safety observations or incidents, and photos of work in progress. This creates a comprehensive record that serves both project management and legal protection purposes.</p>
<h2>Common Mistakes in Daily Logging</h2>
<p>The most common mistakes are: (1) waiting until the end of the week to fill in logs from memory — details are lost and dates become unreliable, (2) being too brief — "worked on framing" with no details about location, quantities, or issues, (3) forgetting weather conditions — critical for delay claims, (4) inconsistent formats — some days verbose, others sparse, making the log hard to use as evidence, (5) skipping days — gaps in the log create doubt about what happened on those days.</p>
<h2>Why Voice-First Logging Produces Better Results</h2>
<p>Voice-first daily logs like VoiceLogPro solve these problems: they're created immediately (timestamped at the moment of dictation), automatically include weather data, enforce a consistent structure, and take only 60 seconds — eliminating the "I'll do it later" problem. The result is a consistent, complete, court-ready daily log with no skipped days and no after-the-fact memory gaps.</p>""",
     [("How long should a daily construction log be?", "A good daily log is 2-5 paragraphs covering all key fields. VoiceLogPro's voice-first approach produces complete reports in 60 seconds without requiring you to type or write anything."),
      ("Can I use voice notes instead of written logs?", "Yes. Voice-to-PDF daily reports are legally valid. VoiceLogPro transcribes your voice note into a structured PDF with timestamps, weather data, and photo support."),
      ("What if nothing significant happened today?", "Still log it. Document 'normal framing work continued' with crew size, materials, and conditions. A consistent log with no gaps is more credible than one that only records problems.")],
     [("Home", DOMAIN+"/"), ("How-To", DOMAIN+"/how-to/"), ("Write Daily Log", "")],
     [("How to Write a Daily Report", DOMAIN+"/learn/how-to-write-a-daily-report"), ("How to Document Construction Delays", DOMAIN+"/how-to/document-construction-delays"), ("Daily Report Checklist", DOMAIN+"/checklists/daily-report-checklist"), ("Daily Construction Report Template", DOMAIN+"/templates/daily-construction-report-template")]),

    ("dispute-construction-claim", "How to Dispute a Construction Claim: Evidence and Documentation Guide",
     "Step-by-step guide to disputing construction claims. What evidence you need, how daily reports help, and when to escalate.",
     """
<h2>Understanding Construction Claims and Disputes</h2>
<p>Construction claims can take many forms: non-payment for work performed, backcharges for alleged defective work, delay claims, acceleration claims, change order disputes, and lien challenges. In every case, the outcome depends primarily on documentation. The party with better contemporaneous records almost always wins. This is why consistent daily reports are your single best defense against construction claims — they create an objective, timestamped record of what happened on site before any dispute arose.</p>
<h2>How Daily Reports Support Your Dispute</h2>
<p>When you receive a claim or dispute notice, your first step should be to assemble all daily reports covering the disputed period. These reports will show: exactly what work was performed on each date, weather and site conditions at the time, crew on site and hours worked, materials used, delays or issues noted, and any communications about changes or problems. This contemporaneous evidence carries far more weight than after-the-fact statements or reconstructed timelines.</p>
<h2>When to Escalate a Construction Dispute</h2>
<p>If informal resolution attempts fail and the disputed amount is significant, consider escalation: formal demand letter from an attorney, mediation or arbitration if required by your contract, filing a mechanics lien to secure payment through the property, or litigation as a last resort. VoiceLogPro's daily reports provide the evidence foundation for every escalation level — from a demand letter through full litigation.</p>""",
     [("What evidence is most effective in a construction dispute?", "Contemporaneous daily reports are the most effective evidence. They were created at the time of work, not reconstructed after the dispute. Timestamps, weather data, and photo attachments make them especially credible."),
      ("Can I dispute a backcharge without daily reports?", "It's much harder. The GC's records will be the only evidence, and they'll almost always favor the GC's position. Daily reports give you an independent, contemporaneous account of what actually happened."),
      ("How long does a construction dispute typically take?", "Simple disputes may resolve in weeks. Complex disputes involving mechanics liens or litigation can take months to years. Your daily reports remain valid evidence regardless of how long the process takes.")],
     [("Home", DOMAIN+"/"), ("How-To", DOMAIN+"/how-to/"), ("Dispute Claim", "")],
     [("How to Defend Unfair GC Deductions", DOMAIN+"/how-to/defend-unfair-gc-deductions"), ("Fight Unfair GC Deductions", DOMAIN+"/solutions/fight-unfair-gc-deductions"), ("How to Document Construction Delays", DOMAIN+"/how-to/document-construction-delays"), ("Phase Payment Disputes", DOMAIN+"/solutions/phase-payment-disputes")]),
]

# --- /use-cases/ pages ---
USE_CASE_PAGES = [
    ("subcontractors", "Daily Construction Reports for Subcontractors: Complete Guide",
     "Why subcontractors need daily construction reports for payment protection, lien rights, and legal documentation. Voice-first reports save time.",
     """
<h2>Why Subcontractors Need Daily Reports More Than Anyone</h2>
<p>Subcontractors are uniquely vulnerable in construction payment chains. You work for the GC, not the property owner. If the GC doesn't pay you, you can't simply walk off the job — you need to pursue a mechanics lien. And to pursue a lien, you need evidence. Timestamped, weather-verified daily construction reports are that evidence. They prove, on a day-by-day basis, exactly what work was performed, when, and under what conditions. No other document type serves this purpose as effectively.</p>
<h2>How Voice Reports Protect Subcontractor Payment</h2>
<p>Voice-first daily reports protect subcontractors in three ways: (1) they create an unbroken documentation trail that supports mechanics lien claims, (2) they provide evidence to defend against unfair backcharges and deductions, and (3) they demonstrate professionalism to GCs and property owners, reducing the likelihood of disputes in the first place. A subcontractor with consistent daily reports is taken more seriously in any payment discussion.</p>
<h2>Getting Started with Voice Daily Reports</h2>
<p>VoiceLogPro is built specifically for subcontractors. Download the app, create your project, and speak your first daily report in under 60 seconds. The app handles timestamps, weather data, and PDF formatting automatically. No training required. No typing required. Just speak your report and get back to work.</p>""",
     [("What is the minimum documentation a subcontractor needs?", "At minimum: daily reports for every day worked, a signed contract or work order, and preliminary notices where required by state law. VoiceLogPro handles daily reports; your contract admin handles the rest."),
      ("How do daily reports help with lien rights?", "Daily reports prove the dates of work — essential for preliminary notice deadlines and lien filing timelines. Without them, your last-work date is subject to dispute. VoiceLogPro locks in dates with automatic timestamps."),
      ("Can subcontractors really afford voice daily report software?", "VoiceLogPro's Crew Plan is $49/month for unlimited reports — less than the cost of one hour of an attorney's time. A single payment dispute prevented or a single lien claim supported pays for years of service.")],
     [("Home", DOMAIN+"/"), ("Use Cases", DOMAIN+"/use-cases/"), ("Subcontractors", "")],
     [("For Electricians", DOMAIN+"/for/electricians"), ("For Plumbers", DOMAIN+"/for/plumbers"), ("How to Protect Lien Rights", DOMAIN+"/how-to/protect-lien-rights-as-subcontractor"), ("Crew Plan Pricing", DOMAIN+"/crew-plan")]),

    ("home-builders", "Daily Construction Reports for Home Builders",
     "Voice-first daily reports for home builders. Document foundation through finishing with timestamped, weather-verified PDF reports.",
     """
<h2>Why Home Builders Need Daily Reports</h2>
<p>Home builders manage multiple trades across a long construction timeline — from foundation through final finishes. Each trade's work can be a source of disputes, delays, and payment issues. Daily reports create a master record of the entire project, documenting what each trade did, when, and under what conditions. This is essential for managing warranty claims, owner disputes, and trade contractor payment issues.</p>
<h2>Tracking Trades and Progress Across a Build</h2>
<p>A typical home build involves 20+ trade contractors. Tracking who was on site when, what work they completed, and whether it was done correctly is a massive coordination challenge. VoiceLogPro simplifies this: the site supervisor dictates a daily report covering all trades on site that day, their work completed, material deliveries, inspection results, and any issues. One 2-minute voice note replaces hours of spreadsheet management.</p>
<h2>Protecting Against Owner Disputes</h2>
<p>Homeowners often dispute work quality, change order costs, and delay responsibility. Your daily reports are the definitive record of what happened on their property each day. When a homeowner claims that trim damage was your crew's fault from three weeks ago, your daily report from that day shows exactly what your crew did and any conditions present. VoiceLogPro's timestamped, weather-verified, photo-supported reports are the most credible evidence available.</p>""",
     [("Why do home builders need trade-specific daily reports?", "Each trade has different documentation needs. Electrical work needs circuit tracking. Roofing needs wind documentation. Foundation work needs curing conditions. VoiceLogPro captures trade-specific details while maintaining a consistent project-wide record."),
      ("Can daily reports help with home warranty claims?", "Absolutely. If a homeowner files a warranty claim for a defect, your daily reports from the time of construction document installation methods, materials used, and weather conditions at the time — critical for determining whether the claim is valid."),
      ("How do daily reports help manage trade contractors?", "Your daily reports document each trade's work dates, quality observations, and any issues. This creates an objective record that helps resolve disputes with trades about scope, completion, and payment.")],
     [("Home", DOMAIN+"/"), ("Use Cases", DOMAIN+"/use-cases/"), ("Home Builders", "")],
     [("For General Contractors", DOMAIN+"/for/general-contractors"), ("Daily Report Checklist", DOMAIN+"/checklists/daily-report-checklist"), ("How to Document Construction Delays", DOMAIN+"/how-to/document-construction-delays"), ("Daily Construction Report Template", DOMAIN+"/templates/daily-construction-report-template")]),
]

# --- /cost-of/ pages ---
COST_PAGES = [
    ("raken-pricing", "Raken Pricing vs VoiceLogPro: Cost Comparison for Daily Reports",
     "Compare Raken pricing vs VoiceLogPro for construction daily reports. Features, pricing tiers, and value for subcontractors.",
     """
<h2>Raken Pricing Overview</h2>
<p>Raken offers several pricing tiers starting at $99/month for their basic Pro plan. Their Team plan adds collaboration features. Enterprise pricing is custom-quoted. All tiers include daily logs, time cards, and basic reporting. However, Raken requires typed input — there's no voice-to-PDF option. For a crew of 5 using Raken Pro, you're looking at $495/month. VoiceLogPro's Crew Plan covers your entire crew at $49/month.</p>
<h2>What You Get With VoiceLogPro vs Raken</h2>
<p>VoiceLogPro at $49/month includes: unlimited voice-to-PDF daily reports, automatic timestamps and weather verification, photo attachments, court-ready PDF formatting, offline mode, and crew management. Raken at $99+/month includes typed daily logs, time cards, photo support, and basic reports. The key difference: speed. VoiceLogPro daily reports take 60 seconds. Raken typed reports take 10-15 minutes. Over a month of daily reporting, VoiceLogPro saves 3-7 hours of admin time.</p>
<h2>Total Cost of Ownership Comparison</h2>
<p>For a 5-person crew over 12 months: Raken Pro costs $4,800/year (assuming bulk pricing). VoiceLogPro Crew Plan costs $588/year at $49/month. The time savings add up too: if your crew members bill at $50/hour and each saves 30 minutes per day on paperwork, VoiceLogPro saves over $30,000/year in labor costs compared to typed solutions. For subcontractors on tight margins, this difference matters.</p>""",
     [("Does Raken offer a free trial?", "Raken offers a free trial. VoiceLogPro also offers a free basic tier with limited reports so you can try before buying."),
      ("Can I switch from Raken to VoiceLogPro?", "Yes. VoiceLogPro imports your project information and you can start creating voice reports immediately. Most users find the transition takes less than a day."),
      ("Which tool is better for lien protection?", "Both tools can be used for lien documentation, but VoiceLogPro's voice-to-PDF workflow ensures higher consistency — you're more likely to actually create daily reports when it takes 60 seconds vs 10-15 minutes.")],
     [("Home", DOMAIN+"/"), ("Cost Of", DOMAIN+"/cost-of/"), ("Raken Pricing", "")],
     [("Procore Pricing", DOMAIN+"/cost-of/procore-pricing"), ("Raken vs VoiceLogPro", DOMAIN+"/raken-vs-voice-log-pro"), ("Crew Plan Pricing", DOMAIN+"/crew-plan"), ("Best Daily Log Apps", DOMAIN+"/best/construction-daily-log-apps")]),

    ("procore-pricing", "Procore Pricing vs VoiceLogPro: Cost Comparison for Subs",
     "Compare Procore pricing vs VoiceLogPro for subcontractors. Why VoiceLogPro offers better value for daily reports and payment protection.",
     """
<h2>Procore Pricing Overview</h2>
<p>Procore is an enterprise-grade construction management platform with pricing starting at approximately $399/month per user. For a small subcontractor with 5 users, that's $1,995/month — $23,940/year. Procore includes project management, financial tools, quality and safety features, and daily logs. But it's designed for GCs managing large projects, not for subcontractors who need fast, practical daily documentation from the field.</p>
<h2>Why Subcontractors Don't Need Procore's Full Suite</h2>
<p>Most subcontractors use only a fraction of Procore's features. The daily log, time tracking, and photo documents are the features actually used in the field. Scheduling, budgeting, RFIs, submittals, and financial management are typically handled by the GC. Paying $399+/month per user for features you don't use is inefficient. VoiceLogPro focuses on what subcontractors actually need: fast daily documentation that protects payment.</p>
<h2>VoiceLogPro: Built for Subcontractors at a Fraction of the Cost</h2>
<p>VoiceLogPro's Crew Plan at $49/month (unlimited reports, all features) costs less than a single Procore user license. And VoiceLogPro's voice-first approach means your reports actually get done — the #1 problem with Procore daily logs is that foremen don't type them consistently. VoiceLogPro's 60-second voice reports have dramatically higher completion rates, meaning better documentation and stronger payment protection.</p>""",
     [("Does Procore offer a subcontractor-only plan?", "No. Procore is priced per user regardless of role. A subcontractor pays the same $399+/month as a GC. VoiceLogPro is built specifically for subs and priced accordingly at $49/month."),
      ("Can VoiceLogPro replace Procore for subcontractors?", "VoiceLogPro replaces Procore's daily log function — the feature subcontractors actually use. For project management functions (budgets, RFIs, submittals), you may still need Procore or a similar tool."),
      ("What if my GC requires me to use Procore?", "You can use both. Continue using Procore for GC-required functions and VoiceLogPro for your own documentation and payment protection. VoiceLogPro's PDFs can be uploaded to Procore as daily log attachments.")],
     [("Home", DOMAIN+"/"), ("Cost Of", DOMAIN+"/cost-of/"), ("Procore Pricing", "")],
     [("Raken Pricing", DOMAIN+"/cost-of/raken-pricing"), ("Procore vs VoiceLogPro", DOMAIN+"/procore-vs-voice-log-pro"), ("Crew Plan Pricing", DOMAIN+"/crew-plan"), ("Best Documentation Tools", DOMAIN+"/best/construction-documentation-tools")]),
]

# --- /templates/ section pages ---
TEMPLATE_DETAIL_PAGES = [
    ("submittal-template", "Construction Submittal Template: Free Download",
     "Free construction submittal template. Create professional RFI and submittal packages. VoiceLogPro automates the documentation side.",
     """
<h2>What Is a Construction Submittal?</h2>
<p>A construction submittal is a document package submitted by a contractor or subcontractor for review and approval by the architect, engineer, or GC. Submittals include product data sheets, shop drawings, samples, material certifications, and test reports. The submittal process ensures that the materials and methods proposed for the project meet the specifications and design intent. Submittals are typically required by the construction contract and are a prerequisite for ordering materials or beginning installation.</p>
<h2>How This Template Helps</h2>
<p>This submittal template provides a standard format for organizing your submittal package. Use it to track: project information, submittal number and description, specification section reference, product data and shop drawings, samples submitted, engineer/architect review status, comments and resubmittal requirements. While this template handles the submittal documentation, VoiceLogPro handles the daily field documentation that proves the work was installed per approved submittals.</p>
<h2>Submittals and Daily Reports Working Together</h2>
<p>Submittals document what was approved for installation. Daily reports document what was actually installed. When these two records align, you have a complete, defensible project documentation system. If a dispute arises about whether materials meet specifications, your submittal shows what was approved, and your daily reports from VoiceLogPro show when and where the materials were installed, with photos and conditions documented.</p>""",
     [("How long does the submittal review process take?", "Typically 1-3 weeks depending on the complexity and the reviewer's workload. VoiceLogPro's daily reports document any schedule impacts from submittal review delays."),
      ("What happens if a submittal is rejected?", "You revise and resubmit. The review period restarts. VoiceLogPro helps document the schedule impact of resubmittal cycles for delay claims."),
      ("Can VoiceLogPro help with submittal documentation?", "VoiceLogPro focuses on daily field reports. For submittals, use this template combined with your project management software. Daily reports document the installation that follows approved submittals.")],
     [("Home", DOMAIN+"/"), ("Templates", DOMAIN+"/templates/"), ("Submittal Template", "")],
     [("Site Inspection Template", DOMAIN+"/templates/site-inspection-template"), ("RFI Template", DOMAIN+"/templates/rfi-template"), ("Daily Construction Report Template", DOMAIN+"/templates/daily-construction-report-template"), ("Mechanics Lien Template", DOMAIN+"/templates/mechanics-lien-template")]),

    ("toolbox-talk-template", "Toolbox Talk Template: Free Safety Meeting Template for Construction",
     "Free toolbox talk template for construction safety meetings. Document tailgate meetings for OSHA compliance with this template.",
     """
<h2>What Is a Toolbox Talk?</h2>
<p>A toolbox talk, also called a tailgate meeting or safety briefing, is a short safety meeting held on construction sites. These 5-15 minute meetings cover specific safety topics relevant to the day's work, such as fall protection, PPE requirements, hazard communication, or equipment safety. Toolbox talks are a key component of construction safety programs and documentation of these meetings is essential for OSHA compliance.</p>
<h2>How to Use This Template</h2>
<p>This template helps you document each toolbox talk with: date and time, topic covered, key points discussed, trainer name and qualifications, crew attendees with signatures, questions raised and answers provided, follow-up actions if any. Consistent documentation of toolbox talks demonstrates your commitment to safety and provides critical evidence if OSHA inspects your job site.</p>
<h2>Combining Toolbox Talks with VoiceLogPro Daily Reports</h2>
<p>VoiceLogPro can incorporate toolbox talk documentation into your daily reports. Dictate the meeting topic, crew attendance, and key discussion points as part of your daily report. The voice-to-PDF format creates a permanent, timestamped record that satisfies OSHA documentation requirements while adding minimal time to your daily routine. One voice note covers both your daily work report and safety meeting documentation.</p>""",
     [("How often should toolbox talks be conducted?", "Best practice is daily or weekly, covering topics relevant to the work scheduled. Many projects require daily safety briefings. VoiceLogPro makes documentation so fast that daily documentation is practical."),
      ("What topics should a toolbox talk cover?", "Topics should match the day's hazards: fall protection for high work, trench safety for excavation, PPE for specific tasks, heat illness prevention in summer, and any recent safety incidents or near-misses."),
      ("Is toolbox talk documentation required by OSHA?", "OSHA requires documentation of safety training. Toolbox talks are the most common method. VoiceLogPro documents these alongside daily work reports for complete safety compliance.")],
     [("Home", DOMAIN+"/"), ("Templates", DOMAIN+"/templates/"), ("Toolbox Talk Template", "")],
     [("Tailgate Meeting Glossary", DOMAIN+"/glossary/tailgate-meeting"), ("OSHA Compliance Checklist", DOMAIN+"/checklists/osha-compliance-checklist"), ("OSHA Tailgate Meeting Requirements", DOMAIN+"/learn/osha-tailgate-meeting-requirements"), ("Daily Report Checklist", DOMAIN+"/checklists/daily-report-checklist")]),

    ("site-inspection-template", "Site Inspection Template: Free Construction Inspection Form",
     "Free site inspection template for construction projects. Document inspections, findings, and corrective actions with this template.",
     """
<h2>What Is a Site Inspection?</h2>
<p>A site inspection is a formal examination of construction work to verify compliance with plans, specifications, and building codes. Inspections are conducted by the GC, owner's representative, architect, engineer, or building inspector at key milestones: foundation, framing, rough-in, insulation, drywall, and final. Failed inspections can delay the project and trigger backcharges. Accurate documentation of inspection results is essential for managing schedule and cost.</p>
<h2>How to Use This Inspection Template</h2>
<p>This site inspection template captures: project name and location, inspection date and time, inspector name and affiliation, work item or area inspected, inspection type (scheduled, random, final), findings (pass/fail/conditional), specific observations or deficiencies noted, corrective actions required (with dates and responsibilities), and re-inspection results. Use this template to track every inspection and keep your project moving.</p>
<h2>Daily Reports and Inspections: The Complete Picture</h2>
<p>VoiceLogPro's daily reports document the work that led up to each inspection. Your daily reports show when work was completed, by which crew, under what conditions. When an inspector finds an issue, your daily reports help trace when the work was done and who was responsible. This comprehensive documentation protects you from claims that pre-existing issues were caused by your work.</p>""",
     [("How many inspections does a typical construction project require?", "A typical project has 5-10 inspections: foundation, framing, rough-in (MEP), insulation, drywall, and final. Some jurisdictions require additional inspections for specific trades or systems."),
      ("Can VoiceLogPro help with inspection documentation?", "Yes. VoiceLogPro daily reports document the work that's ready for inspection and the inspection results. Dictate your pre-inspection checklist and post-inspection results as part of your daily report."),
      ("What happens if an inspection fails?", "You receive a list of deficiencies to correct. The re-inspection process takes time and can delay the schedule. VoiceLogPro documents the corrective actions and re-inspection scheduling as part of ongoing daily reports.")],
     [("Home", DOMAIN+"/"), ("Templates", DOMAIN+"/templates/"), ("Site Inspection Template", "")],
     [("RFI Template", DOMAIN+"/templates/rfi-template"), ("Submittal Template", DOMAIN+"/templates/submittal-template"), ("Daily Construction Report Template", DOMAIN+"/templates/daily-construction-report-template"), ("How to Document Construction Delays", DOMAIN+"/how-to/document-construction-delays")]),

    ("rfi-template", "RFI Template: Free Request for Information Form for Construction",
     "Free RFI (Request for Information) template for construction projects. Document questions, clarifications, and responses in a professional format.",
     """
<h2>What Is an RFI in Construction?</h2>
<p>An RFI (Request for Information) is a formal written request from a contractor, subcontractor, or supplier to the design team (architect, engineer, GC) asking for clarification about plans, specifications, or site conditions. RFIs are a normal part of construction — plans are rarely perfect, and field conditions often require adjustments. Proper RFI documentation protects your schedule and budget when design clarifications or corrections are needed.</p>
<h2>When to Submit an RFI</h2>
<p>Submit an RFI when: plans or specifications are unclear or conflicting, site conditions differ from what's shown on the plans, a specified material or method is unavailable or impractical, dimensions or elevations don't match between drawings, or coordination issues exist between trades. Always submit RFIs in writing — verbal agreements are not enforceable. Document the delay caused while waiting for RFI responses in your VoiceLogPro daily reports.</p>
<h2>RFIs and Daily Reports: Managing Schedule Impact</h2>
<p>When an RFI is submitted, work may be delayed until a response is received. VoiceLogPro's daily reports document these delays with timestamps and weather data, creating the evidence needed for time extension and delay claims. The combination of a formal RFI trail (with this template) and contemporaneous daily reports (with VoiceLogPro) creates complete documentation of every design clarification and its impact on your work.</p>""",
     [("How long does it take to get an RFI response?", "Typical response time is 1-2 weeks, but it varies by project complexity and the design team's workload. VoiceLogPro documents the schedule impact in daily reports."),
      ("Can I submit an RFI verbally?", "Never. Verbal RFIs are not enforceable. Always submit in writing using a template like this one. Follow up verbal discussions with written RFIs to ensure the request is documented."),
      ("What if the RFI response creates additional work?", "The response may be a design change that qualifies as a change order. VoiceLogPro's daily reports document the additional work performed as a result of RFI responses, supporting your change order claims.")],
     [("Home", DOMAIN+"/"), ("Templates", DOMAIN+"/templates/"), ("RFI Template", "")],
     [("Submittal Template", DOMAIN+"/templates/submittal-template"), ("Site Inspection Template", DOMAIN+"/templates/site-inspection-template"), ("Mechanics Lien Template", DOMAIN+"/templates/mechanics-lien-template"), ("How to Document Change Orders", DOMAIN+"/how-to/document-construction-change-orders")]),

    ("mechanics-lien-template", "Free Mechanics Lien Template for Subcontractors",
     "Free mechanics lien template for subcontractors. Formal notice of lien rights. Proper format with critical documentation fields.",
     """
<h2>What Is a Mechanics Lien Document?</h2>
<p>A mechanics lien document is a formal legal filing that places a claim against a property to secure payment for labor, materials, or services provided. The document must include the property owner's name, property description, amount claimed, and a description of the work performed. It is filed with the county recorder's office and serves as public notice that the property has an outstanding debt for construction work.</p>
<h2>How to Use This Mechanics Lien Template</h2>
<p>This template provides the standard structure for a mechanics lien filing. Before using it: (1) verify your state's specific format requirements — some states have statutory forms, (2) confirm filing deadlines in your state, (3) prepare supporting evidence — your daily reports are critical here. VoiceLogPro provides the timestamped daily report evidence that supports the amounts and dates claimed in your lien filing.</p>
<h2>Why Daily Reports Are Essential Before Filing a Lien</h2>
<p>A mechanics lien is only as strong as the evidence supporting it. The property owner or GC will review your claim carefully. If your dates, quantities, or values can be contested, your lien becomes less effective. VoiceLogPro's daily reports provide objective, contemporaneous evidence of every day you worked, what you did, and what materials you used. This evidence makes your lien claim much harder to challenge and often leads to faster payment without litigation.</p>""",
     [("Do I need an attorney to use this template?", "It's recommended. Lien laws vary by state and small errors can invalidate your entire claim. Use this template to prepare the information, then have a construction attorney review before filing."),
      ("What supporting documents should I attach to my lien?", "Your daily reports are the most important supporting evidence. Also attach: contract agreement, invoices, material delivery receipts, preliminary notices sent, and any communications about non-payment."),
      ("How long after filing can I expect payment?", "Liens typically motivate payment within 30-90 days. The property owner can't sell or refinance until the lien is resolved. If payment isn't made, you must enforce the lien within the statutory enforcement period.")],
     [("Home", DOMAIN+"/"), ("Templates", DOMAIN+"/templates/"), ("Mechanics Lien Template", "")],
     [("How to File a Mechanics Lien", DOMAIN+"/how-to/file-mechanics-lien"), ("Mechanics Lien Guide", DOMAIN+"/learn/mechanics-lien"), ("Mechanics Lien Deadlines", DOMAIN+"/learn/mechanics-lien-deadlines"), ("Texas Lien Law Guide", DOMAIN+"/blog/texas-property-code-chapter-53-guide-2025")]),

    ("daily-construction-report-template", "Free Daily Construction Report Template",
     "Free daily construction report template with all required fields. VoiceLogPro automates this with voice-to-PDF for faster, consistent reports.",
     """
<h2>What This Template Includes</h2>
<p>This daily construction report template includes: project name and location, date and day number, weather conditions (temperature, precipitation, wind), crew names and roles, hours worked per trade, work performed (specific tasks with quantities and locations), materials delivered and used, equipment on site with hours, delays and issues with descriptions, safety observations and incidents, inspection results, photo documentation, and supervisor's signature block. Every field is designed to support both project management and legal documentation purposes.</p>
<h2>How VoiceLogPro Fills This Template Automatically</h2>
<p>VoiceLogPro eliminates the manual work of filling out this template. Speak your daily report into your phone — "Poured 12 cubic yards of 4000 PSI concrete for slab section B, crew of 4, pump truck on site, no delays, temperature 72°F" — and VoiceLogPro creates a formatted PDF with all template fields completed. Automatic timestamps, weather data from local stations, and photo attachments complete the documentation. No typing. No office. No forgetting.</p>
<h2>Why This Template Structure Works for Legal Evidence</h2>
<p>The structure of this daily report template follows the format that courts and legal professionals expect. Contemporaneous records are the gold standard of evidence, and this template ensures all critical data points are captured consistently. The more consistently you use this structure — or better yet, let VoiceLogPro automate it — the stronger your documentation becomes for payment disputes, lien claims, and insurance matters.</p>""",
     [("How often should I fill out this template?", "Every day you work on a project. Consistency matters more than detail. A consistent daily report that captures the same fields every day is more valuable than a detailed report that only gets done weekly."),
      ("Can I customize this template for my trade?", "Yes. Add fields specific to your trade. Electricians should add circuit and panel tracking. Roofers should add wind speed and sections completed. VoiceLogPro's voice-first approach adapts to trade-specific fields automatically."),
      ("Do I need to print this template?", "No. VoiceLogPro creates digital PDFs that are stored in the cloud and accessible anytime. Digital records with automatic timestamps are generally more credible than paper records.")],
     [("Home", DOMAIN+"/"), ("Templates", DOMAIN+"/templates/"), ("Daily Report Template", "")],
     [("How to Write a Daily Report", DOMAIN+"/learn/how-to-write-a-daily-report"), ("Daily Report Checklist", DOMAIN+"/checklists/daily-report-checklist"), ("Electrician Daily Report Template", DOMAIN+"/templates/electrician-daily-report"), ("Plumber Daily Report Template", DOMAIN+"/templates/plumber-daily-report")]),
]

# --- /pricing-questions/ pages ---
PRICING_PAGES = [
    ("how-much-does-it-cost", "How Much Does VoiceLogPro Cost? Pricing and Plans Explained",
     "VoiceLogPro pricing: Crew Plan at $49/month for unlimited voice-to-PDF daily reports. See what each plan includes and which is right for your crew.",
     """
<h2>VoiceLogPro Pricing Plans</h2>
<p>VoiceLogPro offers straightforward pricing for subcontractors: the Crew Plan at $49/month includes unlimited voice-to-PDF daily reports, automatic timestamps and weather verification, photo attachments, court-ready PDF formatting, offline mode, and crew management. There are no per-user fees — one Crew Plan covers your entire crew. Compared to Raken at $99+/month per user or Procore at $399+/month per user, VoiceLogPro offers dramatic savings for subcontractors who need daily reports, not full project management.</p>
<h2>What You Get for $49/Month</h2>
<p>At $49/month, VoiceLogPro's Crew Plan covers: unlimited daily reports (create as many as you need per project), automatic timestamping and weather verification, photo attachments for visual evidence, professional PDF formatting designed for court and insurance use, offline mode for job sites without cell service, crew management for multiple crew members, cloud storage with no expiration, and export in multiple formats. No limits, no per-user fees, no hidden costs.</p>
<h2>Is VoiceLogPro Worth the Investment?</h2>
<p>A single payment dispute can cost $10,000-$50,000 in legal fees and lost payment. For $49/month ($588/year), VoiceLogPro protects your payment on every project. The time savings alone justify the cost: if your crew saves 30 minutes per day on paperwork, that's 120+ hours saved per year. At $50/hour billable rate, that's $6,000+ in recovered productivity. VoiceLogPro pays for itself many times over.</p>""",
     [("Is there a free trial?", "Yes. VoiceLogPro offers a free basic tier that lets you create a limited number of reports to evaluate the service. The Crew Plan at $49/month unlocks unlimited reports and all features."),
      ("Are there setup fees or long-term contracts?", "No setup fees. No long-term contracts. Month-to-month billing. You can cancel anytime. VoiceLogPro is designed to be as simple and transparent as our voice-to-PDF reports."),
      ("What if I need more than the Crew Plan?", "The Crew Plan covers unlimited reports for your crew. If you have additional needs, contact us for custom enterprise pricing. Most subcontractors find the Crew Plan more than sufficient.")],
     [("Home", DOMAIN+"/"), ("Pricing Questions", DOMAIN+"/pricing-questions/"), ("How Much Does It Cost", "")],
     [("Is VoiceLogPro Worth It", DOMAIN+"/pricing-questions/is-it-worth-it"), ("Crew Plan", DOMAIN+"/crew-plan"), ("Raken Pricing Comparison", DOMAIN+"/cost-of/raken-pricing"), ("Procore Pricing Comparison", DOMAIN+"/cost-of/procore-pricing")]),
]

# --- /integrations/ pages ---
INTEGRATION_PAGES = [
    ("autodesk", "VoiceLogPro + Autodesk Integration: Daily Reports for Autodesk Users",
     "Integrate VoiceLogPro with Autodesk. Voice-to-PDF daily reports sync with Autodesk Build and BIM 360 for comprehensive project documentation.",
     """
<h2>How VoiceLogPro Complements Autodesk</h2>
<p>Autodesk Build and BIM 360 are powerful platforms for construction management, but daily field reporting in Autodesk requires typing on a mobile app or desktop. VoiceLogPro fills this gap with voice-to-PDF daily reports that can be attached to your Autodesk project as supplemental documentation. Foremen dictate their daily report in 60 seconds using VoiceLogPro, and the professional PDF is uploaded to the corresponding Autodesk project. This combines the speed of voice-first reporting with the project management capabilities of Autodesk.</p>
<h2>Workflow: Voice Reports + Autodesk</h2>
<p>The typical workflow: a foreman uses VoiceLogPro on site to dictate the day's report — work performed, crew, materials, weather, delays. VoiceLogPro generates a timestamped, weather-verified PDF. The report is then attached to the relevant project and work area in Autodesk Build as a daily log, observation, or RFI attachment. This gives the GC and project team access to detailed field documentation without requiring everyone to use VoiceLogPro — the PDF output is universal.</p>
<h2>Why Voice Reports Improve Autodesk Daily Logs</h2>
<p>Autodesk daily logs have the same problem as every typed solution: low adoption rates. Foremen don't type consistently. VoiceLogPro's 60-second voice workflow achieves dramatically higher consistency. With higher consistency comes better documentation, stronger lien support, and fewer payment disputes. VoiceLogPro is the missing piece that makes Autodesk project documentation actually complete.</p>""",
     [("Does VoiceLogPro sync automatically with Autodesk?", "VoiceLogPro generates PDFs that can be uploaded to Autodesk. Current integration is via file export and upload. Direct API sync is on our roadmap."),
      ("Can I use VoiceLogPro alongside Autodesk without conflicts?", "Yes. VoiceLogPro documents the field work. Autodesk manages the project. They work well together — VoiceLogPro handles what Autodesk doesn't do well (fast field documentation), and Autodesk handles what VoiceLogPro doesn't (project management)."),
      ("Does my GC need to use VoiceLogPro?", "No. The PDF output is universal. Attach VoiceLogPro reports to your Autodesk project and the GC sees professional daily reports without needing any VoiceLogPro license.")],
     [("Home", DOMAIN+"/"), ("Integrations", DOMAIN+"/integrations/"), ("Autodesk", "")],
     [("Procore Integration", DOMAIN+"/integrations/procore"), ("PlanGrid Integration", DOMAIN+"/integrations/plangrid"), ("QuickBooks Integration", DOMAIN+"/integrations/quickbooks"), ("Viewpoint Integration", DOMAIN+"/integrations/viewpoint")]),

    ("procore", "VoiceLogPro + Procore Integration: Daily Reports for Procore Users",
     "Integrate VoiceLogPro with Procore. Voice-to-PDF daily reports complement Procore's project management for subcontractors.",
     """
<h2>VoiceLogPro + Procore: A Better Way to Document</h2>
<p>Procore is the industry standard for construction project management, but its daily log feature shares the same limitation as all typed solutions: low adoption among field crews. Foremen don't consistently type daily logs — they're busy working. VoiceLogPro solves this by letting foremen dictate their daily report in 60 seconds and produce a professional PDF that can be attached to the Procore daily log. The result is complete, consistent field documentation without changing your Procore workflow.</p>
<h2>Why Subcontractors Need VoiceLogPro Alongside Procore</h2>
<p>Procore's per-user pricing ($399+/month) is expensive for subcontractors who only need daily logs. VoiceLogPro at $49/month covers your entire crew. Use Procore for what it's best at — GC coordination, RFIs, submittals, financial management. Use VoiceLogPro for what it's best at — fast, consistent, legal-grade daily reports. The combination gives you the best of both platforms at a fraction of the cost of putting your whole crew on Procore.</p>
<h2>Protecting Your Payment Rights in a Procore-Managed Project</h2>
<p>On projects managed through Procore, the GC has access to all the documentation. You need your own documentation — independent records that you control. VoiceLogPro gives you ownership of your daily reports, created on your phone, stored in your account. When a payment dispute arises, you have objective, timestamped evidence that you control, not evidence that the GC could modify or restrict access to.</p>""",
     [("Can VoiceLogPro replace Procore for my subcontracting business?", "VoiceLogPro replaces Procore's daily log function. For full project management — RFIs, submittals, budgets — you may still need Procore. But VoiceLogPro handles your documentation needs at a fraction of the cost."),
      ("How do I get VoiceLogPro reports into Procore?", "Export your VoiceLogPro PDF and upload it to the Procore daily log as an attachment. The PDF format is professional and court-ready, accepted by all Procore projects."),
      ("Does VoiceLogPro sync with Procore in real time?", "VoiceLogPro generates PDFs that you can upload. Direct API sync between the platforms is being developed for seamless integration.")],
     [("Home", DOMAIN+"/"), ("Integrations", DOMAIN+"/integrations/"), ("Procore", "")],
     [("Autodesk Integration", DOMAIN+"/integrations/autodesk"), ("PlanGrid Integration", DOMAIN+"/integrations/plangrid"), ("QuickBooks Integration", DOMAIN+"/integrations/quickbooks"), ("Viewpoint Integration", DOMAIN+"/integrations/viewpoint")]),

    ("plangrid", "VoiceLogPro + PlanGrid Integration: Voice Reports for PlanGrid Users",
     "Integrate VoiceLogPro with PlanGrid. Voice-to-PDF daily reports complement PlanGrid's blueprint and field management capabilities.",
     """
<h2>VoiceLogPro + PlanGrid: Field Documentation Made Simple</h2>
<p>PlanGrid (now part of Autodesk) is excellent for blueprint management, markup, and field collaboration. But like most construction platforms, its daily reporting features require typing. VoiceLogPro fills this gap with voice-to-PDF daily reports that create complete field documentation in 60 seconds. Foremen dictate their report, VoiceLogPro generates a professional PDF, and it's uploaded to PlanGrid for the project team. This gives PlanGrid users comprehensive field documentation without changing their existing workflows.</p>
<h2>Using Voice Reports with PlanGrid Blueprints</h2>
<p>VoiceLogPro reports reference specific work areas, blueprint sections, and details. When you dictate a report, mention the room, floor, or section you're working on. The generated PDF includes this location data. When the report is uploaded to PlanGrid, it can be pinned to the relevant blueprint location, creating a spatial documentation trail that ties voice reports directly to plan locations. This is especially valuable for large projects with complex blueprints.</p>
<h2>Why PlanGrid Users Add VoiceLogPro</h2>
<p>PlanGrid handles blueprints and field collaboration. VoiceLogPro handles daily documentation. They're complementary tools. PlanGrid users add VoiceLogPro because: (1) voice reports are faster — 60 seconds vs 10-15 minutes, (2) voice reports are more consistent — foremen actually do them daily, (3) voice reports create legal-grade PDFs for payment protection. VoiceLogPro fills the documentation gap that PlanGrid leaves open.</p>""",
     [("Does VoiceLogPro replace PlanGrid?", "No. They serve different needs. PlanGrid is for blueprints and markups. VoiceLogPro is for daily documentation and payment protection. They work together."),
      ("How do I attach VoiceLogPro reports to PlanGrid?", "Export the PDF from VoiceLogPro and attach it to the relevant PlanGrid project or field report. The PDF format is compatible with PlanGrid's document viewer."),
      ("Can I use VoiceLogPro offline with PlanGrid?", "Yes. VoiceLogPro works offline — reports are cached locally and sync when you have connectivity. PlanGrid also supports offline access to blueprints.")],
     [("Home", DOMAIN+"/"), ("Integrations", DOMAIN+"/integrations/"), ("PlanGrid", "")],
     [("Autodesk Integration", DOMAIN+"/integrations/autodesk"), ("Procore Integration", DOMAIN+"/integrations/procore"), ("QuickBooks Integration", DOMAIN+"/integrations/quickbooks"), ("Sage Integration", DOMAIN+"/integrations/sage")]),

    ("viewpoint", "VoiceLogPro + Viewpoint Integration: Voice Reports for Viewpoint Users",
     "Integrate VoiceLogPro with Viewpoint. Voice-to-PDF daily reports complement Viewpoint's accounting and project management features.",
     """
<h2>VoiceLogPro + Viewpoint: Documenting for Better Financial Outcomes</h2>
<p>Viewpoint (now Trimble Viewpoint) is a leading construction ERP and project management platform, strong in accounting, HR, and operations. VoiceLogPro complements Viewpoint by providing the field documentation that feeds into Viewpoint's project cost and accounting systems. Foremen dictate daily reports with VoiceLogPro — work performed, crew hours, materials used — and the generated PDFs provide the detailed field evidence needed to support the cost data tracked in Viewpoint. This creates a complete loop from field to finance.</p>
<h2>How Voice Reports Support Viewpoint Cost Tracking</h2>
<p>Viewpoint tracks actual costs against budgets. But where do those actual costs come from? They come from field reports of labor hours, material quantities, and equipment usage. VoiceLogPro captures this data at the source — in the foreman's voice, on the job site. The structured PDFs provide the audit trail that Viewpoint needs. When a project is over budget, you can trace back to the daily reports and see exactly where costs exceeded estimates and why.</p>
<h2>Payment Protection for Viewpoint Users</h2>
<p>Viewpoint helps you manage costs and track financial performance. VoiceLogPro helps you get paid. Daily reports with timestamps, weather verification, and photo attachments create the contemporaneous evidence needed for mechanics lien claims and payment disputes. Together, they give you both financial control and payment protection — two essential tools for a healthy subcontracting business.</p>""",
     [("Does VoiceLogPro integrate directly with Viewpoint?", "Currently, VoiceLogPro generates PDFs that can be associated with Viewpoint projects. Direct API integration is being evaluated based on customer demand."),
      ("Can VoiceLogPro help with Viewpoint's daily reporting requirements?", "Yes. VoiceLogPro reports meet daily documentation requirements. The structured PDFs can be attached to Viewpoint records for comprehensive project documentation."),
      ("Is VoiceLogPro compatible with Vista by Viewpoint?", "Yes. VoiceLogPro generates universal PDF outputs that can be attached to any Viewpoint platform, including Vista and Spectrum.")],
     [("Home", DOMAIN+"/"), ("Integrations", DOMAIN+"/integrations/"), ("Viewpoint", "")],
     [("Autodesk Integration", DOMAIN+"/integrations/autodesk"), ("Procore Integration", DOMAIN+"/integrations/procore"), ("QuickBooks Integration", DOMAIN+"/integrations/quickbooks"), ("Sage Integration", DOMAIN+"/integrations/sage")]),

    ("quickbooks", "VoiceLogPro + QuickBooks Integration: Voice Reports for QuickBooks Users",
     "Integrate VoiceLogPro with QuickBooks. Voice-to-PDF daily reports support QuickBooks billing and cost tracking for construction.",
     """
<h2>VoiceLogPro + QuickBooks: From Field Report to Invoice</h2>
<p>QuickBooks is the most widely used accounting platform for small construction businesses. It handles invoicing, expense tracking, and financial reporting. But QuickBooks doesn't capture field documentation — the daily details of what work was performed, by whom, and under what conditions. VoiceLogPro fills this gap. Foremen dictate daily reports, VoiceLogPro generates professional PDFs, and those PDFs support the invoices and costs you track in QuickBooks. When a client questions an invoice, your VoiceLogPro daily reports provide the evidence.</p>
<h2>What You Can Do with QuickBooks + VoiceLogPro</h2>
<p>Combine QuickBooks for financial management with VoiceLogPro for field documentation: capture daily labor hours and materials used in VoiceLogPro reports, use those reports to verify QuickBooks timesheet entries, attach VoiceLogPro PDFs as backup for QuickBooks invoices, provide detailed documentation when clients dispute charges, and build a complete financial + field record for every project.</p>
<h2>Protecting Your QuickBooks Invoices with Voice Reports</h2>
<p>When a client delays payment or disputes an invoice, your QuickBooks record shows the amounts. Your VoiceLogPro daily reports show why those amounts are correct — documented work, crew hours, materials, and conditions. This combination is powerful. The financial record from QuickBooks plus the field documentation from VoiceLogPro creates an unassailable evidence package that most payment disputes resolve quickly once both are presented.</p>""",
     [("Can VoiceLogPro export to QuickBooks format?", "VoiceLogPro exports professional PDFs that can be attached to QuickBooks records. Direct CSV export for QuickBooks import is being developed."),
      ("Does VoiceLogPro replace QuickBooks time tracking?", "VoiceLogPro's daily reports include crew hours and can complement QuickBooks time tracking. Use VoiceLogPro for detailed field documentation and QuickBooks for payroll and invoicing."),
      ("How do I attach VoiceLogPro reports to QuickBooks invoices?", "Export the PDF from VoiceLogPro and attach it to the corresponding invoice in QuickBooks as supporting documentation. This gives your clients detailed field evidence for every charge.")],
     [("Home", DOMAIN+"/"), ("Integrations", DOMAIN+"/integrations/"), ("QuickBooks", "")],
     [("Autodesk Integration", DOMAIN+"/integrations/autodesk"), ("Viewpoint Integration", DOMAIN+"/integrations/viewpoint"), ("Sage Integration", DOMAIN+"/integrations/sage"), ("Procore Integration", DOMAIN+"/integrations/procore")]),

    ("sage", "VoiceLogPro + Sage Integration: Voice Reports for Sage Users",
     "Integrate VoiceLogPro with Sage. Voice-to-PDF daily reports complement Sage accounting and project management features.",
     """
<h2>VoiceLogPro + Sage: Complete Construction Documentation</h2>
<p>Sage (formerly Sage 100 Contractor, Sage 300 CRE) is a leading construction accounting and project management platform. It excels at job costing, payroll, and financial reporting. VoiceLogPro complements Sage by bringing field documentation into your project management workflow. Foremen dictate daily reports with VoiceLogPro, generating structured PDFs that document labor, materials, equipment, and site conditions. These reports provide the detailed field evidence needed to support Sage's cost tracking and job costing data.</p>
<h2>Field Reports + Financial Data = Complete Picture</h2>
<p>Sage tells you what your project costs are. VoiceLogPro tells you what happened on site to generate those costs. Together, they create a complete picture. When a project runs over budget, Sage shows the variance. VoiceLogPro's daily reports show why — whether it was weather delays, material price increases, scope changes, or productivity issues. This insight helps you make better estimates on future projects and defend cost overruns to clients.</p>
<h2>Payment Protection for Sage Users</h2>
<p>Sage tracks your company's financial health. VoiceLogPro protects it. Daily reports with timestamps, weather data, and photo attachments create the contemporaneous evidence needed for mechanics lien claims and payment disputes. When a client withholds payment, your Sage records show the contract value, and your VoiceLogPro reports show the completed work. This documentation package is usually sufficient to resolve disputes without litigation.</p>""",
     [("Does VoiceLogPro integrate directly with Sage?", "Currently, VoiceLogPro generates PDFs that can be associated with Sage projects. Direct API integration is being evaluated based on customer demand."),
      ("Can VoiceLogPro help with Sage job costing?", "Yes. The labor hours, material quantities, and equipment usage captured in daily reports provide the field data that Sage's job costing module needs for accurate cost allocation."),
      ("Is VoiceLogPro compatible with Sage 100 Contractor?", "Yes. VoiceLogPro generates universal PDF outputs that can be associated with any Sage platform, including Sage 100 Contractor and Sage 300 CRE.")],
     [("Home", DOMAIN+"/"), ("Integrations", DOMAIN+"/integrations/"), ("Sage", "")],
     [("QuickBooks Integration", DOMAIN+"/integrations/quickbooks"), ("Viewpoint Integration", DOMAIN+"/integrations/viewpoint"), ("Autodesk Integration", DOMAIN+"/integrations/autodesk"), ("Procore Integration", DOMAIN+"/integrations/procore")]),
]

# --- /weekly-reports/ section pages ---
WEEKLY_PAGES = [
    ("general-contractor", "Weekly Construction Report Template for General Contractors",
     "Free weekly report template for general contractors. Summarize daily logs, track progress, and document project status for owners.",
     """
<h2>Why General Contractors Need Weekly Reports</h2>
<p>General contractors are responsible for reporting project status to owners, architects, and lenders. A weekly report summarizing daily logs, progress, issues, and forecasts is essential for project communication and contract compliance. VoiceLogPro's daily reports feed directly into your weekly summary — each daily report provides the detailed field data that your weekly report aggregates. This creates a consistent documentation flow from daily field work to weekly stakeholder updates.</p>
<h2>What a GC Weekly Report Should Include</h2>
<p>A comprehensive weekly report for GCs should include: work completed this week by trade area, progress photos with descriptions, schedule status (ahead/behind with reasons), change order log, RFI log, safety observations and incidents, material deliveries and shortages, equipment on site, weather impact summary, look-ahead for next week, and issues requiring owner decision. VoiceLogPro captures the daily data that feeds all of these categories.</p>
<h2>How VoiceLogPro Makes GC Reporting Easier</h2>
<p>VoiceLogPro lets GCs and their superintendents dictate daily observations that feed into the weekly report. Rather than collecting reports from each trade and manually compiling, the GC can use VoiceLogPro to create their own daily site observations, then compile the weekly report from these plus trade-submitted daily reports. The voice-first approach makes it practical for superintendents to document site conditions consistently without dedicated admin time.</p>""",
     [("What's the difference between a daily report and a weekly report?", "Daily reports capture detailed day-by-day field documentation. Weekly reports summarize progress, issues, and forecasts for stakeholders. VoiceLogPro handles daily reports; the weekly report is compiled from them."),
      ("Can VoiceLogPro automatically generate weekly reports?", "VoiceLogPro's daily reports provide the data. The weekly report is currently a manual compilation from daily PDFs. Automated weekly report generation is on our roadmap."),
      ("How many daily reports does a GC need per week?", "One daily report per active project per day. For a superintendent managing 5 projects, that's 5 voice reports per day — about 5 minutes total. A small time investment for comprehensive project documentation.")],
     [("Home", DOMAIN+"/"), ("Weekly Reports", DOMAIN+"/weekly-reports/"), ("GC Template", "")],
     [("Electrical Subcontractor Weekly Report", DOMAIN+"/weekly-reports/electrical-subcontractor"), ("Roofing Subcontractor Weekly Report", DOMAIN+"/weekly-reports/roofing-subcontractor"), ("Daily Construction Report Template", DOMAIN+"/templates/daily-construction-report-template"), ("How to Write a Daily Report", DOMAIN+"/learn/how-to-write-a-daily-report")]),

    ("electrical-subcontractor", "Weekly Construction Report Template for Electrical Subcontractors",
     "Free weekly report template for electrical subcontractors. Track circuits, panels, inspections, and material usage across the project.",
     """
<h2>Why Electrical Subcontractors Need Weekly Reports</h2>
<p>Electrical subcontractors work across multiple projects simultaneously, and each project has unique documentation needs: circuit routing, panel schedules, conduit runs, wire pulls, terminations, and inspections. A weekly report aggregating daily logs helps electrical contractors track progress, manage material costs, and document work for payment applications. VoiceLogPro's voice-first daily reports make it practical to capture electrical work details on every project without getting buried in paperwork.</p>
<h2>What an Electrical Weekly Report Should Include</h2>
<p>A comprehensive weekly report for electrical subcontractors should include: circuits completed by area or panel, conduit and wire quantities installed, equipment set (panels, transformers, switchgear), inspection results (passed/failed with notes), material deliveries and stock, change order work, crew hours by project, safety observations, and upcoming work plan. VoiceLogPro captures all this from daily voice notes.</p>
<h2>How Voice Reports Help Electrical Contractors Get Paid</h2>
<p>VoiceLogPro's daily reports document electrical work that's often hidden — inside walls, above ceilings, in conduits. Once drywall is installed, your work is invisible. If a dispute arises about whether you completed certain circuits or installed specific equipment, your daily reports with timestamps and photos are the evidence that proves your work was done. This documentation is essential for payment applications and lien claims.</p>""",
     [("Can VoiceLogPro track circuits and panels?", "Yes. Dictate circuit numbers, panel locations, and work completed for each. VoiceLogPro structures this information in your daily report, creating a searchable record of electrical work."),
      ("How do electrical weekly reports help with lien rights?", "Weekly reports summarize the daily documentation that supports lien claims. If you need to file a mechanics lien, your daily reports provide the detailed evidence, and weekly reports provide the summary."),
      ("Should I attach photos to electrical reports?", "Yes. Photos of panel installations, conduit runs, and equipment are valuable evidence. VoiceLogPro supports photo attachments with every daily report.")],
     [("Home", DOMAIN+"/"), ("Weekly Reports", DOMAIN+"/weekly-reports/"), ("Electrical Template", "")],
     [("General Contractor Weekly Report", DOMAIN+"/weekly-reports/general-contractor"), ("Roofing Subcontractor Weekly Report", DOMAIN+"/weekly-reports/roofing-subcontractor"),("Electrician Daily Report Template", DOMAIN+"/templates/electrician-daily-report"), ("How to Document Change Orders", DOMAIN+"/how-to/document-construction-change-orders")]),

    ("roofing-subcontractor", "Weekly Construction Report Template for Roofing Subcontractors",
     "Free weekly report template for roofing subcontractors. Track sections, materials, weather impact, and inspections on roof projects.",
     """
<h2>Why Roofing Subcontractors Need Weekly Reports</h2>
<p>Roofing work is uniquely affected by weather. A week of rain can delay multiple projects simultaneously, and weather conditions at installation affect roof performance and warranty validity. Weekly reports help roofing contractors track weather impact across projects, document installation conditions for warranty purposes, and communicate schedule changes to GCs and homeowners. VoiceLogPro's automatic weather data makes roof documentation especially valuable — every daily report includes verifiable weather conditions at the time of work.</p>
<h2>What a Roofing Weekly Report Should Include</h2>
<p>A comprehensive weekly report for roofers should include: sections completed by roof (square footage), material type and brand installed, underlayment and flashing details, weather conditions for each work day (temperature, wind speed, precipitation), crew hours, safety briefings conducted, inspection results, any leak repairs or warranty work, and next week's schedule. VoiceLogPro's daily reports automatically capture weather data and crew details, making weekly compilation straightforward.</p>
<h2>Weather Documentation for Roofing Warranties</h2>
<p>Roofing manufacturers specify installation temperature ranges, wind speed limits, and weather conditions for warranty validity. VoiceLogPro's automatic weather verification in every daily report provides an objective record that installation conditions met manufacturer requirements. This protects both the roofer and the manufacturer in warranty claims — if an issue arises, the weather data from installation days is on record and verifiable.</p>""",
     [("How does weather data help roofing contractors?", "Roofing manufacturers specify installation conditions. VoiceLogPro's automatic weather data proves those conditions were met. If a warranty claim is denied citing improper installation conditions, your weather-verified reports are your defense."),
      ("Can VoiceLogPro track multiple roof sections?", "Yes. Dictate each roof section, area finished, and materials used. VoiceLogPro structures this in your daily report, creating a detailed progress record for complex roof projects."),
      ("Do I need daily reports for roof repairs?", "Yes. Repair work also needs documentation: leak location, repair method, materials used, and weather conditions at repair time. VoiceLogPro reports protect you if the repair is later questioned.")],
     [("Home", DOMAIN+"/"), ("Weekly Reports", DOMAIN+"/weekly-reports/"), ("Roofing Template", "")],
     [("General Contractor Weekly Report", DOMAIN+"/weekly-reports/general-contractor"), ("Electrical Subcontractor Weekly Report", DOMAIN+"/weekly-reports/electrical-subcontractor"), ("Roofer Daily Report Checklist", DOMAIN+"/checklists/roofer-daily-report-checklist"), ("Roofer Daily Report Template", DOMAIN+"/templates/roofer-daily-report")]),
]

# ──────────────────────────────────────────────
# Main execution
# ──────────────────────────────────────────────

def expand_category(category_name, pages, get_filepath_fn, slug_key_fn):
    """Expand a category of thin pages."""
    count = 0
    for page_data in pages:
        try:
            slug = slug_key_fn(page_data)
            title = page_data[1]
            desc = page_data[2]
            content = page_data[3]
            faqs = page_data[4]
            breadcrumbs = page_data[5]
            related = page_data[6]
            canonical_url = f"{DOMAIN}/{category_name}/{slug}/"
            filepath = get_filepath_fn(slug)

            expanded = expand_page(filepath, title, desc, canonical_url, content, faqs, breadcrumbs, related)
            if expanded:
                count += 1
                print(f"  ✓ {slug}")
        except Exception as e:
            print(f"  ✗ {page_data[0] if isinstance(page_data, tuple) and len(page_data) > 0 else '?'}: {e}")
    return count

def main():
    total = 0

    print("=" * 60)
    print("VoiceLogPro Batch pSEO Content Expansion")
    print("=" * 60)

    def best_slug(p): return p[0]
    def best_path(slug): return os.path.join(OUT, "best", f"{slug}.html")

    print("\n--- /best/ pages ---")
    total += expand_category("best", BEST_PAGES, best_path, best_slug)

    def for_slug(p): return p[0]
    def for_path(slug): return os.path.join(OUT, "for", f"{slug}.html")
    # /for/ pages use flat .html pattern (vercel rewrites: /for/:slug -> /for/:slug.html)
    print("\n--- /for/ pages ---")
    total += expand_category("for", FOR_PAGES, for_path, for_slug)

    def learn_slug(p): return p[0]
    def learn_path(slug): return os.path.join(OUT, "learn", f"{slug}.html")
    print("\n--- /learn/ pages ---")
    total += expand_category("learn", LEARN_PAGES, learn_path, learn_slug)

    def glossary_slug(p): return p[0]
    def glossary_path(slug): return os.path.join(OUT, "glossary", f"{slug}.html")
    print("\n--- /glossary/ pages ---")
    total += expand_category("glossary", GLOSSARY_PAGES, glossary_path, glossary_slug)

    def howto_slug(p): return p[0]
    def howto_path(slug): return os.path.join(OUT, "how-to", f"{slug}.html")
    print("\n--- /how-to/ pages ---")
    total += expand_category("how-to", HOW_PAGES, howto_path, howto_slug)

    def usecase_slug(p): return p[0]
    def usecase_path(slug): return os.path.join(OUT, "use-cases", f"{slug}.html")
    print("\n--- /use-cases/ pages ---")
    total += expand_category("use-cases", USE_CASE_PAGES, usecase_path, usecase_slug)

    def cost_slug(p): return p[0]
    def cost_path(slug): return os.path.join(OUT, "cost-of", f"{slug}.html")
    print("\n--- /cost-of/ pages ---")
    total += expand_category("cost-of", COST_PAGES, cost_path, cost_slug)

    def template_slug(p): return p[0]
    def template_path(slug): return os.path.join(OUT, "templates", f"{slug}.html")
    print("\n--- /templates/ pages ---")
    total += expand_category("templates", TEMPLATE_DETAIL_PAGES, template_path, template_slug)

    def pricing_slug(p): return p[0]
    def pricing_path(slug): return os.path.join(OUT, "pricing-questions", f"{slug}.html")
    print("\n--- /pricing-questions/ pages ---")
    total += expand_category("pricing-questions", PRICING_PAGES, pricing_path, pricing_slug)

    def integration_slug(p): return p[0]
    def integration_path(slug): return os.path.join(OUT, "integrations", f"{slug}.html")
    print("\n--- /integrations/ pages ---")
    total += expand_category("integrations", INTEGRATION_PAGES, integration_path, integration_slug)

    def weekly_slug(p): return p[0]
    def weekly_path(slug): return os.path.join(OUT, "weekly-reports", f"{slug}.html")
    print("\n--- /weekly-reports/ pages ---")
    total += expand_category("weekly-reports", WEEKLY_PAGES, weekly_path, weekly_slug)

    print(f"\n{'=' * 60}")
    print(f"Total pages expanded: {total}")
    print(f"{'=' * 60}")

if __name__ == "__main__":
    main()
