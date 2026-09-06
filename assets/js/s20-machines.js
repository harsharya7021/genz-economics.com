/* Session 20 — the FCNR(B) machines. Five widgets, wired by id; each guards on
   presence so the file is inert elsewhere. Numbers are the verified set, not the
   class's spoken ones: RBI 2 Sep 2026 (FCNR(B) $127.226bn, OFCB $5.260bn,
   ECB $3.891bn, total $136.377bn, provisional); reserves $740.8bn on 28 Aug vs
   $682.3bn on 29 May; external debt $762.8bn at end-Mar 2026; Money Market
   Operations, 3 Sep 2026 (total absorption ₹10,31,465.5 cr); corridor
   SDF 5.00 / repo 5.25 / MSF 5.50; USD/INR ~94.5; GDP ₹346.36 L cr;
   Union Budget 2026-27 ₹53.5 L cr. */
(function () {
  "use strict";
  var USDINR = 94.5;
  var r1d = function (n) { return (Math.round(n * 10) / 10).toFixed(1); };
  var lcr = function (n) { return "₹" + r1d(n) + " L cr"; };
  var bn = function (n) { return "$" + r1d(n) + "bn"; };
  var kcr = function (n) { return "₹" + Math.round(n).toLocaleString("en-IN") + " cr"; };
  /* $bn → ₹ lakh crore */
  var toLcr = function (d) { return d * USDINR / 1000; };

  /* ── M1: the ledger — expectation trail, actual inflow, cost of carry ── */
  (function () {
    var root = document.getElementById("s20-ledger"); if (!root) return;
    var host = root.querySelector("[data-rows]");
    var carry = root.querySelector("[data-carry]"), carryL = root.querySelector("[data-carry-l]");
    var verdict = root.querySelector("[data-verdict]"), note = root.querySelector("[data-note]");
    var btns = root.querySelectorAll("[data-v]");
    var view = "trail";
    var TRAIL = [
      ["At launch, June", 42.5, "analyst range $35–50bn", ""],
      ["21 July", 65, "$60–70bn forecasts", ""],
      ["mid-August", 90, "consensus ~$90bn", ""],
      ["RBI's own working figure", 80, "internal estimate", "warn"],
      ["What arrived", 136.4, "2 September, provisional", "danger"]
    ];
    var LEDGER = [
      ["FCNR(B) deposits", 127.226, "the swap window proper", ""],
      ["Overseas FC borrowings", 5.260, "OFCB", ""],
      ["External commercial borrowings", 3.891, "ECB — window open to 31 Dec", ""],
      ["Total", 136.377, "≈ ₹12.9 lakh crore", "danger"]
    ];
    function draw() {
      var rows = view === "trail" ? TRAIL : LEDGER;
      var max = 136.4;
      host.innerHTML = rows.map(function (p) {
        var cls = p[3] ? " is-" + p[3] : "";
        return '<div class="w-bar-row"><span class="w-bar-label">' + p[0] +
          '</span><div class="w-bar"><div class="w-bar-fill' + cls + '" style="width:' +
          (p[1] / max * 100) + '%"></div></div><output>' + bn(p[1]) + "</output></div>";
      }).join("");
      var c = parseFloat(carry.value);
      var annual = 136.377 * c / 100;
      carryL.textContent = c.toFixed(2) + " pts";
      verdict.textContent = "Negative carry: " + bn(annual) + " a year — about " +
        kcr(annual * USDINR * 100) + ", every year, for three to five years.";
      note.innerHTML = view === "trail"
        ? "The instruction of the session: <b>read the June newspapers, not the 2029 histories.</b> The estimate climbed all summer and still came in at barely half the eventual print — and the RBI pulled the deadline forward from 30 September to 31 August precisely because it could see it had lost control of the size. Most of the money landed in the final three days."
        : "India pays roughly <b>6–6.5%</b> on this to non-residents (up to ~7% at smaller banks) and earns roughly <b>3.9–4.1%</b> parking the dollars in short-dated US Treasuries. The default slider position, 2.25 points, is that gap. Slide to 3 for the class's figure. Either way the answer rounds to <b>about $3 billion a year</b> — and the professor's spoken \"$3 billion\" survives even though his \"3%\" is a little rich. RBI figures are provisional.";
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        view = b.getAttribute("data-v");
        btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        draw();
      });
    });
    carry.addEventListener("input", draw);
    draw();
  })();

  /* ── M2: door one — sell the dollars, and watch the see-saw ── */
  (function () {
    var root = document.getElementById("s20-doors"); if (!root) return;
    var sell = root.querySelector("[data-sell]"), sellL = root.querySelector("[data-sell-l]");
    var b = {};
    ["res", "debt", "cov", "rup"].forEach(function (k) {
      b[k] = [root.querySelector("[data-bar-" + k + "]"), root.querySelector("[data-" + k + "-l]")];
    });
    var verdict = root.querySelector("[data-verdict]"), note = root.querySelector("[data-note]");
    var BASE_RES = 682.3;      /* reserves, 29 May 2026, pre-window */
    var BASE_DEBT = 762.8;     /* external debt, end-Mar 2026 */
    var INFLOW = 136.377;
    function draw() {
      var s = parseFloat(sell.value) / 100;
      var kept = INFLOW * (1 - s);
      var res = BASE_RES + kept;
      var debt = BASE_DEBT + INFLOW;   /* debt is incurred either way */
      var cov = res / debt * 100;
      var rupees = toLcr(kept);        /* reserve money created buying them */
      /* ~10-15% appreciation if the whole lot is sold: 95 → ~86 */
      var fx = 95.0 - s * 8.5;
      sellL.textContent = Math.round(s * 100) + "% sold  →  ₹" + fx.toFixed(1) + "/$";
      b.res[0].style.width = (res / 830 * 100) + "%"; b.res[1].textContent = bn(res);
      b.debt[0].style.width = (debt / 830 * 100) + "%"; b.debt[1].textContent = bn(debt);
      b.cov[0].style.width = cov + "%"; b.cov[1].textContent = Math.round(cov) + "%";
      b.rup[0].style.width = (rupees / 13 * 100) + "%"; b.rup[1].textContent = lcr(rupees);
      if (s < 0.15) {
        verdict.textContent = "Roughly where we are: the rupee holds near 94–95, and ₹10 lakh crore of new reserves is now the problem.";
        note.innerHTML = "The door the RBI took. Reserves hit a record <b>$740.8bn</b> in the week to 28 August. Cover of external debt stays respectable — and the entire cost migrates to the rupee side of the balance sheet, which is what Models 3 to 5 are about.";
      } else if (s > 0.75) {
        verdict.textContent = "The rupee at ~" + fx.toFixed(0) + ": exporters wrecked, imports surging, FIIs exiting at a better rate, cover down to " + Math.round(cov) + "%.";
        note.innerHTML = "The professor's worst door — and, awkwardly, <b>the one the scheme was publicly justified by</b>. You borrow $136bn in dollars, spend it appreciating your own currency, subsidise the exit you were trying to stop, and end up back near 95 in a year with the debt still outstanding. No domestic liquidity problem, though: nothing was printed.";
      } else {
        verdict.textContent = "Split the difference and you get both problems in half measure — a rupee at ~" + fx.toFixed(1) + " and " + lcr(rupees) + " to sterilise.";
        note.innerHTML = "The see-saw is the point. Dollars kept become rupees printed; dollars sold become an exchange rate nobody asked for. There is no setting where both are quiet, because the $136bn arrives as one or the other. <b>External debt does not move</b> — you owe it either way.";
      }
    }
    sell.addEventListener("input", draw);
    draw();
  })();

  /* ── M3: the absorption screen, 3 Sep 2026 ── */
  (function () {
    var root = document.getElementById("s20-screen"); if (!root) return;
    var host = root.querySelector("[data-rows]");
    var verdict = root.querySelector("[data-verdict]"), note = root.querySelector("[data-note]");
    /* label, ₹ crore, gloss, class */
    var ROWS = [
      ["Overnight VRRR #1 (3 Sep)", 518742, "notified ₹6,00,000 cr — undersubscribed", ""],
      ["Overnight VRRR #2 (3 Sep)", 34652, "notified ₹1,50,000 cr — undersubscribed", ""],
      ["Standing deposit facility", 235571, "at 5.00%, parked overnight", ""],
      ["7-day VRRR (auctioned 1 Sep)", 114320, "notified ₹6,00,000 cr — 19% take-up", "warn"],
      ["15-day VRRR (auctioned 31 Aug)", 134625, "before the market knew what was coming", ""],
      ["Other outstanding term ops", -6445, "residual to the published total", ""],
      ["Total absorbed", 1031465, "RBI, Money Market Operations, 3 Sep 2026", "danger"]
    ];
    host.innerHTML = ROWS.map(function (p) {
      var cls = p[3] ? " is-" + p[3] : "";
      var w = Math.max(Math.abs(p[1]) / 1031465 * 100, 0.6);
      return '<div class="w-bar-row"><span class="w-bar-label">' + p[0] +
        '</span><div class="w-bar"><div class="w-bar-fill' + cls + '" style="width:' + w +
        '%"></div></div><output>' + kcr(p[1]) + "</output></div>";
    }).join("");
    verdict.textContent = "₹10,31,465 crore parked with the RBI overnight. Ten days earlier the daily figure was near ₹1 lakh crore.";
    note.innerHTML = "The number that carries the argument is not the total, it is the <b>take-up</b>. Every auction on this page was undersubscribed, and the seven-day auction got <b>19%</b> of what was offered: banks paying ~6.25% for money will not lock it away at 5.24% for a week. So the RBI rolls it one night at a time — <b>32 VRRR auctions between August and early September</b> — while the call rate drifts to 4.93%, some 32bp <i>below</i> the policy rate. The durable measure, which does not reset each morning: net durable liquidity surplus of <b>₹8,05,736 crore</b> as of 15 August.";
  })();

  /* ── M4: what ₹10 lakh crore of reserves becomes ── */
  (function () {
    var root = document.getElementById("s20-mult"); if (!root) return;
    var res = root.querySelector("[data-res]"), mul = root.querySelector("[data-mul]");
    var resL = root.querySelector("[data-res-l]"), mulL = root.querySelector("[data-mul-l]");
    var b = {};
    ["imp", "pfc", "ann"].forEach(function (k) {
      b[k] = [root.querySelector("[data-bar-" + k + "]"), root.querySelector("[data-" + k + "-l]")];
    });
    var verdict = root.querySelector("[data-verdict]"), note = root.querySelector("[data-note]");
    var PFC_BOOK = 5, PFC_YEAR = 1;
    function draw() {
      var R = parseFloat(res.value), m = parseFloat(mul.value);
      var implied = R * m;
      resL.textContent = lcr(R);
      mulL.textContent = m.toFixed(1) + "×";
      var scale = Math.max(implied, 10);
      b.imp[0].style.width = (implied / scale * 100) + "%"; b.imp[1].textContent = lcr(implied);
      b.pfc[0].style.width = (PFC_BOOK / scale * 100) + "%"; b.pfc[1].textContent = lcr(PFC_BOOK);
      b.ann[0].style.width = (PFC_YEAR / scale * 100) + "%"; b.ann[1].textContent = "<" + lcr(PFC_YEAR);
      verdict.textContent = lcr(implied) + " of credit — or " + r1d(implied / PFC_YEAR) +
        " years of lending by India's largest infrastructure NBFC, in one year.";
      note.innerHTML = "Last year's benchmark, from <b>Session 19</b>: about ₹5 lakh crore of extra reserves sat under roughly ₹41 lakh crore of money growth — an <b>8×</b> outturn, though reserves were not the only driver. Set the multiplier to 5 and you still get ₹50 lakh crore chasing a pipeline that, on the professor's own board experience, cannot absorb a tenth of it. <b>This is an identity, not a mechanism</b> — it shows what the base could arithmetically support, not what it will cause. Credit demand, government spending and capital flows all move deposits too. But the scale problem is real, and scale problems get solved by lowering the bar on borrowers.";
    }
    [res, mul].forEach(function (x) { x.addEventListener("input", draw); });
    draw();
  })();

  /* ── M5: who pays? ── */
  (function () {
    var root = document.getElementById("s20-pay"); if (!root) return;
    var abs = root.querySelector("[data-abs]"), absL = root.querySelector("[data-abs-l]");
    var b = {};
    ["bank", "gov", "inf"].forEach(function (k) {
      b[k] = [root.querySelector("[data-bar-" + k + "]"), root.querySelector("[data-" + k + "-l]")];
    });
    var verdict = root.querySelector("[data-verdict]"), note = root.querySelector("[data-note]");
    var btns = root.querySelectorAll("[data-d]");
    var door = "none";
    var TOTAL = 10.3;          /* ₹ L cr of reserves in play */
    var SDF = 5.00, MSS_CPN = 7.00, DEP = 6.25;
    function draw() {
      var A = parseFloat(abs.value);
      if (door === "none") A = 0;
      absL.textContent = door === "none" ? "n/a — nothing is absorbed" : lcr(A) + " of " + lcr(TOTAL);
      var left = TOTAL - A;
      /* costs in ₹ crore per year */
      var bankCost, govCost;
      if (door === "crr") {
        /* reserves earn 0 instead of SDF's 5.00% — banks eat the lot */
        bankCost = A * 1e5 * SDF / 100;
        govCost = 0;
      } else if (door === "mss") {
        bankCost = 0;
        govCost = A * 1e5 * MSS_CPN / 100;
      } else {
        bankCost = 0; govCost = 0;
      }
      /* banks are losing the deposit/SDF spread on whatever is NOT absorbed, under every door */
      var idleDrag = left * 1e5 * (DEP - SDF) / 100;
      bankCost += idleDrag;
      var infl = left / TOTAL * 100;
      var scale = 90000;
      b.bank[0].style.width = Math.min(bankCost / scale * 100, 100) + "%";
      b.bank[1].textContent = kcr(bankCost) + "/yr";
      b.gov[0].style.width = Math.min(govCost / scale * 100, 100) + "%";
      b.gov[1].textContent = govCost ? kcr(govCost) + "/yr" : "nothing today";
      b.inf[0].style.width = infl + "%";
      b.inf[1].textContent = Math.round(infl) + "% still loose";
      if (door === "none") {
        verdict.textContent = "Nobody pays anything this year. That is the entire appeal.";
        note.innerHTML = "Roll the auctions and wait. Cost to the exchequer today: zero. The professor's fear is that this is not a policy but a staring contest — bankers tire of earning 5.00% on money costing ~6.25%, and start lending. <i>\"That is where the problem will start.\"</i> Year one looks excellent; the bill arrives as the 2008→2018 sequence, which cost about ₹3.1 lakh crore of recapitalisation and a decade of growth.";
      } else if (door === "crr") {
        verdict.textContent = "Banks carry it: " + kcr(bankCost) + " a year, straight off equity.";
        note.innerHTML = "Reserves earn 5.00% in the SDF and <b>nothing</b> as CRR, so the whole spread lands on bank capital. It must be targeted at the banks that actually took the inflow — a bank that took none should not lose lending capacity for someone else's deposits — and it can be, because these reserves are traceable. The objection is fairness and signal: these banks, mostly public-sector, were leaned on to raise the money in the first place. Set the slider to full absorption and you get the professor's ~₹90,000 crore figure.";
      } else {
        verdict.textContent = "The budget carries it: " + kcr(govCost) + " a year — about " +
          r1d(govCost / 5350000 * 100) + "% of the Union Budget.";
        note.innerHTML = "Market Stabilisation Scheme bonds: the government issues, banks subscribe with the surplus reserves, the money sits in the government's account at the RBI <b>and may not be spent</b>. That lock is the instrument. Price it above what banks pay depositors — ~7% — or they will lend instead. At ₹8 lakh crore that is ~₹56,000 crore a year, ~₹1.68 lakh crore over three years, ~0.16pp of GDP a year on the deficit. The precedent is December 2016, when the MSS ceiling went from ₹30,000 crore to ₹6 lakh crore to sterilise the demonetisation surge. <b>The professor's recommendation</b> — clean, expensive, and invisible enough to survive politics.";
      }
    }
    btns.forEach(function (bb) {
      bb.addEventListener("click", function () {
        door = bb.getAttribute("data-d");
        btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === bb)); });
        if (door !== "none" && parseFloat(abs.value) === 0) abs.value = 8;
        draw();
      });
    });
    abs.addEventListener("input", draw);
    draw();
  })();
})();
