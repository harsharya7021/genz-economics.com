/* The Money Printer — Bloomburger Terminal panel.
   Reads its data from #mp-data (JSON, emitted by Liquid from _data/money-printer.yml).
   Honesty rules for this panel: the board shows DATED STOCKS as the RBI printed
   them — no per-second ticking, because money is not created per second; it
   arrives in lumps and is observed fortnightly. The hero figure is what was
   already printed over the year (past tense), revealed once on load. Chart
   lines interpolate between sourced dots; only dots are data.
   Session 19 (23 Aug 2026) is the source of the anchors.
   No dependencies; inert if the panel is absent. */
(function () {
  "use strict";
  var root = document.getElementById("money-printer");
  var dataEl = document.getElementById("mp-data");
  if (!root || !dataEl) return;
  var D; try { D = JSON.parse(dataEl.textContent); } catch (e) { return; }

  var YEAR_S = 31557600; /* 365.25 d */
  var anchorT = new Date(D.anchor_iso + "T17:00:00+05:30").getTime(); /* WSS drops Friday evening */
  var openedT = Date.now();

  function fmtIN(n) { return Math.round(n).toLocaleString("en-IN"); }
  function lcr(n, dp) { return "₹" + n.toFixed(dp === undefined ? 1 : dp) + " L cr"; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  function parseD(s) { return new Date(s + "T00:00:00").getTime(); }

  /* ── 1 · Odometers ─────────────────────────────────────────── */
  (function () {
    var wrap = root.querySelector("[data-mp-counters]"); if (!wrap) return;
    var motionOK = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    /* The board is DATED STOCKS, not a live feed. The earlier version ticked
       every second at the year's average pace — a debt-clock convention that
       quietly asserted something false: that money is being created per second
       as you watch. It isn't. It was created, past tense, in lumps (a CRR
       tranche, an OMO auction, loans booked and reported fortnightly). So the
       big number is the RBI's printed figure on the anchor date, and the only
       arithmetic on this page is subtraction. */
    (D.counters || []).forEach(function (c) {
      var card = el("div", "mp-card");
      card.appendChild(el("p", "mp-k", c.label));
      card.appendChild(el("p", "mp-v", "₹" + fmtIN(c.v_lcr * 1e5) + " crore"));
      card.appendChild(el("p", "mp-asof", "as printed · 31 Jul 2026"));
      card.appendChild(el("p", "mp-rate",
        (c.yoy_lcr >= 0 ? "+" : "−") + "₹" + fmtIN(Math.abs(c.yoy_lcr) * 1e5) + " crore over the year"));
      card.appendChild(el("p", "mp-sub", c.sub));
      wrap.appendChild(card);
    });

    /* ── the hero display: what was already printed ──────────────
       A one-shot reveal on load — an animation of a fixed, finished number,
       not a claim that anything is being printed now. Then it stops. */
    var total = (D.counters || []).filter(function (c) { return c.id === "total"; })[0];
    var printedEl = document.querySelector("[data-mp-printed]");
    var printedSub = document.querySelector("[data-mp-printed-sub]");
    var printedSplit = document.querySelector("[data-mp-printed-split]");
    if (total && printedEl) {
      var finalCr = total.yoy_lcr * 1e5;                    /* ₹41,00,000 crore */
      var byId = {}; (D.counters || []).forEach(function (c) { byId[c.id] = c; });
      if (printedSub) printedSub.textContent = "deposits + currency with the public, over twelve months";
      if (printedSplit) {
        [["₹" + fmtIN((byId.deposits || {}).yoy_lcr * 1e5) + " cr", "new bank deposits"],
         ["₹" + fmtIN((byId.cash || {}).yoy_lcr * 1e5) + " cr", "new cash with the public"],
         ["≈₹" + fmtIN(finalCr / 26.09) + " cr", "a fortnight — the cadence it is actually observed at"],
         ["≈₹" + fmtIN(finalCr / 365.25) + " cr", "a day, if you flatten the lumps — nobody prints this way"]
        ].forEach(function (r) {
          var row = el("div", "mp-psplit-row");
          row.appendChild(el("span", "mp-psplit-v", r[0]));
          row.appendChild(el("span", "mp-psplit-l", r[1]));
          printedSplit.appendChild(row);
        });
      }
      if (!motionOK) {
        printedEl.textContent = "₹" + fmtIN(finalCr) + " crore";
      } else {
        var t0 = null, DUR = 1700;
        var roll = function (ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / DUR);
          printedEl.textContent = "₹" + fmtIN(finalCr * (1 - Math.pow(1 - p, 3))) + " crore";
          if (p < 1) requestAnimationFrame(roll);
        };
        requestAnimationFrame(roll);
      }
    }
  })();

  /* ── 2 · The dial — money ÷ GDP, in the neon-cluster language ──
     The page's ONLY gauge now. Scale 60–100% of GDP: the needle is where we
     are (90.3), the pips are where we have been, the bright sweep is the
     distance travelled in one year. Red past 88 — territory a 7%-growth
     economy has no business visiting. */
  (function () {
    var host = root.querySelector("[data-mp-dial]"); if (!host || !D.ratio) return;
    var MIN = 60, MAX = 100, W = 340, H = 244, cx = W / 2, cy = 136, R = 100;
    function ang(v) { return (210 - 240 * (v - MIN) / (MAX - MIN)) * Math.PI / 180; }
    function pt(v, r) { var a = ang(v); return [(cx + r * Math.cos(a)).toFixed(1), (cy - r * Math.sin(a)).toFixed(1)]; }
    function arc(v0, v1, r, cls, extra) {
      var p0 = pt(v0, r), p1 = pt(v1, r), large = (v1 - v0) / (MAX - MIN) * 240 > 180 ? 1 : 0;
      return '<path class="' + cls + '" ' + (extra || "") + ' fill="none" d="M ' + p0[0] + " " + p0[1] + " A " + r + " " + r + " 0 " + large + ' 1 ' + p1[0] + " " + p1[1] + '"/>';
    }
    var now = D.ratio.now, was = D.ratio.year_ago;
    var s2 = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Money supply as a share of GDP: ' + now + ' per cent">';
    /* the band */
    s2 += arc(MIN, MAX, R, "mp-g-ring mp-g-glow", 'stroke-width="8"') + arc(MIN, MAX, R, "mp-g-ring", 'stroke-width="1.6"');
    s2 += arc(88, MAX, R, "mp-g-danger mp-g-glow", 'stroke-width="8"') + arc(88, MAX, R, "mp-g-danger", 'stroke-width="2.6"');
    /* ticks INSIDE the band; numerals OUTSIDE it (the cluster convention) —
       so the needle can never collide with a numeral */
    for (var t = MIN; t <= MAX + 1e-9; t += 2) {
      var major = Math.abs(t % 10) < 1e-9;
      var q1 = pt(t, R - (major ? 16 : 8)), q2 = pt(t, R - 2);
      s2 += '<line x1="' + q1[0] + '" y1="' + q1[1] + '" x2="' + q2[0] + '" y2="' + q2[1] + '" class="mp-g-tick' + (major ? " is-major" : "") + (t >= 88 ? " is-danger" : "") + '" stroke-width="' + (major ? 2.6 : 1.1) + '"/>';
      if (major) { var ql = pt(t, R + 19); s2 += '<text x="' + ql[0] + '" y="' + (parseFloat(ql[1]) + 4.5) + '" class="mp-g-num' + (t >= 88 ? " is-danger" : "") + '" text-anchor="middle">' + t + "</text>"; }
    }
    /* where we have been — small pips inside the band, named in the legend below */
    (D.ratio.markers || []).forEach(function (m) {
      if (m.v < MIN || m.v > MAX) return;
      var m1 = pt(m.v, R - 30), m2 = pt(m.v, R - 21);
      s2 += '<line x1="' + m1[0] + '" y1="' + m1[1] + '" x2="' + m2[0] + '" y2="' + m2[1] + '" class="mp-g-mark"><title>' + m.label + " · " + m.v + '%</title></line>';
    });
    /* the year travelled — its own inner ring, clear of ticks and numerals */
    s2 += arc(was, now, R - 40, "mp-g-travel", 'stroke-width="4"');
    /* needle stops short of the tick ring */
    var n = pt(now, R - 18), tail = pt(now - 14, 15);
    s2 += '<line x1="' + tail[0] + '" y1="' + tail[1] + '" x2="' + n[0] + '" y2="' + n[1] + '" class="mp-g-needle"/>';
    s2 += '<circle cx="' + cx + '" cy="' + cy + '" r="9" class="mp-g-hubring"/><circle cx="' + cx + '" cy="' + cy + '" r="3.6" class="mp-g-hub"/>';
    s2 += '<rect x="' + (cx - 46) + '" y="' + (cy + 26) + '" width="92" height="28" rx="6" class="mp-g-odo"/>';
    s2 += '<text x="' + cx + '" y="' + (cy + 46) + '" class="mp-g-odo-t" text-anchor="middle">' + now.toFixed(1) + '%</text>';
    s2 += '<text x="' + cx + '" y="' + (cy + 68) + '" class="mp-g-unit" text-anchor="middle">MONEY \u00F7 GDP</text>';
    s2 += '<text x="' + cx + '" y="' + (cy + 84) + '" class="mp-g-sub2" text-anchor="middle">' + was.toFixed(1) + '% a year ago \u00B7 +' + (now - was).toFixed(1) + ' points</text>';
    s2 += "</svg>";
    host.innerHTML = s2;
    var fn = root.querySelector("[data-mp-dial-note]");
    if (fn) fn.textContent = (D.ratio.footnote || "").replace(/^\*/, "");
    var legend = root.querySelector("[data-mp-dial-legend]");
    if (legend) legend.innerHTML = (D.ratio.markers || []).slice().sort(function (a, b) {
      return a.v - b.v;   /* numeric order = left-to-right order on the dial */
    }).map(function (m) {
      return "<span><b>" + m.v + "</b> " + m.label + "</span>";
    }).join("");
  })();

  /* ── 3 · The printer (brrr) ────────────────────────────────── */
  (function () {
    var stage = root.querySelector("[data-mp-stage]"); if (!stage) return;
    var opEl = root.querySelector("[data-mp-operator]");
    var lineEl = root.querySelector("[data-mp-eraline]");
    var rateEl = root.querySelector("[data-mp-erarate]");
    var chips = root.querySelectorAll("[data-mp-era]");
    var tray = stage.querySelector(".mp-tray");
    var eras = {}; (D.eras || []).forEach(function (e) { eras[e.id] = e; });
    var cur = null, timer = null;

    /* The rig: an animated printer spitting era-correct banknotes. (The Powell
       GIF is the section hero above; this machine is the working model.)
       Notes: ₹500 stone-grey / ₹2000 magenta for the modern eras, the OLD
       ₹500/₹1000 in washed-out grey for demonetisation (they rise back into
       the slot), $100s for the Fed. Plate + screen text come from the era. */
    var plateEl = stage.querySelector("[data-mp-plate]");
    var screenEl = stage.querySelector("[data-mp-screen]");
    /* the press: real printing/counting footage per era (Harsh's clips),
       playbackRate = the era's pace relative to today */
    var pressEl = stage.querySelector("[data-mp-press]");
    var pressTag = stage.querySelector("[data-mp-press-tag]");
    var pressSpeed = stage.querySelector("[data-mp-press-speed]");
    var vidBase = stage.getAttribute("data-mp-video-base") || "/assets/video/";
    if (pressEl) pressEl.addEventListener("loadeddata", function () {
      if (cur && cur.press_speed) pressEl.playbackRate = cur.press_speed;
    });
    function noteSpec(era) {
      if (era.currency === "$") return { cls: "mp-note--usd", den: "100", face: "$100" };
      if (era.rate_lps < 0) {
        return Math.random() < 0.5
          ? { cls: "mp-note--old", den: "500", face: "₹500" }
          : { cls: "mp-note--old", den: "1000", face: "₹1000" };
      }
      return Math.random() < 0.5
        ? { cls: "mp-note--n500", den: "500", face: "₹500" }
        : { cls: "mp-note--n2000", den: "2000", face: "₹2000" };
    }
    function spit(era) {
      if (!tray) return;
      var spec = noteSpec(era);
      var n = el("div", "mp-note " + spec.cls + (era.rate_lps < 0 ? " mp-note-rev" : ""),
        '<span class="mp-note-wm"></span><span class="mp-note-face">' + spec.face + "</span>");
      n.setAttribute("data-den", spec.den);
      n.style.left = (8 + Math.random() * 60) + "%";
      n.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
      n.style.setProperty("--spin", (Math.random() * 200 - 100) + "deg");
      tray.appendChild(n);
      setTimeout(function () { n.remove(); }, 1900);
    }
    function setEra(id) {
      var era = eras[id]; if (!era) return;
      cur = era;
      chips.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mp-era") === id)); });
      if (opEl) opEl.textContent = era.operator + " · " + era.span;
      if (lineEl) lineEl.textContent = era.line;
      if (plateEl) plateEl.textContent = era.plate || era.operator;
      if (screenEl) screenEl.textContent = era.screen || "BRRR";
      if (pressEl && era.press) {
        var want = vidBase + era.press;
        if (pressEl.getAttribute("data-src-now") !== want) {
          pressEl.setAttribute("data-src-now", want);
          /* poster first: the stage paints instantly even while (or if ever) the
             media pipeline dawdles — same basename, .jpg */
          pressEl.poster = want.replace(/\.mp4$/, ".jpg");
          pressEl.src = want;
        }
        pressEl.playbackRate = era.press_speed || 1;
        var pp = pressEl.play(); if (pp && pp.catch) pp.catch(function () {});
      }
      if (pressTag) pressTag.textContent = era.press_tag || "";
      if (pressSpeed) pressSpeed.textContent = era.screen || "";
      var abs = Math.abs(era.rate_lps);
      if (rateEl) rateEl.innerHTML = (era.rate_lps < 0 ? "−" : "+") +
        (era.currency === "$"
          ? "₹" + (abs / 100).toFixed(1) + " crore of rupee-equivalent per second"
          : "₹" + abs.toFixed(1) + " lakh per second");
      stage.classList.toggle("is-reverse", era.rate_lps < 0);
      stage.classList.toggle("is-usd", era.currency === "$");
      if (timer) { clearInterval(timer); timer = null; }
      if (tray) {
        /* one note ≈ every 900ms at ₹6.5 lakh/s, scaled log-ish, floor 90ms */
        var iv = Math.max(90, 900 * 6.5 / Math.max(abs, 0.5));
        timer = setInterval(function () { spit(cur); }, iv);
      }
    }
    chips.forEach(function (b) {
      b.addEventListener("click", function () { setEra(b.getAttribute("data-mp-era")); });
    });
    var def = (D.eras || []).filter(function (e) { return e.default; })[0] || (D.eras || [])[0];
    if (def) setEra(def.id);
    /* be polite to batteries when the tab is hidden */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (timer) { clearInterval(timer); timer = null; }
        if (pressEl) pressEl.pause();
      } else if (cur) {
        setEra(cur.id); /* restarts the press (and the tray rig, if one exists) */
      }
    });
  })();

  /* ── 4 · Chart + date-range filter + ledger ───────────────── */
  (function () {
    var chartHost = root.querySelector("[data-mp-chart]"); if (!chartHost) return;
    var tabs = root.querySelectorAll("[data-mp-series]");
    var eraBtns = root.querySelectorAll("[data-mp-range]");
    var fromIn = root.querySelector("[data-mp-from]"), toIn = root.querySelector("[data-mp-to]");
    var sumEl = root.querySelector("[data-mp-rangesum]");
    var ledgerEl = root.querySelector("[data-mp-ledger]");
    var netEl = root.querySelector("[data-mp-net]");

    var META = {
      ratio: { name: "Money ÷ GDP", unit: "%", fmt: function (v) { return v.toFixed(1) + "%"; } },
      cwp: { name: "Currency with the public", unit: "L cr", fmt: function (v) { return lcr(v); } },
      dep: { name: "Deposits with banks", unit: "L cr", fmt: function (v) { return lcr(v, 0); } }
    };
    var state = { series: "ratio", from: parseD("2015-06-01"), to: parseD("2026-08-31") };

    function pts(key) {
      return (D.series[key] || []).map(function (p) { return { t: parseD(p.d), v: p.v, s: p.s }; });
    }
    function interp(arr, t) {
      if (!arr.length) return null;
      if (t <= arr[0].t) return arr[0].v;
      if (t >= arr[arr.length - 1].t) return arr[arr.length - 1].v;
      for (var i = 1; i < arr.length; i++) {
        if (t <= arr[i].t) {
          var a = arr[i - 1], b = arr[i];
          return a.v + (b.v - a.v) * (t - a.t) / (b.t - a.t);
        }
      }
      return arr[arr.length - 1].v;
    }

    function draw() {
      var meta = META[state.series], all = pts(state.series);
      var inR = all.filter(function (p) { return p.t >= state.from && p.t <= state.to; });
      var line = [];
      if (all.length) {
        var lo = Math.max(state.from, all[0].t), hi = Math.min(state.to, all[all.length - 1].t);
        if (hi > lo) for (var i = 0; i <= 60; i++) { var t = lo + (hi - lo) * i / 60; line.push({ t: t, v: interp(all, t) }); }
      }
      var W = 680, H = 240, P = { l: 46, r: 14, t: 16, b: 30 };
      var vs = line.concat(inR).map(function (p) { return p.v; });
      if (!vs.length) {
        chartHost.innerHTML = '<p class="mp-empty">No dots for this series in this window — widen the range, or switch series.</p>';
        if (sumEl) sumEl.textContent = "";
        drawLedger();
        return;
      }
      var vmin = Math.min.apply(null, vs), vmax = Math.max.apply(null, vs);
      var pad = Math.max((vmax - vmin) * 0.14, 0.5); vmin -= pad; vmax += pad;
      function X(t) { return P.l + (W - P.l - P.r) * (t - state.from) / (state.to - state.from); }
      function Y(v) { return P.t + (H - P.t - P.b) * (1 - (v - vmin) / (vmax - vmin)); }
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + meta.name + '">';
      for (var g = 0; g <= 3; g++) {
        var gv = vmin + (vmax - vmin) * g / 3, gy = Y(gv);
        s += '<line x1="' + P.l + '" y1="' + gy + '" x2="' + (W - P.r) + '" y2="' + gy + '" class="mp-grid"/>' +
             '<text x="' + (P.l - 6) + '" y="' + (gy + 3) + '" class="mp-ax" text-anchor="end">' +
             (meta.unit === "%" ? gv.toFixed(0) + "%" : gv.toFixed(0)) + "</text>";
      }
      var yrMs = 31557600000, y0 = new Date(state.from).getFullYear() + 1, y1 = new Date(state.to).getFullYear();
      var step = Math.max(1, Math.ceil((y1 - y0) / 8));
      for (var yy = y0; yy <= y1; yy += step) {
        var tx = X(parseD(yy + "-01-01"));
        if (tx > P.l - 2 && tx < W - P.r + 2) s += '<text x="' + tx + '" y="' + (H - 8) + '" class="mp-ax" text-anchor="middle">' + yy + "</text>";
      }
      if (line.length > 1) {
        s += '<path class="mp-line" d="' + line.map(function (p, i) { return (i ? "L" : "M") + X(p.t).toFixed(1) + " " + Y(p.v).toFixed(1); }).join(" ") + '"/>';
      }
      /* event pins */
      (D.events || []).forEach(function (ev) {
        var t = parseD(ev.date);
        if (t < state.from || t > state.to || !line.length) return;
        var x = X(t);
        s += '<line x1="' + x + '" y1="' + P.t + '" x2="' + x + '" y2="' + (H - P.b) + '" class="mp-pin ' + (ev.kind === "tap" ? "is-tap" : "is-sponge") + '"><title>' + ev.label + "</title></line>";
      });
      inR.forEach(function (p) {
        s += '<circle cx="' + X(p.t) + '" cy="' + Y(p.v) + '" r="4.5" class="mp-dot"><title>' +
          new Date(p.t).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) + " · " + meta.fmt(p.v) + " — " + (p.s || "") + "</title></circle>";
      });
      s += "</svg>";
      chartHost.innerHTML = s;

      /* range summary */
      if (sumEl) {
        var vA = interp(all, Math.max(state.from, all[0].t)), vB = interp(all, Math.min(state.to, all[all.length - 1].t));
        var dDays = Math.max(1, (Math.min(state.to, all[all.length - 1].t) - Math.max(state.from, all[0].t)) / 86400000);
        var delta = vB - vA, sign = delta >= 0 ? "+" : "−";
        if (state.series === "ratio") {
          sumEl.innerHTML = "Over this window: <b>" + vA.toFixed(1) + "% → " + vB.toFixed(1) + "%</b> of GDP (" + sign + Math.abs(delta).toFixed(1) + " points). Dots are sourced; the line is interpolation.";
        } else {
          var perDay = Math.abs(delta) * 1e5 / dDays;
          sumEl.innerHTML = "Over this window: <b>" + meta.fmt(vA) + " → " + meta.fmt(vB) + "</b> (" + sign + lcr(Math.abs(delta)) + "), ≈ <b>₹" + fmtIN(perDay) + " crore a day</b>. Dots are sourced; the line is interpolation.";
        }
      }
      drawLedger();
    }

    function drawLedger() {
      if (!ledgerEl) return;
      var rows = (D.events || []).filter(function (ev) {
        var t = parseD(ev.date); return t >= state.from && t <= state.to;
      }).sort(function (a, b) { return parseD(a.date) - parseD(b.date); });
      var tap = 0, sponge = 0, unq = 0;
      ledgerEl.innerHTML = "";
      rows.forEach(function (ev) {
        if (ev.amt_lcr === null || ev.amt_lcr === undefined) unq++;
        else if (ev.amt_lcr >= 0) tap += ev.amt_lcr; else sponge += ev.amt_lcr;
        var row = el("div", "mp-lrow " + (ev.kind === "tap" ? "is-tap" : "is-sponge"));
        var amt = ev.amt_lcr === null || ev.amt_lcr === undefined ? "?" :
          (ev.approx ? "≈" : "") + (ev.amt_lcr >= 0 ? "+" : "−") + lcr(Math.abs(ev.amt_lcr), 2).replace("₹", "₹");
        row.appendChild(el("p", "mp-ldate", new Date(parseD(ev.date)).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })));
        var body = el("div", "mp-lbody");
        body.appendChild(el("p", "mp-llabel", '<a href="' + ev.src + '" target="_blank" rel="noopener">' + ev.label + "</a>"));
        body.appendChild(el("p", "mp-lnote", ev.note || ""));
        row.appendChild(body);
        row.appendChild(el("p", "mp-lamt", amt));
        ledgerEl.appendChild(row);
      });
      if (!rows.length) ledgerEl.appendChild(el("p", "mp-empty", "No operations recorded in this window."));
      if (netEl) {
        var net = tap + sponge;
        netEl.innerHTML =
          '<span class="is-tap">Tap +' + lcr(tap, 2) + "</span>" +
          '<span class="is-sponge">Sponge −' + lcr(Math.abs(sponge), 2) + "</span>" +
          '<span class="is-net">Net ' + (net >= 0 ? "+" : "−") + lcr(Math.abs(net), 2) + " of primary liquidity</span>" +
          (unq ? '<span class="is-unq">' + unq + " unquantified — see the ledger</span>" : "");
      }
    }

    tabs.forEach(function (b) {
      b.addEventListener("click", function () {
        state.series = b.getAttribute("data-mp-series");
        tabs.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        draw();
      });
    });
    eraBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-mp-range");
        eraBtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        if (id === "all") { state.from = parseD("2015-06-01"); state.to = parseD("2026-08-31"); }
        else {
          var era = (D.eras || []).filter(function (e) { return e.id === id; })[0];
          if (era) {
            /* widen a touch so single-era windows breathe (3 weeks — keeps the
               ledger's era nets aligned with the session-notes models) */
            state.from = parseD(era.from) - 21 * 86400000;
            state.to = parseD(era.to) + 21 * 86400000;
          }
        }
        if (fromIn) fromIn.value = new Date(state.from).toISOString().slice(0, 10);
        if (toIn) toIn.value = new Date(state.to).toISOString().slice(0, 10);
        draw();
      });
    });
    [fromIn, toIn].forEach(function (inp) {
      if (!inp) return;
      inp.addEventListener("change", function () {
        var f = fromIn && fromIn.value ? parseD(fromIn.value) : state.from;
        var t = toIn && toIn.value ? parseD(toIn.value) : state.to;
        if (f < t) { state.from = f; state.to = t; }
        eraBtns.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        draw();
      });
    });
    if (fromIn) fromIn.value = "2015-06-01";
    if (toIn) toIn.value = "2026-08-31";
    draw();
  })();

  /* ── 5 · Next WSS drop (Friday evening) ────────────────────── */
  (function () {
    var elx = root.querySelector("[data-mp-wss]"); if (!elx) return;
    var now = new Date();
    var d = new Date(now); d.setHours(17, 0, 0, 0);
    var add = (5 - d.getDay() + 7) % 7; /* 5 = Friday */
    if (add === 0 && now > d) add = 7;
    d.setDate(d.getDate() + add);
    var days = Math.round((d - now) / 86400000);
    elx.textContent = days === 0 ? "today, ~5pm" : days + (days === 1 ? " day" : " days");
  })();
})();
