---
layout: post
title: "Event Viewing (PicoCTF)"
date: 2025-06-13
categories: [blog, cybersecurity]
tags: [Redteam, pentesting, bugbounty, ctf]
---

<img 
  src="https://art.vx-underground.org/art/pancak3_giant_all-seeing_eye_glowing_neon_red_cables_retro_cybe_ea231a51-2642-42ce-b800-7f860e1f6a66.png" 
  alt="Set up Listener" 
  width="600" 
  style="
    display: block;
    margin: 50px auto 40px;
    border-radius: 18px;
    border: 2.5px solid #111; /* crisp black border */
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12); /* soft black shadow */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  "
  onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 15px 35px rgba(0, 0, 0, 0.25)';"
  onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 10px 25px rgba(0, 0, 0, 0.12)';"
/>

<div style="background: #181c20; border: 2.5px solid #e74c3c; border-radius: 12px; padding: 22px 26px; margin: 36px 0 32px; box-shadow: 0 4px 18px rgba(231,76,60,0.10); color: #f8f8f2; font-size: 1.13em; font-family: 'Fira Mono', 'Consolas', monospace;">
  <div style="font-weight: bold; font-size: 1.22em; letter-spacing: 0.04em; color: #ff5555; margin-bottom: 10px;">
    Challenge: Event-Viewing (PicoCTF)
  </div>
  <div style="margin-bottom: 12px;">
    <strong>Description:</strong><br>
    One of the employees at your company has their computer infected by malware! Turns out every time they try to switch on the computer, it shuts down right after they log in. The story given by the employee is as follows:
They installed software using an installer they downloaded online
They ran the installed software but it seemed to do nothing
Now every time they bootup and login to their computer, a black command prompt screen quickly opens and closes and their computer shuts down instantly.
See if you can find evidence for the each of these events and retrieve the flag (split into 3 pieces) from the correct logs!<br>
  </div>
  <a href="https://challenge-files.picoctf.net/c_verbal_sleep/123d9b79cadb6b44ab6ae912f25bf9cc18498e8addee851e7d349416c7ffc1e1/Windows_Logs.evtx" style="color: #ffb86c; text-decoration: underline; font-weight: bold;">
    &#128190; Download the Windows Log file: Windows_Logs.evtx
  </a>
</div>

Before diving in, it's important to note that there are two main ways to analyze Windows event logs:  
1. **Event Viewer GUI** the built-in graphical tool in Windows, which is user-friendly if you're comfortable navigating through its menus.
2. **PowerShell scripts** a more flexible and powerful option, especially for filtering and searching large log files.

For this challenge, I'll be using PowerShell, as it allows for precise searching and automation perfect for CTF scenarios where speed and accuracy matter. If you're new to PowerShell, don't worry! I'll walk through the exact script I used below:

<div class="code-block-container">
  <span class="code-lang-tag">Powershell</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Learning-Powershell">
$events = Get-WinEvent -Path &quot;C:\Users\users\Downloads\Windows_Logs.evtx&quot;

$filteredEvents = $events | Where-Object { $_.Id -eq 1074 }

$parsed = $filteredEvents | ForEach-Object {
    [xml]$xml = $_.ToXml()

    $stringBuilder = New-Object System.Text.StringBuilder
    $xmlWriterSettings = New-Object System.Xml.XmlWriterSettings
    $xmlWriterSettings.Indent = $true
    $xmlWriterSettings.OmitXmlDeclaration = $true
    $xmlWriter = [System.Xml.XmlWriter]::Create($stringBuilder, $xmlWriterSettings)
    $xml.WriteTo($xmlWriter)
    $xmlWriter.Flush()
    $prettyXml = $stringBuilder.ToString()

    # Setup namespace manager for XPath
    $nsMgr = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $nsMgr.AddNamespace(&quot;e&quot;, &quot;http://schemas.microsoft.com/win/2004/08/events/event&quot;)

    # Extract nodes with namespace-aware XPath
    $dataNodes = $xml.SelectNodes(&quot;//e:EventData/e:Data&quot;, $nsMgr)
    $dataFields = foreach ($node in $dataNodes) {
        $name = if ($node.Attributes[&quot;Name&quot;]) { $node.Attributes[&quot;Name&quot;].Value } else { &quot;Unknown&quot; }
        $val = if ($node.'#text') { $node.'#text' } else { &quot;null&quot; }
        [PSCustomObject]@{
            Name  = $name
            Value = $val
        }
    }

    # System nodes extraction with safety
    $system = $xml.SelectSingleNode(&quot;//e:System&quot;, $nsMgr)

    $providerName   = $system.SelectSingleNode(&quot;e:Provider&quot;, $nsMgr).GetAttribute(&quot;Name&quot;)
    $eventRecordID  = $system.SelectSingleNode(&quot;e:EventRecordID&quot;, $nsMgr).InnerText
    $execution      = $system.SelectSingleNode(&quot;e:Execution&quot;, $nsMgr)
    $processID      = $execution.GetAttribute(&quot;ProcessID&quot;)
    $threadID       = $execution.GetAttribute(&quot;ThreadID&quot;)
    $channel        = $system.SelectSingleNode(&quot;e:Channel&quot;, $nsMgr).InnerText
    $computer       = $system.SelectSingleNode(&quot;e:Computer&quot;, $nsMgr).InnerText
    $security       = $system.SelectSingleNode(&quot;e:Security&quot;, $nsMgr)
    $userID         = if ($security) { $security.GetAttribute(&quot;UserID&quot;) } else { &quot;Unknown&quot; }
    $version        = $system.SelectSingleNode(&quot;e:Version&quot;, $nsMgr).InnerText
    $level          = $system.SelectSingleNode(&quot;e:Level&quot;, $nsMgr).InnerText
    $task           = $system.SelectSingleNode(&quot;e:Task&quot;, $nsMgr).InnerText
    $opcode         = $system.SelectSingleNode(&quot;e:Opcode&quot;, $nsMgr).InnerText

    # Build PSCustomObject with full info
    [PSCustomObject]@{
        TimeCreated    = $_.TimeCreated
        EventID        = $_.Id
        EventRecordID  = $eventRecordID
        ProviderName   = $providerName
        Version        = $version
        Level          = $level
        Task           = $task
        Opcode         = $opcode
        ProcessID      = $processID
        ThreadID       = $threadID
        Channel        = $channel
        Computer       = $computer
        UserID         = $userID
        DataValues     = $dataFields
        PrettyXml      = $prettyXml
    }
}

# Output: With colors and flagged suspicious data
foreach ($entry in $parsed) {
    Write-Host &quot;─────────────── EVENT ───────────────&quot; -ForegroundColor Cyan
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;TimeCreated&quot;,    $entry.TimeCreated)    -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;EventID&quot;,        $entry.EventID)        -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;EventRecordID&quot;,  $entry.EventRecordID)  -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;ProviderName&quot;,   $entry.ProviderName)   -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;Version&quot;,        $entry.Version)        -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;Level&quot;,          $entry.Level)          -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;Task&quot;,           $entry.Task)           -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;Opcode&quot;,         $entry.Opcode)         -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;ProcessID&quot;,      $entry.ProcessID)      -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;ThreadID&quot;,       $entry.ThreadID)       -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;Channel&quot;,        $entry.Channel)        -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;Computer&quot;,       $entry.Computer)       -ForegroundColor Yellow
    Write-Host (&quot;{0,-15}: {1}&quot; -f &quot;UserID&quot;,         $entry.UserID)         -ForegroundColor Yellow
    Write-Host &quot;DataValues     :&quot; -ForegroundColor Green

    foreach ($field in $entry.DataValues) {
        $highlight = $false
        $val = $field.Value

        # Flag suspicious patterns (encoded payloads, shutdowns, .exe, etc.)
        if ($val -match &quot;shutdown|.exe|MXNfYV|[A-Za-z0-9+/=]{16,}&quot;) {
            $highlight = $true
        }

        if ($highlight) {
            Write-Host (&quot;  - {0,-20} : {1}&quot; -f $field.Name, $val) -ForegroundColor Red
        } else {
            Write-Host (&quot;  - {0,-20} : {1}&quot; -f $field.Name, $val) -ForegroundColor Green
        }
    }

    Write-Host &quot;─────────────────────────────────────`n&quot;
}
</code></pre>
</div>

The part of the script you'll want to focus on is this line:

<div class="code-block-container">
  <span class="code-lang-tag">Powershell</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="learning-powershell">
$filteredEvents = $events | Where-Object { $_.Id -eq 1074 }
</code></pre>
</div>

This line filters the event logs to only show events with a specific Event ID in this case, `1074`. If you want to investigate different types of events, simply change the number to the Event ID you're interested in. For example, you could use `4624` for logon events or `4688` for process creation events. This makes it easy to adapt the script to whatever evidence you need to find for the challenge.

To decide which Event IDs to search for, let's break down the employee's story step by step:

1. They installed software using an installer they downloaded online.
2. They ran the installed software, but it seemed to do nothing.
3. Now, every time they boot up and log in to their computer, a black command prompt screen quickly opens and closes, and the computer shuts down instantly.

By mapping each part of the story to relevant Windows event types, we can choose the right Event IDs to investigate and uncover evidence for each stage of the incident.

To identify the correct Event IDs for each step, I searched online for which Windows Event IDs correspond to software installation, program execution, and shutdown events. This helps ensure we're filtering the logs for the most relevant evidence at each stage of the incident.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*R32VrWy1wvjCBUXvJWQyRw.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

Remeber: change the number to the Event ID you're interested in.

<div class="alert-error">
<strong>Remeber:</strong> change the number to the Event ID you're interested in.
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*01v3KXk4mhBvM_Op-Cp-RA.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

The flag is encoded in base64 within the logs. Once you decode it, you'll have the first part of the flag.

To get the second part of the flag, I tried checking for new services, startup events, and other common indicators, but couldn't find anything obvious. So, I moved on to the third part of the story. Since it mentions that "every time they boot up and log in, a black command prompt screen quickly opens and closes, and the computer shuts down instantly," I suspected there might be a scheduled task or a registry modification causing this behavior. That led me to focus my search on registry key modifications in the event logs.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*niUt1eJcBfp4OT7UPb7MiA.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*8DF0p5h86egqzsPwH0zWxA.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

The flag is encoded in base64 within the logs. Once you decode it, you'll have the second part of the flag.

For the last part, I initially tried searching for crash events or the name of the suspicious .exe file, but didn't find any useful results. Eventually, I discovered that looking for the shutdown event ID led me to the evidence I needed.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ObYdNR_PjBSuoawNkpH3Qg.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*eyfFqniB6kbk4JHDh9YWAA.png"
  alt="No Detection"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

The flag is encoded in base64 within the logs. Once you decode it, you'll have the third part of the flag.