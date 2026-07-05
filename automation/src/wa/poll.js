import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { getAggregateVotesInPollMessage } from "@whiskeysockets/baileys";
import { cfg } from "../config.js";
import { createSundayMeeting } from "../zoom.js";

const STORE = "./polls.json";
const load = () => (existsSync(STORE) ? JSON.parse(readFileSync(STORE, "utf8")) : { polls: [] });
const save = (s) => writeFileSync(STORE, JSON.stringify(s, null, 2));

/** Wednesday: post the poll (and remember it for tallying). */
export async function postWeeklyPoll(sock) {
  const sent = await sock.sendMessage(cfg.waGroup, {
    poll: { name: cfg.pollQuestion, values: cfg.pollOptions, selectableCount: 1 },
  });
  const s = load();
  s.polls.push({ id: sent.key.id, key: sent.key, message: sent.message, options: cfg.pollOptions, createdAt: Date.now(), tallied: false, votes: {} });
  save(s);
  console.log("[poll] posted", sent.key.id);
  return sent;
}

/** Feed poll-vote updates (from messages.update) into the store. */
export async function onPollUpdates(sock, updates) {
  const s = load();
  let dirty = false;
  for (const u of updates) {
    if (!u.update?.pollUpdates) continue;
    const poll = s.polls.find(p => p.id === u.key?.id);
    if (!poll || poll.tallied) continue;
    try {
      const agg = getAggregateVotesInPollMessage({ message: poll.message, pollUpdates: u.update.pollUpdates });
      poll.votes = Object.fromEntries(agg.map(o => [o.name, o.voters.length]));
      dirty = true;
    } catch (e) { console.warn("[poll] vote decrypt failed:", e.message); }
  }
  if (dirty) save(s);
}

/** Friday: tally the newest open poll, create the Zoom meeting, announce. */
export async function tallyAndInvite(sock) {
  const s = load();
  const poll = [...s.polls].reverse().find(p => !p.tallied);
  if (!poll) { console.log("[tally] no open poll"); return; }
  const counts = poll.options.map(o => ({ o, n: poll.votes[o] || 0 }));
  counts.sort((a, b) => b.n - a.n || poll.options.indexOf(a.o) - poll.options.indexOf(b.o));
  const win = counts[0], total = counts.reduce((x, y) => x + y.n, 0);
  const hhmm = to24h(win.o);
  const zm = await createSundayMeeting(hhmm);
  const when = new Date(zm.start_time).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  const lines = [
    `Sunday session is confirmed: *${when}*`,
    total ? `(${win.o} won the poll — ${win.n}/${total} votes.)` : `(No votes this week — defaulting to ${win.o}. Democracy requires participation.)`,
    ``,
    `Zoom: ${zm.join_url}`,
    zm.passcode ? `Passcode: ${zm.passcode}` : null,
    ``,
    `Recording goes on the site after class; notes follow the same evening.`,
  ].filter(x => x !== null);
  await sock.sendMessage(cfg.waGroup, { text: lines.join("\n") });
  poll.tallied = true; poll.result = { winner: win.o, counts, meeting: { id: zm.id, join_url: zm.join_url, start_time: zm.start_time } };
  save(s);
  console.log("[tally]", win.o, "->", zm.join_url);
}

function to24h(label) {
  const m = label.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (!m) return "19:00";
  let h = +m[1]; const mi = m[2] || "00";
  const ap = (m[3] || "").toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${mi}`;
}
