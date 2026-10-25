# Tobias Guta - Cybersecurity Portfolio

A retro cyberpunk cybersecurity portfolio, CTF walkthroughs, pentesting research, project directory, and interactive terminal built as a high-performance React application using Vite and TypeScript.

## Features

- **Retro Cyberpunk Interface**: Authentic CRT scanlines, 3D animated wireframe header, twinkling star rows, glitch animations, and custom skull cursor.
- **Interactive Terminal**: Custom terminal (`root@cyberzone:~$`) supporting commands including `help`, `whoami`, `ls certs/`, `cat projects.txt`, `nmap whoistob1as.me`, `grid` (grid mode theme toggle), and `clear`.
- **Public Project Archive**: Automatic GitHub repository loader with metadata, topics, star/fork counts, and fallback to local static data.
- **Writeup Catalog & Search**: Categorized writeup archive with real-time search filtering, tag navigation, and locked/unlocked posts.
- **Single Writeup View**: Full markdown writeup viewer with reading progress indicator, locked status panels, previous/next pager, and copy link action.
- **Outlook Express 98 Contact Form**: Retro 90s mail client with title-bar controls (minimize, maximize, close) and live terminal validation error stream.
- **Lost Packet Mini-Game (404)**: Interactive 20-second packet trace mini-game with score tracking and recovery routes.
- **Tron Light Cycle Arena**: Canvas-rendered dual light cycle animation with pause/play controls.
- **Persistent YouTube Soundtrack Player**: Hackers OST soundtrack player with play/pause, volume control, mute toggle, and sessionStorage persistence.

## Tech Stack

- **Framework**: React 19, TypeScript
- **Bundler**: Vite
- **Styling**: Cyberpunk CSS with custom CRT filters, scanlines, and retro animations
- **Data**: Static project and writeup records with live API fallbacks

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```
