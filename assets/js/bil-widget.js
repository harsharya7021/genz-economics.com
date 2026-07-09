/* Ask-BIL chat — gated behind the same Firebase Google sign-in as the essays. */
(function () {
  "use strict";
  var gate = document.getElementById("bilGate"), chat = document.getElementById("bilChat");
  if (!gate || !chat || !window.GZE_onFirebaseReady) return;
  var FN_URL = chat.getAttribute("data-fn-url");
  var log = document.getElementById("bilLog"), form = document.getElementById("bilForm"), input = document.getElementById("bilInput");
  var authMod = null, currentUser = null;

  window.GZE_onFirebaseReady(function () {
  var base = "https://www.gstatic.com/firebasejs/10.12.2/";
  Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js")]).then(function (m) {
    var app = m[0].initializeApp(window.GZE_FIREBASE, "bil");
    var auth = m[1].getAuth(app); authMod = m[1];
    m[1].getRedirectResult(auth).catch(function (err) { console.error("[gze] redirect result:", err && err.code); });
    m[1].onAuthStateChanged(auth, function (user) {
      if (user && window.GZE_emailAllowed && !window.GZE_emailAllowed(user.email)) { m[1].signOut(auth); return; }
      currentUser = user;
      gate.hidden = !!user; chat.hidden = !user;
      if (user && !log.childElementCount) {
        add("bil", "You found the chat. Fine. Ask — but ask something the course covers; I read the notes so you clearly didn't have to.");
        showMeme();
      }
    });
    var btn = gate.querySelector("[data-gate-signin]");
    if (btn) btn.addEventListener("click", function () {
      var provider = new m[1].GoogleAuthProvider(); provider.setCustomParameters({ hd: "isb.edu", prompt: "select_account" });
      m[1].signInWithPopup(auth, provider).catch(function (err) {
        console.error("[gze] sign-in failed:", err && err.code, err);
        if (err && (err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request")) {
          m[1].signInWithRedirect(auth, provider).catch(function (e2) { console.error("[gze] redirect sign-in failed:", e2 && e2.code); });
        }
      });
    });
  }).catch(function (err) { console.error("[gze] auth module failed to load:", err); });
  }); /* end GZE_onFirebaseReady */

  function add(who, text, sources, srcLine) {
    var d = document.createElement("div");
    d.className = "bil-msg bil-" + who;
    d.textContent = text;
    if (sources && sources.length) {
      var s = document.createElement("div"); s.className = "bil-src";
      s.textContent = srcLine || ("— source: " + sources.join(", "));
      d.appendChild(s);
    }
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    return d;
  }

  /* Triumphant citations — when two or more notes agree with him, the source
     line itself gloats. The answer above stays clean; the receipts do the
     showing off. {s} = the joined source names. */
  var TRIUMPHS = [
    "Sources, plural: {s}. Try to keep up.",
    "That's {s} agreeing with me. Even the notes form a queue.",
    "{s} — cross-referenced before you finished blinking.",
    "Straight from {s}. I read them so this would hurt you less.",
    "Backed by {s}. The syllabus and I are on excellent terms.",
    "Per {s} — yes, I checked all of them. Simultaneously.",
    "{s} concur. As does Ahmedabad, historically.",
    "This answer ships with receipts: {s}.",
    "Confirmed across {s}. Peer review, BIL edition.",
    "{s} — quoted from memory, verified out of politeness.",
    "The notes said it first: {s}. I said it better.",
    "Cross-checked against {s}. Unanimous, obviously.",
    "Filed under {s}. Memorised the week you were deciding your specialisation.",
    "{s} in agreement — a consensus I assembled personally."
  ];
  /* the pre-chat memes — he shows you his phone before you say a word */
  /* only the dedicated memes here — iima/cat live in the daily rotation up
     top, and showing the same photo twice on one page looked like a bug
     (because it was one, 2026-07-10) */
  var MEMES = [
    { img: "meme-grad",       line: "Convocation, 2011. The gown was rented. The institute is permanent." },
    { img: "meme-priorities", line: "Today's priorities. All items evergreen." },
    { img: "meme-wedding",    line: "Even wedding cards understand personal branding. Rajesh gets it." }
  ];
  function showMeme() {
    var m = MEMES[Math.floor(Math.random() * MEMES.length)];
    var d = document.createElement("div");
    d.className = "bil-msg bil-bil bil-meme";
    var im = document.createElement("img");
    im.src = (chat.getAttribute("data-img-base") || "/assets/img/bil/") + m.img + ".webp";
    im.alt = "BIL shows you his phone"; im.loading = "lazy";
    var cap = document.createElement("div"); cap.className = "bil-src"; cap.textContent = m.line;
    d.appendChild(im); d.appendChild(cap);
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }

  function triumphLine(sources) {
    var t = TRIUMPHS[Math.floor(Math.random() * TRIUMPHS.length)];
    return "— " + t.replace("{s}", sources.join(", "));
  }
  /* Thinking beats — one shown (and rotated) while BIL "reasons". The full set
     of 365 lives in bil-beats.js (window.BIL_BEATS); this is a small fallback. */
  var BEATS = (window.BIL_BEATS && window.BIL_BEATS.length) ? window.BIL_BEATS : [
    "BIL is making a face.",
    "BIL is sighing at the question.",
    "BIL is cross-referencing the notes you didn't read.",
    "BIL is deciding how much to simplify this for you.",
    "BIL is judging the question. Silently. Mostly."
  ];
  var lastBeat = -1;
  function nextBeat() {
    var i; do { i = Math.floor(Math.random() * BEATS.length); } while (i === lastBeat && BEATS.length > 1);
    lastBeat = i; return BEATS[i];
  }

  /* the portrait above the chat is his face — swap it with his state */
  function mood(n) { if (window.BIL_setMood) window.BIL_setMood(n); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim(); if (!q || !currentUser) return;
    input.value = ""; add("me", q);
    /* the figure up top does the thinking — poses rotate, beats play in his
       speech bubble. The chat just shows a quiet ellipsis until the answer. */
    var iv = null, thinking;
    if (window.BIL_think) {
      window.BIL_think(nextBeat);
      thinking = add("bil", "…");
      thinking.classList.add("bil-thinking");
    } else {
      mood("thinking");
      thinking = add("bil", nextBeat());
      thinking.classList.add("bil-thinking");
      iv = setInterval(function () { thinking.textContent = nextBeat(); }, 1700);
    }
    function stop() { clearInterval(iv); thinking.remove(); }
    currentUser.getIdToken().then(function (tok) {
      return fetch(FN_URL, { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + tok }, body: JSON.stringify({ question: q }) });
    }).then(function (r) { return r.json(); }).then(function (j) {
      stop();
      var win = !j.error && !j.degraded && j.sources && j.sources.length > 1;
      mood((j.error || j.degraded) ? "sighing" : win ? "triumphant" : (j.sources && j.sources.length) ? "citing" : "refusing");
      add("bil", j.answer || j.error || "…he walked off mid-sentence. Try again.", j.sources, win ? triumphLine(j.sources) : undefined);
    }).catch(function () { stop(); mood("sighing"); add("bil", "Network dropped. Even at IIM-A the wifi was better."); });
  });
})();
