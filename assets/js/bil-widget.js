/* Ask-BIL chat — gated behind the same Firebase Google sign-in as the essays. */
(function () {
  "use strict";
  var gate = document.getElementById("bilGate"), chat = document.getElementById("bilChat");
  if (!gate || !chat || !window.GZE_FIREBASE) return;
  var FN_URL = chat.getAttribute("data-fn-url");
  var log = document.getElementById("bilLog"), form = document.getElementById("bilForm"), input = document.getElementById("bilInput");
  var authMod = null, currentUser = null;

  var base = "https://www.gstatic.com/firebasejs/10.12.2/";
  Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js")]).then(function (m) {
    var app = m[0].initializeApp(window.GZE_FIREBASE, "bil");
    var auth = m[1].getAuth(app); authMod = m[1];
    m[1].onAuthStateChanged(auth, function (user) {
      currentUser = user;
      gate.hidden = !!user; chat.hidden = !user;
      if (user && !log.childElementCount) add("bil", "You found the chat. Fine. Ask — but ask something the course covers; I read the notes so you clearly didn't have to.");
    });
    var btn = gate.querySelector("[data-gate-signin]");
    if (btn) btn.addEventListener("click", function () { m[1].signInWithPopup(auth, new m[1].GoogleAuthProvider()).catch(function (err) { console.error("[gze] sign-in failed:", err && err.code, err); }); });
  }).catch(function (err) { console.error("[gze] auth module failed to load:", err); });

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
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim(); if (!q || !currentUser) return;
    input.value = ""; add("me", q);
    var thinking = add("bil", "…");
    currentUser.getIdToken().then(function (tok) {
      return fetch(FN_URL, { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + tok }, body: JSON.stringify({ question: q }) });
    }).then(function (r) { return r.json(); }).then(function (j) {
      thinking.remove(); add("bil", j.answer || j.error || "…he walked off mid-sentence. Try again.", j.sources);
    }).catch(function () { thinking.remove(); add("bil", "Network dropped. Even at IIM-A the wifi was better."); });
  });
})();
