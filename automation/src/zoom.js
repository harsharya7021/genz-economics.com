import { cfg } from "./config.js";

let tok = { v: null, exp: 0 };
export async function zoomToken() {
  if (tok.v && Date.now() < tok.exp - 60_000) return tok.v;
  const r = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${cfg.zoom.accountId}`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${cfg.zoom.clientId}:${cfg.zoom.clientSecret}`).toString("base64") },
  });
  if (!r.ok) throw new Error(`zoom token ${r.status}: ${await r.text()}`);
  const j = await r.json();
  tok = { v: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return tok.v;
}

async function zoomApi(path, opts = {}) {
  const t = await zoomToken();
  const r = await fetch(`https://api.zoom.us/v2${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  if (!r.ok) throw new Error(`zoom ${path} ${r.status}: ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}

/** Create the Sunday session meeting. timeHHMM like "19:00", IST. */
export async function createSundayMeeting(timeHHMM) {
  const start = nextSundayAt(timeHHMM);
  const m = await zoomApi(`/users/${cfg.zoom.user}/meetings`, {
    method: "POST",
    body: JSON.stringify({
      topic: "Prof. Tantri — Sunday session",
      type: 2,
      start_time: start, // ISO with offset
      duration: cfg.zoom.durationMin,
      timezone: "Asia/Kolkata",
      settings: { join_before_host: false, waiting_room: false, mute_upon_entry: true, auto_recording: "cloud" },
    }),
  });
  return { join_url: m.join_url, id: m.id, passcode: m.password, start_time: start };
}

export function nextSundayAt(timeHHMM) {
  // Compute next Sunday in IST regardless of server TZ.
  const now = new Date(Date.now() + 5.5 * 3600e3); // shift to IST wall-clock
  const dow = now.getUTCDay();                      // 0=Sun in shifted frame
  let add = (7 - dow) % 7;
  if (add === 0) add = 7;                           // "next" Sunday, never today
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() + add);
  const [h, mi] = timeHHMM.split(":").map(Number);
  const yyyy = d.getUTCFullYear(), mm = String(d.getUTCMonth() + 1).padStart(2, "0"), dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}:00+05:30`;
}

/** Most recent cloud recording with an MP4 + VTT, within `days`. */
export async function latestRecording(days = 6) {
  const from = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  const j = await zoomApi(`/users/${cfg.zoom.user}/recordings?from=${from}&page_size=30`);
  const meetings = (j.meetings || []).sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
  for (const m of meetings) {
    const mp4 = (m.recording_files || []).find(f => f.file_type === "MP4" && f.status === "completed");
    const vtt = (m.recording_files || []).find(f => f.file_type === "TRANSCRIPT");
    if (mp4) return { meeting: m, mp4, vtt: vtt || null };
  }
  return null;
}

export async function download(url, dest) {
  const t = await zoomToken();
  const r = await fetch(`${url}?access_token=${t}`, { redirect: "follow" });
  if (!r.ok) throw new Error(`download ${r.status}`);
  const { writeFile } = await import("node:fs/promises");
  await writeFile(dest, Buffer.from(await r.arrayBuffer()));
  return dest;
}
