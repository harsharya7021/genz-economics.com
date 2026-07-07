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
      if (user && !log.childElementCount) add("bil", "You found the chat. Fine. Ask — but ask something the course covers; I read the notes so you clearly didn't have to.");
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

  function add(who, text, sources) {
    var d = document.createElement("div");
    d.className = "bil-msg bil-" + who;
    d.textContent = text;
    if (sources && sources.length) {
      var s = document.createElement("div"); s.className = "bil-src";
      s.textContent = "— source: " + sources.join(", ");
      d.appendChild(s);
    }
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    return d;
  }
  /* Thinking beats — shown (and rotated) while BIL "reasons". He is, essentially,
     Sheldon: the AAA first-bencher who read the notes and resents that you didn't. */
  var BEATS = [
    "BIL is making a face.",
    "BIL is sighing at the question.",
    "BIL is deciding how much to simplify this for you.",
    "BIL is pulling up the exact page you skipped.",
    "BIL is resisting a comment about IIM-A. Barely.",
    "BIL is quietly correcting your phrasing.",
    "BIL is checking whether you've earned the long answer.",
    "BIL is adjusting his spectacles, pointedly.",
    "BIL is cross-referencing the notes you didn't read.",
    "BIL is locating the relevant footnote.",
    "BIL is warming up a 'well, actually'.",
    "BIL is judging the question. Silently. Mostly.",
    "BIL is pretending this is difficult.",
    "BIL is composing a suitably superior reply.",
    "BIL is wondering why this wasn't obvious to you.",
    "BIL is being magnanimous about your confusion."
  ];
  var lastBeat = -1;
  function nextBeat() {
    var i; do { i = Math.floor(Math.random() * BEATS.length); } while (i === lastBeat && BEATS.length > 1);
    lastBeat = i; return BEATS[i];
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim(); if (!q || !currentUser) return;
    input.value = ""; add("me", q);
    var thinking = add("bil", nextBeat());
    thinking.classList.add("bil-thinking");
    var iv = setInterval(function () { thinking.textContent = nextBeat(); }, 1700);
    function stop() { clearInterval(iv); thinking.remove(); }
    currentUser.getIdToken().then(function (tok) {
      return fetch(FN_URL, { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + tok }, body: JSON.stringify({ question: q }) });
    }).then(function (r) { return r.json(); }).then(function (j) {
      stop(); add("bil", j.answer || j.error || "…he walked off mid-sentence. Try again.", j.sources);
    }).catch(function () { stop(); add("bil", "Network dropped. Even at IIM-A the wifi was better."); });
  });
})();
