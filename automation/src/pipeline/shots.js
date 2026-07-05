import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

/** Grab one frame per chapter from the MP4 (a few seconds in, past the topic switch). */
export function screenshots(mp4, chapters, outDir) {
  mkdirSync(outDir, { recursive: true });
  const files = [];
  chapters.forEach((ch, i) => {
    const t = Math.max(0, ch.start + 20);
    const out = `${outDir}/ch-${i + 1}.jpg`;
    execFileSync("ffmpeg", ["-y", "-ss", String(t), "-i", mp4, "-frames:v", "1", "-q:v", "4", "-vf", "scale=1280:-2", out], { stdio: "pipe" });
    files.push(out);
  });
  return files;
}
