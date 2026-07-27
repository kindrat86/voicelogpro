/**
 * VoiceLogPro — single source of truth for every price, tier, and offer string.
 *
 * WHY THIS EXISTS
 * The audit found the Crew Plan described in conflicting ways across the site
 * ($49 founding / $12 beta / per-user / 14-day free trial). This module ensures
 * every page reads from the same constants. A grep for `\$49|\$12|per-user` in
 * src/ should return zero hits after the sweep.
 *
 * RULE: No component may contain a literal "$49", "$12", or "per-user" string.
 * Build all pricing copy from the exports below.
 */

export type PlanId = "defense_kit" | "solo_beta" | "crew";

export interface Plan {
  id: PlanId;
  name: string;
  priceUsd: number;
  cadence: string; // "/month" | "" 
  tagline: string;
  features: string[];
  highlight?: "most_popular" | "entry" | "core" | "lead_magnet";
  available: boolean;
  ctaHref: string;
}

export const PLANS: Record<PlanId, Plan> = {
  defense_kit: {
    id: "defense_kit",
    name: "Daily Log Defense Kit",
    priceUsd: 0,
    cadence: "",
    tagline: "Templates, Texas Chapter 53 checklist & dispute swipe file.",
    features: [
      "5 OSHA-compliant daily log templates",
      "Texas Chapter 53 lien-rights checklist",
      "Dispute Defense Swipe File",
    ],
    highlight: "lead_magnet",
    available: true,
    ctaHref: "/#defense-kit",
  },
  solo_beta: {
    id: "solo_beta",
    name: "Solo Beta",
    priceUsd: 0,
    cadence: "",
    tagline: "Unlimited voice logs + standard PDF reports for one foreman.",
    features: ["Unlimited Voice Logs", "Standard PDF Reports", "Email Support"],
    highlight: "entry",
    available: true,
    ctaHref: "/crew-plan",
  },
  crew: {
    id: "crew",
    name: "Crew Plan",
    priceUsd: 49,
    cadence: "/month",
    tagline: "Up to 5 crews, priority onboarding, custom branding.",
    features: [
      "All Beta features",
      "Up to 5 Crews",
      "Priority Onboarding",
      "Custom Branding",
    ],
    highlight: "most_popular",
    available: true,
    ctaHref: "/crew-plan",
  },
};

export const AUDIT_TRAIL_ADDON = {
  name: "Dispute-Ready Audit Trail",
  betaPriceUsd: 0,
  launchPriceUsd: 19,
  cadence: "/month",
  features: [
    "Dispute-Ready Audit Trail add-on",
    "Automatic monthly Chapter 53 deadline reminders",
    "GC-facing cover-letter generator for pay apps",
  ],
} as const;

/** Canonical, verbatim offer phrases. */
export const OFFER_COPY = {
  crewHeadline: "$49/month for your entire crew.",
  foundingLock: "Founding price locks at sign-up.",
  noChargeUntilLaunch: "Reserve your seat — no charge until launch.",
  guarantee: "30 Minutes Saved Per Day Guaranteed — Or Your Money Back",
  refundWindow: "30-day money-back guarantee at launch.",
  unsubscribe: "100% Free. No credit card. Unsubscribe anytime.",
} as const;

export const RISK_REVERSAL = [
  "No charge until launch",
  "30-day money-back guarantee at launch",
  "Cancel anytime",
  "Your data stays yours — export as standard PDFs",
] as const;

// ─── Formatting helpers ──────────────────────────────────────────────────────

export function formatPrice(plan: Plan): string {
  if (plan.priceUsd === 0) return plan.id === "defense_kit" ? "Free" : "$0";
  return `$${plan.priceUsd}`;
}

export function priceWithCadence(plan: Plan): string {
  const price = formatPrice(plan);
  return plan.cadence ? `${price} ${plan.cadence}` : price;
}

export function ctaLabel(plan: Plan): string {
  switch (plan.id) {
    case "defense_kit":
      return "Get the Free Defense Kit";
    case "solo_beta":
      return "Join Beta Free";
    case "crew":
      return "Reserve a Crew Plan place";
  }
}
