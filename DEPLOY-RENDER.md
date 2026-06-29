# Deploy on Render (and why no VPS)

**No VPS needed.** This is a static Jekyll site (plain HTML/CSS/JS after build) +
Firebase (serverless) for comments. Nothing runs a server. Render's free
**Static Site** is ideal for prototyping; migrating later is trivial.

## 0. Commit & push your changes
From the repo:
```
git add -A
git commit -m "Reskin + Listen/Study/Macro/Quiz/Daily/Glossary + comments scaffold"
git push origin main
```

## 1. Deploy — pick one

**A. Dashboard (simplest)**
1. https://dashboard.render.com → **New +** → **Static Site**.
2. Connect GitHub and pick `harsharya7021/genz-economics.com`.
3. Settings:
   - **Build Command:** `bundle exec jekyll build`
   - **Publish Directory:** `_site`
4. **Create Static Site.** First build ~1–2 min → live at `https://<name>.onrender.com`.

**B. Blueprint (one-click, uses render.yaml in this repo)**
1. **New +** → **Blueprint** → select this repo → **Apply**. Done.

Every `git push` to `main` auto-redeploys.

## 2. Turn on comments (Firebase)
After the site is live, add the live URL to Firebase so Google sign-in works:
Firebase console → **Authentication → Settings → Authorized domains** → add
`<name>.onrender.com` (and your custom domain). Full setup: `COMMENTS-SETUP.md`.

## 3. Custom domain (optional)
Render → your site → **Settings → Custom Domains** → add `genz-economics.com` →
follow the DNS instructions (a CNAME/ALIAS to Render). TLS is automatic.
(The repo's `CNAME` file is for GitHub Pages and is harmless on Render.)

## 4. Migrating later — zero lock-in
It's a static site, so any of these work with the **same** build command
(`bundle exec jekyll build`) and publish dir (`_site`):
- **GitHub Pages** — already wired (the `CNAME` + repo are set up); just enable Pages.
- **Netlify / Cloudflare Pages** — point at the repo, same build settings.
- Your own infra later, only if the heavy backend (uploads, DRM, bot) demands it —
  and even then, managed services usually beat a raw VPS.
