---
layout: post
title: "Critical IDOR in NYC.gov NYCID Appointment Scheduling (Fixed)"
date: 2026-05-20
categories: [bug-bounty]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*KUctB4qITZ3jOHAj3oqtBg.png
permalink: /blog/NYCID-NYCgov-IDOR.html
locked: false
---

## Summary

I discovered a **critical Insecure Direct Object Reference (IDOR)** issue in the NYC.gov appointment scheduling flow for **NYCID**.

The application allowed anyone to **view/reschedule/cancel an appointment** by providing only an **11-digit confirmation number**, with **no authentication or identity verification**.

I observed that confirmation numbers appeared **predictable** (sequential/incrementing patterns), which significantly increases the risk of unauthorized access at scale.

> Status: **Fixed** (the issue is no longer reproducible as of this post).

## Fix implemented (what changed)

The responsible agency implemented an improved fix for this issue. Their solution **reduces the amount of exposed data**, which is a strong approach to mitigating this IDOR vulnerability. Based on what I observed during retesting, the fix appears effective and significantly limits unnecessary data disclosure.

This is a well-designed mitigation: **minimizing returned data** helps prevent unauthorized access to sensitive information even if an endpoint is misused.

## Impact

If abused, this would allow an unauthorized party to access **personally identifiable information (PII)** associated with appointments, including:

- Full name
- Email address
- Phone number
- Appointment details (location, date, time)

This represents a serious privacy and safety concern because the confirmation number functioned as the **only “key”** to sensitive user records.

## What I observed

After completing an appointment booking, the system displayed an 11-digit confirmation number. While testing with **appointments I created using my own information**, I noticed the numbers followed a **predictable pattern** (small changes between valid values).

In the “View / Reschedule / Cancel” flow, entering only the confirmation number was sufficient to reach a page that revealed appointment details and associated PII—without any additional verification step.

## Validation steps (responsible)

For responsible disclosure reasons, I kept testing strictly limited to **my own appointments** and did not attempt to access or enumerate other users’ data.

High-level validation flow:

1. Create an appointment and note the confirmation number.
2. Create a second appointment and compare the confirmation number structure/pattern.
3. Use the site’s “View / Reschedule / Cancel” feature and enter each confirmation number.
4. Observe that sensitive information is displayed without authentication.

Any screenshots I captured were **redacted/blurred** to remove PII.

## Evidence (redacted)

PoC screenshots (PII redacted):

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ZALIdn76kGjVYtThARjjGg.png"
  alt="PoC screenshot (redacted)"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*n-NK0W4JW9RctFrdjC2TRg.png"
  alt="PoC screenshot (redacted)"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Acceptance / validation response:

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*7Ry-0IAuyWMF8fIFdudKaA.png"
  alt="Agency validation response (redacted)"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

## Root cause (high-level)

The system relied on a **single, user-controlled identifier** (the confirmation number) as the only gate to an appointment object.

When an identifier is:

- the only requirement to access a record, and
- guessable / has low entropy,

it becomes an access-control problem, not just an “identifier” problem.

## Recommendations

Defensive controls that typically prevent this class of issue:

- Require authentication for appointment management OR a secondary verification factor (email/SMS one-time link, last name + DOB, etc.).
- Use **high-entropy, unguessable** identifiers (random tokens) instead of predictable sequences.
- Add rate limiting, anomaly detection, and monitoring on lookup endpoints.
- Ensure server-side authorization checks enforce “user owns this appointment” before returning any PII.

## Takeaway

This was a good reminder that **access control must be enforced server-side** and that “confirmation numbers” can quickly become **security tokens** if they unlock privileged actions.
