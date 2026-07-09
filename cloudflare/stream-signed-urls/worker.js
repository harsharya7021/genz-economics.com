/* Stream signed-playback-token minter — the ACTUAL hard gate on lecture
   recordings (ARCHITECTURE.md "Phase 2 — Hard-gate the honeypot").

   Why this exists: until now, any session post with a `stream_id` embedded
   a plain `https://customer-CODE.cloudflarestream.com/{uid}/iframe` URL.
   That URL plays for ANYONE on the internet who has it — our own site's
   sign-in state has zero bearing on whether Cloudflare serves the video.
   Viewing page source (or just watching network requests) hands anyone
   the UID, permanently. This Worker, plus `requireSignedURLs: true` on
   every video (see README's one-time migration step), makes Cloudflare
   itself refuse the plain UID and only serve playback against a short-
   lived, per-viewer, cryptographically signed token minted HERE — and
   only after we've verified the caller is actually signed in as an
   allowed viewer. No amount of URL-sharing or view-source helps once
   this is live; a leaked token expires (default 4 hours) and was tied to
   one specific video anyway.

   Deploy: see README.md in this folder — Cloudflare dashboard Quick Edit,
   no CLI needed. Needs two things set as Worker secrets (never in this
   file, never in git): STREAM_SIGNING_KEY_ID and STREAM_SIGNING_KEY_PEM.

   Honesty check, stated plainly (also in HANDOFF.md): this stops the
   video from being *fetchable* by anyone but a signed-in, allowed viewer.
   It cannot stop that viewer from pointing a phone camera at their own
   screen, or using OS-level screen recording — no web technology can.
   The email watermark burned into the player (site.js) is the deterrent
   and forensic trace for that case; this Worker is what makes the file
   itself un-fetchable without signing in. Two different problems, two
   different fixes. */

const FIREBASE_API_KEY = "AIzaSyDiFmGRjx5HGCqSPA4w4G-_Zn37qaSl724"; // public web key, safe (see firebase-config.js)
const ALLOWED_DOMAINS = ["isb.edu"];
const ALLOWED_EMAILS = ["harsharya7021@gmail.com"];
const ALLOWED_ORIGINS = new Set([
  "https://genz-economics.com",
  "https://genz-economics-com.onrender.com",
  "http://localhost:4000",
]);
const TOKEN_TTL_SECONDS = 4 * 60 * 60; // 4 hours — long enough for one sitting, short enough to matter

function emailAllowed(email) {
  email = (email || "").toLowerCase();
  if (ALLOWED_EMAILS.includes(email)) return true;
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const domain = email.slice(at + 1);
  /* subdomains pass too — pgp.isb.edu, fpm.isb.edu etc., same as the site */
  return ALLOWED_DOMAINS.some((d) => domain === d || domain.endsWith("." + d));
}

function corsHeaders(origin) {
  const h = { "Vary": "Origin" };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    h["Access-Control-Allow-Headers"] = "Content-Type";
    h["Access-Control-Max-Age"] = "86400";
  }
  return h;
}

/* Verify the visitor's Firebase ID token by asking Google directly rather
   than re-implementing JWT/X.509 parsing in a Worker. This is not "less
   secure" — Google's own endpoint IS the source of truth for whether a
   token it issued is still valid, and the request is scoped to our own
   project via our own apiKey, so a valid response can only mean "signed
   in to gen z economics," not some unrelated Firebase project. */
async function verifyIdToken(idToken) {
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    /* The web apiKey is HTTP-referrer-restricted (correct for the site) —
       Google blocks refererless server calls. Workers, unlike browsers, may
       set Referer on subrequests, so we present the site's own referer. */
    { method: "POST", headers: { "content-type": "application/json", "Referer": "https://genz-economics.com/" }, body: JSON.stringify({ idToken }) }
  );
  if (!r.ok) { console.log("verify !ok", r.status, (await r.text()).slice(0, 300)); return null; }
  const j = await r.json();
  const user = j.users && j.users[0];
  if (!user) console.log("verify ok but no user", JSON.stringify(j).slice(0, 200));
  return user ? { email: user.email || "" } : null;
}

const b64url = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const b64urlStr = (str) => b64url(new TextEncoder().encode(str));

function pemToArrayBuffer(pem) {
  const b64 = pem.replace(/-----BEGIN [^-]+-----/, "").replace(/-----END [^-]+-----/, "").replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

/* Cloudflare returns the signing key as base64-of-PEM, and the PEM inside is
   PKCS#1 ("BEGIN RSA PRIVATE KEY") — Web Crypto only imports PKCS#8. Unwrap
   the base64 if needed, then wrap the PKCS#1 DER in a PKCS#8 envelope
   (SEQUENCE { version 0, rsaEncryption AlgorithmIdentifier, OCTET STRING }). */
function derLen(n) { if (n < 128) return [n]; const b = []; while (n > 0) { b.unshift(n & 0xff); n >>= 8; } return [0x80 | b.length, ...b]; }
function derWrap(tag, bytes) { return new Uint8Array([tag, ...derLen(bytes.length), ...bytes]); }
function pkcs1ToPkcs8(pkcs1) {
  const version = new Uint8Array([0x02, 0x01, 0x00]);
  const algId = new Uint8Array([0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00]);
  const octet = derWrap(0x04, new Uint8Array(pkcs1));
  const body = new Uint8Array(version.length + algId.length + octet.length);
  body.set(version, 0); body.set(algId, version.length); body.set(octet, version.length + algId.length);
  return derWrap(0x30, body).buffer;
}

let cachedKey = null;
async function getSigningKey(pem) {
  if (cachedKey) return cachedKey;
  if (!pem.includes("-----BEGIN")) pem = atob(pem.replace(/\s+/g, ""));  /* base64-of-PEM → PEM */
  let der = pemToArrayBuffer(pem);
  if (/BEGIN RSA PRIVATE KEY/.test(pem)) der = pkcs1ToPkcs8(der);         /* PKCS#1 → PKCS#8 */
  cachedKey = await crypto.subtle.importKey(
    "pkcs8", der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["sign"]
  );
  return cachedKey;
}

/* Cloudflare Stream's own signed-token shape: RS256 JWT, `kid` in the
   header (their key id, not ours), payload `sub` = video uid + `exp`
   (+ optional `downloadable`, `accessRules`). Matches Cloudflare's
   documented Node example 1:1, just built with Web Crypto instead of
   the `jsonwebtoken` npm package (Workers-portable, zero dependencies). */
async function signStreamToken(uid, keyId, pem) {
  const header = { alg: "RS256", kid: keyId };
  const payload = {
    sub: uid,
    kid: keyId,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    downloadable: false,
  };
  const signingInput = `${b64urlStr(JSON.stringify(header))}.${b64urlStr(JSON.stringify(payload))}`;
  const key = await getSigningKey(pem);
  const sig = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" }, key, new TextEncoder().encode(signingInput)
  );
  return `${signingInput}.${b64url(sig)}`;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST")
      return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers: cors });

    let body;
    try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers: cors }); }

    const { idToken, uid } = body || {};
    if (!idToken || !uid)
      return new Response(JSON.stringify({ error: "idToken and uid required" }), { status: 400, headers: cors });
    if (!/^[a-f0-9]{32}$/i.test(uid))
      return new Response(JSON.stringify({ error: "bad uid" }), { status: 400, headers: cors });

    const user = await verifyIdToken(idToken);
    if (!user) return new Response(JSON.stringify({ error: "sign in first" }), { status: 401, headers: { ...cors, "content-type": "application/json" } });
    if (!emailAllowed(user.email))
      return new Response(JSON.stringify({ error: "isb-only" }), { status: 403, headers: { ...cors, "content-type": "application/json" } });

    if (!env.STREAM_SIGNING_KEY_ID || !env.STREAM_SIGNING_KEY_PEM)
      return new Response(JSON.stringify({ error: "worker misconfigured — signing key secrets not set" }), { status: 500, headers: cors });

    try {
      const token = await signStreamToken(uid, env.STREAM_SIGNING_KEY_ID, env.STREAM_SIGNING_KEY_PEM);
      return new Response(JSON.stringify({ token, expiresIn: TOKEN_TTL_SECONDS }), {
        headers: { ...cors, "content-type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "token signing failed: " + e.message }), { status: 500, headers: cors });
    }
  },
};
