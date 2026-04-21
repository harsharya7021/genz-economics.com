# Gen Z Economics

> Open-source macroeconomics notes, refined in public.
> **Live site:** [genz-economics.com](https://genz-economics.com)

A community-maintained archive of notes from Prof. Tantri's macroeconomics sessions. Anyone can read, suggest edits, or propose new explainers. A rotating group of student moderators (currently: Finance Club members) reviews and merges changes.

---

## How it works

```
    ┌──────────────┐   PR / Issue    ┌────────────────┐   Merge   ┌─────────────┐
    │ Contributor  │ ───────────────▶│ Student        │ ─────────▶│ Site        │
    │ (anyone)     │                 │ Moderators     │           │ rebuilds    │
    └──────────────┘                 └────────────────┘           └─────────────┘
```

- **Notes** live as markdown files in `_posts/`.
- **The site** is a plain Jekyll build served by GitHub Pages.
- **The domain** (`genz-economics.com`) points at GitHub Pages via a `CNAME` record.

There is no CMS. There is no database. The markdown is the source of truth.

## Repo layout

```
.
├── _config.yml              # Jekyll site config
├── _layouts/                # default · home · post · page
├── _posts/                  # one markdown file per session (YYYY-MM-DD-slug.md)
├── _includes/               # reusable HTML snippets (future)
├── assets/
│   ├── css/main.css         # styles
│   ├── images/<slug>/       # per-post images
│   └── favicon.svg
├── index.html               # homepage (uses layout: home)
├── about.md                 # /about
├── contribute.md            # /contribute
├── 404.html
├── CNAME                    # genz-economics.com
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── MODERATORS.md            # moderator roster + how to join
├── .github/
│   ├── CODEOWNERS           # who gets auto-requested on PRs
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
└── Gemfile                  # pinned to github-pages gem
```

## Running the site locally

You only need this if you want to preview changes before pushing. Simple edits can be done fully in the GitHub web UI.

```bash
# One-time setup (requires Ruby 3.x)
bundle install

# Serve locally on http://localhost:4000
bundle exec jekyll serve --livereload
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full contributor guide, or the short version:

1. **Small fixes** — use the "Edit this page" link on any live page. It opens the file directly on GitHub.
2. **Bigger changes** — fork, branch, PR. A moderator will review.
3. **Don't want to edit?** Open an Issue with one of our templates.

## License

Content is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Site code is MIT.

Credit for the underlying lectures: Prof. Tantri.
