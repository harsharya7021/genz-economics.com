/* The walkthrough — Axiom's Observed-Systems card deck, rebuilt for the
   six features. GSAP ScrollTrigger pins the dark stage; each card flies
   in from the right and lands on a CENTRED pile with a small tilt and
   offset, covering the one before it (each card gets its beat on top
   while the next approaches). After the last card lands, the whole pile
   rides the scroll DOWNWARD and dissolves into the white CTA panel as it
   climbs over the stage.

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
    var count = document.getElementById("stackCount");
    var bar = document.getElementById("stackBar");
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
        onUpdate: function (self) {
          if (bar) bar.style.transform = "scaleX(" + self.progress.toFixed(4) + ")";
          if (count) {
            var idx = Math.max(1, Math.min(n, 1 + Math.floor(self.progress * tl.duration() / seg)));
            count.textContent = "0" + idx + " / 0" + n;
          }
        }
      }
    });

    /* the lead statement steps back once the first card takes the stage */
    tl.to(head, { opacity: 0.28, duration: 0.6, ease: "none" }, 0.55);

    cards.forEach(function (card, i) {
      tl.to(card, {
        x: function () { return slotX(i); },
        y: function () { return slotY(i); },
        rotation: tilt[i % tilt.length],
        duration: 1,
        ease: "power3.out"
      }, i * seg);
    });

    /* dissolve, phase one (still pinned): the finished pile starts to
       give — sinks a touch with the scroll and loosens its grip */
    var tEnd = (n - 1) * seg + 1;
    tl.to(belt, { y: 34, opacity: 0.85, duration: 0.8, ease: "power1.in" }, tEnd + 0.4);
    tl.to({}, { duration: 0.2 }); // short beat, then unpin

    /* dissolve, phase two (unpinned): the pile keeps moving DOWN with the
       scroll and melts away exactly while the white CTA block climbs over
       the stage — the stack dissolves into the CTA */
    gsap.to([belt, head], {
      y: function (i, target) { return target === belt ? 210 : 130; },
      opacity: 0,
      scale: 0.97,
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
    };
  });
})();
