---
layout: default
title: Home
---

<div class="home-container text-center px-4">

  <!-- Profile Image -->
  <div class="profile-pic mx-auto mb-4 animated-border">
    <div class="border-circle">
      <img src="/assets/profile.png" alt="Profile" />
    </div>
  </div>

  <!-- Glitch Heading -->
  <h1 class="glitch display-4 fw-bold mb-4" data-text="Hey, I'm Tobias Are">
    Hey, I'm Tobias Are
  </h1>

  <!-- Typing Bio Section -->
  <div class="typing-text">
    <span id="typed-text"></span><span id="cursor">|</span>
  </div>

</div>

<script>
  const text = "I’m a cybersecurity student and bug bounty hunter focused on penetration testing, web exploitation, and offensive security. Passionate about AI’s role in threat detection, I thrive on solving complex security challenges and staying ahead of emerging threats. I'm actively seeking internships, research roles, and opportunities to grow within the cybersecurity community.";
  const typedText = document.getElementById("typed-text");
  const cursor = document.getElementById("cursor");
  let i = 0;

  function type() {
    if (i < text.length) {
      typedText.textContent += text.charAt(i);
      i++;
      setTimeout(type, 25);
    }
  }

  document.addEventListener("DOMContentLoaded", type);
</script>
