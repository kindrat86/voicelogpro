// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import FoundingPilot from "@/pages/FoundingPilot";
import PilotWelcome from "@/pages/PilotWelcome";
import { FoundingPilotCTA } from "@/components/FoundingPilotCTA";
import { setConsentGranted } from "@/lib/posthog";
import { FOUNDING_PILOT } from "@/config/foundingPilot";

const renderPage = (node: React.ReactNode) =>
  render(
    <HelmetProvider>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {node}
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("Founding Pilot conversion pages", () => {
  beforeEach(() => {
    setConsentGranted(true);
    window.posthog = { capture: vi.fn() } as typeof window.posthog;
  });

  afterEach(() => {
    cleanup();
    setConsentGranted(false);
    vi.restoreAllMocks();
  });

  it("renders the exact paid concierge offer, scope, turnaround, guarantee, and disclaimer", () => {
    renderPage(<FoundingPilot />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Your crew talks. We deliver the daily report.",
      }),
    ).toBeTruthy();
    expect(screen.getAllByText(/\$49 one-time founding pilot/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/one crew/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/7 days/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/up to 5 daily-report PDFs/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/same business day/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/no automatic renewal/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/if the pilot reports are not useful/i)).toBeTruthy();
    expect(screen.getByText(/VoiceLogPro is not a law firm/i)).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /Start the \$49 Pilot/i }).length).toBeGreaterThan(0);
  });

  it("uses the verified checkout URL and emits only non-PII CTA analytics", () => {
    renderPage(<FoundingPilotCTA placement="test_placement" />);
    const link = screen.getByRole("link", { name: /Start the \$49 Pilot/i });
    expect(link.getAttribute("href")).toBe(FOUNDING_PILOT.paymentLinkUrl);
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);
    expect(window.posthog?.capture).toHaveBeenCalledWith(
      "founding_pilot_cta_clicked",
      {
        placement: "test_placement",
        offer: "founding_pilot",
        price_usd: 49,
        billing: "one_time",
      },
    );
  });

  it("renders conditional post-checkout onboarding without falsely confirming payment", () => {
    renderPage(<PilotWelcome />);
    expect(screen.getByText(/If you just completed checkout, welcome/i)).toBeTruthy();
    expect(screen.queryByText(/payment confirmed/i)).toBeNull();
    expect(screen.getByRole("link", { name: "hello@voicelogpro.com" })).toBeTruthy();
    expect(screen.getByText(/company name/i)).toBeTruthy();
    expect(screen.getByText(/voice note or written notes/i)).toBeTruthy();
    expect(screen.getByText(/optional photos/i)).toBeTruthy();
    expect(screen.getByText(/same business day/i)).toBeTruthy();
    expect(screen.getByText(/do not send passwords/i)).toBeTruthy();
  });
});
