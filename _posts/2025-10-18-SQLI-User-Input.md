---
layout: post
title: "When Input Becomes Injection"
date: 2025-10-18
categories: [my-research]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*dU101LJckdGykTOw0K0q6w.jpeg
permalink: /blog/Input-sql-Injection
locked: false
---

Developers should never trust user input. Even when you think you've sanitized everything and even when you're using the familiar ? placeholder in Node.js MySQL libraries mistakes and wrong assumptions can still leave your app vulnerable.

A few essential points:
- ? placeholders protect values, not SQL structure. They safely substitute data values, but they do not and cannot be used for identifiers, SQL keywords, or fragments you build by string concatenation. If you concatenate table names, column names, ORDER BY clauses, or entire SQL snippets with user input, a placeholder won't help.
- Misusing escaping, trusting client-side validation, or doing shallow sanitization (like stripping a few characters) can be bypassed. There are second‑order injections (stored malicious input executed later), encoding tricks, and edge cases with JSON and binary data.
- The typical Node.js + MySQL pitfalls: building queries with template strings, using unvalidated inputs for identifiers, relying on naive input filters, or assuming middleware has already made the input safe.

# Endpoints

- api/v1/users/filter?name={{name}}
- api/v1/blogs/filter
- api/v1/blogs/filter?author={{name}}

# Walkthrough

We are logged in as Alice.

If we visit this endpoint `api/v1/blogs/filter`:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*uM1aaR5nAaYZVRDaDdoO4g.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

If we use something like `api/v1/blogs/filter?author={{name}}` from any author for example `Alice` or `Bob` we make a request like:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*MTciSW3EYcb9t_Kz8uEpxg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*6gX220WzN39JzKvsAged5A.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

But let's say we have another endpoint `api/v1/users/filter?name={{name}}`. Remember we are logged in as Alice, so our request would be:

`api/v1/users/filter?name=Alice` as shown below 

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*MPqXu-D6n5xzQN-LDPvVYg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Our SQL request would look like this :

<div class="code-block-container">
  <span class="code-lang-tag">SQL</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="Terminal">
Built users query: SELECT * FROM users WHERE name=? Data: [ 'Alice' ]
</code></pre>
  {% endraw %}
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*poI5wofBAtxklzkFPFRa4Q.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

What if we try to access Bob's information?

We can't, we get `Unauthorized`.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*5cFnvj_tbv2uiM9Bi6qj8A.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

What if we change the `name` parameter to something different, for example: `api/v1/users/filter?foo=bar`

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*Aie8ldbkzioHPkWkdupF7A.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<div class="code-block-container">
  <span class="code-lang-tag">SQL</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="Terminal">
Server running on port 3000
Built users query: SELECT * FROM users WHERE name=? Data: [ 'Alice' ]
Built users query: SELECT * FROM users WHERE foo=? Data: [ 'bar' ]
</code></pre>
  {% endraw %}
</div>

We were able to modify the query as you can see above. That means there is a potential for SQL injection for example, to make a condition always true one common payload is `OR 1=1`. First, let's explore more: what if we sent something like `api/v1/users/filter?name%20bar=bar`

<div class="code-block-container">
  <span class="code-lang-tag">SQL</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="Terminal">
Server running on port 3000
Built users query: SELECT * FROM users WHERE name=? Data: [ 'Alice' ]
Built users query: SELECT * FROM users WHERE foo=? Data: [ 'bar' ]
Built users query: SELECT * FROM users WHERE name bar=? Data: [ 'bar' ]
</code></pre>
  {% endraw %}
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*QiCtNtqdXA8qWK9EOhSWFg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

We fully controlled the query, which means if we sent something like `OR 1=1` it could return true and dump information:

<div class="code-block-container">
  <span class="code-lang-tag">SQL</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="Terminal">
Server running on port 3000
Built users query: SELECT * FROM users WHERE name=? Data: [ 'Alice' ]
Built users query: SELECT * FROM users WHERE foo=? Data: [ 'bar' ]
Built users query: SELECT * FROM users WHERE name bar=? Data: [ 'bar' ]
Built users query: SELECT * FROM users WHERE name OR 1=? Data: [ '1' ]
</code></pre>
  {% endraw %}
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*2VBZH3qBIWy84CnSYSCZ2A.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*9_j_ru2wAij9w4kqY5obwQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

# Quick mitigations and takeaways

- Always use parameterized queries / prepared statements for data values.
- Never inject user input into SQL structure (identifiers, keywords, clause fragments). If you must vary structure, use strict whitelists or server-side mappings.
- Validate and coerce types server-side (numbers, enums, ranges) instead of relying on shallow string sanitization or client-side checks.
- Apply least privilege for database accounts and avoid exposing powerful permissions to the application user.
- Log unexpected input and monitor query patterns to detect abuse or probing.
- Defense in depth: input validation, prepared statements, minimal DB permissions, and runtime monitoring.