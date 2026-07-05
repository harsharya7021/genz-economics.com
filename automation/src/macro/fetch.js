/* Daily macro snapshot → _data/macro.json → git push (site rebuilds).
   Auto series via Yahoo chart API (server-side, no key). Manual block is PRESERVED —
   update repo/CPI/WPI/GDP/10Y/REER by hand when they change; the calendar tells you when.
   Cron: 45 18 * * 1-5  cd ~/genz/automation && node src/macro/fetch.js >> macro.log 2>&1 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { cfg } from "../config.js";

const SYMBOLS = { nifty: "^NSEI", sensex: "^BSESN", usdinr: "INR=X", brent: "BZ=F", gold: "GC=F", ust10y: "^TNX" };
const LABELS = { nifty: "NIFTY 50", sensex: "SENSEX", usdinr: "USD/INR", brent: "Brent ($)", gold: "Gold ($/oz)", ust10y: "US 10Y (%)" };

async function quote(sym) {
  const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1mo&interval=1d`, {
    headers: { "user-agent": "Mozilla/5.0 (genz-economics macro fetcher)" } });
  if (!r.ok) throw new Error(`${sym} ${r.status}`);
  const j = await r.json();
  const res = j.chart?.result?.[0];
  const closes = (res?.indicators?.quote?.[0]?.close || []).filter(x => x != null);
  if (!closes.length) throw new Error(`${sym}: no closes`);
  const v = closes[closes.length - 1], prev = closes[closes.length - 2] ?? v;
  const scale = sym === "^TNX" ? 0.1 : 1; // ^TNX is 10x the yield
  return { v: +(v * scale).toFixed(2), chg: +(((v - prev) / prev) * 100).toFixed(2), spark: closes.slice(-15).map(x => +(x * scale).toFixed(2)) };
}

const path = join(cfg.repoDir, "_data", "macro.json");
const cur = JSON.parse(readFileSync(path, "utf8"));
const auto = {};
for (const [k, sym] of Object.entries(SYMBOLS)) {
  try { auto[k] = { label: LABELS[k], ...(await quote(sym)) }; console.log(k, auto[k].v); }
  catch (e) { console.warn(k, "failed:", e.message); auto[k] = cur.auto?.[k] ?? { label: LABELS[k], v: null, chg: null, spark: [] }; }
}
const out = { as_of: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " IST", auto, manual: cur.manual };
writeFileSync(path, JSON.stringify(out, null, 2));
const g = (a) => execFileSync("git", a, { cwd: cfg.repoDir, stdio: "pipe" });
g(["add", "_data/macro.json"]);
try { g(["commit", "-m", "macro snapshot [auto]"]); g(["push", "origin", "main"]); console.log("pushed"); }
catch { console.log("no change"); }
