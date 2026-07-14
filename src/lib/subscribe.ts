/**
 * Email-engine subscription (Brunson Soap Opera Sequence).
 * Adds the subscriber to the VoiceLogPro Resend audience and triggers the
 * double-opt-in confirmation email; on confirm, the 5-email sequence is
 * scheduled automatically (days 0-4).
 *
 * Fire-and-forget by design: the waitlist insert is the source of truth for
 * beta spots, so a transient engine failure must never break the signup UX.
 */
const ENGINE_URL = "https://email-engine-fawn.vercel.app";

export async function subscribeToSequence(email: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENGINE_URL}/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: "voicelogpro", email: email.toLowerCase().trim() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
