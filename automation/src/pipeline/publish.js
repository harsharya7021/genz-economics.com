import { writeFileSync, mkdirSync, copyFileSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { cfg } from "../config.js";

const hhmmss = (s) => [3600, 60, 1].map(u => { const v = Math.floor(s / u); s %= u; return String(v).padStart(2, "0"); }).join(":");
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

/** Write the Jekyll post + images into the repo. Returns {postPath, url, slug}. */
export function writePost({ title, dateISO, chapters, notes, shots, streamId }) {
  const date = dateISO.slice(0, 10);
  const slug = slugify(title);
  const imgDir = join(cfg.repoDir, "assets", "img", "sessions", date);
  mkdirSync(imgDir, { recursive: true });
  const imgRel = [];
  shots.forEach((s, i) => { const rel = `/assets/img/sessions/${date}/ch-${i + 1}.jpg`; copyFileSync(s, join(cfg.repoDir, rel)); imgRel.push(rel); });

  const fm = [
    "---", "layout: post", `title: "${title.replace(/"/g, '\\"')}"`,
    `dek: "Session notes, generated from the recording the same evening — his words carried over verbatim wherever they land."`,
    `date: ${date}`, "tags: [session-notes, tantri-files]", "authors:\n  - tantri\neditors:\n  - pipeline",
    streamId ? `stream_id: ${streamId}` : "# stream_id: pending — video publishes Wednesday",
    "chapters:",
    ...chapters.map((c, i) => `  - { t: ${Math.round(c.start)}, label: "${c.title.replace(/"/g, '\\"')}" }`),
    "---", "",
  ].join("\n");

  const body = chapters.map((c, i) =>
    `## ${c.title}\n\n*from ${hhmmss(c.start)}*\n\n![${c.title}](${imgRel[i]})\n\n${notes[i]}\n`
  ).join("\n");

  const postPath = join(cfg.repoDir, "_posts", `${date}-${slug}.md`);
  writeFileSync(postPath, fm + body);
  return { postPath, slug, url: `${cfg.siteBase}/${date.replace(/-/g, "/")}/${slug}/` };
}

/** Patch stream_id into an existing post (Wednesday video publish). */
export function patchStreamId(postPath, streamId) {
  let s = readFileSync(postPath, "utf8");
  s = s.replace(/# stream_id: pending.*|stream_id: .*/g, `stream_id: ${streamId}`);
  writeFileSync(postPath, s);
}

export function gitPush(msg) {
  const g = (args) => execFileSync("git", args, { cwd: cfg.repoDir, stdio: "pipe" }).toString();
  g(["add", "-A"]);
  try { g(["commit", "-m", msg]); } catch { console.log("nothing to commit"); return false; }
  g(["push", "origin", "main"]);
  return true;
}

export async function announce(text) {
  const r = await fetch(cfg.announce.url, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${cfg.announce.token}` },
    body: JSON.stringify({ text }),
  });
  if (!r.ok) console.warn("announce failed", r.status);
}
