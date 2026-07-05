/* BIL answer service — used by the WA bot (localhost, shared BIL_TOKEN) and the
   website widget directly (HTTPS tunnel; auth = the visitor's own Firebase ID token,
   verified here — replaces the Firebase Function proxy, which needed the Blaze plan). */
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { cfg } from "../config.js";
import { retrieve, loadIndex } from "./rag.js";
import { verifyFirebaseIdToken } from "./verify-firebase.js";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "genz-economics";
const ALLOWED_ORIGINS = new Set([cfg.siteBase, "http://localhost:4000"]);

const persona = readFileSync(new URL("./persona.md", import.meta.url), "utf8");
const client = new Anthropic({ apiKey: cfg.anthropicKey });
const app = express();
app.use(express.json());

/* CORS — the widget on genz-economics.com calls this origin directly. */
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400");
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.get("/health", (_q, res) => {
  try { const n = loadIndex().docs.length; res.json({ ok: true, chunks: n }); }
  catch { res.json({ ok: false, error: "index missing — run npm run ingest" }); }
});

/* Auth: exact BIL_TOKEN match = the WA bot (localhost). Anything else is treated
   as a Firebase ID token from the site's Google sign-in and verified. */
async function authorize(req) {
  const bearer = (req.headers.authorization || "").replace(/^Bearer /, "");
  if (!bearer) return null;
  if (bearer === cfg.bil.token) return { channel: "whatsapp-bot" };
  try { return await verifyFirebaseIdToken(bearer, FIREBASE_PROJECT_ID); }
  catch { return null; }
}

app.post("/ask", async (req, res) => {
  const who = await authorize(req);
  if (!who) return res.status(401).json({ error: "sign in first" });
  const q = (req.body?.question || "").trim().slice(0, 1000);
  const channel = req.body?.channel === "whatsapp" ? "whatsapp" : "web";
  if (!q) return res.status(400).json({ error: "question required" });
  try {
    const hits = await retrieve(q, 8);
    const context = hits.map((h, i) => `[${i + 1}] (${h.source})\n${h.text}`).join("\n\n---\n\n");
    const msg = await client.messages.create({
      model: cfg.bilModel,
      max_tokens: 700,
      system: persona + `\n\nCHANNEL: ${channel}\n\nCONTEXT EXTRACTS FROM THE PROFESSOR'S MATERIAL:\n${context}`,
      messages: [{ role: "user", content: q }],
    });
    const answer = msg.content.filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    res.json({ answer, sources: [...new Set(hits.slice(0, 4).map(h => h.source))] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "bil failed", answer: "BIL has stepped out to take a call from a Bombay fund. Try again in a minute." });
  }
});

app.listen(cfg.bil.port, "0.0.0.0", () => console.log(`BIL listening on :${cfg.bil.port}`));
