/* Verify a Firebase Auth ID token (the site's Google sign-in) without firebase-admin.
   Standard securetoken.google.com JWT verification via Google's published x509 certs —
   signature (RS256), exp/iat, aud (project id), iss, sub. No new dependencies.
   This lets the VPS accept requests straight from the web widget, replacing the
   Firebase Function proxy (which would have required the Blaze plan). */
import { createVerify, X509Certificate } from "node:crypto";

const CERT_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

let certCache = { keys: null, expiresAt: 0 };

async function googleCerts() {
  if (certCache.keys && Date.now() < certCache.expiresAt) return certCache.keys;
  const r = await fetch(CERT_URL);
  if (!r.ok) throw new Error(`cert fetch failed: ${r.status}`);
  const maxAge = +(/max-age=(\d+)/.exec(r.headers.get("cache-control") || "")?.[1] || 3600);
  certCache = { keys: await r.json(), expiresAt: Date.now() + maxAge * 1000 };
  return certCache.keys;
}

const b64url = (s) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

/** Returns the decoded payload if valid; throws otherwise. */
export async function verifyFirebaseIdToken(idToken, projectId) {
  const parts = String(idToken).split(".");
  if (parts.length !== 3) throw new Error("malformed token");
  const header = JSON.parse(b64url(parts[0]).toString("utf8"));
  const payload = JSON.parse(b64url(parts[1]).toString("utf8"));
  if (header.alg !== "RS256" || !header.kid) throw new Error("bad header");

  const certs = await googleCerts();
  const pem = certs[header.kid];
  if (!pem) throw new Error("unknown kid");

  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${parts[0]}.${parts[1]}`);
  if (!verifier.verify(new X509Certificate(pem).publicKey, b64url(parts[2])))
    throw new Error("bad signature");

  const now = Math.floor(Date.now() / 1000);
  if (!(payload.exp > now)) throw new Error("expired");
  if (!(payload.iat <= now + 300)) throw new Error("iat in future");
  if (payload.aud !== projectId) throw new Error("wrong aud");
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error("wrong iss");
  if (!payload.sub) throw new Error("no sub");
  return payload;
}
