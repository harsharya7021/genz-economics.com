/* Session 19 — the quiet print machines. Five tinkerable widgets, wired by id;
   each guards on presence so the file is inert elsewhere. Numbers mirror the
   23 Aug 2026 session: WSS 31 Jul 2026 (deposits 238→274 L cr all scheduled
   banks, credit 185→225, cash ~37→42, money ≈316, GDP ~325→~350), the Jun 2025
   CRR cut (4→3%, ₹2.5 L cr), OMOs ₹2 L cr, $10bn 3-yr swap ≈ ₹0.88 L cr. */
(function () {
  "use strict";
  var r1d = function (n) { return (Math.round(n * 10) / 10).toFixed(1); };
  var pct = function (n) { return r1d(n) + "%"; };
  var lcr = function (n) { return "₹" + r1d(n) + " L cr"; };

  /* ── M1: one year on the WSS ── */
  (function () {
    var root = document.getElementById("s19-wss"); if (!root) return;
    var D = {
      dep:  { was: 238, now: 274 }, cr: { was: 185, now: 225 },
      cash: { was: 37,  now: 42 },  gdp: { was: 318.07, now: 346.36 }   /* MoSPI, 2022-23 base */
    };
    var bars = {};
    ["dep", "cr", "cash", "gdp"].forEach(function (k) {
      bars[k] = [root.querySelector("[data-bar-" + k + "]"), root.querySelector("[data-" + k + "-l]")];
    });
    var verdict = root.querySelector("[data-verdict]"), note = root.querySelector("[data-note]");
    var btns = root.querySelectorAll("[data-u]");
    var mode = "rs";
    function draw() {
      ["dep", "cr", "cash", "gdp"].forEach(function (k) {
        var d = D[k];
        if (mode === "rs") {
          bars[k][0].style.width = (d.now / 350 * 100) + "%";
          bars[k][1].textContent = d.was + " → " + d.now;
        } else {
          var a = d.was / D.gdp.was * 100, b = d.now / D.gdp.now * 100;
          bars[k][0].style.width = (k === "gdp" ? 100 : b) + "%";
          bars[k][1].textContent = k === "gdp" ? "the denominator" : pct(a) + " → " + pct(b);
        }
      });
      if (mode === "rs") {
        verdict.textContent = "Money added: ~₹41 lakh crore. GDP added: ~₹25 lakh crore.";
        note.innerHTML = "Everything grows in rupee terms — that tells you nothing. Flip to % of GDP: ratios are where the story lives. (WSS item 2A, row 8; all scheduled banks; class figures, 31 Jul 2026 vs 25 Jul 2025.)";
      } else {
        verdict.textContent = "This proxy: ~86% → ~91%. On RBI M3: ~86% → ~89%.";
        note.innerHTML = "Class aggregate (deposits + cash) over <b>official</b> GDP — MoSPI's 2022-23 base, not the class's rounded ₹350/₹325. On RBI's own M3 over trailing-four-quarter GDP, the cleaner basis, the move is ~86% → ~89%: about three points, not the eight the class arithmetic implied. The direction holds; the size did not survive checking. See the editor's note above.";
      }
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        mode = b.getAttribute("data-u");
        btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        draw();
      });
    });
    draw();
  })();

  /* ── M2: the multiplier machine ── */
  (function () {
    var root = document.getElementById("s19-mult"); if (!root) return;
    var crr = root.querySelector("[data-crr]"), inj = root.querySelector("[data-inj]");
    var crrL = root.querySelector("[data-crr-l]"), injL = root.querySelector("[data-inj-l]");
    var b = {
      r1: [root.querySelector("[data-bar-r1]"), root.querySelector("[data-r1-l]")],
      r5: [root.querySelector("[data-bar-r5]"), root.querySelector("[data-r5-l]")],
      lim: [root.querySelector("[data-bar-lim]"), root.querySelector("[data-lim-l]")]
    };
    var out = root.querySelector("[data-out]"), note = root.querySelector("[data-note]");
    var btns = root.querySelectorAll("[data-m]");
    var mode = "theory";
    function draw() {
      var c = parseFloat(crr.value) / 100, I = parseFloat(inj.value);
      var eff = mode === "theory" ? c : 0.2; /* life: observed ≈5× ⇒ effective leakage 20% */
      var round1 = I * (1 - eff);
      var after5 = I * (1 - Math.pow(1 - eff, 6)) / eff;
      var limit = I / eff;
      crrL.textContent = (c * 100).toFixed(1) + "%";
      injL.textContent = "₹" + I + " of reserve money";
      var scale = limit;
      b.r1[0].style.width = (round1 / scale * 100) + "%"; b.r1[1].textContent = "₹" + Math.round(round1);
      b.r5[0].style.width = (after5 / scale * 100) + "%"; b.r5[1].textContent = "₹" + Math.round(after5);
      b.lim[0].style.width = "100%"; b.lim[1].textContent = "₹" + Math.round(limit);
      var x = (1 / eff);
      out.textContent = "₹" + I + " of reserves → ₹" + Math.round(limit).toLocaleString("en-IN") + " of deposits (" + (Math.round(x * 10) / 10) + "×).";
      note.innerHTML = mode === "theory"
        ? "The ceiling: each rupee of reserves supports 1 ÷ CRR rupees of deposits. The 2025 cut moved it from <b>25× to 33×</b> — the professor's point: a CRR cut doesn't add water, it widens the pipe. Try CRR at 4, then 3."
        : "Life runs at ≈5× (broad money over reserve money): banks hold buffers, cash leaks into pockets, SLR locks a slice away. The ceiling is theory — but policy just raised the ceiling, and the observed multiplier follows it with a lag.";
    }
    [crr, inj].forEach(function (s) { s.addEventListener("input", draw); });
    btns.forEach(function (bb) {
      bb.addEventListener("click", function () {
        mode = bb.getAttribute("data-m");
        btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === bb)); });
        draw();
      });
    });
    draw();
  })();

  /* ── M3: the tap and the sponge ── */
  (function () {
    var root = document.getElementById("s19-tap"); if (!root) return;
    var OPS = { crr: 2.5, omo: 2.0, swp: 0.88 };
    var NET = OPS.crr + OPS.omo + OPS.swp; /* 5.38 */
    var ACTUAL = 36;
    var mul = root.querySelector("[data-mul]"), mulL = root.querySelector("[data-mul-l]");
    var bars = {};
    ["crr", "omo", "swp", "net", "imp", "act"].forEach(function (k) {
      bars[k] = [root.querySelector("[data-bar-" + k + "]"), root.querySelector("[data-" + k + "-l]")];
    });
    var verdict = root.querySelector("[data-verdict]");
    function draw() {
      var m = parseFloat(mul.value);
      var implied = NET * m;
      mulL.textContent = m.toFixed(1) + "×";
      var s1 = NET; /* scale for the primary rows */
      bars.crr[0].style.width = (OPS.crr / s1 * 100) + "%"; bars.crr[1].textContent = "+" + lcr(OPS.crr);
      bars.omo[0].style.width = (OPS.omo / s1 * 100) + "%"; bars.omo[1].textContent = "+" + lcr(OPS.omo);
      bars.swp[0].style.width = (OPS.swp / s1 * 100) + "%"; bars.swp[1].textContent = "+" + lcr(OPS.swp);
      bars.net[0].style.width = "100%"; bars.net[1].textContent = "+" + lcr(NET);
      var s2 = Math.max(implied, ACTUAL);
      bars.imp[0].style.width = (implied / s2 * 100) + "%"; bars.imp[1].textContent = lcr(implied);
      bars.act[0].style.width = (ACTUAL / s2 * 100) + "%"; bars.act[1].textContent = lcr(ACTUAL);
      var gap = implied - ACTUAL;
      verdict.textContent = Math.abs(gap) < 2
        ? "Reconciled at ≈" + m.toFixed(1) + "× — the multiplier does the heavy lifting, exactly as Model №2 said."
        : (gap < 0 ? "₹" + r1d(-gap) + " L cr short — push the multiplier up." : "₹" + r1d(gap) + " L cr over — ease the multiplier down.");
    }
    mul.addEventListener("input", draw);
    draw();
  })();

  /* ── M4: money ÷ GDP path ── */
  (function () {
    var root = document.getElementById("s19-path"); if (!root) return;
    var host = root.querySelector("[data-path]"), verdict = root.querySelector("[data-verdict]");
    /* Pre-2025 readings sit on the old 2011-12 GDP series and older money
       vintages; the last two are on the corrected M3 ÷ trailing-GDP basis.
       Shown together for SHAPE only — the levels are not strictly comparable,
       which is the very error the outside review caught on the dial. */
    var P = [
      ["FY19", 79, ""], ["FY20", 84, ""], ["FY21 · COVID", 92, "warn"],
      ["FY23", 83, ""], ["FY24", 84, ""], ["Jul 2025", 85.9, ""], ["Jul 2026", 88.8, "danger"]
    ];
    host.innerHTML = P.map(function (p) {
      var cls = p[2] ? " is-" + p[2] : "";
      return '<div class="w-bar-row"><span class="w-bar-label">' + p[0] + '</span><div class="w-bar"><div class="w-bar-fill' + cls + '" style="width:' + ((p[1] - 60) / 35 * 100) + '%"></div></div><output>' + p[1] + "%</output></div>";
    }).join("");
    verdict.textContent = "A pandemic step-up that never came back down — then about +3 more points.";
  })();

  /* ── M5: the Keynes–Friedman switchboard ── */
  (function () {
    var root = document.getElementById("s19-kf"); if (!root) return;
    var inj = root.querySelector("[data-inj]"), slack = root.querySelector("[data-slack]");
    var injL = root.querySelector("[data-inj-l]"), slackL = root.querySelector("[data-slack-l]");
    var bq = [root.querySelector("[data-bar-q]"), root.querySelector("[data-q-l]")];
    var bp = [root.querySelector("[data-bar-p]"), root.querySelector("[data-p-l]")];
    var verdict = root.querySelector("[data-verdict]"), note = root.querySelector("[data-note]");
    var btns = root.querySelectorAll("[data-h]");
    var h = "short";
    function draw() {
      var I = parseFloat(inj.value), s = parseFloat(slack.value) / 100;
      /* year one: prices take what capacity can't absorb; medium run: expectations
         hand most of it to prices regardless — the class's empirical claim. */
      var ps = h === "short" ? (0.12 + (1 - s) * 0.55) : (0.72 + (1 - s) * 0.24);
      ps = Math.min(ps, 0.97);
      var q = I * (1 - ps), p = I * ps;
      injL.textContent = I.toFixed(1) + "% of GDP (the class puts 2025-26 at ~8)";
      slackL.textContent = Math.round(s * 100) + "% idle";
      bq[0].style.width = ((1 - ps) * 100) + "%"; bq[1].textContent = "+" + r1d(q) + " pts";
      bp[0].style.width = (ps * 100) + "%"; bp[1].textContent = "+" + r1d(p) + " pts";
      if (h === "short") {
        verdict.textContent = s > 0.55
          ? "Year one, lots of slack: Keynes wins — quantity absorbs the money."
          : "Year one, little slack: prices are already taking the larger share.";
        note.innerHTML = "The whole dispute is one question: <b>why hasn't the economy been producing more already?</b> If the answer is demand, money helps. If the answer is skills, land, logistics — \"even if you have demand, I can't produce an iPhone tomorrow morning\" — money meets a wall, and walls don't produce, they reprice.";
      } else {
        verdict.textContent = "The medium run: mostly prices — and durable, because wages and expectations have moved.";
        note.innerHTML = "The professor's lean, offered as a worry and not a verdict: <i>\"the evidence in the medium and long term is that the response is mostly through prices — and once prices start responding, they tend to be durable.\"</i> The deciding data point no agency publishes: wage pressure at the lower end. You are the sensor.";
      }
    }
    [inj, slack].forEach(function (x) { x.addEventListener("input", draw); });
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        h = b.getAttribute("data-h");
        btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        draw();
      });
    });
    draw();
  })();
})();
