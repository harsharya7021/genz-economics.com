import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { cfg } from "../config.js";

const client = new Anthropic({ apiKey: cfg.anthropicKey });
const system = readFileSync(new URL("../../prompts/notes-system.md", import.meta.url), "utf8");

/** Generate notes for one chapter from its transcript slice. */
export async function chapterNotes(chapter, cues, nextStart) {
  const slice = cues.filter(c => c.t >= chapter.start && c.t < (nextStart ?? Infinity))
    .map(c => c.text).join(" ");
  const msg = await client.messages.create({
    model: cfg.notesModel,
    max_tokens: 1600,
    system,
    messages: [{
      role: "user",
      content: `Chapter title: ${chapter.title}\nWrite the session notes for this chapter only: 250–450 words of flowing prose (no bullets), grounded ONLY in this transcript slice. Quote his characteristic lines verbatim.\n\nTRANSCRIPT:\n${slice.slice(0, 60000)}`,
    }],
  });
  return msg.content.map(b => b.text || "").join("").trim();
}
