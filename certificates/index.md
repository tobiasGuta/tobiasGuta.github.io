---
layout: page
title: Certificates
permalink: /certificates/
---

# Certificates & Awards

<div class="filter-buttons">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="cert">Certificates</button>
  <button class="filter-btn" data-filter="award">Awards</button>
  <button class="filter-btn" data-filter="lab">Labs</button>
  <button class="filter-btn" data-filter="bug-bounty">Bug Bounties</button>
</div>

<div class="cert-grid">

  <div class="cert-card" data-category="cert">
    <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*6Bjdl1HQWfOhpV39gcsB9w.jpeg" alt="GIAC" class="cert-img">
    <div>
      <strong>Global Information Assurance Certification (GIAC)</strong><br>
      <span class="cert-org">Sans</span><br>
      <span class="cert-date">Issued: February 29, 2024</span><br>
      <a href="https://www.credly.com/badges/d7400ee1-230d-42f5-9bbd-d66be8dfe55a/linked_in_profile" target="_blank">View Certificate</a>
    </div>
  </div>

  <div class="cert-card" data-category="bug-bounty">
    <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*SR2a18VZ4cODWyHpFRsPUg.png" alt="DOF" class="cert-img">
    <div>
      <strong>Recognized by the U.S. Department of Education</strong><br>
      <span class="cert-org">Department of Education</span><br>
      <span class="cert-date">Issued: October, 2024</span><br>
    </div>
  </div>

  <div class="cert-card" data-category="bug-bounty">
    <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*Z-8drZiuQwQaKM7Ns867lA.png" alt="NYC" class="cert-img">
    <div>
      <strong>Recognized by The City of New York </strong><br>
      <span class="cert-org">New York </span><br>
      <span class="cert-date">Issued: October, 2024</span><br>
      <a href="https://nyc.responsibledisclosure.com/hc/en-us/articles/20413464091155-Acknowledgements" target="_blank">View Certificate</a>
    </div>
  </div>

  <div class="cert-card" data-category="cert">
    <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*SgOXlOFniW-D4VxRa7sY2w.jpeg" alt="codepath" class="cert-img">
    <div>
      <strong>CodePath intro to cybersecurity </strong><br>
      <span class="cert-org">CodePath </span><br>
      <span class="cert-date">Issued: fall, 2023</span><br>
    </div>
  </div>

  <div class="cert-card" data-category="award">
    <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*8ko9Yu18gr3JlQjolmerdw.jpeg" alt="codepath" class="cert-img">
    <div>
      <strong>National Cyber Scholarship </strong><br>
      <span class="cert-org">NCS </span><br>
    </div>
  </div>

  <div class="cert-card" data-category="lab">
    <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*1Td1vSVnGTAAzWVutgdYWg.png" alt="mastercard" class="cert-img">
    <div>
      <strong>Cyber Job Simulation</strong><br>
      <span class="cert-org">NCS </span><br>
      <span class="cert-date">Issued: july 13, 2024</span><br>
    </div>
  </div>

  <div class="cert-card" data-category="cert">
    <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*eNClI2wt95aC1oATjBuFdA.jpeg" alt="mastercard" class="cert-img">
    <div>
      <strong>Diploma</strong><br>
      <span class="cert-org">CUNY Guttman Community College </span><br>
      <span class="cert-date">Issued: Agust 25, 2025</span><br>
      <a href="https://www.parchment.com/u/award/f74fc1daca525c11e62be348543279d7" target="_blank">View Certificate</a>
    </div>
  </div>

  <div class="cert-card" data-category="lab">
    <img src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*j8Kkol1tgSN6q5nYnZ_KeA.png" alt="mastercard" class="cert-img">
    <div>
      <strong>Implement and manage Active Directory Certificate Services</strong><br>
      <span class="cert-org">microsoft </span><br>
      <span class="cert-date">Issued: Feb 06, 2026</span><br>
      <a href="https://learn.microsoft.com/en-us/users/tobiasare-1489/achievements/nmt3tccf?ref=https%3A%2F%2Fwww.linkedin.com%2F" target="_blank">View Lab</a>
    </div>
  </div>

</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const certCards = document.querySelectorAll(".cert-card");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");

        certCards.forEach((card) => {
          if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
            card.classList.remove("hide");
            card.classList.add("show");
          } else {
            card.classList.remove("show");
            card.classList.add("hide");
          }
        });
      });
    });
  });
</script>
