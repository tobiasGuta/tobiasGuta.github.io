/*
  Homepage interactions for the portfolio.
  Keep small visual effects here so index.html stays focused on content.
*/
  // Reading progress bar for writeups
  const readingProgressFill = document.getElementById('reading-progress-fill');
  if (readingProgressFill) {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
      readingProgressFill.style.width = `${progress}%`;
    };

    updateReadingProgress();
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress);
  }

  // Writeup archive search
  const writeupSearchInput = document.getElementById('writeup-search-input');
  const writeupCards = Array.from(document.querySelectorAll('[data-writeup-card]'));
  const writeupEmpty = document.getElementById('writeup-search-empty');

  if (writeupSearchInput && writeupCards.length) {
    const categories = Array.from(document.querySelectorAll('.writeup-category'));

    const updateWriteupSearch = () => {
      const query = writeupSearchInput.value.trim().toLowerCase();
      let visibleCount = 0;

      writeupCards.forEach(card => {
        const matches = !query || card.textContent.toLowerCase().includes(query);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      categories.forEach(category => {
        const hasVisibleCard = Array.from(category.querySelectorAll('[data-writeup-card]')).some(card => !card.hidden);
        category.hidden = !hasVisibleCard && Boolean(query);
      });

      if (writeupEmpty) {
        writeupEmpty.classList.toggle('visible', visibleCount === 0);
      }
    };

    writeupSearchInput.addEventListener('input', updateWriteupSearch);
    updateWriteupSearch();
  }

  // Copy current post link
  const copyPostLink = document.getElementById('copy-post-link');
  if (copyPostLink) {
    const originalText = copyPostLink.textContent;

    const showCopyStatus = text => {
      copyPostLink.textContent = text;
      setTimeout(() => {
        copyPostLink.textContent = originalText;
      }, 1400);
    };

    copyPostLink.addEventListener('click', async () => {
      const url = window.location.href;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          const tempInput = document.createElement('input');
          tempInput.value = url;
          tempInput.setAttribute('readonly', '');
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          tempInput.remove();
        }
        showCopyStatus('COPIED');
      } catch (error) {
        showCopyStatus('FAILED');
      }
    });
  }

  // 404 lost packet mini-game
  const packetGame = document.getElementById('packet-game');
  if (packetGame) {
    const startButton = document.getElementById('packet-game-start');
    const target = document.getElementById('packet-target');
    const field = document.getElementById('packet-game-field');
    const scoreEl = document.getElementById('packet-game-score');
    const timeEl = document.getElementById('packet-game-time');
    const statusEl = document.getElementById('packet-game-status');
    let score = 0;
    let timeLeft = 20;
    let timerId = null;

    const movePacket = () => {
      const fieldRect = field.getBoundingClientRect();
      const targetSize = target.offsetWidth || 42;
      const maxX = Math.max(fieldRect.width - targetSize, 0);
      const maxY = Math.max(fieldRect.height - targetSize, 0);
      const x = Math.floor(Math.random() * maxX);
      const y = Math.floor(Math.random() * maxY);
      target.style.left = `${x}px`;
      target.style.top = `${y}px`;
    };

    const endGame = () => {
      clearInterval(timerId);
      timerId = null;
      target.classList.remove('visible');
      startButton.disabled = false;
      startButton.textContent = 'RETRACE';
      statusEl.textContent = score >= 10 ? 'ROUTE RESTORED' : 'TRACE LOST';
    };

    const startGame = () => {
      score = 0;
      timeLeft = 20;
      scoreEl.textContent = score;
      timeEl.textContent = timeLeft;
      statusEl.textContent = 'TRACING';
      startButton.disabled = true;
      startButton.textContent = 'RUNNING';
      target.classList.add('visible');
      movePacket();

      clearInterval(timerId);
      timerId = setInterval(() => {
        timeLeft -= 1;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
      }, 1000);
    };

    startButton.addEventListener('click', startGame);

    target.addEventListener('click', () => {
      if (!timerId) return;
      score += 1;
      scoreEl.textContent = score;
      statusEl.textContent = 'PACKET CAUGHT';
      target.classList.remove('caught');
      void target.offsetWidth;
      target.classList.add('caught');
      movePacket();
    });
  }

  // Random glitch effect on title
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const title = document.querySelector('.site-title');

  if (title && !reduceMotion) {
    setInterval(() => {
      if (Math.random() < 0.07) {
        title.style.transform =
          `skewX(${(Math.random() - 0.5) * 6}deg) ` +
          `translateX(${(Math.random() - 0.5) * 4}px)`;

        setTimeout(() => {
          title.style.transform = '';
        }, 80);
      }
    }, 400);
  }

  // Skill bars trigger on scroll / load
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.animationPlayState = 'running';
        });
      }
    });
  });
  document.querySelectorAll('.sidebar-box').forEach(b => observer.observe(b));

  // Interactive Terminal Logic
  const termInput = document.getElementById('terminal-input');
  const termHistory = document.getElementById('terminal-history');
  const termContainer = document.getElementById('interactive-terminal');

  if (termInput && termHistory && termContainer) {
    termInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const cmd = this.value.trim();
        if (!cmd) return;

        // Echo command
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="prompt">root@cyberzone</span>:<span class="terminal-path">~</span>$ <span class="cmd">${escapeHtml(cmd)}</span>`;
        termHistory.appendChild(cmdLine);

        // Process command
        const responseText = processCommand(cmd);
        if (responseText !== null) {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';
            responseLine.innerHTML = `<span class="output">${responseText}</span>`;
            termHistory.appendChild(responseLine);
        }

        // Clear input and scroll
        this.value = '';
        termContainer.scrollTop = termContainer.scrollHeight;
      }
    });

    function escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function processCommand(cmd) {
      const lowerCmd = cmd.toLowerCase();
      switch (lowerCmd) {
        case 'whoami':
          return 'NAME: TobiasGuta<br>SCHOOL: [REDACTED] University — BSc Cybersecurity<br>FOCUS: Penetration Testing | Web App Security | OSINT<br>HOBBIES: CTF competitions, Reverse Engineering, Soldering';
        case 'ls certs/':
        case 'ls certs':
          return 'GIAC.crt<br>NYC.crt<br>CompTIA_Security+.crt<br>Department_of_Education.crt';
        case 'cat projects.txt':
          return '1. DirFuzz-Mcp-Monitor - Web security testing & directory fuzzing engine.<br>2. sub-enum - Automated subdomain enumeration & recon tool.<br>3. SMB Audit Tool - SMB/Samba compliance and audit tool.';
        case 'nmap whoistob1as.me':
        case 'nmap':
          return 'Starting Nmap 7.94 ( https://nmap.org )<br>Nmap scan report for whoistob1as.me (127.0.0.1)<br>PORT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATE SERVICE<br>22/tcp&nbsp;&nbsp;&nbsp;open&nbsp;&nbsp;LINUX<br>80/tcp&nbsp;&nbsp;&nbsp;open&nbsp;&nbsp;PYTHON<br>443/tcp&nbsp;&nbsp;open&nbsp;&nbsp;WEB EXPLOITS<br>1337/tcp open&nbsp;&nbsp;CTF / OSINT<br>8080/tcp open&nbsp;&nbsp;SOCIAL ENG.<br>Nmap done: 1 IP address (1 host up) scanned in 1.33 seconds';
        case 'help':
          return 'Available commands:<br>&nbsp;&nbsp;whoami<br>&nbsp;&nbsp;ls certs/<br>&nbsp;&nbsp;cat projects.txt<br>&nbsp;&nbsp;nmap whoistob1as.me<br>&nbsp;&nbsp;help<br>&nbsp;&nbsp;clear';
        case 'clear':
          setTimeout(() => { termHistory.innerHTML = ''; }, 10);
          return null;
        default:
          return `bash: ${escapeHtml(cmd)}: command not found`;
      }
    }
  }

  // GitHub Stats Widget
  async function loadGitStats() {
    const reposEl = document.getElementById('git-repos-count');
    const starsEl = document.getElementById('git-stars-count');
    const langEl = document.getElementById('git-top-lang');

    if (!reposEl || !starsEl || !langEl) return;

    try {
      const res = await fetch('https://api.github.com/users/tobiasGuta/repos?per_page=100');
      if (!res.ok) throw new Error('API Error');
      const repos = await res.json();
      
      let totalStars = 0;
      const langCounts = {};
      let originalRepos = 0;

      repos.forEach(repo => {
        if (!repo.fork) {
            originalRepos++;
            totalStars += repo.stargazers_count || 0;
            if (repo.language) {
                langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
            }
        }
      });

      let topLang = 'N/A';
      let maxCount = 0;
      for (const [lang, count] of Object.entries(langCounts)) {
          if (count > maxCount) {
              maxCount = count;
              topLang = lang;
          }
      }

      reposEl.textContent = originalRepos;
      starsEl.textContent = totalStars;
      langEl.textContent = topLang;

    } catch (e) {
      reposEl.textContent = 'ERR';
      starsEl.textContent = 'ERR';
      langEl.textContent = 'ERR';
    }
  }

  loadGitStats();

  // Outlook 98 Contact Form Logic
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const errorTerminal = document.getElementById('form-error-terminal');
    
    // Window controls
    document.getElementById('outlook-close')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
    
    document.getElementById('outlook-min')?.addEventListener('click', () => {
      const body = document.getElementById('outlook-body');
      if (body.style.display === 'none') {
        body.style.display = 'block';
      } else {
        body.style.display = 'none';
      }
    });
    
    document.getElementById('outlook-max')?.addEventListener('click', () => {
      const body = document.getElementById('outlook-body');
      body.style.display = 'block'; // Maximize just ensures it's open for now
    });

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      
      const errors = [];
      
      if (!name) errors.push("field 'name' cannot be empty.");
      if (!email) {
        errors.push("field 'email' cannot be empty.");
      } else if (!email.includes('@')) {
        errors.push("field 'email' is missing '@' symbol.");
      }
      if (!subject) errors.push("field 'subject' cannot be empty.");
      if (!message) errors.push("field 'message' cannot be empty.");
      
      errorTerminal.classList.remove('hidden');
      
      if (errors.length > 0) {
        // Show errors
        errorTerminal.style.color = '#FF0000';
        errorTerminal.style.borderColor = '#FF0000';
        errorTerminal.innerHTML = errors.map(err => `<div class="terminal-line">> [FAIL] ERROR: ${err}</div>`).join('');
      } else {
        // Success
        errorTerminal.style.color = '#00FF00';
        errorTerminal.style.borderColor = '#00FF00';
        errorTerminal.innerHTML = `<div class="terminal-line">> [OK] Validation passed. Initiating relay to Formspree...</div>`;
        
        // Actually submit after a short delay for effect
        setTimeout(() => {
          contactForm.submit();
        }, 800);
      }
    });
  }

  // CTF Activity Feed
  function safeExternalUrl(value) {
    try {
      const url = new URL(String(value || ''), window.location.origin);

      if (!['http:', 'https:'].includes(url.protocol)) {
        return '';
      }

      return url.href;
    } catch {
      return '';
    }
  }

  async function loadCTFActivity() {
    const feedEl = document.getElementById('ctf-activity-feed');
    if (!feedEl) return;

    try {
      // For GitHub pages / relative paths
      const res = await fetch('assets/data/ctf.json');
      if (!res.ok) throw new Error('Failed to load CTF data');
      const activityData = await res.json();
      const data = Array.isArray(activityData) ? activityData : activityData.items || [];
      const escapeActivityText = value => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      
      let html = '<h3>[ ACTIVITY ]</h3>';
      data.forEach(item => {
        const title = escapeActivityText(item.challenge || item.title || 'Untitled activity');
        const meta = [item.platform, item.category, item.date].filter(Boolean).map(escapeActivityText).join(' • ');
        const link = item.link ? safeExternalUrl(item.link) : '';
        const action = link
          ? `<a class="action" href="${escapeActivityText(link)}">&#x2713; ${title}</a>`
          : `<div class="action">&#x2713; ${title}</div>`;

        html += `
          <div class="activity-item">
            ${action}
            <div class="time">${meta}</div>
          </div>
        `;
      });
      
      feedEl.innerHTML = html;
    } catch (e) {
      feedEl.innerHTML = '<h3>[ ACTIVITY ]</h3><div class="activity-item"><div class="time" style="color:red">Error loading feed</div></div>';
    }
  }

  loadCTFActivity();

  // Rotating Movie Quotes
  const hackersQuotes = [
    { text: "Mess with the best, die like the rest.", author: "Crash Override" },
    { text: "Hack the planet!", author: "Zero Cool" },
    { text: "There is no right and wrong, only fun and boring.", author: "The Plague" },
    { text: "Never send a boy to do a woman's job.", author: "Acid Burn" },
    { text: "RISC architecture is gonna change everything.", author: "Eugene" },
    { text: "Spandex: it's a privilege, not a right.", author: "Cereal Killer" },
    { text: "You are in the butter zone now, baby.", author: "Cereal Killer" },
    { text: "I don't play well with others.", author: "Acid Burn" },
    { text: "Surfing the 'Net? Oughta be on a board, dude.", author: "Cereal Killer" },
    { text: "Type 'cookie' you idiot!", author: "Acid Burn" },
    { text: "It's in that place where I put that thing that time.", author: "Razor" },
    { text: "We have just discovered something extraordinary.", author: "Crash Override" },
    { text: "Phantasmic!", author: "Cereal Killer" },
    { text: "Zero Cool? Crashed fifteen hundred and seven systems in one day.", author: "The Plague" },
    { text: "God gave men brains larger than dogs so they wouldn't hump women's legs at cocktail parties.", author: "Razor" },
    { text: "I'm a thousand percent positive.", author: "Nikon" },
    { text: "You wanted to know who I am, Zero Cool? I'm the plague, Doc.", author: "The Plague" },
    { text: "Gill net fishing. It's been banned in twelve countries.", author: "Cereal Killer" },
    { text: "Hack the planet! Hack the planet!", author: "Crowd" },
    { text: "We're in.", author: "Crash Override" },
    { text: "Some people can read 'War and Peace' and come away thinking it's a simple adventure story. Others can read the ingredients on a chewing gum wrapper and unlock the secrets of the universe.", author: "Lex Luthor" }
  ];

  const quoteEl = document.getElementById('dynamic-quote');
  if (quoteEl) {
    let currentQuote = 0;
    setInterval(() => {
      // Fade out effect
      quoteEl.style.opacity = 0;
      setTimeout(() => {
        const q = hackersQuotes[currentQuote];
        // The last few words can be highlighted by splitting the string if needed, 
        // but for safety and simplicity we just insert it cleanly.
        quoteEl.innerHTML = `"${q.text}"<br><span class="quote-author">— ${q.author}</span>`;
        quoteEl.style.opacity = 1;
        
        currentQuote = (currentQuote + 1) % hackersQuotes.length;
      }, 500); // Wait for fade out to complete before swapping
    }, 8000); // Change every 8 seconds

    // Add CSS transition for opacity smoothly via JS (or can rely on CSS if we add it)
    quoteEl.style.transition = 'opacity 0.5s ease-in-out';
  }
