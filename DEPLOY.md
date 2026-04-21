# Deployment — from zero to live at genz-economics.com

This is a one-time setup. Once it's done, merging a PR on GitHub → site updates within ~2 minutes.

## 0. What you'll need

- A **GitHub account** (free). Ideally a **GitHub organization** called `genz-economics` — it looks cleaner than a personal account.
- Your **domain** `genz-economics.com` (you've got this).
- About **20 minutes**.

## 1. Create the repository

**Option A — organization repo (recommended).**
1. On GitHub, create a new organization: `genz-economics`.
2. Inside it, create a public repo called `genz-economics.com`.
3. Invite moderators as members with "Write" access.

**Option B — personal repo (quick start).**
- Just create `your-username/genz-economics.com` and upgrade to an org later. Update `repository:` in `_config.yml` + the URLs in `.github/CODEOWNERS` accordingly.

Leave the repo empty (no README, no license) — we're pushing one.

## 2. Push this folder

Open a terminal in this folder (`genz-economics-site/`):

```bash
git init
git add .
git commit -m "Initial commit: site scaffold, docs, stub posts"
git branch -M main
git remote add origin git@github.com:harsharya7021/genz-economics.com.git
git push -u origin main
```

## 3. Turn on GitHub Pages

1. Repo → **Settings** → **Pages**.
2. Under "Build and deployment":
   - **Source**: Deploy from a branch.
   - **Branch**: `main` / `/(root)`.
3. Save. First build takes 1–2 minutes.
4. Your site is now live at `https://genz-economics.github.io/genz-economics.com/`.

## 4. Point the domain

In the same **Settings → Pages** screen:

1. Under **Custom domain**, type `genz-economics.com` and save.
2. GitHub will show the DNS records you need.

Go to your **domain registrar** (where you bought genz-economics.com) and add:

| Type  | Host | Value                 |
|-------|------|-----------------------|
| A     | @    | `185.199.108.153`     |
| A     | @    | `185.199.109.153`     |
| A     | @    | `185.199.110.153`     |
| A     | @    | `185.199.111.153`     |
| CNAME | www  | `genz-economics.github.io` |

DNS propagation is usually minutes, sometimes up to a few hours.

Back in GitHub, once DNS resolves, check **"Enforce HTTPS"**. GitHub provisions a Let's Encrypt cert automatically.

## 5. Import the actual note content

The `_posts/` folder currently has **stub posts** (correct titles and front matter, placeholder bodies). To replace with real content from the Word docs:

```bash
# At the repo root
mkdir source-docs
# Copy all 8 .docx files into source-docs/ (drag-drop works)
bash scripts/import-docs.sh
```

The script preserves the front matter already in each stub and replaces the body with the pandoc-converted content. Images get extracted into `assets/images/<slug>/` automatically.

After running it:

```bash
git add -A
git commit -m "Import: session notes and images"
git push
```

Site rebuilds. Done.

## 6. Protect `main` (optional but recommended)

Repo → Settings → Branches → Add rule for `main`:

- ☑ Require a pull request before merging
- ☑ Require approvals (1 is fine)
- ☑ Require review from Code Owners
- ☑ Dismiss stale approvals on new commits

This enforces the PR flow that makes the "moderated by students" story real.

## 7. Invite moderators

1. Update `MODERATORS.md` — PR to add yourself.
2. Update `.github/CODEOWNERS` — add their GitHub handles.
3. Repo → Settings → Collaborators & teams → Invite with "Write" access.

## Iterating

- Every merged PR to `main` triggers a rebuild automatically. No action needed.
- To preview locally before pushing:
  ```bash
  bundle install
  bundle exec jekyll serve --livereload
  # http://localhost:4000
  ```
- If a build ever fails, the "Actions" tab shows the error log.

## What's NOT here yet (on purpose)

- **Comments.** GitHub Issues is the comment system. If you want inline commenting, look at [giscus](https://giscus.app/) or [utterances](https://utteranc.es/) — both use GitHub Issues as backing store, no database needed.
- **Search.** If the corpus gets big, add [Lunr](https://lunrjs.com/) (client-side, zero infra).
- **Newsletter.** Buttondown or Substack, feeding off the RSS feed (`/feed.xml`).
- **Audio/video.** Separate decision — YouTube unlisted for recordings would be the MVP path.

Keep shipping. The site will get better the moment someone other than you sends a PR.
