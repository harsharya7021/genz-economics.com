#!/bin/bash
# ── Deploy firestore.rules to the genz-economics Firebase project. ──
#
#   RUN THIS FILE (double-click in Finder), or:
#     bash "/Users/harsharya/Library/Mobile Documents/com~apple~CloudDocs/Creative-Projects/Tantri Prof Series/genz-economics-site-repo/deploy-firestore-rules.command"
#
#   firestore.rules in this repo is the SOURCE OF TRUTH. Firestore replaces the
#   entire ruleset on every deploy, so editing one collection's block in the
#   console is how the others get silently dropped. Edit the file, run this.
#
#   Auth is the Firebase CLI's own browser login — no token is typed here and
#   nothing is stored by this script.

if [ -z "${BASH_VERSION:-}" ]; then exec /bin/bash "$0" "$@"; fi
set -euo pipefail
cd "$(dirname "$0")"

echo ""
echo "  Firestore rules → project genz-economics"
echo "  ─────────────────────────────────────────"

if ! command -v firebase >/dev/null 2>&1; then
  echo "  The Firebase CLI isn't installed. One of:"
  echo "     npm install -g firebase-tools"
  echo "     curl -sL https://firebase.tools | bash"
  echo ""
  echo "  Or skip the CLI entirely: open"
  echo "     https://console.firebase.google.com/project/genz-economics/firestore/rules"
  echo "  and paste the contents of firestore.rules over what's there, then Publish."
  exit 1
fi

if ! firebase projects:list >/dev/null 2>&1; then
  echo "  Not logged in. A browser window will open…"
  firebase login
fi

echo ""
echo "[1/3] Rules to be deployed (collections covered):"
grep -oE "match /[a-z_]+/\{" firestore.rules | sed 's/match \//      · /; s/\/{//' | sort -u
echo ""
echo "      Everything not listed above is denied by the catch-all."
echo ""

printf "  Deploy these rules to genz-economics? [y/N] "
read -r OK
case "$OK" in [yY]*) ;; *) echo "  Nothing deployed."; exit 0 ;; esac

echo ""
echo "[2/3] Deploying…"
firebase deploy --only firestore:rules --project genz-economics

echo ""
echo "[3/3] Done. Verify from the site:"
echo "      open https://genz-economics.com/wage-watch/ , sign in, and file a test report."
echo "      A permission-denied after this means the rules didn't take — check the"
echo "      console at https://console.firebase.google.com/project/genz-economics/firestore/rules"
echo ""
