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
        <circle cx="6.18" cy="17.82" r="2.18" fill="currentColor"/>
        <path d="M4 11v3a8 8 0 0 1 8 8h3c0-6.08-4.92-11-11-11zm0-4v3c9.39 0 17 7.61 17 17h3c0-11.05-8.95-20-20-20z" fill="currentColor"/>
      </svg>
    </a>
  </h1>
  <div class="cards-container">
    {% for post in site.posts %}
    <article class="post-card">
      {% assign last_modified = post.last_modified_at | date: "%s" %}
      {% assign published = post.date | date: "%s" %}
      {% assign now = 'now' | date: "%s" %}
      {% assign days_since_update = now | minus: last_modified | divided_by: 86400 %}
      {% if post.last_modified_at and last_modified > published and days_since_update <= 5 %}
        <span class="updated-label">Updated</span>
      {% endif %}
      <a href="{{ post.url }}" class="post-title">{{ post.title }}</a>
      <time class="post-date" datetime="{{ post.date | date_to_xmlschema }}">
        {{ post.date | date: "%B %-d, %Y" }}
      </time>
      <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 22 }}</p>
      <div class="share-buttons flex gap-2 mt-2">
        <a href="https://twitter.com/intent/tweet?url={{ site.url }}{{ post.url }}&text={{ post.title | uri_escape }}" target="_blank" rel="noopener" title="Share on Twitter" class="twitter-icon">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.74c-.37.63-.58 1.36-.58 2.14 0 1.48.75 2.78 1.89 3.54a4.28 4.28 0 0 1-1.94-.54v.05c0 2.07 1.47 3.8 3.42 4.19-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.12 2.9 3.99 2.93A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.7 8.7 0 0 0 24 4.59a8.48 8.48 0 0 1-2.54.7z" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/shareArticle?mini=true&url={{ site.url }}{{ post.url }}&title={{ post.title | uri_escape }}" target="_blank" rel="noopener" title="Share on LinkedIn" class="linkedin-icon">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" fill="currentColor"/>
          </svg>
        </a>
      </div>
    </article>
    {% endfor %}
  </div>
</section>
