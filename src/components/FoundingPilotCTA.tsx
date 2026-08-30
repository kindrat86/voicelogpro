import { track, EVENTS } from "@/lib/posthog";
import { FOUNDING_PILOT } from "@/config/foundingPilot";

type FoundingPilotCTAProps = {
  placement: string;
  className?: string;
};

export function FoundingPilotCTA({ placement, className = "" }: FoundingPilotCTAProps) {
  return (
    <a
      href={FOUNDING_PILOT.paymentLinkUrl}
      onClick={() =>
        track(EVENTS.foundingPilotCtaClicked, {
          placement,
          offer: "founding_pilot",
          price_usd: FOUNDING_PILOT.priceUsd,
          billing: "one_time",
        })
      }
      className={`inline-flex min-h-[52px] items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-bold text-[#0b0f14] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    >
      Start the $49 Pilot
    </a>
  );
}
