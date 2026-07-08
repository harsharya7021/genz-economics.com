#!/bin/bash
# ── Finish the Decap CMS editor — one run, ~2 minutes. ─────────────────
# The OAuth broker Worker is already deployed at
#   https://gze-decap-oauth.harsharya7021.workers.dev
# and admin/config.yml already points at it. It fails closed until the two
# secrets below exist.
#
# Before running, create the GitHub OAuth App (~2 min):
#   GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
#     Application name:  Gen Z Economics CMS
#     Homepage URL:      https://genz-economics.com
#     Callback URL:      https://gze-decap-oauth.harsharya7021.workers.dev/callback
#   Register → Generate a new client secret → keep the ID + Secret handy.
#
# This script pipes both values straight into `wrangler secret put` —
# hidden input, nothing stored, nothing printed.
set -euo pipefail
cd "$(dirname "$0")/cloudflare/decap-oauth"
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH

printf "GitHub OAuth Client ID (input hidden): "
read -rs CID; echo
printf "GitHub OAuth Client Secret (input hidden): "
read -rs CSECRET; echo

printf '%s' "$CID"     | npx --yes wrangler secret put GITHUB_CLIENT_ID
printf '%s' "$CSECRET" | npx --yes wrangler secret put GITHUB_CLIENT_SECRET
unset CID CSECRET

echo
echo "✓ Done. Test it: https://genz-economics.com/admin/ → Login with GitHub → edit → Publish."
echo "  To give the professor his editor login later: repo → Settings → Collaborators →"
echo "  add his GitHub account (write access = editorial rights)."
