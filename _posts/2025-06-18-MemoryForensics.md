---
layout: post
title: "Memory Forensics"
date: 2025-06-18
categories: [blog, cybersecurity]
tags: [Redteam, pentesting, bugbounty, ctf]
image: https://miro.medium.com/v2/resize:fit:720/format:webp/1*NhMg-i3CUBJosC48m0k_sw.png
permalink: /blog/memory-forensics/
---


# What Is Volatility
------------------

Volatility is a powerful open source framework for memory forensics. It allows investigators to analyze memory dumps and uncover evidence of system activity, malware behavior, and user actions. The framework is cross platform, modular, and designed for extensibility, making it a staple tool in incident response and forensic investigations.

The latest version, Volatility 3, marks a significant improvement over earlier releases. Previous versions relied on static operating system profiles, which required predefined knowledge about the OS version and structure. Volatility 3 replaces this with dynamic symbol resolution, allowing it to adapt to modern operating systems, updated kernel structures, and varied memory layouts without the need for manual profile management.

In short, Volatility 3 is faster, more flexible, and better suited for analyzing contemporary systems.

* * * * *

Architectural Overview of Volatility 3
--------------------------------------

Volatility 3 is built on a clean, layered architecture that separates memory access, symbol resolution, and forensic logic. Understanding these core components helps clarify how the tool extracts meaningful data from raw memory.

#### Memory Layers

Memory layers represent the structure of address spaces in a system. They start with the raw physical memory and build upward into higher level views such as virtual address spaces. This layered approach allows analysts to traverse memory in a logical way, from bytes to processes and kernel structures.

#### Symbol Tables

Symbol tables provide a map of operating system structures by using debugging symbols. These symbols allow Volatility to interpret data in memory correctly, even across different operating system versions. Dynamic symbol resolution in Volatility 3 eliminates the need for static profiles, enabling greater compatibility and flexibility.

#### Plugins

Plugins are modular components that perform specific forensic tasks. Each plugin uses memory layers and symbol tables to locate and extract information such as running processes, loaded drivers, network connections, command histories, and more. They form the core of practical memory analysis with Volatility.

we will explore key plugins and how they are used in real investigations.

#### Memory Forensics: Finding the Flags

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

# Memory Acquisition
------------------

Before any memory analysis can take place, the most critical step is **memory acquisition**. This process involves capturing the contents of a system's RAM and storing it in a file, typically referred to as a **memory image** or **memory dump**. Since RAM is volatile and its contents are lost on shutdown, acquisition must be done carefully, and preferably live, to preserve evidence of in-memory activity.

#### Why Memory Acquisition Matters

RAM contains a wealth of forensic data that does not exist on disk. This includes:

-   Running processes and their memory space

-   Loaded kernel modules and drivers

-   Network connections and open sockets

-   In-memory malware or fileless payloads

-   Command history and decrypted content

-   Registry hives, clipboard contents, and other transient data

This type of evidence is invaluable in cases involving malware analysis, incident response, insider threats, and advanced persistent threats.

#### Challenges in Memory Acquisition

Capturing memory is not without challenges:

-   **Anti forensic techniques**: Some malware actively attempts to detect and interfere with memory acquisition tools.

-   **System instability**: Poorly implemented tools can crash the system or corrupt the dump.

-   **Footprint**: Acquisition tools must be executed on the live system, so they inevitably leave traces in memory.

-   **Integrity and trust**: Acquiring memory from a compromised system means you cannot fully trust the environment.

Because of this, choosing the right tool and method is essential.

#### Memory Acquisition Tools

There are several tools commonly used to acquire memory safely:

-   **DumpIt** Lightweight and commonly used on Windows. Ideal for quick captures with minimal user interaction.

-   **FTK Imager** Includes memory acquisition capabilities and can export in raw format.

-   **Belkasoft RAM Capturer** Another lightweight tool focused on reliability.

-   **AVML** A Microsoft-supported tool for memory acquisition on Linux.

-   **LiME (Linux Memory Extractor)** Kernel module based acquisition tool for Linux.

-   **WinPMEM** From the Rekall project, supports raw and AFF4 formats on Windows.

Each tool has tradeoffs regarding format, footprint, and compatibility. Always test in advance in a controlled environment to determine what works best for your target systems.

### Memory Acquisition on Linux and macOS

Acquiring memory on Unix-based systems requires platform-specific tools that can handle the nuances of each operating system's memory management. The following tools are commonly used for Linux and macOS memory acquisition:

-   **AVML (Azure Virtual Machine Memory Leak)**
    A lightweight command line utility developed by Microsoft for Linux memory acquisition. AVML captures the contents of physical memory and saves it in a compressed ELF core dump format. It does not require loading a kernel module, making it safer to use on production systems and in environments with strict security policies.

-   **LiME (Linux Memory Extractor)**
    A loadable kernel module that provides full memory capture capabilities for Linux systems. LiME can write memory images to disk or transmit them over the network in real time. It supports multiple architectures, including ARM and x86, making it suitable for both servers and embedded systems.

-   **OSXPmem**
    A macOS-specific memory acquisition tool, forked from the Pmem module. OSXPmem is designed to capture raw physical memory on Intel-based macOS systems and is compatible with Volatility for post-acquisition analysis. Support for newer Apple Silicon (ARM-based) systems is limited or non-existent at this time.

### Memory Acquisition in Virtual Environments
------------------------------------------

Extracting memory from virtual machines offers unique advantages in forensic investigations. Since virtual environments abstract hardware access, it's often possible to acquire memory snapshots without introducing artifacts into the guest system. This approach is ideal for incident response, malware analysis, and research, as it allows analysts to freeze and inspect the system at a specific point in time.

Most hypervisors offer mechanisms to dump the memory of a running virtual machine. However, the format and completeness of the dump depend on the hypervisor in use. Below are some common formats you are likely to encounter:

-   **VMware (.vmem)**
    VMware creates `.vmem` files that contain the full physical memory of a guest machine. These files are typically located in the virtual machine's directory and are generated while the machine is running or suspended. Volatility and other tools can parse these directly.

-   **Hyper-V (.bin)**
    Microsoft's Hyper-V hypervisor uses `.bin` files to store guest memory content. These are often accompanied by `.vsv` or `.vmrs` files, which store saved state data. Proper interpretation of these files may require conversion or additional parsing depending on the acquisition goal.

-   **Parallels (.mem)**
    Parallels Desktop for macOS stores suspended guest memory in `.mem` files. These are used similarly to `.vmem` files from VMware and can be analyzed using supported tools, assuming compatibility with the guest OS and memory layout.

-   **VirtualBox (.sav)**
    Oracle VirtualBox creates `.sav` files when a VM is paused or saved. However, this file only contains a **partial memory dump**, primarily for restoring the system state. It is not guaranteed to hold a full and contiguous physical memory image, which can limit its usefulness for forensic analysis.

### Important Considerations

-   **Completeness**: Not all virtual memory formats store complete system RAM. For example, VirtualBox `.sav` files may lack memory pages not marked as active or required for resumption.

-   **Encryption and Compression**: Some hypervisors compress or encrypt memory dumps. Decompression or decryption may be required before analysis.

-   **Tool Support**: Ensure that your analysis tool, such as Volatility or Rekall, supports the memory dump format you are working with. In some cases, conversion to a raw format may be needed.

When available, exporting a VM snapshot and then extracting memory from that snapshot provides a clean, non-invasive acquisition method that maintains system integrity and avoids in-guest modifications.

### Best Practices

-   **Use trusted acquisition media**: Run tools from clean USB drives or external media.

-   **Document system state**: Note time, logged in users, visible processes, and system behavior.

-   **Verify integrity**: Generate and store hashes of memory dumps immediately after acquisition.

-   **Preserve chain of custody**: Handle all images as evidence, with clear logging and secure storage.

### Volatility Plugins
------------------

Volatility relies on a **plugin-based architecture** to extract and analyze data from memory images. Each plugin is a modular component designed to perform a specific task, such as listing processes, inspecting kernel modules, or extracting credentials. Plugins interact with the underlying memory layers and symbol tables to interpret system structures in memory.

Below are some of the most commonly used and essential plugins across different operating systems:

#### Cross-Platform Plugins

-   **`pslist`**
    Lists active processes by walking the operating system's process list. This is a core plugin used to establish what was running at the time of acquisition. It relies on active system structures, so it can miss terminated or hidden processes.

-   **`pstree`**
    Provides a hierarchical view of running processes, showing parent-child relationships. This helps analysts identify suspicious process chains, such as a legitimate process spawning a malicious child.

* * * * *

#### Windows-Specific Plugins

-   **`windows.info`**
    Displays basic metadata about the memory image, including OS version, build number, architecture, and time the memory was captured. This information is critical for determining the appropriate symbol table and understanding the environment.

-   **`windows.pslist`**
    Similar to the generic `pslist`, but uses Windows-specific methods to enumerate processes. Often used in combination with other Windows plugins to build a timeline or identify anomalies.

* * * * *

#### Linux-Specific Plugins

-   **`linux.info`**
    Outputs system-level metadata for Linux memory images, including kernel version, system architecture, and symbol base addresses. This plugin is useful for verifying that the correct symbols are being applied.

-   **`linux.pslist`**
    Enumerates running processes on a Linux system. It is often the first plugin run when analyzing Linux memory, as it provides a snapshot of what was executing at the time of capture.

#### Active Process Enumeration

The simplest method for listing processes is using `pslist`. This tool enumerates active processes by traversing the doubly linked list in memory that tracks all running processes essentially the same list that the Task Manager uses.

The output from `pslist` includes both currently active processes and those that have recently terminated, along with their respective exit times. This makes it a straightforward way to get an overview of the system's process activity.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot6_example.vmem windows.pslist
</code></pre>
</div>

#### Hidden Process Enumeration

Certain types of malware, especially rootkits, attempt to conceal their presence by unlinking their processes from the standard process list. When this happens, tools like `pslist` fail to display these hidden processes because they rely on traversing the active process list.

To detect these stealthy processes, security professionals use `psscan`. Unlike `pslist`, `psscan` locates processes by scanning memory for data structures that match the `_EPROCESS` signature, rather than relying on the linked list of active processes. This approach allows it to identify processes that have been unlinked and are otherwise invisible.

While `psscan` is a powerful countermeasure against process hiding, it is important to be aware that it may produce false positives. Some data structures found in memory may resemble `_EPROCESS` but do not correspond to active or malicious processes. Therefore, analysts must carefully validate the results to avoid misinterpretation.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot6_example.vmem windows.psscan
</code></pre>
</div>

### Process Hierarchy Enumeration

The pstree plugin does not employ specialized evasion detection techniques like pslist or psscan. Instead, it lists processes based on their parent process IDs, using the same underlying method as pslist.

This hierarchical view provides valuable context by showing the relationship between processes, helping analysts reconstruct the sequence of events and understand what was happening on the system at the time of extraction.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot6_example.vmem windows.pstree
</code></pre>
</div>

#### File, Registry, and Thread Enumeration

In addition to processes, enumerating files, registry keys, and threads is critical for comprehensive system analysis.

-   **File Enumeration** involves scanning the system for open file handles, which can reveal hidden or malicious files in use by running processes. Identifying these files helps uncover malware that attempts to blend into the filesystem.

-   **Registry Enumeration** focuses on extracting and examining registry keys and values. Since malware often persists by modifying registry entries, analyzing the registry can expose startup persistence mechanisms, configuration data, or other malicious modifications.

-   **Thread Enumeration** lists the individual threads running within processes. Analyzing threads provides insight into a process's behavior and execution context, which can help detect suspicious activity such as injected or malicious threads.

To dive deeper into file and thread details, we can use the `handles` plugin. This tool provides a granular view of the handles open on the host, helping analysts trace resource usage and uncover hidden or unauthorized activity.

Together, these enumeration techniques complement process analysis by providing a fuller picture of system activity, aiding in uncovering stealthy malware and indicators of compromise.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot6_example.vmem windows.handles
</code></pre>
</div>

#### Network Connection Enumeration

Understanding active network connections is essential for detecting malicious communication and lateral movement within a compromised system.

The `netstat` plugin scans memory to identify all network connection structures currently in use. By examining these memory artifacts, it reveals active TCP and UDP connections, listening ports, and associated process information.

This memory-based enumeration can uncover stealthy network activity that traditional tools might miss, especially when malware manipulates standard system calls to hide its connections.

However, it’s important to note that in the current state of Volatility 3, the netstat plugin can be unstable especially when analyzing older Windows builds. To work around this limitation, analysts often turn to complementary tools like [bulk_extractor](https://www.kali.org/tools/bulk-extractor/), which can extract PCAP files directly from memory dumps. This approach sometimes provides clearer insight into network activity that Volatility alone fails to reveal.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot6_example.vmem windows.netstat
</code></pre>
</div>

#### TCP and UDP Socket Enumeration

Network sockets and their associated processes can be identified directly from a memory image. The `netscan` plugin performs this by scanning memory pools to recover both active and closed TCP and UDP connections.

This plugin provides details such as process IDs, local and remote IP addresses, and port numbers. By correlating sockets with processes, analysts gain critical visibility into network communications, helping to detect unauthorized connections and suspicious activity.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot6_example.vmem windows.netscan
</code></pre>
</div>

#### DLL Enumeration

The final plugin to cover is `dlllist`. This tool enumerates all DLLs loaded by processes at the time of memory capture.

DLL enumeration is especially valuable after deeper analysis, as it allows you to filter for specific DLLs that may indicate the presence of particular malware families or suspicious code injections. Tracking loaded DLLs can reveal hidden or unauthorized modules running within legitimate processes.

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="terminal">
<span class="terminal-prompt">root@hacktheword:~$</span> python2 vol.py -f Snapshot6_example.vmem windows.dlllist
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

