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
   post-sign-in check, shared by every sign-in button on the site. */
window.GZE_ALLOWED_DOMAINS = ["isb.edu"];
window.GZE_emailAllowed = function (email) {
  var allowed = window.GZE_ALLOWED_DOMAINS || [];
  if (!allowed.length) return true;
  email = (email || "").toLowerCase();
  var at = email.lastIndexOf("@");
  return at !== -1 && allowed.indexOf(email.slice(at + 1)) !== -1;
};
