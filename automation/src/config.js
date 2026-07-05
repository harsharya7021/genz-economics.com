import "dotenv/config";
const req = (k) => {
  const v = process.env[k];
  if (!v) console.warn(`[config] missing env: ${k}`);
  return v;
};
export const cfg = {
  waGroup: req("WA_GROUP_JID"),
  pollQuestion: process.env.POLL_QUESTION || "Sunday class — what time works?",
  pollOptions: (process.env.POLL_OPTIONS || "10:00 AM,11:00 AM,4:00 PM,7:00 PM").split(",").map(s => s.trim()),
  pollCron: process.env.POLL_CRON || "0 10 * * 3",
  tallyCron: process.env.TALLY_CRON || "0 10 * * 5",
  tz: process.env.TZ || "Asia/Kolkata",
  zoom: {
    accountId: req("ZOOM_ACCOUNT_ID"),
    clientId: req("ZOOM_CLIENT_ID"),
    clientSecret: req("ZOOM_CLIENT_SECRET"),
    user: process.env.ZOOM_USER || "me",
    durationMin: +(process.env.SESSION_DURATION_MIN || 120),
  },
  anthropicKey: req("ANTHROPIC_API_KEY"),
  notesModel: process.env.NOTES_MODEL || "claude-sonnet-5",
  bilModel: process.env.BIL_MODEL || "claude-sonnet-5",
  bil: {
    port: +(process.env.BIL_PORT || 8047),
    token: req("BIL_TOKEN"),
    corpusDir: process.env.CORPUS_DIR || "./corpus",
    indexFile: process.env.INDEX_FILE || "./corpus/index.json",
  },
  cf: { accountId: req("CF_ACCOUNT_ID"), token: req("CF_STREAM_TOKEN") },
  repoDir: process.env.REPO_DIR || "..",
  announce: {
    url: process.env.ANNOUNCE_URL || "http://127.0.0.1:8048/announce",
    token: req("ANNOUNCE_TOKEN"),
    port: +(process.env.ANNOUNCE_PORT || 8048),
  },
  siteBase: process.env.SITE_BASE || "https://genz-economics.com",
};
