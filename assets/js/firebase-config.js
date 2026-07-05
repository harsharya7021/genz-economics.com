/* Firebase web config for Gen Z Economics.
   These values are NOT secret — the web apiKey only identifies the project;
   real security comes from Firestore rules + Authentication "Authorized domains".
   Safe to commit. (Optional hardening: add HTTP-referrer restrictions to this key
   in Google Cloud Console → APIs & Services → Credentials.) */
window.GZE_FIREBASE = {
  apiKey: "AIzaSyDiFmGRjx5HGCqSPA4w4G-_Zn37qaSl724",
  authDomain: "genz-economics.firebaseapp.com",
  projectId: "genz-economics",
  storageBucket: "genz-economics.firebasestorage.app",
  messagingSenderId: "157907058977",
  appId: "1:157907058977:web:025ff35b68caf035137e60",
  measurementId: "G-FQKR6VWLE8"
};

/* Sign-in is ISB-only. Add domains here if alumni/faculty domains open up.
   The `hd` param only *hints* Google's picker — the real gate is this
   post-sign-in check, shared by every sign-in button on the site.
   GZE_ALLOWED_EMAILS = admin exceptions (exact addresses) that get in
   regardless of domain — currently Harsh's own account. */
window.GZE_ALLOWED_DOMAINS = ["isb.edu"];
window.GZE_ALLOWED_EMAILS = ["harsharya7021@gmail.com"];
window.GZE_emailAllowed = function (email) {
  var allowed = window.GZE_ALLOWED_DOMAINS || [];
  if (!allowed.length) return true;
  email = (email || "").toLowerCase();
  if ((window.GZE_ALLOWED_EMAILS || []).indexOf(email) !== -1) return true;
  var at = email.lastIndexOf("@");
  return at !== -1 && allowed.indexOf(email.slice(at + 1)) !== -1;
};

/* Defensive helper: every gate script (site.js, essay.js, bil-widget.js)
   calls this instead of checking `window.GZE_FIREBASE` directly. This file
   is loaded first (see _layouts/default.html) so `cb()` normally runs
   synchronously — but if a future edit ever reorders scripts again, this
   polls briefly instead of silently no-op'ing. That silent no-op is
   exactly what broke every sign-in button outside the homepage on
   2026-07-06: site.js/essay.js ran BEFORE this file (deferred scripts
   execute in strict document order, and site.js's <script> tag sat above
   this one), so `window.GZE_FIREBASE` was still undefined when their gate
   IIFEs ran their `if (!window.GZE_FIREBASE) return;` guard — every
   click handler silently never attached. Never trust load order again. */
window.GZE_onFirebaseReady = function (cb) {
  if (window.GZE_FIREBASE) return cb();
  var tries = 0;
  var iv = setInterval(function () {
    tries++;
    if (window.GZE_FIREBASE) { clearInterval(iv); cb(); }
    else if (tries > 100) { clearInterval(iv); console.error("[gze] GZE_FIREBASE never became available — sign-in cannot wire up."); }
  }, 20);
};
