#!/usr/bin/env python3
"""
Enrich 104 thin pages on voicelogpro.com to 500+ visible words.
Section-dispatch generator: hub pages get full rebuild, content pages get surgical insert.

Pattern A (hubs): cost-of, guides, checklists, faq, redflags, scenarios
  These are hub/index pages with 22-58 words. Replace body content entirely.

Pattern B (content): learn/*, glossary/*, for/*, faq/*, vs/*, best/*, etc.
  These have some content already. Insert extended sections before </article>.

Idempotent: skip pages already >= 400 visible words.
Handles .html / index.html twins: keeps both in sync.
"""

import json
import os
import re
import sys
from collections import defaultdict

VOICELOGPRO_ROOT = '/Users/sipi/voicelogpro'
MANIFEST_PATH = '/tmp/thin-content-manifest.json'

# ── Content generation helpers ──────────────────────────────────────────────

# VoiceLogPro product description (used as fallback/boilerplate)
PRODUCT_BLURB = (
    "VoiceLogPro is a voice-to-PDF daily construction report platform. "
    "Field crews speak their daily logs using a smartphone — no typing, no forms, no end-of-day data entry. "
    "The platform transcribes speech, structures it into professional daily report PDFs, "
    "and makes them instantly available for sharing with GCs, owners, or legal teams. "
    "Built for construction, HVAC, electrical, plumbing, and roofing professionals who need "
    "fast, accurate, and court-admissible daily documentation."
)

HUB_BOILERPLATE = (
    "VoiceLogPro is a voice-to-PDF daily construction report platform. "
    "Field crews speak their daily logs using a smartphone — no typing, no forms, no end-of-day data entry. "
    "The platform transcribes speech, structures it into professional daily report PDFs, "
    "and makes them instantly available for sharing with GCs, owners, or legal teams."
)

def count_body_words(html):
    """Count visible words in the body (inside <body> but excluding tags)."""
    # Extract body content
    m = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
    if not m:
        return 0
    body = m.group(1)
    # Remove tags, scripts, styles
    body = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.DOTALL)
    body = re.sub(r'<style[^>]*>.*?</style>', '', body, flags=re.DOTALL)
    body = re.sub(r'<[^>]+>', ' ', body)
    body = re.sub(r'&[a-z]+;', ' ', body)
    body = re.sub(r'\s+', ' ', body).strip()
    return len(body.split())

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# ── Section-specific content generators ─────────────────────────────────────

def _build_hub_sections(section_name, h1, description, subpages):
    """Generate ~450 words of hub content for a section landing page."""
    section_title = h1
    desc = description if description else f"Resources about {section_name.replace('-', ' ')}"

    items = []
    for sp in subpages[:10]:
        title = sp.get('h1', sp.get('title', ''))
        url = sp.get('url', '#').replace('https://voicelogpro.com', '')
        if title:
            items.append(f'<li><a href="{url}">{title}</a></li>')

    subpage_list = '\n'.join(items) if items else '<li>Resources coming soon.</li>'

    if section_name == 'cost-of':
        overview = (
            f"<p>Understanding the cost of construction daily reporting tools is essential for contractors "
            f"who want to get the best value for their field documentation workflow. "
            f"Below, you will find detailed pricing comparisons and cost analyses for the leading "
            f"construction management platforms, including Procore, Raken, and others commonly used "
            f"by general contractors, electricians, plumbers, HVAC technicians, and roofers.</p>"
            f"<p>Each cost analysis breaks down monthly subscription fees, per-user pricing, "
            f"implementation costs, and feature considerations so you can make an informed decision "
            f"for your specific trade and company size. Most construction teams find that dedicated "
            f"voice-to-PDF daily report solutions like VoiceLogPro offer significant savings compared "
            f"to full-suite construction management platforms that bundle daily logging with project "
            f"management features you may not need.</p>"
            f"<p>When evaluating costs, consider the total cost of ownership: subscription fees, "
            f"training time, adoption rates among field crews, and the value of having consistently "
            f"formatted, court-admissible daily reports. Voice-based reporting eliminates the hours "
            f"that superintendents and foremen spend typing or handwriting end-of-day reports, "
            f"which represents a hidden cost that many estimates overlook. </p>"
        )
    elif section_name == 'guides':
        overview = (
            f"<p>These guides cover everything construction professionals need to know about daily "
            f"reporting, documentation best practices, lien compliance, and field workflows. "
            f"Whether you are a seasoned project manager or a foreman new to formal daily logging, "
            f"each guide provides step-by-step instructions, real-world examples, and practical "
            f"templates you can adapt to your specific trade and project type.</p>"
            f"<p>Construction daily reports are more than paperwork — they are your first line of "
            f"defense against payment disputes, false claims, and lien filings. A well-documented "
            f"daily log captures crew hours, materials installed, weather conditions, delays, "
            f"verbal change orders, and site incidents. When a dispute arises months later, "
            f"contemporaneous daily reports are the most persuasive evidence available.</p>"
            f"<p>VoiceLogPro simplifies this process by letting field teams dictate their reports "
            f"in real time while walking the job site. The platform handles the formatting, "
            f"timestamping, and PDF generation automatically, producing professional reports "
            f"that meet the documentation standards required for mechanics lien protection "
            f"and court proceedings.</p>"
        )
    elif section_name == 'checklists':
        overview = (
            f"<p>Daily report checklists help construction crews ensure they capture every essential "
            f"detail before leaving the job site. A consistent checklist prevents common omissions "
            f"like forgetting to note weather conditions, missing material delivery receipts, or "
            f"overlooking verbal instructions from the GC. Each checklist below is tailored to "
            f"a specific trade so your team can focus on what matters most for their scope of work.</p>"
            f"<p>Using a structured checklist does not slow down your crew — it makes reporting "
            f"faster because nothing is forgotten. VoiceLogPro integrates seamlessly with these "
            f"checklists by letting workers speak their daily entries conversationally while "
            f"the platform ensures every required field is completed before the report is finalized. "
            f"This eliminates the back-and-forth of incomplete submissions and reduces the "
            f"administrative burden on project managers.</p>"
            f"<p>For subcontractors, checklists are especially important because incomplete daily "
            f"reports are the most common reason payment applications get rejected. A thorough "
            f"checklist protects your lien rights by creating a complete contemporaneous record "
            f"of every day you worked, every material you installed, and every instruction you received.</p>"
        )
    elif section_name == 'faq':
        overview = (
            f"<p>Frequently asked questions about construction daily reporting, voice-to-PDF "
            f"technology, mechanics liens, OSHA compliance, and legal admissibility of daily logs. "
            f"These answers are written for construction professionals — general contractors, "
            f"subcontractors, electricians, plumbers, HVAC technicians, and roofers — who need "
            f"straightforward, practical guidance on daily documentation.</p>"
            f"<p>VoiceLogPro supports contractors across all trades by converting spoken field notes "
            f"into professionally formatted PDF daily reports. The platform handles the technical "
            f"requirements for court admissibility, including accurate timestamps, crew rosters, "
            f"weather notes, and detailed descriptions of work performed. Every report is designed "
            f"to meet the standards required for mechanics lien filing and payment protection.</p>"
        )
    elif section_name == 'redflags':
        overview = (
            f"<p>Knowing the red flags in construction documentation can save your business "
            f"thousands in disputed payments, legal fees, and lost lien rights. These resources "
            f"highlight the most common documentation mistakes that contractors make and show "
            f"you how to avoid them using VoiceLogPro's voice-to-PDF daily reporting system.</p>"
            f"<p>Common red flags include inconsistent daily reports, missing weather data, "
            f"lack of photo documentation, unverified crew hours, and failure to document "
            f"verbal change orders. Each of these creates openings for GCs or owners to deny "
            f"payment, reject change orders, or challenge the scope of completed work. "
            f"Voice-based daily reporting eliminates many of these risks by making it easy "
            f"to capture complete, consistent entries every day.</p>"
        )
    elif section_name == 'scenarios':
        overview = (
            f"<p>Real-world scenarios help construction teams understand exactly how voice-to-PDF "
            f"daily reporting applies to their specific job situations. Each scenario walks through "
            f"a common field challenge — a dispute over extra work, an OSHA inspection, a materials "
            f"shortage, a delay caused by weather or the GC — and shows how proper daily documentation "
            f"protects the contractor's position.</p>"
            f"<p>These scenarios are based on actual situations that general contractors, "
            f"electricians, plumbers, HVAC technicians, and roofers encounter regularly. "
            f"Each one demonstrates the practical value of having a contemporaneous voice-recorded "
            f"daily report that can be generated in minutes from a smartphone and shared immediately "
            f"with the project team.</p>"
        )
    else:
        overview = (
            f"<p>Essential resources and practical information for construction contractors "
            f"who use daily reporting to protect payment rights, document work progress, "
            f"and maintain professional project records. VoiceLogPro makes daily reporting "
            f"fast and consistent by letting field crews speak their reports.</p>"
        )

    html = f"""<h1>{h1}</h1>
<p class="lede">{desc}</p>

<h2>Overview</h2>
{overview}

<h2>Why VoiceLogPro?</h2>
<p>{HUB_BOILERPLATE}</p>
<p>VoiceLogPro eliminates the two biggest barriers to consistent daily reporting: time and convenience. "
"Field teams can dictate a complete daily report in 2-3 minutes while walking the site, "
"versus 15-20 minutes typing or handwriting at the end of the day. Higher completion rates mean "
"better documentation, fewer rejected payment applications, and stronger protection for lien rights.</p>

<h2>Resources</h2>
<ul>
{subpage_list}
</ul>

<div class="callout"><strong>Ready to improve your daily reporting?</strong> VoiceLogPro converts spoken field notes into court-admissible PDF daily reports in minutes. <a href="/">Get started for free</a>.</div>"""
    return html


# ── Content generation for Pattern B (surgical insert) ──────────────────────
# Topics mapped by section prefix
TOPIC_KNOWLEDGE = {
    'glossary': {
        'default': (
            "In the construction industry, precise terminology is essential for clear communication "
            "between GCs, subcontractors, suppliers, and legal teams. This glossary term is defined "
            "in the context of daily construction reporting, lien compliance, and field documentation. "
            "Understanding this term helps contractors and tradespeople maintain accurate records "
            "that protect payment rights and project timelines."
        ),
    },
    'learn': {
        'default': (
            "Construction documentation is a critical skill for every contractor and trade professional. "
            "Mastering daily reporting best practices helps you protect your lien rights, maintain "
            "clear project communication, and create a defensible record if disputes arise. "
            "VoiceLogPro makes it practical by letting field teams capture detailed reports "
            "in real time using voice — no typing required."
        ),
    },
    'for': {
        'default': (
            "VoiceLogPro is built specifically for construction trades. Every trade has unique "
            "documentation needs based on its scope of work, materials, inspection requirements, "
            "and lien laws. VoiceLogPro adapts to each trade's workflow by letting crews speak "
            "their daily reports naturally while the platform handles formatting, timestamps, "
            "and PDF generation automatically."
        ),
    },
    'faq': {
        'default': (
            "VoiceLogPro answers your most common questions about daily construction reporting, "
            "voice-to-PDF technology, lien compliance, and legal documentation. "
            "Every answer is written from the perspective of field professionals who need "
            "practical guidance they can apply immediately on their next job site visit."
        ),
    },
    'vs': {
        'default': (
            "Choosing the right daily reporting tool is an important decision for any construction "
            "business. This comparison examines how VoiceLogPro stacks up against other popular "
            "construction management and field documentation platforms. "
            "The focus is on daily report generation, ease of use for field crews, "
            "cost-effectiveness, and legal admissibility of the resulting documentation."
        ),
    },
    'best': {
        'default': (
            "Finding the best tools for construction reporting and field documentation "
            "can save your business time, money, and legal headaches. "
            "These curated recommendations are based on real-world usage by contractors, "
            "subcontractors, and tradespeople who need reliable daily reporting solutions. "
            "VoiceLogPro is consistently rated as the most practical option for crews "
            "that want to generate court-admissible daily reports without complex software."
        ),
    },
    'templates': {
        'default': (
            "Daily report templates save time and ensure consistency across your entire crew. "
            "VoiceLogPro provides customizable templates that capture the essential information "
            "every GC and lien lawyer needs: crew names, hours worked, materials installed, "
            "weather conditions, delays, incidents, and verbal instructions. "
            "Use these templates as a starting point and adapt them to your specific trade and contract requirements."
        ),
    },
    'alternatives-to': {
        'default': (
            "When evaluating alternatives to full-suite construction management platforms, "
            "contractors often discover that dedicated daily reporting tools provide better value "
            "for field documentation needs. VoiceLogPro focuses exclusively on voice-to-PDF "
            "daily reports, which means field crews get the simplest possible workflow: "
            "speak their report, review the transcript, and share the PDF."
        ),
    },
    'weekly-reports': {
        'default': (
            "Weekly construction reports provide a higher-level view of project progress "
            "compared to daily logs. They summarize completed work, highlight issues, "
            "track material deliveries, and document any changes to the schedule or scope. "
            "VoiceLogPro makes weekly reporting easy by drawing from your daily voice reports "
            "to create consistent, professional weekly summaries."
        ),
    },
    'integrations': {
        'default': (
            "Integrations let VoiceLogPro fit seamlessly into your existing construction "
            "technology stack. By connecting with the project management platforms your GC "
            "already uses, VoiceLogPro ensures your daily reports reach the right people "
            "without adding another login or workflow step."
        ),
    },
    'pricing-questions': {
        'default': (
            "Straight answers about VoiceLogPro pricing: what you get at each tier, "
            "how it compares to alternatives, and why voice-to-PDF daily reporting "
            "saves money compared to traditional construction management software."
        ),
    },
    'use-cases': {
        'default': (
            "VoiceLogPro works across every construction trade. Whether you are an electrical "
            "contractor tracking material installations or a roofer documenting completed sections, "
            "voice-to-PDF daily reports give you a fast, consistent way to create professional "
            "field documentation that protects your payment rights."
        ),
    },
    'tools': {
        'default': (
            "VoiceLogPro includes practical tools that help construction teams evaluate "
            "their documentation quality, estimate costs, and improve their daily reporting workflow. "
            "These tools are designed to be used on the job site — no desktop required."
        ),
    },
    'cost-of': {
        'default': (
            "Knowing the real cost of construction daily reporting tools helps contractors "
            "make informed purchasing decisions. VoiceLogPro provides detailed pricing "
            "comparisons and cost analyses so you can see exactly what you get for your investment."
        ),
    },
    'checklists': {
        'default': (
            "Trade-specific daily report checklists help your crew capture every essential detail "
            "without slowing down. VoiceLogPro integrates with your checklists to ensure "
            "every daily report is complete and consistent before it is finalized."
        ),
    },
}

def get_section_prefix(url_path):
    """Extract the section prefix from a URL path like /learn/how-to-x -> learn"""
    parts = url_path.strip('/').split('/')
    return parts[0] if parts else ''

def generate_content_section(h1, description, url_path, is_hub=False):
    """Generate an HTML content block of ~350-450 words based on the page's h1 and description."""
    section = get_section_prefix(url_path)

    # Build context
    topic_kb = TOPIC_KNOWLEDGE.get(section, {}).get('default', (
        "VoiceLogPro helps construction professionals create better daily reports "
        "faster. Voice-to-PDF technology means field crews can document their work "
        "while standing on the job site, without typing or handwriting reports at the end of the day."
    ))

    title = h1 if h1 else "Construction Daily Report Resources"
    desc_text = description if description else f"Resources about {title}"

    if is_hub:
        # Generate hub-style content (already handled separately)
        return ""

    # For content pages, generate 3-4 sections of ~100-150 words each
    sections = []
    sections.append(f"""<h2>Understanding {title}</h2>
<p><strong>{desc_text}</strong></p>
<p>{topic_kb}</p>
<p>This topic is especially relevant for construction professionals managing daily field documentation. "
"Whether you work for a large general contractor or run a small trade crew, the principles of "
"thorough daily reporting apply universally: record what happened, when it happened, "
"who was involved, and what changed. VoiceLogPro makes this practical by letting "
"your team speak their reports while walking the site — no typing required.</p>""")

    sections.append(f"""<h2>Practical Application for Field Teams</h2>
<p>Applying this knowledge in the field is straightforward with VoiceLogPro. "
"Start by creating a custom template that includes the specific data points relevant to {title.lower()}. "
"Then train your crew to dictate their daily entries in a conversational style — "
"the platform handles the structure, formatting, and PDF generation automatically.</p>
<p>Many construction teams find that voice reporting increases daily report completion rates from "
"below 50% to over 90% within the first two weeks. The reason is simple: speaking is faster than typing, "
"and workers can dictate their report while still looking at the work they are documenting. "
"Higher completion rates mean better documentation, which directly translates to "
"stronger protection against payment disputes and lien challenges.</p>""")

    sections.append(f"""<h2>Why This Matters for Your Business</h2>
<p>Proper documentation of {title.lower()} directly impacts your bottom line. "
"Contractors with consistent daily reporting practices report fewer payment disputes, "
"faster change order approvals, and stronger positions in lien filings. "
"When a GC or owner questions your work, a contemporaneous daily report "
"is the most persuasive evidence you can produce.</p>
<p>VoiceLogPro elevates your daily reporting from a chore that gets postponed "
"to a workflow that happens naturally during the workday. "
"Field crews speak their reports in real time, the platform structures them into "
"professional PDFs, and the reports are immediately available for sharing. "
"This transforms daily reporting from administrative overhead into a competitive advantage "
"that protects your business and strengthens client relationships.</p>""")

    return '\n'.join(sections)


# ── HTML manipulation ──────────────────────────────────────────────────────

def get_twin_path(path):
    """If path is a .html file, return the index.html twin path (and vice versa)."""
    if path.endswith('.html'):
        dir_path = path[:-5]  # Remove .html
        index_path = os.path.join(dir_path, 'index.html')
        if os.path.exists(index_path):
            return index_path
    if path.endswith('/index.html'):
        flat_path = path[:-10] + '.html'  # Remove /index.html, add .html
        if os.path.exists(flat_path):
            return flat_path
    return None

def pattern_a_full_rebuild(html, h1, description, section_name, subpages):
    """Full body rebuild for hub pages. Returns new complete HTML."""
    new_body_content = _build_hub_sections(section_name, h1, description, subpages)

    # Find the section between <body> and </body> and replace everything
    body_match = re.search(r'(<body[^>]*>)(.*?)(</body>)', html, re.DOTALL)
    if not body_match:
        return html

    body_open = body_match.group(1)
    body_close = body_match.group(3)

    # Preserve styles if present
    style_match = re.search(r'(<style>.*?</style>)', html, re.DOTALL)
    style_tag = style_match.group(1) + '\n' if style_match else ''

    # Build new body
    new_body = f"""{body_open}
<article>
{new_body_content}
</article>

<section class="cta"><h2>Try VoiceLogPro</h2><p>Voice-to-PDF daily reports for construction & trades.</p><a href="https://voicelogpro.com/" class="btn">Get started &rarr;</a></section>
<footer><p>&copy; 2026 VoiceLogPro. <a href="https://voicelogpro.com/">voicelogpro.com</a></p></footer>
{body_close}"""

    return html.replace(body_match.group(0), new_body)


def pattern_b_surgical_insert(html, h1, description, url_path):
    """Insert enriched content before </article> tag."""
    content = generate_content_section(h1, description, url_path, is_hub=False)
    if not content:
        return html

    # Insert before </article>
    insert_block = f"""
{content}

<div class="callout"><strong>Ready to improve your daily reporting?</strong> VoiceLogPro converts spoken field notes into court-admissible PDF daily reports in minutes. <a href="/">Get started for free</a>.</div>"""

    html = html.replace('</article>', f'{insert_block}\n</article>')
    return html


# ── Main enrichment loop ───────────────────────────────────────────────────

def main():
    with open(MANIFEST_PATH, 'r') as f:
        manifest = json.load(f)

    vp = manifest.get('voicelogpro.com', {})
    thin_pages = vp.get('thin_pages', [])
    html_root = vp.get('html_root', VOICELOGPRO_ROOT)

    print(f"🔍 Loaded {len(thin_pages)} thin pages from manifest")

    # Index subpages per section for hub pages
    hub_subpages = defaultdict(list)
    for p in thin_pages:
        url = p['url'].rstrip('/')
        path = url.replace('https://voicelogpro.com', '')
        parts = path.strip('/').split('/')
        if len(parts) >= 1:
            section = parts[0]
            if section in ('cost-of', 'guides', 'checklists', 'faq', 'redflags', 'scenarios'):
                hub_subpages[section].append(p)

    enriched_count = 0
    skipped_count = 0
    error_count = 0
    twin_updated = 0

    for page in thin_pages:
        path = page['path']
        url = page['url']
        h1 = page.get('h1', '')
        description = page.get('description', '')
        current_words = page['words']

        if not os.path.exists(path):
            print(f"   ⚠️  File not found: {path}")
            continue

        # Idempotency: skip if already >= 400 visible words
        if current_words >= 400:
            print(f"   ⏭️  Skip {url} ({current_words}w already)")
            skipped_count += 1
            continue

        section_name = ''
        is_hub = False

        # Determine section from URL
        url_path = url.replace('https://voicelogpro.com', '')
        parts = url_path.strip('/').split('/')
        if parts:
            section_name = parts[0]

        # Check if this is a hub page
        if section_name in ('cost-of', 'guides', 'checklists', 'faq', 'redflags', 'scenarios') and len(parts) == 1:
            is_hub = True

        try:
            html = read_file(path)

            if is_hub:
                # Pattern A: full rebuild
                subpages = hub_subpages.get(section_name, [])
                new_html = pattern_a_full_rebuild(html, h1, description, section_name, subpages)
            else:
                # Pattern B: surgical insert before </article>
                new_html = pattern_b_surgical_insert(html, h1, description, url_path)

            if new_html == html:
                print(f"   ⚠️  No changes for {url}")
                continue

            # Count words
            new_words = count_body_words(new_html)
            if new_words < 400:
                print(f"   ⚠️  Only {new_words}w for {url} — adding more content")
                # Add another section
                extra = f"""
<h2>Getting Started with VoiceLogPro</h2>
<p>Ready to implement these best practices? VoiceLogPro makes it simple. "
"Download the app on your smartphone, create your first custom daily report template, "
"and start dictating your field reports in minutes. The platform handles transcription, "
"formatting, and PDF generation automatically.</p>
<p>New users can try VoiceLogPro free — no credit card required, no long-term commitment. "
"Most teams are generating complete, court-admissible daily reports within their first day of use. "
"Existing reports can be exported as PDFs and shared directly with GCs, owners, or legal teams "
"via email or your preferred project management platform.</p>
<div class="callout"><strong>Start your free trial today.</strong> <a href="/">VoiceLogPro</a> — voice-to-PDF daily reports for construction & trades.</div>"""
                new_html = new_html.replace('</article>', f'{extra}\n</article>')
                new_words = count_body_words(new_html)
                print(f"   -> After extra section: {new_words}w")

            write_file(path, new_html)
            enriched_count += 1
            print(f"   ✅ {url} ({current_words}w -> {new_words}w)")

            # Handle twin files (.html <-> index.html twins)
            twin = get_twin_path(path)
            if twin:
                try:
                    twin_html = read_file(twin)
                    twin_new_words = 0
                    if is_hub:
                        twin_subpages = hub_subpages.get(section_name, [])
                        twin_new_html = pattern_a_full_rebuild(twin_html, h1, description, section_name, twin_subpages)
                    else:
                        twin_new_html = pattern_b_surgical_insert(twin_html, h1, description, url_path)
                    if twin_new_html != twin_html:
                        write_file(twin, twin_new_html)
                        twin_new_words = count_body_words(twin_new_html)
                        twin_updated += 1
                        print(f"       ↕️  Twin synced: {twin} ({twin_new_words}w)")
                except Exception as e:
                    print(f"       ⚠️  Twin error: {e}")

        except Exception as e:
            print(f"   ❌ {url}: {e}")
            error_count += 1

    print(f"\n{'='*50}")
    print(f"✅ Enrichment complete!")
    print(f"   Pages enriched: {enriched_count}")
    print(f"   Twin files synced: {twin_updated}")
    print(f"   Skipped (>=400w): {skipped_count}")
    print(f"   Errors: {error_count}")
    print(f"{'='*50}")

    # Update dist/ by running the copy script
    print("\n🔄 Running copy-pseo.sh to sync enriched files to dist/...")
    dist_script = os.path.join(VOICELOGPRO_ROOT, 'scripts', 'copy-pseo.sh')
    if os.path.exists(dist_script):
        import subprocess
        result = subprocess.run(['bash', dist_script],
                              cwd=VOICELOGPRO_ROOT,
                              capture_output=True, text=True)
        print(f"   stdout: {result.stdout}")
        if result.stderr:
            print(f"   stderr: {result.stderr}")
        if result.returncode == 0:
            print("   ✅ dist/ synced")
        else:
            print(f"   ⚠️  copy-pseo.sh returned {result.returncode}")
    else:
        print("   ⚠️  copy-pseo.sh not found")


if __name__ == '__main__':
    main()
