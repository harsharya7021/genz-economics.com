---
layout: page
title: Drafts (preview)
dek: Internal preview of draft posts. These render with the live site's typography but are excluded from the homepage feed and the RSS. Share this URL only with reviewers.
permalink: /drafts/
sitemap: false
robots: noindex, nofollow
---

<p style="background: var(--paper-2); padding: .9rem 1.1rem; border-radius: 6px; font-size: .92rem; color: var(--ink-soft); margin: 0 0 2rem;">
  <strong>Private preview.</strong> Posts on this page are unpublished. They have working URLs and full styling, but they don't appear on the homepage, in the RSS feed, or to search engines. To officially publish a draft, remove the <code>draft: true</code> line from its front matter and push.
</p>

{% assign drafts = site.posts | where: "draft", true | sort: "date" %}

{% if drafts.size == 0 %}
  <p><em>No drafts at the moment — everything is live.</em></p>
{% else %}
  <p><strong>{{ drafts.size }}</strong> draft{% if drafts.size != 1 %}s{% endif %} pending review.</p>

  <ol class="post-list">
    {% for post in drafts %}
    <li class="post-card">
      <a class="post-card-link" href="{{ post.url | relative_url }}">
        <div class="post-meta">
          <span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span>
          <span class="post-session" style="color: var(--accent);">DRAFT</span>
        </div>
        <h3 class="post-title">{{ post.title }}</h3>
        {% if post.excerpt_override %}
          <p class="post-dek">{{ post.excerpt_override }}</p>
        {% else %}
          <p class="post-dek">{{ post.excerpt | strip_html | truncatewords: 32 }}</p>
        {% endif %}
        {% if post.tags.size > 0 %}
        <ul class="chips">
          {% for t in post.tags %}<li>#{{ t }}</li>{% endfor %}
        </ul>
        {% endif %}
      </a>
    </li>
    {% endfor %}
  </ol>
{% endif %}

---

### To publish a draft

Edit its file in `_posts/`, remove the line `draft: true` from the front matter, commit, and push. It will appear on the homepage feed and in RSS within ~60 seconds of the build completing.

```
# Example — promote the budget post
sed -i '' '/^draft: true$/d' _posts/2025-02-01-budget-multiplier-fight.md
git add _posts/2025-02-01-budget-multiplier-fight.md
git commit -m "Publish: Budget Day 2025 multiplier fight"
git push
```
