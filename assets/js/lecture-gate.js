/* Lecture hard-gate — Phase-2 real enforcement (ARCHITECTURE.md,
   "Phase 2 — hard-gate the honeypot").

   Every [data-lecture-gate] ships with class="lecture-locked" straight from
   the server (see _includes/lecture-player.html) — so even if this script
   never loads, nothing plays. That is the whole point: the OLD behaviour
   embedded a plain https://customer-CODE.cloudflarestream.com/{uid}/iframe
   URL that played for anyone on the internet who had the link or just
   viewed page source, sign-in state or not. As of 2026-07-06 every video
   also has requireSignedURLs switched on at Cloudflare's end, so the raw
   uid alone is now inert — Cloudflare itself refuses to serve it without a
   short-lived, per-viewer signed token minted by the gze-stream-token
   Worker (see cloudflare/stream-signed-urls/worker.js). This script's job
   is: verify the visitor is signed in and allowed (same GZE_emailAllowed
   rule as everywhere else), fetch that token, and only THEN build the real
   iframe.

   It also drives the moving watermark: once unlocked, a small label
   showing the SIGNED-IN VIEWER'S OWN EMAIL drifts around the video every
   few seconds — the same drift mechanic assets/js/player.js already uses
   on the /player/ demo, just with the live viewer's email instead of a
   static site name, and wired to a real Stream iframe instead of a
   native <video>.

   Honest limit (already the pattern elsewhere in this codebase, e.g.
   player.js's own comment, and stated plainly to Harsh): this deters
   casual leaking and leaves a forensic trace (whose email was on screen)
   — it cannot stop a phone camera or OS-level screen recording. No web
   technology can do that, and nothing here claims to. */
(function () {
  "use strict";
  var roots = document.querySelectorAll("[data-lecture-gate]");
  if (!roots.length || !window.GZE_onFirebaseReady) return;

  var TOKEN_REFRESH_SKEW_MS = 5 * 60 * 1000; /* re-fetch 5 min before a token expires */

  window.GZE_onFirebaseReady(function () {
    var base = "https://www.gstatic.com/firebasejs/10.12.2/";
    Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js")]).then(function (m) {
      var app = m[0].initializeApp(window.GZE_FIREBASE, "lecture");
      var auth = m[1].getAuth(app);
      auth.useDeviceLanguage && auth.useDeviceLanguage();
      m[1].getRedirectResult(auth).catch(function (err) { console.error("[gze] redirect result:", err && err.code); });
      Array.prototype.forEach.call(roots, function (root) { wireOne(root, m, auth); });
    }).catch(function (err) { console.error("[gze] auth module failed to load:", err); });
  }); /* end GZE_onFirebaseReady */

  function wireOne(root, m, auth) {
    var uid = root.getAttribute("data-stream-id");
    var workerUrl = root.getAttribute("data-token-worker");
    var customerCode = root.getAttribute("data-customer-code");
    var lock = root.querySelector("[data-lecture-lock]");
    var status = root.querySelector("[data-lecture-status]");
    var btn = root.querySelector("[data-lecture-signin]");
    var wm = root.querySelector("[data-lecture-wm]");
    var stage = root.querySelector("[data-video-stage]");
    if (!uid || !lock || !stage) return;

    var refreshTimer = null;
    var unlocked = false;
    var fetching = false;

    function setStatus(text, isError) {
      if (!status) return;
      status.textContent = text;
      status.classList.toggle("is-error", !!isError);
    }

    function buildIframe(token) {
      var src = customerCode
        ? "https://customer-" + customerCode + ".cloudflarestream.com/" + token + "/iframe?preload=metadata"
        : "https://iframe.videodelivery.net/" + token + "?preload=metadata";
      var old = stage.querySelector(".stream-frame");
      if (old) old.remove();
      var ifr = document.createElement("iframe");
      ifr.className = "stream-frame";
      ifr.loading = "lazy";
      ifr.setAttribute("allow", "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;");
      ifr.setAttribute("allowfullscreen", "");
      ifr.title = root.getAttribute("aria-label") || "Lecture recording";
      ifr.src = src;
      stage.insertBefore(ifr, stage.firstChild);
    }

    function startWatermark(email) {
      if (!wm || !email) return;
      wm.textContent = email;
      wm.hidden = false;
      var drift = function () {
        wm.style.left = (8 + Math.random() * 64) + "%";
        wm.style.top = (10 + Math.random() * 72) + "%";
      };
      drift();
      clearInterval(wm._gzeDrift);
      wm._gzeDrift = setInterval(drift, 4000);
    }

    function lockDown() {
      clearTimeout(refreshTimer);
      unlocked = false;
      root.classList.add("lecture-locked");
      root.classList.remove("lecture-unlocked");
      if (wm) { wm.hidden = true; clearInterval(wm._gzeDrift); }
    }

    function unlock(user) {
      if (fetching) return;
      fetching = true;
      setStatus("Verifying your session…");
      user.getIdToken().then(function (idToken) {
        return fetch(workerUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ idToken: idToken, uid: uid })
        });
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; });
      }).then(function (res) {
        fetching = false;
        if (!res.ok || !res.body || !res.body.token) {
          var code = (res.body && res.body.error) || "unknown error";
          if (code === "isb-only") setStatus("This recording is restricted to enrolled participants.", true);
          else setStatus("Couldn't load the recording (" + code + "). Try refreshing in a moment.", true);
          return;
        }
        buildIframe(res.body.token);
        startWatermark(user.email);
        root.classList.remove("lecture-locked");
        root.classList.add("lecture-unlocked");
        unlocked = true;
        setStatus("");
        clearTimeout(refreshTimer);
        var ttlMs = (res.body.expiresIn || 4 * 3600) * 1000;
        refreshTimer = setTimeout(function () { unlocked = false; unlock(user); }, Math.max(ttlMs - TOKEN_REFRESH_SKEW_MS, 30000));
      }).catch(function (err) {
        fetching = false;
        console.error("[gze] lecture token fetch failed:", err);
        setStatus("Network error loading the recording. Try refreshing.", true);
      });
    }

    m[1].onAuthStateChanged(auth, function (user) {
      if (user && window.GZE_emailAllowed && !window.GZE_emailAllowed(user.email)) { m[1].signOut(auth); return; }
      if (!user) { lockDown(); setStatus("Sign in with your ISB email to watch this recording."); return; }
      if (!workerUrl) { setStatus("Video locking isn't fully configured yet — check back shortly.", true); return; }
      if (!unlocked) unlock(user);
    });

    if (btn) btn.addEventListener("click", function () {
      if (auth.currentUser) return; /* already signed in — onAuthStateChanged above is already unlocking */
      var provider = new m[1].GoogleAuthProvider();
      /* no `hd` here — it filters Google's account picker to the exact
         isb.edu hosted domain, hiding pgp.isb.edu (etc.) alumni accounts.
         The real gate is GZE_emailAllowed below, which allows *.isb.edu.
         (site.js dropped hd in 15b2e85; this file was missed.) */
      provider.setCustomParameters({ prompt: "select_account" });
      setStatus("Opening sign-in…");
      m[1].signInWithPopup(auth, provider).then(function (res) {
        if (window.GZE_emailAllowed && !window.GZE_emailAllowed(res.user && res.user.email)) {
          m[1].signOut(auth);
          setStatus("This room is ISB-only — please sign in with your @isb.edu email.", true);
        }
      }).catch(function (err) {
        var code = err && err.code || "";
        console.error("[gze] sign-in failed:", code, err);
        if (code === "auth/unauthorized-domain") setStatus("Sign-in isn't enabled for this domain yet.", true);
        else if (code === "auth/operation-not-allowed") setStatus("Google sign-in isn't switched on yet.", true);
        else if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
          m[1].signInWithRedirect(auth, provider).catch(function (e2) {
            console.error("[gze] redirect sign-in failed:", e2 && e2.code);
            setStatus("Sign-in failed (" + (e2 && e2.code) + ").", true);
          });
        } else if (code) setStatus("Sign-in failed (" + code + ").", true);
      });
    });
  }
})();
