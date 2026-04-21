#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# import-docs.sh
# Converts source .docx session notes into Jekyll posts.
#
# Usage:
#   1. Put all .docx files into ./source-docs/ (at the repo root).
#   2. bash scripts/import-docs.sh
#
# Requires: pandoc >= 2.9. Install:
#   macOS:  brew install pandoc
#   Ubuntu: sudo apt install pandoc
# ─────────────────────────────────────────────────────────────

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT/source-docs"
POSTS_DIR="$ROOT/_posts"
IMG_BASE="$ROOT/assets/images"

if ! command -v pandoc >/dev/null; then
  echo "pandoc not found. Install it first (brew install pandoc / apt install pandoc)."
  exit 1
fi

if [ ! -d "$SRC_DIR" ]; then
  echo "Expected source folder: $SRC_DIR"
  echo "Create it and drop the session .docx files inside."
  exit 1
fi

# Filename → post slug mapping. Edit here to add new sessions.
declare -A MAP=(
  ["Session 1 - Oct 2 - Economy in the Long Run.docx"]="2025-10-02-economy-in-the-long-run"
  ["Session 2 - Oct 19 - The Keynesian Cross.docx"]="2025-10-19-the-keynesian-cross"
  ["Session 3 - Nov 9 - Aggregate Demand & Monetary Policy.docx"]="2025-11-09-aggregate-demand-and-monetary-policy"
  ["Session 3A - Nov 16 - IS-MP Framework & Modern Monetary Policy.docx"]="2025-11-16-is-mp-framework-and-modern-monetary-policy"
  ["Session 4 - Nov 23 - IS-LM Framework & Fiscal Policy.docx"]="2025-11-23-is-lm-framework-and-fiscal-policy"
  ["Session 5 - Dec 4 - Real Exchange Rates & Productivity.docx"]="2025-12-04-real-exchange-rates-and-productivity"
  ["Session 6 - Jan 11 - Exchange Rates, Inflation & Interest Rate Parity.docx"]="2026-01-11-exchange-rates-inflation-and-interest-rate-parity"
  ["Budget Discussion - Union Budget 2025-26 Analysis.docx"]="2025-02-22-union-budget-2025-26-analysis"
)

for src in "${!MAP[@]}"; do
  slug="${MAP[$src]}"
  src_path="$SRC_DIR/$src"
  post_path="$POSTS_DIR/$slug.md"
  img_path="$IMG_BASE/$slug"

  if [ ! -f "$src_path" ]; then
    echo "  skip  $src  (not found)"
    continue
  fi

  mkdir -p "$img_path"

  # Preserve existing front matter by extracting it from the stub if present.
  front_matter=""
  if [ -f "$post_path" ]; then
    front_matter=$(awk '/^---$/{f++; print; if(f==2){exit}; next} f==1{print}' "$post_path")
  fi

  # Convert body with pandoc
  body=$(pandoc "$src_path" -t gfm --wrap=none --extract-media="$img_path")

  # Re-write post: front matter + new body
  {
    if [ -n "$front_matter" ]; then
      echo "$front_matter"
      echo ""
    fi
    echo "$body"
  } > "$post_path"

  echo "  ok    $slug  ($(echo "$body" | wc -l | tr -d ' ') lines)"
done

echo
echo "Done. Preview locally with:  bundle exec jekyll serve --livereload"
