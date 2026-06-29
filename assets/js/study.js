/* Study — flashcards with SM-2-lite spaced repetition (localStorage).
   Reads decks from #flashcard-data JSON. Exposes window.__fc for testing. */
(function () {
  "use strict";
  var DAY = 86400000, KEY = "gze-fc-v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function cid(deck, q) { return (deck + "::" + q).replace(/\s+/g, " ").trim().toLowerCase(); }

  function schedule(st, grade, now) {
    now = now || Date.now();
    st = Object.assign({ ease: 2.5, interval: 0, reps: 0 }, st || {});
    if (grade === "again") {
      st.reps = 0; st.interval = 0; st.ease = Math.max(1.3, st.ease - 0.2); st.due = now + 10 * 60000;
    } else {
      if (grade === "hard") { st.ease = Math.max(1.3, st.ease - 0.15); st.interval = st.interval ? Math.max(1, st.interval * 1.2) : 1; }
      else if (grade === "good") { st.interval = st.interval ? st.interval * st.ease : 1; }
      else if (grade === "easy") { st.ease = st.ease + 0.15; st.interval = (st.interval ? st.interval * st.ease : 2) * 1.3; }
      st.reps = (st.reps || 0) + 1; st.due = now + Math.round(st.interval * DAY);
    }
    st.interval = Math.round(st.interval * 100) / 100;
    return st;
  }
  function queueDue(states, cards, now) {
    now = now || Date.now();
    return cards.filter(function (c) { var s = states[c.id]; return !s || !s.due || s.due <= now; })
                .sort(function (a, b) { var da = (states[a.id] || {}).due || 0, db = (states[b.id] || {}).due || 0; return da - db; });
  }
  window.__fc = { schedule: schedule, queueDue: queueDue, cid: cid };

  var dataEl = document.getElementById("flashcard-data");
  if (!dataEl) return;
  var decks; try { decks = JSON.parse(dataEl.textContent); } catch (e) { return; }
  if (!decks || !decks.length) return;

  var all = [];
  decks.forEach(function (d) { (d.cards || []).forEach(function (c) { all.push({ id: cid(d.deck, c.q), deck: d.deck, q: c.q, a: c.a }); }); });

  var states = load(), activeDeck = "all", queue = [], pos = 0, reviewed = 0, flipped = false;
  var qEl = document.getElementById("fcQ"), aEl = document.getElementById("fcA"),
      showBtn = document.getElementById("fcShow"), grades = document.getElementById("fcGrades"),
      countEl = document.getElementById("fcCount"), deckChips = document.getElementById("fcDecks"),
      stage = document.getElementById("fcStage"), empty = document.getElementById("fcEmpty"),
      deckLabel = document.getElementById("fcDeckLabel");

  function pool() { return activeDeck === "all" ? all : all.filter(function (c) { return c.deck === activeDeck; }); }
  function build() {
    queue = queueDue(states, pool()); pos = 0; reviewed = 0; flipped = false;
    if (!queue.length) { showDone(); } else { render(); }
  }
  function showDone() {
    if (stage) stage.style.display = "none";
    if (grades) grades.style.display = "none";
    if (showBtn) showBtn.style.display = "none";
    if (empty) { empty.style.display = "block"; empty.querySelector("[data-fc-count]") && (empty.querySelector("[data-fc-count]").textContent = reviewed); }
    if (countEl) countEl.textContent = "All caught up";
  }
  function render() {
    if (empty) empty.style.display = "none";
    if (stage) stage.style.display = "";
    var c = queue[pos]; if (!c) return showDone();
    flipped = false;
    qEl.textContent = c.q; aEl.textContent = c.a;
    aEl.classList.remove("show"); if (showBtn) { showBtn.style.display = ""; }
    if (grades) grades.style.display = "none";
    if (deckLabel) deckLabel.textContent = c.deck;
    if (countEl) countEl.textContent = (pos + 1) + " of " + queue.length + " due";
  }
  function reveal() { flipped = true; aEl.classList.add("show"); if (showBtn) showBtn.style.display = "none"; if (grades) grades.style.display = "flex"; }
  function grade(g) {
    var c = queue[pos]; if (!c) return;
    states[c.id] = schedule(states[c.id], g); save(states); reviewed++;
    if (g === "again") queue.push(c); // see it again this session
    pos++;
    if (pos >= queue.length) showDone(); else render();
  }

  showBtn && showBtn.addEventListener("click", reveal);
  if (grades) grades.querySelectorAll("[data-grade]").forEach(function (b) { b.addEventListener("click", function () { grade(b.getAttribute("data-grade")); }); });
  document.addEventListener("keydown", function (e) {
    if (!stage || stage.style.display === "none") return;
    if (e.key === " " && !flipped) { e.preventDefault(); reveal(); }
    else if (flipped && /^[1-4]$/.test(e.key)) { grade(["again", "hard", "good", "easy"][+e.key - 1]); }
  });
  if (deckChips) {
    var names = ["all"].concat(decks.map(function (d) { return d.deck; }));
    deckChips.innerHTML = names.map(function (n) { return '<button type="button" data-deck="' + n + '" aria-pressed="' + (n === "all") + '">' + (n === "all" ? "All decks" : n) + "</button>"; }).join("");
    deckChips.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-deck]"); if (!b) return;
      activeDeck = b.getAttribute("data-deck");
      deckChips.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      build();
    });
  }
  var restart = document.getElementById("fcRestart");
  restart && restart.addEventListener("click", build);
  build();
})();
