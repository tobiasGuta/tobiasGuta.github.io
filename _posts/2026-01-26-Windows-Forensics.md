---
layout: post
title: "Windows Forensics"
date: 2026-01-26
categories: [my-research]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*8vIZ7xENqLJqI9C9ZLBKvA.png
permalink: /blog/Windows-Forensics
locked: false
---

One of the Desktops in the research lab at Organization X is suspected to have been accessed by someone unauthorized. Although they generally have only one user account per Desktop, there were multiple user accounts observed on this system. It is also suspected that the system was connected to some network drive, and a USB device was connected to the system. The triage data from the system was collected and placed on the attached VM. Can you help Organization X with finding answers to the below questions?

> 1) How many user created accounts are present on the system? 

Based on the available logs, navigate to `C:\Windows\System32\config\SAM`. The SAM hive contains user account, login, and group information, primarily under `SAM\Domains\Account\Users`.

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*cOWowwnx-k6MLYeF_22hsA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

> 2) What's the password hint for the user THM-4n6?

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*NIsIYnyzuHqy6BD6LxgJRQ.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

> 3) When was the file 'Changelog.txt' accessed?

navigate to `C:\Users\THM-4n6NTUSER.DAT` This information is stored in the NTUSER hive and can be found on the following location:

`NTUSER.DAT\Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs`

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*yE1oWyT8moAmW90IimXh0A.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>

> 4) When was the USB device with the friendly name 'USB' last connected?

The following locations keep track of USB keys plugged into a system. These locations store the vendor id, product id, and version of the USB device plugged in and can be used to identify unique devices. These locations also store the time the devices were plugged into the system.

`SYSTEM\CurrentControlSet\Enum\USBSTOR`

`SYSTEM\CurrentControlSet\Enum\USB`

Registry Explorer shows this information in a nice and easy-to-understand way. 

<img 
  src="https://miro.medium.com/v2/resize:fit:2000/format:webp/1*qT03JA4XyB0so6xUwRxXwA.png"
  alt="Website initial view"
  class="zoomable-img"
  style="border: 2px solid #ccc; border-radius: 10px; cursor: zoom-in;"
/>