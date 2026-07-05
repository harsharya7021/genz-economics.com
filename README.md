# Gen Z Economics

> The macro you can't just Google — Prof. Prasanna Tantri's ISB sessions, chaptered and
> gated for the cohort.
> **Live site:** [genz-economics.com](https://genz-economics.com)

A **closed, sign-in-only study room** built on Prof. Tantri's macroeconomics sessions —
weekly lecture recordings, chaptered notes, long-form essays (corporate finance, the
Indian financial system, macro), a macro-data watch ("Vitals"), a daily question, Ask BIL,
and the papers/circulars he shares with the group. All of it sits behind a Google sign-in.

This didn't start closed. It began as an open, contribute-it-yourself notes archive —
that model didn't work (too few contributors, and material calibrated for one cohort was
sitting in public), so it was pivoted to closed. Full pivot story, decisions, and current
status live in `HANDOFF.md`. Full technical architecture: `ARCHITECTURE.md`.

---

## How it works

```
   ┌───────────┐  Google sign-in  ┌────────────────┐   reads (auth'd)  ┌────────────┐
   │  Visitor  │ ────────────────▶│ Firebase Auth  │ ─────────────────▶│  Firestore │
   └───────────┘                  └────────────────┘                   └────────────┘
```

- **Public shell** (landing, about, sign-in, newsletter capture) — static Jekyll, deployed
  on **Render**. No gated content ships in this HTML.
- **Gated app** — after Google sign-in, content is read from **Firestore** (authenticated
  reads only).
- **Honeypot assets** — lecture video via **Cloudflare Stream** signed playback tokens
  (no-download); papers/audiobooks via signed, expiring URLs.
- **Automation** (WhatsApp bot, session→notes→video pipeline, Ask BIL) runs on a separate
  VPS, not on Render — see `automation/README-AUTOMATION.md`.
- **The domain** (`genz-economics.com`) is a custom domain on Render.

There is no CMS and no admin panel. Markdown + YAML data files are the source of truth for
content; Firebase/Firestore is the source of truth for who's allowed to see it.

## Repo layout

```
.
├── _config.yml               # Jekyll site config
├── _layouts/                 # default · home · post · essay/hub layouts
├── _posts/                   # one markdown file per session (YYYY-MM-DD-slug.md)
├── _data/                    # calendar, macro data, glossary, daily-question bank, etc.
├── assets/
│   ├── css/main.css          # styles
│   ├── js/                   # site interactions + per-page widgets
│   └── favicon.svg
├── *.html, *.md               # essays + hub pages (sessions, macro-watch/Vitals, BIL,
│                              #   calendar, reading-room, glossary, learn, study, …)
├── automation/                # WhatsApp bot + session pipeline + BIL RAG — runs on a VPS
├── render.yaml                # Render deploy config
├── ARCHITECTURE.md            # technical source of truth
├── HANDOFF.md                 # project history / decisions / current status
├── VOICE-TANTRI.md, VOICE-RAW-TANTRI.md   # the copy voice guide — read before writing copy
└── Gemfile                    # pinned Jekyll gems
```

`CONTRIBUTING.md`, `MODERATORS.md`, `CODE_OF_CONDUCT.md`, and `.github/` (PR template, issue
templates, CODEOWNERS) are leftover from the original open-contribution model and no longer
describe how the project runs — see `ARCHITECTURE.md` §8 for the cleanup note.

## Running the site locally

```bash
# One-time setup (requires Ruby 3.x)
bundle install

# Serve locally on http://localhost:4000
bundle exec jekyll serve --livereload
```

The public shell (landing, about) renders without any keys. Gated pages need a real
Firebase project + config (`assets/js/firebase-config.js`) to sign in locally.

## Contributing

This isn't an open-contribution project anymore — there's no public PR/review flow. It's
built and maintained by Harsh, using Prof. Tantri's course material. If something's wrong,
sign in and flag it from the relevant page, or reach out directly.

## License

See [`LICENSE`](./LICENSE) for the current terms (site code: MIT; content: CC BY 4.0).
**Note:** the content license predates the closed-platform pivot and hasn't been
re-reviewed against it — worth a look before treating it as final, since a lot of what's
now gated (papers, recordings, cohort-specific notes) isn't really meant for open
redistribution the way CC BY 4.0 implies.

Credit for the underlying teaching: Prof. Prasanna Tantri.
