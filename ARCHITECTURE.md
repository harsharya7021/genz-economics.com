# Gen Z Economics — Architecture & Plan (Closed Platform)

> The single source of truth for where this platform is going: the pivot to a closed
> model, the voice, the access/gating model, the newsletter, the build sequence, and
> what's done vs. pending. Last updated: 2026-06-30.

---

## 1. The pivot — open → closed

Gen Z Economics has moved from an **open, contribute-it-yourself archive** to a
**closed, sign-in-only study room** built on Prof. Prasanna Tantri's macro sessions.

Why:
- In the open model only 2–3 people ever contributed. The "edit on GitHub / open a PR"
  flow added risk without adding hands.
- The valuable material — his papers, RBI circulars, draft notes, recordings — was
  sitting in public where it shouldn't be. It's calibrated for people with the INFS
  background; without that context it misleads more than it helps.
- So the login is a **gate, not a fee**: it keeps the room to the people the material was
  written for, and turns the weekly lecture into a recall hook and a reason to register.

**The model in one line:** the **videos are the honeypot** — students sign in to watch the
weekly lecture, signing in puts them on the newsletter, and *every* other feature (notes,
sessions, quiz, glossary, reading room, listen) sits behind that same login. One new
lecture a week, because you forget.

---

## 2. Positioning & voice

All copy is written in **Prof. Tantri's voice**. Two reference files drive it:

- `VOICE-TANTRI.md` — the voice guide: register, sentence rhythm, do/don't, before→after.
- `VOICE-RAW-TANTRI.md` — a verbatim quote bank (jokes, gripes, caveats, opinions) for reuse.

The non-negotiables (full detail in the guide):

- **Precise, blunt, urgent.** Treats the reader as a junior colleague, not a pupil.
- Lead with the **misconception to resolve**, not a headline claim
  ("ISB made macro optional. Here it is anyway.").
- One concrete **Indian example** per idea (rupee/REER, onions setting the repo rate, dosa).
- **Caveats on the caveats** ("works *if* inflation is constant; the moment expectations
  move it can turn counter-productive — see the UK").
- Running bits: the **brother-in-law from IIM-A**, the **Stone Age** self-deprecation,
  "**nothing is as fun as torturing students**", "**useful knowledge**", "you forget",
  "the stuff you can't just Google", "why do you need this joker in between".
- The ethos: give people **what they can't just Google**; push back when the data disagrees.
- **Never:** open-source framing (PRs, "fork it", CC-BY), corporate hedging, or smooth
  marketing parallelism — that's what reads "AI".

### Copy status — done
Rewritten in-voice and closed-positioned:
- `_config.yml` — title / tagline / description.
- `_layouts/home.html` — hero ("ISB made macro optional. Here it is anyway.") + CTA band.
- `_layouts/default.html` — footer (open-source framing removed).
- `_layouts/post.html` — per-note footer ("read the footnotes… for the cohort; don't redistribute").
- `about.md` — the closed-room manifesto.
- `contribute.md` — repurposed to "Why it's closed".
- `reading-list.md` — "sign in and flag it" instead of "open a PR".
- Every hub-page intro: sessions, listen (player), macro-watch, reading-room, learn,
  study, question-bank, glossary, discussions.

Post **content** deks were left as-is — they're already his own words.

### Still carries old open-source framing (internal repo docs, NOT user-facing)
`README.md` rewritten 2026-07-04 (closed model, Render/Firebase architecture, no PR/review
flow — see `HANDOFF.md` §7). Still pending: `CONTRIBUTING.md`, `MODERATORS.md`,
`CODE_OF_CONDUCT.md`, `DEPLOY.md`, `DEPLOY-RENDER.md`. Update or retire these in a cleanup
pass. The repo's `LICENSE` file also still grants CC BY 4.0 on content, which predates the
pivot and hasn't been re-reviewed — flagged in the new README, not changed (a legal-text
edit is Harsh's call).

---

## 3. The access model — "full backend gating"

**Decision: full backend gating.** Every feature requires a Google sign-in, and the gated
content is **not shipped in the static HTML** — it's served to authenticated users from a
backend. This is stronger (and more work) than a client-side "hide it with JS" wall, which
a determined user can view-source around.

On a Jekyll/static site this means splitting into two layers:

**A. Public shell (stays static, on Render).** Marketing only — the landing/home, About,
the sign-in screen, and newsletter capture. No gated content in the HTML.

**B. Gated app (auth required).** After sign-in, the browser fetches content
(notes, sessions, quiz, glossary, daily question) from **Firestore**, governed by security
rules that only allow authenticated reads. The honeypot assets are **hard-gated**:

- **Video** → Cloudflare Stream with **signed playback tokens** minted by a function only
  for signed-in users. The raw file is never exposed (no-download by design).
- **Papers / audiobooks** → **signed, expiring URLs** (Firebase Storage rules or a Worker).
  Your VPS can host the files instead if you'd rather serve them yourself.

**Honest trade-off:** the text notes currently live as Jekyll markdown and render to HTML.
True gating requires **migrating that text into Firestore** (Phase 3) so it isn't in the
page source. Until then a login wall is "soft" for text and "hard" for video/papers.

This adds a **small serverless layer** (Cloudflare Worker or Firebase Functions) — *not* a
VPS. The answer to "do we need a server?" is: a few managed functions for tokens, signed
URLs, and the Mailchimp call. Nothing always-on to patch.

---

## 4. Honeypot + newsletter (Mailchimp)

**Decision: Mailchimp** for the newsletter.

Flow: see a locked lecture → sign in with Google → land on the **Mailchimp** list → get one
note a week (the recall hook) → come back for next week's lecture.

- **Capture:** start with Mailchimp's **embedded form** (no API key in the browser) on the
  sign-in / welcome screen. For auto-subscribe-on-sign-in, a function calls the Mailchimp
  API with the key held **server-side** — never in the browser, never committed to git.
- **Send:** the weekly note goes out from Mailchimp.
- **Consent** is captured at sign-in and stored with the user record in Firestore.

---

## 5. What runs where

| Concern | Service (recommended) | Manage a server? |
|---|---|---|
| Public shell (landing, about, sign-in) | Render **Static Site** | No |
| Sign-in (Gmail) | **Firebase Auth** (Google provider) | No |
| Gated content (notes, quiz, glossary, daily-Q), comments, scores | **Firestore** (rules: authed reads only) | No |
| Newsletter | **Mailchimp** (embed now; API via function later) | No |
| Uploads (audiobooks, papers) | **Firebase Storage** (or Cloudflare R2), signed URLs | No |
| Video + no-download | **Cloudflare Stream**, signed playback tokens | No |
| Privileged actions & webhooks | **Serverless functions** (Cloudflare Workers / Firebase Functions) | No (managed) |
| WhatsApp poll bot (later) | **WhatsApp Business API** / Twilio via a function | No |
| Real-time Zoom recap (later) | **Zoom webhooks + API** → a function | No |
| Scheduled jobs | **Render Cron** / Cloud Scheduler / GitHub Actions | No |

---

## 6. Key data flows

- **Gate the app:** on load, the client checks Firebase Auth state. Not signed in → the
  sign-in screen (and newsletter capture). Signed in → the gated app boots.
- **Read a note (Phase 3+):** the gated app reads the note from Firestore; rules permit it
  only for authenticated users. Nothing sensitive is in the page source.
- **Play a protected lecture:** the browser asks a function for a short-lived Cloudflare
  Stream playback token → plays the stream. The raw file is never exposed.
- **Open a paper / audiobook:** the browser asks a function for a signed, expiring URL →
  fetches it directly from storage (the function authorizes, never proxies the bytes).
- **Sign-in → newsletter:** on first sign-in a function adds the email to Mailchimp and
  writes a user + consent record to Firestore.
- **Comment / quiz score:** the browser writes directly to Firestore, gated by rules tied
  to the signed-in user.
- **Zoom recap (later):** Zoom fires a webhook when class ends → a function pulls the
  recording + transcript, generates the recap, writes it to Firestore.

---

## 7. Build plan (phased)

- **Phase 0 — Copy & voice.** ✅ **Done.** Closed positioning + Tantri voice across the
  whole site; `VOICE-TANTRI.md` and `VOICE-RAW-TANTRI.md` committed.
- **Phase 1 — Login wall + newsletter.** Google sign-in gates the app; sign-in adds the
  student to Mailchimp (embed now, auto-subscribe via function later) and writes a Firestore
  user record. Wire the hero/CTA "Sign in" buttons to real auth.
- **Phase 2 — Hard-gate the honeypot.** Cloudflare Stream signed-token function for the
  lecture recordings; signed/expiring links for papers + audiobooks. *Needs the Cloudflare
  Stream account + uploaded videos.*
- **Phase 3 — Move gated text to Firestore.** Migrate notes / quiz / glossary / daily-Q out
  of static HTML into Firestore (a one-time export script); the gated area becomes a small
  JS app that reads after auth. This is what makes the gating "full".
- **Phase 4 — Weekly note send** from Mailchimp (optionally assembled by a scheduled function).
- **Later (unchanged roadmap):** quiz scores + cohort leaderboards (Firestore), Zoom recap
  (webhook function), WhatsApp poll bot (function + WhatsApp API).

---

## 8. Status & open items

*(This section is a high-level summary only — it had drifted badly out of date because it
was being maintained in parallel with `HANDOFF.md`. As of 2026-07-04, `HANDOFF.md` §7/§8 is
the live, itemized, dated log of what's done and what's pending; this section just points
there instead of duplicating it, to stop the two from drifting apart again.)*

**Done (headline items — full detail + dates in `HANDOFF.md` §7)**
- Strategic pivot to closed platform (this document); voice researched + written
  (`VOICE-TANTRI.md` + `VOICE-RAW-TANTRI.md`); full copy rewrite across the site (§2).
- Firebase Auth + Firestore provisioned (API key restricted); Cloudflare Stream wiring +
  `VIDEO-SETUP.md` in place (awaiting actual uploads).
- Three long-form essays grounded in his actual course material (corporate finance v5,
  Indian Financial System, macro), each with verified interactive machines + a mock exam.
- Daily money-history card, Ask BIL (WhatsApp + web faces), reading-room "from the group"
  section, `SPEC-KARMA-GATING.md`.
- `automation/` layer scaffolded on Harsh's VPS design (WA bot, session→notes→video
  pipeline, BIL RAG) — code written and syntax-checked, **not yet deployed**.
- `/calendar/` (public timetable, ICS-subscribable) shipped.
- Landing page rebuilt several times over — market/macro data removed from it entirely and
  consolidated onto `/macro-watch/` ("Vitals"); landing is now a pure story walkthrough
  (masthead → a five-card horizontal scroll rail → a daily-rituals section → a CTA band that
  folds into the footer).

**Pending / needs you:** see `HANDOFF.md` §8 ("Open loops / blocked on Harsh") for the current,
numbered list — Mailchimp embed, Cloudflare Stream account, `git push` to actually deploy,
dashboard data fill-in, automation VPS go-live, plus a handful of small open product
decisions from the latest round. ~~Footnotes~~ resolved as a dead end (no real footnotes exist
in the session docx files) — do not re-open.

### Cleanup pass still not done
The open-source-era docs flagged above (§ "Still carries old open-source framing") —
`README.md`, `CONTRIBUTING.md`, `MODERATORS.md`, `CODE_OF_CONDUCT.md`, `DEPLOY.md`,
`DEPLOY-RENDER.md` — are unchanged. `README.md` in particular still describes the *original,
rejected* model in the present tense (open contribution, GitHub Pages, CC BY 4.0 license,
student moderators) with no mention of the closed pivot at all. Left alone deliberately —
rewriting it touches a public licensing claim, which is Harsh's call, not a default cleanup.

---

## 9. Rough monthly cost (prototype, ~hundreds of students)

| Item | Cost |
|---|---|
| Render Static Site | **Free** |
| Functions (Cloudflare Workers 100k req/day free, or Render Web Service) | **$0**, or ~**$7/mo** always-on |
| Firebase Auth | **Free** |
| Firestore | Free under ~50k reads / 20k writes per day; then ~$0.18 / 100k reads |
| Firebase Storage | 5 GB free; then ~$0.026/GB |
| Cloudflare Stream | **$5 / 1,000 min stored** + **$1 / 1,000 min delivered** |
| Mailchimp | Free up to ~500 contacts; paid tiers beyond |
| WhatsApp (later) | Low per-conversation fee (India rates are low) |
| Zoom (later) | **$0** within your existing plan |
| Domain | ~$10–15 / year |

**Worked video example:** 50 hours stored = 3,000 min → **$15/mo** storage; 30,000 min
watched → **$30/mo** delivery. Video is the main variable (~**$15–$60/mo** at small scale);
everything else starts near **$0**. Watch the Firebase Blaze plan (no hard spend cap) and
set a budget alert.

**Bottom line:** ~**$0–$30/mo** as a prototype, scaling to **~$50–$150/mo** with real video.

---

## 10. When a container or VPS is actually worth it

Only for something serverless handles poorly: continuously processing **live** Zoom media
(RTMS), a persistent WebSocket server at scale, or self-hosting video to control cost. Even
then, reach for a **managed container** (Render Web Service, Google Cloud Run, Fly.io) before
a hand-run VPS.

---

## 11. Repo map (orientation)

- `_layouts/` — `home`, `default` (header/footer/nav), `post`, `page`; `lecture-player` include.
- `_data/` — `upsc.yml` (question bank), `daily.yml` (daily Q + model answers), `glossary.yml`,
  `markets.yml` (ticker), `library.yml` (audiobooks/podcasts), `flashcards.yml`, `ponder.yml`.
- `assets/js/` — `site.js` (theme, TOC, search, sparklines, TTS, daily reveal), `player.js`,
  `study.js`, `quiz.js`, `comments.js` (Firebase), `firebase-config.js`.
- `assets/css/main.css` — design tokens + all components (unified "soft elevated" card).
- Pages — `index.html`, `about.md`, `sessions.html`, `player.html`, `macro-watch.html`,
  `reading-room.html`, `reading-list.md`, `learn.html`, `study.html`, `question-bank.html`,
  `glossary.html`, `discussions.html`, `contribute.md`.
- Voice — `VOICE-TANTRI.md`, `VOICE-RAW-TANTRI.md`.
- Ops docs — `DEPLOY-RENDER.md`, `VIDEO-SETUP.md`, `COMMENTS-SETUP.md`, this file.

---
*Pricing verified mid-2026; confirm on each provider's pricing page before committing.*


---

## Addendum (2026-07-03) — VPS automation layer
`automation/` (see README-AUTOMATION.md): Baileys WA bot (poll→tally→Zoom invite→announce),
session pipeline (Zoom VTT → Claude-chaptered notes + ffmpeg stills → Jekyll post → Stream
upload Wednesdays), BIL RAG service (MiniLM local embeddings + Claude, persona-guarded)
serving both the WA group and /bil/ via a Firebase-function proxy. Data boundaries: corpus,
auth-state, .env are gitignored — the repo is public. Gating/karma design in
SPEC-KARMA-GATING.md rides on Phases 1–3 (unbuilt).
