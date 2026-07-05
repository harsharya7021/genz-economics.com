import { readFileSync } from "node:fs";
import { cfg } from "../config.js";
import { embed } from "./ingest.js";

let idx = null;
export function loadIndex() {
  if (!idx) idx = JSON.parse(readFileSync(cfg.bil.indexFile, "utf8"));
  return idx;
}
const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };

export async function retrieve(question, k = 8) {
  const { docs } = loadIndex();
  const [qv] = await embed([question]);
  return docs
    .map(d => ({ ...d, score: dot(qv, d.v) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
