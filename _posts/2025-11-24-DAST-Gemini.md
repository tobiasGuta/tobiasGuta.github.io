---
layout: post
title: "You'll Be Replaced, If You Don't Learn to Use AI"
date: 2025-09-16
categories: [my-research]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*k2UUA5hSmJqVTPG3T2o7Cg.png
permalink: /blog/DASTGemini
---

## Why this project

Hunting for bugs in web applications generates many raw findings. Manually triaging and prioritizing them is slow. By feeding structured findings into an LLM (here: Gemini-2.0-flash as an example), we can:
- classify issues (risk / false positive / true positive),
- generate concise reproduction steps,

## Mistake made by DAST + Gemini-2.0-flash

Gemini-2.0-flash scan identifies a ROT13-encoded string in the page source. It detects the ROT13 but, when converted to human-readable text, it makes a mistake, as shown in the video below. I believe this is due to limitations of the model.

## Watch the video below:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="https://www.youtube.com/embed/TCo8PZ_1SRQ" 
    frameborder="0" 
    allowfullscreen 
    style="position: absolute; top:0; left: 0; width: 100%; height: 100%;">
  </iframe>
</div>