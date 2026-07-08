/* The walkthrough — Axiom's Observed-Systems card deck, rebuilt for the
   six features. GSAP ScrollTrigger pins the dark stage; each card flies
   in from the right and lands on a CENTRED pile with a small tilt and
   offset, covering the one before it (each card gets its beat on top
   while the next approaches). While the deck plays, the gold trend line
   in the candlestick backdrop draws itself left-to-right with the same
   scroll — a lit dot riding its tip over a dashed drop-line (the chart
   kit's tooltip anatomy). After the last card lands the pile rides the
   scroll DOWNWARD — no fade — and is BURIED behind the white CTA panel
   as it climbs over the stage.

   Desktop-only by design: below 981px, without JS, or with reduced
   motion the CSS sticky pile in main.css takes over. gsap.matchMedia
   reverts everything cleanly if the viewport crosses the boundary. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  var stage = document.querySelector(".stack-stage");
  if (!stage) return;
  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();
  mm.add("(min-width: 981px) and (prefers-reduced-motion: no-preference)", function () {
    document.body.classList.add("stack-ready");

    /* `html { scroll-behavior: smooth }` corrupts ScrollTrigger's pin
       measurements — force auto while the belt is active. */
    var prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    var belt = stage.querySelector(".stack-belt");
    var head = stage.querySelector(".stage-head");
    var cards = gsap.utils.toArray(stage.querySelectorAll(".stack-card"));
    var n = cards.length;
    if (!n) return;

    var tilt = [-2.5, 2, -1.5, 2.5, -2, 1.25]; // per-card resting tilt

    /* centred pile: tiny fanned offsets around dead centre */
    function slotX(i) { return (i - (n - 1) / 2) * 12; }
    function slotY(i) { return (i - (n - 1) / 2) * 9; }

    gsap.set(cards, {
      xPercent: -50, yPercent: -50,
      x: function () { return window.innerWidth; },
      rotation: 5,
      zIndex: function (i) { return i + 1; },
      force3D: true
    });

    var seg = 1.6; // per card: 1 flight + 0.6 on top before the next covers it
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: function () { return "+=" + Math.round(n * window.innerHeight * 0.75); },
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        /* Scroll-back polish: instead of cards free-floating in reverse,
           the belt always settles on a card's resting beat — both
           directions feel deliberate rather than replayed. */
        snap: {
          snapTo: function (value) {
            var D = tl.duration();
            var pts = [0];
            for (var i = 0; i < n; i++) pts.push((i * seg + 1) / D);
            pts.push(1);
            var best = pts[0];
            for (var j = 1; j < pts.length; j++) if (Math.abs(pts[j] - value) < Math.abs(best - value)) best = pts[j];
            return best;
          },
          duration: { min: 0.15, max: 0.45 },
          delay: 0.06,
          ease: "power1.inOut"
        },
      }
    });

    /* the lead statement steps back once the first card takes the stage */
    tl.to(head, { opacity: 0.28, duration: 0.6, ease: "none" }, 0.55);

    /* the progress bar, in finance's native dialect: candles light up
       left-to-right as a soft sweep, and the gold equity curve DRAWS
       itself over them with the scroll — lit dot on the tip, dashed
       drop-line under it. Five milestone rings sit on the curve, one at
       each card's landing beat; the line claims a new all-time high (the
       ring pings on and stays lit) as each feature walks on. Scroll back
       and the highs un-claim — progress is scrubbed, both ways. */
    var candles = gsap.utils.toArray(stage.querySelectorAll(".sc-candle > g"));
    var trend = stage.querySelector(".stage-trend");
    var tipDot = stage.querySelector(".stage-trend-dot");
    var tipDrop = stage.querySelector(".stage-trend-drop");
    var runDur = (n - 1) * seg + 1;
    var trendLen = 0, miles = [], milesWrap = null;

    if (trend) {
      trendLen = trend.getTotalLength();
      var SVGNS = "http://www.w3.org/2000/svg";
      milesWrap = document.createElementNS(SVGNS, "g");
      for (var mi = 0; mi < n; mi++) {
        var frac = (mi * seg + 1) / runDur;          /* the beat card mi lands on */
        var pt = trend.getPointAtLength(frac * trendLen);
        var g = document.createElementNS(SVGNS, "g");
        g.setAttribute("class", "stage-mile");
        var ring = document.createElementNS(SVGNS, "circle");
        ring.setAttribute("cx", pt.x); ring.setAttribute("cy", pt.y); ring.setAttribute("r", "7");
        var core = document.createElementNS(SVGNS, "circle");
        core.setAttribute("class", "stage-mile-core");
        core.setAttribute("cx", pt.x); core.setAttribute("cy", pt.y); core.setAttribute("r", "2.4");
        g.appendChild(ring); g.appendChild(core);
        milesWrap.appendChild(g);
        miles.push({ el: g, frac: frac });
      }
      trend.ownerSVGElement.appendChild(milesWrap);
    }

    /* ── the ambient layer, Axiom-style: a canvas of drifting market dust
       plus a gold particle comet that rides the equity curve's tip, and
       terminal readouts in the stage corners that tick with the scroll ── */
    var flow = document.createElement("canvas");
    flow.className = "stage-flow";
    stage.insertBefore(flow, stage.querySelector(".stack-pin"));
    var fctx = flow.getContext("2d");
    var DPR = Math.min(2, window.devicePixelRatio || 1);
    var fw = 0, fh = 0;
    function fitFlow() {
      var r = stage.getBoundingClientRect();
      fw = Math.max(1, r.width); fh = Math.max(1, r.height);
      flow.width = fw * DPR; flow.height = fh * DPR;
      fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    fitFlow();
    ScrollTrigger.addEventListener("refresh", fitFlow);

    var DUST_COLORS = ["128,237,217", "36,91,255", "244,248,250"];
    var dust = [], DN = 70;
    for (var di = 0; di < DN; di++) {
      dust.push({
        x: Math.random(), y: Math.random(),
        r: .6 + Math.random() * 1.7,
        c: DUST_COLORS[di % 3],
        a: .05 + Math.random() * .16,
        sp: .00008 + Math.random() * .00022,
        ph: Math.random() * Math.PI * 2
      });
    }
    var comet = [];       /* trailing gold sparks behind the curve tip */
    var lastEmitP = 0;

    var readouts = document.createElement("div");
    readouts.className = "stage-readouts";
    readouts.setAttribute("aria-hidden", "true");
    readouts.innerHTML =
      '<span class="sr sr-tl">OBSERVED SYSTEM · THE ROOM<br>SIGNALS 01–05 / STATE: <em>PINNED</em></span>' +
      '<span class="sr sr-tr">PROGRESS <em data-sr-p>000</em> / 100<br>ALL-TIME HIGHS <em data-sr-ath>0</em> / ' + n + '</span>' +
      '<span class="sr sr-bl">EQUITY CURVE · GAINS <i class="sw sw-g"></i> DIPS <i class="sw sw-b"></i></span>' +
      '<span class="sr sr-br">GZE-NAV <em data-sr-nav>1,000</em></span>';
    stage.insertBefore(readouts, stage.querySelector(".stack-pin"));
    var srP = readouts.querySelector("[data-sr-p]");
    var srAth = readouts.querySelector("[data-sr-ath]");
    var srNav = readouts.querySelector("[data-sr-nav]");

    var flowTime = 0;
    function drawFlow() {
      flowTime += .016;
      fctx.clearRect(0, 0, fw, fh);
      fctx.globalCompositeOperation = "lighter";
      /* market dust: slow upward-right drift with a sine wander */
      for (var i2 = 0; i2 < dust.length; i2++) {
        var d2 = dust[i2];
        d2.x += d2.sp * 12; d2.y -= d2.sp * 5;
        if (d2.x > 1.02) d2.x = -.02;
        if (d2.y < -.02) d2.y = 1.02;
        var wob = Math.sin(flowTime * .7 + d2.ph) * 6;
        fctx.beginPath();
        fctx.arc(d2.x * fw, d2.y * fh + wob, d2.r, 0, 6.2832);
        fctx.fillStyle = "rgba(" + d2.c + "," + d2.a + ")";
        fctx.fill();
      }
      /* the comet trail decays */
      for (var i3 = comet.length - 1; i3 >= 0; i3--) {
        var s = comet[i3];
        s.life -= .022; s.x += s.vx; s.y += s.vy; s.vy += .012;
        if (s.life <= 0) { comet.splice(i3, 1); continue; }
        fctx.beginPath();
        fctx.arc(s.x, s.y, s.r * s.life, 0, 6.2832);
        fctx.fillStyle = "rgba(255,216,102," + (.55 * s.life) + ")";
        fctx.fill();
      }
      fctx.globalCompositeOperation = "source-over";
    }
    gsap.ticker.add(drawFlow);

    if (candles.length || trend) {
      gsap.set(candles, { opacity: 0.2 });
      var litState = { p: 0 };
      tl.to(litState, {
        p: 1,
        duration: runDur,
        ease: "none",
        onUpdate: function () {
          var p = litState.p;
          var edge = p * (candles.length + 5);
          candles.forEach(function (c, i) {
            var d = edge - i;                        /* how far the sweep has passed this candle */
            c.style.opacity = d <= 0 ? 0.2 : d >= 5 ? 0.85 : 0.2 + (d / 5) * 0.65;
          });
          var athCount = 0;
          if (trend) {
            trend.style.strokeDashoffset = String(1 - p);
            var tip = trend.getPointAtLength(p * trendLen);
            if (tipDot) { tipDot.setAttribute("cx", tip.x); tipDot.setAttribute("cy", tip.y); tipDot.style.opacity = p > 0.004 ? "1" : "0"; }
            if (tipDrop) { tipDrop.setAttribute("x1", tip.x); tipDrop.setAttribute("x2", tip.x); tipDrop.setAttribute("y1", tip.y); tipDrop.style.opacity = p > 0.004 ? ".7" : "0"; }
            for (var k = 0; k < miles.length; k++) {
              var hit = p >= miles[k].frac - 0.002;
              miles[k].el.classList.toggle("is-hit", hit);
              if (hit) athCount++;
            }
            /* comet: spray gold sparks from the tip while the line advances */
            if (p > 0.004 && Math.abs(p - lastEmitP) > 0.0005) {
              var sx = tip.x / 1000 * fw, sy = tip.y / 300 * fh;
              for (var e2 = 0; e2 < 4; e2++) {
                comet.push({ x: sx, y: sy, vx: -(.4 + Math.random() * 1.4), vy: (Math.random() - .5) * 1.1, r: 1.4 + Math.random() * 2.4, life: .6 + Math.random() * .4 });
              }
              if (comet.length > 220) comet.splice(0, comet.length - 220);
              lastEmitP = p;
            }
          }
          /* corner readouts tick with the scroll */
          if (srP) srP.textContent = String(Math.round(p * 100)).padStart(3, "0");
          if (srAth) srAth.textContent = String(athCount);
          if (srNav) srNav.textContent = (1000 + Math.round(662 * p)).toLocaleString("en-IN");
        }
      }, 0);
    }

    cards.forEach(function (card, i) {
      tl.to(card, {
        x: function () { return slotX(i); },
        y: function () { return slotY(i); },
        rotation: tilt[i % tilt.length],
        duration: 1,
        ease: "power3.out"
      }, i * seg);
    });

    /* burial, phase one (still pinned): the finished pile starts to give —
       sinks with the scroll. No opacity change: the cards stay solid so the
       exit reads as the CTA covering them, not the cards dissolving. */
    var tEnd = (n - 1) * seg + 1;
    tl.to(belt, { y: 34, duration: 0.8, ease: "power1.in" }, tEnd + 0.4);
    tl.to({}, { duration: 0.2 }); // short beat, then unpin

    /* burial, phase two (unpinned): the pile keeps sliding DOWN with the
       scroll at full opacity while the white CTA fold (higher z, opaque,
       rounded shoulder) climbs over it — the cards disappear UNDER the
       CTA's edge, buried, never faded. (.stack-pin's overflow:hidden clips
       them a hair early, but that seam is hidden beneath the fold's
       -44px overlap.) */
    gsap.to([belt, head], {
      y: function (i, target) { return target === belt ? 260 : 150; },
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: ".cta-band.cta-fold",
        start: "top 98%",
        end: "top 30%",
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });

    /* Reckless/Inter load after first layout — re-measure once settled */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }

    return function () {
      document.body.classList.remove("stack-ready");
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
      /* undo the progress-line driving so the CSS no-JS fallback owns it */
      if (milesWrap && milesWrap.parentNode) milesWrap.parentNode.removeChild(milesWrap);
      if (trend) trend.style.strokeDashoffset = "";
      if (tipDot) tipDot.style.opacity = "";
      if (tipDrop) tipDrop.style.opacity = "";
      candles.forEach(function (c) { c.style.opacity = ""; });
      /* tear down the ambient layer */
      gsap.ticker.remove(drawFlow);
      ScrollTrigger.removeEventListener("refresh", fitFlow);
      if (flow.parentNode) flow.parentNode.removeChild(flow);
      if (readouts.parentNode) readouts.parentNode.removeChild(readouts);
    };
  });
})();
