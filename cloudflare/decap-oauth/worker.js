/* Decap CMS ⇄ GitHub OAuth broker (Cloudflare Worker).
 *
 * GitHub Pages can't do the OAuth token exchange (no server), so /admin/
 * hands off to this tiny broker. It implements the exact postMessage
 * handshake Decap expects:
 *   1. Decap opens  <base_url>/auth
 *   2. we bounce to GitHub's consent screen
 *   3. GitHub returns to /callback?code=...
 *   4. we swap the code for a token and postMessage it back to the CMS window
 *
 * Only GitHub accounts with WRITE access to the repo can actually save — that
 * repo permission IS the "editorial rights" control. Give someone editing
 * rights by adding them as a repo collaborator on GitHub; revoke by removing.
 *
 * Secrets (set with wrangler, never commit them):
 *   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 */
const GH_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GH_TOKEN = "https://github.com/login/oauth/access_token";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1 + 2: start the flow → GitHub consent
    if (url.pathname === "/auth") {
      const to = new URL(GH_AUTHORIZE);
      to.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      to.searchParams.set("redirect_uri", `${url.origin}/callback`);
      to.searchParams.set("scope", "repo");
      to.searchParams.set("state", crypto.randomUUID());
      return Response.redirect(to.toString(), 302);
    }

    // 3 + 4: GitHub came back with a code → swap for a token, hand it to Decap
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing ?code", { status: 400 });

      let payload, ok = false;
      try {
        const res = await fetch(GH_TOKEN, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        });
        const data = await res.json();
        if (data.access_token) { ok = true; payload = { token: data.access_token, provider: "github" }; }
        else payload = { error: data.error_description || data.error || "no access_token" };
      } catch (e) {
        payload = { error: String(e) };
      }

      const status = ok ? "success" : "error";
      const message = "authorization:github:" + status + ":" + JSON.stringify(payload);
      const html = `<!doctype html><html><body>
<p>${ok ? "Signed in. You can close this window." : "Sign-in failed."}</p>
<script>
(function () {
  /* Decap's handshake, in the right order: the POPUP announces itself
     ("authorizing:github"), the CMS echoes the same string back, and only
     then does the popup deliver the token. Sending the token unprompted
     lands before the CMS is listening — the bug that left this window
     hanging on 2026-07-10. */
  function receive(e) {
    if (e.data === "authorizing:github") {
      window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      setTimeout(function () { window.close(); }, 150);
    }
  }
  window.addEventListener("message", receive, false);
  if (window.opener) window.opener.postMessage("authorizing:github", "*");
})();
</script></body></html>`;
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    return new Response("Decap OAuth broker is up.", { status: 200 });
  },
};
