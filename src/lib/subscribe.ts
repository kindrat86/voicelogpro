/**
 * Email subscription — posts to the portfolio-wide Mac mini /subscribe endpoint
 * (SQLite + Resend). The lead is stored locally on the Mac mini and a branded
 * welcome is sent via Resend from hello@voicelogpro.com.
 *
 * Fire-and-forget by design: the waitlist insert is the source of truth for
 * beta spots, so a transient network failure must never break the signup UX.
 */
const SUBSCRIBE_URL = "https://api.carshake.online/subscribe";

export async function subscribeToSequence(email: string, heardFrom?: string): Promise<boolean> {
  try {
    const res = await fetch(SUBSCRIBE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: "voicelogpro",
        email: email.toLowerCase().trim(),
        // Attribution passthrough.
        ...(heardFrom ? { source: heardFrom } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
