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
set -uo pipefail
cd "$(dirname "$0")"

# Terminal prints "[Process completed]" whether this succeeded or failed, which
# is exactly how a silent early exit gets read as a successful deploy. So every
# exit goes through here: a loud verdict, and the window waits for a keypress.
FINISHED=""
finish() {
  local code="${1:-1}" msg="${2:-}"
  echo ""
  if [ "$code" = "0" ]; then
    echo "  ────────────────────────────────────────────"
    echo "   ✅  RULES DEPLOYED.  $msg"
    echo "  ────────────────────────────────────────────"
  else
    echo "  ────────────────────────────────────────────"
    echo "   ❌  NOTHING WAS DEPLOYED.  $msg"
    echo "  ────────────────────────────────────────────"
  fi
  echo ""
  FINISHED=1
  printf "  Press any key to close this window… "
  read -rsn 1 _ 2>/dev/null || true
  echo ""
  exit "$code"
}
trap '[ -n "$FINISHED" ] || finish 1 "The script stopped early — scroll up for the reason."' EXIT

echo ""
echo "  Firestore rules → project genz-economics"
echo "  ─────────────────────────────────────────"

if ! command -v firebase >/dev/null 2>&1; then
  echo ""
  echo "  The Firebase CLI is not installed, so nothing can be deployed from here."
  echo ""
  echo "  Two ways forward:"
  echo ""
  echo "   A) Install it now (npm install -g firebase-tools). Takes a minute or two."
  echo "   B) Skip the CLI — paste the rules into the console by hand:"
  echo "        https://console.firebase.google.com/project/genz-economics/firestore/rules"
  echo "      Select everything in the editor, paste firestore.rules over it, Publish."
  echo ""
  printf "  Install the CLI now? [y/N] "
  read -r WANT
  case "$WANT" in
    [yY]*)
      if ! command -v npm >/dev/null 2>&1; then
        finish 1 "npm isn't available either — use route B, the console paste."
      fi
      echo ""
      echo "  Installing firebase-tools globally…"
      npm install -g firebase-tools || finish 1 "npm install failed — try route B, the console paste."
      command -v firebase >/dev/null 2>&1 || finish 1 "Installed, but firebase still isn't on PATH. Open a new Terminal and run this file again."
      echo "      installed: $(firebase --version)"
      ;;
    *) finish 1 "Use route B above — the console paste needs nothing installed." ;;
  esac
fi

if ! firebase projects:list >/dev/null 2>&1; then
  echo "  Not logged in to Firebase. A browser window will open…"
  firebase login || finish 1 "Sign-in did not complete."
fi

echo ""
echo "[1/3] Rules to be deployed (collections covered):"
grep -oE "match /[a-z_]+/\{" firestore.rules | sed 's/match \//      · /; s/\/{//' | sort -u
echo ""
echo "      Everything not listed above is denied by the catch-all."
echo ""

printf "  Deploy these rules to genz-economics? [y/N] "
read -r OK
case "$OK" in [yY]*) ;; *) finish 1 "You answered no." ;; esac

echo ""
echo "[2/3] Deploying…"
if ! firebase deploy --only firestore:rules --project genz-economics; then
  finish 1 "The deploy command reported an error — the text above says why."
fi

echo ""
echo "[3/3] Verify from the site: open https://genz-economics.com/wage-watch/ ,"
echo "      sign in, and file a report. It should go straight through."
finish 0 "Live on genz-economics."
