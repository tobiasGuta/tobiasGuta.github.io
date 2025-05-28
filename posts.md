---
layout: default
title: Blog
permalink: /posts/
---

<section class="posts-list max-w-4xl mx-auto px-4 py-8 text-gray-100">
  <h1 class="text-4xl font-bold mb-8 text-white tracking-wide flex items-center gap-2">
    <svg class="blog-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6a2 2 0 012 2v14a2 2 0 01-2 2z" />
    </svg>
    Blog Posts
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
