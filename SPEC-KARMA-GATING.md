# Spec — Gated video · contribute-to-unlock · karma
*(Design agreed 2026-07-03; build = Phase 1–3 work, next session. Nothing here is live yet.)*

## The rule (product policy, one paragraph)
Watching session N+1 requires **either** passing session N's quiz **or** getting an original
submission approved. A submission is the student's own take on the session — any medium:
text, voice note, video, image. Approved submissions are **published on the site as blog
posts** with the student's byline. The gate is engagement, not a fee — same framing as the
login. Karma is the running score of being useful to the room.

## Firestore schema
```
users/{uid}            { name, email, karma: 0, unlocked: ["s1"], role: "student"|"mod" }
sessions/{sid}         { order, title, date, streamId, quizId, notesUrl }
quizzes/{qid}          { sid, questions: [{ q, options: [a,b,c,d] }] }          // public part
quizKeys/{qid}         { answers: ["b","a",...], passMark: 0.7 }               // NEVER client-readable
attempts/{uid_qid}     { uid, qid, answers, score, passed, ts }                // one doc = one attempt allowed
submissions/{subId}    { uid, sid, type: "text"|"voice"|"video"|"image",
                         storagePath|body, status: "pending"|"approved"|"rejected",
                         modNote, publishedUrl, ts }
karma_ledger/{id}      { uid, delta, reason, ref, ts, by }                     // append-only; users.karma = sum
```

## Unlock mechanics (Cloud Functions, never client-side)
- `submitQuiz(qid, answers)` → grades against `quizKeys` server-side, writes `attempts`,
  on pass: `users.unlocked += next(sid)`, karma +10. One attempt; retry opens after 24h
  (configurable) at half karma.
- `approveSubmission(subId)` (mod-only) → `users.unlocked += next(sid)`, karma +50,
  triggers publish (below).
- **Video tokens**: Stream playback stays signed-URL only (Phase-2 function). The token
  function checks `sid ∈ users.unlocked` before minting. This is what makes the gate real —
  UI hiding is decoration.

## Submission → blog pipeline
1. Client uploads to Storage `submissions/{uid}/{sid}/...` (caps: text 20k chars, audio 20MB,
   video 200MB, image 10MB; mime allowlist).
2. **Originality pre-screen** (function): embed the submission text/transcript with the same
   MiniLM index BIL uses; cosine > 0.92 against existing posts/submissions → flag
   "near-duplicate" for the mod. Claude does a one-shot read for AI-slop/toxicity → flag only,
   never auto-reject. Human (Harsh/mod) decides. "Unique, original" is a human judgment
   assisted by machines, not outsourced to them.
3. On approve: pipeline writes `_posts/YYYY-MM-DD-student-take-<slug>.md` (byline: student,
   series: cohort-takes; voice/video embedded via Stream/Storage URL; images inlined),
   pushes, sets `publishedUrl`, announces on the group ("This week's cohort takes are up").

## Karma events (ledger reasons)
| event                                   | delta | notes                        |
|-----------------------------------------|-------|------------------------------|
| quiz passed                             | +10   | first attempt only           |
| submission approved                     | +50   | the big one — original work  |
| submission featured by prof             | +100  | prof's pick, manual          |
| discussion post (daily Q / thread)      | +2    | cap +6/day                   |
| reply marked helpful by a mod           | +5    |                              |
| attended live session (Zoom report)     | +5    | pipeline imports participants|
| poll voted                              | +1    | yes, showing up counts       |
Anti-gaming: daily caps above; ledger is append-only and mod-visible; negative deltas
(mod discretion) exist but require a note. Leaderboard page reads top-20 karma; monthly
reset of a "this month" board, lifetime board never resets.

## Security rules (sketch)
- `users`: read own doc; write via functions only. `quizKeys`: no client access, ever.
- `submissions`: create own (status locked to "pending"), read own + approved of others.
- `karma_ledger`: read own entries + aggregate; write via functions only.
- Storage: write own submission path, size/mime validated in rules + function re-check.

## Build order (maps to ARCHITECTURE.md phases)
1. Phase 1 (login wall + user doc on first sign-in) — prerequisite, already specced.
2. `sessions` + Stream signed-token function (Phase 2) — makes video gating real.
3. Quiz flow (author quizzes from session notes — the pipeline can draft them, prof approves).
4. Submissions + mod queue page (simple gated admin list with approve/reject).
5. Publish pipeline + karma ledger + leaderboard.
Estimate: 3–4 focused sessions. Blockers on Harsh: Cloudflare Stream account (open loop #3),
Mailchimp embed (loop #2), and a mod list.
