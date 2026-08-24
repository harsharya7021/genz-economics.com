/* The Wage Watch — anonymous ground-level wage/price-pressure reports.
   Writes ONE document per submission to Firestore collection "wage_watch",
   containing only the answers + a month stamp. Deliberately NO uid, name,
   email, or auth of any kind — anonymity is the point (the site's login gate
   already keeps the room to the cohort).

   Firestore rules needed (Harsh — one paste in the console; until then this
   page degrades to a friendly "not open yet" message):

     match /wage_watch/{doc} {
       allow create: if request.resource.data.keys().hasOnly(
           ['vantage','sector','tier','wages','reservation','threshold','productivity','attrition','vendors','prices','note','month','ts'])
         && request.resource.data.month is string
         && request.resource.data.note is string
         && request.resource.data.note.size() <= 600;
       allow read, update, delete: if false;   // write-only letterbox
     }

   (Optional: allow read for your own admin export, or run it from the
   Firebase console. Count on the page needs `allow list` — off by default.) */
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

    say("Filing…");
    form.querySelector(".ww-submit").disabled = true;
    Promise.all([import(base + "firebase-app.js"), import(base + "firebase-firestore.js")])
      .then(function (m) {
        var appMod = m[0], fs = m[1];
        var app; try { app = appMod.getApp(); } catch (e) { app = appMod.initializeApp(cfg); }
        var db = fs.getFirestore(app);
        return fs.addDoc(fs.collection(db, "wage_watch"), {
          vantage: answers.vantage, sector: answers.sector, tier: answers.tier,
          wages: answers.wages, reservation: answers.reservation, threshold: answers.threshold,
          productivity: answers.productivity, attrition: answers.attrition,
          vendors: answers.vendors, prices: answers.prices,
          note: answers.note, month: month, ts: fs.serverTimestamp()
        });
      })
      .then(function () {
        try { localStorage.setItem("gze-ww-" + month, "1"); } catch (e) {}
        form.hidden = true;
        if (doneEl) doneEl.hidden = false;
      })
      .catch(function (err) {
        form.querySelector(".ww-submit").disabled = false;
        if (err && /permission|insufficient/i.test(String(err))) {
          say("The letterbox isn't open yet — the wage_watch rules are pending a one-line update. Nothing was recorded; please try again after the next deploy.", true);
        } else {
          say("Couldn't file — network or config hiccup. Your answers are still on this page; try once more.", true);
        }
        console.error("[gze] wage-watch:", err && (err.code || err.message));
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
