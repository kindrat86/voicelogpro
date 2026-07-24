# HERMES TASK — voicelogpro.com Conversion Repair

**Target site:** voicelogpro.com
**Repo:** `~/voicelogpro` — Vite + React SPA (TypeScript), branch **`lien-deadline-engine`**
**Vercel project:** verify `.vercel/project.json` before deploying (Section 1.3)
**Authored:** 2026-07-22
**Executor:** Hermes Agent (DeepSeek v4 Pro), autonomous
**Real data (90 days):** 224 pageviews · 193 visitors · 218 sessions · **98.2% bounce**

**Objective:** This site sells **legal-defense documentation to contractors** and currently carries **two fabricated customers with fabricated photos and a fabricated $22,000 savings claim**, while displaying prices that **cannot be paid** — there is no checkout anywhere in the repository. Remove the fabrications first. Everything else is secondary.

---

## 0. READ THIS FIRST — SIX HARD RULES

### RULE 1 — THE TESTIMONIALS ARE FABRICATED. THIS IS THE TASK.

`src/components/TestimonialsSection.tsx` ships two named customers with portrait photos, specific financial outcomes, and a claimed audio recording:

- **"Jason T., Electrical Foreman, Dallas TX"** — *"Had a GC try to blame us for a weather delay on a $340K data-center job… That one log saved us **$22,000**."* — with `hasAudio: true, audioDuration: "18s"` and a portrait at `public/images/testimonial-jason.webp` (36 KB, on disk).
- **"Maria R., Plumbing Lead, Houston TX"** — *"…VoiceLogPro cut that to 8 minutes… **I've been a beta user for 2 months — zero logs lost.**"* — portrait at `public/images/testimonial-maria.webp` (38 KB, on disk).

**The proof they are fabricated is in your own repo.** The product's demo is labelled, by the site itself:

> `src/components/InteractiveVoiceDemo.tsx:391` — **"Beta Demo — Simulated output, not actual transcription"**

A person cannot have been *"a beta user for 2 months"* of a product that produces **only simulated output**. There cannot be a real $22,000 lien-dispute save from a tool that does not yet transcribe.

This is a site selling **evidence for legal disputes** to a skeptical trade audience. Invented customers, invented photographs, an invented audio testimonial and an invented dollar figure are a fraud exposure, not a copy problem. **Removing them is the first and most important action in this task.**

### RULE 2 — NEVER FABRICATE A REPLACEMENT, AND NEVER SOFTEN INSTEAD OF REMOVING
Do not rewrite "Jason T." into "a foreman in Texas". Do not relabel invented quotes as "illustrative". Do not invent smaller numbers. **Delete.** A site with no testimonials is honest; a site with disguised fabrications is worse than one with obvious ones.

### RULE 3 — THIS SITE MAKES LEGAL CLAIMS. TREAT THEM AS LOAD-BEARING.
The site maps product features to **Texas Property Code Chapter 53**, **Virginia / AIA A401**, and the **UK Building Safety Act**, and the build generates a **50-state lien-deadline dataset** (`scripts/build-lien-dataset.mjs`, `generate-lien-state-pages.mjs`, `generate-lien-calculator.mjs`).

Carry forward the legal-integrity discipline already established for this repo in `HERMES_TASK_LIEN_DEADLINE_ENGINE.md`: **verbatim only, omit-don't-guess, attorney disclaimer preserved.** You may **not** write, reword, reinterpret, or "clarify" any statutory deadline, code citation, or compliance claim. If a legal claim looks wrong, **record it for the owner** — do not edit it.

### RULE 4 — THERE IS NO CHECKOUT. DO NOT BUILD ONE.
```bash
grep -rn "buy.stripe.com\|checkout.stripe" --include="*.tsx" --include="*.ts" --include="*.html" . | grep -v node_modules | wc -l
# returns 0 — verified 2026-07-22
```
The site displays **$49/mo Crew Plan** and **$470/yr Pro Annual** but nothing is purchasable by any mechanism. Your job is to make the **labels honest** (Step 3.3), **not** to create a payment flow. Never invent a Stripe link, price ID, or checkout route.

### RULE 5 — 29 LANGUAGE FILES CARRY THIS COPY
```
src/i18n/en.ts + src/i18n/locales/{ar,bn,cs,da,de,el,es,fa,fi,fr,gu,hi,hu,id,it,ja,mr,nl,no,pl,pt,ro,sv,te,th,tr,uk,zh-CN}.ts
```
A testimonial removed from `en.ts` alone remains live in **28 other languages**. Every content change must be applied across all 29 files or explicitly recorded as skipped.

### RULE 6 — SCOPE, BRANCH, UNTRACKED FILES
Branch is `lien-deadline-engine` (an in-flight task). The tree carries two untracked runbooks: `HERMES_TASKS_VOICELOGPRO_AEO.md`, `HERMES_TASK_LIEN_DEADLINE_ENGINE.md`. **Stage by explicit path only. Never `git add -A`.** Do not modify anything under `scripts/*lien*`.

---

## 1. PRE-FLIGHT (abort conditions)

```bash
cd ~/voicelogpro
```

**1.1 — Branch, tree, rollback point.**
```bash
git branch --show-current   # expect: lien-deadline-engine
git status --short          # expect: ONLY the 2 untracked HERMES_*.md
git rev-parse HEAD          # RECORD — rollback target
```
**ABORT** if `src/` has uncommitted edits — the lien-deadline task may be mid-flight.

**1.2 — Another agent active?**
```bash
ps aux | grep -i hermes | grep -v grep
```
**ABORT** if anything references `voicelogpro` or a `vercel` deploy in flight.

**1.3 — Deploy binding + author.**
```bash
cat .vercel/project.json     # RECORD projectName and any rootDirectory
git config user.email        # MUST be sales@sipiteno.com
```

**1.4 — Reproduce the before-state.**
```bash
curl -s https://voicelogpro.com/ | grep -c "Jason T\|Maria R"      # expect > 0 (the bug)
curl -s https://voicelogpro.com/ | grep -c "22,000"                # expect > 0
curl -sI https://voicelogpro.com/pricing | grep -iE "^HTTP|^location"  # expect 308 -> /crew-plan
```

**1.5 — Baseline green build + typecheck.**
```bash
npm run typecheck
npm run build
```
**ABORT** if either fails on a clean tree. Note: `build` runs `guard-positioning` first and then generates the lien dataset, state pages and calculator — all must pass.

---

## 2. THE DIAGNOSIS

### 2.1 — P0: Fabricated customers (see RULE 1)

| Artifact | Location |
|---|---|
| Quote data, names, roles, $22,000 claim | `src/components/TestimonialsSection.tsx:9-24` |
| Translated copies | `src/i18n/en.ts:178-182` + all 28 `src/i18n/locales/*.ts` (`jasonName`, `jasonRole`, `mariaName`, `mariaRole`, and their quote keys) |
| Portrait images | `public/images/testimonial-jason.webp`, `public/images/testimonial-maria.webp` |
| Claimed audio testimonial | `hasAudio: true, audioDuration: "18s"` on the Jason entry — locate any audio asset it references |

Contradicted by the site's own `InteractiveVoiceDemo.tsx:391` — *"Simulated output, not actual transcription"*.

### 2.2 — P0: CTAs promise a purchase that cannot happen

Every CTA (`GET CREW ACCESS`, `Join Beta Free`, `RESERVE MY BETA SPOT`) is **JS-only with no `href`**; clicking scrolls to a plain email-capture form. Prices are displayed ($49/mo, $470/yr) with **zero** checkout in the repo (RULE 4). A visitor who clicks "GET CREW ACCESS" expecting to buy discovers there is nothing to buy — a trust break precisely at the moment of highest intent.

### 2.3 — P1: Unverifiable scarcity

`src/components/LimitedBetaSection.tsx:16` and `src/i18n/en.ts:261` — **"Only 3 Beta Slots Left"**, plus *"next batch in ~30 days"*. Against **193 visitors in 90 days** (~2/day) this is not credible, and contractors are skeptical buyers. It is a static string, not a live counter.

### 2.4 — P1: Two different offers on two pages

The homepage shows a **4-rung** ladder (Free Kit / Solo Beta $0 / Crew Plan $49mo / Pro Annual $470yr). `/crew-plan` shows **2 tiers** (Solo Beta $0, Crew Plan $49/mo) — the Pro Annual tier appears on one page and not the other.

`/pricing` returns **308 (permanent)** → `/crew-plan`. Note it is *permanent*: hard-cached by browsers and CDNs, and painful to reverse.

### 2.5 — P2: IA fragmentation and an offline banner

A large pSEO mega-nav/footer (alternatives-to Otter.ai/Rev/Descript, 50-state lien guides, trade templates, lien-deadline calculator) sits on the transactional pages, competing with the conversion goal. A transient *"You are offline"* banner also appeared during navigation — the same PWA symptom seen on sister sites.

### 2.6 — Things that are RIGHT — do not "fix" them

- **The "Simulated output, not actual transcription" disclaimer is honest and correct.** Keep it. Do not soften or remove it — it is the site's most important truthful statement.
- The founder's **$40K-loss origin story** is a genuine damaging-admission asset.
- The **lien-deadline dataset / calculator** is real, sourced work. Do not touch it.

---

## 3. EXECUTION

Work in order. Each step has a gate. A failed gate → revert **that step only**, record it, continue.

### STEP 3.1 — Delete the fabricated testimonials (FIRST — this is the liability)

**3.1a — Remove the component's data and its render.**
In `src/components/TestimonialsSection.tsx`, remove both entries from the `testimonials` array. With the array empty the section renders an empty shell — so **also remove the section's call sites**:
```bash
grep -rn "TestimonialsSection" --include="*.tsx" src/ | grep -v "components/TestimonialsSection"
```
Remove the import and the `<TestimonialsSection />` usage from each page that renders it. Prefer deleting `src/components/TestimonialsSection.tsx` entirely once no call sites remain.

**3.1b — Remove the translated copies from all 29 i18n files.**
```bash
grep -rn "jasonName\|jasonRole\|jasonQuote\|mariaName\|mariaRole\|mariaQuote" src/i18n/ | wc -l
```
Delete those keys from `src/i18n/en.ts` **and every** `src/i18n/locales/*.ts`. If a file uses a shared `template.ts` shape that requires the keys, set them to `""` and ensure nothing renders on empty — never leave a name visible.

**3.1c — Delete the fabricated portrait assets.**
```bash
git rm public/images/testimonial-jason.webp public/images/testimonial-maria.webp
```

**3.1d — Find and remove any audio asset behind `hasAudio: true`.**
```bash
grep -rn "hasAudio\|audioDuration" --include="*.tsx" --include="*.ts" src/ | head
find public -iname "*.mp3" -o -iname "*.wav" -o -iname "*.m4a" -o -iname "*.ogg" 2>/dev/null | head
```
If an audio file exists purporting to be "Jason T.", **delete it** and remove the playback UI. A synthetic voice presented as a real customer is the most serious artifact in this repo.

**Gate 3.1 — all must pass:**
```bash
grep -rn "Jason T\|Maria R\|22,000\|340K data-center" --include="*.tsx" --include="*.ts" src/   # MUST be empty
grep -rn "jasonName\|mariaName" src/i18n/                                                        # MUST be empty
ls public/images/testimonial-*.webp 2>&1 | grep -c "No such file"                                # MUST be 2
grep -c "Simulated output" src/components/InteractiveVoiceDemo.tsx                                # MUST still be 1 (disclaimer preserved)
npm run typecheck
```

---

### STEP 3.2 — Remove the unverifiable scarcity

`src/components/LimitedBetaSection.tsx:16` and the `badge` key in `src/i18n/en.ts:261` + all 28 locales.

Replace **"Only 3 Beta Slots Left"** with an honest statement carrying no invented count — e.g. *"Private beta — limited places"* — or remove the badge entirely. Also remove *"next batch in ~30 days"* unless a real batch schedule exists in the repo. **Do not add a counter** (with ~0 users it would read "0 claimed", which is worse).

**Gate 3.2:**
```bash
grep -rn "3 Beta Slots\|Only 3\|slots left" --include="*.tsx" --include="*.ts" src/   # MUST be empty (case-insensitive check too)
npm run typecheck
```

---

### STEP 3.3 — Make every CTA label match what actually happens

No checkout exists (RULE 4). Every button that implies purchase must state what it really does — join a waitlist / reserve a beta place.

- `GET CREW ACCESS` → **"Reserve a Crew Plan place"** (or "Join the Crew Plan waitlist")
- `Join Beta Free` → **"Join the free beta waitlist"**
- `RESERVE MY BETA SPOT` → acceptable already; keep consistent wording across all instances.

Alongside each displayed price, state the truth plainly — e.g. *"$49/mo when the Crew Plan launches. Nothing to pay today."* Apply across all 29 i18n files.

**Do not** create a payment flow, Stripe link, or price ID.

**Gate 3.3:**
```bash
grep -rn "buy.stripe.com\|checkout.stripe" --include="*.tsx" --include="*.ts" . | grep -v node_modules | wc -l   # MUST still be 0
grep -rniE "get crew access" --include="*.tsx" --include="*.ts" src/   # MUST be empty
npm run typecheck
```

---

### STEP 3.4 — Reconcile the two offers

Make the homepage ladder and `/crew-plan` present the **same** tiers. Preferred: drop **Pro Annual $470/yr** from the homepage until it is real and purchasable — it is the tier that exists on only one page and cannot be bought.

Leave the `/pricing` → `/crew-plan` **308** alone unless you build a genuine `/pricing` page. It already lands on the product's own plan (unlike sister sites), so it is not broken — merely permanent. **Do not** change it to a 307 or repoint it without a destination that genuinely lists the offer.

**Gate 3.4:** homepage and `/crew-plan` list identical tiers; `npm run build` passes.

---

### STEP 3.5 — One primary CTA in the hero

Keep **"GET THE FREE DEFENSE KIT"** as the single primary ask. Demote the competing *"see the paid Crew Plan"* hero link to a secondary text link lower on the page. Remove duplicate `RESERVE MY BETA SPOT` repeats from the first viewport.

Optionally move the founder's **$40K-loss origin story** to immediately after the hero — it is the page's strongest genuine trust asset and currently sits far below the ask.

**Gate 3.5:** exactly one primary-styled button in the hero; `npm run build` passes.

---

### STEP 3.6 — Offline banner (investigate; skip if unclear)

```bash
grep -rn "offline\|navigator.onLine\|serviceWorker" --include="*.tsx" --include="*.ts" src/ public 2>/dev/null | head
```
Safe minimal fix: show the offline UI only when `navigator.onLine === false`, not on any failed fetch. **Do not** rewrite caching or unregister a service worker. If unclear, **skip and record**.

---

## 4. VALIDATION (before deploy)

```bash
cd ~/voicelogpro

# 4.1 Fabrications gone — in every language
grep -rn "Jason T\|Maria R\|22,000\|340K" --include="*.tsx" --include="*.ts" src/   # empty
grep -rn "jasonName\|mariaName\|jasonQuote\|mariaQuote" src/i18n/                    # empty
ls public/images/testimonial-* 2>&1 | grep -c "No such file"                        # 2

# 4.2 The honest disclaimer SURVIVED
grep -c "Simulated output" src/components/InteractiveVoiceDemo.tsx                   # MUST be 1

# 4.3 No checkout invented
grep -rn "buy.stripe.com\|checkout.stripe" --include="*.tsx" --include="*.ts" . | grep -v node_modules | wc -l   # 0

# 4.4 Legal content untouched (RULE 3)
git diff --name-only | grep -E "lien|scripts/" | wc -l     # MUST be 0

# 4.5 Types + FULL build (guard-positioning, prerender, lien dataset, state pages, calculator)
npm run typecheck
npm run build

# 4.6 Nothing unintended staged
git status --short   # HERMES_*.md must NOT be staged
```
**Do not deploy** unless `npm run build` completes all stages, including the lien-dataset generators.

---

## 5. COMMIT & DEPLOY

**5.1 — Stage explicitly (never `git add -A`).**
```bash
git add src/components/TestimonialsSection.tsx src/components/LimitedBetaSection.tsx \
        src/i18n/en.ts src/i18n/locales/
git rm --cached public/images/testimonial-jason.webp public/images/testimonial-maria.webp 2>/dev/null || true
# plus only the page/component files you actually changed
git status --short   # REVIEW: no scripts/, no lien files, no HERMES_*.md
```

**5.2 — Commit.**
```bash
git commit -m "fix(voicelogpro): remove fabricated testimonials and unpayable purchase language

The site shipped two named customers with portrait photos, a claimed audio
clip and a specific \$22,000 savings claim — while the product's own demo is
labelled 'Simulated output, not actual transcription'. A 2-month beta user of
a tool that does not yet transcribe cannot exist. On a product selling legal
dispute evidence to contractors this is a fraud exposure, not copy.

- Remove both testimonials, their translations across 29 locales, and their
  fabricated portrait assets
- Relabel purchase-implying CTAs as waitlist/reservation (no checkout exists)
- Remove the uncredible 'Only 3 Beta Slots Left' scarcity badge
- Reconcile the homepage ladder with /crew-plan
Lien dataset, legal content and the simulated-output disclaimer untouched."
```

**5.3 — Deploy.**
```bash
npx vercel build --prod
npx vercel deploy --prebuilt --prod --archive=tgz
```
`--archive=tgz` is required for this account's larger pSEO trees. Deploys go through the **CLI**, not git push.

**Known flake:** deploys stick on `UNKNOWN` roughly half the time. Wait 60s, re-run the identical command **once**. Two failures → stop and report.

---

## 6. POST-DEPLOY VERIFICATION

```bash
sleep 45

# 6.1 Fabrications gone from the served site
curl -s https://voicelogpro.com/ | grep -c "Jason T\|Maria R"   # MUST be 0
curl -s https://voicelogpro.com/ | grep -c "22,000"             # MUST be 0
curl -s -o /dev/null -w "%{http_code}\n" https://voicelogpro.com/images/testimonial-jason.webp   # MUST be 404

# 6.2 The honest disclaimer is still live
curl -s https://voicelogpro.com/ | grep -c "Simulated output"   # MUST be >= 1

# 6.3 Routes healthy
for u in / /crew-plan /pricing /lien-deadline-calculator; do
  printf "%-28s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' https://voicelogpro.com$u)"
done   # 200 (or 308 for /pricing)

# 6.4 Legal pages intact — spot-check two state lien pages
curl -s -o /dev/null -w "%{http_code}\n" https://voicelogpro.com/lien-deadlines/texas
```

**6.5 — Rendered check:** open the homepage in a fresh incognito window. Confirm no testimonial section renders as an empty shell or broken image, the demo still shows its "Simulated output" badge, and no console errors.

**Rollback:**
```bash
git revert --no-edit HEAD
npx vercel build --prod && npx vercel deploy --prebuilt --prod --archive=tgz
```

---

## 7. REPORT (write this file, always — even on abort)

Write `~/voicelogpro/HERMES_REPORT_CONVERSION_REPAIR.md` with:

1. **Fabrication removal ledger** — every file touched, all 29 locales confirmed, both image assets deleted, and whether an **audio asset** existed for "Jason T." (state explicitly — this matters most).
2. **Confirmation the "Simulated output, not actual transcription" disclaimer survived.**
3. **CTA relabelling** — old → new label for every instance, and confirmation that **no checkout, Stripe link, or price ID was created**.
4. **Legal content** — confirmation that nothing under `scripts/*lien*`, the 50-state dataset, the calculator, or any statutory citation was modified.
5. **Steps skipped** and the gate output that caused each.
6. **Escalate to owner — these need a human decision:**
   - **How long were the fabricated testimonials live, and were they ever used in ads, outreach emails, directory listings, or the AEO outreach pack?** If those quotes were syndicated off-site, removing them from the site does not remove them from the internet. Check `HERMES_TASKS_VOICELOGPRO_AEO.md` and `AEO-OUTREACH-PACK`-style assets for reuse.
   - **The compliance table** maps product features to Texas Property Code Ch. 53, Virginia/AIA A401 and the UK Building Safety Act, for a product whose output is currently simulated. A feature that does not exist yet cannot deliver statutory compliance. This needs owner/attorney review — **you must not edit legal text yourself**.
   - **Displayed prices with no checkout.** Either build the payment path or move the prices behind "launching soon". This is a product decision.
   - The site now has **no social proof at all**. That is correct. Real testimonials must be collected from real beta users once the product genuinely transcribes.

---

## 8. WHAT SUCCESS LOOKS LIKE

- `grep -rn "Jason T\|Maria R\|22,000"` across `src/` returns **nothing**, in all 29 languages.
- Both `public/images/testimonial-*.webp` are deleted and 404 in production; any fabricated audio asset is gone.
- **Nothing was invented to replace them** — no anonymised quotes, no "illustrative" relabelling.
- The **"Simulated output, not actual transcription"** disclaimer is still live.
- No CTA implies a purchase; `grep buy.stripe.com` still returns **0**.
- `scripts/*lien*`, the 50-state dataset, the calculator and every statutory citation are **unmodified**.
- `npm run typecheck` and the full `npm run build` both pass; state lien pages still return 200.
- The two untracked `HERMES_*.md` runbooks were never staged.

**The deepest point:** the writing here is strong, the niche is genuinely underserved, and "court-ready daily log" is a real, unclaimed wedge. But this site sells **evidence for legal disputes** to contractors who will be skeptical by trade — and it currently presents two people who do not exist, with photographs, an audio clip, and a $22,000 savings figure, for a product that by its own on-page admission does not yet transcribe. No conversion work matters while that is true. Delete the fabrications, tell the truth about what is buyable today, and let the honest disclaimer and the real $40K origin story carry the page until the product ships.
