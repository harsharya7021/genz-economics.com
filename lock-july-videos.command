#!/bin/bash
# ── Lock the two July lecture videos, then re-check all seventeen. ──────
#
#   RUN THIS FILE. DO NOT PASTE ITS CONTENTS INTO A TERMINAL.
#   Double-click it in Finder, or:
#     bash "/Users/harsharya/Library/Mobile Documents/com~apple~CloudDocs/Creative-Projects/Tantri Prof Series/genz-economics-site-repo/lock-july-videos.command"
#
#   Pasting into zsh breaks it: zsh does not word-split $UIDS, so the loop
#   runs once with both IDs jammed into one malformed URL.
#
# Audit (2026-07-26) found the two newest Stream videos publicly fetchable —
# their HLS manifests return 200 with no token. Everything else returns 401.
#
#   0e0bf258…  2026-07-19  Class 3  Cheap Money and the Risk You Cannot See
#   98dd7b43…  2026-07-05  Class 2  The Cheap Rupee: A Discount, Not a Crisis
#
# Token: profile → API Tokens → Custom → Account · Cloudflare Stream · Edit
# Read hidden, never stored, unset before the verify pass.

# Re-exec under bash if somehow started by another shell.
if [ -z "${BASH_VERSION:-}" ]; then exec /bin/bash "$0" "$@"; fi
set -euo pipefail

ACCOUNT="8339f8f6a38fa588539972b652e42c32"
CUST="customer-ymvws9hh7xkt34jv.cloudflarestream.com"
UIDS=(0e0bf25821927b19742ba145d3cd63b3 98dd7b431ed0cb67be709780e7db3d0e)

ALL=(0e0bf25821927b19742ba145d3cd63b3 98dd7b431ed0cb67be709780e7db3d0e
     8fddc8169b689e8c1eb0a9b5c2029525 adcedc67d9bd78e0ae36504819ac6287
     0b37a87dfefabdbcdde16e0c8d88dcb4 c01169f63a21fdf82ef510e5c7427a3d
     8063b82d0e773efd99b46b357b4be90e 36d1cfc3241277993b082b9adbe76775
     a2881c1d3bc6f1b883e5cf3d7d3b337f 09f54f9eab7e396a9b53e9db2aa16364
     a976cb1dd2413069f7a7b72a79c27e20 004b24e6f61e3a54286e550470d1ba37
     a3feaa9e95e125c5fe8d7607597b444e 17f8a109d81ce28cf9367ce0aae9397c
     dd4425ba5997ad1ecd120ae5da33cd91 4414e5f39cc203bb5799cb6cbf82eb9f
     496015c69069e0f44a91ada4253f66a2)

printf "Paste your Cloudflare API token (input is hidden): "
read -rs CF_TOKEN; echo
if [ -z "$CF_TOKEN" ]; then echo "No token entered. Nothing done."; exit 1; fi

echo
echo "Locking ${#UIDS[@]} videos:"
for uid in "${UIDS[@]}"; do
  resp=$(curl -sS -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream/$uid" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
    -d '{"requireSignedURLs":true}' 2>&1 || true)

  case "$resp" in
    *'"success":true'*)  echo "  ${uid:0:8}… → locked" ;;
    *'"success":false'*) echo "  ${uid:0:8}… → FAILED: $(printf '%s' "$resp" \
                           | sed -n 's/.*"message":"\([^"]*\)".*/\1/p' | head -1)" ;;
    "")                  echo "  ${uid:0:8}… → FAILED: empty response (network?)" ;;
    *)                   echo "  ${uid:0:8}… → FAILED: unexpected response"
                         printf '      %.180s\n' "$resp" ;;
  esac
done
unset CF_TOKEN

echo
echo "Re-checking all ${#ALL[@]} (401 = locked, correct; 200 = still open):"
fail=0
for uid in "${ALL[@]}"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://$CUST/$uid/manifest/video.m3u8" || echo "ERR")
  if [ "$code" = "401" ]; then mark="ok  "; else mark="OPEN"; fail=1; fi
  echo "  $mark ${uid:0:8}… → $code"
done

echo
if [ "$fail" = "0" ]; then
  echo "All ${#ALL[@]} locked."
else
  echo "SOME STILL OPEN — see the OPEN lines above."
  exit 1
fi
