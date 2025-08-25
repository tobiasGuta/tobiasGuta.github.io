---
layout: default
title: Blog
permalink: /posts/
---

<section class="posts-list max-w-4xl mx-auto px-4 py-8 text-gray-100">
  <h1 class="text-4xl font-bold mb-8 text-white tracking-wide flex items-center gap-2 relative">
    <svg class="blog-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6a2 2 0 012 2v14a2 2 0 01-2 2z" />
    </svg>
    Blog Posts
    <a href="http://whoistob1as.me/feed.xml" target="_blank" rel="noopener" title="RSS Feed" class="rss-feed-icon ml-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
        <circle cx="6.18" cy="17.82" r="2.18" fill="currentColor"/>
        <path d="M4 11v3a8 8 0 0 1 8 8h3c0-6.08-4.92-11-11-11zm0-4v3c9.39 0 17 7.61 17 17h3c0-11.05-8.95-20-20-20z" fill="currentColor"/>
      </svg>
    </a>
  </h1>

  <!-- Tab Navigation -->
  <div class="tab-navigation mb-8">
    <div class="tab-container">
      <button class="tab-button active" data-category="all">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6a2 2 0 012 2v14a2 2 0 01-2 2z" />
        </svg>
        All Posts
      </button>
      <button class="tab-button" data-category="bug-bounty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Bug Bounty
      </button>
      <button class="tab-button" data-category="ctf">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22"></polyline>
        </svg>
        CTF
      </button>
    </div>
  </div>

  <div class="cards-container">
    {% for post in site.posts %}
    <article class="post-card" data-categories="{% for category in post.categories %}{{ category }} {% endfor %}">
      {% if post.image %}
        <div class="post-card-image">
          <img src="{{ post.image }}" alt="{{ post.title }} cover image" />
          {% if post.locked or post.draft %}
            <div class="locked-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="32" height="32">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          {% endif %}
        </div>
      {% endif %}
      
      <!-- Lock Status Badge -->
      {% if post.locked or post.draft %}
        <div class="post-status">
          <span class="status-badge locked">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {% if post.draft %}Draft{% else %}Locked{% endif %}
          </span>
        </div>
      {% endif %}

      {% assign last_modified = post.last_modified_at | date: "%s" %}
      {% assign published = post.date | date: "%s" %}
      {% assign now = 'now' | date: "%s" %}
      {% assign days_since_update = now | minus: last_modified | divided_by: 86400 %}
      {% if post.last_modified_at and last_modified > published and days_since_update <= 5 %}
        <span class="updated-label">Updated</span>
      {% endif %}
      
      <!-- Reading Time -->
      {% assign words = post.content | number_of_words %}
      {% assign reading_time = words | divided_by: 200 %}
      {% if reading_time < 1 %}
        {% assign reading_time = 1 %}
      {% endif %}
      
      <div class="post-meta-top">
        <span class="reading-time">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ reading_time }} min read
        </span>
      </div>
      
      {% if post.locked or post.draft %}
        <span class="post-title locked-title">{{ post.title }}</span>
        <p class="post-excerpt locked-excerpt">This post is currently locked and will be available soon...</p>
      {% else %}
        <a href="{{ post.url }}" class="post-title">{{ post.title }}</a>
        <time class="post-date" datetime="{{ post.date | date_to_xmlschema }}">
          {{ post.date | date: "%B %-d, %Y" }}
        </time>
        <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 22 }}</p>
      {% endif %}
      
      {% unless post.locked or post.draft %}
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
      {% endunless %}
    </article>
    {% endfor %}
  </div>
</section>

<style>
.tab-navigation {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
}

.tab-container {
  display: inline-flex;
  gap: 0.75rem;
  justify-content: center;
  width: 100%;
}

.tab-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.tab-button.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.post-card {
  transition: all 0.3s ease;
}

.post-card.hidden {
  display: none;
}

/* Locked Post Styles */
.locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  border-radius: 0.5rem;
}

.post-status {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.locked {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.locked-title {
  color: rgba(255, 255, 255, 0.6);
  cursor: not-allowed;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

.locked-excerpt {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

.post-card:has(.locked-title) {
  opacity: 0.7;
  filter: grayscale(0.3);
}

/* Mobile responsive */
@media (max-width: 640px) {
  .tab-container {
    gap: 0.5rem;
  }
  
  .tab-button {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const postCards = document.querySelectorAll('.post-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      
      // Update active tab
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter posts
      postCards.forEach(card => {
        const cardCategories = card.getAttribute('data-categories').toLowerCase();
        
        if (category === 'all' || cardCategories.includes(category)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
});
</script>
