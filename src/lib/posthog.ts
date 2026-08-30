/**
 * VoiceLogPro — typed PostHog wrapper around the existing window.posthog global.
 *
 * PostHog is already initialized in index.html (inline snippet, EU host,
 * phc_lyZCgvTpicjLzAO3rY2GhxuXW5Uc5jQjP8ZVwwJqauX). This module provides
 * typed event names + a track() helper so every component fires consistent
 * events without repeating the window.posthog access pattern.
 *
 * Consent-gated: track() is a no-op until consent is granted via useConsent().
 * This matches the existing pattern where BetaSignup.tsx accesses window.posthog
 * directly, but adds the consent layer the site currently lacks.
 */

// ─── Event names ────────────────────────────────────────────────────────────

export const EVENTS = {
  emailCaptured: "email_captured",
  crewSpotReserved: "crew_spot_reserved",
  ctaClicked: "cta_clicked",
  calculatorResultViewed: "calculator_result_viewed",
  calculatorEmailRequested: "calculator_email_requested",
  toolReportGenerated: "tool_report_generated",
  demoRecordClicked: "demo_record_clicked",
  faqExpanded: "faq_expanded",
  externalLinkClicked: "external_link_clicked",
  foundingPilotViewed: "founding_pilot_viewed",
  foundingPilotCtaClicked: "founding_pilot_cta_clicked",
  foundingPilotOnboardingViewed: "founding_pilot_onboarding_viewed",
  formValidationError: "form_validation_error",
  formSubmitFailed: "form_submit_failed",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export type Placement =
  | "hero"
  | "defense_kit"
  | "crew_plan"
  | "beta"
  | "exit_intent"
  | "calculator"
  | "sticky_bar"
  | "contextual_cta";

export type PlanTier = "defense_kit" | "solo_beta" | "crew";

// ─── Consent gate ───────────────────────────────────────────────────────────

let consentGranted = false;

export function setConsentGranted(v: boolean) {
  consentGranted = v;
}

export function isConsentGranted() {
  return consentGranted;
}

// ─── Super-properties ───────────────────────────────────────────────────────

let superProps: Record<string, unknown> = {};

export function registerUserProperties(props: Record<string, unknown>) {
  superProps = { ...superProps, ...props };
  const ph = getPosthog();
  if (ph && consentGranted) {
    try {
      (ph as PostHogApi).setPersonProperties?.(superProps);
    } catch {
      // setPersonProperties is best-effort; don't break the page
    }
  }
}

// ─── Core API ───────────────────────────────────────────────────────────────

function getPosthog() {
  if (typeof window === "undefined") return null;
  return window.posthog;
}

export function track(
  event: EventName,
  properties: Record<string, unknown> = {}
): void {
  if (!consentGranted) return;

  const ph = getPosthog();
  if (!ph?.capture) return;

  try {
    ph.capture(event, { ...superProps, ...properties });
  } catch {
    // Best-effort — PostHog is non-critical for page function.
  }
}

/**
 * Identify a known lead (call once after email capture, before navigating away).
 * Matches the existing pattern in BetaSignup.tsx.
 */
export function identify(
  distinctId: string,
  traits: Record<string, unknown> = {}
): void {
  if (!consentGranted) return;
  const ph = getPosthog();
  if (!ph) return;
  try {
    ph.identify?.(distinctId, traits);
  } catch {
    // Best-effort.
  }
}
