/* what-is-infs essay — machines mirror Prof. Tantri's INFS notes. */
(function () {
  "use strict";
  var f1 = function (n) { return (Math.round(n * 10) / 10).toFixed(1); };
  var pct = function (n, d) { return n.toLocaleString("en-IN", { maximumFractionDigits: d == null ? 1 : d, minimumFractionDigits: d == null ? 1 : d }) + "%"; };

  /* M1: deposit creation — loans create deposits; CRR is the brake */
  (function () {
    var root = document.getElementById("w-create"); if (!root) return;
    var crr = root.querySelector("[data-crr]"), out = root.querySelector("[data-out]"), note = root.querySelector("[data-note]"), bars = root.querySelector("[data-bars]");
    function draw() {
      var c = +crr.value / 100;
      root.querySelector("[data-crr-label]").textContent = pct(+crr.value, 1);
      var total = 100 / c;
      out.textContent = "₹100 of reserves → up to ₹" + Math.round(total).toLocaleString("en-IN") + " of deposits";
      var rounds = [], d = 100;
      for (var i = 0; i < 6; i++) { rounds.push(d); d = d * (1 - c); }
      var svg = '<svg viewBox="0 0 460 120" preserveAspectRatio="xMidYMid meet">';
      rounds.forEach(function (v, i) {
        var h = v * 0.9, x = 15 + i * 75;
        svg += '<rect x="' + x + '" y="' + (100 - h) + '" width="52" height="' + h + '" rx="4" fill="var(--accent)" opacity="' + (1 - i * 0.13) + '"/>';
        svg += '<text x="' + (x + 26) + '" y="114" text-anchor="middle" class="w-tick">round ' + (i + 1) + '</text>';
      });
      svg += "</svg>";
      bars.innerHTML = svg;
      note.textContent = c <= 0.02 ? "A thin CRR lets the loan→deposit→loan loop run long — the multiplier balloons. This is why the CRR exists: it is the leak that stops infinite money."
        : "Each round: a loan is made, comes back as a deposit, " + pct(+crr.value, 1) + " is parked at the RBI, the rest is lent again. The multiplier is 1/CRR = " + f1(1 / c) + "×. Banks do not lend deposits; lending CREATES deposits — the notes' central point.";
    }
    crr.addEventListener("input", draw); draw();
  })();

  /* M2: LAF corridor — where the overnight rate actually lives */
  (function () {
    var root = document.getElementById("w-corridor"); if (!root) return;
    var liq = root.querySelector("[data-liq]"), out = root.querySelector("[data-call]"), note = root.querySelector("[data-note]"), viz = root.querySelector("[data-viz]");
    var SDF = 6.25, REPO = 6.5, MSF = 6.75;
    function draw() {
      var s = +liq.value; // -100 deficit .. +100 surplus
      root.querySelector("[data-liq-label]").textContent = (s > 0 ? "surplus ₹" + s : s < 0 ? "deficit ₹" + (-s) : "balanced") + " (thousand cr)";
      var call = s >= 0 ? REPO - (REPO - SDF) * Math.min(s, 100) / 100 : REPO + (MSF - REPO) * Math.min(-s, 100) / 100;
      out.textContent = pct(call, 2);
      var y = function (r) { return 20 + (MSF - r) / (MSF - SDF) * 80; };
      viz.innerHTML = '<svg viewBox="0 0 460 130" preserveAspectRatio="xMidYMid meet">' +
        '<line x1="30" y1="' + y(MSF) + '" x2="430" y2="' + y(MSF) + '" stroke="var(--w-bad)" stroke-dasharray="4 3"/><text x="435" y="' + (y(MSF) + 4) + '" class="w-tick">MSF ' + MSF + '</text>' +
        '<line x1="30" y1="' + y(REPO) + '" x2="430" y2="' + y(REPO) + '" stroke="var(--ink-soft)"/><text x="435" y="' + (y(REPO) + 4) + '" class="w-tick">repo ' + REPO + '</text>' +
        '<line x1="30" y1="' + y(SDF) + '" x2="430" y2="' + y(SDF) + '" stroke="var(--w-good)" stroke-dasharray="4 3"/><text x="435" y="' + (y(SDF) + 4) + '" class="w-tick">SDF ' + SDF + '</text>' +
        '<circle cx="230" cy="' + y(call) + '" r="7" fill="var(--gold)"/><text x="230" y="' + (y(call) - 12) + '" text-anchor="middle" class="w-tick">call rate</text></svg>';
      note.textContent = s >= 0
        ? "Banks are flush — they park spare cash at the SDF floor, and the overnight rate sinks toward it. The RBI drains via VRRR to pull it back up. Policy can tighten without the repo rate moving — watch liquidity, not headlines."
        : "Banks are short — they borrow at the MSF ceiling and the call rate climbs. Injections (VRR, OMO purchases) push it back. The corridor, not the repo announcement, is where policy actually operates day to day.";
    }
    liq.addEventListener("input", draw); draw();
  })();

  /* M3: REER — the dosa test for the "weak rupee" */
  (function () {
    var root = document.getElementById("w-reer"); if (!root) return;
    var dep = root.querySelector("[data-dep]"), inf = root.querySelector("[data-inf]"), out = root.querySelector("[data-out]"), note = root.querySelector("[data-note]");
    function draw() {
      var d = +dep.value, i = +inf.value; // nominal depreciation %, inflation differential % (India minus US)
      root.querySelector("[data-dep-label]").textContent = pct(d, 1);
      root.querySelector("[data-inf-label]").textContent = pct(i, 1);
      var real = ((1 + d / 100) / (1 + i / 100) - 1) * 100; // real depreciation of rupee (+ = more competitive)
      out.textContent = (real >= 0 ? "real depreciation " : "real APPRECIATION ") + pct(Math.abs(real), 2);
      out.style.color = real >= 0 ? "var(--w-good)" : "var(--w-bad)";
      note.textContent = Math.abs(real) < 0.5
        ? "The nominal fall roughly matches the inflation gap — the real exchange rate is flat. The dosa costs the same in both currencies as before: no competitiveness change, no crisis. This is the notes' base case: depreciation as equilibrium, not weakness."
        : real < 0
          ? "Prices rose faster at home than the rupee fell — Indian goods got dearer abroad in real terms. THIS is the case worth worrying about (exporters squeezed), and it can happen while the headline screams about a 'strong' rupee."
          : "The rupee fell more than the inflation gap — Indian goods are cheaper abroad in real terms. Exporters gain. The headline says 'weak rupee'; the REER says 'more competitive'. Read the second one.";
    }
    [dep, inf].forEach(function (el) { el.addEventListener("input", draw); }); draw();
  })();

  /* M4: bank run — liquidity transformation under stress */
  (function () {
    var root = document.getElementById("w-run"); if (!root) return;
    var wd = root.querySelector("[data-wd]"), buf = root.querySelector("[data-buf]"), out = root.querySelector("[data-out]"), note = root.querySelector("[data-note]");
    function draw() {
      var w = +wd.value, b = +buf.value; // % depositors withdrawing, % held liquid
      root.querySelector("[data-wd-label]").textContent = pct(w, 0);
      root.querySelector("[data-buf-label]").textContent = pct(b, 0);
      var ok = w <= b;
      out.textContent = ok ? "The bank survives" : "The bank fails";
      out.style.color = ok ? "var(--w-good)" : "var(--w-bad)";
      note.textContent = ok
        ? "Withdrawals fit inside the liquid buffer. The estimate held — illiquid loans stay funded, and society keeps the projects. This is finance's most important trick working as designed."
        : "Withdrawals exceed the buffer. The bank must dump long, illiquid loans at fire-sale prices to pay depositors queueing today — value is destroyed for everyone, including those who never ran. Every depositor knew this, which is why they ran first. That self-fulfilling loop is why deposit insurance and the RBI's lender-of-last-resort window exist.";
    }
    [wd, buf].forEach(function (el) { el.addEventListener("input", draw); }); draw();
  })();


})();
