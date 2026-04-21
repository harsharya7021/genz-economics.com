# Contributing to Gen Z Economics

Thanks for helping out. This is a community project — we genuinely want your PRs, corrections, and ideas.

## The three ways to contribute

### 1. Fix something small (fastest)

Every post has an **"Edit this page on GitHub"** link at the bottom. Click it, make your change in GitHub's web editor, and click "Propose changes". GitHub will walk you through submitting a Pull Request. A moderator will review within a few days.

You don't need to install anything. You don't need to run the site locally.

### 2. Open an Issue

Don't want to make the fix yourself? Go to **[Issues → New issue](https://github.com/harsharya7021/genz-economics.com/issues/new/choose)** and pick the right template:

- 🐛 **Spotted an error** — factual mistake, typo, wrong number, broken link.
- 💡 **Suggest an explainer** — concept is confusing, needs a better example, a diagram, or a worked problem.
- ✨ **Propose a new note** — a topic Prof. Tantri touched on, or a current event worth explaining.
- 🎨 **Site bug** — something about the website itself.

### 3. Write a whole new note

For a full new post:

1. **Fork** this repo.
2. **Create a branch**: `git checkout -b new-note/exchange-rate-regimes`.
3. **Copy the template**: duplicate `_posts/_TEMPLATE.md` and rename to `YYYY-MM-DD-your-slug.md`. Use today's date if it's a new standalone explainer, or the session date if you're transcribing a lecture.
4. **Write the note.** Front matter at the top (see the template), markdown body below.
5. **Put images** (screenshots, diagrams, whiteboard photos) in `assets/images/<your-slug>/` and reference them with `![alt text]({{ '/assets/images/<your-slug>/thing.png' | relative_url }})`.
6. **Open a Pull Request.** Fill out the template. Tag any relevant moderator if you want a quick review.

## Post front matter

Every post in `_posts/` must start with this front matter block:

```yaml
---
layout: post
title: "The thing you're writing about"
dek: "A one-sentence deck/subhead for the post."
date: 2026-04-21
session: 7                  # optional — only if this is a lecture note
tags: [monetary-policy, is-lm, india]
excerpt_override: "Short summary shown on the homepage card."
authors:
  - harsh
editors: []                 # filled in by moderators after review
---
```

## House style

- **Write like you'd explain it to a classmate.** Not a textbook, not a post on LinkedIn. Second person is fine.
- **Keep the math.** Don't dumb it down — just ground it. If you drop an equation, say what each term means the first time.
- **Tie it to something real.** Rupee, RBI, UPI, jobs, Budget. Abstract models land better with a concrete example.
- **Cite sources.** If you claim a number, footnote where it's from (RBI, MoSPI, CMIE, Tantri's slides, a paper). Link where possible.
- **Credit voices.** If an idea came from a classmate's question or a specific slide, say so.
- **Indian-English spelling** is fine. So is American. Pick one per post.
- **Images need alt text.** Blind and low-vision readers use this site too.

## What makes a good PR

- **One thing per PR.** Don't mix a typo fix with a structural rewrite.
- **Explain the *why* in the PR description.** What was wrong, what changed, where you got the correction.
- **Mark it "Draft"** if you want early feedback before polishing.

## What moderators check

See [`MODERATORS.md`](./MODERATORS.md) for the full checklist. Short version:
- Factually correct (or at least, consistent with what was taught).
- Readable — no jargon without definition.
- Sources cited for any new claims.
- Images have alt text; file paths resolve; front matter is valid.

## Getting help

Unsure about something? **Open a Draft PR anyway** and tag a moderator. We'd rather have a rough draft to work with than nothing. You can also open a plain question as an Issue.
