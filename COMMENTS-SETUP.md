# Comments & Gmail sign-in (Firebase) — setup

Comments and Google (Gmail) login run on Firebase. Until you add your keys the
site shows a friendly placeholder; everything else works. ~10 minutes:

1. **Create a project** at https://console.firebase.google.com → Add project.
2. **Register a Web app** (the `</>` icon). Copy the `firebaseConfig` object.
3. Paste it into **`assets/js/firebase-config.js`** (replace the empty `window.GZE_FIREBASE`).
4. **Authentication → Sign-in method → enable Google.** Under *Settings →
   Authorized domains*, add `genz-economics.com` (and `localhost` for testing).
5. **Firestore Database → Create database** (Production mode). A `comments`
   collection is created automatically on the first post.
6. **Firestore rules** — paste these (anyone can read; only signed-in users can
   post; authors can delete their own):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{db}/documents {
       match /comments/{id} {
         allow read: if true;
         allow create: if request.auth != null
           && request.resource.data.uid == request.auth.uid
           && request.resource.data.text is string
           && request.resource.data.text.size() < 2000;
         allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
       }
     }
   }
   ```

That's it — sign-in, threaded comments, and the daily-question discussions go live.
Each day's question is its own thread, so the archive keeps every past discussion.

---

## Rules now live in the repo, not the console

The block above is kept for history. **`firestore.rules` in this repo is the source
of truth**, and it holds every collection the site uses — `comments` *and*
`wage_watch`. This matters because **Firestore replaces the entire ruleset on each
deploy**: pasting one collection's block into the console silently deletes the
others, which is how comments would quietly stop accepting posts.

Edit `firestore.rules`, then **double-click `deploy-firestore-rules.command`**. It
lists the collections it is about to cover, asks for confirmation, and deploys. No
CLI? The script prints the console URL — paste the file's whole contents there.

### The Wage Watch collection

`wage_watch` is a **write-only letterbox**: create is allowed, read/update/delete
are all denied to clients. Two deliberate properties:

- **Signed-in to write.** The web apiKey and project id are public by design, so an
  unauthenticated create rule would let anyone on the internet write to the
  collection. Auth keeps it to people already through the site's gate.
- **Anonymous once written.** The rule's `hasOnly()` allow-list contains no `uid`,
  `name` or `email` — so a submission carrying identity is *rejected by the
  database*. The page promises "no name, no email, no account id stored, ever";
  this is what makes that promise enforceable rather than merely stated. Even a bug
  in `wage-watch.js` could not write an identifier.

Exports run from the Firebase console or the Admin SDK, never from the browser.
