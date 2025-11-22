// ...new file...
(function() {
  const overlay = document.getElementById('lightning-overlay');
  if (!overlay) return;

  // flash element used for quick screen brightening
  const flash = document.createElement('div');
  flash.className = 'lightning-flash';
  overlay.appendChild(flash);

  function createBolt() {
    const bolt = document.createElement('div');
    bolt.className = 'lightning-bolt';

    // random horizontal position and height/tilt
    const left = Math.random() * 100; // percent
    const scale = 0.6 + Math.random() * 1.2;
    const rotate = -15 + Math.random() * 30; // degrees
    const height = 60 + Math.random() * 40; // vh

    bolt.style.left = `${left}%`;
    bolt.style.height = `${height}vh`;
    bolt.style.transform = `translateX(-50%) rotate(${rotate}deg) scaleY(${scale})`;
    overlay.appendChild(bolt);

    // animate bolt: quick appear -> fade
    bolt.animate([
      { opacity: 0, transform: `translateX(-50%) rotate(${rotate}deg) scaleY(${scale * 0.2})` },
      { opacity: 1, transform: `translateX(-50%) rotate(${rotate}deg) scaleY(${scale})` },
      { opacity: 0 }
    ], {
      duration: 300 + Math.random() * 500,
      easing: 'cubic-bezier(0.2,0.8,0.2,1)'
    }).onfinish = () => bolt.remove();
  }

  function flashPulse(times = 1, baseDelay = 60) {
    // quick series of flashes to mimic forked lightning
    for (let i = 0; i < times; i++) {
      const delay = i * (baseDelay + Math.random() * 80);
      setTimeout(() => {
        flash.style.opacity = '1';
        setTimeout(() => flash.style.opacity = '0', 60 + Math.random() * 120);
      }, delay);
    }
  }

  // ...existing code...
(function() {
  const isMobile = window.innerWidth < 768;
  const overlay = document.getElementById('lightning-overlay');
  if (!overlay) return;
// ...existing code...
  function strike() {
    // sometimes strong strike with bolts, sometimes just a flash
    // On mobile, reduce chance of strong strikes to save resources
    const strongChance = isMobile ? 0.2 : 0.5;
    const strong = Math.random() < strongChance;
    
    if (strong) {
      // multiple quick flashes + one or two bolts
      flashPulse(2 + Math.floor(Math.random() * 3), 60);
      setTimeout(() => createBolt(), 40 + Math.random() * 120);
      // Reduce double bolts on mobile
      if (!isMobile && Math.random() < 0.5) setTimeout(() => createBolt(), 120 + Math.random() * 200);
    } else {
      flashPulse(1);
      if (Math.random() < 0.4) setTimeout(() => createBolt(), 50 + Math.random() * 200);
    }
  }
// ...existing code...

  // Random strikes spaced between min and max seconds (non-uniform)
  function scheduleNext() {
    const min = 4000; // 4s
    const max = 22000; // 22s
    const next = min + Math.random() * (max - min);
    setTimeout(() => {
      // higher chance during rainy theme; create 1-3 strikes in short succession
      const cluster = Math.random() < 0.3 ? 1 + Math.floor(Math.random() * 3) : 1;
      for (let i = 0; i < cluster; i++) {
        setTimeout(strike, i * (100 + Math.random() * 300));
      }
      scheduleNext();
    }, next);
  }

  // Start
  scheduleNext();

  // keep overlay sized and reposition on resize (safe-guard)
  window.addEventListener('resize', () => {
    // nothing to do here for now; bolts use viewport units
  });
})();