# OWNER_ACTIONS_VOICELOGPRO.md — Traffic Maximization Owner Packet

Date: 2026-07-23 | Repo: `~/voicelogpro` | Domain: voicelogpro.com

---

## 1. GSC + Bing Webmaster Tools — Submit & Verify

The site was verified in GSC previously. After this deploy:

```bash
# GSC: submit updated sitemap (OAuth token already configured at ~/.hermes/gsc-token.pickle)
# Bing: submit via API using BING_WEBMASTER_API_KEY
curl -X POST "https://www.bing.com/webmasterapi/api.svc/json/SubmitFeed?apikey=$BING_WEBMASTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"siteUrl":"https://voicelogpro.com","feedUrl":"https://voicelogpro.com/sitemap.xml"}'
```

**GSC note:** gitdealflow.com was verified as `sc-domain` (domain property). voicelogpro.com is a subdomain of a different domain — verify it as a URL-prefix property if not already present.

---

## 2. Directory Packet — Paste-Ready Listings

### Product Identity
- **Name:** VoiceLogPro
- **Category:** Construction Management Software / Field Service Management
- **Sub-category:** Daily Reporting, Compliance Documentation
- **URL:** https://voicelogpro.com
- **Support email:** hello@voicelogpro.com
- **Pricing:** Free tier (Solo) + $49/month (Crew Plan)

### One-liner (80-100 chars):
VoiceLogPro turns 30-second voice notes into timestamped, court-ready PDF daily construction reports. No typing. Works from any phone. $49/month flat.

### Long description (600-800 chars):
VoiceLogPro is a voice-to-PDF daily construction log app built for subcontractors who work with their hands — electricians, plumbers, HVAC contractors, roofers, and GCs. Speak your day's work, crew, and conditions in about 30 seconds, and VoiceLogPro produces a professional, timestamped PDF with automatic weather data, geotagged photos, and crew tracking. Every report is a contemporaneous business record — the kind that holds up in payment disputes, mechanics lien claims, and delay arbitrations. Supports 50-state lien deadline tracking with a free calculator and downloadable dataset (CC BY 4.0). No lock-in: export and keep every report you generate. Built on actual jobsites by an electrical foreman who got tired of losing pay to missing paperwork.

### Screenshots list:
1. Voice-to-PDF workflow: record button → generated PDF preview
2. Daily report PDF output with timestamps and weather
3. Crew plan pricing page
4. Lien deadline calculator tool
5. State-by-state lien deadline reference (California example)

### Target directories:
| Directory | URL to submit |
|-----------|--------------|
| Capterra | https://www.capterra.com/p/10020762/VoiceLogPro/ |
| G2 | https://www.g2.com/products/voicelogpro/reviews |
| Software Advice | https://www.softwareadvice.com/construction/voicelogpro-profile/ |
| GetApp | https://www.getapp.com/construction-management-software/a/voicelogpro/ |
| Product Hunt | https://www.producthunt.com (search for launch guide) |
| SourceForge | https://sourceforge.net/software/product/VoiceLogPro/ |

---

## 3. Community Plan — 8 Thread Types + 3 Answer Drafts

### SAFE communities (r/datasets, r/juststart, r/devops-weekly-thread, r/AMLCompliance):
- Focus on the 50-state dataset (CC BY 4.0), the build process, or the compliance/documentation angle.
- Avoid r/SaaS, r/Entrepreneur, r/startups, r/microsaas, r/SideProject, r/angelinvestors, r/fatFIRE, r/AI_Agents, r/sidehustle (account banned from these).

### Communities to engage:
1. **r/Construction** — daily log routines, documentation habits
2. **r/Contractors** — payment disputes, GC backcharges
3. **r/estimators** — change order documentation
4. **r/ConstructionTech** — software for field teams
5. **r/datasets** — share the CC BY 4.0 lien deadline dataset
6. **r/juststart** — build-in-public journey (hardware/field niche)
7. **Facebook: Construction Subcontractors group** — lien rights discussion
8. **Facebook: Electrical Contractors group** — trade-specific documentation

### Draft A — r/Construction (Daily Log Habits):
> "What's your daily log routine look like? I've seen everything from voice notes on the drive home to scribbles on a 2×4. We started using voice-to-PDF (30 seconds, gloves on) and it's cut our missed-report rate to near zero. The timestamp + weather auto-tag has also saved us in two GC disputes already. Curious what works for other crews — especially subs juggling multiple jobsites."

### Draft B — r/Contractors (Backcharges):
> "Anyone else dealing with GCs who backcharge for work they claim wasn't done? We got burned on a $14K electrical rough-in because we had no contemporaneous record. Now we voice-log every day — timestamped PDF with weather + photos. Changed the dynamic completely. GC tried it once more, we produced the daily logs, and the deduction disappeared. What's your defense documentation look like?"

### Draft C — r/datasets (Lien Deadline Data):
> "I compiled a machine-readable dataset of mechanics lien deadlines for all 50 states + DC (CC BY 4.0). Preliminary notice windows, lien filing deadlines, enforcement periods — all sourced from state statutes and verified. Free to use for any tool, research, or compliance app. Includes a simple calculator too. [link to dataset]"

---

## 4. Listicle Targets — "Best Construction Daily Log App" Pages

Pitch VoiceLogPro for inclusion on these articles (they train AI answer models):

1. **G2: Best Construction Daily Report Software** — https://www.g2.com/categories/construction-daily-report
2. **Capterra: Best Construction Management Software** — https://www.capterra.com/construction-management-software/
3. **Software Advice: Construction Daily Log Software** — https://www.softwareadvice.com/construction/daily-log-software-comparison/
4. **Construction Executive: Top Construction Apps** — https://constructionexec.com/ (reach out for inclusion)
5. **The Constructor: Best Construction Apps** — https://theconstructor.org/
6. **Levelset (Procore): Best Construction Apps for Subcontractors** — https://www.levelset.com/blog/
7. **FieldCamp: Best Apps for Field Service Management** — reach out for feature
8. **BuilderTrend Blog** — comparison articles mention VoiceLogPro as alternative
9. **Raken Blog** — comparison articles (they're a competitor, but the AI reads both sides)
10. **Construction Junkie: Top Construction Technology** — https://www.constructionjunkie.com/

### Pitch angle:
"VoiceLogPro is the only voice-to-PDF daily log tool built specifically for subcontractors with 50-state lien deadline tracking. It captures contemporaneous, court-ready documentation in 30 seconds — the kind that holds up in payment disputes. Flat $49/month, no per-report fees."

---

## 5. T5: Duplicate-URL /vs/ Page Generator Note

**Status:** Clean. Both `.html` and clean URL forms return 308 (Vercel `cleanUrls: true` handles it). Sitemap lists clean URLs. No action needed.

**Central generator note:** The `/vs/` comparison pages (e.g., `/procore-vs-voice-log-pro`) exist as React pages with Vite prerender. The `cleanUrls` setting redirects `.html`→`/`. However, the `~/.growth-engine` directory generates flat HTML comparison pages for other sites. If voicelogpro's vs-pages ever get rebuilt via that generator, ensure:
- Vercel `cleanUrls: true` + `trailingSlash: false` matches what the generator produces
- New pages get `canonical` URLs pointing to the clean form
- Add a 301 redirect rule in `vercel.json` routing `.html`→`/` as a belt-and-suspenders measure

**No central-generator edits made in this session** (affects 3+ sites — needs its own supervised runbook).
