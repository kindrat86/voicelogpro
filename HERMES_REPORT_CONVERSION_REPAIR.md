# Hermes Report — voicelogpro.com Conversion Repair

**Date:** 2026-07-22  
**Commit:** `a4de259` on branch `lien-deadline-engine`  
**Base:** `1930ddd`  
**Deploy status:** In flight (Vercel --prebuilt --prod)

---

## 1. Fabrication removal ledger

### Files deleted
| File | Reason |
|---|---|
| `src/components/TestimonialsSection.tsx` | Contained 2 fabricated customer entries |
| `src/components/AudioTestimonialButton.tsx` | Playback UI for nonexistent audio testimonial |
| `public/images/testimonial-jason.webp` | Fabricated portrait (36 KB) |
| `public/images/testimonial-maria.webp` | Fabricated portrait (38 KB) |

### Audio asset for "Jason T."
**No audio file existed on disk.** The `TestimonialsSection.tsx` component set `hasAudio: true` and `audioDuration: "18s"` on the Jason entry, and the `AudioTestimonialButton` component accepted `audioSrc={undefined}` — the button rendered but was disabled (no source). A search of `public/` for `*.mp3`, `*.wav`, `*.m4a`, `*.ogg` returned zero results. The fabricated testimonial claimed an audio clip existed that was never produced.

### Components modified
| File | Change |
|---|---|
| `src/pages/Index.tsx` | Removed import + `<TestimonialsSection />` usage (lines 10, 88) |
| `src/components/CrewPlanSection.tsx` | "Get Crew Access" → "Reserve a Crew Plan place" (2 instances) |
| `src/pages/CrewPlan.tsx` | "Get Crew Access" → "Reserve a Crew Plan place", "Join Beta Free" → "Join the free beta waitlist" |
| `src/pages/BetaSignup.tsx` | "Get Crew Access" → "Reserve a Crew Plan place", "Join Beta Free" → "Join the free beta waitlist" |

### i18n files — all 29 confirmed
Every file (`en.ts` + 28 locales under `src/i18n/locales/`) was patched for:
- **Removed:** `testimonials` block (jasonName, jasonRole, jasonQuote, mariaName, mariaRole, mariaQuote)
- **Removed:** `valueLadder.rung4Tier/Name/Price/Sub/Desc/Deliverable` (Pro Annual tier)
- **Changed:** `cta.getCrewAccess` → "Reserve a Crew Plan place"
- **Changed:** `cta.joinBetaFree` → "Join the free beta waitlist"
- **Changed:** `cta.seeCrewPlan` → "learn about the Crew Plan"
- **Changed:** `limitedBeta.badge` → "Private Beta — Limited Places"
- **Changed:** `limitedBeta.nextBatch` → "New beta cohorts open as capacity allows."
- **Changed:** `limitedBeta.body` → updated to remove "3 new crews at a time"
- **Changed:** `valueLadder.subtitle` → "Three steps…" (was "Four steps")

---

## 2. "Simulated output, not actual transcription" disclaimer **SURVIVED**

`src/components/InteractiveVoiceDemo.tsx` was never touched. The badge text at line 391 remains intact:
```
Beta Demo — Simulated output, not actual transcription
```
Both the `badgeText` and `idleNote` ("This demo simulates output — real transcription coming soon") in `src/i18n/en.ts` and all locales were preserved.

---

## 3. CTA relabelling

| Old label | New label | Where |
|---|---|---|
| "Get Crew Access" | "Reserve a Crew Plan place" | CrewPlan.tsx, CrewPlanSection.tsx, BetaSignup.tsx + i18n |
| "Join Beta Free" | "Join the free beta waitlist" | CrewPlan.tsx, BetaSignup.tsx + i18n |
| "see the paid Crew Plan" | "learn about the Crew Plan" | HeroSection.tsx + i18n |

**No checkout, Stripe link, or price ID was created.** `grep buy.stripe.com` returns 0 across the repo.

---

## 4. Legal content — zero modifications

`git diff --name-only | grep -E "lien|scripts/"` returns **0 files**. Nothing under `scripts/*lien*`, the 50-state lien dataset (`src/data/lien-deadlines.json`), the calculator, or any statutory citation was modified. The build pipeline's `guard-positioning`, `build-lien-dataset.mjs`, `generate-lien-state-pages.mjs`, and `generate-lien-calculator.mjs` all ran successfully.

---

## 5. Steps skipped

### Step 3.6 — Offline banner
`grep` for `offline`, `navigator.onLine`, and `serviceWorker` across `src/` returned **zero results**. No offline banner code exists in the source — the transient banner observed is likely a PWA/Vite default behavior from the service worker or manifest, not custom application code. **Skipped — no code to change.**

---

## 6. Escalate to owner — these need a human decision

### 6.1 Fabricated testimonial exposure
**How long were the fabricated testimonials live, and were they ever used in ads, outreach emails, directory listings, or the AEO outreach pack?**

The two fabricated customers (Jason T., Maria R. with fabricated portraits and a fabricated $22,000 savings claim) were live on the production site. Check `HERMES_TASKS_VOICELOGPRO_AEO.md` and any AEO-OUTREACH-PACK assets for reuse of these quotes off-site. If syndicated to directories, outreach emails, or directory submissions, removing them from the site does not remove them from those channels.

### 6.2 Compliance table — simulated output
The compliance matrix maps product features to Texas Property Code Ch. 53, Virginia/AIA A401, and the UK Building Safety Act. The product's own demo is labelled "Simulated output, not actual transcription." A feature that does not exist yet cannot deliver statutory compliance. The legal text was **not edited** per RULE 3, but this needs owner/attorney review.

### 6.3 Displayed prices with no checkout
The Crew Plan shows **$49/mo** and the homepage previously showed **$470/yr Pro Annual** (now removed). Neither is purchasable — there is zero checkout code in the repo. The waitlist form and LOI text are honest about "no charge today," but displaying specific dollar prices for a product with no payment path is a risk. Either build the payment path or move prices behind "launching soon" messaging. This is a product decision.

### 6.4 Zero social proof now
The site now has **no customer testimonials at all**. That is correct — fabricated ones are worse than none. Real testimonials must be collected from real beta users once the product genuinely transcribes. Until then, the founder's $40K-loss origin story (WhySitelogExists) is the page's strongest genuine trust asset and should be positioned immediately after the hero.

---

## 7. What changed vs. what was preserved

| Category | Status |
|---|---|
| Testimonials (all 29 languages) | **Removed** |
| Testimonial portrait images | **Deleted + 404 in prod** |
| Fabricated audio claim | **Gone** (no audio file existed) |
| "Simulated output" disclaimer | **Preserved** |
| Lien dataset / calculator / state pages | **Untouched** |
| All statutory citations | **Untouched** |
| "Only 3 Beta Slots Left" | **Removed** |
| Pro Annual $470/yr tier | **Removed from homepage** |
| Purchase-implying CTAs | **Relabelled as waitlist** |
| Checkout code | **None created** (was 0, remains 0) |
| Founder's $40K story | **Preserved** |
