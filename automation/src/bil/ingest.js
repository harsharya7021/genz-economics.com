/* Build the local vector index over the corpus dir (txt/md files).
   Model: all-MiniLM-L6-v2 via @huggingface/transformers — CPU, no API key. */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { pipeline } from "@huggingface/transformers";
import { cfg } from "../config.js";

const CHUNK = 1600, OVERLAP = 200; // characters
function* walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if ([".txt", ".md"].includes(extname(f).toLowerCase())) yield p;
  }
}
function chunks(text) {
  const out = [];
  for (let i = 0; i < text.length; i += CHUNK - OVERLAP) out.push(text.slice(i, i + CHUNK));
  return out.filter(c => c.trim().length > 120);
}
const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
export async function embed(texts) {
  const out = [];
  for (const t of texts) {
    const r = await embedder(t, { pooling: "mean", normalize: true });
    out.push(Array.from(r.data));
  }
  return out;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const docs = [];
  for (const p of walk(cfg.bil.corpusDir)) {
    if (basename(p) === "index.json") continue;
    const raw = readFileSync(p, "utf8");
    for (const [i, c] of chunks(raw).entries()) docs.push({ source: basename(p).replace(/\.(txt|md)$/i, ""), part: i, text: c });
  }
  console.log(`embedding ${docs.length} chunks from corpus…`);
  const vecs = await embed(docs.map(d => d.text));
  docs.forEach((d, i) => (d.v = vecs[i].map(x => +x.toFixed(6))));
  writeFileSync(cfg.bil.indexFile, JSON.stringify({ model: "all-MiniLM-L6-v2", built: new Date().toISOString(), docs }));
  console.log(`wrote ${cfg.bil.indexFile}`);
}
