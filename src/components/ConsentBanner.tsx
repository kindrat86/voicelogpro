/**
 * ConsentBanner — GDPR/ePrivacy consent UI for EU/UK visitors.
 *
 * WHY THIS EXISTS
 * The audit found zero consent management despite UK-targeted pages and
 * EU-hosted PostHog. This banner renders once at the bottom of the viewport
 * until the user explicitly grants or denies consent.
 *
 * DESIGN
 *  - Non-blocking (fixed bottom, doesn't obscure the hero).
 *  - Accept and Reject are equally weighted — no dark patterns, legally required.
 *  - Matches the industrial design system (card-industrial, primary gradient).
 */

import { Button } from "@/components/ui/button";

export interface ConsentBannerProps {
  onDecide: (choice: "granted" | "denied") => void;
}

export function ConsentBanner({ onDecide }: ConsentBannerProps) {
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm shadow-lg animate-slide-up"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          We use analytics (EU-hosted PostHog) to understand how people use
          VoiceLogPro and make the site better.{" "}
          <span className="font-medium text-foreground">No creepy tracking.</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onDecide("denied")}>
            Reject
          </Button>
          <Button size="sm" onClick={() => onDecide("granted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
