# gze-stream-token — Cloudflare Worker

Mints short-lived, signed Cloudflare Stream playback tokens for signed-in,
allowed (ISB) viewers. This is the actual hard gate on lecture recordings —
see `worker.js`'s header comment for the full "why."

Two things need to happen once, from your own terminal. This can't be done
from my side: Cloudflare's dashboard has no button at all for creating a
signing key (API-only), its write-API blocks scripted requests coming
through a driven browser session, and — separately from either of those —
the private key material below shouldn't pass through chat or a pasted form
regardless of who's typing it.

## 1. Install Wrangler (Cloudflare's CLI) — one-time

```
npm install -g wrangler
wrangler login          # opens a browser tab — sign in, authorize
```

## 2. Create the Stream signing key

No dashboard button exists for this at all — API only. First create a
scoped API Token: dashboard → your profile icon (top right) → **API
Tokens** → **Create Token** → custom token → permission **Account →
Cloudflare Stream → Edit** → scope to this account → Continue → Create.
Copy the token — it's shown once.

Then, in your own terminal:

```
curl -X POST "https://api.cloudflare.com/client/v4/accounts/8339f8f6a38fa588539972b652e42c32/stream/keys" \
  -H "Authorization: Bearer PASTE_YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

The response looks like:

```
{ "result": { "id": "...", "pem": "-----BEGIN PRIVATE KEY-----...", "jwk": {...} }, "success": true }
```

Save the whole response somewhere private (a local file outside the repo,
or a password manager note) — Cloudflare will not show you the `pem` again
after this call. Don't commit it. Don't paste it in chat with me.

## 3. Deploy the Worker

From this folder:

```
cd cloudflare/stream-signed-urls
wrangler deploy
```

Wrangler prints the live URL, something like:

```
https://gze-stream-token.<your-subdomain>.workers.dev
```

That URL isn't sensitive — send it to me and I'll wire it into
`_config.yml` as `stream_token_worker`.

## 4. Set the two secrets

Still from this folder, still your own terminal:

```
wrangler secret put STREAM_SIGNING_KEY_ID
```
Paste the `id` value from step 2 when prompted, press enter.

```
wrangler secret put STREAM_SIGNING_KEY_PEM
```
Paste the entire `pem` value from step 2 when prompted (including the
`-----BEGIN PRIVATE KEY-----` / `-----END PRIVATE KEY-----` lines), press
enter.

Each of these reads straight from your terminal into Cloudflare's encrypted
secret store — the value never touches a browser form, never lands in shell
history, never touches me.

## What happens before vs. after this is done

Every lecture player on the site ships locked by default — the recording
stays invisible until a signed-in, allowed viewer's browser successfully
fetches a token from this Worker. Until you finish the steps above, the
Worker URL is blank in `_config.yml`, so every player just stays locked for
everyone, including you — it fails **closed**, not open. That's intentional
(see the comment at the top of `_includes/lecture-player.html`): better a
temporarily-locked video than a leaked one. Once you send me the deployed
URL and confirm the secrets are set, the player works end to end.
