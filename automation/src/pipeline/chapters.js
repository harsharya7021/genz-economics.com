import Anthropic from "@anthropic-ai/sdk";
import { cfg } from "../config.js";

const client = new Anthropic({ apiKey: cfg.anthropicKey });

/** Parse a WebVTT file into [{t: seconds, text}] cues. */
export function parseVTT(raw) {
  const cues = [];
  const blocks = raw.replace(/\r/g, "").split("\n\n");
  for (const b of blocks) {
    const m = b.match(/(\d{1,2}:)?\d{2}:\d{2}\.\d{3}\s*-->\s*/);
    if (!m) continue;
    const ts = b.match(/((\d{1,2}):)?(\d{2}):(\d{2})\.\d{3}/);
    const t = (+(ts[2] || 0)) * 3600 + (+ts[3]) * 60 + (+ts[4]);
    const text = b.split("\n").filter(l => !l.includes("-->") && !/^\d+$/.test(l.trim())).join(" ").trim();
    if (text) cues.push({ t, text });
  }
  return cues;
}

/** Ask Claude to segment the session into chapters. Returns [{start, title, summary}]. */
export async function chapterize(cues) {
  const compact = cues.map(c => `[${Math.round(c.t)}] ${c.text}`).join("\n");
  const msg = await client.messages.create({
    model: cfg.notesModel,
    max_tokens: 1500,
    system: "You segment lecture transcripts into chapters. Output ONLY valid JSON.",
    messages: [{
      role: "user",
      content: `Transcript of a ~2h finance lecture, lines as [seconds] text.\nSegment into 5–9 chapters at natural topic boundaries. Titles must be concrete and specific to what is discussed (use the professor's own phrases where possible), not generic.\nReturn JSON: {"chapters":[{"start":<seconds>,"title":"...","gist":"one line"}]}\n\n${compact.slice(0, 180000)}`,
    }],
  });
  const txt = msg.content.map(b => b.text || "").join("");
  const j = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1));
  return j.chapters;
}
