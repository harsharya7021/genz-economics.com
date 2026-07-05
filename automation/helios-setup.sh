#!/usr/bin/env bash
# ── BIL on Helios: one-paste setup ─────────────────────────────────────────────
# Fresh Ubuntu VPS → running BIL service + public HTTPS URL for the website.
#
# BEFORE running, from your Mac:
#   scp "~/Library/Mobile Documents/com~apple~CloudDocs/Creative-Projects/Tantri Prof Series/bil-corpus.zip" <you>@<helios>:~/
#
# THEN on Helios:   bash helios-setup.sh
# It will pause once to ask for your Anthropic API key (pasted directly into the
# VPS .env — it never travels anywhere else).
#
# When it finishes it prints BIL's public URL (https://….trycloudflare.com).
# Send that URL back to Claude to wire into bil.html.
# NOTE: the quick tunnel URL changes if cloudflared restarts. Fine for going live
# today; for a permanent URL later, point a subdomain (e.g. bil.genz-economics.com)
# at this box and put caddy in front — see "STABLE URL LATER" at the bottom.
set -euo pipefail

REPO_URL="https://github.com/harsharya7021/genz-economics.com.git"
DIR="$HOME/genz"

echo "── [1/7] system packages"
sudo apt-get update -y
sudo apt-get install -y git ffmpeg curl unzip ca-certificates

echo "── [2/7] node 20 + pm2"
if ! command -v node >/dev/null || [ "$(node -v | cut -c2-3)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo npm i -g pm2

echo "── [3/7] cloudflared"
if ! command -v cloudflared >/dev/null; then
  curl -fsSL -o /tmp/cloudflared.deb \
    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
  sudo dpkg -i /tmp/cloudflared.deb
fi

echo "── [4/7] repo + deps"
if [ -d "$DIR/.git" ]; then git -C "$DIR" pull; else git clone "$REPO_URL" "$DIR"; fi
cd "$DIR/automation"
npm install

echo "── [5/7] .env"
if [ ! -f .env ]; then
  cp .env.example .env
  BIL_TOKEN=$(openssl rand -hex 24)
  ANNOUNCE_TOKEN=$(openssl rand -hex 24)
  sed -i "s|^BIL_TOKEN=.*|BIL_TOKEN=$BIL_TOKEN|" .env
  sed -i "s|^ANNOUNCE_TOKEN=.*|ANNOUNCE_TOKEN=$ANNOUNCE_TOKEN|" .env
  grep -q FIREBASE_PROJECT_ID .env || echo "FIREBASE_PROJECT_ID=genz-economics" >> .env
  echo ""
  read -r -p "Paste your Anthropic API key (sk-ant-…): " ANTHROPIC_KEY
  sed -i "s|^ANTHROPIC_API_KEY=.*|ANTHROPIC_API_KEY=$ANTHROPIC_KEY|" .env
else
  echo ".env exists — leaving it alone"
fi

echo "── [6/7] corpus + index"
if [ -f "$HOME/bil-corpus.zip" ]; then
  mkdir -p corpus
  unzip -oq "$HOME/bil-corpus.zip" -d /tmp/corpus-unpack
  # zip contains a bil-corpus/ folder (with posts/ subdir) — flatten into corpus/
  find /tmp/corpus-unpack -type f \( -name '*.md' -o -name '*.txt' \) -exec cp {} corpus/ \;
  echo "corpus: $(ls corpus | wc -l) files"
else
  echo "!! ~/bil-corpus.zip not found — scp it over, then: cd $DIR/automation && npm run ingest"
fi
[ -f corpus/index.json ] || npm run ingest   # first run downloads the MiniLM model (~90MB), be patient

echo "── [7/7] services under pm2"
pm2 delete gze-bil >/dev/null 2>&1 || true
pm2 delete gze-bil-tunnel >/dev/null 2>&1 || true
pm2 start npm --name gze-bil -- run bil
pm2 start cloudflared --name gze-bil-tunnel -- tunnel --url http://localhost:8047 --no-autoupdate
pm2 save
pm2 startup -u "$USER" --hp "$HOME" | tail -1 | sudo bash || true

echo ""
echo "── waiting for the tunnel URL…"
sleep 8
URL=$(pm2 logs gze-bil-tunnel --lines 50 --nostream 2>/dev/null | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' | tail -1)
echo ""
echo "════════════════════════════════════════════════════"
echo "  BIL health:   curl -s localhost:8047/health"
curl -s localhost:8047/health || true
echo ""
echo "  PUBLIC URL:   ${URL:-<check: pm2 logs gze-bil-tunnel>}"
echo "  → send this URL back to Claude to wire into bil.html"
echo "════════════════════════════════════════════════════"

# ── STABLE URL LATER (optional) ────────────────────────────────────────────────
# 1. DNS: A record  bil.genz-economics.com → this VPS's IP
# 2. sudo apt install -y caddy
# 3. /etc/caddy/Caddyfile:
#        bil.genz-economics.com {
#            reverse_proxy localhost:8047
#        }
# 4. sudo systemctl reload caddy ; pm2 delete gze-bil-tunnel ; pm2 save
# 5. Tell Claude to point bil.html at https://bil.genz-economics.com/ask
