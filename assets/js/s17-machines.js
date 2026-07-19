/* Session 17 — Cheap money machines. Four tinkerable widgets, wired by id;
   each guards on presence so the file is inert elsewhere. Numbers mirror the
   Jul 19 session (swap-window carry, zero real rate, spread squeeze) and the
   published 1pp estimates in Jiménez–Ongena–Peydró–Saurina (Econometrica 2014). */
(function () {
  "use strict";
  var r1 = function (n) { return (Math.round(n * 10) / 10).toFixed(1); };
  var r2 = function (n) { return (Math.round(n * 100) / 100).toFixed(2); };

  /* ── M1: the subsidised carry machine ── */
  (function () {
    var root = document.getElementById("s17-carry"); if (!root) return;
    var lev = root.querySelector("[data-lev]"), inr = root.querySelector("[data-inr]"),
        usd = root.querySelector("[data-usd]"), dep = root.querySelector("[data-dep]");
    var roe = root.querySelector("[data-roe]"), note = root.querySelector("[data-note]");
    var gBtns = root.querySelectorAll("[data-g]"); var g = "on";
    var STOCK = 55; // $bn of guaranteed inflows this round (class range: 50–60)
    function draw() {
      var L = +lev.value, i = +inr.value, u = +usd.value, d = +dep.value;
      root.querySelector("[data-lev-l]").textContent = "×" + L;
      root.querySelector("[data-inr-l]").textContent = i.toFixed(2) + "%";
      root.querySelector("[data-usd-l]").textContent = u.toFixed(2) + "%";
      root.querySelector("[data-dep-l]").textContent = "−" + d.toFixed(1) + "%/yr";
      var dEff = (g === "on") ? Math.min(d, 1.5) : d;
      var spread = i - u - dEff;
      var onEquity = L * spread;
      roe.textContent = (onEquity >= 0 ? "+" : "") + r1(onEquity) + "% a year on your own money";
      if (g === "on") {
        var excess = Math.max(0, d - 1.5);
        if (excess > 0) {
          var bill = STOCK * excess / 100;
          note.innerHTML = "You keep a spread of <strong>" + r2(spread) + "%</strong> — levered ×" + L + " — no matter what the rupee does, because your depreciation is capped at 1.5%. The other " + r1(excess) + "% a year doesn't vanish; it moves to the RBI's book. On a guaranteed stock of ~$" + STOCK + "bn, that's roughly <strong>$" + r1(bill) + "bn a year</strong> of someone else's problem. <em>\"If a bureaucrat is giving you this facility, take it\"</em> — the class's point is about the bureaucrat, not about you.";
        } else {
          note.innerHTML = "Depreciation stayed inside the 1.5% cap, so the guarantee expires unexercised and the RBI pays nothing — the <strong>2013 outcome</strong>. Careful with the lesson you draw: one put ending out of the money is not evidence that puts are free. <em>\"Like an insurance company saying nobody died last month, so nobody will die this month also.\"</em>";
        }
      } else {
        if (spread >= 0)
          note.innerHTML = "No guarantee, and the trade still pays — for now. You are carrying the currency risk yourself, and it doesn't arrive at " + r1(d) + "% a year on a polite schedule; it arrives all at once, when everyone runs for the same exit. See the editor's note on August 2024 for how that ends.";
        else
          note.innerHTML = "<strong>Negative.</strong> This is why carry is normally scary — one bad depreciation year eats every teaspoon of spread you collected, times your leverage. The honest market prices this in; the swap window deletes it from <em>your</em> screen and rewrites it on the RBI's.";
      }
    }
    [lev, inr, usd, dep].forEach(function (el) { el.addEventListener("input", draw); });
    gBtns.forEach(function (b) { b.addEventListener("click", function () {
      g = b.getAttribute("data-g");
      gBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      draw();
    }); });
    draw();
  })();

  /* ── M2: today's dashboard — the real rate, two lenses ── */
  (function () {
    var root = document.getElementById("s17-realrate"); if (!root) return;
    var nom = root.querySelector("[data-nom]"), exp = root.querySelector("[data-exp]");
    var expRow = root.querySelector("[data-exp-row]");
    var out = root.querySelector("[data-real]"), note = root.querySelector("[data-note]");
    var lensBtns = root.querySelectorAll("[data-lens]"); var lens = "pipe";
    function draw() {
      var n = +nom.value;
      root.querySelector("[data-nom-l]").textContent = n.toFixed(2) + "%";
      var e = (lens === "back") ? 4.38 : +exp.value;
      root.querySelector("[data-exp-l]").textContent = (+exp.value).toFixed(2) + "%";
      expRow.style.display = (lens === "back") ? "none" : "";
      var r = n - e;
      out.textContent = "Real rate  " + (r >= 0 ? "+" : "") + r2(r) + "%";
      if (lens === "back") {
        note.innerHTML = "This is the official arithmetic: " + n.toFixed(2) + "% minus <strong>last year's</strong> 4.38% print. But the rate you charge is for the <em>next</em> twelve months and the inflation you subtracted is from the <em>last</em> twelve — the exact definitional slip Session 14 was built on. Switch lenses.";
      } else if (r < 0) {
        note.innerHTML = "<strong>Negative real rate — borrowers are being paid.</strong> With WPI already at 9% and retail climbing, this is not a hypothetical corner of the slider. At this rate, 15–16% credit growth isn't strength; it's gravity.";
      } else if (r < 1) {
        note.innerHTML = "<strong>The free-money zone — where India is now.</strong> <em>\"You borrow, you put in something, prices rise by 5% — you don't need to value-add for non-default. Why will you not borrow?\"</em> Credit growth of 15–16% follows mechanically. It tells you the price of money, not the strength of the economy.";
      } else if (r < 2) {
        note.innerHTML = "Mildly positive — the unremarkable range. Credit growth at this real rate would actually mean something about demand and confidence, rather than about the RBI's arithmetic.";
      } else {
        note.innerHTML = "Genuinely tight. Borrowing must clear a real hurdle; only value-adding projects survive. Whatever credit grows here is information.";
      }
    }
    [nom, exp].forEach(function (el) { el.addEventListener("input", draw); });
    lensBtns.forEach(function (b) { b.addEventListener("click", function () {
      lens = b.getAttribute("data-lens");
      lensBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      draw();
    }); });
    draw();
  })();

  /* ── M3: the spread squeeze, and the bank's two escapes ── */
  (function () {
    var root = document.getElementById("s17-spread"); if (!root) return;
    var rate = root.querySelector("[data-rate]");
    var out = root.querySelector("[data-out]"), note = root.querySelector("[data-note]");
    var respBtns = root.querySelectorAll("[data-resp]"); var resp = "none";
    var bEarn = root.querySelector("[data-bar-earn]"), bObs = root.querySelector("[data-bar-obs]"), bHid = root.querySelector("[data-bar-hid]");
    var lEarn = root.querySelector("[data-earn-l]"), lObs = root.querySelector("[data-obs-l]"), lHid = root.querySelector("[data-hid-l]");
    var BASE = 20; // baseline risk any bank carries
    function spreadAt(p) { return Math.min(3, 1 + p / 3); } // 6% → 3.0 · 3% → 2.0 · 1% → 1.33
    function setBar(el, lab, v, suffix) { el.style.width = Math.min(100, v) + "%"; lab.textContent = suffix; }
    function draw() {
      var p = +rate.value, s = spreadAt(p);
      root.querySelector("[data-rate-l]").textContent = p.toFixed(2) + "%";
      var squeezed = s < 2.99;
      out.textContent = "Spread the market lets you charge:  " + r2(s) + "%";
      var earn, obs = BASE, hid = BASE, msg;
      if (!squeezed) {
        earn = 100;
        msg = "At this policy rate the spread is a full 3% — the bank earns its keep without doing anything clever. <em>\"If banks can keep the spread as it is, they don't care about your repo rate.\"</em> Now cut the rate and watch what the market does to the spread — then pick an escape.";
        resp = "none";
        respBtns.forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-resp") === "none" ? "true" : "false"); });
      } else if (resp === "none") {
        earn = s / 3 * 100;
        msg = "Rates fell, and the spread fell with them — from 3% to " + r2(s) + "% — because nobody wants the riskless asset anymore and everyone is competing to make the risky loan. Your earnings are off " + Math.round(100 - earn) + "%. Shareholders are not amused. You have two escapes, and only two.";
      } else if (resp === "lever") {
        earn = 100;
        var mult = 3 / s;
        obs = Math.min(100, BASE + (mult - 1) * 90);
        msg = "Escape one: same spread, <strong>×" + r2(mult) + " the leverage</strong> — earnings restored, capital cushion thinned. Note which bar moved: this risk is <em>visible</em>. Capital adequacy is printed on every disclosure; the regulator can see it and act. Uncomfortable, but honest.";
      } else {
        earn = 100;
        hid = Math.min(100, BASE + (3 - s) * 42);
        msg = "Escape two: rebuild the spread by lending to borrowers who still pay 3%+ — <strong>riskier borrowers</strong>. Earnings restored, book unchanged on paper: same ratings, same ratios. Only the bank knows. <em>\"You will find nothing wrong — all AAA-rated and all of that.\"</em> This is the escape the paper catches banks taking — and the bar that grew is the one no inspector can read.";
      }
      setBar(bEarn, lEarn, earn, Math.round(earn) + "");
      setBar(bObs, lObs, obs, obs > BASE ? "↑" : "–");
      setBar(bHid, lHid, hid, hid > BASE ? "↑↑" : "–");
      note.innerHTML = msg;
    }
    rate.addEventListener("input", draw);
    respBtns.forEach(function (b) { b.addEventListener("click", function () {
      resp = b.getAttribute("data-resp");
      respBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      draw();
    }); });
    draw();
  })();

  /* ── M4: the paper's finding, scaled to your rate cut ── */
  (function () {
    var root = document.getElementById("s17-paper"); if (!root) return;
    var cut = root.querySelector("[data-cut]");
    var note = root.querySelector("[data-note]");
    var bankBtns = root.querySelectorAll("[data-bank]"); var bank = "low";
    var bars = {
      grant: [root.querySelector("[data-bar-grant]"), root.querySelector("[data-grant-l]")],
      amt:   [root.querySelector("[data-bar-amt]"),   root.querySelector("[data-amt-l]")],
      coll:  [root.querySelector("[data-bar-coll]"),  root.querySelector("[data-coll-l]")],
      def:   [root.querySelector("[data-bar-def]"),   root.querySelector("[data-def-l]")]
    };
    var MAX = 40; // widest bar: 18%/pp × 2pp, with headroom
    function setBar(key, v, shown) {
      bars[key][0].style.width = (v === null ? 0 : Math.min(100, v / MAX * 100)) + "%";
      bars[key][1].textContent = shown;
    }
    function draw() {
      var c = +cut.value;
      root.querySelector("[data-cut-l]").textContent = "−" + c.toFixed(2) + " pp";
      if (bank === "low") {
        setBar("grant", 8 * c,  "+" + r1(8 * c) + "%");
        setBar("amt",  18 * c,  "+" + r1(18 * c) + "%");
        setBar("coll",  7 * c,  "+" + r1(7 * c) + "%");
        setBar("def",   5 * c,  "+" + r1(5 * c) + "%");
        note.innerHTML = c === 0
          ? "No cut, no effect — slide the rate cut and watch which margins move, and in which direction."
          : "For a " + c.toFixed(2) + "pp rate cut, the thinly capitalised bank (1σ less capital than its peers), lending to a firm with a bad credit history: grants <strong>" + r1(8 * c) + "%</strong> more applications, commits <strong>" + r1(18 * c) + "%</strong> more credit, leaves <strong>" + r1(7 * c) + "%</strong> more of it uncollateralised — and those loans default <strong>" + r1(5 * c) + "%</strong> more, later. Every margin tilts the same way: toward risk, at the banks with the least skin in the game. <em>(Bars scale the paper's published 1-percentage-point estimates linearly — to feel magnitudes, not to claim linearity. 241,052 applications, Spain, 2002–08.)</em>";
      } else {
        setBar("grant", null, "–");
        setBar("amt",  19 * c, "+" + r1(19 * c) + "%");
        setBar("coll", null, "–");
        setBar("def",  null, "–");
        note.innerHTML = "For the <strong>average</strong> bank, a " + c.toFixed(2) + "pp cut raises total credit granted to risky firms by about <strong>" + r1(19 * c) + "%</strong> — lower rates tilt virtually <em>all</em> banks toward risk. The collateral and default margins are identified off the low-versus-high capital comparison, so they're shown on the other toggle.";
      }
    }
    cut.addEventListener("input", draw);
    bankBtns.forEach(function (b) { b.addEventListener("click", function () {
      bank = b.getAttribute("data-bank");
      bankBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      draw();
    }); });
    draw();
  })();
})();
