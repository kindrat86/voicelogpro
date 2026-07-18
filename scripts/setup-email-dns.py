#!/usr/bin/env python3
"""
One-shot email setup for voicelogpro.com — mirrors the signals@gitdealflow.com blueprint.

PREREQUISITES (both are one-time human actions):
  1. Namecheap: whitelist this machine's current public IP
     (namecheap.com -> Profile -> Tools -> API Access -> Whitelisted IPs).
  2. Resend: free a domain slot — either upgrade the plan or add voicelogpro.com
     from the dashboard. The account (key in ~/email-engine/.env) is at its limit:
     "Your plan includes 1 domain" with 4 grandfathered domains.

WHAT IT DOES (idempotent, safe getHosts -> merge -> setHosts):
  - Adds voicelogpro.com to Resend (eu-west-1) and pulls its DKIM/SPF records.
  - Rewrites Namecheap DNS for voicelogpro.com:
      * apex MX  -> mx1/mx2.forwardemail.net (replaces stale mx.resend.com)
      * apex TXT -> forward-email=sales@sipiteno.com   (inbound forwarding)
      * apex TXT -> v=spf1 include:_resend.resend.com include:spf.forwardemail.net ~all
                    (replaces stale sendgrid SPF)
      * send subdomain MX + SPF and resend._domainkey DKIM from Resend
      * every other existing record is preserved verbatim
  - Triggers Resend domain verification.
  - Reminds you to flip the sequence sender + redeploy the engine.

Run:  python3 scripts/setup-email-dns.py          (from ~/voicelogpro, uses ~/portfolio/.venv)
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path.home() / "portfolio"))
from lib.vault import Vault  # noqa: E402

DOMAIN_SLD, DOMAIN_TLD = "voicelogpro", "com"
DOMAIN = f"{DOMAIN_SLD}.{DOMAIN_TLD}"
FORWARD_TO = "sales@sipiteno.com"
# voicelogpro.com lives in the upgraded "sipiteno" Pro team (2026-07-14),
# not the grandfathered 4-domain team the engine's default key belongs to.
# Prefer the Pro-team key when it exists; the engine reads the same env name
# via `key_env: RESEND_API_KEY_PRO` in sequences/voicelogpro.yaml.
_ENV = (Path.home() / "email-engine/.env").read_text()
_pro = re.search(r"RESEND_API_KEY_PRO=(\S+)", _ENV)
RESEND_KEY = (_pro or re.search(r"RESEND_API_KEY=(\S+)", _ENV)).group(1)
if _pro:
    print("Using RESEND_API_KEY_PRO (sipiteno Pro team).")


def resend(path, method="GET", data=None):
    req = urllib.request.Request(
        f"https://api.resend.com{path}",
        data=json.dumps(data).encode() if data else None,
        headers={
            "Authorization": f"Bearer {RESEND_KEY}",
            "Content-Type": "application/json",
            # api.resend.com sits behind Cloudflare, which 1010-blocks
            # urllib's default UA; any explicit UA passes.
            "User-Agent": "voicelogpro-email-setup/1.0",
        },
        method=method,
    )
    try:
        return json.load(urllib.request.urlopen(req))
    except urllib.error.HTTPError as e:
        return {"statusCode": e.code, "message": e.read().decode()}


def namecheap(command, extra):
    v = Vault()
    user, key = v.get_key("NAMECHEAP_USERNAME"), v.get_key("NAMECHEAP_API_KEY")
    ip = urllib.request.urlopen("https://api.ipify.org", timeout=10).read().decode().strip()
    params = {
        "ApiUser": user, "ApiKey": key, "UserName": user, "ClientIp": ip,
        "Command": command, "SLD": DOMAIN_SLD, "TLD": DOMAIN_TLD, **extra,
    }
    url = "https://api.namecheap.com/xml.response?" + urllib.parse.urlencode(params)
    root = ET.fromstring(urllib.request.urlopen(url, timeout=30).read().decode())
    if root.attrib.get("Status") != "OK":
        errs = [e.text for e in root.iter() if e.tag.split("}")[-1] == "Error"]
        sys.exit(f"Namecheap API error ({command}): {errs} — is IP {ip} whitelisted?")
    return root


def main():
    # 1. Resend: add domain (or reuse), get DNS records
    print(f"[1/4] Adding {DOMAIN} to Resend…")
    dom = resend("/domains", "POST", {"name": DOMAIN, "region": "eu-west-1"})
    if dom.get("statusCode") == 403:
        sys.exit(f"Resend refused: {dom['message']}\n-> Free a domain slot first (see header).")
    if dom.get("statusCode"):  # already exists? find it
        existing = [d for d in resend("/domains")["data"] if d["name"] == DOMAIN]
        if not existing:
            sys.exit(f"Resend error: {dom}")
        dom = resend(f"/domains/{existing[0]['id']}")
    dkim = spf_send = None
    for rec in dom.get("records", []):
        if rec["record"] == "DKIM" and rec["type"] == "TXT":
            dkim = rec
        if rec["record"] == "SPF" and rec["type"] == "TXT":
            spf_send = rec
    print(f"      domain id {dom['id']}, dkim {'found' if dkim else 'MISSING'}")

    # 2. Namecheap: getHosts (NEVER setHosts without merging — it replaces everything)
    print("[2/4] Fetching current DNS records…")
    root = namecheap("namecheap.domains.dns.getHosts", {})
    hosts = []
    for h in root.iter():
        if h.tag.split("}")[-1] == "host":
            a = h.attrib
            hosts.append({"Name": a["Name"], "Type": a["Type"], "Address": a["Address"],
                          "MXPref": a.get("MXPref", "10"), "TTL": a.get("TTL", "1800")})
    print(f"      {len(hosts)} records")

    # 3. Merge: drop stale mail records, keep the rest, add the blueprint
    def stale(h):
        if h["Type"] == "MX" and h["Name"] == "@":
            return True  # replacing apex MX entirely
        if h["Type"] == "TXT" and h["Name"] == "@" and h["Address"].startswith("v=spf1"):
            return True  # replacing stale sendgrid SPF
        return False

    keep = [h for h in hosts if not stale(h)]
    add = [
        {"Name": "@", "Type": "MX", "Address": "mx1.forwardemail.net", "MXPref": "10", "TTL": "1800"},
        {"Name": "@", "Type": "MX", "Address": "mx2.forwardemail.net", "MXPref": "20", "TTL": "1800"},
        {"Name": "@", "Type": "TXT", "Address": f"forward-email={FORWARD_TO}", "MXPref": "10", "TTL": "1800"},
        {"Name": "@", "Type": "TXT", "Address": "v=spf1 include:_resend.resend.com include:spf.forwardemail.net ~all", "MXPref": "10", "TTL": "1800"},
    ]
    if dkim:
        add.append({"Name": dkim["name"].replace(f".{DOMAIN}", ""), "Type": "TXT",
                    "Address": dkim["value"], "MXPref": "10", "TTL": "1800"})
    if spf_send:
        add.append({"Name": spf_send["name"].replace(f".{DOMAIN}", ""), "Type": "TXT",
                    "Address": spf_send["value"], "MXPref": "10", "TTL": "1800"})
        add.append({"Name": spf_send["name"].replace(f".{DOMAIN}", ""), "Type": "MX",
                    "Address": "feedback-smtp.eu-west-1.amazonses.com", "MXPref": "10", "TTL": "1800"})

    merged, seen = [], set()
    for h in keep + add:
        sig = (h["Name"], h["Type"], h["Address"])
        if sig not in seen:
            seen.add(sig)
            merged.append(h)

    print(f"[3/4] Writing {len(merged)} records (kept {len(keep)}, added {len(add)})…")
    extra = {}
    for i, h in enumerate(merged, 1):
        extra[f"HostName{i}"] = h["Name"]
        extra[f"RecordType{i}"] = h["Type"]
        extra[f"Address{i}"] = h["Address"]
        extra[f"TTL{i}"] = h["TTL"]
        if h["Type"] == "MX":
            extra[f"MXPref{i}"] = h["MXPref"]
    extra["EmailType"] = "MX"
    namecheap("namecheap.domains.dns.setHosts", extra)
    print("      done.")

    # 4. Trigger Resend verification
    print("[4/4] Triggering Resend verification (DNS may take a few minutes)…")
    time.sleep(5)
    print("      verify response:", resend(f"/domains/{dom['id']}/verify", "POST"))

    print(f"""
NEXT STEPS
  1. Wait for Resend to show {DOMAIN} as "verified" (usually < 15 min).
  2. Flip the sequence sender:
       sed -i '' 's/^sender_email: .*/sender_email: hello@{DOMAIN}/' ~/email-engine/sequences/voicelogpro.yaml
  3. Redeploy the engine:  cd ~/email-engine && vercel deploy --prod
  4. Test inbound: send a mail to hello@{DOMAIN} — it should arrive at {FORWARD_TO}.
""")


if __name__ == "__main__":
    main()
