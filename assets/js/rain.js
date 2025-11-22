// ...new file...
// ...existing code...
(function() {
  const isMobile = window.innerWidth < 768;
  const NUM_DROPS = isMobile ? 30 : 120;
  const drops = [];
  const container = document.getElementById('rain-container');
// ...existing code...
  if (!container) return;

  function makeDrop() {
    const el = document.createElement('div');
    el.className = 'raindrop';
    const length = 8 + Math.random() * 18;
    el.style.height = `${length}px`;
    const x = Math.random() * window.innerWidth;
    const y = -Math.random() * window.innerHeight;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    container.appendChild(el);

    return {
      el,
      x,
      y,
      speed: 3 + Math.random() * 6,
      length
    };
  }

  for (let i = 0; i < NUM_DROPS; i++) {
    drops.push(makeDrop());
  }

  function animate() {
    for (const d of drops) {
      d.y += d.speed;
      // slight wind / sway
      d.x += Math.sin((d.y + d.length) / 30) * 0.4;

      if (d.y > window.innerHeight + 50) {
        d.y = -20 - Math.random() * window.innerHeight;
        d.x = Math.random() * window.innerWidth;
      }

      d.el.style.transform = `translate(${d.x}px, ${d.y}px)`;
    }
    requestAnimationFrame(animate);
  }

  // reposition drops on resize
  window.addEventListener('resize', () => {
    for (const d of drops) {
      d.x = Math.random() * window.innerWidth;
      d.y = Math.random() * window.innerHeight - window.innerHeight;
      d.el.style.left = `${d.x}px`;
    }
  });

  animate();
})();