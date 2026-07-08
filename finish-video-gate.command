#!/bin/bash
# ── Finish the video hard-gate — one run, about a minute. ──────────────
# The Worker (gze-stream-token) is already deployed and the site already
# points at it; it fails CLOSED until the two secrets below exist.
#
# Before running, create a Cloudflare API token (shown once, keep it handy):
#   dashboard → profile icon (top right) → API Tokens → Create Token →
#   Custom token → permission: Account → Cloudflare Stream → Edit →
#   scope: this account → Continue → Create.
#
# What this script does — all on THIS machine, nothing leaves your terminal:
#   1. asks for that token (input hidden, never stored),
#   2. creates the Stream signing key (Cloudflare shows the private key ONCE),
#   3. saves the full response to ~/.gze-stream-signing-key.json (chmod 600,
#      outside the repo — your only copy, don't delete it),
#   4. pipes the key id + PEM straight into `wrangler secret put` (never printed),
#   5. done — lecture videos start playing for signed-in ISB folks.
set -euo pipefail
cd "$(dirname "$0")/cloudflare/stream-signed-urls"
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH

ACCOUNT="8339f8f6a38fa588539972b652e42c32"
OUT="$HOME/.gze-stream-signing-key.json"

if [ -s "$OUT" ]; then
  echo "A signing key file already exists at $OUT — reusing it (no new key created)."
else
  printf "Paste your Cloudflare API token (input is hidden): "
  read -rs CF_TOKEN; echo
  echo "Creating the Stream signing key…"
  curl -sf -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/stream/keys" \
    -H "Authorization: Bearer $CF_TOKEN" \
    -H "Content-Type: application/json" > "$OUT"
  chmod 600 "$OUT"
  unset CF_TOKEN
fi

python3 - "$OUT" <<'PY'
import json, sys
d = json.load(open(sys.argv[1]))
if not d.get("success"):
    print("Cloudflare said no:", json.dumps(d.get("errors", d))[:400]); sys.exit(1)
print("Signing key created. id:", d["result"]["id"])
PY

echo "Storing the two Worker secrets (values are piped, never displayed)…"
python3 -c "import json;print(json.load(open('$OUT'))['result']['id'],end='')"  | npx --yes wrangler secret put STREAM_SIGNING_KEY_ID
python3 -c "import json;print(json.load(open('$OUT'))['result']['pem'],end='')" | npx --yes wrangler secret put STREAM_SIGNING_KEY_PEM

echo
echo "✓ Done. The hard gate is live."
echo "  Test: open a session page signed in with an ISB account — video should play."
echo "  Signed out (or non-ISB), it must stay locked."
echo "  Key backup: $OUT — private, chmod 600, not in the repo. Keep it."
