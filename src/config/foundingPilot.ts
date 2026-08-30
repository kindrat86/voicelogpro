export const FOUNDING_PILOT = {
  name: "VoiceLogPro Founding Pilot",
  priceDisplay: "$49",
  priceUsd: 49,
  billing: "one_time",
  durationDays: 7,
  reportLimit: 5,
  crewLimit: 1,
  onboardingEmail: "hello@voicelogpro.com",
  refundWindowDays: 7,
  paymentLinkUrl: "https://buy.stripe.com/cNi9ASax5aJy5cig6s0x20K",
} as const;

export const FOUNDING_PILOT_GUARANTEE =
  "If the pilot reports are not useful, email hello@voicelogpro.com within 7 calendar days after the final pilot report and we will refund the $49 pilot payment.";

export const FOUNDING_PILOT_DISCLAIMER =
  "VoiceLogPro is not a law firm. Reports are generated from customer-supplied information and do not guarantee admissibility, compliance, payment, lien rights, or a legal outcome.";
