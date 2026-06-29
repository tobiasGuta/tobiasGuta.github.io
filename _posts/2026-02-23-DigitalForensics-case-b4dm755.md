---
layout: post
title: "Digital Forensics Case B4DM755"
date: 2026-02-21
categories: [my-research, walkthrough, tryhackme]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*0Ve6kSni0lba9WNzq6tPyg.png
permalink: /blog/Case-B4DM755
locked: false
---

As a Forensics Lab Analyst, you analyse the artefacts from crime scenes. Occasionally, the law enforcement agency you work for receives "intelligence reports" about different cases, and today is one such day. A trusted informant, who has connections to an international crime syndicate, contacted your supervisor about William S. McClean from Case #B4DM755.

The informant provided information about the suspect's whereabouts in Metro Manila, Philippines, which is currently at large, and a transaction that will happen today with a local gang member. They also knew the exact location of the meetup and that the suspect would have incriminating materials at the time.

The law enforcement agency prepared for the operation by obtaining proper search authority and assigning a DFIR (Digital Forensics & Incident Response) First Responder (i.e., you) to ensure the appropriate acquisition of digital artefacts and evidence for examination at the Forensics Lab, and eventually for use in litigation. The court issued a search warrant on the same day, allowing law enforcement officers to investigate the suspect and his place of residence based on the informant's tip.

1) What is the visible extension of the "hideout" file?

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*OlQkAplFDV04ztH_uROdFA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

2) View the metadata of the "hideout" file. What is its actual extension?

<div class="code-block-container">
  <span class="code-lang-tag">Terminal</span>
  <button class="copy-btn" onclick="copyCode(this)" title="Copy code">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </button>
  <pre><code class="Terminal">
$targetDir = 'C:\Users\analyst\Desktop\artefacts\[root]\'

Get-ChildItem -LiteralPath $targetDir -File -Recurse | ForEach-Object {
    # Run ExifTool, redirect errors to $null
    $rawOutput = C:\tools\exiftool-12.47\exiftool.exe -s3 -FileTypeExtension $_.FullName 2>$null
    
    # Only proceed if ExifTool actually returned a value
    if ($rawOutput) {
        # By wrapping $rawOutput in double quotes, we safely force it into a string
        $trueExt = "$rawOutput".Trim().ToLower()
        $currentExt = $_.Extension.TrimStart('.').ToLower()
        
        # Check for a mismatch
        if ($trueExt -ne $currentExt) {
            [PSCustomObject]@{
                FileName     = $_.Name
                CurrentExt   = $currentExt
                TrueExt      = $trueExt
                FullPath     = $_.FullName
            }
        }
    }
} | Format-Table -AutoSize
</code></pre>
</div>

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*L50M3H55LfU-hw-XmzWFMg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

3) A phone was used to photograph the "hideout". What is the phone's model?

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*rbYeWqMIYSrv68nARgfPFg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

4) A phone was used to photograph the "warehouse". What is the phone's model?

<img 
  src="https://miro.medium.com/v2/resize:fit:2000format:webp/1*bXAcrASk1AR5wbZOvezjjA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

5) Who was the point of contact of Mr William S. McClean in 2022?

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*cTpgU6Tw34n4ItF_KN3amA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

6) A meetup occurred in 2022. What are the GPS coordinates during that time?

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*dZvMr9BDsHwwI75x8iQfRg.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

7) What is the password to extract the contents of pandorasbox.zip?

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*NVxkGlQJAx_MQOJ3j93RWw.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>
