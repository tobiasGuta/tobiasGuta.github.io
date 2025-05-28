---
layout: default
title: Blog
permalink: /posts/
---

<section class="posts-list max-w-4xl mx-auto px-4 py-8 text-gray-100">
  <h1 class="text-4xl font-bold mb-8 text-white tracking-wide">Blog Posts</h1>
  <div class="cards-container">
    {% for post in site.posts %}
    <article class="post-card">
      <a href="{{ post.url }}" class="post-title">{{ post.title }}</a>
      <time class="post-date" datetime="{{ post.date | date_to_xmlschema }}">
        {{ post.date | date: "%B %-d, %Y" }}
      </time>
      <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 22 }}</p>
      <span class="read-more">Read →</span>
    </article>
    {% endfor %}
  </div>
</section>
