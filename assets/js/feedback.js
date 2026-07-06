/* Feedback & bug reports → a Firestore "ticket".
   Any [data-feedback-open] element opens a small modal. On submit we write
   one doc to the `tickets` collection — Harsh reviews them in the Firebase
   console (later: an admin page). Works signed-out (so a visitor can report
   a bug before/without signing in); captures the signed-in email if present.

   Firestore rule Harsh must add (console → Firestore → Rules), so anyone can
   file a ticket but nobody can read them back from the client:

     match /tickets/{id} {
       allow create: if request.resource.data.message is string
                     && request.resource.data.message.size() > 0
                     && request.resource.data.message.size() < 5000;
       allow read, update, delete: if false;
     }
*/
(function () {
  var openers = document.querySelectorAll("[data-feedback-open]");
  if (!openers.length) return;

  var modal = null, fbState = { building: false };

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function build() {
    modal = el("div", "fb-modal", ""
      + '<div class="fb-backdrop" data-fb-close></div>'
      + '<div class="fb-card" role="dialog" aria-modal="true" aria-labelledby="fbTitle">'
      +   '<button type="button" class="fb-x" data-fb-close aria-label="Close">×</button>'
      +   '<h3 id="fbTitle">Feedback &amp; bug reports</h3>'
      +   '<p class="fb-sub">Found a bug, or have an idea to make this better? Tell me — I read every one, and it goes straight onto my list.</p>'
      +   '<form class="fb-form">'
      +     '<div class="fb-types">'
      +       '<label class="fb-type"><input type="radio" name="fbType" value="bug" checked> 🐞 Bug</label>'
      +       '<label class="fb-type"><input type="radio" name="fbType" value="idea"> 💡 Idea</label>'
      +       '<label class="fb-type"><input type="radio" name="fbType" value="feedback"> 💬 Feedback</label>'
      +     '</div>'
      +     '<textarea class="fb-msg" rows="4" required placeholder="What happened, or what would you change?"></textarea>'
      +     '<div class="fb-row">'
      +       '<input class="fb-name" type="text" placeholder="Your name (optional)" autocomplete="name">'
      +       '<input class="fb-email" type="email" placeholder="Email — if you want a reply" autocomplete="email">'
      +     '</div>'
      +     '<div class="fb-hp-wrap" aria-hidden="true"><label>Do not fill this in<input class="fb-hp" type="text" tabindex="-1" autocomplete="off"></label></div>'
      +     '<div class="fb-actions"><button type="button" class="btn btn-ghost" data-fb-close>Cancel</button><button type="submit" class="btn btn-primary fb-send">Send it →</button></div>'
      +     '<p class="fb-status" aria-live="polite"></p>'
      +   '</form>'
      + '</div>');
    document.body.appendChild(modal);
    modal.addEventListener("click", function (e) { if (e.target.closest("[data-fb-close]")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) close(); });
    modal.querySelector(".fb-form").addEventListener("submit", submit);
  }

  function open() { if (!modal) build(); modal.classList.add("open"); document.body.style.overflow = "hidden"; setTimeout(function () { var t = modal.querySelector(".fb-msg"); if (t) t.focus(); }, 40); }
  function close() { if (!modal) return; modal.classList.remove("open"); document.body.style.overflow = ""; }

  var fb = null; // cached firebase modules
  function loadFirebase() {
    if (fb) return Promise.resolve(fb);
    if (!window.GZE_FIREBASE) return Promise.reject(new Error("no-config"));
    var base = "https://www.gstatic.com/firebasejs/10.12.2/";
    return Promise.all([
      import(base + "firebase-app.js"),
      import(base + "firebase-firestore.js"),
      import(base + "firebase-auth.js")
    ]).then(function (m) {
      var app = m[0].initializeApp(window.GZE_FIREBASE, "feedback");
      fb = { fs: m[1], db: m[1].getFirestore(app), auth: m[2].getAuth(app) };
      return fb;
    });
  }

  var COOLDOWN_MS = 45000; // one submission per 45s from this browser

  function submit(e) {
    e.preventDefault();
    var form = modal.querySelector(".fb-form");
    var msg = form.querySelector(".fb-msg").value.trim();
    var status = form.querySelector(".fb-status");
    var sendBtn = form.querySelector(".fb-send");
    if (!msg) return;

    // Guardrail 1 — honeypot: a hidden field no human sees. If it's filled,
    // it's a bot; pretend success and drop the write silently.
    var hp = form.querySelector(".fb-hp");
    if (hp && hp.value) { status.className = "fb-status ok"; status.textContent = "Got it — thank you."; setTimeout(close, 1200); return; }

    // Guardrail 2 — client cooldown: block rapid re-submits from this browser.
    try {
      var last = +localStorage.getItem("gze_fb_last") || 0;
      if (Date.now() - last < COOLDOWN_MS) {
        status.className = "fb-status err";
        status.textContent = "You just sent one — give it a moment before the next.";
        return;
      }
    } catch (_) {}

    sendBtn.disabled = true; status.className = "fb-status"; status.textContent = "Sending…";
    var payload = {
      type: (form.querySelector('input[name="fbType"]:checked') || {}).value || "feedback",
      message: msg.slice(0, 5000),
      name: form.querySelector(".fb-name").value.trim().slice(0, 120),
      email: form.querySelector(".fb-email").value.trim().slice(0, 200),
      page: location.pathname,
      url: location.href,
      ua: navigator.userAgent,
      status: "new"
    };
    loadFirebase().then(function (f) {
      var user = f.auth.currentUser;
      if (user) { payload.uid = user.uid; if (!payload.email) payload.email = user.email || ""; if (!payload.name) payload.name = user.displayName || ""; }
      payload.createdAt = f.fs.serverTimestamp();
      return f.fs.addDoc(f.fs.collection(f.db, "tickets"), payload);
    }).then(function () {
      try { localStorage.setItem("gze_fb_last", Date.now()); } catch (_) {}
      status.className = "fb-status ok"; status.textContent = "Got it — thank you. That's on my list now.";
      form.querySelector(".fb-msg").value = ""; form.querySelector(".fb-name").value = ""; form.querySelector(".fb-email").value = "";
      setTimeout(close, 1400);
    }).catch(function (err) {
      console.error("[gze] feedback failed:", err && (err.code || err.message), err);
      status.className = "fb-status err";
      status.textContent = (err && err.code === "permission-denied")
        ? "Couldn't save — the tickets rule isn't set up yet. (Harsh: add the Firestore rule.)"
        : "Couldn't send just now — please try again, or email harsharya7021@gmail.com.";
      sendBtn.disabled = false;
    });
  }

  openers.forEach(function (o) { o.addEventListener("click", function (e) { e.preventDefault(); open(); }); });
})();
