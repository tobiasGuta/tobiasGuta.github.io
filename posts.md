---
layout: default
title: Blog
permalink: /posts/
---

<section class="posts-list max-w-4xl mx-auto px-4 py-8 text-gray-100">
  <h1 class="text-4xl font-bold mb-8 text-white tracking-wide flex items-center gap-2">
    <svg class="blog-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6a2 2 0 012 2v14a2 2 0 01-2 2z" />
    </svg>
    Blog Posts
    <a href="http://whoistob1as.me/feed.xml" target="_blank" rel="noopener" title="RSS Feed" class="rss-feed-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
        <circle cx="6.18" cy="17.82" r="2.18" fill="#FFD700"/>
        <path d="M4 11v3a8 8 0 0 1 8 8h3c0-6.08-4.92-11-11-11zm0-4v3c9.39 0 17 7.61 17 17h3c0-11.05-8.95-20-20-20z" fill="#FFD700"/>
      </svg>
    </a>
  </h1>
  <div class="cards-container">
    {% for post in site.posts %}
    <article class="post-card">
      <a href="{{ post.url }}" class="post-title">{{ post.title }}</a>
      <time class="post-date" datetime="{{ post.date | date_to_xmlschema }}">
        {{ post.date | date: "%B %-d, %Y" }}
      </time>
      <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 22 }}</p>
    </article>
    {% endfor %}
  </div>
</section>
