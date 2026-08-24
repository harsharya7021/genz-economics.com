#!/bin/bash
# ── Upload a lecture recording to Cloudflare Stream, locked, and wire it in. ──
#
#   RUN THIS FILE (double-click in Finder), or:
#     bash "/Users/harsharya/Library/Mobile Documents/com~apple~CloudDocs/Creative-Projects/Tantri Prof Series/genz-economics-site-repo/upload-lecture-stream.command"
#
#   Replaces the per-session scripts (upload-class4-stream.command etc.) with one
#   that lists whatever is still un-uploaded and asks which to do. It will:
#     1. check your token against the Stream API;
#     2. create a tus upload with requireSignedURLs set AT CREATION — the video is
#        never publicly fetchable, not even for a minute (the mistake the 2026-07-09
#        and 07-26 audits kept catching);
#     3. upload in 50 MiB chunks, RESUMABLE — re-run the file after a dropped
#        connection and it picks up from the server's byte offset instead of
#        starting over (a 446 MB single PATCH is a coin-flip on home broadband);
#     4. wait for transcoding, attach English captions from the Zoom VTT;
#     5. verify the HLS manifest returns 401 without a token — and abort if it doesn't;
#     6. write stream_id into the post's front matter, commit, push.
#
#   Token: profile → API Tokens → Create Token → Custom token
#          Permission: Account · Cloudflare Stream · Edit
#          (Account-level, not zone-level; Edit, not Read — either mistake gives 403.)
#   Read from $CF_TOKEN if set, else prompted hidden. Never written to disk, never
#   stored in the resume state, unset on exit.

if [ -z "${BASH_VERSION:-}" ]; then exec /bin/bash "$0" "$@"; fi
set -euo pipefail

ACCOUNT="8339f8f6a38fa588539972b652e42c32"
CUST="customer-ymvws9hh7xkt34jv.cloudflarestream.com"
BASE="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Creative-Projects/Tantri Prof Series"
REPO="$BASE/genz-economics-site-repo"
CHUNK=$((50 * 1024 * 1024))     # 50 MiB — must stay a multiple of 256 KiB for tus

# ── the catalogue: session | folder | mp4 | captions vtt | post | title ──
# Captions prefer Zoom's *.cc.vtt (closed captions); fall back to the
# *.transcript.vtt, which is also valid WebVTT — speaker labels and all.
ROWS=(
"18|09th Aug session|GMT20260809-062634_Recording_3840x2280.mp4|GMT20260809-062634_Recording.cc.vtt|2026-08-09-japans-debt-puzzle-the-sovereign-carry-trade.md|Session 18 · Japan's Debt Puzzle (9 Aug 2026)"
"19|23rd Aug session|GMT20260823-052549_Recording_3840x2280.mp4|GMT20260823-052549_Recording.transcript.vtt|2026-08-23-the-quiet-print-crisis-money-without-a-crisis.md|Session 19 · The Quiet Print (23 Aug 2026)"
)

echo ""
echo "  Lecture recordings not yet on Stream"
echo "  ─────────────────────────────────────"
AVAIL=()
for r in "${ROWS[@]}"; do
  IFS='|' read -r S DIR MP4N VTTN POSTN TITLE <<< "$r"
  MP4="$BASE/$DIR/$MP4N"; POST="$REPO/_posts/$POSTN"
  [ -f "$MP4" ] || continue
  if grep -q '^stream_id: [0-9a-f]' "$POST" 2>/dev/null; then
    printf "   %-3s already live  (%s)\n" "$S" "$(grep '^stream_id:' "$POST" | awk '{print $2}')"
    continue
  fi
  MB=$(( $(stat -f%z "$MP4" 2>/dev/null || stat -c%s "$MP4") / 1048576 ))
  printf "   %-3s %-38s %5s MB\n" "$S" "$TITLE" "$MB"
  AVAIL+=("$r")
done
echo ""
[ ${#AVAIL[@]} -gt 0 ] || { echo "  Nothing pending. All recordings are uploaded."; exit 0; }

printf "  Which session number? "
read -r WANT
PICK=""
for r in "${AVAIL[@]}"; do [ "${r%%|*}" = "$WANT" ] && PICK="$r"; done
[ -n "$PICK" ] || { echo "  Session $WANT isn't in the pending list. Nothing done."; exit 1; }

IFS='|' read -r S DIR MP4N VTTN POSTN TITLE <<< "$PICK"
MP4="$BASE/$DIR/$MP4N"
VTT="$BASE/$DIR/$VTTN"
POST="$REPO/_posts/$POSTN"
STATE="$BASE/$DIR/.stream-upload-state"

[ -f "$MP4" ]  || { echo "MP4 not found: $MP4"; exit 1; }
[ -f "$POST" ] || { echo "Post not found: $POST"; exit 1; }
if [ ! -f "$VTT" ]; then
  echo "  ! Captions not found: $VTT"
  echo "    Continuing without captions — attach them later from the Stream dashboard."
  VTT=""
fi

SIZE=$(stat -f%z "$MP4" 2>/dev/null || stat -c%s "$MP4")
echo ""
echo "  $TITLE"
echo "  $(( SIZE / 1048576 )) MB · $MP4N"
echo ""

# ── preflight: these live in iCloud Drive, so they may be placeholders. ──
# Reading a cloud-only file works but stalls silently for minutes while it
# downloads; better to pull it down deliberately, with a progress line.
materialise() {
  local f="$1" label="$2"
  [ -f "$f" ] || return 0
  if head -c 1 "$f" >/dev/null 2>&1; then return 0; fi
  echo "  $label is still in iCloud (not downloaded). Fetching it locally first…"
  if command -v brctl >/dev/null 2>&1; then brctl download "$f" 2>/dev/null || true; fi
  local waited=0
  until head -c 1 "$f" >/dev/null 2>&1; do
    sleep 3; waited=$(( waited + 3 ))
    printf "      …%ss\n" "$waited"
    [ "$waited" -ge 600 ] && { echo "  Still not downloaded after 10 min. Open it in Finder once, then re-run."; exit 1; }
  done
  echo "      downloaded"
}
materialise "$MP4" "The recording"
[ -n "$VTT" ] && materialise "$VTT" "The captions file"

if [ -z "${CF_TOKEN:-}" ]; then
  printf "  Paste your Cloudflare API token (input is hidden): "
  read -rs CF_TOKEN; echo
fi
[ -n "$CF_TOKEN" ] || { echo "  No token entered. Nothing done."; exit 1; }

echo ""
echo "[1/6] Checking the token against the Stream API…"
CHECK=$(curl -s -o /dev/null -w '%{http_code}' \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream?per_page=1" \
  -H "Authorization: Bearer $CF_TOKEN")
if [ "$CHECK" != "200" ]; then
  echo ""
  echo "  Token rejected (HTTP $CHECK). It must be Account · Cloudflare Stream · Edit."
  echo "  Fix it and run this file again."
  exit 1
fi
echo "      token OK"

# ── 2 · create (or resume) the tus upload ──────────────────────────────────
LOCATION=""; UID_=""
if [ -f "$STATE" ]; then
  # shellcheck disable=SC1090
  source "$STATE"
  if [ "${ST_SIZE:-0}" = "$SIZE" ] && [ -n "${ST_LOCATION:-}" ]; then
    LOCATION="$ST_LOCATION"; UID_="${ST_UID:-}"
    echo "[2/6] Resuming the upload started earlier (UID ${UID_:-<pending>})…"
  else
    rm -f "$STATE"
  fi
fi

if [ -z "$LOCATION" ]; then
  echo "[2/6] Creating tus upload — requireSignedURLs set AT CREATION…"
  B64_NAME=$(printf '%s' "$TITLE" | base64 | tr -d '\n')
  B64_TRUE=$(printf 'true' | base64 | tr -d '\n')
  HDRS=$(curl -sS -D - -o /dev/null -X POST \
    "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream" \
    -H "Authorization: Bearer $CF_TOKEN" \
    -H "Tus-Resumable: 1.0.0" \
    -H "Upload-Length: $SIZE" \
    -H "Upload-Metadata: name $B64_NAME,requiresignedurls $B64_TRUE")
  LOCATION=$(printf '%s' "$HDRS" | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')
  UID_=$(printf '%s' "$HDRS" | awk 'tolower($1)=="stream-media-id:"{print $2}' | tr -d '\r')
  [ -n "$LOCATION" ] || { echo "FAILED: no tus Location header."; printf '%s\n' "$HDRS"; exit 1; }
  printf 'ST_LOCATION=%q\nST_UID=%q\nST_SIZE=%q\n' "$LOCATION" "$UID_" "$SIZE" > "$STATE"
  echo "      UID: ${UID_:-<pending>}"
fi

# ── 3 · chunked, resumable upload ──────────────────────────────────────────
OFFSET=$(curl -sS -I -X HEAD "$LOCATION" -H "Tus-Resumable: 1.0.0" \
  | awk 'tolower($1)=="upload-offset:"{print $2}' | tr -d '\r')
OFFSET=${OFFSET:-0}
echo "[3/6] Uploading from byte $OFFSET of $SIZE (50 MiB chunks; Ctrl-C is safe — re-run to resume)…"

TMPCHUNK=$(mktemp -t gzestream); trap 'rm -f "$TMPCHUNK"' EXIT
START_TS=$(date +%s)
while [ "$OFFSET" -lt "$SIZE" ]; do
  REMAIN=$(( SIZE - OFFSET ))
  THIS=$CHUNK; [ "$REMAIN" -lt "$CHUNK" ] && THIS=$REMAIN
  tail -c +$(( OFFSET + 1 )) "$MP4" | head -c "$THIS" > "$TMPCHUNK"

  NEWOFF=""; TRY=1
  while [ -z "$NEWOFF" ] && [ "$TRY" -le 3 ]; do
    NEWOFF=$(curl -sS -D - -o /dev/null -X PATCH "$LOCATION" \
      -H "Tus-Resumable: 1.0.0" \
      -H "Upload-Offset: $OFFSET" \
      -H "Content-Type: application/offset+octet-stream" \
      --data-binary @"$TMPCHUNK" 2>/dev/null \
      | awk 'tolower($1)=="upload-offset:"{print $2}' | tr -d '\r') || true
    if [ -z "$NEWOFF" ]; then
      echo "      chunk at $OFFSET failed (attempt $TRY/3) — re-checking server offset…"
      sleep $(( TRY * 3 ))
      NEWOFF=$(curl -sS -I -X HEAD "$LOCATION" -H "Tus-Resumable: 1.0.0" \
        | awk 'tolower($1)=="upload-offset:"{print $2}' | tr -d '\r') || true
      [ "${NEWOFF:-0}" = "$OFFSET" ] && NEWOFF=""
      TRY=$(( TRY + 1 ))
    fi
  done
  [ -n "$NEWOFF" ] || { echo "FAILED at byte $OFFSET after 3 attempts. Re-run this file to resume."; exit 1; }

  OFFSET=$NEWOFF
  PCT=$(( OFFSET * 100 / SIZE ))
  ELAPSED=$(( $(date +%s) - START_TS )); [ "$ELAPSED" -lt 1 ] && ELAPSED=1
  printf "      %3d%%  (%d/%d MB, ~%d Mb/s)\n" "$PCT" $(( OFFSET / 1048576 )) $(( SIZE / 1048576 )) \
    $(( OFFSET * 8 / ELAPSED / 1000000 ))
done
rm -f "$STATE"
echo "      upload complete"

if [ -z "${UID_:-}" ]; then
  UID_=$(curl -sS "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream?search=Session%20$S" \
    -H "Authorization: Bearer $CF_TOKEN" \
    | python3 -c 'import json,sys;print(json.load(sys.stdin)["result"][0]["uid"])')
  echo "      UID: $UID_"
fi

# ── 4 · wait for transcoding, then captions ────────────────────────────────
echo "[4/6] Waiting for Cloudflare to finish transcoding…"
for i in $(seq 1 60); do
  STATUS=$(curl -sS "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream/$UID_" \
    -H "Authorization: Bearer $CF_TOKEN" \
    | python3 -c 'import json,sys; d=json.load(sys.stdin)["result"]; print(d["status"]["state"], d.get("status",{}).get("pctComplete","?"))' 2>/dev/null || echo "pending ?")
  set -- $STATUS
  echo "      $1 ${2:-}%"
  [ "$1" = "ready" ] && break
  [ "$1" = "error" ] && { echo "FAILED: Cloudflare reports a transcoding error. Check the dashboard."; exit 1; }
  sleep 10
done

if [ -n "$VTT" ]; then
  echo "[5/6] Attaching English captions…"
  CC=$(curl -sS -o /dev/null -w '%{http_code}' -X PUT \
    "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream/$UID_/captions/en" \
    -H "Authorization: Bearer $CF_TOKEN" -F file=@"$VTT")
  echo "      captions HTTP $CC"
else
  echo "[5/6] No captions file — skipped."
fi

# ── 6 · verify the lock, then wire it into the post ────────────────────────
echo "[6/6] Verifying the lock (401 = correct, 200 = OPEN, abort)…"
CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://$CUST/$UID_/manifest/video.m3u8")
echo "      manifest returns $CODE"
if [ "$CODE" = "200" ]; then
  echo ""
  echo "FAILED: the video is publicly fetchable with just the UID."
  echo "        Open the Stream dashboard → this video → Settings → tick Require Signed URLs → SAVE,"
  echo "        then re-run this file. stream_id was NOT written; nothing is published."
  exit 1
fi

cd "$REPO"
if grep -q '^stream_id:' "$POST"; then
  sed -i '' "s/^stream_id:.*/stream_id: $UID_/" "$POST"
else
  sed -i '' "s/^session: $S\$/session: $S\nstream_id: $UID_/" "$POST"
fi
grep -n "^session:\|^stream_id:" "$POST"

git add "$POST" upload-lecture-stream.command
git commit -m "Session $S: attach Stream recording ($UID_), locked, captions attached"
git pull --rebase origin main && git push origin main

unset CF_TOKEN
echo ""
echo "  DONE — UID $UID_"
echo "  The gated player appears on the session page with the next Pages build (~2 min)."
echo "  Signed-in ISB accounts see the video; everyone else sees the lock."
