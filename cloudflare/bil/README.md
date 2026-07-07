# BIL — the RAG brother-in-law

A retrieval chatbot that answers **only** from Prof. Tantri's own material: the
session notes (`_posts`), the three long reads, and the glossary — all already
in this repo. Everything runs on Cloudflare: **Workers AI** for embeddings and
generation, **Vectorize** for search, a **Worker** as the gated endpoint. No
OpenAI/Gemini key, no server to run.

```
question ─▶ bil-widget.js ──(Bearer firebase token)──▶ Worker
                                                          │ embed (bge)
                                                          │ search Vectorize
                                                          │ generate (llama)
              { answer, sources }  ◀───────────────────── │  from those passages only
```

The widget contract is fixed by `assets/js/bil-widget.js`: it POSTs
`{ question }` with `Authorization: Bearer <firebase id token>` and renders
`{ answer, sources }`. This Worker matches it exactly.

---

## What's in the corpus (and what's deliberately not)

**In (clean tier):** session notes, the three essays, the glossary — his voice,
already public on the site, safe to attribute.

**Out:** the WhatsApp group and any student messages (privacy), and the
full text of third-party copyrighted PDFs (we point to them, we don't ingest
them). Cleaned lecture transcripts can be added later — drop `.md`/`.txt` files
in `cloudflare/bil/corpus/` and re-run the ingest; they'll be picked up
automatically.

---

## One-time setup (run on your Mac — I can't push or use your CF account)

**0. Log in to Cloudflare.** No global install needed — run wrangler through
`npx` (it caches in your home dir, so no `sudo` / permission issues):
```bash
npx wrangler login
```
Every `wrangler …` command below becomes `npx wrangler …`. (If you'd rather have
it permanently on PATH without `sudo`, point npm at a user dir first:
`npm config set prefix ~/.npm-global` and add `~/.npm-global/bin` to your PATH.)

**1. Create the Vectorize index** (768 dims = the bge model; cosine distance)
```bash
wrangler vectorize create gze-bil --dimensions=768 --metric=cosine
```

**2. Build the corpus** — chunk + embed the repo content into `corpus.ndjson`.
Needs a Cloudflare API token with **Workers AI → Read** (make one at
dash → My Profile → API Tokens):
```bash
cd cloudflare/bil
CF_ACCOUNT_ID=<your-account-id> CF_API_TOKEN=<token> node ingest.mjs
```
You'll see `Wrote N vectors → cloudflare/bil/corpus.ndjson`.

**3. Load the vectors**
```bash
wrangler vectorize insert gze-bil --file corpus.ndjson
```

**4. Deploy**
```bash
wrangler deploy
```
Copy the URL it prints, e.g. `https://gze-bil.<subdomain>.workers.dev`.

> No secret needed. The Worker verifies the Firebase sign-in token
> cryptographically against Google's public keys (see `verify()` in
> `worker.js`) — no API key, so the web apiKey's referrer restriction can't
> break it. (An earlier version called Google's token-lookup endpoint with
> that key and got blocked server-side; that's fixed.)

**6. Point the widget at it.** In `bil.html`, set the endpoint on the chat:
```html
<div id="bilChat" data-fn-url="https://gze-bil.<subdomain>.workers.dev">
```
(See "Turning BIL on" below — the chat UI is currently the coming-soon panel.)

---

## Turning BIL on (flip from "coming soon" to live)

`bil.html` right now shows the coming-soon `.soon-panel`. To go live, restore the
chat markup the widget expects — `#bilGate` (sign-in) and `#bilChat` (with
`data-fn-url` set) containing `#bilForm`, an input, and a `#bilLog`. The old
markup is in git history; I've kept `bil-widget.js` unchanged so it drops
straight back in. Ping me and I'll swap the panel back for the live chat in one
edit once the Worker URL exists.

---

## Keeping it fresh

Re-run whenever the notes change:
```bash
cd cloudflare/bil
CF_ACCOUNT_ID=... CF_API_TOKEN=... node ingest.mjs
wrangler vectorize insert gze-bil --file corpus.ndjson   # upserts by id
```
IDs are positional (`c0, c1, …`), so a full re-ingest overwrites cleanly. If you
delete a lot of content and want a clean slate, recreate the index (step 1).

---

## Cost (the estimate we ran)

500 students, ~10% use BIL, a handful of questions each ≈ low **hundreds to low
thousands of requests/month**. Per request: one small embed + one 8B-model
generation + one vector query. That sits inside — or just barely past — the
Workers AI / Vectorize free allowances, i.e. **~$0–5/month** at this scale.
Generation on the 8B Llama is the main meter; if usage climbs, the lever is
capping answer length (`max_tokens` in `worker.js`) or adding a per-user daily
cap. No fixed monthly cost, nothing to babysit.

---

## Tuning knobs (all in `worker.js`)

- `MIN_SCORE` (0.34) — raise to make BIL refuse more readily, lower if it's
  refusing things that are actually in the notes.
- `TOP_K` (8) — how many passages feed the answer.
- `GEN_MODEL` — swap to a bigger Llama if answers feel thin.
- `SYSTEM` — his persona and the guardrails (no tips, no gossip, refuse
  off-corpus).
- `ALLOW_ORIGIN` — the site origins allowed to call it.

The allowlist (`emailAllowed`) mirrors the site: `*.isb.edu`, the professor, and
you. Add one-off guests via the `ALLOWED` var in `wrangler.toml`.
