/* UPSC question bank — MCQ quiz + descriptive discussion, with topic/year filters.
   Reads #upsc-mcq-data and #upsc-desc-data. Exposes window.__qb for testing. */
(function () {
  "use strict";
  function parse(id) { var el = document.getElementById(id); if (!el) return []; try { return JSON.parse(el.textContent) || []; } catch (e) { return []; } }
  var mcq = parse("upsc-mcq-data"), desc = parse("upsc-desc-data").concat(parse("upsc-opt-data"));

  function filterItems(items, topic, year) {
    return items.filter(function (q) {
      return (topic === "all" || q.topic === topic) && (year === "all" || String(q.year) === String(year));
    });
  }
  window.__qb = { filterItems: filterItems };

  if (!document.getElementById("qbApp")) return;

  var topicSel = document.getElementById("qbTopic"), yearSel = document.getElementById("qbYear");
  var topics = {}, years = {};
  mcq.concat(desc).forEach(function (q) { if (q.topic) topics[q.topic] = 1; if (q.year) years[q.year] = 1; });
  function fill(sel, vals, label) {
    if (!sel) return;
    sel.innerHTML = '<option value="all">All ' + label + "</option>" +
      vals.map(function (v) { return '<option value="' + v + '">' + v + "</option>"; }).join("");
  }
  fill(topicSel, Object.keys(topics).sort(), "topics");
  fill(yearSel, Object.keys(years).sort(function (a, b) { return b - a; }), "years");

  /* ---- MODE TABS ---- */
  var quizSec = document.getElementById("qbQuiz"), discSec = document.getElementById("qbDisc");
  document.querySelectorAll("[data-qb-mode]").forEach(function (b) {
    b.addEventListener("click", function () {
      var m = b.getAttribute("data-qb-mode");
      document.querySelectorAll("[data-qb-mode]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      if (quizSec) quizSec.style.display = m === "quiz" ? "" : "none";
      if (discSec) discSec.style.display = m === "discuss" ? "" : "none";
    });
  });

  /* ---- QUIZ ---- */
  var pool = [], qi = 0, score = 0, answered = 0;
  var qNum = document.getElementById("qbNum"), qText = document.getElementById("qbQ"),
      qOpts = document.getElementById("qbOptions"), qMeta = document.getElementById("qbMeta"),
      qFeed = document.getElementById("qbFeedback"), qNext = document.getElementById("qbNext"),
      qScore = document.getElementById("qbScore");

  function startQuiz() {
    pool = filterItems(mcq, topicSel ? topicSel.value : "all", yearSel ? yearSel.value : "all").slice();
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    qi = 0; score = 0; answered = 0; renderQ();
  }
  function renderQ() {
    if (!qText) return;
    if (!pool.length) { qText.textContent = "No questions match this filter."; qOpts.innerHTML = ""; qMeta.textContent = ""; qNum.textContent = ""; qFeed.textContent = ""; qNext.style.display = "none"; return; }
    var q = pool[qi];
    qNum.textContent = "Q" + (qi + 1) + " / " + pool.length;
    qText.textContent = q.q;
    qMeta.textContent = [q.year, q.topic].filter(Boolean).join(" · ");
    qFeed.textContent = ""; qFeed.className = "qb-feedback"; qNext.style.display = "none";
    qOpts.innerHTML = "";
    q.options.forEach(function (opt, i) {
      var b = document.createElement("button");
      b.className = "qb-opt"; b.type = "button";
      b.innerHTML = '<span class="qb-key">' + String.fromCharCode(65 + i) + "</span> " + opt;
      b.addEventListener("click", function () { choose(i, q, b); });
      qOpts.appendChild(b);
    });
    if (qScore) qScore.textContent = answered ? ("Score " + score + "/" + answered) : "";
  }
  function choose(i, q, btn) {
    if (qOpts.classList.contains("locked")) return;
    qOpts.classList.add("locked");
    answered++;
    var opts = qOpts.querySelectorAll(".qb-opt");
    opts[q.answer].classList.add("correct");
    if (i === q.answer) { score++; qFeed.textContent = "Correct."; qFeed.className = "qb-feedback ok"; }
    else { btn.classList.add("wrong"); qFeed.textContent = "Answer: " + String.fromCharCode(65 + q.answer) + ". " + q.options[q.answer]; qFeed.className = "qb-feedback no"; }
    if (qScore) qScore.textContent = "Score " + score + "/" + answered;
    qNext.style.display = qi < pool.length - 1 ? "" : "none";
    if (qi >= pool.length - 1) { qFeed.textContent += "  Quiz complete — " + score + "/" + answered + "."; }
  }
  qNext && qNext.addEventListener("click", function () { if (qi < pool.length - 1) { qi++; qOpts.classList.remove("locked"); renderQ(); } });

  /* ---- DISCUSSION LIST ---- */
  var discList = document.getElementById("qbDiscList");
  function renderDisc() {
    if (!discList) return;
    var items = filterItems(desc, topicSel ? topicSel.value : "all", yearSel ? yearSel.value : "all");
    discList.innerHTML = items.length ? items.map(function (q) {
      return '<article class="qb-disc-card"><div class="qb-disc-meta">' + [q.paper, q.year, q.topic].filter(Boolean).join(" · ") +
        '</div><p class="qb-disc-q">' + q.q + "</p></article>";
    }).join("") : '<p class="np-nochap">No questions match this filter.</p>';
  }

  function refresh() { startQuiz(); renderDisc(); }
  topicSel && topicSel.addEventListener("change", refresh);
  yearSel && yearSel.addEventListener("change", refresh);
  var restart = document.getElementById("qbRestart");
  restart && restart.addEventListener("click", startQuiz);
  refresh();
})();
