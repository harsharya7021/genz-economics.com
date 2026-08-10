/* Session 18 — Japan's debt puzzle machines. Five tinkerable widgets, wired by
   id; each guards on presence so the file is inert elsewhere. Numbers mirror
   the Aug 9 session and Chien–Du–Lustig, "Japan's Debt Puzzle" (JEP 39(4),
   2025): the consolidated balance-sheet table (1997/2012/2024), the ~4.7%/yr
   excess return 2013–23, and the 117 → 77 net-liability path. */
(function () {
  "use strict";
  var r1 = function (n) { return (Math.round(n * 10) / 10).toFixed(1); };
  var r0 = function (n) { return Math.round(n).toString(); };
  var yen = function (n) { return "¥" + Math.round(n).toLocaleString("en-IN"); };

  /* ── M1: the consolidated balance sheet ── */
  (function () {
    var root = document.getElementById("s18-balance"); if (!root) return;
    var D = {
      label: ["1997", "2012", "2024"],
      fx:  [7.5, 29, 60],    // foreign securities, % of GDP
      eq:  [10.7, 15, 40],   // domestic equities (2012 est.)
      pm:  [10, 13, 90],     // currency + bank reserves
      mkt: [149, 235, 180],  // bonds, bills, loans, deposits at market rates
      net: [24, 117, 77],
      note: [
        "A normal country, financially speaking. Risky assets — foreign securities plus domestic equities — total ~18% of GDP. Funding is loans, deposits and ~40% of GDP in bonds, all at rates a lender could refuse. Printed money is a thin ~10%. Net liability: a boring 24% of GDP. This is the year the debt trouble starts — watch what Japan chooses instead of austerity.",
        "Abenomics. The bond mountain has peaked (~235% of GDP borrowed at market rates — where India and the US still live), and net liability has ballooned to ~117%. This is the year Japan discovers the financial engineering: run deficits, print, invest abroad. The GPIF doubles its equity target; the Bank of Japan starts buying stock ETFs. The casino opens.",
        "The paper's snapshot. Risky assets ~100% of GDP (foreign securities 60 + domestic equities 40 — about $2.2–2.4 trillion at today's shrunken GDP). And look at the funding: printed reserves went ~13 → ~90% of GDP, while market-rate borrowing <em>shrank</em> — the BoJ swallowed the bonds and reissued them as reserves priced at 0% by decree. Net liability: 77% — <strong>lower than 2012, despite a deficit every single year</strong>. The gamble paid; the books balanced themselves. (Paper's counterfactual without the gains: net debt >180%.)"
      ]
    };
    var SCALE = 240; // longest bar (2012 market borrowing) ≈ full width
    var y = 0;
    var bars = {
      fx:  [root.querySelector("[data-bar-fx]"),  root.querySelector("[data-fx-l]")],
      eq:  [root.querySelector("[data-bar-eq]"),  root.querySelector("[data-eq-l]")],
      pm:  [root.querySelector("[data-bar-pm]"),  root.querySelector("[data-pm-l]")],
      mkt: [root.querySelector("[data-bar-mkt]"), root.querySelector("[data-mkt-l]")]
    };
    var net = root.querySelector("[data-net]"), note = root.querySelector("[data-note]");
    var yBtns = root.querySelectorAll("[data-y]");
    function draw() {
      ["fx", "eq", "pm", "mkt"].forEach(function (k) {
        var v = D[k][y];
        bars[k][0].style.width = Math.min(100, v / SCALE * 100) + "%";
        bars[k][1].textContent = r1(v) + "%";
      });
      net.textContent = "Net liability  ≈ " + r0(D.net[y]) + "% of GDP";
      note.innerHTML = D.note[y] + " <em>(All figures % of GDP, as read in class from the paper's table; asset rows shown are the risky ones — the legacy loans-and-deposits book, roughly flat throughout, is omitted for clarity.)</em>";
    }
    yBtns.forEach(function (b) { b.addEventListener("click", function () {
      y = +b.getAttribute("data-y");
      yBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      draw();
    }); });
    draw();
  })();

  /* ── M2: ¥10,000 does the round trip ── */
  (function () {
    var root = document.getElementById("s18-carry"); if (!root) return;
    var jp = root.querySelector("[data-jp]"), us = root.querySelector("[data-us]"),
        fxm = root.querySelector("[data-fxm]"), fxRow = root.querySelector("[data-fx-row]");
    var pl = root.querySelector("[data-pl]"), note = root.querySelector("[data-note]");
    var uBtns = root.querySelectorAll("[data-u]"); var u = "uip";
    function draw() {
      var j = +jp.value, s = +us.value;
      root.querySelector("[data-jp-l]").textContent = j.toFixed(1) + "%";
      root.querySelector("[data-us-l]").textContent = s.toFixed(2) + "%";
      var move = (u === "uip") ? -(s - j) : +fxm.value; // yen % vs dollar; negative = yen appreciates
      root.querySelector("[data-fxm-l]").textContent = (move >= 0 ? "+" : "") + move.toFixed(1) + "%/yr " + (move >= 0 ? "(yen weaker)" : "(yen stronger)");
      fxRow.style.display = (u === "uip") ? "none" : "";
      // Borrow ¥10,000 → $ at 100¥/$ → invest at s → convert back after yen moves.
      var owed = 10000 * (1 + j / 100);
      var back = 10000 * (1 + s / 100) * (1 + move / 100);
      var p = back - owed;
      pl.textContent = (p >= 0 ? "Profit  +" : "Loss  −") + yen(Math.abs(p)) + " per ¥10,000 borrowed, per year";
      if (u === "uip") {
        note.innerHTML = "Theory's verdict. Uncovered interest parity says the interest gap mostly reflects the inflation gap, so the yen should <strong>appreciate ~" + r1(s - j) + "% a year</strong> and eat your spread almost exactly — profit ≈ zero, no free lunch. (The nuance parked for next class: <em>inflation-driven</em> rate gaps depreciate the high-rate currency; a high <em>real</em> rate does the opposite.) Now flip to the world that actually happened.";
      } else if (move >= 0) {
        note.innerHTML = "The 2013–2023 world: the yen refused the script — flat or weaker — so you collect the rate spread <em>and</em> a currency gain. Traders called it risk-free. It never was: this is exactly the trade that unwound with a 12% single-day Nikkei crash in August 2024. And the biggest position was not a hedge fund's — the Japanese state ran ~<strong>$2 trillion</strong> of this (about 60% of its GDP), which is a hundred times the private carry the TV blames.";
      } else {
        note.innerHTML = "<strong>The trapdoor.</strong> The yen strengthens and every teaspoon of spread you collected is eaten at once — this slider position is August 2024, and it is what Tokyo (and now Washington) is desperate to avoid triggering at sovereign scale. Carry earns by the teaspoon and exits by the stampede.";
      }
    }
    [jp, us, fxm].forEach(function (el) { el.addEventListener("input", draw); });
    uBtns.forEach(function (b) { b.addEventListener("click", function () {
      u = b.getAttribute("data-u");
      uBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      draw();
    }); });
    draw();
  })();

  /* ── M3: Abenomics in two universes ── */
  (function () {
    var root = document.getElementById("s18-mm"); if (!root) return;
    var alloc = root.querySelector("[data-alloc]"), ret = root.querySelector("[data-ret]");
    var out = root.querySelector("[data-out]"), note = root.querySelector("[data-note]");
    var univBtns = root.querySelectorAll("[data-univ]"); var univ = "real";
    var YEARS = 12, START = 117, DEFICIT = 5, HIST = 77;
    var bars = {
      you:  [root.querySelector("[data-bar-you]"),  root.querySelector("[data-you-l]")],
      base: [root.querySelector("[data-bar-base]"), root.querySelector("[data-base-l]")],
      hist: [root.querySelector("[data-bar-hist]"), root.querySelector("[data-hist-l]")]
    };
    var SCALE = 260;
    function setBar(k, v) {
      bars[k][0].style.width = Math.max(0, Math.min(100, v / SCALE * 100)) + "%";
      bars[k][1].textContent = r0(v) + "%";
    }
    function draw() {
      var a = +alloc.value, r = +ret.value;
      root.querySelector("[data-alloc-l]").textContent = a + "% of GDP";
      root.querySelector("[data-ret-l]").textContent = (r >= 0 ? "+" : "") + r.toFixed(1) + "%/yr";
      var base = START + DEFICIT * YEARS; // 177: deficits, no trade
      var gains = a * r / 100 * YEARS;
      var charge = (univ === "mm") ? gains : 0; // MM: lenders price the risk = expected excess, in full
      var you = START + DEFICIT * YEARS - gains + charge;
      setBar("you", you); setBar("base", base); setBar("hist", HIST);
      out.textContent = "Net debt, 2024:  " + r0(you) + "% of GDP";
      if (univ === "mm") {
        note.innerHTML = "The textbook's verdict, and notice it ignores your sliders: lenders see the risky assets and charge a risk premium equal to the bet's expected excess return, so the trade adds <strong>nothing</strong> in expectation — you end where never-traded Japan ends (" + r0(base) + "%), except carrying all the variance. <em>This machine cannot exist in a Modigliani–Miller world.</em> That it existed for fifteen years is the measurement of the market's failure to price risk — the session's whole point.";
      } else if (r < 0) {
        note.innerHTML = "The state of the world nobody priced. The bet loses " + r1(-r) + "% a year and net debt ends at <strong>" + r0(you) + "%</strong> — worse than never trading (" + r0(base) + "%) — with funding costs now rising on top. Japan simply never drew this card between 2013 and 2023. Winning at Russian roulette does not make the revolver a good business.";
      } else {
        note.innerHTML = "Free funding + a bet that pays " + r1(r) + "%/yr on " + a + "% of GDP = <strong>" + r1(gains) + " points of GDP</strong> of winnings over the decade, swallowing every deficit. At the defaults (~8%/yr all-in — returns plus valuation gains plus a weakening yen flattering foreign assets; the paper's pure excess-return figure is ~4.7%) you land near the <strong>77%</strong> that actually happened, against 177% for never-trading. Now flip the universe and see what finance says this should have looked like.";
      }
    }
    [alloc, ret].forEach(function (el) { el.addEventListener("input", draw); });
    univBtns.forEach(function (b) { b.addEventListener("click", function () {
      univ = b.getAttribute("data-univ");
      univBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      draw();
    }); });
    draw();
  })();

  /* ── M4: the deficit doctor ── */
  (function () {
    var root = document.getElementById("s18-deficit"); if (!root) return;
    var spend = root.querySelector("[data-spend]"), intr = root.querySelector("[data-int]");
    var verdict = root.querySelector("[data-verdict]"), note = root.querySelector("[data-note]");
    var fisBar = root.querySelector("[data-bar-fis]"), fisL = root.querySelector("[data-fis-l]");
    var priBar = root.querySelector("[data-bar-pri]"), priL = root.querySelector("[data-pri-l]");
    function draw() {
      var S = +spend.value, I = +intr.value;
      root.querySelector("[data-spend-l]").textContent = S.toFixed(1);
      root.querySelector("[data-int-l]").textContent = I.toFixed(1);
      var fis = 100 - (S + I); // negative = deficit
      var pri = 100 - S;
      fisBar.style.width = Math.min(100, Math.abs(fis) / 15 * 100) + "%";
      priBar.style.width = Math.min(100, Math.abs(pri) / 15 * 100) + "%";
      fisL.textContent = (fis >= 0 ? "+" : "−") + r1(Math.abs(fis));
      priL.textContent = (pri >= 0 ? "+" : "−") + r1(Math.abs(pri));
      // five-year debt path: start 100, interest 5% on the stock, primary balance repeated
      var debt = 100, t;
      for (t = 0; t < 5; t++) debt = debt * 1.05 - pri;
      if (pri > 0) {
        verdict.textContent = "Primary surplus — the debt is being paid DOWN";
        note.innerHTML = "Even if the headline shows a fiscal deficit (interest can do that on its own), you cover all running costs and put <strong>" + r1(pri) + "</strong> toward old debt every year. Starting from debt of 100 at 5% interest, five years later you owe <strong>" + r1(debt) + "</strong>. Fiscal deficit with primary surplus = deleveraging in disguise.";
      } else if (pri === 0) {
        verdict.textContent = "Balanced primary — the knife edge";
        note.innerHTML = "You cover running costs exactly; debt grows at precisely the interest rate (100 → " + r1(debt) + " in five years). Sustainability now hinges entirely on whether the economy grows faster than " + "5% — the r-versus-g race, coming next class.";
      } else {
        verdict.textContent = "Primary deficit — borrowing to pay interest";
        note.innerHTML = "You cannot cover running costs <em>before</em> interest, so every rupee of interest is met with fresh borrowing: debt compounds on itself, 100 → <strong>" + r1(debt) + "</strong> in five years and accelerating. This was Japan, <strong>every single year</strong> of the story — hidden under ~6% of GDP of carry winnings. When the winnings stop, this arithmetic is what remains.";
      }
    }
    [spend, intr].forEach(function (el) { el.addEventListener("input", draw); });
    draw();
  })();

  /* ── M5: the duration seesaw ── */
  (function () {
    var root = document.getElementById("s18-duration"); if (!root) return;
    var mat = root.querySelector("[data-mat]"), cpn = root.querySelector("[data-cpn]"), shk = root.querySelector("[data-shk]");
    var durs = root.querySelector("[data-durs]"), note = root.querySelector("[data-note]");
    var zaBar = root.querySelector("[data-bar-za]"), zaL = root.querySelector("[data-za-l]");
    var zbBar = root.querySelector("[data-bar-zb]"), zbL = root.querySelector("[data-zb-l]");
    var Y = 0.03;
    function bond(coupon, T, y) {
      var pv = 0, ws = 0, t, cf, p;
      for (t = 1; t <= T; t++) {
        cf = (t === T ? coupon + 100 : coupon);
        p = cf / Math.pow(1 + y, t);
        pv += p; ws += t * p;
      }
      return { price: pv, dur: ws / pv };
    }
    function draw() {
      var T = +mat.value, c = +cpn.value, d = +shk.value / 100;
      root.querySelector("[data-mat-l]").textContent = T + " yrs";
      root.querySelector("[data-cpn-l]").textContent = c + "%";
      root.querySelector("[data-shk-l]").textContent = (d >= 0 ? "+" : "") + (d * 100).toFixed(1) + " pp";
      var A = bond(0, T, Y), B = bond(c, T, Y);
      var A2 = bond(0, T, Y + d), B2 = bond(c, T, Y + d);
      var dA = (A2.price / A.price - 1) * 100, dB = (B2.price / B.price - 1) * 100;
      durs.textContent = "Duration — zero: " + A.dur.toFixed(1) + " yrs · coupon: " + B.dur.toFixed(1) + " yrs";
      zaBar.style.width = Math.min(100, Math.abs(dA) * 2.2) + "%";
      zbBar.style.width = Math.min(100, Math.abs(dB) * 2.2) + "%";
      zaL.textContent = (dA >= 0 ? "+" : "−") + r1(Math.abs(dA)) + "%";
      zbL.textContent = (dB >= 0 ? "+" : "−") + r1(Math.abs(dB)) + "%";
      var same = " Same " + T + "-year tenure, different duration, different pain — <strong>duration, not tenure, is the sensitivity</strong>.";
      if (c === 0) {
        note.innerHTML = "With no coupon, Bond B <em>is</em> Bond A — everything arrives at year " + T + ", so duration equals tenure for both. Give B a coupon and watch its duration slide earlier while A's stays put." + same;
      } else if (Math.abs(d) < 0.001) {
        note.innerHTML = "B's cash arrives earlier on average (duration " + B.dur.toFixed(1) + " vs " + A.dur.toFixed(1) + " years), so it should hurt less when rates move. Shock the rate and check.";
      } else {
        note.innerHTML = "The " + (d > 0 ? "hike" : "cut") + " moves the zero-coupon bond by <strong>" + r1(Math.abs(dA)) + "%</strong> but the coupon bond by only <strong>" + r1(Math.abs(dB)) + "%</strong> — the earlier your money arrives, the less a rate change matters." + same + " Now scale it to the session: Japan's <em>liabilities</em> are overnight reserves (duration ≈ 0 — they reprice the day the BoJ hikes, and it has, to 1%) while its <em>assets</em> run to decades (the paper puts equities near 75 years). The consolidated state is one giant duration mismatch. Next class prices it.";
      }
    }
    [mat, cpn, shk].forEach(function (el) { el.addEventListener("input", draw); });
    draw();
  })();
})();
