---
layout: post
title: "READ (PicoCTF)"
date: 2025-06-12
categories: [blog, cybersecurity]
tags: [red team, pentesting, bug bounty, ctf]
image: https://e1.pxfuel.com/desktop-wallpaper/346/328/desktop-wallpaper-grim-reaper-backgrounds-grim-reaper.jpg
---

<div style="background: #181c20; border: 2.5px solid #e74c3c; border-radius: 12px; padding: 22px 26px; margin: 36px 0 32px; box-shadow: 0 4px 18px rgba(231,76,60,0.10); color: #f8f8f2; font-size: 1.13em; font-family: 'Fira Mono', 'Consolas', monospace;">
  <div style="font-weight: bold; font-size: 1.22em; letter-spacing: 0.04em; color: #ff5555; margin-bottom: 10px;">
    Challenge: RED (PicoCTF)
  </div>
  <div style="margin-bottom: 12px;">
    <strong>Description:</strong><br>
    RED, RED, RED, RED<br>
  </div>
  <a href="https://challenge-files.picoctf.net/c_verbal_sleep/831307718b34193b288dde31e557484876fb84978b5818e2627e453a54aa9ba6/red.png" style="color: #ffb86c; text-decoration: underline; font-weight: bold;">
  Download: red.png
  </a>
</div>

## Solution Walkthrough

1. **Initial Inspection**  
   After downloading and opening the image, I noticed a red square. To gather more information, I used `exiftool` to check the image metadata.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*7NkoszjlLKQpeKZ3rPcpsg.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:4000/format:webp/1*0JBicI9I0KxKKiEEBNEisQ.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

2. **Finding the Hidden Poem**  
   In the metadata, I found a poem:
<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
   Crimson heart, vibrant and bold,
   .Hearts flutter at your sight
   ..Evenings glow softly red,
   .Cherries burst with sweet life..
   Kisses linger with your warmth..
   Love deep as merlot..
   Scarlet leaves falling softly,
   .Bold in every stroke.
</code></pre>
</div>
   By aligning the lines after each dot, the first letter of each line spells out: **CHECKLSB**.

3. **Researching LSB**  
   I wasn’t sure what "LSB" meant, so I searched online and learned about **Least Significant Bit (LSB) steganography** a technique for hiding data in images by modifying the least significant bits of pixel values.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*_lyuWmT_Axwuqc-MiFA74g.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

4. **Understanding LSB Steganography**  
   - The LSB is the rightmost bit in a binary number (e.g., in `10010010`, the last `0` is the LSB).
   - LSB steganography hides information by replacing these bits in the image’s color channels.
   - This method is popular because it doesn’t noticeably change the image.

5. **Choosing the Right Tool**  
   I first considered `steghide`, but it doesn’t support PNG files. After some research, I found [`zsteg`](https://github.com/zed-0xff/zsteg), a tool designed for detecting steganography in PNG and BMP images.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*FeH_SHuuA2QeDLxE3GX6Qg.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

6. **Extracting the Hidden Data**  
   I installed `zsteg` (since it’s not pre-installed on Kali Linux) and ran it on the image. The tool revealed a message encoded in base64, multiple times.

<img 
  src="https://miro.medium.com/v2/resize:fit:3000/format:webp/1*TBm2PkEUVhEuNQ72ezillg.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>


7. **Decoding the Message**  
   After decoding the base64 string several times, I finally obtained the flag!

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*24UtVzAOhW9l80TZJ0ioZQ.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>


