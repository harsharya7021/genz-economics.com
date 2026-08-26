/* The Wage Watch — anonymous ground-level wage/price-pressure reports.
   Writes ONE document per submission to Firestore collection "wage_watch",
   containing only the answers + a month stamp. Deliberately NO uid, name or
   email in the stored document — anonymity is the point. A signed-in session
   is required to write it, but nothing about who wrote it is kept.

   Rules live in ../firestore.rules (deploy with ./deploy-firestore-rules.command).
   They require a signed-in user to CREATE — the apiKey and project id are public,
   so an open create rule would let the whole internet write here — but the stored
   document carries no identity at all: the rules' hasOnly() allow-list has no uid,
   name or email on it, so an identifying submission is rejected by the database
   itself. Sign-in gates the write; it does not label the answer. */
(function () {
  "use strict";
  /* respect reduced-motion: freeze the hero footage on its poster */
  var v = document.querySelector("[data-ww-video]");
  if (v && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    v.removeAttribute("autoplay"); try { v.pause(); } catch (e) {}
  }
  var form = document.querySelector("[data-ww-form]");
  if (!form) return;
  var statusEl = document.querySelector("[data-ww-status]");
  var doneEl = document.querySelector("[data-ww-done]");
  var countEl = document.querySelector("[data-ww-count]");
  var answers = { vantage: "", sector: "", tier: "", wages: "", reservation: "", threshold: "", productivity: "", attrition: "", vendors: "", prices: "", note: "" };

  /* chip groups */
  form.querySelectorAll(".ww-chips").forEach(function (group) {
    var key = group.getAttribute("data-ww");
    group.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        answers[key] = b.getAttribute("data-v");
        group.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      });
    });
  });
  var sel = form.querySelector('[data-ww="sector"]');
  var note = form.querySelector('[data-ww="note"]');

  function say(msg, isErr) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.toggle("is-err", !!isErr);
  }

  var V = "12.15.0", base = "https://www.gstatic.com/firebasejs/" + V + "/";

  /* ── auth, resolved on load ──────────────────────────────────────────────
     The rules require a signed-in user. The first version called
     signInWithPopup() from inside the submit promise chain — after three
     dynamic imports had been awaited — by which point the browser no longer
     considers it a user gesture and blocks the popup. So: settle auth state
     when the page loads, and put a real button in front of the reader that
     opens the popup on a direct click. Filling a long form only to be told
     about sign-in at the end was the wrong shape anyway. */
  var authBox = document.querySelector("[data-ww-auth]");
  var authCopy = document.querySelector("[data-ww-auth-copy]");
  var signinBtn = document.querySelector("[data-ww-signin]");
  var FB = null, currentUser = null;

  function loadFirebase() {
    if (FB) return FB;
    var cfg = window.GZE_FIREBASE || {};
    if (!cfg.apiKey) return null;
    FB = Promise.all([
      import(base + "firebase-app.js"),
      import(base + "firebase-auth.js"),
      import(base + "firebase-firestore.js")
    ]).then(function (m) {
      var appMod = m[0], authMod = m[1], fs = m[2];
      var app; try { app = appMod.getApp(); } catch (e) { app = appMod.initializeApp(cfg); }
      return { authMod: authMod, fs: fs, auth: authMod.getAuth(app), db: fs.getFirestore(app) };
    });
    return FB;
  }

  function paintAuth() {
    if (!authBox) return;
    authBox.hidden = false;
    if (currentUser) {
      authCopy.textContent = "Signed in — you can file. Your answers are stored without your name, email or account id.";
      authBox.classList.add("is-ok");
      if (signinBtn) signinBtn.hidden = true;
    } else {
      authCopy.textContent = "One step before you file: sign in with your ISB email. It gates the write so the internet can't fill this dataset — it is never stored with your answers.";
      authBox.classList.remove("is-ok");
      if (signinBtn) signinBtn.hidden = false;
    }
  }

  (function initAuth() {
    var p = loadFirebase(); if (!p) return;
    p.then(function (F) {
      F.authMod.onAuthStateChanged(F.auth, function (u) {
        currentUser = (u && (!window.GZE_emailAllowed || window.GZE_emailAllowed(u.email))) ? u : null;
        paintAuth();
      });
    }).catch(function () { /* offline — submit will report it */ });
  })();

  if (signinBtn) signinBtn.addEventListener("click", function () {
    var p = loadFirebase(); if (!p) return;
    signinBtn.disabled = true;
    say("Opening sign-in…");
    p.then(function (F) {
      var prov = new F.authMod.GoogleAuthProvider();
      prov.setCustomParameters({ prompt: "select_account" });
      return F.authMod.signInWithPopup(F.auth, prov).then(function (res) {
        var email = res.user && res.user.email;
        if (window.GZE_emailAllowed && !window.GZE_emailAllowed(email)) {
          F.authMod.signOut(F.auth);
          say("This room is ISB-only — sign in with your @isb.edu address.", true);
        } else { say("Signed in. Fill the form and file your report."); }
      });
    }).catch(function (err) {
      var e = String((err && (err.code || err.message)) || err);
      if (/popup-blocked/i.test(e)) say("Your browser blocked the sign-in window — allow popups for this site and try again.", true);
      else if (/popup-closed|cancelled/i.test(e)) say("Sign-in was closed before it finished.", true);
      else say("Sign-in failed: " + e, true);
    }).then(function () { signinBtn.disabled = false; });
  });

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    answers.sector = sel ? sel.value : "";
    answers.note = note ? note.value.trim().slice(0, 500) : "";
    var required = ["vantage", "tier", "wages", "reservation", "threshold", "productivity", "attrition", "vendors", "prices"];
    var missing = required.filter(function (k) { return !answers[k]; });
    if (!answers.sector) missing.push("sector");
    if (missing.length) {
      say("Answer everything except the note — the aggregate is only useful if the fields are filled. Missing: " + missing.join(", ") + ".", true);
      return;
    }
    /* honour-system throttle: one report per month per browser */
    var month = new Date().toISOString().slice(0, 7);
    try {
      if (localStorage.getItem("gze-ww-" + month)) {
        say("This browser already filed a report for " + month + ". It's a monthly series — come back next month.", true);
        return;
      }
    } catch (e) { /* storage blocked — proceed */ }

    var cfg = window.GZE_FIREBASE || {};
    if (!cfg.apiKey) { say("Submissions aren't wired up in this preview. On the live site this files straight to the database.", true); return; }

    if (!currentUser) {
      say("Sign in just above first — the button by the padlock. Your answers stay on this page meanwhile.", true);
      if (authBox) {
        authBox.hidden = false;
        try { authBox.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
        if (signinBtn && !signinBtn.hidden) { try { signinBtn.focus(); } catch (e) {} }
      }
      return;
    }

    say("Filing…");
    form.querySelector(".ww-submit").disabled = true;
    loadFirebase()
      .then(function (F) {
        /* The uid satisfies the rule; it is never written into the document. */
        return F.fs.addDoc(F.fs.collection(F.db, "wage_watch"), {
          vantage: answers.vantage, sector: answers.sector, tier: answers.tier,
          wages: answers.wages, reservation: answers.reservation, threshold: answers.threshold,
          productivity: answers.productivity, attrition: answers.attrition,
          vendors: answers.vendors, prices: answers.prices,
          note: answers.note, month: month, ts: F.fs.serverTimestamp()
        });
      })
      .then(function () {
        try { localStorage.setItem("gze-ww-" + month, "1"); } catch (e) {}
        form.hidden = true;
        if (doneEl) doneEl.hidden = false;
      })
      .catch(function (err) {
        form.querySelector(".ww-submit").disabled = false;
        var e = String((err && (err.code || err.message)) || err);
        if (/not-isb/.test(e)) {
          say("This room is ISB-only — sign in with your @isb.edu address to file a report.", true);
        } else if (/popup-closed|cancelled-popup|popup-blocked/i.test(e)) {
          say("Sign-in was closed before it finished. Your answers are still here — hit the button again.", true);
        } else if (/permission|insufficient/i.test(e)) {
          /* Signed in and still refused: the ruleset in the project does not
             match this collection. Probe a neighbouring collection to tell the
             two causes apart, and say which one it is rather than guessing. */
          say("The database refused the write. Checking why…", true);
          loadFirebase().then(function (F) {
            return F.fs.getDocs(F.fs.query(F.fs.collection(F.db, "comments"), F.fs.limit(1)))
              .then(function () {
                say("Refused by the rules: you are signed in and the project is reachable, so the wage_watch block is not live. Deploy firestore.rules (deploy-firestore-rules.command), or check the Rules Playground for the failing line. Nothing was recorded.", true);
              })
              .catch(function () {
                say("Refused, and the comments collection is unreachable too — so this is the whole ruleset, not just wage_watch. Check that the deploy went to the genz-economics project. Nothing was recorded.", true);
              });
          }).catch(function () {
            say("The database refused the write and could not be re-probed — check your connection. Nothing was recorded.", true);
          });
        } else {
          say("Couldn't file — network or config hiccup. Your answers are still on this page; try once more.", true);
        }
        console.error("[gze] wage-watch submit failed:", e, err);
        console.info("[gze] diagnostics — signed in:", !!currentUser,
          "| fields sent:", Object.keys(answers).length + 2,
          "| month:", month,
          "| note length:", answers.note.length);
      });
  });

  /* count is optional sugar — rules keep reads closed by default, so hide on failure */
  (function () {
    var cfg = window.GZE_FIREBASE || {};
    if (!countEl || !cfg.apiKey) return;
    Promise.all([import(base + "firebase-app.js"), import(base + "firebase-firestore.js")])
      .then(function (m) {
        var appMod = m[0], fs = m[1];
        var app; try { app = appMod.getApp(); } catch (e) { app = appMod.initializeApp(cfg); }
        if (!fs.getCountFromServer) return;
        return fs.getCountFromServer(fs.collection(fs.getFirestore(app), "wage_watch")).then(function (snap) {
          var n = snap.data().count;
          if (n > 0) countEl.textContent = n + (n === 1 ? " report filed so far." : " reports filed so far.");
        });
      })
      .catch(function () { /* reads closed — fine */ });
  })();
})();
