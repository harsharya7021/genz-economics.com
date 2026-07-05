# Automation — WA bot · session pipeline · BIL

Runs on **your VPS** (never on Render — Render only serves the static site).
Three pieces, one folder: the WhatsApp bot (poll → Zoom invite → announcements),
the session pipeline (recording → chaptered notes + screenshots + Stream), and BIL
(RAG over the course corpus; answers on WhatsApp and the website).

## The weekly loop it implements
- **Wed 10:00 IST** — bot posts the time poll to the group. **Wed 10:30** — pipeline uploads
  last Sunday's recording to Cloudflare Stream, attaches it to the notes post, announces.
- **Fri 10:00 IST** — bot tallies the poll (48h), creates the Zoom meeting at the winning
  time for Sunday, posts the invite.
- **Sun evening** — pipeline watches Zoom; when the cloud recording + transcript appear:
  chapterizes, writes notes (voice-guardrailed, verbatim quotes kept), grabs one ffmpeg
  frame per chapter, publishes the Jekyll post, pushes, announces "notes are up."
- **Any time** — group members write "BIL <question>"; the site has /bil/ behind sign-in.

## One-time setup
1. **VPS basics**: Node 20+, ffmpeg, git. Clone the site repo; `cd automation && npm i`.
   Give the clone push rights (deploy key) — the pipeline commits posts.
2. **Dedicated WhatsApp number** (decided): fresh SIM/eSIM, never a personal number.
   `npm run bot` → scan the QR from that phone (Linked devices). Then
   `npm run list-groups` → copy the group JID into `.env` (`WA_GROUP_JID`).
   *Risk, stated plainly: this is an unofficial client (Baileys); WhatsApp can ban the
   number. Recovery = new SIM, re-pair, done in 10 minutes. Keep the bot boring
   (no spam, no mass DMs) to keep the risk low.*
3. **Zoom**: marketplace.zoom.us → Build App → **Server-to-Server OAuth** on the account
   that hosts the class. Scopes: `meeting:write:meeting`, `cloud_recording:read:list_user_recordings`,
   `cloud_recording:read:recording`, `user:read:user`. Put account/client id+secret in `.env`.
   In Zoom settings: enable **cloud recording** + **audio transcript** (that's the VTT).
4. **Cloudflare Stream**: dash → Stream → API token with Stream:Edit. Account ID + token → `.env`.
5. **Anthropic**: API key → `.env` (used by notes generation and BIL).
6. **Corpus** (gitignored — the repo is public, course material must not enter git):
   unzip `bil-corpus.zip` (Harsh has it) into `automation/corpus/`, then `npm run ingest`.
   Re-run ingest whenever new notes/posts land (the Sunday pipeline can be extended to do this).
7. **Run**: `cp .env.example .env`, fill it, then `pm2 start ecosystem.config.cjs && pm2 save`.
8. **Cron** (`crontab -e`):
   ```
   10 18-23 * * 0  cd $HOME/genz/automation && /usr/bin/node src/pipeline/run.js watch >> pipeline.log 2>&1
   30 10 * * 3     cd $HOME/genz/automation && /usr/bin/node src/pipeline/run.js video >> pipeline.log 2>&1
   45 18 * * 1-5   cd $HOME/genz/automation && /usr/bin/node src/macro/fetch.js >> macro.log 2>&1
   ```
   (Poll/tally crons live inside the bot process — `.env` `POLL_CRON`/`TALLY_CRON`.)
9. **BIL on the website** (2026-07-05, replaces the Firebase-function design — that
   needed the Blaze plan): `serve.js` now verifies the visitor's Firebase ID token
   itself (`verify-firebase.js`, zero new deps) and answers CORS for the site origin.
   So the widget calls the VPS directly: expose :8047 over HTTPS (quick path:
   `cloudflared tunnel --url http://localhost:8047`; stable path: caddy + a
   `bil.` subdomain) and put that URL + `/ask` into `bil.html`'s `data-fn-url`.
   `firebase-bil-function.js` is kept only as a reference. One-paste VPS setup:
   `helios-setup.sh` in this folder.

## Testing without waiting for Wednesday
```
curl -X POST localhost:8048/trigger/poll  -H "Authorization: Bearer $ANNOUNCE_TOKEN"
curl -X POST localhost:8048/trigger/tally -H "Authorization: Bearer $ANNOUNCE_TOKEN"
node src/pipeline/run.js notes --local test.mp4 test.vtt --title "Dry run" --date 2026-07-05
curl -s localhost:8047/health
```

## What still needs a decision from Harsh
- Poll options (`.env POLL_OPTIONS`) — the four defaults are guesses.
- Whether automation code should move to a private repo (code holds no secrets, but it
  documents the group's plumbing publicly).
- The announce copy — currently plain and functional by design; the prof's voice is for
  the prof, BIL's snark stays in /bil/.
