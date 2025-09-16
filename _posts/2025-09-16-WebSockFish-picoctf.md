---
layout: post
title: "WebSockFish PicoCTF"
date: 2025-09-16
categories: [ctf, picoctf, walkthrough]
image: https://miro.medium.com/v2/resize:fit:720/format:webp/1*uKuKNFiZss4ahdQvweK_Jw.jpeg
permalink: /blog/WebSockFishPicoCtf
locked: false
---

When we accessed the website, we found this:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*4KmVEKucoc6ZP5RrNqeDOw.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

It appears to be a normal chess game.

Even though I don't know much about how to play this game, I'm going to make some random moves

Once I make the first move, in Burp Suite WebSocket history, we can see two requests made by me (the client) and the fish (the server).

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*lgl1MJRvjRj3WBEoA1LGpQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

I'm going to keep making more random moves until the fish wins, to see the whole process.

After a few random moves, instead of sending `eval [number]`, it sent 'mate 3' to the server.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*U0wL9yrqL7C3AfilUWAs6A.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

When I make more random moves, I reach the point where I can't move anymore, and my last message to the server is 'mate 1'.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*PraZf_AfyGn5PuJ9t1LrvQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Now it's time to make a move using Repeater to see what we can do with it.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*ZyjWuYiSPuFCxrAMm0UmRw.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Let's send `mate 1`.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*NdMMzI5nh0JfetVQXRAShQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Nothing. What if we go below 0?

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*mq7LaTHx8LBODx2XXxSEhA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Interesting, we checkmated. We win?? But there's no flag?

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*v1GYh32UR5xxB9zjmn92zg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Nothing. Let's change it to `eval -9999` first, and then we can keep pushing forward.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*0xi8bsLqVYhDFF-wz3ynBQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

By adding another 9 to `eval -9999`, we got the flag.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/1*1HxCbmb-J_EmKFWqvyTk0Q.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>