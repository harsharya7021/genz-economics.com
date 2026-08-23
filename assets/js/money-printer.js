/* The Money Printer — Bloomburger Terminal panel.
   Reads its data from #mp-data (JSON, emitted by Liquid from _data/money-printer.yml).
   Counters are anchored extrapolations (debt-clock convention), not a live feed:
   value(t) = WSS anchor + run-rate × elapsed. Chart lines interpolate between
   sourced dots. Session 19 (23 Aug 2026) is the source of the anchors.
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
    var cards = [];
    (D.counters || []).forEach(function (c) {
      var card = el("div", "mp-card");
      var perSecLakh = c.yoy_lcr * 1e7 / YEAR_S;           /* ₹ lakh per second */
      var perDayCr = c.yoy_lcr * 1e5 / 365.25;             /* ₹ crore per day  */
      card.appendChild(el("p", "mp-k", c.label));
      var big = el("p", "mp-v", "—"); card.appendChild(big);
      card.appendChild(el("p", "mp-rate",
        (c.yoy_lcr >= 0 ? "+" : "−") + "₹" + Math.abs(perSecLakh).toFixed(1) + " lakh / second · ₹" +
        fmtIN(Math.abs(perDayCr)) + " cr a day"));
      card.appendChild(el("p", "mp-sub", c.sub));
      wrap.appendChild(card);
      cards.push({ c: c, big: big });
    });
    /* ── the session odometer: the card beside the GIF ── */
    var sinceV = document.querySelector("[data-mp-since-v]");
    var sessRate = document.querySelector("[data-mp-session-rate]");
    var total = (D.counters || []).filter(function (c) { return c.id === "total"; })[0];
    if (sessRate && total) {
      sessRate.textContent = "+₹" + (total.yoy_lcr * 1e7 / YEAR_S).toFixed(1) + " lakh / second · ₹" +
        fmtIN(total.yoy_lcr * 1e5 / 365.25) + " cr a day";
    }
    /* the speedometer: today's printing speed against the historical dial.
       Range 0–20 ₹ lakh/sec; ₹-era markers from the data; needle = today. */
    (function () {
      var host = document.querySelector("[data-mp-gauge]"); if (!host || !total) return;
      var MIN = 0, MAX = 20, W = 320, H = 168, cx = W / 2, cy = 150, R = 122;
      var A0 = Math.PI * 1.16, A1 = -Math.PI * 0.16; /* ~210° sweep */
      function ang(v) { var f = (v - MIN) / (MAX - MIN); return A0 + (A1 - A0) * f; }
      function pt(v, r) { var a = ang(v); return [(cx + r * Math.cos(a)).toFixed(1), (cy - r * Math.sin(a)).toFixed(1)]; }
      function arc(v0, v1, r, cls) {
        var p0 = pt(v0, r), p1 = pt(v1, r);
        return '<path class="' + cls + '" d="M ' + p0[0] + " " + p0[1] + " A " + r + " " + r + ' 0 0 1 ' + p1[0] + " " + p1[1] + '"/>';
      }
      var now = total.yoy_lcr * 1e7 / YEAR_S; /* 13.0 */
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Printing speed, ₹ lakh per second">';
      s += arc(MIN, MAX, R, "mp-g-track");
      s += arc(MIN, 8, R, "mp-g-seg is-cool") + arc(8, 15, R, "mp-g-seg is-warm") + arc(15, MAX, R, "mp-g-seg is-hot");
      for (var t = MIN; t <= MAX; t += 2.5) {
        var q1 = pt(t, R - 7), q2 = pt(t, R + 6);
        s += '<line x1="' + q1[0] + '" y1="' + q1[1] + '" x2="' + q2[0] + '" y2="' + q2[1] + '" class="mp-g-tick"/>';
        if (t % 5 === 0) { var ql = pt(t, R + 17); s += '<text x="' + ql[0] + '" y="' + ql[1] + '" class="mp-g-lbl" text-anchor="middle">' + t + "</text>"; }
      }
      (D.eras || []).forEach(function (e) {
        if (e.currency !== "₹") return;
        var v = Math.abs(e.rate_lps); if (v > MAX) return;
        var m1 = pt(v, R - 16), m2 = pt(v, R - 4);
        s += '<line x1="' + m1[0] + '" y1="' + m1[1] + '" x2="' + m2[0] + '" y2="' + m2[1] + '" class="mp-g-mark' + (e.rate_lps < 0 ? " is-rev" : "") + '"><title>' + e.name + " · " + (e.rate_lps < 0 ? "−" : "+") + v + " lakh/sec</title></line>";
      });
      var n = pt(now, R - 26);
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + n[0] + '" y2="' + n[1] + '" class="mp-g-needle"/>';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="6" class="mp-g-hub"/>';
      s += '<text x="' + cx + '" y="' + (cy - 22) + '" class="mp-g-big" text-anchor="middle">' + now.toFixed(1) + "</text>";
      s += '<text x="' + cx + '" y="' + (cy - 8) + '" class="mp-g-unit" text-anchor="middle">₹ LAKH / SEC</text>';
      s += "</svg>";
      host.innerHTML = s;
    })();
    function tick() {
      var eYr = (Date.now() - anchorT) / 1000 / YEAR_S;
      cards.forEach(function (o) {
        var vCr = (o.c.v_lcr + o.c.yoy_lcr * eYr) * 1e5;   /* ₹ crore */
        o.big.textContent = "₹" + fmtIN(vCr) + " crore";
      });
      if (sinceV && total) {
        var addCr = total.yoy_lcr * 1e5 * ((Date.now() - openedT) / 1000 / YEAR_S);
        sinceV.textContent = addCr >= 1
          ? "₹" + (addCr < 100 ? addCr.toFixed(2) : fmtIN(addCr)) + " crore"
          : "₹" + (addCr * 100).toFixed(1) + " lakh";
      }
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ── 2 · The 90% dial ──────────────────────────────────────── */
  (function () {
    var host = root.querySelector("[data-mp-dial]"); if (!host || !D.ratio) return;
    var MIN = 60, MAX = 100, W = 340, H = 200, cx = W / 2, cy = 178, R = 148;
    function ang(v) { return Math.PI * (1 - (v - MIN) / (MAX - MIN)); }
    function pt(v, r) { var a = ang(v); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; }
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Money to GDP dial">';
    var a0 = pt(MIN, R), a1 = pt(MAX, R);
    s += '<path d="M ' + a0[0] + " " + a0[1] + " A " + R + " " + R + ' 0 0 1 ' + a1[0] + " " + a1[1] + '" class="mp-dial-track"/>';
    var n0 = pt(D.ratio.year_ago, R), n1 = pt(D.ratio.now, R);
    s += '<path d="M ' + n0[0] + " " + n0[1] + " A " + R + " " + R + ' 0 0 1 ' + n1[0] + " " + n1[1] + '" class="mp-dial-hot"/>';
    (D.ratio.markers || []).forEach(function (m) {
      var p1 = pt(m.v, R - 8), p2 = pt(m.v, R + 8), pl = pt(m.v, R + 24);
      s += '<line x1="' + p1[0] + '" y1="' + p1[1] + '" x2="' + p2[0] + '" y2="' + p2[1] + '" class="mp-dial-tick"/>';
      s += '<text x="' + pl[0] + '" y="' + pl[1] + '" class="mp-dial-lbl" text-anchor="middle">' + m.v + "</text>";
    });
    var np = pt(D.ratio.now, R - 22);
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + np[0] + '" y2="' + np[1] + '" class="mp-dial-needle"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="7" class="mp-dial-hub"/>';
    s += '<text x="' + cx + '" y="' + (cy - 44) + '" class="mp-dial-big" text-anchor="middle">' + D.ratio.now.toFixed(1) + "%</text>";
    s += '<text x="' + cx + '" y="' + (cy - 24) + '" class="mp-dial-cap" text-anchor="middle">money ÷ GDP · was ' + D.ratio.year_ago.toFixed(0) + "% a year ago</text>";
    s += "</svg>";
    host.innerHTML = s;
    var fn = root.querySelector("[data-mp-dial-note]");
    if (fn) fn.textContent = (D.ratio.footnote || "").replace(/^\*/, "");
    var legend = root.querySelector("[data-mp-dial-legend]");
    if (legend) legend.innerHTML = (D.ratio.markers || []).map(function (m) {
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
