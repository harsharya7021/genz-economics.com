#!/bin/bash
# ── Upload Class 4 (9 Aug 2026, Session 18) to Cloudflare Stream and wire it up. ──
#
#   RUN THIS FILE (double-click in Finder), or:
#     bash "/Users/harsharya/Library/Mobile Documents/com~apple~CloudDocs/Creative-Projects/Tantri Prof Series/genz-economics-site-repo/upload-class4-stream.command"
#
#   It will, in order:
#     1. tus-upload the 238 MB MP4 with requireSignedURLs set AT CREATION
#        (so the video is never publicly fetchable, not even for a minute —
#        the mistake the 2026-07-09 and 07-26 audits kept catching);
#     2. attach English captions from the Zoom cc.vtt;
#     3. verify the HLS manifest returns 401 without a token;
#     4. write the UID into the Session 18 post's front matter;
#     5. commit and push (site goes live in ~2 minutes).
#
#   Token: profile → API Tokens → Custom → Account · Cloudflare Stream · Edit.
#   Read from $CF_TOKEN if set, else prompted hidden. Never stored.

if [ -z "${BASH_VERSION:-}" ]; then exec /bin/bash "$0" "$@"; fi
set -euo pipefail

ACCOUNT="8339f8f6a38fa588539972b652e42c32"
CUST="customer-ymvws9hh7xkt34jv.cloudflarestream.com"
BASE="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Creative-Projects/Tantri Prof Series"
MP4="$BASE/09th Aug session/GMT20260809-062634_Recording_3840x2280.mp4"
VTT="$BASE/09th Aug session/GMT20260809-062634_Recording.cc.vtt"
REPO="$BASE/genz-economics-site-repo"
POST="$REPO/_posts/2026-08-09-japans-debt-puzzle-the-sovereign-carry-trade.md"
TITLE="Session 18 · Japan's Debt Puzzle (9 Aug 2026)"

[ -f "$MP4" ] || { echo "MP4 not found: $MP4"; exit 1; }
[ -f "$VTT" ] || { echo "Captions not found: $VTT"; exit 1; }

if [ -z "${CF_TOKEN:-}" ]; then
  printf "Paste your Cloudflare API token (input is hidden): "
  read -rs CF_TOKEN; echo
fi
[ -n "$CF_TOKEN" ] || { echo "No token entered. Nothing done."; exit 1; }

echo "[0/5] Checking the token against the Stream API…"
CHECK=$(curl -s -o /dev/null -w '%{http_code}' \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream?per_page=1" \
  -H "Authorization: Bearer $CF_TOKEN")
if [ "$CHECK" != "200" ]; then
  echo ""
  echo "  Token rejected (HTTP $CHECK). The token must be:"
  echo "    profile → API Tokens → Create Token → Custom token"
  echo "    Permission:  Account · Cloudflare Stream · Edit"
  echo "    (Account-level, not zone-level; Edit, not Read — either mistake gives 403.)"
  echo "  Create/adjust it, then run this file again."
  exit 1
fi
echo "      token OK"

SIZE=$(stat -f%z "$MP4" 2>/dev/null || stat -c%s "$MP4")
B64_NAME=$(printf '%s' "$TITLE" | base64)
B64_TRUE=$(printf 'true' | base64)

echo "[1/5] Creating tus upload (size $SIZE bytes, requireSignedURLs at creation)…"
HDRS=$(curl -sS -D - -o /dev/null -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Tus-Resumable: 1.0.0" \
  -H "Upload-Length: $SIZE" \
  -H "Upload-Metadata: name $B64_NAME,requiresignedurls $B64_TRUE")
LOCATION=$(printf '%s' "$HDRS" | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')
UID_=$(printf '%s' "$HDRS" | awk 'tolower($1)=="stream-media-id:"{print $2}' | tr -d '\r')
[ -n "$LOCATION" ] || { echo "FAILED: no tus Location header. Response headers:"; echo "$HDRS"; exit 1; }
echo "      UID: ${UID_:-<pending>}"

echo "[2/5] Uploading the file (single PATCH — a few minutes on home broadband)…"
curl -sS -X PATCH "$LOCATION" \
  -H "Tus-Resumable: 1.0.0" \
  -H "Upload-Offset: 0" \
  -H "Content-Type: application/offset+octet-stream" \
  --data-binary @"$MP4" \
  -o /dev/null -w "      upload done, HTTP %{http_code}, %{speed_upload} B/s\n"

if [ -z "${UID_:-}" ]; then
  UID_=$(curl -sS "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream?search=$(python3 -c 'import urllib.parse;print(urllib.parse.quote("Session 18"))')" \
    -H "Authorization: Bearer $CF_TOKEN" | python3 -c 'import json,sys;print(json.load(sys.stdin)["result"][0]["uid"])')
fi
echo "      UID: $UID_"

echo "[3/5] Attaching captions (en) from the Zoom cc.vtt…"
curl -sS -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream/$UID_/captions/en" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -F file=@"$VTT" -o /dev/null -w "      captions HTTP %{http_code}\n"

echo "[4/5] Verifying the lock (401 = correct, 200 = OPEN — abort)…"
sleep 5
CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://$CUST/$UID_/manifest/video.m3u8")
echo "      manifest returns $CODE"
if [ "$CODE" = "200" ]; then
  echo "FAILED: video is publicly fetchable. Fix in dash (Require Signed URLs) before publishing."; exit 1
fi

echo "[5/5] Writing stream_id into the post, committing, pushing…"
cd "$REPO"
if grep -q '^stream_id:' "$POST"; then
  sed -i '' "s/^stream_id:.*/stream_id: $UID_/" "$POST"
else
  sed -i '' "s/^session: 18$/session: 18\nstream_id: $UID_/" "$POST"
fi
grep -n "stream_id" "$POST"
git add "$POST" _config.yml upload-class4-stream.command
git commit -m "Session 18: attach Stream recording ($UID_), captions from Zoom cc.vtt"
git pull --rebase origin main && git push origin main

unset CF_TOKEN
echo "UID=$UID_ DONE — post player goes live with the next Pages build (~2 min)."
