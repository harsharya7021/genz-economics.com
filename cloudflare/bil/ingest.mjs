/* BIL corpus ingest — clean tier first.
 *
 * Reads the site's OWN content (session notes, the three long reads, the
 * glossary) plus anything you drop in cloudflare/bil/corpus/ (cleaned
 * transcripts, extra .md/.txt), chunks it by heading, tags every chunk with
 * its source, embeds each chunk with Cloudflare Workers AI, and writes an
 * NDJSON you load into Vectorize. Re-run whenever the notes change.
 *
 * It deliberately does NOT touch: the WhatsApp group, student messages, or the
 * third-party copyrighted PDFs. Only his material, cleanly attributed.
 *
 * Usage:
 *   CF_ACCOUNT_ID=... CF_API_TOKEN=... node cloudflare/bil/ingest.mjs
 *   wrangler vectorize insert gze-bil --file cloudflare/bil/corpus.ndjson
 *
 * The API token needs the "Workers AI: Read" permission (for embeddings).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const ACCOUNT = process.env.CF_ACCOUNT_ID;
const TOKEN = process.env.CF_API_TOKEN;
const EMBED_MODEL = "@cf/baai/bge-base-en-v1.5"; // 768-dim, matches the Worker
const MAX_CHARS = 1600; // ~400 tokens per chunk
const OUT = path.join(HERE, "corpus.ndjson");

const DRY = !!process.env.BIL_DRY; // preview chunks without embedding (no creds needed)
if (!DRY && (!ACCOUNT || !TOKEN)) { console.error("Set CF_ACCOUNT_ID and CF_API_TOKEN (or BIL_DRY=1 to preview)."); process.exit(1); }

/* ── helpers ─────────────────────────────────────────────────── */
const stripFrontMatter = (s) => s.replace(/^---\n[\s\S]*?\n---\n/, "");
const stripHtml = (s) => s
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&nbsp;|&#8202;|&#8239;/g, " ").replace(/&[a-z]+;/g, " ");
const clean = (s) => s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
/* strip markdown syntax but keep the words (links → text, drop bullets/emphasis) */
const deMd = (s) => s
  .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")     // images
  .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")   // links → their text
  .replace(/^[ \t]*[-*+]\s+/gm, "")          // bullet markers
  .replace(/^[ \t]*\d+\.\s+/gm, "")          // numbered markers
  .replace(/^\s{0,3}([-*_])\1{2,}\s*$/gm, "") // --- *** ___ horizontal rules
  .replace(/[*_`]{1,3}/g, "")                // emphasis / code ticks
  .replace(/^\s{0,3}>\s?/gm, "");            // blockquote marks

/* split a body into <= MAX_CHARS chunks on paragraph/sentence boundaries */
function pack(body) {
  const out = [];
  let buf = "";
  for (const para of body.split(/\n{2,}/)) {
    const p = para.trim(); if (!p) continue;
    if ((buf + "\n\n" + p).length > MAX_CHARS && buf) { out.push(buf); buf = p; }
    else buf = buf ? buf + "\n\n" + p : p;
    while (buf.length > MAX_CHARS) { out.push(buf.slice(0, MAX_CHARS)); buf = buf.slice(MAX_CHARS); }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

/* markdown → sections split on real ## headings */
function sectionsFromMd(md) {
  const body = stripHtml(stripFrontMatter(md)); // drops <script>/<style>/tags, keeps # marks
  const secs = [];
  let section = "Intro", buf = [];
  for (const line of body.split("\n")) {
    const h = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (h) {
      const t = clean(deMd(buf.join("\n"))); if (t) secs.push({ section, body: t });
      section = clean(deMd(h[1])) || "Section"; buf = [];
    } else buf.push(line);
  }
  const t = clean(deMd(buf.join("\n"))); if (t) secs.push({ section, body: t });
  return secs.length ? secs : [{ section: "Body", body: clean(deMd(body)) }];
}

/* html essay → sections keyed by <h2>/<h3>/.w-head */
function sectionsFromHtml(html) {
  const re = /<(h2|h3)[^>]*>([\s\S]*?)<\/\1>|<p class="w-head"[^>]*>([\s\S]*?)<\/p>/gi;
  const marks = []; let m;
  while ((m = re.exec(html))) marks.push({ i: m.index, end: re.lastIndex, title: clean(stripHtml(m[2] || m[3] || "")) });
  const secs = [];
  for (let k = 0; k < marks.length; k++) {
    const from = marks[k].end, to = k + 1 < marks.length ? marks[k + 1].i : html.length;
    const body = clean(stripHtml(html.slice(from, to)));
    if (body.length > 40) secs.push({ section: marks[k].title || "Section", body });
  }
  return secs.length ? secs : [{ section: "Body", body: clean(stripHtml(html)) }];
}

/* ── gather chunks ───────────────────────────────────────────── */
const chunks = [];
const add = (text, meta) => { const t = text.trim(); if (t.length >= 60) chunks.push({ text: t, meta }); };

// 1) session notes
for (const f of fs.readdirSync(path.join(ROOT, "_posts")).filter((f) => f.endsWith(".md"))) {
  const raw = fs.readFileSync(path.join(ROOT, "_posts", f), "utf8");
  const title = (raw.match(/^title:\s*"?(.+?)"?\s*$/m) || [])[1] || f;
  const url = "/" + f.replace(/^(\d{4})-(\d{2})-\d{2}-(.+)\.md$/, "$1/$2/$3") + "/";
  for (const s of sectionsFromMd(raw)) for (const c of pack(s.body))
    add(c, { source: "Session note: " + title, title, url, section: s.section });
}
// 2) long reads
for (const [f, name] of [["corporate-finance.html", "What is corporate finance?"],
                         ["indian-financial-system.html", "What is the Indian financial system?"],
                         ["what-is-macro.html", "What is macro?"]]) {
  const p = path.join(ROOT, f); if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, "utf8");
  for (const s of sectionsFromHtml(html)) for (const c of pack(s.body))
    add(c, { source: name, title: name, url: "/" + f.replace(".html", "") + "/", section: s.section });
}
// 3) glossary
try {
  const gl = fs.readFileSync(path.join(ROOT, "_data", "glossary.yml"), "utf8");
  for (const line of gl.split("\n")) {
    const m = line.match(/term:\s*"([^"]+)".*cat:\s*"([^"]+)".*def:\s*"([^"]+)"/);
    if (m) add(`${m[1]} (${m[2]}): ${m[3]}`, { source: "Glossary", title: "Glossary", url: "/glossary/", section: m[1] });
  }
} catch {}
// 4) optional corpus/ (cleaned transcripts, extra .md/.txt you drop in)
const corpusDir = path.join(HERE, "corpus");
if (fs.existsSync(corpusDir)) {
  const walk = (d) => fs.readdirSync(d).forEach((n) => {
    const p = path.join(d, n); const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(md|txt)$/i.test(n)) {
      const raw = fs.readFileSync(p, "utf8");
      const name = n.replace(/\.(md|txt)$/i, "");
      for (const s of sectionsFromMd(raw)) for (const c of pack(s.body))
        add(c, { source: name, title: name, url: "", section: s.section });
    }
  });
  walk(corpusDir);
}

console.log(`Chunked ${chunks.length} passages.`);

/* ── dry run: preview the corpus without spending on embeddings ─ */
if (DRY) {
  const bySource = {};
  let min = Infinity, max = 0, total = 0;
  for (const c of chunks) {
    const key = c.meta.source.replace(/^Session note: .*/, "Session notes");
    bySource[key] = (bySource[key] || 0) + 1;
    const n = c.text.length; min = Math.min(min, n); max = Math.max(max, n); total += n;
  }
  console.log("\nChunks by source:");
  for (const [k, v] of Object.entries(bySource).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
  console.log(`\nChunk length: min ${min}, max ${max}, avg ${Math.round(total / chunks.length)} chars`);
  console.log("\nSample chunks:");
  for (const c of [chunks[0], chunks[Math.floor(chunks.length / 2)], chunks[chunks.length - 1]]) {
    console.log(`\n  ── ${c.meta.source} — ${c.meta.section} (${c.meta.url || "no url"})`);
    console.log("  " + c.text.slice(0, 220).replace(/\n/g, " ") + "…");
  }
  console.log("\n(dry run — nothing embedded or written)");
  process.exit(0);
}

console.log(`Embedding with ${EMBED_MODEL}…`);

/* ── embed (batched) + write NDJSON ──────────────────────────── */
async function embed(texts) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/ai/run/${EMBED_MODEL}`, {
    method: "POST", headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ text: texts }),
  });
  const j = await r.json();
  if (!j.success) throw new Error(JSON.stringify(j.errors || j));
  return j.result.data;
}

const lines = [];
for (let i = 0; i < chunks.length; i += 50) {
  const batch = chunks.slice(i, i + 50);
  const vecs = await embed(batch.map((c) => c.text));
  batch.forEach((c, k) => lines.push(JSON.stringify({
    id: "c" + (i + k),
    values: vecs[k],
    metadata: { text: c.text.slice(0, 2000), ...c.meta },
  })));
  process.stdout.write(`  embedded ${Math.min(i + 50, chunks.length)}/${chunks.length}\r`);
}
fs.writeFileSync(OUT, lines.join("\n") + "\n");
console.log(`\nWrote ${lines.length} vectors → ${path.relative(ROOT, OUT)}`);
console.log(`Next: wrangler vectorize insert gze-bil --file ${path.relative(ROOT, OUT)}`);
