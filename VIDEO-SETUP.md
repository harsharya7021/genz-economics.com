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
2. Copy the video's **UID** (e.g. `a1b2c3d4e5f6...`).
3. Add it to that session's note front-matter:
   ```
   ---
   title: "The Keynesian Cross"
   session: 2
   stream_id: a1b2c3d4e5f6...
   ---
   ```
4. Commit + push. That session's player now streams the video; sessions without a
   `stream_id` keep the tasteful "coming soon" state.

## Notes
- The player is download-deterred (no direct file, right-click/Save blocked, watermark).
  For true DRM + signed/expiring playback, enable Stream **signed URLs** later (needs a
  tiny token-minting function) — see ARCHITECTURE.md.
- Mapping all sessions at once? You can instead keep a `_data/lectures.yml` of
  `session → stream_id` and wire the hub to it — ask me and I'll set that up.
