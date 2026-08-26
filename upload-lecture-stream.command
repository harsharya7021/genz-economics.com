#!/bin/bash
# ── Upload a lecture recording to Cloudflare Stream, locked, and wire it in. ──
#
#   THE SUNDAY ROUTINE, in full:
#     1. save the Zoom export into its session folder, as always;
#     2. write the notes post (it needs `session:` in the front matter);
#     3. double-click "Upload lecture to Stream.command" in the Tantri Prof Series
#        folder — the one you are already standing in.
#   There is nothing to edit here first. The script finds the recording from the
#   folder, the date from the filename, and the session number and title from the
#   post — so a new lecture needs no change to this file, ever.
#
#   Or from a terminal:
#     bash "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Creative-Projects/Tantri Prof Series/genz-economics-site-repo/upload-lecture-stream.command"
#
#   Replaces the per-session scripts (upload-class4-stream.command etc.). It will:
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
#   Where the token comes from, in order:
#     1. $CF_TOKEN if already set in the environment;
#     2. your macOS Keychain, item "gze-cloudflare-stream" — read straight into
#        the API call, so you never paste it again;
#     3. prompted, hidden, with an offer to save it to the Keychain for next time.
#   Never written to a file, never stored in the resume state, unset on exit.

if [ -z "${BASH_VERSION:-}" ]; then exec /bin/bash "$0" "$@"; fi
set -euo pipefail

ACCOUNT="8339f8f6a38fa588539972b652e42c32"
CUST="customer-ymvws9hh7xkt34jv.cloudflarestream.com"
BASE="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Creative-Projects/Tantri Prof Series"
REPO="$BASE/genz-economics-site-repo"
CHUNK=$((50 * 1024 * 1024))     # 50 MiB — must stay a multiple of 256 KiB for tus

# ── auto-discovery: no catalogue to maintain ────────────────────────────────
# Every week a Zoom export lands in a session folder as GMT<YYYYMMDD>-*_Recording_*.mp4.
# That date is also the post's date, and the post carries its own session number —
# so the script can work the whole thing out rather than making you edit a list
# here before every upload. Drop the Zoom files in a folder, run this, done.
shopt -s nullglob
ROWS=()
SEEN=""
for MP4 in "$BASE"/*/GMT*_Recording_*.mp4; do
  DIR=$(basename "$(dirname "$MP4")")
  MP4N=$(basename "$MP4")
  D8=$(printf '%s' "$MP4N" | sed -E 's/^GMT([0-9]{8}).*/\1/')
  [ ${#D8} -eq 8 ] || continue
  ISO="${D8:0:4}-${D8:4:2}-${D8:6:2}"
  case "$SEEN" in *"|$ISO|"*) continue ;; esac   # same recording copied to two folders
  POST=""
  for p in "$REPO/_posts/$ISO-"*.md; do POST="$p"; break; done
  [ -n "$POST" ] || continue                      # a recording with no notes yet — skip
  SEEN="$SEEN|$ISO|"
  # `|| true` matters: set -e is on, and grep exits non-zero when a post has no
  # `session:` line (the older ones don't). Without this the whole script dies
  # silently on the first such post and prints nothing at all.
  SESS=$(grep -m1 '^session:' "$POST" 2>/dev/null | awk '{print $2}' || true)
  [ -n "$SESS" ] || continue
  TITLE=$(grep -m1 '^title:' "$POST" 2>/dev/null | sed -E 's/^title:[[:space:]]*"?//; s/"?[[:space:]]*$//' || true)
  [ -n "$TITLE" ] || TITLE="(untitled)"
  # captions: Zoom's closed-caption file if present, else the transcript VTT
  VTTN=""
  for v in "$BASE/$DIR/"*.cc.vtt; do VTTN=$(basename "$v"); break; done
  if [ -z "$VTTN" ]; then
    for v in "$BASE/$DIR/"*.transcript.vtt; do VTTN=$(basename "$v"); break; done
  fi
  ROWS+=("$SESS|$DIR|$MP4N|$VTTN|$(basename "$POST")|Session $SESS · $TITLE")
done
shopt -u nullglob

# folder order is alphabetical, which puts session 18 above session 1 — sort by
# the session number so the list reads the way you'd expect.
if [ ${#ROWS[@]} -gt 1 ]; then
  IFS=$'\n' ROWS=($(printf '%s\n' "${ROWS[@]}" | sort -t'|' -k1,1n)); unset IFS
fi

echo ""
echo "  Lecture recordings found"
echo "  ─────────────────────────"
AVAIL=()
for r in "${ROWS[@]}"; do
  IFS='|' read -r S DIR MP4N VTTN POSTN TITLE <<< "$r"
  MP4="$BASE/$DIR/$MP4N"; POST="$REPO/_posts/$POSTN"
  if grep -q '^stream_id: [0-9a-f]' "$POST" 2>/dev/null; then
    printf "   %-3s already live  · %s\n" "$S" "$TITLE"
    continue
  fi
  MB=$(( $(stat -f%z "$MP4" 2>/dev/null || stat -c%s "$MP4") / 1048576 ))
  printf "   %-3s %-44s %5s MB%s\n" "$S" "$TITLE" "$MB" "$([ -n "$VTTN" ] || echo '  (no captions)')"
  AVAIL+=("$r")
done
echo ""
[ ${#AVAIL[@]} -gt 0 ] || { echo "  Nothing pending — every recording with notes is already uploaded."; echo ""; exit 0; }

# The ordinary week has exactly one new recording waiting. Asking "which one?"
# when there is only one is the kind of small friction that stops a script being
# used, so in that case just take it — the confirmation prompt comes later anyway.
if [ ${#AVAIL[@]} -eq 1 ]; then
  PICK="${AVAIL[0]}"
  echo "  One recording pending — taking it."
else
  printf "  Which session number? "
  read -r WANT
  PICK=""
  for r in "${AVAIL[@]}"; do [ "${r%%|*}" = "$WANT" ] && PICK="$r"; done
  [ -n "$PICK" ] || { echo "  Session $WANT isn't in the pending list. Nothing done."; exit 1; }
fi

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

KEYCHAIN_ITEM="gze-cloudflare-stream"
SAVE_TOKEN=""
if [ -z "${CF_TOKEN:-}" ]; then
  CF_TOKEN=$(security find-generic-password -s "$KEYCHAIN_ITEM" -w 2>/dev/null || true)
  if [ -n "$CF_TOKEN" ]; then
    echo "  Token loaded from your Keychain — no paste needed."
  else
    printf "  Paste your Cloudflare API token (input is hidden): "
    read -rs CF_TOKEN; echo
    SAVE_TOKEN=1
  fi
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

# Offer the Keychain only after the token is proven good — a bad paste never gets saved.
if [ -n "$SAVE_TOKEN" ]; then
  echo ""
  printf "  Save this token to your Keychain so you never paste it again? [y/N] "
  read -r SAVEOK
  case "$SAVEOK" in
    [yY]*)
      if security add-generic-password -U -s "$KEYCHAIN_ITEM" -a "$USER" -w "$CF_TOKEN" 2>/dev/null; then
        echo "      saved — future runs pick it up automatically."
        echo "      (remove any time: security delete-generic-password -s $KEYCHAIN_ITEM)"
      else
        echo "      couldn't save; carrying on with this run anyway."
      fi
      ;;
    *) echo "      not saved." ;;
  esac
  echo ""
fi

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
