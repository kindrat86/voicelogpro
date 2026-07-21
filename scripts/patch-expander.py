#!/usr/bin/env python3
"""Patch the expand_page function to handle pages without <main> tags."""
import re

with open('expand-thin-pseo-pages.py', 'r') as f:
    content = f.read()

# Add the soup_body search and existing_wc init before the if soup_main block
old_soup_search = '''    # 4. Replace or insert main content
    soup_main = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
    # Also try to find body content (some pages use custom layout without <main>)
    soup_body = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
    
    if soup_main:
        existing_main = soup_main.group(1)'''

new_soup_search = '''    # 4. Replace or insert main content
    existing_wc = 0
    soup_main = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
    soup_body = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
    
    if soup_main:
        existing_main = soup_main.group(1)'''

content = content.replace(old_soup_search, new_soup_search)

# Now find the end of the main-block replacement and add the fallback
# The pattern we need to match is:
# ...html[soup_main.end():]
# 
#     # 5. Write back
old_end = '''            html = html[:soup_main.start()] + '<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">' + new_main_inner + '\\n</main>' + related_html + html[soup_main.end():]

    # 5. Write back'''

new_end = '''            html = html[:soup_main.start()] + '<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">' + new_main_inner + '\\n</main>' + related_html + html[soup_main.end():]

    # 4b. Fallback for pages without <main> tag (custom body layout)
    elif soup_body and existing_wc < 300:
        body_content_tag = soup_body.group(1)
        # Remove style, script, nav, footer elements for word counting
        body_text_clean = re.sub(r'<style[^>]*>.*?</style>', '', body_content_tag, flags=re.S|re.I)
        body_text_clean = re.sub(r'<script[^>]*>.*?</script>', '', body_text_clean, flags=re.S|re.I)
        body_text_clean = re.sub(r'<nav[^>]*>.*?</nav>', '', body_text_clean, count=1, flags=re.DOTALL)
        body_text_clean = re.sub(r'<footer[^>]*>.*?</footer>', '', body_text_clean, flags=re.DOTALL|re.I)
        body_text_clean = re.sub(r'<[^>]+>', ' ', body_text_clean)
        body_text_clean = re.sub(r'\\s+', ' ', body_text_clean).strip()
        body_wc = len(body_text_clean.split())
        if body_wc < 300:
            body_nav_html = '\\n<nav>\\n<a href="' + DOMAIN + '/" style="font-weight:700;color:#1a1a2e">VoiceLogPro</a> \\n<a href="' + DOMAIN + '/best">Best</a> \\n<a href="' + DOMAIN + '/how-to">How To</a> \\n<a href="' + DOMAIN + '/use-cases">Use Cases</a> \\n<a href="' + DOMAIN + '/learn">Learn</a>\\n</nav>\\n'
            body_footer_html = '\\n<footer>&copy; 2026 VoiceLogPro. All rights reserved. <a href="' + DOMAIN + '/sitemap.xml">Sitemap</a></footer>'
            new_body_content = body_nav_html + '<h1>' + escape(title) + '</h1>\\n<p class="lead">' + escape(desc) + '</p>\\n' + content_html + faq_html + related_html + body_footer_html
            html = html[:soup_body.start()] + '<body>' + new_body_content + '</body>' + html[soup_body.end():]

    # 5. Write back'''

if old_end not in content:
    # Try with escaped backslash n  
    old_end_alt = '            html = html[:soup_main.start()] + \'<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">\' + new_main_inner + \'\\n</main>\' + related_html + html[soup_main.end():]\n\n    # 5. Write back'
    for variant in [old_end, old_end_alt]:
        if variant in content:
            print("Found alternative")
            old_end = variant
            break
    else:
        print("Pattern not found, searching...")
        # Find the text around that area
        idx = content.find('html[soup_main.end():]')
        if idx > 0:
            print(repr(content[idx:idx+300]))
        raise SystemExit(1)

content = content.replace(old_end, new_end)

with open('expand-thin-pseo-pages.py', 'w') as f:
    f.write(content)

import ast
ast.parse(content)
print("Patched OK!")
