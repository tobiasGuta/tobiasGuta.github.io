const NUM_BATS = 12;
const bats = [];

const batContainer = document.getElementById('leaf-container'); // reuse or create a new container

for (let i = 0; i < NUM_BATS; i++) {
  const bat = document.createElement('img');
  bat.className = 'bat';
  bat.src = '/assets/bat3.gif';

  const size = 160 + Math.random() * 80; // Much bigger bats!
  bat.style.width = `${size}px`;
  bat.style.height = 'auto';
  bat.style.position = 'absolute';

  batContainer.appendChild(bat);

  bats.push({
    el: bat,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight, // <-- changed here
    speed: 2 + Math.random() * 2,
    swing: 100 + Math.random() * 100,
    phase: Math.random() * 2 * Math.PI,
    direction: Math.random() > 0.5 ? 1 : -1
  });
}

function animateBats() {
  for (const bat of bats) {
    bat.x += bat.speed * bat.direction;
    bat.y += Math.sin(bat.x / 80 + bat.phase) * 1.5;

    // Reverse direction if out of bounds
    if (bat.x < -100 || bat.x > window.innerWidth + 100) {
      bat.direction *= -1;
      bat.x = bat.direction > 0 ? -100 : window.innerWidth + 100;
      bat.y = Math.random() * window.innerHeight; // <-- changed here
    }

    // Example: if bat is on the right half (black background)
    if (bat.x > window.innerWidth / 2) {
      bat.el.classList.add('white-outline');
    } else {
      bat.el.classList.remove('white-outline');
    }

    bat.el.style.transform = `translate(${bat.x}px, ${bat.y}px) scaleX(${bat.direction})`;
  }
  requestAnimationFrame(animateBats);
}

animateBats();