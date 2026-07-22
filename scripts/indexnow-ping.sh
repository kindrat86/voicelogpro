#!/bin/bash
# IndexNow ping script for voicelogpro.com
# Uses the existing verified key: 433b2ad95d43bd41fee1f47bb42fd1fc
set -euo pipefail

HOST="voicelogpro.com"
KEY="433b2ad95d43bd41fee1f47bb42fd1fc"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
SITEMAP="https://${HOST}/sitemap.xml"
INDEXNOW_API="https://api.indexnow.org/IndexNow"

echo "Pinging IndexNow for ${HOST}..."

# Submit the sitemap URL for re-crawl (≤200 URLs implied via sitemap)
response=$(curl -s -w "\n%{http_code}" -X POST "${INDEXNOW_API}" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{
    \"host\": \"${HOST}\",
    \"key\": \"${KEY}\",
    \"keyLocation\": \"${KEY_LOCATION}\",
    \"urlList\": [
      \"https://${HOST}/\",
      \"https://${HOST}/court-ready-daily-logs\",
      \"https://${HOST}/lien-law-deadlines\",
      \"https://${HOST}/free/lien-deadline-calculator\",
      \"https://${HOST}/about\",
      \"https://${HOST}/crew-plan\",
      \"https://${HOST}/llms-full.txt\",
      \"https://${HOST}/sitemap.xml\"
    ]
  }")

http_code=$(echo "$response" | tail -1)
echo "Response: $http_code"

if [[ "$http_code" == "200" || "$http_code" == "202" ]]; then
  echo "✓ IndexNow ping successful"
else
  echo "⚠ IndexNow ping returned $http_code — may need manual verification"
fi
