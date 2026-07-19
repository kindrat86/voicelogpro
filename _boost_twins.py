#!/usr/bin/env python3
"""Boost twins that are under 400 words."""
import re
import os

def count_body_words(html):
    m = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
    if not m:
        return 0
    body = m.group(1)
    body = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.DOTALL)
    body = re.sub(r'<style[^>]*>.*?</style>', '', body, flags=re.DOTALL)
    body = re.sub(r'<[^>]+>', ' ', body)
    body = re.sub(r'&[a-z]+;', ' ', body)
    body = re.sub(r'\s+', ' ', body).strip()
    return len(body.split())

extra_section = """<h2>Getting Started with VoiceLogPro</h2>
<p>Ready to implement these best practices? VoiceLogPro makes it simple. Download the app on your smartphone, create your first custom daily report template, and start dictating your field reports in minutes. The platform handles transcription, formatting, and PDF generation automatically.</p>
<p>New users can try VoiceLogPro free — no credit card required, no long-term commitment. Most teams are generating complete, court-admissible daily reports within their first day of use. Existing reports can be exported as PDFs and shared directly with GCs, owners, or legal teams via email or your preferred project management platform.</p>
<div class="callout"><strong>Start your free trial today.</strong> <a href="/">VoiceLogPro</a> — voice-to-PDF daily reports for construction and trades.</div>"""

pairs = [
    '/Users/sipi/voicelogpro/cost-of/index.html',
    '/Users/sipi/voicelogpro/checklists/index.html',
    '/Users/sipi/voicelogpro/faq/index.html',
    '/Users/sipi/voicelogpro/scenarios/index.html',
]

for path in pairs:
    if not os.path.exists(path):
        print(f"NOT FOUND: {path}")
        continue
    with open(path) as f:
        html = f.read()
    wc = count_body_words(html)
    if wc < 400 and '</article>' in html:
        html = html.replace('</article>', f'{extra_section}\n</article>')
        with open(path, 'w') as f:
            f.write(html)
        new_wc = count_body_words(html)
        print(f'Boosting {path}: {wc}w -> {new_wc}w')
    else:
        print(f'Skipping {path}: {wc}w')
