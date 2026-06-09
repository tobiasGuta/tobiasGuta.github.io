/*
  Homepage interactions for the portfolio.
  Keep small visual effects here so index.html stays focused on content.
*/
// Random glitch effect on title
  const title = document.querySelector('.site-title');
  setInterval(() => {
    if (Math.random() < 0.07) {
      title.style.transform = `skewX(${(Math.random()-0.5)*6}deg) translateX(${(Math.random()-0.5)*4}px)`;
      setTimeout(() => title.style.transform = '', 80);
    }
  }, 400);

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
