/* what-is-corporate-finance essay — interactive artifacts + soft gate.
   Every number mirrors Prof. Tantri's FCRV notes (Sessions 1-10 + June-10 book draft).
   Artifacts: oppcost, lender, shark, bank, npv, price, irr, irrprofile, trio, mm, gamble, lnt, buyback + MCQs. */
(function () {
  "use strict";
  var f1 = function (n) { return (Math.round(n * 10) / 10).toFixed(1); };
  var f2 = function (n) { return (Math.round(n * 100) / 100).toFixed(2); };
  var inr = function (n) { return Math.round(n).toLocaleString("en-IN"); };
  var pct = function (n, d) { return n.toLocaleString("en-IN", { maximumFractionDigits: d == null ? 2 : d, minimumFractionDigits: d == null ? 2 : d }) + "%"; };

  /* ── M1: Opportunity cost — projects A, B and the ongoing C (June-10 §2.1) ── */
  (function () {
    var root = document.getElementById("w-oppcost"); if (!root) return;
    var tbl = root.querySelector("[data-table]"), verdict = root.querySelector("[data-verdict]");
    var btns = root.querySelectorAll("[data-scen]");
    var S = {
      base: { a: [100, 30, 50, 0], b: [120, 30, 50, 50],
        v: "Accounting profit says B (40 vs 20). But choosing B forgoes C's 50 — the opportunity cost of the skilled labour. B's economic profit is −10. In his words: \"Share price will decline if the manager goes with B, considering only accounting profit.\"" },
      shut: { a: [100, 30, 50, 0], b: [120, 30, 50, 0],
        v: "The Pollution Control Board shut C anyway — you were not going to earn its 50 regardless, so redeploying the workers forgoes nothing. Opportunity cost: zero. B's 40 now beats A's 20 economically too. \"If not for project B, you would have fired those workers.\"" },
      stuck: { a: [85, 30, 50, 0], b: [70, 30, 0, 0],
        v: "C is shut but the workers can't be fired — their 50 of wages is paid no matter what. B's out-of-pocket labour is therefore zero, and B earns 40 economically despite an accounting loss of 10. \"You are better off choosing project B, despite the negative accounting profit. The share price will increase.\"" }
    };
    function row(name, vals) {
      var econ = vals[0] - vals[1] - vals[2] - vals[3];
      return "<tr><td>" + name + "</td><td>" + vals[0] + "</td><td>" + vals[1] + "</td><td>" + vals[2] + "</td><td>" + vals[3] + "</td><td style='font-weight:700;color:" + (econ >= 0 ? "var(--w-good)" : "var(--w-bad)") + "'>" + econ + "</td></tr>";
    }
    function draw(key) {
      var s = S[key];
      tbl.innerHTML = "<table class='w-table'><thead><tr><th>Project</th><th>Revenue</th><th>Materials</th><th>Wages paid</th><th>Opportunity cost</th><th>Economic profit</th></tr></thead><tbody>" +
        row("A", s.a) + row("B", s.b) + "</tbody></table>";
      verdict.textContent = s.v;
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        draw(b.getAttribute("data-scen"));
      });
    });
    draw("base");
  })();

  /* ── M2: The lender's arithmetic (June-10 §2.3: SBI 10%, default 10% → 22.22%) ── */
  (function () {
    var root = document.getElementById("w-lender"); if (!root) return;
    var rf = root.querySelector("[data-rf]"), pd = root.querySelector("[data-pd]");
    var out = root.querySelector("[data-rate]"), note = root.querySelector("[data-note]");
    function draw() {
      var r = +rf.value / 100, p = +pd.value / 100;
      root.querySelector("[data-rf-label]").textContent = pct(+rf.value, 1);
      root.querySelector("[data-pd-label]").textContent = pct(+pd.value, 0);
      if (p >= 0.99) { out.textContent = "—"; note.textContent = "Nobody lends into certain default."; return; }
      var rate = (1 + r) / (1 - p) - 1;
      out.textContent = pct(rate * 100);
      note.textContent = "To make " + pct(r * 100, 1) + " in expectation — what the SBI deposit paid — with " + pct(p * 100, 0) +
        " of borrowers defaulting to zero, the survivors must pay " + pct(rate * 100) + ". At his numbers (10% and 10%) that is 110/90 = 22.22%. This is what a risk-neutral lender charges: not profit, not a risk premium — arithmetic. The risk premium is charged on top, for the uncertainty around that default estimate, and its size is set by the marginal investor.";
    }
    [rf, pd].forEach(function (el) { el.addEventListener("input", draw); }); draw();
  })();

  /* ── M3: The shark's terms (Session 3: 55% → ke 32%, founder 8%) ── */
  (function () {
    var root = document.getElementById("w-shark"); if (!root) return;
    var stake = root.querySelector("[data-stake]"), tbl = root.querySelector("[data-table]"), verdict = root.querySelector("[data-verdict]");
    function draw() {
      var s = +stake.value / 100;
      root.querySelector("[data-stake-label]").textContent = pct(+stake.value, 0);
      var val = 100 / s;                    // implied post-money valuation
      var ke = 240 / val - 1;               // shark's cost of equity
      var yourCash = (1 - s) * 240;         // founder's share of next-year 240
      var yourRet = yourCash / 100 - 1;     // on the 100 already invested
      var yourStake = val - 100;            // value of founder's stake today
      tbl.innerHTML = "<table class='w-table'><tbody>" +
        "<tr><td>Implied valuation (100 ÷ stake)</td><td>Rs " + f2(val) + "</td></tr>" +
        "<tr><td>Cost of equity the shark charges</td><td style='font-weight:700'>" + pct(ke * 100, 1) + "</td></tr>" +
        "<tr><td>Your stake, the moment the deal signs</td><td style='color:" + (yourStake >= 99.995 ? "var(--w-good)" : "var(--w-bad)") + "'>Rs " + f2(yourStake) + " (was Rs 100)</td></tr>" +
        "<tr><td>Your return on the project</td><td style='font-weight:700;color:" + (yourRet >= 0 ? "var(--w-good)" : "var(--w-bad)") + "'>" + pct(yourRet * 100, 1) + "</td></tr>" +
        "</tbody></table>";
      verdict.textContent = s > 0.5555
        ? "Above ~55.6% the shark's charge exceeds the 20% the project itself earns — past 60% your return goes negative and, in his words, \"you would rather invest your stake in a risk-free bond than accept the offer.\" The firm did not change; the price of equity did."
        : (s < 0.4545
          ? "Below ~45.5% the shark is charging less than 8% — cheaper than most debt. Your stake is worth more than you put in the moment the deal signs. Sharks on television rarely feel this generous, which tells you what cost of equity they think start-ups carry."
          : "In the middle band both sides earn something sensible. Note the mechanism: nobody wrote a return into a contract. The shark charges the expected return purely by setting today's price.");
    }
    stake.addEventListener("input", draw); draw();
  })();

  /* ── M4: Bank capital adequacy (Session 5: 1:9 → 11%, 2:8 → 12%) ── */
  (function () {
    var root = document.getElementById("w-bank"); if (!root) return;
    var eq = root.querySelector("[data-eq]"), wacc = root.querySelector("[data-wacc]"), note = root.querySelector("[data-note]");
    var mixE = root.querySelector("[data-mix-e]"), mixD = root.querySelector("[data-mix-d]");
    var KE = 0.20, KD = 0.10, LEND = 0.11;
    function draw() {
      var e = +eq.value / 100;
      root.querySelector("[data-eq-label]").textContent = pct(+eq.value, 0) + " equity : " + pct(100 - +eq.value, 0) + " debt";
      mixE.style.width = (e * 100) + "%"; mixE.textContent = "equity " + Math.round(e * 100);
      mixD.style.width = ((1 - e) * 100) + "%"; mixD.textContent = "debt " + Math.round((1 - e) * 100);
      var w = KE * e + KD * (1 - e);
      wacc.textContent = "Cost of capital: " + pct(w * 100, 1) + " — must lend at " + pct(w * 100, 1);
      var residual = LEND * 100 - KD * (1 - e) * 100;
      var roe = residual / (e * 100);
      note.textContent = "If the bank keeps lending at 11%: interest income Rs 11, debt takes Rs " + f2(KD * (1 - e) * 100) + ", leaving Rs " + f2(residual) + " on Rs " + f2(e * 100) + " of equity — a return of " + pct(roe * 100, 1) +
        (Math.abs(roe - KE) < 0.0005 ? ", exactly the 20% equity holders expect. Everyone is paid their expected return." :
          (roe < KE ? ", below the 20% equity holders expect — \"hence, the stock price of the bank falls.\" The bank must reprice its loans to " + pct(w * 100, 1) + ". As the SBI Chairman put it: \"If my cost of funds is going up, I will certainly increase interest rates. We have to do the calculation.\"" :
            ", above the 20% equity holders expect — competition will hand that surplus to borrowers."));
    }
    eq.addEventListener("input", draw); draw();
  })();

  /* ── M5: NPV and its hidden assumption (Session 6: −100,12,11,110 @10% = 2.645) ── */
  (function () {
    var root = document.getElementById("w-npv"); if (!root) return;
    var CF = [-100, 12, 11, 110];
    var rate = root.querySelector("[data-rate]"), reinv = root.querySelector("[data-reinv]");
    var out = root.querySelector("[data-out]"), verdict = root.querySelector("[data-verdict]"), bars = root.querySelector("[data-bars]");
    function draw() {
      var r = +rate.value / 100, ri = +reinv.value / 100;
      root.querySelector("[data-rate-label]").textContent = pct(+rate.value, 1);
      root.querySelector("[data-reinv-label]").textContent = pct(+reinv.value, 1);
      var fv = 0;
      for (var t = 1; t <= 3; t++) fv += CF[t] * Math.pow(1 + ri, 3 - t);
      var npv = fv / Math.pow(1 + r, 3) + CF[0];
      out.textContent = "NPV: " + (npv < 0 ? "−" : "+") + "Rs " + f2(Math.abs(npv));
      out.style.color = npv >= 0 ? "var(--w-good)" : "var(--w-bad)";
      var same = Math.abs(r - ri) < 1e-9;
      verdict.textContent = same
        ? "Reinvestment at the cost of capital — the assumption the formula makes silently. At his numbers (10%, 10%) the NPV is 2.645: compound the inflows to 136.62 at year 3, discount back, same answer. The share price should rise by exactly this much on announcement."
        : "The assumption is broken: interim cash actually compounds at " + pct(+reinv.value, 1) + " while the formula assumed " + pct(+rate.value, 1) + ". At his numbers (bank pays 6%) the NPV falls from 2.645 to 1.535 — \"an incorrect assumption about reinvestment can potentially lead to wrong project selections.\"";
      var w = 460, h = 140, bw = 70, gap = 28, zero = 55, max = 130;
      var svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Cash flows by year">';
      svg += '<line x1="0" y1="' + zero + '" x2="' + w + '" y2="' + zero + '" stroke="var(--rule)" stroke-width="1"/>';
      CF.forEach(function (v, t) {
        var x = 30 + t * (bw + gap);
        var bh = Math.min(Math.abs(v) / max * 50, 52);
        var y = v >= 0 ? zero - bh : zero;
        svg += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + Math.max(bh, 2) + '" rx="4" fill="' + (v >= 0 ? "var(--w-good)" : "var(--w-bad)") + '"/>';
        svg += '<text x="' + (x + bw / 2) + '" y="' + (h - 26) + '" text-anchor="middle" class="w-tick">Year ' + t + '</text>';
        svg += '<text x="' + (x + bw / 2) + '" y="' + (h - 10) + '" text-anchor="middle" class="w-tick w-tick-val">' + (v < 0 ? "−" : "") + Math.abs(v) + '</text>';
      });
      svg += "</svg>";
      bars.innerHTML = svg;
    }
    rate.addEventListener("input", draw); reinv.addEventListener("input", draw); draw();
  })();

  /* ── M6: Dividend or reinvest — investor B earns 10% either way (Session 6) ── */
  (function () {
    var root = document.getElementById("w-price"); if (!root) return;
    var div = root.querySelector("[data-div]"), tbl = root.querySelector("[data-table]"), verdict = root.querySelector("[data-verdict]");
    var P0 = 102.6446281;
    function draw() {
      var d = +div.value;
      root.querySelector("[data-div-label]").textContent = "Rs " + d + " dividend · Rs " + (12 - d) + " reinvested";
      var cf3 = 110 + (12 - d) * 1.1 * 1.1;
      var p1 = 11 / 1.1 + cf3 / (1.1 * 1.1);
      var ret = (p1 + d - P0) / P0;
      var priceMove = (p1 - P0) / P0;
      tbl.innerHTML = "<table class='w-table'><tbody>" +
        "<tr><td>Bought at (start of year 1)</td><td>Rs 102.645</td></tr>" +
        "<tr><td>Share price, end of year 1</td><td style='color:" + (priceMove >= 0 ? "var(--w-good)" : "var(--w-bad)") + "'>Rs " + f2(p1) + " (" + (priceMove >= 0 ? "+" : "−") + pct(Math.abs(priceMove) * 100, 2) + ")</td></tr>" +
        "<tr><td>Dividend received</td><td>Rs " + f2(d) + "</td></tr>" +
        "<tr><td>Investor B's total return</td><td style='font-weight:700;color:var(--w-good)'>" + pct(ret * 100, 2) + "</td></tr>" +
        "</tbody></table>";
      verdict.textContent = d === 0
        ? "Full reinvestment: the price climbs to 112.909 — 10% exactly. No dividend, and the investor is whole."
        : (d === 12
          ? "Full payout: the share price ends at 100.909, below the purchase price — \"the share price, in fact, falls by 1.69%\" — and yet with the Rs 12 dividend the return is still exactly 10%. A falling price and a fairly paid investor at the same time."
          : "Split it any way you like — the return refuses to move off 10%. The dividend decision changes the packaging of the return (price appreciation vs cash), not its size. This is the seed of dividend irrelevance, and the reason the MRI rule in Chapter 1 is about where cash earns more, not about pleasing anyone.");
    }
    div.addEventListener("input", draw); draw();
  })();

  /* ── M7: The IRR trap (Session 7: 11.07% naive vs 10.56% true vs 10.75% hurdle) ── */
  (function () {
    var root = document.getElementById("w-irr"); if (!root) return;
    var CF = [-100, 12, 11, 110], IRR = 0.110657;
    var reinv = root.querySelector("[data-reinv]"), hurdle = root.querySelector("[data-hurdle]");
    var out = root.querySelector("[data-eff]"), verdict = root.querySelector("[data-verdict]");
    function draw() {
      var ri = +reinv.value / 100, h = +hurdle.value / 100;
      root.querySelector("[data-reinv-label]").textContent = pct(+reinv.value, 1);
      root.querySelector("[data-hurdle-label]").textContent = pct(+hurdle.value, 2);
      var fv = 0;
      for (var t = 1; t <= 3; t++) fv += CF[t] * Math.pow(1 + ri, 3 - t);
      var eff = Math.pow(fv / 100, 1 / 3) - 1;
      out.innerHTML = "Excel says IRR = <strong>11.07%</strong> · true annualised return: <strong>" + pct(eff * 100, 2) + "</strong>";
      var naiveOK = IRR > h, trueOK = eff > h;
      verdict.textContent = naiveOK === trueOK
        ? (trueOK ? "Both the naive IRR and the true return clear the hurdle — accepted either way. The trap needs the hurdle to sit between them; drag it there." : "Both fail the hurdle. At least the naive number did not lie to you today.")
        : "The trap, exactly as the notes set it: the naive 11.07% clears your " + pct(+hurdle.value, 2) + " hurdle, but with interim cash actually at " + pct(+reinv.value, 1) + " the true return is " + pct(eff * 100, 2) + " — below it. \"If you had done the naive estimation, you would have incorrectly accepted the project.\"";
      verdict.style.color = naiveOK === trueOK ? "" : "var(--w-bad)";
    }
    [reinv, hurdle].forEach(function (el) { el.addEventListener("input", draw); }); draw();
  })();

  /* ── M8: NPV profile — single root vs three roots (Session 7) ── */
  (function () {
    var root = document.getElementById("w-irrprofile"); if (!root) return;
    var chart = root.querySelector("[data-chart]"), verdict = root.querySelector("[data-verdict]");
    var btns = root.querySelectorAll("[data-prof]");
    var P = {
      normal: { cf: [-100, 12, 11, 110], rmax: 0.30, scale: 1, unit: "Rs", roots: [0.1107],
        v: "One sign change in the cash flows, one crossing: the IRR is well-defined at 11.07%. Below it the project is positive-NPV, above it negative — the curve is the whole story, and the IRR is just where it crosses the axis." },
      multi: { cf: [-500000, 1605000, -1716900, 612040], rmax: 0.14, scale: 1000, unit: "Rs '000", roots: [0.04, 0.07, 0.10],
        v: "His three-root example: the cash flows change sign three times, and the polynomial obliges with three IRRs — 4%, 7% and 10%. Which one goes in the board deck? Exactly. \"In such scenarios, always select projects based on NPV.\"" }
    };
    function npvAt(cf, r) { var s = 0; for (var t = 0; t < cf.length; t++) s += cf[t] / Math.pow(1 + r, t); return s; }
    function draw(key) {
      var p = P[key], W = 460, H = 190, L = 46, R = 12, T = 12, B = 34;
      var pts = [], min = 1e18, max = -1e18, N = 80;
      for (var i = 0; i <= N; i++) {
        var r = p.rmax * i / N, v = npvAt(p.cf, r) / p.scale;
        pts.push([r, v]); if (v < min) min = v; if (v > max) max = v;
      }
      var pad = (max - min) * 0.1; min -= pad; max += pad;
      var X = function (r) { return L + (W - L - R) * r / p.rmax; };
      var Y = function (v) { return T + (H - T - B) * (1 - (v - min) / (max - min)); };
      var d = pts.map(function (q, i) { return (i ? "L" : "M") + f2(X(q[0])) + " " + f2(Y(q[1])); }).join(" ");
      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="NPV against discount rate">';
      svg += '<line x1="' + L + '" y1="' + Y(0) + '" x2="' + (W - R) + '" y2="' + Y(0) + '" stroke="var(--rule)" stroke-width="1.5"/>';
      svg += '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '" stroke="var(--rule)" stroke-width="1"/>';
      svg += '<path d="' + d + '" fill="none" stroke="var(--accent)" stroke-width="2.5"/>';
      p.roots.forEach(function (rt) {
        svg += '<circle cx="' + X(rt) + '" cy="' + Y(0) + '" r="5" fill="var(--gold)" stroke="var(--ink)" stroke-width="1"/>';
        svg += '<text x="' + X(rt) + '" y="' + (Y(0) - 10) + '" text-anchor="middle" class="w-tick">' + Math.round(rt * 1000) / 10 + '%</text>';
      });
      svg += '<text x="' + (W - R) + '" y="' + (H - 8) + '" text-anchor="end" class="w-tick">discount rate → ' + Math.round(p.rmax * 100) + '%</text>';
      svg += '<text x="' + (L - 34) + '" y="' + (T + 10) + '" class="w-tick" transform="rotate(-90 ' + (L - 34) + ' ' + (T + 60) + ')">NPV (' + p.unit + ')</text>';
      svg += "</svg>";
      chart.innerHTML = svg; verdict.textContent = p.v;
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        draw(b.getAttribute("data-prof"));
      });
    });
    draw("normal");
  })();

  /* ── M9: Three roads to the same value (Session 9: 16.56 → 17.13 at t=50%) ── */
  (function () {
    var root = document.getElementById("w-trio"); if (!root) return;
    var tax = root.querySelector("[data-tax]"), tbl = root.querySelector("[data-table]"), verdict = root.querySelector("[data-verdict]");
    var RU = 0.08, RD = 0.06, KE = 0.10, N = 4, CF = 10;
    function draw() {
      var t = +tax.value / 100;
      root.querySelector("[data-tax-label]").textContent = pct(+tax.value, 0);
      var wacc = 0.5 * KE + 0.5 * RD * (1 - t);
      var Vw = 0, i;
      for (i = 1; i <= N; i++) Vw += CF * (1 - t) / Math.pow(1 + wacc, i);
      var Vu = 0;
      for (i = 1; i <= N; i++) Vu += CF * (1 - t) / Math.pow(1 + RU, i);
      // APV: debt each year = 50% of remaining levered value (his D/E = 1 construction)
      var V = [0, 0, 0, 0, 0];
      for (i = N; i >= 1; i--) V[i - 1] = (i < N ? V[i] : 0) / (1 + wacc) + CF * (1 - t) / (1 + wacc);
      var shield = 0, nopatV = 0;
      for (i = 1; i <= N; i++) {
        var D = 0.5 * V[i - 1];
        shield += (RD * D * t) / Math.pow(1 + RU, i);
        nopatV += (CF - (CF - RD * D) * t) / Math.pow(1 + RU, i);
      }
      function row(name, detail, val) {
        return "<tr><td>" + name + "</td><td>" + detail + "</td><td style='font-weight:700'>Rs " + f2(val) + "</td></tr>";
      }
      tbl.innerHTML = "<table class='w-table'><thead><tr><th>Method</th><th>Where the tax benefit sits</th><th>Levered value</th></tr></thead><tbody>" +
        row("WACC", "in the discount rate: WACC = " + pct(wacc * 100, 2), Vw) +
        row("APV", "a separate line: Vu " + f2(Vu) + " + shield " + f2(shield), Vu + shield) +
        row("NOPAT", "in the cash flow: actual tax paid", nopatV) +
        "</tbody></table>";
      verdict.textContent = t === 0
        ? "Tax rate zero: all three methods give the unlevered value — debt adds nothing. You are looking at the Modigliani-Miller theorem as a special case: \"when the tax shield is zero, value of levered firm = value of unlevered firm.\""
        : "Three different placements of the same benefit — denominator, separate line, numerator — and three identical answers (at his 50%: 17.13, of which 0.57 is the shield). The skill being tested: put the benefit in exactly one place. Adjust the rate, or add a line, or adjust the cash flow — never two at once.";
    }
    tax.addEventListener("input", draw); draw();
  })();

  /* ── M10: Leverage, priced default, bankruptcy cost (Sessions 8–10) ── */
  (function () {
    var root = document.getElementById("w-mm"); if (!root) return;
    var GOOD = 150, BAD = 50, KE_U = 0.15, KD = 0.05, VU = (GOOD + BAD) / 2 / (1 + KE_U); // 86.96
    var debt = root.querySelector("[data-debt]"), bc = root.querySelector("[data-bc]");
    var els = { rate: root.querySelector("[data-rate]"), ke: root.querySelector("[data-ke]"), ev: root.querySelector("[data-ev]"), note: root.querySelector("[data-note]"), dl: root.querySelector("[data-debt-label]") };
    var bankruptcyCost = false;
    function draw() {
      var D = +debt.value;
      els.dl.textContent = "Rs " + D + " (" + Math.round(D / VU * 100) + "% of firm value)";
      var due = D * (1 + KD);
      var willDefault = due > BAD && D > 0;
      var badCF = bankruptcyCost && willDefault ? 40 : BAD;
      var rate, goodPay;
      if (!willDefault) { rate = KD; goodPay = due; }
      else { goodPay = 2 * due - badCF; rate = goodPay / D - 1; }
      var dv = D / VU, evw = 1 - dv;
      var ke = evw > 0 ? (KE_U - KD * dv) / evw : 0;
      var cfeGood = Math.max(GOOD - goodPay, 0), cfeBad = willDefault ? 0 : Math.max(badCF - due, 0);
      var eq = (cfeGood / (1 + ke) + cfeBad / (1 + ke)) / 2;
      var firm = eq + D;
      els.rate.textContent = pct(rate * 100, 2);
      els.ke.textContent = pct(ke * 100, 2);
      els.ev.textContent = "Rs " + f2(firm) + (Math.abs(firm - VU) < 0.02 ? " (= unlevered value)" : "");
      els.ev.style.color = firm < VU - 0.02 ? "var(--w-bad)" : "var(--ink)";
      if (D === 0) els.note.textContent = "No debt: the whole Rs 86.96 is equity earning 15%. Add debt and watch which numbers move — and which one refuses to.";
      else if (!willDefault) els.note.textContent = "Debt is \"cheap\" at 5% — and the cost of equity has climbed to " + pct(ke * 100, 2) + ". \"The advantage of cheaper debt is precisely offset by expensive equity.\" Firm value: still 86.96. The capital structure does not matter — yet.";
      else if (!bankruptcyCost) els.note.textContent = "In the bad state the firm defaults, so the lender charges " + pct(rate * 100, 2) + " upfront (at his D = 57.97: exactly 23.75%). Default is fully priced before a rupee moves — and firm value is still 86.96. \"There is no loss of value\" — default alone reshuffles, it does not destroy.";
      else els.note.textContent = "Now bankruptcy costs something real: the bad state pays 40, not 50 — customers flee, lawyers arrive. The lender re-prices to " + pct(rate * 100, 2) + " (his number: 41%) and firm value drops to 83.25. The missing 3.71 lands on the equity holder, because the lender priced himself safe. THIS — not default — is what you trade against the tax shield.";
    }
    debt.addEventListener("input", draw);
    bc.addEventListener("click", function () {
      bankruptcyCost = !bankruptcyCost;
      bc.setAttribute("aria-pressed", bankruptcyCost ? "true" : "false");
      bc.textContent = bankruptcyCost ? "Bankruptcy cost: ON (bad state 50 → 40)" : "Bankruptcy cost: OFF";
      draw();
    });
    draw();
  })();

  /* ── M11: Risk shifting — the gamble (Session 10: firm −16, lender −17, equity +1) ── */
  (function () {
    var root = document.getElementById("w-gamble"); if (!root) return;
    var win = root.querySelector("[data-win]"), tbl = root.querySelector("[data-table]"), verdict = root.querySelector("[data-verdict]");
    var DEBT = 100, CASH = 90, STAKE = 20;
    function draw() {
      var p = +win.value / 100;
      root.querySelector("[data-win-label]").textContent = pct(+win.value, 0);
      var firmW = CASH + STAKE, firmL = CASH - STAKE;
      var eFirm = p * firmW + (1 - p) * firmL;
      var eLend = p * Math.min(firmW, DEBT) + (1 - p) * Math.min(firmL, DEBT);
      var eEq = p * Math.max(firmW - DEBT, 0) + (1 - p) * Math.max(firmL - DEBT, 0);
      function row(who, base, exp) {
        var d = exp - base;
        return "<tr><td>" + who + "</td><td>" + base + "</td><td>" + f1(exp) + "</td><td style='font-weight:700;color:" + (d >= 0 ? "var(--w-good)" : "var(--w-bad)") + "'>" + (d >= 0 ? "+" : "−") + f1(Math.abs(d)) + "</td></tr>";
      }
      tbl.innerHTML = "<table class='w-table'><thead><tr><th></th><th>No gamble</th><th>With gamble (expected)</th><th>Change</th></tr></thead><tbody>" +
        row("Firm", CASH, eFirm) + row("Lender", Math.min(CASH, DEBT), eLend) + row("Equity (you)", Math.max(CASH - DEBT, 0), eEq) + "</tbody></table>";
      verdict.textContent = eEq > Math.max(CASH - DEBT, 0)
        ? "At his 10%: the firm expects to lose 16, the lender 17 — and you gain 1. \"The equity investor is incentivized to invest in projects that have negative NPV for the firm.\" You are gambling with the lender's money; your downside was already zero. Hence covenants, and board seats for nervous lenders."
        : "At these odds the gamble no longer pays even you. Notice how low the bar was: at a 10% win probability — a terrible bet — it was already worth the equity holder's while.";
    }
    win.addEventListener("input", draw); draw();
  })();

  /* ── M11b: The EPS illusion — buyback (payout chapter) ── */
  (function () {
    var root = document.getElementById("w-buyback"); if (!root) return;
    var bb = root.querySelector("[data-bb]");
    var lbl = root.querySelector("[data-bb-label]"), eps = root.querySelector("[data-eps]"), pe = root.querySelector("[data-pe]"), note = root.querySelector("[data-bb-note]");
    var EARN = 1000, SHARES = 100, PRICE = 150, YIELD = 0.06;
    function draw() {
      var spent = +bb.value;
      var ne = EARN - YIELD * spent;
      var ns = SHARES - spent / PRICE;
      var e = ne / ns;
      lbl.textContent = spent === 0 ? "Rs 0 cr — no buyback" : "Rs " + inr(spent) + " cr";
      eps.textContent = "Rs " + f2(e);
      pe.textContent = "P/E at Rs 150: " + f1(150 / e) + "×";
      note.textContent = spent === 0
        ? "No buyback: EPS Rs 10.00, earnings Rs 1,000 cr, 100 cr shares. The baseline the party trick needs you to forget."
        : "EPS is up to Rs " + f2(e) + " — while total earnings FELL to Rs " + inr(ne) + " cr (the spare cash was earning its 6% too). The denominator shrank faster than the numerator. Same company, fewer slices. Whether the remaining owners gained depends entirely on whether Rs 150 was cheap. Check the price before you applaud.";
    }
    bb.addEventListener("input", draw); draw();
  })();

  /* ── M12: The assumption artifact — his L&T close (Session 10) ── */
  (function () {
    var root = document.getElementById("w-lnt"); if (!root) return;
    var g1 = root.querySelector("[data-g1]"), g2 = root.querySelector("[data-g2]"), rr = root.querySelector("[data-r]");
    var out = root.querySelector("[data-out]"), verdict = root.querySelector("[data-verdict]"), gauge = root.querySelector("[data-gauge]");
    var INVEST = 300000;
    function value(r, a, b) {
      if (r <= b + 0.0001) return Infinity;
      var pv = 0, cf;
      for (var t = 1; t <= 7; t++) { cf = 10000 * Math.pow(1 + a, t - 1); pv += cf / Math.pow(1 + r, t); }
      var tv = 10000 * Math.pow(1 + a, 6) * (1 + b) / (r - b);
      return pv + tv / Math.pow(1 + r, 7);
    }
    function draw() {
      var a = +g1.value / 100, b = +g2.value / 100, r = +rr.value / 100;
      root.querySelector("[data-g1-label]").textContent = pct(+g1.value, 0);
      root.querySelector("[data-g2-label]").textContent = pct(+g2.value, 1);
      root.querySelector("[data-r-label]").textContent = pct(+rr.value, 2);
      var v = value(r, a, b);
      if (!isFinite(v)) {
        out.textContent = "Perpetual growth ≥ discount rate: the formula explodes to infinity";
        verdict.textContent = "A perpetuity growing as fast as its discount rate is worth infinity — which is the artifact's way of saying your assumption is broken, not that the project is good. Every terminal value in every DCF you will ever see lives one careless cell away from this.";
        gauge.style.width = "100%"; gauge.style.left = "50%"; gauge.style.background = "var(--w-bad)";
        return;
      }
      var npv = v - INVEST;
      out.textContent = "Inflows worth Rs " + inr(v) + " cr vs Rs 3,00,000 cr in — NPV " + (npv >= 0 ? "+" : "−") + inr(Math.abs(npv)) + " cr";
      out.style.color = npv >= 0 ? "var(--w-good)" : "var(--w-bad)";
      var span = Math.min(Math.abs(npv) / 600000, 0.5) * 100;
      gauge.style.background = npv >= 0 ? "var(--w-good)" : "var(--w-bad)";
      gauge.style.left = npv >= 0 ? "50%" : (50 - span) + "%";
      gauge.style.width = Math.max(span, 1) + "%";
      verdict.textContent = (a === 0.20 && b === 0.10)
        ? "His base case: the inflows are worth ~2,53,779 cr — reject. Now push growth in years 2–7 to 30% and watch a hundred-thousand-crore swing appear out of one assumption. \"This is the skill that the course was intended to equip you with — the skill to 'smell' before the fire starts.\""
        : (npv >= 0 ? "Positive — and every rupee of that verdict rests on the three sliders above. Before presenting this to a board, ask which slider you are least sure of, and how far it must move to flip the sign. That question is the course."
                    : "Negative at these assumptions. Whoever wants this project approved needs only to argue the growth up or the discount rate down — so know, before the meeting, exactly how far each must move to flip the verdict.");
    }
    [g1, g2, rr].forEach(function (el) { el.addEventListener("input", draw); }); draw();
  })();

  /* ── M13: The EPS illusion — buybacks shrink the denominator, not the pie (Chapter 11) ── */
  (function () {
    var root = document.getElementById("w-buyback"); if (!root) return;
    var bb = root.querySelector("[data-bb]");
    var epsOut = root.querySelector("[data-eps]"), peOut = root.querySelector("[data-pe]"), note = root.querySelector("[data-bb-note]");
    var EARNINGS = 1000, SHARES = 100, PRICE = 150, YIELD = 0.06;
    function draw() {
      var x = +bb.value;
      root.querySelector("[data-bb-label]").textContent = "Rs " + inr(x) + " cr";
      var bought = x / PRICE, newShares = SHARES - bought;
      var forgone = x * YIELD, newEarnings = EARNINGS - forgone;
      var eps = newEarnings / newShares, pe = PRICE / eps;
      epsOut.textContent = "Rs " + f2(eps);
      peOut.textContent = f1(pe) + "x P/E";
      note.textContent = x === 0
        ? "No buyback: Rs 10.00 EPS, 15.0x P/E. Slide the cash spent and watch the denominator do the work."
        : "Rs " + inr(x) + " cr buys back " + f2(bought) + " cr shares at Rs 150. Earnings fall only by the interest that cash would have earned — Rs " + f2(forgone) + " cr at 6% — a rounding error next to the " + f2(bought) + " cr shares removed from the denominator. EPS climbs to Rs " + f2(eps) + " with no new value created: the firm is worth exactly what it was, minus the cash it just spent. Whether the remaining owners actually gained depends on one thing this artifact cannot tell you — whether Rs 150 was cheap or dear.";
    }
    bb.addEventListener("input", draw); draw();
  })();

  /* ── MCQ boxes — his exam questions ── */
  (function () {
    document.querySelectorAll("[data-mcq]").forEach(function (root) {
      var answer = root.getAttribute("data-answer");
      var opts = root.querySelectorAll("[data-opt]");
      var explain = root.querySelector("[data-explain]");
      var done = false;
      opts.forEach(function (b) {
        b.addEventListener("click", function () {
          if (done) return; done = true;
          var chosen = b.getAttribute("data-opt");
          opts.forEach(function (x) {
            var o = x.getAttribute("data-opt");
            if (o === answer) x.classList.add("is-right");
            else if (o === chosen) x.classList.add("is-wrong");
            x.disabled = true;
          });
          if (explain) explain.hidden = false;
        });
      });
    });
  })();

  /* ── Soft gate: unlock gated chapters when signed in ── */
  (function () {
    var gate = document.getElementById("essayGate"), gated = document.getElementById("gatedChapters");
    if (!gate || !gated || !window.GZE_FIREBASE) return;
    var base = "https://www.gstatic.com/firebasejs/10.12.2/";
    Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js")]).then(function (m) {
      var app = m[0].initializeApp(window.GZE_FIREBASE, "essay");
      var auth = m[1].getAuth(app);
      m[1].onAuthStateChanged(auth, function (user) {
        document.body.classList.toggle("essay-unlocked", !!user);
      });
      var btn = gate.querySelector("[data-gate-signin]");
      if (btn) btn.addEventListener("click", function () { m[1].signInWithPopup(auth, new m[1].GoogleAuthProvider()); });
    }).catch(function () {});
  })();
})();

/* ── Term lookup — Mac-dictionary-style popover ─────────────────
   Auto-marks the FIRST occurrence of each glossary term per chapter,
   then shows a definition card on tap/click.                        */
(function () {
  "use strict";
  var data = document.getElementById("gloss-data");
  var essay = document.querySelector(".essay");
  if (!data || !essay) return;
  var list; try { list = JSON.parse(data.textContent); } catch (e) { return; }
  if (!list || !list.length) return;
  var terms = {};
  list.forEach(function (g) { if (g.term) terms[g.term.toLowerCase()] = g; });
  var alias = { "npv": "NPV", "net present value": "NPV", "irr": "IRR", "internal rate of return": "IRR",
    "wacc": "WACC", "weighted average cost of capital": "WACC", "cost of capital": "Cost of capital",
    "opportunity cost": "Opportunity cost", "sunk cost": "Sunk cost",
    "hurdle rate": "Hurdle rate", "risk premium": "Risk premium",
    "risk-free rate": "Risk-free rate", "equity": "Equity", "tax shield": "Tax shield",
    "modigliani-miller": "Modigliani-Miller", "capital adequacy": "Capital adequacy",
    "covenants": "Covenant", "covenant": "Covenant", "risk shifting": "Risk shifting",
    "debt overhang": "Debt overhang", "capital budgeting": "Capital budgeting",
    "enterprise value": "Enterprise value", "free cash flow": "Free cash flow",
    "provisioning": "Provisioning", "disposition effect": "Disposition effect",
    "corporate veil": "Corporate veil", "finance profit": "Finance profit",
    "marginal investor": "Marginal investor", "present value": "Present value",
    "beta": "Beta", "capm": "CAPM", "duration matching": "Duration matching",
    "interest coverage ratio": "Interest coverage ratio", "credit rating": "Credit rating",
    "terminal value": "Terminal value", "dcf": "DCF", "relative valuation": "Relative valuation",
    "ev/ebitda": "EV/EBITDA", "payback period": "Payback period", "profitability index": "Profitability index",
    "apv": "APV", "nopat": "NOPAT", "intrinsic value": "Intrinsic value", "perpetuity": "Perpetuity",
    "drhp": "DRHP", "operating leverage": "Operating leverage", "financial leverage": "Financial leverage",
    "llp": "LLP", "limited liability": "Limited liability", "wilful defaulter": "Wilful defaulter" };
  var names = Object.keys(alias).sort(function (a, b) { return b.length - a.length; });
  var rx = new RegExp("\\b(" + names.map(function (n) { return n.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&"); }).join("|") + ")\\b", "i");

  var seen = {};
  function markNode(node) {
    if (node.nodeType === 1) {
      if (node.tagName === "H2") { seen = {}; return; }
      if (/^(SCRIPT|STYLE|DFN|A|BUTTON|OUTPUT|LABEL|SVG|INPUT|SUP)$/.test(node.tagName)) return;
      if (node.classList && (node.classList.contains("widget") || node.classList.contains("essay-gate"))) return;
      Array.prototype.slice.call(node.childNodes).forEach(markNode);
      return;
    }
    if (node.nodeType !== 3) return;
    var text = node.nodeValue, m = rx.exec(text);
    if (!m) return;
    var canon = alias[m[1].toLowerCase()];
    var g = canon && terms[canon.toLowerCase()];
    if (!g || seen[canon]) {
      var restA = node.splitText(m.index + m[1].length);
      markNode(restA); return;
    }
    seen[canon] = true;
    var mid = node.splitText(m.index);
    var rest = mid.splitText(m[1].length);
    var dfn = document.createElement("dfn");
    dfn.className = "lookup";
    dfn.setAttribute("data-term", canon);
    dfn.setAttribute("role", "button");
    dfn.setAttribute("tabindex", "0");
    dfn.textContent = mid.nodeValue;
    mid.parentNode.replaceChild(dfn, mid);
    markNode(rest);
  }
  Array.prototype.slice.call(essay.children).forEach(markNode);

  var pop = document.createElement("div");
  pop.className = "lookup-pop"; pop.setAttribute("hidden", "");
  pop.innerHTML = '<p class="lp-term"></p><p class="lp-cat"></p><p class="lp-def"></p><a class="lp-more" href="/glossary/">full glossary →</a>';
  document.body.appendChild(pop);
  function show(dfn) {
    var g = terms[dfn.getAttribute("data-term").toLowerCase()]; if (!g) return;
    pop.querySelector(".lp-term").textContent = g.term;
    pop.querySelector(".lp-cat").textContent = g.cat || "";
    pop.querySelector(".lp-def").textContent = g.def || "";
    pop.removeAttribute("hidden");
    if (window.matchMedia("(max-width: 640px)").matches) { pop.classList.add("is-sheet"); pop.style.left = pop.style.top = ""; return; }
    pop.classList.remove("is-sheet");
    var r = dfn.getBoundingClientRect(), pw = 340;
    var x = Math.min(Math.max(10, r.left + r.width / 2 - pw / 2), window.innerWidth - pw - 10);
    var y = r.bottom + 10 + window.scrollY;
    pop.style.left = x + "px"; pop.style.top = y + "px";
  }
  function hide() { pop.setAttribute("hidden", ""); }
  document.addEventListener("click", function (e) {
    var dfn = e.target.closest && e.target.closest("dfn.lookup");
    if (dfn) { e.preventDefault(); show(dfn); }
    else if (!pop.contains(e.target)) hide();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hide();
    if (e.key === "Enter" && document.activeElement && document.activeElement.matches && document.activeElement.matches("dfn.lookup")) show(document.activeElement);
  });
})();

/* ── Footnotes — his notes have them; so do we ── */
(function () {
  var notes = document.querySelectorAll(".essay .fn");
  if (!notes.length) return;
  notes.forEach(function (fn, i) {
    var sup = document.createElement("sup");
    sup.className = "fn-ref"; sup.setAttribute("role", "button"); sup.setAttribute("tabindex", "0");
    sup.textContent = i + 1;
    fn.parentNode.insertBefore(sup, fn);
    sup.addEventListener("click", function () { fn.classList.toggle("fn-open"); });
    sup.addEventListener("keydown", function (e) { if (e.key === "Enter") fn.classList.toggle("fn-open"); });
  });
})();
