/* Paste into your Firebase Functions project (functions/index.js or its own module).
   Deploy: firebase deploy --only functions:bil
   Env (functions config or .env): BIL_URL=https://<vps-host-or-tunnel>:8047/ask  BIL_TOKEN=<same as VPS .env>
   The function verifies the user's Firebase ID token (the site's Google sign-in),
   so BIL answers only signed-in cohort members — the same gate as everything else. */
import { onRequest } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { initializeApp } from "firebase-admin/app";
initializeApp();

export const bil = onRequest({ cors: ["https://genz-economics.com"], secrets: ["BIL_TOKEN"] }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const idToken = (req.headers.authorization || "").replace("Bearer ", "");
    await getAuth().verifyIdToken(idToken); // throws if not signed in
  } catch { return res.status(401).json({ error: "sign in first" }); }
  const q = (req.body?.question || "").slice(0, 1000);
  if (!q) return res.status(400).json({ error: "question required" });
  const r = await fetch(process.env.BIL_URL, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${process.env.BIL_TOKEN}` },
    body: JSON.stringify({ question: q, channel: "web" }),
  });
  res.status(r.status).json(await r.json());
});
