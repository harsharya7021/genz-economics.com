/* what-is-macro essay machines — from the Sunday-series chapters. */
(function () {
  "use strict";
  var pct = function (n, d) { return n.toLocaleString("en-IN", { maximumFractionDigits: d == null ? 1 : d, minimumFractionDigits: d == null ? 1 : d }) + "%"; };

  /* M1: Keynesian cross — the multiplier */
  (function () {
    var root = document.getElementById("w-cross"); if (!root) return;
    var mpc = root.querySelector("[data-mpc]"), g = root.querySelector("[data-g]"), out = root.querySelector("[data-out]"), note = root.querySelector("[data-note]");
    function draw() {
      var c = +mpc.value / 100, dg = +g.value;
      root.querySelector("[data-mpc-label]").textContent = (c).toFixed(2);
      root.querySelector("[data-g-label]").textContent = "₹" + dg + "k cr";
      var mult = 1 / (1 - c), dy = dg * mult;
      out.textContent = "ΔY = ₹" + Math.round(dy).toLocaleString("en-IN") + "k cr  (multiplier " + mult.toFixed(1) + "×)";
      note.textContent = "The government spends " + dg + "; recipients spend " + (c).toFixed(2) + " of every rupee; those recipients spend again — an infinite chain that SUMS to 1/(1−MPC). The whole Keynesian short run in one slider. The catch the professor drills: this works when there is slack. At full employment the same arithmetic just produces inflation.";
    }
    [mpc, g].forEach(function (el) { el.addEventListener("input", draw); }); draw();
  })();

  /* M2: expectations — the three rounds from the IMS notes */
  (function () {
    var root = document.getElementById("w-expect"); if (!root) return;
    var btns = root.querySelectorAll("[data-mode]"), note = root.querySelector("[data-note]"), out = root.querySelector("[data-out]");
    var S = {
      anchored: ["Inflation stays near target even after a shock.", "People believe the RBI's 4% promise, so wage demands and price-setting assume 4%. A one-off shock passes through and fades. The central bank's credibility does the heavy lifting — policy barely needs to move."],
      adaptive: ["Yesterday's inflation becomes tomorrow's.", "People expect whatever they last experienced. A shock enters wages, wages enter prices, prices re-enter expectations — the spiral. Breaking it needs rates high enough to hurt, held long enough to convince. The 1970s, and every 'transitory' that wasn't."],
      rational: ["Only surprises move output.", "People use ALL available information, including the policy rule itself. Anticipated stimulus is priced in before it lands and changes nothing real; only genuine surprises work — once. A central bank that surprises repeatedly stops being believed, and loses even that."]
    };
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        var s = S[b.getAttribute("data-mode")];
        out.textContent = s[0]; note.textContent = s[1];
      });
    });
    btns[0].click();
  })();

  /* M3: growth accounting — the long run */
  (function () {
    var root = document.getElementById("w-growth"); if (!root) return;
    var prod = root.querySelector("[data-prod]"), out = root.querySelector("[data-out]"), note = root.querySelector("[data-note]");
    function draw() {
      var p = +prod.value / 10;
      root.querySelector("[data-prod-label]").textContent = pct(p, 1) + " / yr";
      var years = Math.log(2) / Math.log(1 + p / 100);
      out.textContent = "Living standards double every " + Math.round(years) + " years";
      note.textContent = p < 2
        ? "At this pace a generation barely notices improvement. This is why the professor keeps repeating: in the long run, productivity is nearly everything — no demand management can substitute for it."
        : "Compounding at " + pct(p, 1) + ", a child retires in an economy ~" + Math.round(Math.pow(1 + p / 100, 40)) + "× richer per head than at their birth. Small differences in productivity growth, sustained, dwarf every budget and every rate cut. The long run is a productivity story; everything else is the short run.";
    }
    prod.addEventListener("input", draw); draw();
  })();
})();
