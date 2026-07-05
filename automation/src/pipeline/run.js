/* Orchestrator.
   Stages:
     node src/pipeline/run.js notes            → fetch latest recording, chapterize, notes+shots, publish post, announce
     node src/pipeline/run.js notes --local session.mp4 session.vtt --title "..." --date 2026-07-05
     node src/pipeline/run.js video            → upload latest MP4 to Stream, patch newest session post, push, announce
     node src/pipeline/run.js watch            → poll Zoom every 10 min until a new recording appears, then run notes
   Cron (VPS):
     10 18-23 * * 0  cd ~/genz/automation && node src/pipeline/run.js watch --once   # Sunday evenings
     30 10 * * 3     cd ~/genz/automation && node src/pipeline/run.js video          # Wednesday with the poll */
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cfg } from "../config.js";
import { latestRecording, download } from "../zoom.js";
import { parseVTT, chapterize } from "./chapters.js";
import { chapterNotes } from "./notes.js";
import { screenshots } from "./shots.js";
import { uploadToStream } from "./stream.js";
import { writePost, patchStreamId, gitPush, announce } from "./publish.js";

const arg = (k, d = null) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const stage = process.argv[2];
mkdirSync("./downloads", { recursive: true });

async function getMaterial() {
  const localMp4 = arg("--local");
  if (localMp4) {
    const vtt = process.argv[process.argv.indexOf("--local") + 2];
    return { mp4: localMp4, vtt, title: arg("--title", "Sunday session"), dateISO: arg("--date", new Date().toISOString()) };
  }
  const rec = await latestRecording();
  if (!rec) throw new Error("no cloud recording found in the last 6 days");
  const base = `./downloads/${rec.meeting.start_time.slice(0, 10)}`;
  console.log("downloading", rec.meeting.topic, rec.meeting.start_time);
  const mp4 = await download(rec.mp4.download_url, `${base}.mp4`);
  const vtt = rec.vtt ? await download(rec.vtt.download_url, `${base}.vtt`) : null;
  return { mp4, vtt, title: arg("--title", rec.meeting.topic || "Sunday session"), dateISO: rec.meeting.start_time };
}

async function runNotes() {
  const m = await getMaterial();
  if (!m.vtt) throw new Error("no transcript (VTT) — enable audio transcript in Zoom cloud recording settings");
  const cues = parseVTT(readFileSync(m.vtt, "utf8"));
  console.log(`${cues.length} cues; chapterizing…`);
  const chapters = await chapterize(cues);
  console.log(chapters.map(c => `  [${c.start}s] ${c.title}`).join("\n"));
  const notes = [];
  for (let i = 0; i < chapters.length; i++) {
    console.log(`notes ${i + 1}/${chapters.length}…`);
    notes.push(await chapterNotes(chapters[i], cues, chapters[i + 1]?.start));
  }
  const shots = screenshots(m.mp4, chapters, `./downloads/shots-${m.dateISO.slice(0, 10)}`);
  const post = writePost({ title: m.title, dateISO: m.dateISO, chapters, notes, shots, streamId: null });
  if (gitPush(`session notes: ${m.title} (${m.dateISO.slice(0, 10)}) [pipeline]`))
    await announce(`Notes from today's session are up — chapter by chapter, with screenshots:\n${post.url}\n\nThe recording itself lands on the site Wednesday, with the poll.`);
  console.log("published:", post.url);
}

async function runVideo() {
  const m = await getMaterial();
  const uid = await uploadToStream(m.mp4, m.title);
  const posts = readdirSync(join(cfg.repoDir, "_posts")).filter(f => f.includes("session") || true).sort().reverse();
  const target = posts.find(f => readFileSync(join(cfg.repoDir, "_posts", f), "utf8").includes("stream_id: pending") || readFileSync(join(cfg.repoDir, "_posts", f), "utf8").includes("# stream_id: pending"));
  if (!target) throw new Error("no post awaiting a stream_id — pass --post <filename> or check _posts");
  patchStreamId(join(cfg.repoDir, "_posts", target), uid);
  if (gitPush(`attach recording ${uid} → ${target} [pipeline]`))
    await announce(`Last Sunday's recording is now on the site (sign in to watch). This week's time poll is above — vote before Friday.`);
  console.log("stream attached:", uid, "→", target);
}

async function watch() {
  const seenBefore = (await latestRecording())?.meeting?.uuid;
  for (let i = 0; i < 24; i++) {
    await new Promise(r => setTimeout(r, 10 * 60 * 1000));
    const rec = await latestRecording(1);
    if (rec && rec.meeting.uuid !== seenBefore && rec.vtt) { console.log("new recording detected"); return runNotes(); }
    console.log("waiting for recording…", i);
  }
  console.log("watch window over, nothing new");
}

({ notes: runNotes, video: runVideo, watch })[stage]?.().catch(e => { console.error(e); process.exit(1); })
  ?? console.log("usage: run.js notes|video|watch [--local mp4 vtt] [--title t] [--date d]");
