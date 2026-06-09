---
layout: post
title: "JaWT Scratchpad PicoCTF"
date: 2025-09-16
categories: [ctf, picoctf, walkthrough]
image: https://miro.medium.com/v2/resize:fit:720/format:webp/1*fcvxcEANcxQlqK--App_4A.png
permalink: /blog/JawtPicoCtf
locked: false
---

Check the admin scratchpad!

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*9GKvmZAQrrEmEXiaC-iPCQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

We can't log in as admin, so let's log in as Jose.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*GoZethjTId1XK8Q3yIJ9jA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Now, let's use Burp Suite for this.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*X67G8wjNyp0MEy232OHkdw.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

At the end of the website, it shows something like this : "You can use your name as a log in, because that's quick and easy to remember! If you don't like your name, use a short and cool one like [John](https://github.com/magnumripper/JohnTheRipper)!"

As we know, John the Ripper is used to brute force, so that gives the idea that this should be a brute force challenge. In my case, I decided to use Hashcat.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
hashcat -a 0 -m 16500 jwt wordlist
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*dXSFOD1ykNt_Wce45g9VvQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

secret: ilovepico

I can use this secret password to create a new assigning key


<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*Mh3rp9LE7726qtARV91z7w.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

After creating our new key, we changed the user from 'jose' to 'admin' and assigned the key we created.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*1XbjbbupiaT4D5lmB5lH-g.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

After that, we send the request.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*kmTbUyqXJFnEvEB3-rcjvQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Hello admin!