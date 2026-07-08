# SEO Audit — genz-economics.com
*2026-07-08 · full-site audit · goal: organic traffic to the open long reads + Sunday session notes; gated video keeps its search presence via the open notes.*

---

## Executive summary

The site's biggest strength is the thing most sites fake: **deep, original, fully server-rendered content** — 16 session notes (1,500–2,500 words each) analysing live Indian macro, three long-read courses (the corporate-finance read alone is ~13,000 words), a glossary, and a real professor's voice. Everything is indexable HTML on a technically clean Jekyll base (HTTPS, sitemap, robots, canonicals, JSON-LD on every page).

The critical issue sits in front of all of it: **Google barely knows the site exists.** A `site:genz-economics.com` query returns nothing. Until the site is verified in Search Console, its sitemap submitted, and a handful of backlinks exist, every other optimisation is theoretical.

Top three priorities: **(1) get indexed** (Search Console + sitemap + the professor's LinkedIn linking here), **(2) fix duplicate/oversized metadata** (six of seven checked pages share one default description; one note ships a 398-character description; the homepage title is "Home"), **(3) cut page weight** (1.3 MB hero PNG + 788 KB TTF font on the LCP path).

Overall assessment: **strong foundation, critical discovery gap.** The content deserves rankings it cannot currently receive.

---

## Keyword opportunities

Volumes are directional (no SEO tool connected — connect Ahrefs/Semrush via MCP for exact numbers). Difficulty judged from live SERPs: the India-macro queries are held by UPSC-prep blogs, fund-house explainers and news pieces — consistently shallower than the site's existing notes.

| # | Keyword | Difficulty | Opportunity | Currently ranking | Intent | Recommended content |
|---|---------|-----------|-------------|-------------------|--------|---------------------|
| 1 | rupee depreciation explained | Moderate | **High** | ensureIAS, Kotak MF | Info | Session 16 note (exists — optimise title/meta) |
| 2 | REER real effective exchange rate India | Easy–Mod | **High** | HDFC primer, UPSC blogs | Info | Session 16 + Mint-essay note (exist) |
| 3 | repo rate explained India | Hard | **High** | ClearTax, Groww, RBI | Info | New pillar: "The Repo Rate, Explained by the Mechanism" |
| 4 | Phillips curve India inflation | Easy | **High** | Academic PDFs, UPSC notes | Info | Sessions 11–13 notes (exist — add pillar page) |
| 5 | balance of payments India explained | Moderate | **High** | UPSC sites | Info | Session 15 note (exists) |
| 6 | FCNR(B) deposits meaning | Easy | **High** | Bank FAQ pages | Info | Session 16 section → own glossary page |
| 7 | evergreening of loans India | Easy | **High** | News archives | Info | Note + his Livemint column (Tantri Times links it) |
| 8 | interest rate parity explained | Moderate | Medium | Investopedia | Info | Session 8 note (exists) |
| 9 | Keynesian cross multiplier explained | Moderate | Medium | Khan Academy | Info | Session 2 note (exists) |
| 10 | paradox of thrift example | Easy | Medium | Investopedia | Info | Session 2 note section |
| 11 | crowding out effect India fiscal policy | Easy | **High** | UPSC blogs | Info | Session 5 note (exists) |
| 12 | monetary policy transmission India | Easy | **High** | RBI papers | Info | Sessions 3–4 notes + his JMCB paper angle |
| 13 | union budget 2026 analysis macro | Moderate (seasonal) | **High** | News | Info | Budget note (exists — refresh each Feb) |
| 14 | corporate finance notes MBA | Moderate | Medium | Scribd/slideshares | Info | Long read (exists — needs meta + H2 anchors) |
| 15 | what is macroeconomics simple explanation | Hard | Medium | Investopedia, Khan | Info | What-is-macro read (exists) |
| 16 | inflation targeting India RBI critique | Easy | **High** | Op-eds | Info | His BS column + Tantri Times page |
| 17 | yen carry trade India impact | Easy | Medium | News | Info | Session 10 note (exists) |
| 18 | money multiplier not real | Easy | Medium | Niche econ blogs | Info | Glossary entry → short explainer (the classifieds already joke about it) |
| 19 | Kindleberger manias panics crashes summary | Moderate | Medium | Book-summary sites | Info | Book-club reading guide (new, quarterly) |
| 20 | ISB macroeconomics professor notes | Easy | **High** (brand) | — | Nav | Homepage + About (fix title tag) |
| 21 | Prasanna Tantri | Easy | **High** (brand) | ISB, LinkedIn | Nav | Tantri Times /press/ page (exists — 151 footnotes make it the best bio source on the web) |
| 22 | dosa test exchange rate | Easy | Medium (ownable coinage) | — | Info | Session 16's framing — coin it, own it |
| 23 | economic survey MGNREGA critique | Easy | Low–Med | The Hindu | Info | Archive columns via press page |
| 24 | zerodha varsity macroeconomics alternative | Easy | Medium | Reddit threads | Commercial-ish | Comparison/positioning page ("Varsity teaches markets; this room teaches the mechanism") |
| 25 | UPSC economy optional notes macro | Hard | Medium | Mrunal, ClearIAS | Info | Landing page mapping sessions → UPSC syllabus |

---

## On-page issues

| Page | Issue | Severity | Fix |
|------|-------|----------|-----|
| Sitewide (home, sessions, glossary, book-club, press, discussions…) | **Same default meta description reused** | **Critical** | Unique `description:` front matter per page |
| Homepage | Title = "Home · Gen Z Economics" — zero keywords | **Critical** | "Learn India's Macroeconomics from an ISB Classroom · Gen Z Economics" |
| Session notes (all) | **Multiple H1s** (markdown `#` sections render as h1; Session 1 has 8) | High | Demote body headings to h2 (one-line layout/markdown fix); keep the post title as sole H1 |
| Session notes (several) | Descriptions 300–500+ chars (Session 16: ~570) | High | Trim to ≤160 chars, front-load the query phrase |
| Corporate finance read | Description 261 chars | Medium | Trim to 155 |
| Sitewide | **No `og:image` on any page** (twitter:card = summary, no image) | High | Default site og:image + per-post images; switch to `summary_large_image` |
| Sitewide | 75 of 120 `<img>` missing/empty alt (many decorative, several real) | Medium | Alt pass: describe real images, `alt=""` + `aria-hidden` for decorative |
| Long reads | 13k words with no jump-link table of contents in HTML for search | Medium | Anchored H2 TOC (snippet + sitelinks eligibility) |
| /press/, /reading-room/ | Rich pages, default description | Medium | Unique descriptions (the press page is the best "Prasanna Tantri columns" resource anywhere — say so) |
| Footer | "The macro you can't just Google." | Low | Keep — but make sure Google can. (No fix; morale item.) |

---

## Content gaps

| Gap | Why it matters | Format | Priority | Effort |
|-----|----------------|--------|----------|--------|
| **Pillar: "The Rupee, Explained"** | 5 existing notes (S6, S8, S15, S16, Mint essay) form a cluster with no hub; "rupee" queries are perennial | Pillar page linking the cluster, updated each move | **High** | Half day |
| **Per-term glossary pages** | Glossary is one page; individual terms (REER, FCNR(B), VRRR, crowding out) are the long-tail entry points | One URL per term + FAQ schema | **High** | Multi-day (template once, then content) |
| **"Repo rate, from the mechanism"** | Highest-volume term in the space; every competitor explains *what*, none explain *why* like the classroom does | Evergreen explainer | **High** | Half day |
| Book-club reading guides | "Manias Panics and Crashes summary" searchers are exactly the cohort's profile | Guide per quarterly pick | Medium | Half day each |
| UPSC/CFA mapping page | Large adjacent audience; sessions already cover the syllabus topics | Landing page mapping notes → syllabus | Medium | Half day |
| Varsity positioning page | "Alternative to Varsity" searches; honest comparison wins links | Comparison essay | Medium | 2 hours |
| Freshness loop | Notes tied to live events (budget, MPC) decay; competitors re-date | Refresh pass each MPC/budget; `last_modified_at` | Medium | Recurring, 1–2 h |
| News-jacking cadence | Each MPC decision/budget = search spike the site's voice is built for | 48-hour reaction note, linked from the pillar | Medium | Recurring |

---

## Technical checklist

| Check | Status | Details |
|-------|--------|---------|
| HTTPS | **Pass** | Clean, no mixed content observed |
| robots.txt | **Pass** | Correct sitemap URL in production |
| XML sitemap | **Pass** | 43 URLs, jekyll-sitemap |
| Canonical tags | **Pass** | jekyll-seo-tag on every page |
| Structured data | **Warning** | JSON-LD present (WebSite/BlogPosting) but no `og:image`, no FAQ/Course/Breadcrumb schema anywhere |
| **Search Console** | **Fail (assumed)** | Site invisible to `site:` search — verify property, submit sitemap, request indexing on the 6 money pages. Bing Webmaster too |
| Page speed — images | **Fail** | `hero-collage.png` 1.3 MB + dark twin 1.2 MB (both fetched); hall/prof PNGs 200–400 KB each. Convert to WebP ≤150 KB, lazy-load the dark variant |
| Page speed — fonts | **Fail** | `inter-v-1.ttf` 788 KB + `recklessgx.ttf` preloaded as TTF. Subset + convert to WOFF2 (≈70–120 KB total, −85%) |
| Page speed — CSS | **Warning** | main.css 180 KB unminified, render-blocking. Minify (~120 KB), acceptable after |
| Third-party JS | **Warning** | GSAP + ScrollTrigger from cdnjs on every page incl. notes; load only where used |
| Mobile-friendliness | **Pass** | Rebuilt this week; drawer nav, responsive throughout |
| Core Web Vitals (est.) | **Warning** | LCP on home likely 4s+ on 4G from the PNG+TTF chain; notes pages likely fine |
| Broken links | **Pass (spot)** | `/reading-list/` redirects; no 404s hit during audit |
| Indexable gated model | **Pass** | Notes fully server-rendered; only video is hard-gated — search sees the text, users hit the gate at the player. No cloaking risk |
| Duplicate content | **Warning** | `landing-v2-PREVIEW`, `corporate-finance-v9(-PREVIEW)` variants are crawlable — noindex or remove from sitemap |

---

## Competitor comparison

| Dimension | genz-economics.com | Zerodha Varsity | ensureIAS / UPSC blogs |
|-----------|--------------------|-----------------|------------------------|
| Keyword footprint | ~0 (not indexed) | Massive, entrenched | Large, India-macro heavy |
| Content depth | **2,000-word original analyses + 19 interactive models** | Broad but market-focused, thin on macro mechanism | Exam-oriented summaries, no original analysis |
| Publishing cadence | Weekly (Sunday session) | Sporadic modules | Daily current-affairs churn |
| Authority signals | ISB professor, 151 press mentions, 20+ journal pubs | Zerodha brand, years of links | Domain age, UPSC network |
| Backlinks | ~none | Enormous | Moderate |
| SERP features | None | Snippets, PAA, sitelinks | PAA, snippets |
| Technical | Clean but heavy assets | Fast, optimised | Ad-heavy, slow |
| **Wedge** | **Mechanism-first, India-first, professor-authored, interactive** | Markets, not macro | Exams, not understanding |

The wedge is real: nobody owns "Indian macro, explained from a classroom, with the professor's actual arguments." Varsity can't (not their lane), UPSC sites won't (wrong incentive).

---

## Prioritized action plan

### Quick wins (this week)

| Action | Impact | Effort |
|--------|--------|--------|
| 1. **Verify Search Console (+ Bing), submit sitemap, request indexing** on home, 3 long reads, sessions index, S16 note | **High** — unblocks everything | 30 min (needs Harsh's Google account) |
| 2. **Professor links the site** from his next LinkedIn post + ask ISB to link it from his faculty page ("Teaching resources") | **High** — first real backlinks, crawl trigger | 15 min ask |
| 3. Unique titles/descriptions for the 12 key pages (home, 3 reads, sessions, glossary, calendar, book club, press, reading room, discussions, about) | **High** | 1–2 h |
| 4. Fix multi-H1 in the note layout (body `#` → h2) | Medium | 30 min |
| 5. Default `og:image` (1200×630 brand card) + `summary_large_image` | Medium — CTR on every share | 1 h |
| 6. WebP the hero images, WOFF2-subset the two fonts | **High** — LCP ~4s → ~1.5s | 1–2 h |
| 7. Noindex the `-PREVIEW`/`-v9` variants | Medium | 15 min |
| 8. Trim the 300+ char note descriptions | Medium | 45 min |

### Strategic investments (this quarter)

| Action | Impact | Effort | Depends on |
|--------|--------|--------|------------|
| A. **Rupee pillar page** linking S6/S8/S15/S16 + Mint essay, updated on every big move | **High** | Half day | Quick wins 1–3 |
| B. Per-term glossary URLs with FAQ schema (start: REER, repo rate, FCNR(B), crowding out, evergreening, IRP) | **High** — long-tail machine | Template half-day, then 30 min/term | — |
| C. "Repo rate, explained by the mechanism" evergreen | **High** | Half day | — |
| D. MPC/budget reaction cadence (48h note + pillar update) | **High** — recurring spikes | 1–2 h each event | A |
| E. Backlink motion: Tantri Times as citable asset (the only complete Tantri column archive), book-club guides, "dosa test" coinage; pitch 2–3 finance-edu newsletters (Finshots-adjacent) | Medium–High | Ongoing | 2 |
| F. Course/Breadcrumb schema on long reads + notes; internal "related sessions" module | Medium | 1 day | — |
| G. UPSC syllabus mapping page + Varsity comparison essay | Medium | 1 day | 1–3 |
| H. Track in GSC monthly: impressions → clicks → queries; refresh winners | Medium | 30 min/month | 1 |

---

*No SEO tool was connected for this audit (Ahrefs/Semrush via MCP would add exact volumes, difficulty scores and rank tracking). Landscape claims grounded in live SERP checks on 2026-07-08.*
