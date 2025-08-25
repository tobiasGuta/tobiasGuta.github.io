const NUM_LEAVES = 25;
const leaves = [];

const leafContainer = document.getElementById('leaf-container');

for (let i = 0; i < NUM_LEAVES; i++) {
  const leaf = document.createElement('div');
  leaf.className = 'leaf';

  const size = 20 + Math.random() * 30;
  leaf.style.width = `${size}px`;
  leaf.style.height = `${size}px`;

  const startX = Math.random() * window.innerWidth;
  const startY = -50 - Math.random() * window.innerHeight;
  const speed = 1 + Math.random() * 2;
  const swing = 30 + Math.random() * 50;
  const spinSpeed = 0.5 + Math.random();
  const phase = Math.random() * 2 * Math.PI;

  leafContainer.appendChild(leaf);

  leaves.push({
    el: leaf,
    x: startX,
    y: startY,
    speed,
    swing,
    spin: 0,
    spinSpeed,
    phase
  });
}

function animate() {
  for (const leaf of leaves) {
    leaf.y += leaf.speed;
    leaf.x += Math.sin(leaf.y / 50 + leaf.phase) * leaf.swing * 0.02;
    leaf.spin += leaf.spinSpeed;

    if (leaf.y > window.innerHeight + 50) {
      leaf.y = -50;
      leaf.x = Math.random() * window.innerWidth;
    }

    leaf.el.style.transform = `translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.spin}deg)`;
  }
  requestAnimationFrame(animate);
}

animate();
