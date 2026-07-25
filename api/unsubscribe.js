// Unsubscribe endpoint for VoiceLogPro subscribers.
//
//   GET  /api/unsubscribe?email=X          -> confirmation page with a POST button
//   GET  /api/unsubscribe?email=X&t=<sig>  -> unsubscribes immediately (one-click)
//   POST /api/unsubscribe  (email in query or body) -> unsubscribes
//
// Changed 2026-07-25 (portfolio-wide audit). Three defects:
//  1. A bare GET mutated state for any address, so anyone could unsubscribe any
//     subscriber they could guess, and mail-security link scanners and
//     prefetchers were silently unsubscribing real recipients who never clicked.
//     Verified exploitable live. Links already sent carry no signature, so
//     REQUIRING one would strand real recipients with no way to opt out — worse
//     than the bug. Hence: unsigned GET renders a one-click confirmation POST;
//     a signed GET (UNSUB_SECRET) and POST act directly, so RFC 8058 one-click
//     still works. HEAD answers but never mutates, since scanners HEAD links and
//     a 405 makes them report the unsubscribe link broken.
//  2. `audience` came from the query string straight into the Resend API path, so
//     a caller could aim this at any audience in the account, or bend the path.
//     Now UUID-validated and treated as an override of this site's own audience.
//  3. It always rendered "You have been unsubscribed" — the catch block said
//     "Still return success page — user-facing experience matters more" — so a
//     Resend outage produced people who believed they had opted out and had not.
//     A failure the user cannot see is not a better experience.
//
// NOTE: the pre-existing `token` query parameter is still accepted so links
// already in the wild keep working; it is treated as presence-only metadata from
// Resend, never as proof of intent. Only `t` (our HMAC) authorises a silent GET.

const { createHmac, timingSafeEqual } = require("node:crypto");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SUPPORT = "support@voicelogpro.com";

function sign(email, secret) {
  return createHmac("sha256", secret)
    .update(String(email).trim().toLowerCase())
    .digest("base64url")
    .slice(0, 32);
}

function validToken(email, t, secret) {
  if (!secret || !t) return false;
  const a = Buffer.from(sign(email, secret));
  const b = Buffer.from(String(t));
  return a.length === b.length && timingSafeEqual(a, b);
}

module.exports = async function handler(req, res) {
  const isHead = req.method === "HEAD";
  if (req.method !== "GET" && req.method !== "POST" && !isHead) {
    res.setHeader("Allow", "GET, HEAD, POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const q = req.query || {};
  const b = req.body || {};
  const email = String(q.email != null ? q.email : b.email != null ? b.email : "").trim();
  const sig = String(q.t != null ? q.t : b.t != null ? b.t : "").trim();
  const requested = String(q.audience != null ? q.audience : b.audience != null ? b.audience : "").trim();

  if (!email) {
    res.status(400).send(page("error", "This unsubscribe link is missing an email address."));
    return;
  }
  if (!EMAIL_RE.test(email)) {
    res.status(400).send(page("error", "That does not look like a valid email address."));
    return;
  }

  if (isHead || (req.method === "GET" && !validToken(email, sig, process.env.UNSUB_SECRET))) {
    res.status(200).send(confirmPage(email, requested));
    return;
  }

  const key = process.env.RESEND_API_KEY;
  const audienceId = UUID_RE.test(requested)
    ? requested
    : String(process.env.RESEND_AUDIENCE_ID || "");

  if (!key || !UUID_RE.test(audienceId)) {
    res.status(200).send(page("error",
      "The unsubscribe service is temporarily unavailable. Email " + SUPPORT +
      " and we will remove you by hand."));
    return;
  }

  let ok = false;
  try {
    const resp = await fetch(
      "https://api.resend.com/audiences/" + audienceId + "/contacts/" + encodeURIComponent(email),
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unsubscribed: true }),
      }
    );
    // 404 = not on this audience. Treat as success: the outcome asked for already
    // holds, and saying so avoids confirming who is on the list.
    ok = resp.ok || resp.status === 404;
    if (!ok) console.error("Unsubscribe PATCH failed", resp.status);
  } catch (err) {
    console.error("Unsubscribe PATCH threw", err && err.message);
  }

  res.status(200).send(ok
    ? page("ok", email)
    : page("error", "We could not complete that just now. Email " + SUPPORT +
        " and we will remove you by hand."));
};

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    var m = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return m[c] || c;
  });
}

var STYLE = "*{margin:0;padding:0;box-sizing:border-box}body{background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}.card{background:#fff;border-radius:16px;padding:48px 40px;max-width:480px;width:100%;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.06)}.check{width:64px;height:64px;background:#f0fdf4;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:20px}h1{font-size:22px;color:#1e293b;margin-bottom:8px}p{font-size:15px;color:#64748b;line-height:1.6}p+p{margin-top:12px}.email{font-weight:600;color:#1e293b}button{margin-top:24px;width:100%;padding:14px 20px;font:inherit;font-weight:600;color:#06251f;background:#00d4aa;border:0;border-radius:10px;cursor:pointer}button:hover{filter:brightness(.95)}.footer{margin-top:24px;font-size:12px;color:#94a3b8}a{color:#00d4aa;text-decoration:none}";

function shell(title, icon, heading, body) {
  return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="robots" content="noindex, nofollow">' +
    "<title>" + title + " — VoiceLogPro</title><style>" + STYLE + "</style></head>" +
    '<body><div class="card"><div class="check">' + icon + "</div><h1>" + heading + "</h1>" +
    body +
    '<p class="footer"><a href="https://voicelogpro.com">voicelogpro.com</a></p>' +
    "</div></body></html>";
}

/** Explicit confirmation for unsigned GETs — still one click, but a human's. */
function confirmPage(email, audience) {
  var aud = UUID_RE.test(audience)
    ? '<input type="hidden" name="audience" value="' + esc(audience) + '">'
    : "";
  return shell("Confirm unsubscribe", "&#9993;", "Confirm you want to unsubscribe",
    "<p>Click below and <span class=\"email\">" + esc(email) +
    "</span> will stop receiving VoiceLogPro emails.</p>" +
    '<form method="POST" action="/api/unsubscribe">' +
    '<input type="hidden" name="email" value="' + esc(email) + '">' + aud +
    '<button type="submit">Unsubscribe me</button></form>');
}

function page(kind, detail) {
  if (kind === "ok") {
    return shell("Unsubscribed", "&#10003;", "You have been unsubscribed",
      '<p><span class="email">' + esc(detail) +
      "</span> has been removed from VoiceLogPro.</p><p>You will no longer receive emails from us.</p>");
  }
  return shell("Unsubscribe", "&#9888;", "We hit a problem", "<p>" + esc(detail) + "</p>");
}
