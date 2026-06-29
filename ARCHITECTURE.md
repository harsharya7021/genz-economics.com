# Target architecture — Gen Z Economics

The whole platform runs on **managed / serverless** building blocks. There is **no
VPS to provision, patch, or scale**. The only "always-on" code you write is a thin
layer of serverless functions for privileged actions and webhooks.

## What runs where

| Concern | Service (recommended) | Why | Manage a server? |
|---|---|---|---|
| Front-end (the site) | Render **Static Site** (or Cloudflare Pages / GitHub Pages) | CDN + TLS, auto-build from git | No |
| Sign-in (Gmail) | **Firebase Auth** (Google provider) | Drop-in Google login | No |
| Comments, quiz scores, leaderboards, daily-Q state | **Firestore** | Realtime NoSQL, generous free tier | No |
| Uploads (audiobooks, files) | **Firebase Storage** (or Cloudflare R2) | Signed upload URLs, rules-gated | No |
| Video + DRM | **Cloudflare Stream** | Transcoding, HLS, signed playback, Widevine/FairPlay built in | No |
| Privileged actions & webhooks | **Serverless functions** (Cloudflare Workers / Render Web Service / Firebase Functions) | Mint Stream tokens, sign uploads, receive WhatsApp & Zoom events | No (managed) |
| WhatsApp poll bot | **WhatsApp Business API** (Meta) or **Twilio** via a function | Send/receive messages, run polls | No |
| Real-time Zoom recap | **Zoom webhooks + API** → a function | `meeting.ended` / `recording.completed` triggers the recap pipeline | No |
| Scheduled jobs | **Render Cron** / Cloud Scheduler / GitHub Actions | Refresh market snapshot, append daily question, send digests | No |

## Key data flows

- **Play a protected lecture:** browser asks a function for a short-lived Cloudflare Stream playback token → plays the DRM HLS stream. The raw file is never exposed.
- **Upload an audiobook:** browser asks a function for a signed upload URL → uploads straight to storage (the function only authorizes, never proxies the bytes).
- **Comment / quiz score:** browser writes directly to Firestore, gated by security rules tied to the signed-in user.
- **WhatsApp poll:** a cron job (or admin action) calls a function → WhatsApp API sends the poll; inbound replies hit a webhook function → tallied in Firestore.
- **Zoom recap:** Zoom fires a webhook when class ends → function pulls the recording + transcript, generates the recap, writes it to the site's data / Firestore.

## Rough monthly cost (prototype, ~hundreds of students)

| Item | Cost |
|---|---|
| Render Static Site | **Free** |
| Functions — Cloudflare Workers (100k req/day free) **or** Render Web Service | **$0**, or ~**$7/mo** for an always-on Render service |
| Firebase Auth | **Free** |
| Firestore | **Free** under ~50k reads / 20k writes per day; beyond, ~$0.18 per 100k reads |
| Firebase Storage | 5 GB free; then ~$0.026/GB |
| Cloudflare Stream (video) | **$5 / 1,000 min stored** + **$1 / 1,000 min delivered** (encoding & egress free) |
| WhatsApp | Free service-conversation tier; small per-conversation fee beyond (India rates are low) |
| Zoom | **$0** (within your existing Zoom plan) |
| Domain | ~$10–15 / year |

**Worked video example:** 50 hours of lectures stored = 3,000 min → **$15/mo** storage.
If students watch 30,000 minutes that month → **$30/mo** delivery. So video is roughly
**$15–$60/mo** at small scale and is the main variable — everything else starts near **$0**.

**Bottom line:** the prototype lands around **$0–$30/mo** (near-free if video stays light
or gated), scaling to **~$50–$150/mo** with real video usage. Watch the Firebase Blaze
plan (no hard spend cap) and set a budget alert.

## Suggested build order

1. **Auth + comments** (Firebase) — flip on what's already scaffolded.
2. **Uploads** (Firebase Storage + a signed-URL function) — real audiobooks.
3. **Protected video** (Cloudflare Stream + token function) — wire the lecture player to real DRM streams.
4. **Quiz scores + cohort leaderboards** (Firestore) — the "friendly fire".
5. **Zoom recap** (webhook function) — auto-publish after class.
6. **WhatsApp bot** (function + WhatsApp API) — polls and digests.

## When a container or VPS is actually worth it

Only for something serverless handles poorly: continuously processing **live** Zoom
media (RTMS), a persistent WebSocket server at scale, or self-hosting to control video
costs. Even then, reach for a **managed container** (Render Web Service, Google Cloud
Run, Fly.io) before a hand-run VPS.

---
*Pricing verified mid-2026; confirm on each provider's pricing page before committing.*
