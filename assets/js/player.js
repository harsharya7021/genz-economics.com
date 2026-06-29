/* Listen — audio engine + visualizer + protected video.
   Audio cards carry data-src/title/author/cover/chapters; the dock plays them.
   Video[data-protected] gets download-deterrence + a drifting watermark.
   NOTE: web pages cannot block screenshots; this only deters downloading. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (s) {
    if (isNaN(s) || s == null) return "0:00";
    s = Math.floor(s); var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (x < 10 ? "0" : "") + x;
  };

  /* ---------- AUDIO DOCK ---------- */
  var dock = $("#nowPlaying");
  if (dock) {
    var audio = $("#npAudio"), cover = $("#npCover"), tEl = $("#npTitle"), aEl = $("#npAuthor"),
        playBtn = $("#npPlay"), seek = $("#npSeek"), curEl = $("#npCur"), durEl = $("#npDur"),
        rate = $("#npRate"), rateOut = $("#npRateOut"), chapWrap = $("#npChapters"),
        canvas = $("#npViz"), prevBtn = $("#npPrev"), nextBtn = $("#npNext");
    var items = $$("[data-audio-item]"), idx = -1, chapters = [], actx = null, analyser = null, raf = null;

    function color(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#20307F"; }
    function initAudioGraph() {
      if (actx) return;
      try {
        actx = new (window.AudioContext || window.webkitAudioContext)();
        var src = actx.createMediaElementSource(audio);
        analyser = actx.createAnalyser(); analyser.fftSize = 128;
        src.connect(analyser); analyser.connect(actx.destination);
      } catch (e) { analyser = null; }
    }
    function drawViz() {
      if (!canvas) return;
      var ctx = canvas.getContext("2d"), w = canvas.width = canvas.offsetWidth, h = canvas.height = canvas.offsetHeight;
      function frame() {
        raf = requestAnimationFrame(frame);
        ctx.clearRect(0, 0, w, h);
        var n = 36, accent = color("--accent"), gold = color("--gold");
        var data = null;
        if (analyser) { data = new Uint8Array(analyser.frequencyBinCount); analyser.getByteFrequencyData(data); }
        for (var i = 0; i < n; i++) {
          var v = data ? data[i] / 255 : (audio.paused ? 0.06 : (0.2 + 0.18 * Math.abs(Math.sin(Date.now() / 240 + i)))) ;
          var bh = Math.max(2, v * h);
          ctx.fillStyle = i % 3 === 0 ? gold : accent;
          var bw = w / n;
          ctx.fillRect(i * bw + 1, (h - bh) / 2, bw - 2, bh);
        }
      }
      cancelAnimationFrame(raf); frame();
    }
    function renderChapters() {
      if (!chapWrap) return;
      if (!chapters.length) { chapWrap.innerHTML = '<p class="np-nochap">No chapters for this title.</p>'; return; }
      chapWrap.innerHTML = chapters.map(function (c, i) {
        return '<button type="button" class="np-chap" data-ci="' + i + '"><span class="np-chap-t">' + fmt(c.t) + '</span><span>' + c.label + '</span></button>';
      }).join("");
      $$(".np-chap", chapWrap).forEach(function (b) {
        b.addEventListener("click", function () { audio.currentTime = chapters[+b.getAttribute("data-ci")].t; audio.play(); });
      });
    }
    function highlightChapter() {
      if (!chapters.length) return;
      var ct = audio.currentTime, active = 0;
      for (var i = 0; i < chapters.length; i++) if (ct >= chapters[i].t) active = i;
      $$(".np-chap", chapWrap).forEach(function (b, i) { b.classList.toggle("on", i === active); });
    }
    function load(i, autoplay) {
      var el = items[i]; if (!el) return;
      idx = i;
      var src = el.getAttribute("data-src");
      tEl.textContent = el.getAttribute("data-title") || "Untitled";
      aEl.textContent = el.getAttribute("data-author") || "";
      if (cover) cover.style.background = "linear-gradient(135deg," + (el.getAttribute("data-cover") || "#20307F") + ",#0c1130)";
      try { chapters = JSON.parse(el.getAttribute("data-chapters") || "[]"); } catch (e) { chapters = []; }
      renderChapters();
      dock.classList.add("active");
      $$("[data-audio-item]").forEach(function (x) { x.classList.remove("playing"); });
      el.classList.add("playing");
      if (!src) { dock.classList.add("empty"); tEl.textContent += " — (no audio file yet)"; audio.removeAttribute("src"); return; }
      dock.classList.remove("empty");
      audio.src = src;
      if (autoplay !== false) { initAudioGraph(); if (actx && actx.state === "suspended") actx.resume(); audio.play(); }
    }
    $$("[data-audio-item]").forEach(function (el, i) {
      var btn = el.querySelector("[data-audio-play]") || el;
      btn.addEventListener("click", function (e) { e.preventDefault(); load(i); });
    });
    playBtn && playBtn.addEventListener("click", function () {
      if (idx < 0) { load(0); return; }
      initAudioGraph(); if (actx && actx.state === "suspended") actx.resume();
      if (audio.paused) audio.play(); else audio.pause();
    });
    prevBtn && prevBtn.addEventListener("click", function () { load(Math.max(0, idx - 1)); });
    nextBtn && nextBtn.addEventListener("click", function () { load(Math.min(items.length - 1, idx + 1)); });
    audio.addEventListener("play", function () { playBtn.classList.add("on"); playBtn.setAttribute("aria-label", "Pause"); drawViz(); });
    audio.addEventListener("pause", function () { playBtn.classList.remove("on"); playBtn.setAttribute("aria-label", "Play"); });
    audio.addEventListener("ended", function () { if (idx < items.length - 1) load(idx + 1); });
    audio.addEventListener("loadedmetadata", function () { durEl.textContent = fmt(audio.duration); seek.max = audio.duration || 0; });
    audio.addEventListener("timeupdate", function () {
      curEl.textContent = fmt(audio.currentTime); if (!seek.matches(":active")) seek.value = audio.currentTime;
      highlightChapter();
    });
    seek && seek.addEventListener("input", function () { audio.currentTime = +seek.value; });
    if (rate) rate.addEventListener("input", function () { audio.playbackRate = +rate.value; if (rateOut) rateOut.textContent = (+rate.value).toFixed(2).replace(/0$/, "") + "×"; });
  }

  /* ---------- PROTECTED VIDEO ---------- */
  $$("video[data-protected]").forEach(function (v) {
    v.setAttribute("controlsList", "nodownload noplaybackrate noremoteplayback");
    v.disablePictureInPicture = true;
    v.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    var stage = v.closest("[data-video-stage]") || v.parentElement;
    if (stage && !stage.querySelector(".wm")) {
      var wm = document.createElement("div"); wm.className = "wm";
      wm.textContent = v.getAttribute("data-watermark") || "Gen Z Economics";
      stage.appendChild(wm);
      setInterval(function () { wm.style.left = (8 + Math.random() * 64) + "%"; wm.style.top = (10 + Math.random() * 72) + "%"; }, 4000);
    }
    var list = document.querySelector(v.getAttribute("data-chapters-list") || "");
    var chs = []; try { chs = JSON.parse(v.getAttribute("data-chapters") || "[]"); } catch (e) {}
    if (list && chs.length) {
      list.innerHTML = chs.map(function (c, i) { return '<button type="button" class="np-chap" data-vt="' + c.t + '"><span class="np-chap-t">' + fmt(c.t) + '</span><span>' + c.label + '</span></button>'; }).join("");
      list.querySelectorAll(".np-chap").forEach(function (b) { b.addEventListener("click", function () { v.currentTime = +b.getAttribute("data-vt"); v.play(); }); });
    }
  });
  if ($("video[data-protected]")) {
    document.addEventListener("keydown", function (e) {
      var k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === "s" || k === "u")) e.preventDefault();
    });
  }
})();
