/* Session 16 — Rupee / REER / flows machines. Three tinkerable widgets,
   wired by id; each guards on presence so the file is inert elsewhere.
   Numbers mirror the Jul 5 session (dosa test, FDI vs FII, borrower risk). */
(function () {
  "use strict";
  var r0 = function (n) { return Math.round(n); };
  var r1 = function (n) { return (Math.round(n * 10) / 10).toFixed(1); };

  /* ── M1: the dosa test — real vs nominal, with the efficiency switch ── */
  (function () {
    var root = document.getElementById("s16-reer"); if (!root) return;
    var nom = root.querySelector("[data-nom]"), infl = root.querySelector("[data-infl]");
    var out = root.querySelector("[data-reer]"), note = root.querySelector("[data-note]");
    var effBtns = root.querySelectorAll("[data-eff]"); var eff = "no";
    function draw() {
      root.querySelector("[data-nom-l]").textContent = "−" + nom.value + "%";
      root.querySelector("[data-infl-l]").textContent = "+" + infl.value + "%";
      var reer = 100 * (1 + (+infl.value) / 100) / (1 + (+nom.value) / 100);
      var gap = Math.abs(100 - reer);
      out.textContent = "REER index  " + r0(reer) + "  (2015-16 = 100)";
      if (reer < 99.5) {
        if (eff === "no")
          note.innerHTML = "Indian goods are about <strong>" + r0(gap) + "% cheaper</strong> to a foreign buyer than in 2015-16 — a real discount. A dosa that used to cost him a dollar's worth now costs less, and nothing about the dosa changed. You haven't become " + r0(gap) + "% less efficient — if anything, more — so this is a genuine edge, and exports (goods <em>and</em> services) pick up. That resort priced at 108 a year and a half ago, now going for " + r0(reer) + ", is the same resort. It's just cheap.";
        else
          note.innerHTML = "<em>If</em> India really became " + r0(gap) + "% less efficient, the cheaper rupee only offsets that — no real advantage, no export gain. But ask yourself honestly: is there any reason to believe we got that much worse at making things? There isn't. So this case is a story people tell, not the world we're in.";
      } else if (reer > 100.5) {
        note.innerHTML = "Indian goods are about <strong>" + r0(gap) + "% dearer</strong> than the base — a real premium, an export <em>headwind</em>. This was the old RBI: obsessed with inflation, holding rates high on a food-price print, pulling in hot money, keeping the real rupee strong. Great for the headline number, quietly expensive for every exporter.";
      } else {
        note.textContent = "Back at the 2015-16 baseline: the nominal fall and the extra inflation exactly cancel, so in real terms nothing has moved.";
      }
    }
    [nom, infl].forEach(function (el) { el.addEventListener("input", draw); });
    effBtns.forEach(function (b) { b.addEventListener("click", function () {
      eff = b.getAttribute("data-eff");
      effBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      draw();
    }); });
    draw();
  })();

  /* ── M2: who responds to a cheap rupee — FDI vs FII ── */
  (function () {
    var root = document.getElementById("s16-flows"); if (!root) return;
    var cheap = root.querySelector("[data-cheap]"), big = root.querySelector("[data-flow]"), note = root.querySelector("[data-note]");
    var whoBtns = root.querySelectorAll("[data-who]"); var who = "fdi";
    function draw() {
      root.querySelector("[data-cheap-l]").textContent = "−" + cheap.value + "%";
      if (who === "fdi") {
        var cost = 100 * (1 - (+cheap.value) / 100);
        big.textContent = "$" + r0(cost) + "m  to build what cost $100m 18 months ago";
        note.innerHTML = "FDI does the arithmetic. A data centre, a plant, a stake in a real Indian asset is now about <strong>" + cheap.value + "% cheaper</strong> to build for a dollar investor than a year and a half ago — so it comes. The proof is in the data: net FDI was ~$6.5bn for the <em>whole</em> of last year; in the last two and a half months alone it's already ~$7bn. Someone ran exactly this thought experiment, and moved.";
      } else {
        big.textContent = "FII response to a cheaper rupee:  ≈ none";
        note.innerHTML = "FII doesn't run this arithmetic. It isn't pricing your data centre; it's chasing the next Elon-type AI bet — momentum, “someone will pay more than me,” a reason you can't put in a spreadsheet. So the rupee being 20% cheaper doesn't pull it back: FII outflow has just continued, cheap rupee or not. That's the split to watch — FDI turned <em>up</em> while FII stayed <em>out</em>.";
      }
    }
    cheap.addEventListener("input", draw);
    whoBtns.forEach(function (b) { b.addEventListener("click", function () {
      who = b.getAttribute("data-who");
      whoBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      cheap.disabled = (who === "fii");
      draw();
    }); });
    draw();
  })();

  /* ── M3: the unhedged borrower's stress test ── */
  (function () {
    var root = document.getElementById("s16-borrower"); if (!root) return;
    var dep = root.querySelector("[data-dep]"), hedge = root.querySelector("[data-hedge]");
    var big = root.querySelector("[data-cost]"), note = root.querySelector("[data-note]");
    function draw() {
      root.querySelector("[data-dep-l]").textContent = "−" + dep.value + "%";
      root.querySelector("[data-hedge-l]").textContent = hedge.value + "% hedged";
      var unhedged = 1 - (+hedge.value) / 100;
      var jump = (+dep.value) * unhedged;              // one-time rise in rupee cost of the FX obligation
      var bps = Math.round(jump / 6 * 100);            // spread over a ~6-yr tenor, in bps
      big.textContent = "+" + r1(jump) + "%  on the rupee cost of the loan  (~" + bps + " bps a year)";
      if (jump < 5)
        note.innerHTML = "A pinch — a few dozen basis points on the effective cost. Any decent margin absorbs it. This is the ordinary case, and it's why the panic is overdone.";
      else if (jump < 12)
        note.innerHTML = "Uncomfortable for the weakest borrowers — but look at the aggregate before you worry: the whole unhedged foreign-currency exposure is only about <strong>$550m</strong>, and most of it is long-term. A 30–50 bps rise in effective cost stings a few names; it does not sink the system.";
      else
        note.innerHTML = "<strong>Now you're in the tail.</strong> An unhedged lender takes a hit big enough to default — and because finance is <em>relationship-specific</em>, its healthy borrowers can't costlessly move to another lender and go down with it, for no fault of their own. That is the negative-spillover channel, the Southeast-Asian-crisis worry. It's real. The data just says we're nowhere near it — which is exactly why the honest thing was to revise the fear down once the numbers were in.";
    }
    [dep, hedge].forEach(function (el) { el.addEventListener("input", draw); });
    draw();
  })();
})();
