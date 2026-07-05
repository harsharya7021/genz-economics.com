/* Comments with Google (Gmail) sign-in via Firebase. Renders into every
   [data-comments][data-thread]. No config → friendly notice (nothing breaks). */
(function () {
  "use strict";
  var boxes = document.querySelectorAll("[data-comments]");
  if (!boxes.length) return;
  var cfg = window.GZE_FIREBASE || {};
  if (!cfg.apiKey) {
    boxes.forEach(function (b) {
      b.innerHTML = '<div class="cmt-shell"><div class="cmt-head"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Discussion</div>' +
        '<p class="cmt-note">Sign-in with Google and threaded comments switch on once Firebase is configured — paste your keys into <code>assets/js/firebase-config.js</code>. Setup steps are in <code>COMMENTS-SETUP.md</code>.</p></div>';
    });
    return;
  }
  var V = "12.15.0", base = "https://www.gstatic.com/firebasejs/" + V + "/";
  Promise.all([
    import(base + "firebase-app.js"),
    import(base + "firebase-auth.js"),
    import(base + "firebase-firestore.js")
  ]).then(function (m) {
    var appMod = m[0], authMod = m[1], fs = m[2];
    var app = appMod.initializeApp(cfg);
    var auth = authMod.getAuth(app); var provider = new authMod.GoogleAuthProvider();
    var db = fs.getFirestore(app);
    boxes.forEach(function (box) { wire(box, auth, authMod, db, fs); });
  }).catch(function (e) {
    boxes.forEach(function (b) { b.innerHTML = '<p class="cmt-note">Comments failed to load. Check the Firebase config and network.</p>'; });
  });

  function esc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function wire(box, auth, authMod, db, fs) {
    var thread = box.getAttribute("data-thread") || "general";
    box.innerHTML =
      '<div class="cmt-shell"><div class="cmt-head"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Discussion</div>' +
      '<div class="cmt-auth"></div><div class="cmt-form"></div><div class="cmt-list"><p class="cmt-note">Loading comments…</p></div></div>';
    var authEl = box.querySelector(".cmt-auth"), formEl = box.querySelector(".cmt-form"), listEl = box.querySelector(".cmt-list");

    authMod.onAuthStateChanged(auth, function (user) {
      if (user && window.GZE_emailAllowed && !window.GZE_emailAllowed(user.email)) { authMod.signOut(auth); user = null; }
      if (user) {
        authEl.innerHTML = '<span class="cmt-who"><img src="' + esc(user.photoURL || "") + '" alt="" class="cmt-av">' + esc(user.displayName || "You") + '</span><button type="button" class="cmt-signout">Sign out</button>';
        formEl.innerHTML = '<textarea class="cmt-input" rows="2" placeholder="Add to the discussion…"></textarea><button type="button" class="cmt-post">Post</button>';
        authEl.querySelector(".cmt-signout").addEventListener("click", function () { authMod.signOut(auth); });
        var ta = formEl.querySelector(".cmt-input");
        formEl.querySelector(".cmt-post").addEventListener("click", function () {
          var text = ta.value.trim(); if (!text) return;
          fs.addDoc(fs.collection(db, "comments"), { thread: thread, uid: user.uid, name: user.displayName || "Anon", photo: user.photoURL || "", text: text, createdAt: fs.serverTimestamp() })
            .then(function () { ta.value = ""; });
        });
      } else {
        authEl.innerHTML = '<button type="button" class="cmt-signin"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1H12v2.9h5.35c-.25 1.5-1.7 4.4-5.35 4.4a5.4 5.4 0 1 1 0-10.8c1.55 0 2.6.66 3.2 1.22l2.18-2.1C16.1 5.3 14.25 4.5 12 4.5a7.5 7.5 0 1 0 0 15c4.33 0 7.2-3.04 7.2-7.33 0-.49-.05-.86-.13-1.07z"/></svg> Sign in with Google</button>';
        formEl.innerHTML = "";
        authEl.querySelector(".cmt-signin").addEventListener("click", function () {
          var p = new authMod.GoogleAuthProvider(); p.setCustomParameters({ hd: "isb.edu" });
          authMod.signInWithPopup(auth, p).then(function (res) {
            if (window.GZE_emailAllowed && !window.GZE_emailAllowed(res.user && res.user.email)) {
              authMod.signOut(auth); alert("This room is ISB-only — please sign in with your @isb.edu email.");
            }
          }).catch(function (err) { console.error("[gze] sign-in:", err && err.code); });
        });
      }
    });

    var q = fs.query(fs.collection(db, "comments"), fs.where("thread", "==", thread), fs.orderBy("createdAt", "asc"));
    fs.onSnapshot(q, function (snap) {
      if (snap.empty) { listEl.innerHTML = '<p class="cmt-note">No comments yet — be the first.</p>'; return; }
      var html = "";
      snap.forEach(function (d) {
        var c = d.data(); var when = c.createdAt && c.createdAt.toDate ? c.createdAt.toDate().toLocaleDateString() : "";
        html += '<div class="cmt"><img src="' + esc(c.photo) + '" alt="" class="cmt-av"><div><p class="cmt-meta"><strong>' + esc(c.name) + "</strong> " + when + '</p><p class="cmt-text">' + esc(c.text) + "</p></div></div>";
      });
      listEl.innerHTML = html;
    }, function () { listEl.innerHTML = '<p class="cmt-note">Could not load comments (check Firestore rules).</p>'; });
  }
})();
