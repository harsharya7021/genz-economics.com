# Editorial access (Decap CMS) — one-time setup

`/admin/` lets you edit content in the browser and commits straight to this repo.
It signs in with **GitHub**, and only accounts with **write access to the repo** can
save — that repo permission *is* the editorial-rights control. GitHub Pages can't do
the OAuth token exchange (no server), so this small Cloudflare Worker brokers it —
same Cloudflare account as your Stream-token worker.

What you can edit through it today: the **About page** and every **session note's front
matter + prose** (title, date, session #, tags, and the `stream_id` you paste once a
video is up). The interactive models are code and stay in the repo.

## Step 1 — Create a GitHub OAuth App (~2 min)
GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
- **Application name:** `Gen Z Economics CMS`
- **Homepage URL:** `https://genz-economics.com`
- **Authorization callback URL:** `https://gze-decap-oauth.<your-subdomain>.workers.dev/callback`
  (you'll get the exact Worker URL in Step 2 — register first, then come back and set this)
- Register → **Generate a new client secret** → copy the **Client ID** and **Client Secret**.

## Step 2 — Deploy this Worker
From this folder (`cloudflare/decap-oauth/`):
```
wrangler deploy
wrangler secret put GITHUB_CLIENT_ID        # paste the Client ID
wrangler secret put GITHUB_CLIENT_SECRET     # paste the Client Secret
```
`wrangler deploy` prints the Worker URL. Then:
- paste its origin into **`admin/config.yml` → `backend.base_url`** and commit;
- paste **`<that URL>/callback`** into the GitHub OAuth App's callback field from Step 1.

## Use it
Go to **https://genz-economics.com/admin/** → *Login with GitHub* → edit → **Publish**.
It commits to `main`; the site rebuilds automatically.

## Granting / revoking editing rights
Add an editor: repo → **Settings → Collaborators → Add people**. Remove them to revoke.
(Your own account already has full access as the owner.)

## Turning on LRC (reading-list) editing later
`_data/shared-library.yml` is a bare YAML list, which Decap can't edit directly. To
enable it: move the list under an `items:` key, point `reading-room.html` at
`site.data.shared-library.items`, and uncomment the `library` collection in
`admin/config.yml`. Say the word and I'll make that change.
