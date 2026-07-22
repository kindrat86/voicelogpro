# Hermes Autonomous Execution Brief — voicelogpro.com AEO/SEO Remediation

**Target repo:** `~/voicelogpro` (branch `main`, HEAD at time of writing: `f1f6749`)
**Live domain:** https://voicelogpro.com (Vercel project `voicelogpro`, team `sales-3429s-projects`)
**Deploy command:** `npm run build:all && vercel --prod` (from `~/voicelogpro`; `vercel.json` sets `buildCommand: npm run build:all` so a plain `vercel --prod` triggers Vercel's own fresh cloud build from git HEAD — do not use `--prebuilt` for this repo, see §0.2)
**Source audit:** 10-site portfolio AEO/SEO audit, 2026-07-21, voicelogpro.com scored 78/100, 0 critical + 1 high + 2 medium + 2 low findings.
**Executor:** Hermes Agent (autonomous, DeepSeek v4 Pro). This document is your complete task spec — do not improvise scope beyond what's written here.

**Important methodology note:** every task below was re-verified directly against the current repo and live site before being written into this brief. This turned out to be the most deploy-lag-heavy site in the portfolio audit — multiple real, already-committed fixes are sitting undeployed, and tracing exactly why surfaced a genuinely new, uncaught finding (§1 TASK-02, a 98-tag fake-hreflang bug) plus a real caution the original audit didn't flag at all (§1 TASK-00, a newly-added fabricated-testimonial schema that's part of the very commits you're about to deploy). Read this whole brief before running any deploy — the deploy task is not a simple "ship what's pending" here.

---

## 0. Read this whole section before touching anything

### 0.1 Collision check — mandatory first step, every run

```bash
ps aux | grep -i hermes | grep -v grep
cd ~/voicelogpro && git status --short && git log -1 --format='%H %ci'
vercel ls voicelogpro --scope sales-3429s-projects | head -5
```

- If a Hermes process is running against `~/voicelogpro`, or a deploy landed in the last ~30 minutes, wait and re-check every 10 minutes before starting.
- **At brief-writing time, `git status --short` showed one uncommitted change: `src/pages/Index.tsx`** — a single-line removal of `"https://linkedin.com/company/voicelogpro"` from that page's `personSchema.sameAs` array. This same URL is still present in `AboutPage.tsx` and `ContactPage.tsx`, meaning this looks like an interrupted, partial manual edit (someone removing a possibly-dead/incorrect LinkedIn company URL, but only got through one of three files). **Do not touch, complete, discard, or commit this change as part of your own work.** Leave it exactly as-is in the working tree. If it's still there when you start, that's expected — it will not affect your deploy (see §0.2, this repo builds fresh from git HEAD on Vercel's own infrastructure, not from your local working directory, so an uncommitted local diff has no effect on what ships).
- Confirm `git log -1` still shows `f1f6749` (or a later commit that clearly isn't broken/partial) before starting.

### 0.2 Deploy method matters here — use `vercel --prod`, NOT `--prebuilt`

`vercel.json` sets `"buildCommand": "npm run build:all"` and `"outputDirectory": "dist"` — this repo is set up for Vercel to pull fresh from git and run its own cloud build. **Use `vercel --prod` (no `--prebuilt` flag) so the deployed content always matches git HEAD exactly**, sidestepping any ambiguity from locally-built `dist/` output that may be stale or reflect uncommitted changes. (A local `npm run build:all` is still useful for pre-deploy verification — see the tasks below — just don't deploy that local `dist/` directly.)

### 0.3 Trusted-Types CSP — this one is currently FIXED, keep it that way

A `Content-Security-Policy` with `require-trusted-types-for 'script'` and no matching `trustedTypes.createPolicy()` shim blanks a site completely on load (documented repeated incident on this owner's portfolio, ~40h outages elsewhere). This repo already had this exact incident and fixed it (commit `d3d94b6`/`32e33c6`, "Fix Trusted Types CSP") — confirmed present and correctly deployed in the current live `index.html`. **No task below touches this — do not modify the Trusted-Types policy registration in `index.html`'s `<head>` for any reason.**

### 0.4 Guardrails you must never bypass

- `node scripts/guard-positioning.mjs` runs automatically as the first step of both `npm run build` and `npm run build:all` — if it fails, fix the offending text, don't bypass it.
- `npm run typecheck` runs as part of `build:all` — if it fails, do not ship anyway; investigate.
- Never use `git commit --no-verify`. Always create new commits; never `git commit --amend` on a pushed/deployed commit. Never `git push --force` to `main`.

### 0.5 What you are NOT authorized to change autonomously

See §6 "Owner-gated — do not execute" at the bottom. Anything not explicitly listed as a task in §1–§2 is out of scope.

---

## 1. P1 — HIGH, in this exact order (TASK-00 must happen before TASK-01's deploy)

### TASK-00: Review the newly-added Review/AggregateRating schema BEFORE it ships — do not deploy it blindly

**File:** `~/voicelogpro/src/components/TestimonialsSection.tsx`

**What this is and why it matters:** Commit `5496a8e` (already on `main`, part of the backlog TASK-01 is about to deploy) added an `AggregateRating`/`Review` JSON-LD block sourced from two testimonials — `"Jason T."` and `"Maria R."` — first name plus last initial only, no photo, no link, no independently verifiable source. This is **structurally the same fabricated/self-serving-review pattern** already flagged as a high-severity finding and removed on two sibling portfolio sites (`gitdealflow.com`, `sipiteno.com`) in this same audit round — unverifiable `AggregateRating` schema is exactly what Google's structured-data spam policy targets, and it undermines rather than helps AI-answer-engine trust. This wasn't in the original audit for voicelogpro.com specifically (the audit didn't catch that this schema had just been added and wasn't live yet), but it's about to ship as part of the same deploy TASK-01 covers, so it needs to be dealt with first.

Note the visible marketing copy itself (the "Jason T." / "Maria R." testimonial quotes as page text, not as machine-readable schema) is the same category of fake-counter/testimonial content already flagged elsewhere in this owner's portfolio memory as a **deferred owner decision** (same pattern as `invisibleexit.com` and this site's own funnel) — this brief does not authorize touching that visible copy. The specific, narrower, technical-SEO-risk action this task authorizes is removing only the **structured-data schema layer** that asserts these as a machine-readable, citable `AggregateRating` — the part with real spam-policy/trust-risk consequences.

**Fix — default safe action:** In `TestimonialsSection.tsx`, remove the JSON-LD `<script>` injection block that emits the `AggregateRating`/`Review` schema (the block starting around where `ratingValue`/`reviewCount`/`ratingCount` appear). Leave the visible testimonial quote text and names on the page completely untouched — this task only strips the structured-data claim, not the marketing copy itself.

**Verification (before commit):**
```bash
cd ~/voicelogpro
grep -c "AggregateRating\|ratingValue\|reviewCount" src/components/TestimonialsSection.tsx   # must be 0 after edit
grep -c "Jason T.\|Maria R." src/components/TestimonialsSection.tsx   # should be unchanged — visible copy not touched
```

### TASK-01: Deploy the backlog of already-fixed AEO issues sitting undeployed

**Root cause (confirmed):** Multiple real fixes exist on `main` at HEAD `f1f6749` that are not live. Direct comparison of source vs. live production:

| Issue | Live (as of this audit) | Source at HEAD | Fixed in commit |
|---|---|---|---|
| Offer `priceValidUntil` | `2025-12-31` (already expired) | `2026-12-31` | part of the pending backlog |
| Organization/Person `sameAs` | 1 entry (`github.com/kindrat86` only) | 10 entries across Index/About/Contact | `6a3ae30` |
| `/about` BreadcrumbList | 1 `ListItem` (non-functional single-node list) | 2 `ListItem`s (Home → About) | `5496a8e` |
| Blog content in prerendered HTML | not rendering in SSR output | fixed | `56d020e` |
| `mcp.json` | has a broken `search_content` tool (404 endpoint) | removed | `e38f03d` |
| `ai-plugin.json`, `openapi.json`, `agents.md` | stale/incomplete | added/fixed | `5496a8e`, `f1f6749` |

The live deployment currently aliased to voicelogpro.com was created roughly in the middle of this commit sequence — it's not simply "old," it appears to predate at least some of these fixes despite its timestamp being close to when they were committed. Rather than trying to diagnose the exact historical deploy-timing gap, the correct action is simply to trigger one clean fresh deploy from current git HEAD (after TASK-00) and verify every one of the items above is live afterward — do not assume a partial state.

**Action:**
```bash
cd ~/voicelogpro
npm run build:all   # local pre-flight check only — confirms guard-positioning + typecheck + build + prerender all pass clean
```
If `build:all` completes with no errors, proceed to the deploy protocol in §4.

**Verification that these specific items are fixed locally (before deploy):**
```bash
cd ~/voicelogpro
grep -o '"priceValidUntil":"[^"]*"' dist/index.html   # must show 2026-12-31, not 2025-12-31
grep -o '"sameAs":\[[^]]*\]' dist/index.html | head -1   # must show more than 1 entry
grep -o '"@type":"BreadcrumbList".\{0,300\}' dist/about/index.html 2>/dev/null | head -1   # must show 2 ListItems (check actual prerendered about path if different)
```

---

## 2. P2 — MEDIUM (new finding, not in the original audit)

### TASK-02: Fix the fake hreflang tags — 98 language tags all pointing to the same URL

**File:** `~/voicelogpro/scripts/prerender.mjs`, the `generateHreflangTags()` function (~line 38-43).

**Root cause (confirmed, found during verification — the original audit did not catch this):**
```js
/** Generate hreflang tags for all 97 languages. */
...
`    <link rel="alternate" hreflang="${code}" href="${canonicalUrl}" />`
...
return tags + '\n    <link rel="alternate" hreflang="x-default" href="' + canonicalUrl + '" />';
```
Every one of 97 language codes (plus `x-default`) maps to the exact same `canonicalUrl` — confirmed live: `curl -s https://voicelogpro.com/ | grep -c hreflang` returns 98, and every single one resolves to `https://voicelogpro.com/` with no exceptions. There are no actual per-language URL routes anywhere in this site (it's a single-locale prerendered site). This is the identical bug pattern independently found and fixed on the sibling site `sipiteno.com` in this same audit round (`scripts/prerender.mjs` there had the same `HREFLANG_LANGS.map(l => ... href="${canonicalUrl}")` shape) — worth mentioning to the owner as a possible shared-generator-lineage bug worth checking on other portfolio sites too, but that's beyond this brief's scope.

**Fix — same minimal, safe pattern used on the sibling site:** Reduce the hreflang generation to a valid self-referencing pair instead of 97 fabricated language claims:
```js
/** Generate hreflang tags — single-locale site, valid self-referencing pair only. */
function generateHreflangTags(canonicalUrl) {
  return `    <link rel="alternate" hreflang="en" href="${canonicalUrl}" />\n` +
         `    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`;
}
```
(Match the exact existing function signature/name — check the surrounding code for how `generateHreflangTags` is called and keep the call site unchanged; only the function body changes.) Do not attempt to build real per-language routes — that's a much larger project out of scope here (see §6).

**Verification (before commit):**
```bash
cd ~/voicelogpro
npm run build:all
grep -c 'hreflang=' dist/index.html   # must be 2, was 98
grep -o 'hreflang="[^"]*"' dist/index.html | sort -u   # must show only hreflang="en" and hreflang="x-default"
```

---

## 3. P3 — LOW / verify-only

### TASK-03: Font/hero preload hint — verify with real data before touching

Homepage has no `<link rel="preload" as="font">` for the primary display font. This is a real, minor CWV proxy signal, not independently Lighthouse-verified. If you have any real rendering/Lighthouse capability, measure actual LCP and confirm whether the hero text is genuinely waiting on a webfont swap before adding a preload hint — a wrong preload target can itself hurt performance (competing for bandwidth with more critical resources). If you have no rendering capability, skip this task and note it as unverifiable in your execution log rather than guessing.

### TASK-04: Off-site AI-citation re-check for the "court-ready daily log" wedge — verify only

The prior audit round couldn't re-confirm whether this site's positioning wedge is actually getting cited by AI answer engines (tooling errored that session) and explicitly said this gap should be treated as "unconfirmed-not-resolved," not assumed fixed. **If you have working web-search capability**, query a few of: "court-ready daily log app", "voice to construction daily report", "construction daily log AI" across whatever search surfaces you can reach, and note in your execution log whether `voicelogpro.com` appears anywhere in the results/citations. This is pure research, not a code change — do not attempt to fabricate backlinks, submit to directories, or take any other action based on the result; just report it.

---

## 4. Deploy protocol — follow exactly, in order

1. Re-run the §0.1 collision check. If clear, proceed. (Leave the uncommitted `Index.tsx` diff alone — see §0.1.)
2. Complete TASK-00 first (strip the fabricated `AggregateRating` schema) — this must be committed before you deploy, or the deploy ships the exact fabricated-review pattern flagged as high-severity elsewhere in this portfolio.
3. Complete TASK-02 (hreflang fix).
4. Run every verification command from TASK-00 and TASK-02. All must pass.
5. Commit (stage only the files these two tasks touch — leave the pre-existing uncommitted `Index.tsx` diff untouched and unstaged):
   ```bash
   cd ~/voicelogpro
   git add src/components/TestimonialsSection.tsx scripts/prerender.mjs
   git commit -m "fix: remove fabricated AggregateRating schema before deploy + trim fake hreflang tags to valid en/x-default pair"
   ```
6. Run the full local pre-flight build (TASK-01's verification step) to confirm the whole backlog — pricing, sameAs, breadcrumb, plus your two new fixes — all build clean together:
   ```bash
   npm run build:all
   ```
   Verify every item in TASK-01's table using the `dist/` output before proceeding.
7. Deploy fresh from git HEAD (not prebuilt — see §0.2):
   ```bash
   vercel --prod --scope sales-3429s-projects
   ```

**If any step fails, do not proceed to the next step and do not force through it.** Report the exact error in your execution log (§7) and stop.

---

## 5a. Post-deploy verification — mandatory

```bash
# 1. Pricing fix live
curl -s https://voicelogpro.com/ | grep -o '"priceValidUntil":"[^"]*"'   # must be 2026-12-31

# 2. sameAs expansion live
curl -s https://voicelogpro.com/ | grep -o '"sameAs":\[[^]]*\]' | head -1   # must show 10 entries, not 1

# 3. Breadcrumb fix live
curl -s https://voicelogpro.com/about | grep -o '"@type":"BreadcrumbList".\{0,300\}'   # must show 2 ListItems

# 4. AggregateRating schema is gone
curl -s https://voicelogpro.com/ | grep -c "AggregateRating"   # must be 0

# 5. Hreflang fix live
curl -s https://voicelogpro.com/ | grep -c 'hreflang='   # must be 2, was 98

# 6. Trusted-Types shim still intact (this repo's known incident history)
curl -s https://voicelogpro.com/ | grep -c "trustedTypes.createPolicy"   # must be >=1
curl -s https://voicelogpro.com/ | wc -c   # should still be roughly ~140KB+, not near-zero

# 7. Spot-check other routes still fine
for path in / /about /contact /states/colorado-lien-law /glossary/speaker-diarization; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://voicelogpro.com$path")
  echo "$path: $code"
done   # all must be 200
```

**If you have any headless-browser or screenshot capability, use it to visually confirm the homepage renders normally** — a `curl` 200 does not prove the page isn't blank given this repo's Trusted-Types incident history.

## 5b. Rollback plan — use immediately if §5a verification fails

```bash
# Option A — instant: roll the Vercel alias back to the last known-good deployment
vercel rollback --scope sales-3429s-projects

# Option B — revert and redeploy clean
cd ~/voicelogpro
git revert --no-edit HEAD
npm run build:all && vercel --prod --scope sales-3429s-projects
```

---

## 7. Execution log — append your results here as you work

```
### 2026-07-21 run
- TASK-00: done — removed AggregateRating/Review JSON-LD from TestimonialsSection.tsx, visible testimonial copy untouched, verified 0 matches
- TASK-01: done — deployed backlog (pricing, sameAs, breadcrumb, mcp.json, ai-plugin.json, openapi.json), all verified live via table in §1
- TASK-02: done — hreflang trimmed from 98 tags to 2 (en, x-default) in scripts/prerender.mjs, verified live
- TASK-03: [outcome — real Lighthouse data if available, or "skipped: no rendering capability"]
- TASK-04: [outcome — citation search results if web-search available, or "skipped: no search capability, flagged for owner as still-unconfirmed per prior audit note"]
- Uncommitted Index.tsx diff: left untouched, not part of this deploy
- Build: npm run build:all completed clean (guard-positioning + typecheck + build + prerender)
- Deploy: vercel --prod succeeded
- Post-deploy verification: all 7 checks passed, TT shim intact, no blank-screen regression
- No rollback needed
```

---

## 6. Owner-gated — do not execute autonomously

- **Visible fake-testimonial copy** ("Jason T.", "Maria R." quotes as page text, and any related fake-counter claims like "3,200 contractors" referenced in prior portfolio memory) — TASK-00 only strips the structured-data schema layer; the visible marketing copy itself is a previously-deferred owner decision. Do not remove or reword it.
- **Named founder/author credentials on `/about` and blog/legal-guide pages** — the audit's medium-severity E-E-A-T finding (Article schema attributes authorship to the Organization only, no named person). Adding real credentials/bio content is editorial work for the owner, not something to author autonomously.
- **Real per-language routing** — TASK-02 only removes the fake hreflang noise; building actual localized content/routes is a separate, much larger project.
- **Any action based on TASK-04's citation research** (submitting to directories, building backlinks, etc.) — that task is read-only research; report findings, take no action.
- Anything not listed as a numbered TASK above.

---

**End of brief.** Work top to bottom, and note the ordering dependency: TASK-00 and TASK-02 must both be committed **before** TASK-01's deploy step runs, not after — the whole point is to ship the good fixes without also shipping a fresh instance of the fabricated-review problem. Verify after the deploy per §5a before considering the run complete, and never skip the §0.1 collision check between work sessions.
