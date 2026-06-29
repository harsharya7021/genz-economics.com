/* Gen Z Economics — site interactions
   theme toggle · reading progress · auto TOC · search/filter · waveform player
   Vanilla, dependency-free, defensive (every block feature-detects its nodes). */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;

  /* ── 1. Theme toggle ─────────────────────────────────────── */
  var toggle = doc.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("gze-theme", next); } catch (e) {}
    });
  }

  /* ── 2. Reading-progress bar (notes only) ────────────────── */
  var bar = doc.getElementById("readbar");
  var body = doc.querySelector(".post-body");
  if (bar && body) {
    var onScroll = function () {
      var r = body.getBoundingClientRect();
      var vh = window.innerHeight || root.clientHeight;
      var total = r.height - vh + 80;
      var done = Math.min(Math.max(-r.top + 80, 0), total);
      bar.style.width = (total > 0 ? (done / total) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ── 3. Auto table of contents + scroll-spy ──────────────── */
  var toc = doc.getElementById("toc");
  if (toc && body) {
    var heads = body.querySelectorAll("h2, h3");
    if (heads.length >= 3) {
      var slug = function (t) {
        return t.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60);
      };
      var seen = {}, items = [];
      var html = '<p class="toc-title">On this page</p><ul>';
      Array.prototype.forEach.call(heads, function (h) {
        if (!h.id) { var s = slug(h.textContent) || "section"; if (seen[s]) s += "-" + (++seen[s]); else seen[s] = 1; h.id = s; }
        var lvl = h.tagName === "H3" ? "lvl-3" : "lvl-2";
        html += '<li class="' + lvl + '"><a href="#' + h.id + '">' + h.textContent + "</a></li>";
        items.push(h);
      });
      html += "</ul>";
      toc.innerHTML = html;
      toc.removeAttribute("hidden");

      var links = toc.querySelectorAll("a");
      var byId = {};
      links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
      if ("IntersectionObserver" in window) {
        var spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              links.forEach(function (a) { a.classList.remove("active"); });
              var act = byId[en.target.id]; if (act) act.classList.add("active");
            }
          });
        }, { rootMargin: "-15% 0px -70% 0px", threshold: 0 });
        items.forEach(function (h) { spy.observe(h); });
      }
      links.forEach(function (a) {
        a.addEventListener("click", function (e) {
          var t = doc.getElementById(a.getAttribute("href").slice(1));
          if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); history.replaceState(null, "", a.getAttribute("href")); }
        });
      });
    }
  }

  /* ── 4. Feed search + tag filter ─────────────────────────── */
  var search = doc.getElementById("feedSearch");
  var list = doc.getElementById("postList");
  var chips = doc.getElementById("filterChips");
  var empty = doc.getElementById("feedEmpty");
  if (list) {
    var cards = Array.prototype.slice.call(list.querySelectorAll(".post-card"));
    var activeTag = "all";
    var apply = function () {
      var q = (search && search.value || "").trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var hay = c.getAttribute("data-search") || c.getAttribute("data-title") || "";
        var tags = c.getAttribute("data-tags") || "";
        var okText = !q || hay.indexOf(q) !== -1;
        var okTag = activeTag === "all" || tags.split(/\s+/).indexOf(activeTag) !== -1;
        var show = okText && okTag;
        c.style.display = show ? "" : "none";
        if (show) shown++;
      });
      if (empty) empty.classList.toggle("show", shown === 0);
    };
    if (search) search.addEventListener("input", apply);
    if (chips) {
      chips.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-filter]"); if (!b) return;
        activeTag = b.getAttribute("data-filter");
        chips.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        apply();
      });
    }
  }

  /* ── 5. Lecture player: transcript + waveform scrubber ───── */
  var hms = function (s) {
    s = Math.max(0, Math.round(s));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    var mm = (h && m < 10) ? "0" + m : "" + m;
    return (h ? h + ":" : "") + mm + ":" + (sec < 10 ? "0" + sec : sec);
  };
  var toSec = function (t) {
    var p = (t || "").split(":").map(Number); if (p.some(isNaN) || !p.length) return 3600;
    return p.reduce(function (a, n) { return a * 60 + n; }, 0);
  };

  Array.prototype.forEach.call(doc.querySelectorAll(".transcript-toggle"), function (btn) {
    var panel = btn.closest(".lecture").querySelector("[data-transcript]");
    btn.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  Array.prototype.forEach.call(doc.querySelectorAll("[data-lecture-player]"), function (pl) {
    var lecture = pl.closest(".lecture");
    if (lecture && lecture.classList.contains("gated")) return; /* playback stays locked */
    var bars = Array.prototype.slice.call(pl.querySelectorAll(".waveform .bar"));
    var wave = pl.querySelector(".waveform");
    var cur = pl.querySelector("[data-time-cur]");
    var durEl = pl.querySelector("[data-time-dur]");
    var playBtn = pl.querySelector(".lec-btn.primary");
    var dur = toSec(durEl && durEl.textContent);
    var pos = 0.22, playing = false, timer = null;
    var paint = function () {
      var k = Math.round(pos * bars.length);
      bars.forEach(function (b, i) { b.classList.toggle("on", i < k); b.classList.remove("cursor"); });
      if (bars[k]) bars[k].classList.add("cursor");
      if (cur) cur.textContent = hms(pos * dur);
      if (wave) wave.setAttribute("aria-valuenow", Math.round(pos * 100));
    };
    var seek = function (x) { var rect = wave.getBoundingClientRect(); pos = Math.min(Math.max((x - rect.left) / rect.width, 0), 1); paint(); };
    if (wave) wave.addEventListener("click", function (e) { seek(e.clientX); });
    bars.forEach(function (b, i) { b.addEventListener("click", function (e) { e.stopPropagation(); pos = i / bars.length; paint(); }); });
    var stop = function () { playing = false; if (timer) clearInterval(timer); timer = null; if (playBtn) playBtn.setAttribute("aria-label", "Play"); };
    if (playBtn) playBtn.addEventListener("click", function () {
      playing = !playing;
      playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
      var ico = playBtn.querySelector("svg");
      if (ico) ico.innerHTML = playing ? '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>' : '<path d="M8 5v14l11-7z"/>';
      if (playing) { timer = setInterval(function () { pos += 1 / (dur / 1); pos += 0.0015; if (pos >= 1) { pos = 1; paint(); stop(); var ic = playBtn.querySelector("svg"); if (ic) ic.innerHTML = '<path d="M8 5v14l11-7z"/>'; return; } paint(); }, 60); }
      else stop();
    });
    paint();
  });
})();

/* Macro Watch — relative countdowns from data-date */
(function () {
  var els = document.querySelectorAll(".when[data-date]");
  if (!els.length) return;
  var today = new Date(); today.setHours(0, 0, 0, 0);
  Array.prototype.forEach.call(els, function (el) {
    var d = new Date(el.getAttribute("data-date") + "T00:00:00");
    if (isNaN(d)) return;
    var days = Math.round((d - today) / 86400000);
    el.classList.remove("soon", "past");
    if (days < 0) { el.textContent = "passed"; el.classList.add("past"); }
    else if (days === 0) { el.textContent = "today"; el.classList.add("soon"); }
    else if (days === 1) { el.textContent = "tomorrow"; el.classList.add("soon"); }
    else if (days <= 14) { el.textContent = "in " + days + " days"; el.classList.add("soon"); }
    else { el.textContent = "in " + days + " days"; }
  });
})();

/* Read-aloud (TTS) via the browser Web Speech API — any [data-tts] cluster.
   Markup: a container with [data-tts]; inside, [data-tts-play], optional
   [data-tts-src] (CSS selector) or [data-tts-text] (textarea), [data-tts-voice]
   (select), [data-tts-rate] (range). */
(function () {
  if (!("speechSynthesis" in window)) {
    document.querySelectorAll("[data-tts]").forEach(function (b) { b.style.display = "none"; });
    return;
  }
  var synth = window.speechSynthesis, voices = [];
  function loadVoices() {
    voices = synth.getVoices();
    document.querySelectorAll("select[data-tts-voice]").forEach(function (sel) {
      if (sel.options.length) return;
      voices.forEach(function (v, i) {
        var o = document.createElement("option"); o.value = i; o.textContent = v.name + " (" + v.lang + ")";
        if (/en[-_]?(IN|GB|US)/i.test(v.lang) && sel.selectedIndex < 0) o.selected = true;
        sel.appendChild(o);
      });
    });
  }
  loadVoices();
  if (typeof synth.onvoiceschanged !== "undefined") synth.onvoiceschanged = loadVoices;

  document.querySelectorAll("[data-tts]").forEach(function (box) {
    var playBtn = box.querySelector("[data-tts-play]");
    if (!playBtn) return;
    var rateEl = box.querySelector("[data-tts-rate]");
    var voiceEl = box.querySelector("select[data-tts-voice]");
    var rateOut = box.querySelector("[data-tts-rateout]");
    if (rateEl && rateOut) rateEl.addEventListener("input", function () { rateOut.textContent = (+rateEl.value).toFixed(1) + "×"; });
    function text() {
      var t = box.getAttribute("data-tts-text");
      if (t) return t;
      var taSel = playBtn.getAttribute("data-tts-text-from");
      if (taSel) { var ta = document.querySelector(taSel); if (ta) return ta.value || ta.textContent; }
      var srcSel = playBtn.getAttribute("data-tts-src");
      if (srcSel) { var el = document.querySelector(srcSel); if (el) return el.textContent; }
      return "";
    }
    function setState(on) {
      playBtn.setAttribute("aria-pressed", on ? "true" : "false");
      var lab = playBtn.querySelector("[data-tts-label]");
      if (lab) lab.textContent = on ? "Stop" : (playBtn.getAttribute("data-tts-idle") || "Listen");
    }
    playBtn.addEventListener("click", function () {
      if (synth.speaking) { synth.cancel(); setState(false); return; }
      var body = (text() || "").trim();
      if (!body) return;
      var u = new SpeechSynthesisUtterance(body.slice(0, 32000));
      if (rateEl) u.rate = +rateEl.value || 1;
      if (voiceEl && voices[+voiceEl.value]) u.voice = voices[+voiceEl.value];
      u.onend = function () { setState(false); };
      synth.cancel(); synth.speak(u); setState(true);
    });
  });
  window.addEventListener("beforeunload", function () { try { synth.cancel(); } catch (e) {} });
})();

/* Daily "question to ponder" — deterministic pick by date from #ponder-data JSON */
(function () {
  var holder = document.getElementById("ponderToday");
  var data = document.getElementById("ponder-data");
  if (!holder || !data) return;
  var list; try { list = JSON.parse(data.textContent); } catch (e) { return; }
  if (!list || !list.length) return;
  var now = new Date();
  var doy = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000);
  holder.textContent = list[doy % list.length];
})();

/* Market sparklines — draw an SVG area+line into svg.spark[data-spark] */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll("svg.spark[data-spark]"), function (svg) {
    var pts; try { pts = JSON.parse(svg.getAttribute("data-spark")); } catch (e) { return; }
    if (!pts || pts.length < 2) return;
    var W = 100, H = 34, min = Math.min.apply(null, pts), max = Math.max.apply(null, pts), rng = (max - min) || 1;
    var step = W / (pts.length - 1);
    var coords = pts.map(function (p, i) { return (i * step).toFixed(1) + "," + (H - ((p - min) / rng) * (H - 5) - 3).toFixed(1); });
    var down = svg.getAttribute("data-dir") === "down";
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("preserveAspectRatio", "none");
    svg.innerHTML =
      '<polygon fill="' + (down ? "var(--mkt-down-soft)" : "var(--mkt-up-soft)") + '" points="0,' + H + " " + coords.join(" ") + " " + W + "," + H + '"/>' +
      '<polyline fill="none" stroke="' + (down ? "var(--mkt-down)" : "var(--mkt-up)") + '" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" points="' + coords.join(" ") + '"/>';
  });
})();

/* Daily UPSC discussion question — deterministic by date from #upsc-daily-data */
(function () {
  var holder = document.getElementById("upscToday");
  var data = document.getElementById("upsc-daily-data");
  if (!holder || !data) return;
  var list; try { list = JSON.parse(data.textContent); } catch (e) { return; }
  if (!list || !list.length) return;
  var now = new Date();
  var doy = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000);
  var item = list[doy % list.length];
  holder.textContent = item.q;
  var meta = document.getElementById("upscTodayMeta");
  if (meta) meta.textContent = [item.paper || "UPSC", item.year, item.topic].filter(Boolean).join(" · ");
})();

/* Daily discussion — today's question + yesterday's revealed answer (by date) */
(function () {
  var data = document.getElementById("daily-data"); var today = document.getElementById("upscToday");
  if (!data || !today) return;
  var list; try { list = JSON.parse(data.textContent); } catch (e) { return; }
  if (!list || !list.length) return;
  var now = new Date();
  var doy = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000);
  var n = list.length, cur = list[((doy % n) + n) % n], prev = list[((((doy - 1) % n) + n) % n)];
  today.textContent = cur.q;
  var m = document.getElementById("upscTodayMeta"); if (m) m.textContent = cur.topic || "";
  var pq = document.getElementById("dailyPrevQ"); if (pq) pq.textContent = prev.q;
  var pa = document.getElementById("dailyPrevA"); if (pa) pa.textContent = prev.model || "";
  var dc = document.querySelector("[data-comments][data-daily]"); if (dc) dc.setAttribute("data-thread", "daily-" + doy);
})();

/* Glossary — live search + category filter */
(function () {
  var list = document.getElementById("glossaryList"); if (!list) return;
  var items = Array.prototype.slice.call(list.querySelectorAll("[data-term]"));
  var search = document.getElementById("glossarySearch"), chips = document.getElementById("glossaryCats");
  var empty = document.getElementById("glossaryEmpty"), activeCat = "all";
  function apply() {
    var q = (search && search.value || "").toLowerCase().trim(), shown = 0;
    items.forEach(function (it) {
      var ok = (!q || (it.getAttribute("data-search") || "").indexOf(q) !== -1) && (activeCat === "all" || it.getAttribute("data-cat") === activeCat);
      it.style.display = ok ? "" : "none"; if (ok) shown++;
    });
    if (empty) empty.style.display = shown ? "none" : "block";
  }
  if (search) search.addEventListener("input", apply);
  if (chips) chips.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-cat]"); if (!b) return;
    activeCat = b.getAttribute("data-cat");
    chips.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
    apply();
  });
})();
