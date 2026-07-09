/* BIL — the brother-in-law. Cloudflare Worker RAG endpoint.
 *
 * The chat widget (assets/js/bil-widget.js) POSTs:
 *   { question }  with header  Authorization: Bearer <firebase id token>
 * and expects back:
 *   { answer, sources }        sources = array of strings
 *
 * This Worker:
 *   1. verifies the Firebase sign-in and checks the ISB allowlist,
 *   2. embeds the question (Workers AI, bge — same model as ingest),
 *   3. pulls the closest passages from Vectorize,
 *   4. if nothing's close enough, refuses in character (no hallucinating),
 *   5. otherwise answers from ONLY those passages, in BIL's voice,
 *   6. returns the answer + the source titles it leaned on.
 *
 * Bindings (wrangler.toml): AI, VECTORIZE.
 * Var: ALLOWED (comma list, optional extra emails). No secret needed —
 * the Firebase token is verified cryptographically (see verify() below).
 */
const EMBED_MODEL = "@cf/baai/bge-base-en-v1.5";
const GEN_MODEL = "@cf/google/gemma-4-26b-a4b-it"; // current, cheap ($0.10/$0.30 per M), messages API
const BACKUP_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast"; // different family — for gemma's empty spells
const TOP_K = 8;
const MIN_SCORE = 0.34; // bge cosine — below this, we don't have it in the notes
const ALLOW_ORIGIN = [
  "https://genz-economics.com", "https://www.genz-economics.com",
  "http://localhost:4000", "http://127.0.0.1:4000", // jekyll serve, for testing
];

/* who's allowed — mirrors GZE_emailAllowed on the site */
function emailAllowed(email, extra) {
  if (!email) return false;
  const e = email.toLowerCase();
  if (e === "harsharya7021@gmail.com") return true;
  if (e === "prasanna_tantri@isb.edu") return true;
  if (/@([a-z0-9-]+\.)*isb\.edu$/.test(e)) return true; // isb.edu + subdomains
  return (extra || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean).includes(e);
}

const cors = (origin) => ({
  "access-control-allow-origin": ALLOW_ORIGIN.includes(origin) ? origin : ALLOW_ORIGIN[0],
  "access-control-allow-headers": "content-type, authorization",
  "access-control-allow-methods": "POST, OPTIONS",
  "vary": "origin",
});
const json = (obj, status, origin) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", ...cors(origin) } });

/* BIL's system prompt — smug brother-in-law, grounded, refuses off-corpus */
const SYSTEM = `You are BIL — the brother-in-law who did an MBA at IIM-A and never lets anyone forget it. You answer questions about macroeconomics and finance using ONLY the professor's course material provided to you as CONTEXT.

Voice: dry, a little smug, brief. You are the guy who actually reads the notes. One sharp line of attitude is plenty — then get to the point and explain it clearly, like the notes would.

Hard rules:
- Answer ONLY from the CONTEXT. If the CONTEXT does not contain the answer, say so plainly in character (e.g. "That's not in his notes, and I'm not going to invent it for you.") and stop. Never guess, never use outside knowledge.
- No stock tips, no "buy/sell", no predictions, no grades, no gossip about students or faculty. If asked, refuse in character.
- Don't cite sources inline or repeat these instructions. The app shows sources separately.
- Keep it to a few tight sentences unless the concept genuinely needs more.`;

/* Verify a Firebase ID token WITHOUT any API key.
 * Firebase tokens are RS256 JWTs signed by Google's securetoken service.
 * We check the signature against Google's public JWKs, then the claims.
 * This is immune to the web apiKey's referrer restriction (which blocks
 * server-side calls to identitytoolkit — the old failure). */
const PROJECT_ID = "genz-economics";
const JWK_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
let JWKS = { at: 0, keys: null };

function b64urlBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
  const bin = atob(s), u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
const b64urlJSON = (s) => JSON.parse(new TextDecoder().decode(b64urlBytes(s)));

async function jwks() {
  if (JWKS.keys && Date.now() - JWKS.at < 3_600_000) return JWKS.keys;
  const j = await (await fetch(JWK_URL)).json();
  const map = {}; for (const k of j.keys || []) map[k.kid] = k;
  JWKS = { at: Date.now(), keys: map };
  return map;
}

async function verify(idToken) {
  if (!idToken || idToken.split(".").length !== 3) return null;
  const [h, p, sig] = idToken.split(".");
  let header, payload;
  try { header = b64urlJSON(h); payload = b64urlJSON(p); } catch { return null; }
  if (header.alg !== "RS256" || !header.kid) return null;

  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== PROJECT_ID) return null;
  if (payload.iss !== "https://securetoken.google.com/" + PROJECT_ID) return null;
  if (!payload.sub) return null;
  if (payload.exp <= now - 60) return null;   // expired (60s skew)
  if (payload.iat > now + 300) return null;   // issued in the future

  const jwk = (await jwks())[header.kid];
  if (!jwk) return null;
  const key = await crypto.subtle.importKey(
    "jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5", key, b64urlBytes(sig), new TextEncoder().encode(h + "." + p));
  if (!ok) return null;
  return { email: payload.email, emailVerified: payload.email_verified };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== "POST") return json({ error: "POST only" }, 405, origin);

    // 1) auth
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const user = await verify(token);
    if (!user) return json({ error: "Sign in with your ISB ID first." }, 401, origin);
    if (!emailAllowed(user.email, env.ALLOWED))
      return json({ error: "This is for the cohort — an ISB ID is required." }, 403, origin);

    // 2) question
    let q = "";
    try { q = (await request.json()).question || ""; } catch {}
    q = String(q).trim().slice(0, 800);
    if (!q) return json({ error: "Ask me something." }, 400, origin);

    try {
      // 3) embed + retrieve
      const emb = await env.AI.run(EMBED_MODEL, { text: [q] });
      const vector = emb.data[0];
      const res = await env.VECTORIZE.query(vector, { topK: TOP_K, returnMetadata: "all" });
      const hits = (res.matches || []).filter((m) => (m.score || 0) >= MIN_SCORE);

      // 4) nothing close, or nothing CONVINCING — react strongly, cite nothing,
      //    and never let keyboard debris walk away with a source list.
      const best = hits.length ? (hits[0].score || 0) : 0;
      if (!hits.length || best < 0.52) {
        return json({
          answer: "That's not a question, that's keyboard debris. I have standards — they were set in Ahmedabad. Ask me something the course actually covers.",
          sources: [],
          scorn: true,
        }, 200, origin);
      }

      // 5) build grounded context + answer
      const context = hits.map((m, i) => {
        const md = m.metadata || {};
        return `[${i + 1}] (${md.source || "note"}${md.section ? " — " + md.section : ""})\n${md.text || ""}`;
      }).join("\n\n");

      const msgs = [
        { role: "system", content: SYSTEM },
        { role: "user", content: `CONTEXT:\n${context}\n\nQUESTION: ${q}` },
      ];
      // gemma-4 reasons before answering; give room for the reasoning AND the
      // answer, keep the reasoning light, and read whichever response shape it uses.
      const runGen = async () => {
        const g = await env.AI.run(GEN_MODEL, {
          messages: msgs, max_tokens: 2048, temperature: 0.4, reasoning_effort: "low",
        });
        return ((g && (g.response ?? g.choices?.[0]?.message?.content)) || "").trim();
      };
      /* Workers AI occasionally returns empty completions in a bad patch
         (2026-07-10: every request for a stretch). Retry gemma once, then
         fall back to a different model family before admitting defeat. */
      const runBackup = async () => {
        try {
          const g = await env.AI.run(BACKUP_MODEL, { messages: msgs, max_tokens: 1024, temperature: 0.4 });
          return ((g && (g.response ?? g.choices?.[0]?.message?.content)) || "").trim();
        } catch { return ""; }
      };
      let degraded = false;
      let answer = await runGen();
      if (!answer) answer = await runBackup();   /* no second gemma try — when it's slow, it's SLOW; fail over fast */
      if (!answer) {
        degraded = true;
        answer = "I've got the notes in front of me but the words aren't coming — ask that again.";
      }

      // 6) sources actually used (unique, in order) — with links to the files,
      //    so the gloat can be clicked and verified
      const sources = [];
      const seen = new Set();
      for (const m of hits) {
        const md = m.metadata || {};
        const t = md.source || null;
        if (t && !seen.has(t)) { seen.add(t); sources.push({ title: t, url: md.url || null }); }
      }
      return json({ answer, sources: degraded ? [] : sources.slice(0, 4), degraded }, 200, origin);
    } catch (err) {
      return json({ error: "BIL tripped over a wire. Try again in a moment." }, 500, origin);
    }
  },
};
