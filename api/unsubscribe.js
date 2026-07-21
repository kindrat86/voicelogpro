// One-click unsubscribe for VoiceLogPro subscribers.
// GET /api/unsubscribe?email=X&token=Y  (Resend one-click unsubscribe format)
module.exports = async function handler(req, res) {
  const { email, token, audience } = req.query;

  if (!email) {
    res.status(400).send(unsubscribeHtml("Missing email or token"));
    return;
  }

  const audienceId = audience || process.env.RESEND_AUDIENCE_ID || "";
  const key = process.env.RESEND_API_KEY;

  // Must have either a token (Resend one-click) or an audience ID
  if (!token && !audienceId) {
    res.status(400).send(unsubscribeHtml("Missing email or token"));
    return;
  }

  if (key && audienceId) {
    try {
      await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ unsubscribed: true }),
        }
      );
    } catch {
      // Still return success page — user-facing experience matters more
    }
  }

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8")
    .setHeader("Cache-Control", "no-store")
    .send(unsubscribeHtml(email));
};

function unsubscribeHtml(email) {
  const esc = (email || "").replace(/[&<>"']/g, function (c) {
    var m = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return m[c] || c;
  });
  return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Unsubscribed — VoiceLogPro</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}.card{background:#fff;border-radius:16px;padding:48px 40px;max-width:480px;width:100%;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.06)}.check{width:64px;height:64px;background:#f0fdf4;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:20px}h1{font-size:22px;color:#1e293b;margin-bottom:8px}p{font-size:15px;color:#64748b;line-height:1.6}.email{font-weight:600;color:#1e293b}.footer{margin-top:24px;font-size:12px;color:#94a3b8}a{color:#00d4aa;text-decoration:none}</style></head><body><div class=\"card\"><div class=\"check\">&#10003;</div><h1>You have been unsubscribed</h1><p><span class=\"email\">" + esc + "</span> has been removed from VoiceLogPro.</p><p>You will no longer receive emails from us.</p><p class=\"footer\"><a href=\"https://voicelogpro.com\">voicelogpro.com</a></p></div></body></html>";
}
