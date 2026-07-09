#!/bin/bash
# ── Lock the four unlocked lecture videos — one run. ────────────────────
# The audit (2026-07-09) found 4 of 12 Stream videos still publicly
# fetchable (uploaded after the original batch was locked):
#   a2881c1d…  c01169f6…  adcedc67…  8063b82d…
# This flips requireSignedURLs: true on each, then re-checks all twelve.
#
# Needs the same kind of Cloudflare API token as finish-video-gate.command
# (profile → API Tokens → Custom → Account · Cloudflare Stream · Edit).
# The token is read hidden and never stored.
set -euo pipefail
ACCOUNT="8339f8f6a38fa588539972b652e42c32"
CUST="customer-ymvws9hh7xkt34jv.cloudflarestream.com"
UIDS="a2881c1d3bc6f1b883e5cf3d7d3b337f c01169f63a21fdf82ef510e5c7427a3d adcedc67d9bd78e0ae36504819ac6287 8063b82d0e773efd99b46b357b4be90e"

printf "Paste your Cloudflare API token (input is hidden): "
read -rs CF_TOKEN; echo

for uid in $UIDS; do
  ok=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream/$uid" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
    -d '{"requireSignedURLs":true}' | python3 -c "import json,sys; print(json.load(sys.stdin).get('success'))")
  echo "  $uid → requireSignedURLs: $ok"
done
unset CF_TOKEN

echo
echo "Re-checking all twelve (401 = locked, correct; 200 = still open):"
ALL="a2881c1d3bc6f1b883e5cf3d7d3b337f 17f8a109d81ce28cf9367ce0aae9397c c01169f63a21fdf82ef510e5c7427a3d dd4425ba5997ad1ecd120ae5da33cd91 004b24e6f61e3a54286e550470d1ba37 09f54f9eab7e396a9b53e9db2aa16364 a976cb1dd2413069f7a7b72a79c27e20 36d1cfc3241277993b082b9adbe76775 a3feaa9e95e125c5fe8d7607597b444e 496015c69069e0f44a91ada4253f66a2 adcedc67d9bd78e0ae36504819ac6287 8063b82d0e773efd99b46b357b4be90e"
for uid in $ALL; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://$CUST/$uid/manifest/video.m3u8")
  echo "  ${uid:0:8}… → $code"
done
echo "Done. Every line should read 401."
