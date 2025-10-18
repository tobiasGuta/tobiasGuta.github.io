---
layout: post
title: "Weak JWT Secrets: How ‘secret’ Breaks Your Auth"
date: 2025-10-16
categories: [bug bounty]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*xmO_zJP7qmtGWLiHtdeRIQ.png
permalink: /blog/Weak-JWT-Secret
locked: false
---

This post begins a short series about authentication mistakes I often see in Node.js/Express applications. We'll look at a real-but-safe example where the server uses JSON Web Tokens (JWTs) for authentication, but the signing secret is weak and guessable. That weakness lets an attacker forge tokens that the server accepts.

The goal here is educational: to show how this class of bug appears in an Express app, I will not publish exploit scripts or wordlists; instead, this walkthrough focuses on how to find the problem.

Summary of the vulnerable setup:

- A Node.js server built with Express issues JWTs using the HS256 algorithm.
- The server stores the signing key as a short or common string (for example, "secret", "1234", or an English word).
- Because the secret is weak, an attacker who can guess it can sign arbitrary tokens (for example, upgrading their user to admin) and the server will accept them.

What you'll learn in this post:

- How to spot weak JWT secrets in code and runtime configuration.

If you want to follow along locally, create a tiny Express app and never expose test secrets to the public internet. Treat any reproduction data as lab-only, and rotate secrets after testing.

# Endpoints

- /login
- /admin

# Walkthrough

We have these credentials:

<div class="code-block-container">
  <span class="code-lang-tag">Node.js</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="Terminal">
const users = [
  { id: 1, username: 'alice', password: 'alicepw', role: 'user' },
  { id: 2, username: 'bob', password: 'bobpw', role: 'admin' }
];
</code></pre>
  {% endraw %}
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*W4uuTeSh19BpKiXWpCM_Og.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

If we try to access `/admin`, we get something like:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*lKgINRctNUElgqcrlkViTA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

If we use this site: [SuperTokens JWT Decoder](https://supertokens.com/jwt-encoder-decoder), we can decode the JWT.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*FHA3j2RQVeeSkmI5sH22Mg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

If we change the role from user to admin to see if we can access the `/login` endpoint, we get this:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*dyZ7ji7c73Rk1S5gVAI4sA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*dhE9RAXWpHqDFCoAUpGNrw.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

# Brute-Force

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*THD_HPjG4eXnFeSA2U0QFQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Let's use hashcat to brute-force the JWT

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*7TpkpAfBwrmQed_Sz3jXzQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

`secret`

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*3gMgc6GAOQVJR_JQN7BDYQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

# Welcome, admin Alice

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*8I9piVg6oNt1BxnCWZaQKA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>