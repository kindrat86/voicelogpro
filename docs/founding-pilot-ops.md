# VoiceLogPro Founding Pilot Operations

## Offer contract

- Product: VoiceLogPro Founding Pilot
- Price: $49 USD, one-time
- Scope: one subcontractor company, one crew, seven consecutive calendar days from onboarding confirmation, up to five daily-report PDFs
- Renewal: none. A pilot buyer is not enrolled in the future $49/month Crew Plan.
- Intake: `hello@voicelogpro.com`
- Delivery target: same business day for a complete submission received before noon US Eastern; otherwise by the next business day
- Refund promise: if the pilot reports are not useful, the customer may email `hello@voicelogpro.com` within seven calendar days after the final pilot report for a refund of the $49 pilot payment

## Live payment rail

- Stripe account: `acct_1INmB5CwGoUDklRe` (Sipiteno Ltd)
- Product: `prod_VAUKjbmw3bSKFd`
- Price: `price_1UA9LjCwGoUDklReKrZmIQO7`
- Payment Link: `plink_1UA9LlCwGoUDklRepomS82Nd`
- Checkout: `https://buy.stripe.com/cNi9ASax5aJy5cig6s0x20K`
- Amount: `4900` cents
- Currency: `usd`
- Billing: one-time, no recurring interval
- Post-payment redirect: `https://voicelogpro.com/pilot-welcome`
- Attribution metadata: `product=voicelogpro`, `offer=founding_pilot`, `offer_version=1`

Do not change account-wide Stripe tax, branding, payout, notification, or security settings while operating this offer.

## Inbox monitoring

An external-sender test on 2026-08-30 verified the full chain from `hello@voicelogpro.com` through Cloudflare Email Routing into the controlled Gmail account. The raw message showed the Cloudflare `cfbounces` return path and passing SPF, DKIM, and DMARC. Gmail placed the test in Spam.

Until real inbound messages establish normal placement:

- Monitor Inbox, All Mail, and Spam for pilot onboarding.
- Search by the buyer email and the Stripe payment time when a paid session appears.
- Do not claim onboarding is missing until all three locations are checked.
- Never expose customer data while reporting the forwarding state.

## Private file layout

Real customer material must never be saved in this repository. Use:

```text
/Users/sipi/.hermes/private/voicelogpro-pilots/<customer>/<project>/
  source/
  working/
  delivered/
  refund/
  intake.json
```

Use short filesystem-safe customer and project slugs. Keep the original source material read-only where practical. Do not paste customer names, emails, audio, photos, or jobsite facts into tests, fixtures, screenshots, pull requests, analytics, or issue trackers.

The committed example at `examples/founding-pilot-input.example.json` is entirely fictional.

## Intake checklist

1. Confirm Stripe shows a live paid Checkout Session for the exact Founding Pilot Payment Link.
2. Confirm amount `4900`, currency `usd`, `payment_status=paid`, and `status=complete`.
3. Confirm the payer is not Maryan, Sipiteno, a friend used for testing, or a test identity.
4. Create the private customer/project directory.
5. Save the customer's onboarding email and attachments under `source/`.
6. Confirm the onboarding start date in writing. This starts the seven consecutive calendar days.
7. Confirm the customer supplied, or intentionally omitted:
   - company name
   - project/job name
   - project city/state or country
   - report date
   - submitter
   - voice note or written notes
   - crew size and hours, if known
   - work completed
   - materials, equipment, and deliveries, if relevant
   - delays, blockers, RFIs, change orders, or safety items, if relevant
   - optional photos with captions
   - logo for branding, if requested
8. Reject and request removal of passwords, payment-card data, government IDs, medical information, or unrelated sensitive personal data.
9. If audio transcription is needed, use only an already-authorized provider after confirming the customer agrees to that processing. Do not upload audio to a new service without authorization.

## Prepare the JSON input

Copy the fictional example into the customer's private `working/` folder and replace only with facts from the customer's source material.

Required fields:

- `report.id`
- `report.reportDate`
- `company.name`
- `project.name`
- `receivedAt`

Optional fields must be omitted when absent. The generator displays `Not provided` only for a few identity fields and never invents facts.

Customer-reported event times belong in `customerReportedEventTimes`. The time VoiceLogPro received the file belongs in `receivedAt`. Never describe either as verified.

Weather may be included only when the customer supplies all three fields:

- `weather.summary`
- `weather.source`
- `weather.retrievedAt`

The generator performs no network calls and does not fetch weather.

## Generate a report

From a clean VoiceLogPro checkout:

```bash
node scripts/generate-founding-pilot-report.mjs \
  /Users/sipi/.hermes/private/voicelogpro-pilots/<customer>/<project>/working/report-YYYY-MM-DD.json \
  /Users/sipi/.hermes/private/voicelogpro-pilots/<customer>/<project>/working/report-YYYY-MM-DD.pdf
```

For the fictional QA sample:

```bash
node scripts/generate-founding-pilot-report.mjs \
  examples/founding-pilot-input.example.json \
  /Users/sipi/.hermes/private/voicelogpro-pilots/_qa/fictional-sample-report.pdf
```

## Report QA checklist

A second fact-by-fact review is mandatory before delivery.

- [ ] Compare every report statement against the customer's source email, notes, audio transcript, and photos.
- [ ] Confirm report date, company, project, location, submitter, and report ID.
- [ ] Confirm received time is labeled as file received, not as an event time.
- [ ] Confirm customer-reported event times are labeled as customer-reported.
- [ ] Confirm crew counts, hours, quantities, materials, equipment, and deliveries match the source.
- [ ] Confirm delay, safety, RFI, and change-order wording does not add legal conclusions.
- [ ] Confirm missing fields are omitted or shown as `Not provided`.
- [ ] Confirm weather is absent unless summary, source, and retrieval time were supplied.
- [ ] Confirm photo captions match the referenced files.
- [ ] Confirm the legal disclaimer is visible in the PDF footer.
- [ ] Confirm the report never makes an unqualified court-ready, OSHA compliant, lien compliant, verified, legally defensible, or evidence-grade claim.
- [ ] Open the PDF at normal zoom and confirm text is readable, pages are Letter size, no text is clipped, and page count is sensible.
- [ ] Move the approved PDF to `delivered/` without modifying the original source files.

## Delivery checklist

- [ ] Deliver only to the customer address associated with the paid session or an address the customer explicitly provides in the same thread.
- [ ] Use plain text and a project-domain sender.
- [ ] Run Maryan's encoding preflight. Block sending if the composer contains `‚Ä`, `Ã`, `Â`, `â€`, or `�`.
- [ ] State the report date and attached filename.
- [ ] Ask the customer to review factual accuracy and reply with corrections.
- [ ] Do not call the report legally verified or promise compliance, admissibility, payment, lien rights, or legal outcomes.
- [ ] Record the delivery timestamp in the private folder.
- [ ] Count delivered reports toward the limit of five.

## Refund checklist

- [ ] Confirm the request arrived within seven calendar days after the final pilot report.
- [ ] Resolve the exact live Payment Intent or charge from the Founding Pilot Checkout Session.
- [ ] Confirm the amount and customer match the pilot record.
- [ ] Process no more than the actual $49 pilot payment.
- [ ] Save the Stripe refund ID and date in the private `refund/` folder.
- [ ] Send a plain-text confirmation after Stripe reports the refund as successful.
- [ ] Never condition the refund on a positive review, silence, or deletion of criticism.

## Deletion checklist

The public policy does not promise a fixed retention schedule. Honor a customer's deletion request unless a legal or accounting obligation requires limited retention.

- [ ] Identify the exact customer/project private directory.
- [ ] Preserve only transaction records required for accounting or disputes.
- [ ] Delete source audio, photos, notes, working files, and delivered copies that are no longer required.
- [ ] Empty any temporary transcription-provider workspace if the authorized provider supports deletion.
- [ ] Verify the files are absent from the private path.
- [ ] Record the deletion date and categories removed without copying deleted content into the log.

## Secure sale verification

Use a live Stripe credential loaded from the encrypted local vault. Never print the credential.

1. Query Checkout Sessions filtered by Payment Link `plink_1UA9LlCwGoUDklRepomS82Nd`.
2. For a candidate session, confirm:
   - `livemode=true`
   - `status=complete`
   - `payment_status=paid`
   - `amount_total=4900`
   - `currency=usd`
   - `payment_link=plink_1UA9LlCwGoUDklRepomS82Nd`
3. Read the session line items and confirm product `prod_VAUKjbmw3bSKFd` and price `price_1UA9LjCwGoUDklReKrZmIQO7`.
4. Confirm the payer is unrelated and external. Owner, Sipiteno, friend, test-mode, refunded, or manually fabricated transactions are not a first customer.
5. Record only the minimum operating information in the private folder.

The accurate public state remains `purchase path live; first customer still pending` until an unrelated external live-mode payment is paid, onboarding is received, and the first promised report is delivered after QA.

## Analytics

Allowed non-PII events:

- `founding_pilot_viewed`
- `founding_pilot_cta_clicked`
- `founding_pilot_onboarding_viewed`

Allowed properties: `placement`, `offer=founding_pilot`, `price_usd=49`, and `billing=one_time`.

Never send email, name, company, project, jobsite data, Stripe session IDs, Payment Intent IDs, or customer files to PostHog.
