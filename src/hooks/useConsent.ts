/**
 * VoiceLogPro — GDPR/ePrivacy consent gate for PostHog.
 *
 * The audit found zero consent management despite the site serving UK traffic
 * (Building Safety Act pages) and using EU-hosted PostHog. Under GDPR/ePrivacy,
 * analytics that set cookies/persist identifiers require prior consent for EU/UK
 * users. Before consent is granted, track() is a no-op (see lib/posthog.ts).
 *
 * USAGE
 *   const consent = useConsent();
 *   if (consent.showBanner) return <ConsentBanner onDecide={consent.decide} />;
 *
 * Compatible with the SSR/prerender pipeline: all browser-API calls are guarded
 * by typeof window checks.
 */

import { useEffect, useState, useCallback } from "react";
import { setConsentGranted } from "@/lib/posthog";

const STORAGE_KEY = "vlp:consent";
export type ConsentChoice = "granted" | "denied" | null;

function readStored(): ConsentChoice {
  if (typeof window === "undefined" || typeof localStorage === "undefined")
    return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

export interface UseConsent {
  choice: ConsentChoice;
  granted: boolean;
  showBanner: boolean;
  decide: (next: "granted" | "denied") => void;
}

export function useConsent(): UseConsent {
  const [choice, setChoice] = useState<ConsentChoice>(null);

  // Hydrate from localStorage on mount (SSR-safe).
  useEffect(() => {
    setChoice(readStored());
  }, []);

  // Sync the PostHog gate — until granted, track() drops events.
  useEffect(() => {
    setConsentGranted(choice === "granted");
  }, [choice]);

  // Sync Google Consent Mode v2 if gtag is present.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const gtag = (window as any).gtag as
      | ((cmd: string, action: string, params: Record<string, string>) => void)
      | undefined;
    if (typeof gtag === "function") {
      const v = choice === "granted" ? "granted" : "denied";
      gtag("consent", "update", {
        analytics_storage: v,
        ad_storage: v,
        ad_user_data: v,
        ad_personalization: v,
      });
    }
  }, [choice]);

  const decide = useCallback((next: "granted" | "denied") => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
    setChoice(next);
  }, []);

  return { choice, granted: choice === "granted", showBanner: choice === null, decide };
}
