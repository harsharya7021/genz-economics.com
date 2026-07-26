# Uploading lecture videos (Cloudflare Stream)

Videos are too large for the static site/git, so they live on **Cloudflare Stream**
(transcoding, adaptive HLS, a global player). The site already shows a Stream player
on a session once you give it that video's ID. `lectures_enabled` is already `true`.

## One-time setup
1. Create a Cloudflare account → **Stream** → start the free trial / plan.
2. (Optional, recommended) In `_config.yml` set `stream_customer_code` to your Stream
   customer code (the `customer-XXXX` part of your Stream dashboard URLs). Leave blank
   to use the legacy `videodelivery.net` embed.

## Per video
1. **Upload** the recording in the Stream dashboard (drag-and-drop the `.mp4`), or via
   the API/`wrangler`. Large uploads run from your machine — that part is yours.
2. **Lock it.** On the video's Settings tab, tick **Require Signed URLs** and click
   **Save**. Do not skip this and do not trust the checkbox alone — ticking it updates
   the page, but the setting only persists once you hit Save, and the Preview panel
   says "Viewing requires signed URLs" the instant you tick, before anything is saved.

   **Cloudflare defaults every new upload to `requireSignedURLs: false`.** An unlocked
   video's HLS manifest is fetchable by anyone with the UID — the signed-URL gate and
   the Worker are bypassed entirely. This has now been missed three times (four videos
   caught in the 2026-07-09 audit, two more on 2026-07-26), so treat it as part of
   uploading, not as a later cleanup pass.

   Verify from a terminal — `401` is correct, `200` means still open:
   ```
   curl -s -o /dev/null -w '%{http_code}\n' \
     "https://customer-ymvws9hh7xkt34jv.cloudflarestream.com/<UID>/manifest/video.m3u8"
   ```
   To sweep every video at once, run `./lock-july-videos.command` — it re-checks the
   whole library and exits non-zero if anything is open. (Needs a Cloudflare API token:
   profile → API Tokens → Custom → **Account · Cloudflare Stream · Edit**. Account-level,
   not zone-level, and `Edit`, not `Read` — either mistake returns "Authentication error".)
3. Copy the video's **UID** (e.g. `a1b2c3d4e5f6...`).
4. Add it to that session's note front-matter:
   ```
   ---
   title: "The Keynesian Cross"
   session: 2
   stream_id: a1b2c3d4e5f6...
   ---
   ```
5. Commit + push. That session's player now streams the video; sessions without a
   `stream_id` keep the tasteful "coming soon" state.

## Notes
- Signed URLs are **live**, minted by the `gze-stream-token` Worker
  (`stream_token_worker` in `_config.yml`, see `cloudflare/stream-signed-urls/`).
  Every video must have `requireSignedURLs: true` or it sits outside that gate —
  see step 2. The player is also download-deterred (no direct file, right-click/Save
  blocked, watermark); see ARCHITECTURE.md.
- Keep ops scripts out of the build. Anything like `*.command` must be added to
  `exclude:` in `_config.yml`, or Jekyll copies it into `_site/` and serves it from the
  live site. `finish-lock-videos.command` was public this way until 2026-07-26.
- Recording resolution is whatever Zoom produces, and it follows the recording host's
  connection — a host on poor bandwidth yields a low-res file with no higher-quality
  version to fall back on. Class 3 (19 Jul 2026) came out at 640x360 for this reason.
- Mapping all sessions at once? You can instead keep a `_data/lectures.yml` of
  `session → stream_id` and wire the hub to it — ask me and I'll set that up.
