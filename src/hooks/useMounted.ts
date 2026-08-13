/**
 * useMounted — false during the first render, true from the first effect on.
 *
 * WHY THIS EXISTS
 * This app prerenders to static HTML (scripts/prerender.mjs) and then hydrates
 * it in entry-client.tsx. Hydration requires the client's FIRST render to
 * produce the same tree the server produced. Two pieces of chrome broke that
 * rule and were rendered only on the client:
 *
 *   - ConsentGate  — `showBanner` is `choice === null`, and `choice` starts as
 *                    null, so the banner rendered on render #1. It cannot be
 *                    server-rendered either way: whether to show it depends on
 *                    localStorage, which does not exist during prerender.
 *   - MobileBottomBar — rendered a <nav> unconditionally (hidden on desktop by
 *                    CSS, but still present in the DOM).
 *
 * Both sat near the top of App's tree, so React found a mismatch at the very
 * first node: production threw hydration error #418 repeatedly and then #423,
 * which means React discarded the entire prerendered DOM and re-rendered the
 * whole root on the client. Every visitor paid for the render twice, and the
 * paint timeline never resolved — PostHog was recording an LCP p75 of 25ms
 * against an FCP p75 of 2527ms, which is impossible and made all performance
 * data for this site meaningless.
 *
 * Gating on this hook makes render #1 match the server exactly (these elements
 * render nothing), then reveals them once hydration has completed.
 */
import { useEffect, useState } from "react";

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
