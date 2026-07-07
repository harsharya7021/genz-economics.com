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
 * Secret: FIREBASE_API_KEY.  Var: ALLOWED (comma list, optional extra emails).
 */
const EMBED_MODEL = "@cf/baai/bge-base-en-v1.5";
const GEN_MODEL = "@cf/meta/llama-3.1-8b-instruct";
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

async function verify(idToken, env) {
  if (!idToken) return null;
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.FIREBASE_API_KEY}`,
    { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken }) }
  );
  if (!r.ok) return null;
  const d = await r.json();
  const u = d.users && d.users[0];
  return u && u.emailVerified !== false ? u : (u || null);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== "POST") return json({ error: "POST only" }, 405, origin);

    // 1) auth
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const user = await verify(token, env);
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

      // 4) nothing close — refuse in character, don't call the model to freestyle
      if (!hits.length) {
        return json({
          answer: "That's not in his notes — and unlike the internet, I don't make things up to sound busy. Ask me something he actually covered.",
          sources: [],
        }, 200, origin);
      }

      // 5) build grounded context + answer
      const context = hits.map((m, i) => {
        const md = m.metadata || {};
        return `[${i + 1}] (${md.source || "note"}${md.section ? " — " + md.section : ""})\n${md.text || ""}`;
      }).join("\n\n");

      const gen = await env.AI.run(GEN_MODEL, {
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `CONTEXT:\n${context}\n\nQUESTION: ${q}` },
        ],
        max_tokens: 640,
        temperature: 0.4,
      });
      const answer = (gen.response || "").trim() ||
        "I've got the notes in front of me but the words aren't coming — try asking that again.";

      // 6) sources actually used (unique, in order)
      const sources = [];
      for (const m of hits) {
        const s = (m.metadata && m.metadata.source) || null;
        if (s && !sources.includes(s)) sources.push(s);
      }
      return json({ answer, sources: sources.slice(0, 4) }, 200, origin);
    } catch (err) {
      return json({ error: "BIL tripped over a wire. Try again in a moment." }, 500, origin);
    }
  },
};
