/**
 * VoiceLogPro — UTM / first-touch attribution (SSR-safe).
 *
 * Captures UTM params + referrer on page load, persists first touch across
 * sessions, and exposes both for PostHog registration and waitlist inserts.
 *
 * SSR-safe: all calls check typeof window before accessing browser APIs.
 */

import { registerUserProperties } from "./posthog";

const FIRST_KEY = "vlp:first_touch";
const LAST_KEY = "vlp:last_touch";

interface Touch {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_url?: string;
  referrer?: string;
  source?: string; // derived bucket
  captured_at: string;
}

function readUtms(): Partial<Touch> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") ?? undefined,
    utm_medium: p.get("utm_medium") ?? undefined,
    utm_campaign: p.get("utm_campaign") ?? undefined,
    utm_term: p.get("utm_term") ?? undefined,
    utm_content: p.get("utm_content") ?? undefined,
  };
}

function bucket(t: Partial<Touch>): string {
  if (typeof window === "undefined") return "unknown";
  const path = window.location.pathname;
  const ref = t.referrer ?? "";
  if (t.utm_medium === "cpc" || t.utm_medium === "paid") return "paid";
  if (t.utm_source) return `utm/${t.utm_source}`;
  if (ref.includes("google.") || ref.includes("bing.")) return "seo/search";
  if (path.startsWith("/lien-law-deadlines")) return "seo/state-page";
  if (path.startsWith("/for/")) return "seo/trade-page";
  if (path.startsWith("/vs/") || path.startsWith("/alternatives-to/"))
    return "seo/compare-page";
  if (path.startsWith("/templates/") || path.startsWith("/free/"))
    return "seo/tool-page";
  if (ref) return "referral";
  return "direct";
}

function parse(raw: string | null): Touch | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Touch;
  } catch {
    return null;
  }
}

function touchFromEnv(): Touch | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined")
    return null;
  const utms = readUtms();
  const t: Touch = {
    ...utms,
    landing_url: window.location.href || undefined,
    referrer: document.referrer || undefined,
    captured_at: new Date().toISOString(),
  };
  t.source = bucket(t);
  return t;
}

/**
 * Call once on app mount (EntryClient or App.tsx). Persists first + last touch
 * and registers with PostHog so every event carries source attribution.
 */
export function captureTouch(): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined")
    return;

  const current = touchFromEnv();
  if (!current) return;

  // First touch: keep the first ever.
  if (!parse(localStorage.getItem(FIRST_KEY))) {
    localStorage.setItem(FIRST_KEY, JSON.stringify(current));
  }
  // Last touch: always most recent landing.
  localStorage.setItem(LAST_KEY, JSON.stringify(current));

  const first = parse(localStorage.getItem(FIRST_KEY)) ?? current;

  registerUserProperties({
    utm_source: current.utm_source ?? first.utm_source,
    utm_medium: current.utm_medium ?? first.utm_medium,
    utm_campaign: current.utm_campaign ?? first.utm_campaign,
    acquisition_source_first: first.source,
    acquisition_source_last: current.source,
  });
}

/** Read both touches for attribution at capture time. */
export function readTouches(): { first: Touch | null; last: Touch | null } {
  if (typeof window === "undefined" || typeof localStorage === "undefined")
    return { first: null, last: null };
  return {
    first: parse(localStorage.getItem(FIRST_KEY)),
    last: parse(localStorage.getItem(LAST_KEY)),
  };
}

/**
 * Attach attribution to a lead payload before insert.
 * Usage: passed as `source` to the /subscribe endpoint via withAttribution({ email, ... }).
 */
export function withAttribution<T extends Record<string, unknown>>(
  lead: T
): T & {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  acquisition_source: string | null;
  first_url: string | null;
  referrer: string | null;
} {
  const { first, last } = readTouches();
  const t = last ?? first;
  return {
    ...lead,
    utm_source: t?.utm_source ?? null,
    utm_medium: t?.utm_medium ?? null,
    utm_campaign: t?.utm_campaign ?? null,
    acquisition_source: t?.source ?? null,
    first_url: first?.landing_url ?? null,
    referrer: t?.referrer ?? null,
  };
}
