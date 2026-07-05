import { createReadStream, statSync } from "node:fs";
import * as tus from "tus-js-client";
import { cfg } from "../config.js";

/** Upload an MP4 to Cloudflare Stream (tus, handles multi-GB). Resolves to the video UID. */
export function uploadToStream(mp4, name) {
  return new Promise((resolve, reject) => {
    const size = statSync(mp4).size;
    let uid = null;
    const up = new tus.Upload(createReadStream(mp4), {
      endpoint: `https://api.cloudflare.com/client/v4/accounts/${cfg.cf.accountId}/stream`,
      headers: { Authorization: `Bearer ${cfg.cf.token}` },
      chunkSize: 50 * 1024 * 1024,
      uploadSize: size,
      metadata: { name, requiresignedurls: "true" },
      onAfterResponse: (_req, res) => { const id = res.getHeader("stream-media-id"); if (id) uid = id; },
      onProgress: (sent) => process.stdout.write(`\rstream upload ${(sent / size * 100).toFixed(1)}%   `),
      onSuccess: () => { console.log(); resolve(uid); },
      onError: reject,
    });
    up.start();
  });
}
