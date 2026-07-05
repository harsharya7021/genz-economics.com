/* BIL answer service — used by the WA bot (localhost) and the Firebase proxy (via HTTPS/tunnel). */
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { cfg } from "../config.js";
import { retrieve, loadIndex } from "./rag.js";

const persona = readFileSync(new URL("./persona.md", import.meta.url), "utf8");
const client = new Anthropic({ apiKey: cfg.anthropicKey });
const app = express();
app.use(express.json());

app.get("/health", (_q, res) => {
  try { const n = loadIndex().docs.length; res.json({ ok: true, chunks: n }); }
  catch { res.json({ ok: false, error: "index missing — run npm run ingest" }); }
});

app.post("/ask", async (req, res) => {
  if (req.headers.authorization !== `Bearer ${cfg.bil.token}`) return res.status(401).end();
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
