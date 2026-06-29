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
