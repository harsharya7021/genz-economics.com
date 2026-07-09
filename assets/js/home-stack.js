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

    /* Lenis — the Axiom glide. Inertia-smoothed native scroll, driven by
       GSAP's ticker so ScrollTrigger and the belt read the same clock.
       Desktop + motion-ok only (we're inside that matchMedia). */
    var lenis = null, lenisRaf = null, anchorGlide = null;
    if (window.Lenis) {
      lenis = new Lenis({ duration: 1.05 });
      lenis.on("scroll", ScrollTrigger.update);
      lenisRaf = function (t) { lenis.raf(t * 1000); };
      gsap.ticker.add(lenisRaf);
      gsap.ticker.lagSmoothing(0);
      /* in-page anchors ride the same glide (the fold's "Find the latest notes") */
      anchorGlide = function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute("href") === "#") return;
        var el = document.querySelector(a.getAttribute("href"));
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -64, duration: 1.2 });
      };
      document.addEventListener("click", anchorGlide);
    }

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
        /* n card-beats of runway + ONE extra viewport: that last viewport is
           the takeover — the pile stays pinned dead-still while the white fold
           (margin-top:-100vh in CSS) rides up over it, Axiom-style. */
        end: function () { return "+=" + Math.round(n * window.innerHeight * 0.75 + window.innerHeight); },
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
            /* the sheet starts rising AT the last card's beat — any snap from
               there on yanks it (Harsh's 2026-07-09 recording). Dead zone
               begins just before the final landing; the pile is still anyway. */
            if (value >= ((n - 1) * seg + 1) / D - 0.01) return value;
            var pts = [0];
            for (var i = 0; i < n; i++) pts.push((i * seg + 1) / D);
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
    var runDur = (n - 1) * seg + 1;

    /* the candlesticks light up faintly, left-to-right, across the whole
       card run — a soft glow sweeping the chart. (The canvas comet/readout
       ambient from 2026-07-08 was reverted same day at Harsh's call: the
       plain sweep reads better and costs nothing.) */
    if (candles.length) {
      gsap.set(candles, { opacity: 0.2 });
      var litState = { p: 0 };
      tl.to(litState, {
        p: 1,
        duration: runDur,
        ease: "none",
        onUpdate: function () {
          var edge = litState.p * (candles.length + 5);
          candles.forEach(function (c, i) {
            var d = edge - i;                        /* how far the sweep has passed this candle */
            c.style.opacity = d <= 0 ? 0.2 : d >= 5 ? 0.85 : 0.2 + (d / 5) * 0.65;
          });
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

    /* Axiom-style exit, now the real thing: the finished pile holds
       perfectly still for the pin's final viewport while the white fold
       (see body.stack-ready .cta-fold in main.css) slides over and buries
       it. Tail duration 2 ≈ one viewport of the belt's scroll length —
       card pacing above is untouched. */
    tl.to({}, { duration: 2 });

    /* Reckless/Inter load after first layout — re-measure once settled */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }

    return function () {
      document.body.classList.remove("stack-ready");
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
      candles.forEach(function (c) { c.style.opacity = ""; });
      if (lenis) {
        document.removeEventListener("click", anchorGlide);
        gsap.ticker.remove(lenisRaf);
        lenis.destroy();
      }
    };
  });
})();
