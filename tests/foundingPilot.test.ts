import { describe, expect, it } from "vitest";
import { FOUNDING_PILOT } from "@/config/foundingPilot";

describe("VoiceLogPro Founding Pilot offer contract", () => {
  it("keeps the exact approved one-time pilot terms in one public config", () => {
    expect(FOUNDING_PILOT.name).toBe("VoiceLogPro Founding Pilot");
    expect(FOUNDING_PILOT.priceDisplay).toBe("$49");
    expect(FOUNDING_PILOT.priceUsd).toBe(49);
    expect(FOUNDING_PILOT.billing).toBe("one_time");
    expect(FOUNDING_PILOT.durationDays).toBe(7);
    expect(FOUNDING_PILOT.reportLimit).toBe(5);
    expect(FOUNDING_PILOT.crewLimit).toBe(1);
    expect(FOUNDING_PILOT.onboardingEmail).toBe("hello@voicelogpro.com");
    expect(FOUNDING_PILOT.refundWindowDays).toBe(7);
  });

  it("uses a live Stripe Payment Link rather than a placeholder", () => {
    expect(FOUNDING_PILOT.paymentLinkUrl).toMatch(
      /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/,
    );
    expect(FOUNDING_PILOT.paymentLinkUrl).not.toMatch(/test|replace|placeholder/i);
  });
});
