#!/bin/bash
# Double-click to preview the site locally, fully built and styled.
# Serves at http://127.0.0.1:4000 and rebuilds automatically on save.
# (Installed 2026-07-08: Homebrew ruby + jekyll 4.4.1 with seo-tag,
#  sitemap, paginate, feed. JEKYLL_NO_BUNDLER_REQUIRE skips the heavy
#  github-pages Gemfile — local preview only, production builds on push.)
cd "$(dirname "$0")"
export JEKYLL_NO_BUNDLER_REQUIRE=true
JEKYLL=$(ls /opt/homebrew/lib/ruby/gems/*/bin/jekyll 2>/dev/null | head -1)
if [ -z "$JEKYLL" ]; then echo "Jekyll not found — run: /opt/homebrew/opt/ruby/bin/gem install jekyll"; exit 1; fi
echo "Serving at http://127.0.0.1:4000 — leave this window open, Ctrl+C to stop."
exec "$JEKYLL" serve --port 4000 --host 127.0.0.1
