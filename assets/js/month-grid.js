/* Compact month grid (LMS-rail pattern): dots on publication dates, click a day
   to see what drops. Feed: JSON script tag #cal-week-data or #mpc-data (ifs-calendar events).
   Mount: any <div data-month-grid>. */
(function () {
  "use strict";
  var mounts = document.querySelectorAll("[data-month-grid]");
  if (!mounts.length) return;
  var src = document.getElementById("cal-week-data") || document.getElementById("mpc-data") || document.getElementById("cal-events-data");
  if (!src) return;
  var events; try { events = JSON.parse(src.textContent); } catch (e) { return; }
  var byDate = {};
  events.forEach(function (e) { (byDate[e.date] = byDate[e.date] || []).push(e); });
  var DOW = ["M", "T", "W", "T", "F", "S", "S"];
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  mounts.forEach(function (mount) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var cur = new Date(today.getFullYear(), today.getMonth(), 1);
    var el = document.createElement("div"); el.className = "mgrid";
    mount.appendChild(el);

    function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

    function draw() {
      var y = cur.getFullYear(), m = cur.getMonth();
      var first = new Date(y, m, 1), startDow = (first.getDay() + 6) % 7; // Monday-first
      var days = new Date(y, m + 1, 0).getDate();
      var html = '<div class="mgrid-head"><p class="mgrid-title">' + MONTHS[m] + " " + y + '</p>' +
        '<div class="mgrid-nav"><button type="button" data-nav="-1" aria-label="Previous month">‹</button><button type="button" data-nav="1" aria-label="Next month">›</button></div></div>' +
        '<div class="mgrid-grid">' + DOW.map(function (d) { return '<span class="mgrid-dow">' + d + "</span>"; }).join("");
      for (var i = 0; i < startDow; i++) html += "<span></span>";
      for (var day = 1; day <= days; day++) {
        var d = new Date(y, m, day), key = iso(d);
        var evs = byDate[key] || [];
        var cls = "mgrid-day" + (evs.length ? " has" : "") + (d.getTime() === today.getTime() ? " today" : "") + (d < today ? " dim" : "");
        var dots = evs.length ? '<span class="mgrid-dots">' + evs.slice(0, 3).map(function (e) { return "<i class='" + e.cat + "'></i>"; }).join("") + "</span>" : "";
        html += '<span class="' + cls + '" data-day="' + key + '" ' + (evs.length ? 'role="button" tabindex="0" aria-label="' + evs.length + ' release(s)"' : "") + ">" + day + dots + "</span>";
      }
      html += '</div><div class="mgrid-out"><p class="none">Tap a dotted day — what drops, and when.</p></div>' +
        '<div class="mgrid-legend"><span><i style="background:var(--accent)"></i>RBI</span><span><i style="background:var(--gold)"></i>data & fiscal</span><span><i style="background:var(--ink-soft)"></i>Fed</span></div>';
      el.innerHTML = html;
      el.querySelectorAll("[data-nav]").forEach(function (b) {
        b.addEventListener("click", function () { cur = new Date(cur.getFullYear(), cur.getMonth() + (+b.getAttribute("data-nav")), 1); draw(); });
      });
      function show(key, dayEl) {
        el.querySelectorAll(".mgrid-day.sel").forEach(function (x) { x.classList.remove("sel"); });
        dayEl.classList.add("sel");
        var out = el.querySelector(".mgrid-out");
        var evs = byDate[key] || [];
        out.innerHTML = evs.map(function (e) {
          return "<p><span>" + (e.time || "") + "</span>" + e.title + "</p>";
        }).join("") || '<p class="none">Nothing scheduled.</p>';
      }
      el.querySelectorAll(".mgrid-day.has").forEach(function (dayEl) {
        dayEl.addEventListener("click", function () { show(dayEl.getAttribute("data-day"), dayEl); });
        dayEl.addEventListener("keydown", function (e) { if (e.key === "Enter") show(dayEl.getAttribute("data-day"), dayEl); });
      });
    }
    draw();
  });
})();
