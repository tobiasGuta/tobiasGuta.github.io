---
layout: default
title: Blog
---

# 🔥 Blog Posts

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url }})  
  <small>{{ post.date | date: "%B %d, %Y" }}</small>
{% endfor %}
