---
layout: post
title: "Memory Forensics"
date: 2025-06-18
categories: [blog, cybersecurity]
tags: [Redteam, pentesting, bugbounty, ctf]
image: https://miro.medium.com/v2/resize:fit:720/format:webp/1*NhMg-i3CUBJosC48m0k_sw.png
---

## Memory Forensics: Finding the Flags

The forensic investigator provided us with a memory dump from John's computer. We'll be using the **Volatility** framework to analyze it.

### Installing Volatility 2

Refer to this guide for installation: [How to Install Volatility 2 and Volatility 3 on Linux](https://letsdefend.io/blog/how-to-install-volatility-2-and-volatility-3-on-linux)

#### Troubleshooting Dependencies on Kali Linux

For Volatility 2, if you encounter any problems while installing the dependencies on Kali Linux:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
pip2 install distorm3 yara-python pycrypto
</code></pre>
</div>

This happens because you're using Python 2.7, which is completely EOL (end-of-life), and pip support for it is gone.

#### Solution

1. Download `get-pip.py` for Python 2.7:
<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
curl https://bootstrap.pypa.io/pip/2.7/get-pip.py --output get-pip.py
</code></pre>
</div>

2. Install pip for Python 2:
<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
python2 get-pip.py
</code></pre>
</div>

3. Upgrade setuptools:
<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
python2 -m pip install --upgrade setuptools
</code></pre>
</div>

4. Now, install the required packages:

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
pip2 install distorm3 yara-python pycrypto
</code></pre>
</div>

<div style="background: #181c20; border: 2.5px solid #e74c3c; border-radius: 12px; padding: 22px 26px; margin: 36px 0 32px; box-shadow: 0 4px 18px rgba(231,76,60,0.10); color: #f8f8f2; font-size: 1.13em; font-family: 'Fira Mono', 'Consolas', monospace;">
  <div style="font-weight: bold; font-size: 1.22em; letter-spacing: 0.04em; color: #ff5555; margin-bottom: 10px;">
    We’ve been given the following file:
  </div>
  <div style="margin-bottom: 12px;">
    <strong>File:</strong><br>
    Snapshot6_1609157562389.vmem<br>
  </div>
</div>

From the .vmem extension, we can tell this is a VMware virtual machine memory file. Volatility supports this format, so we’ll proceed with analyzing it using the appropriate profile.

We’ll start by running the imageinfo plugin. This plugin analyzes the memory dump and provides a list of suggested operating system profiles that most closely match the memory image.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot6_1609157562389.vmem imageinfo
Volatility Foundation Volatility Framework 2.6.1
INFO    : volatility.debug    : Determining profile based on KDBG search...
          Suggested Profile(s) : Win7SP1x64, Win7SP0x64, Win2008R2SP0x64, Win2008R2SP1x64_24000, Win2008R2SP1x64_23418, Win2008R2SP1x64, Win7SP1x64_24000, Win7SP1x64_23418
                     AS Layer1 : WindowsAMD64PagedMemory (Kernel AS)
                     AS Layer2 : FileAddressSpace (/home/bigbrooklyn/Desktop/vola2/volatility/Snapshot6_1609157562389.vmem)
                      PAE type : No PAE
                           DTB : 0x187000L
                          KDBG : 0xf80002c4a0a0L
          Number of Processors : 1
     Image Type (Service Pack) : 1
                KPCR for CPU 0 : 0xfffff80002c4bd00L
             KUSER_SHARED_DATA : 0xfffff78000000000L
           Image date and time : 2020-12-27 06:20:05 UTC+0000
     Image local date and time : 2020-12-26 22:20:05 -0800
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*0vYZkrL7JsIyr9Am2AOGGQ.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

This is a windows operating system

Goal: Find John’s Password

To uncover John’s password, we’ll need to extract the password hashes from the memory image. Specifically, we’ll dump the SAM and SYSTEM registry hives, which store encrypted user credentials.

hivelist = Lists the registry hives present in a particular memory image.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot6_1609157562389.vmem hivelist --profile=Win7SP1x64
Volatility Foundation Volatility Framework 2.6.1
Virtual            Physical           Name
------------------ ------------------ ----
0xfffff8a001453010 0x000000003b039010 \??\C:\Users\John\AppData\Local\Microsoft\Windows\UsrClass.dat
0xfffff8a00000f010 0x0000000027324010 [no name]
0xfffff8a000024010 0x00000000271af010 \REGISTRY\MACHINE\SYSTEM
0xfffff8a000061010 0x00000000272ee010 \REGISTRY\MACHINE\HARDWARE
0xfffff8a000790010 0x00000000211b5010 \Device\HarddiskVolume1\Boot\BCD
0xfffff8a0007f1010 0x0000000021368010 \SystemRoot\System32\Config\SOFTWARE
0xfffff8a000a8e010 0x000000001b1e8010 \SystemRoot\System32\Config\DEFAULT
0xfffff8a000cce010 0x00000000172b1010 \SystemRoot\System32\Config\SECURITY
0xfffff8a000cf8010 0x0000000016ce6010 \SystemRoot\System32\Config\SAM
0xfffff8a000d81010 0x00000000162d5010 \??\C:\Windows\ServiceProfiles\NetworkService\NTUSER.DAT
0xfffff8a000e0e010 0x0000000016073010 \??\C:\Windows\ServiceProfiles\LocalService\NTUSER.DAT
0xfffff8a0013ee010 0x000000003bc0d010 \??\C:\Users\John\ntuser.dat
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*NwJdju3yXAfoxa6PbwTFJw.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

let’s use this information to extract the password hashes

For that, we need the memory locations of the “SAM” and “SYSTEM”

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot6_1609157562389.vmem hashdump --profile=Win7SP1x64 -y 0xfffff8a000024010 -s 0xfffff8a000cf8010 > hashs.txt
Volatility Foundation Volatility Framework 2.6.1
</code></pre>
</div>

- Use `-y` for the SYSTEM hash and `-s` for the SAM hash.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*-hWl_hNWIBkcULnE5Ys2Zw.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

hashdump = Dumps user hashes from memory

This is the hash dump file

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*l7421F9H-a8t5OpjQUuRCA.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Time to bring in my favorite tool Hashcat to crack John’s hash.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*D0L-yX9kjd_pZ4HoPC6zpA.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Question 1 =✅

<div style="background: #181c20; border: 2.5px solid #e74c3c; border-radius: 12px; padding: 22px 26px; margin: 36px 0 32px; box-shadow: 0 4px 18px rgba(231,76,60,0.10); color: #f8f8f2; font-size: 1.13em; font-family: 'Fira Mono', 'Consolas', monospace;">
  <div style="font-weight: bold; font-size: 1.22em; letter-spacing: 0.04em; color: #ff5555; margin-bottom: 10px;">
    We’ve been given the following file:
  </div>
  <div style="margin-bottom: 12px;">
    <strong>File:</strong><br>
    Snapshot19_1609159453792.vmem<br>
  </div>
</div>

Goal :

1. When was the machine last shutdown?
2. What did John write?
If we check the command using `python2 vol.py -h`,
we can see this plugin: Print ShutdownTime of the machine from the registry.

<div class="alert-warning">
<strong>Note</strong>: Always remember to use **--profile=** first.
</div>

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot19_1609159453792.vmem --profile=Win7SP1x64 shutdowntime 
Volatility Foundation Volatility Framework 2.6.1
Registry: SYSTEM
Key Path: ControlSet001\Control\Windows
Key Last updated: 2020-12-27 22:50:12 UTC+0000
Value Name: ShutdownTime
Value: 2020-12-27 22:50:12 UTC+0000
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*OUXPeAIDouCEBwsJceNJEQ.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Same process, if you’re new to using this tool like me, you’ll need to use the manual with -h.

For this, we need to use the plugin cmdscan, which extracts command history by scanning for **_COMMAND_HISTORY**.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot19_1609159453792.vmem --profile=Win7SP1x64 cmdscan      
Volatility Foundation Volatility Framework 2.6.1
**************************************************
CommandProcess: conhost.exe Pid: 2488
CommandHistory: 0x21e9c0 Application: cmd.exe Flags: Allocated, Reset
CommandCount: 7 LastAdded: 6 LastDisplayed: 6
FirstCommand: 0 CommandCountMax: 50
ProcessHandle: 0x60
Cmd #0 @ 0x1fe3a0: cd /
Cmd #1 @ 0x1f78b0: echo THM{You_found_me} > test.txt
Cmd #2 @ 0x21dcf0: cls
Cmd #3 @ 0x1fe3c0: cd /Users
Cmd #4 @ 0x1fe3e0: cd /John
Cmd #5 @ 0x21db30: dir
Cmd #6 @ 0x1fe400: cd John
Cmd #15 @ 0x1e0158: "
Cmd #16 @ 0x21db30: dir
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*0sYklnx3GJdRqxER5kdLww.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Question 2 =✅

<div style="background: #181c20; border: 2.5px solid #e74c3c; border-radius: 12px; padding: 22px 26px; margin: 36px 0 32px; box-shadow: 0 4px 18px rgba(231,76,60,0.10); color: #f8f8f2; font-size: 1.13em; font-family: 'Fira Mono', 'Consolas', monospace;">
  <div style="font-weight: bold; font-size: 1.22em; letter-spacing: 0.04em; color: #ff5555; margin-bottom: 10px;">
    We’ve been given the following file:
  </div>
  <div style="margin-bottom: 12px;">
    <strong>File:</strong><br>
    Snapshot14_1609164553061.vmem<br>
  </div>
</div>

Goal:

1. What is the TrueCrypt passphrase?
If we check the command using python2 vol.py -h

we can see this plugin truecryptpassphrase = TrueCrypt Cached Passphrase Finder

<div class="alert-warning">
<strong>Note</strong>: Always remember to use --profile= first.
</div>

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot14_1609164553061.vmem --profile=Win7SP1x64 truecryptpassphrase 
Volatility Foundation Volatility Framework 2.6.1
Found at 0xfffff8800512bee4 length 11: forgetmenot
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*xAsSGAUfHBoRv1HDBHR_eg.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Question 3 =✅

