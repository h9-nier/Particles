const PARTICLE_SIZE = 2;
const MAX_PARTICLE_SPEED = 0.2;
const PARTICLE_BRIDGE_DISTANCE = 120;
let MAX_PARTICLE_NUMBER;

const canvasElement = document.getElementById("particles");
const ctx = canvasElement.getContext("2d");
const particles = [];

function adjustCanvasSize() {
  canvasElement.width = canvasElement.parentElement.clientWidth;
  canvasElement.height = canvasElement.parentElement.clientHeight;
}

// Gets mouse coordinates, with origin in the top-left corner of element
function getMousePositionRelativeTo(mouseEvent, element) {
  const elementRectangle = element.getBoundingClientRect();
  return [
    mouseEvent.pageX - elementRectangle.x,
    mouseEvent.pageY - elementRectangle.y,
  ];
}
// Creates new particle at coordinates
function newParticle(x, y) {
  let velocityX = randomNumber(-MAX_PARTICLE_SPEED, MAX_PARTICLE_SPEED);
  let velocityY = randomNumber(-MAX_PARTICLE_SPEED, MAX_PARTICLE_SPEED);
  particles.push({ x, y, velocityX, velocityY });
  return { x, y, velocityX, velocityY };
}

function drawParticle({ x, y }) {
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x, y, PARTICLE_SIZE, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

// Calculates particle position according to its velocity
function updatePositions() {
  particles.forEach((particle) => {
    if (particle.x >= canvasElement.width || particle.x <= 0) {
      particle.velocityX *= -1;
    }
    if (particle.y >= canvasElement.height || particle.y <= 0) {
      particle.velocityY *= -1;
    }

    particle.x += particle.velocityX;
    particle.y += particle.velocityY;
  });
}

// Calculates distance between two particles
function calculateDistance(particle1, particle2) {
  const dx = particle1.x - particle2.x;
  const dy = particle1.y - particle2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Each frame, draw particles, removing ones beyond the canvas
// Draw fading lines between particles in proximity
function draw() {
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  particles.forEach((particle, index) => {
    if (
      particle.x >= canvasElement.width ||
      particle.y >= canvasElement.height
    ) {
      particles.splice(index, 1);
      return;
    }
    drawParticle(particle);

    for (let i = index + 1; i < particles.length; i++) {
      const otherParticle = particles[i];
      const distance = calculateDistance(particle, otherParticle);

      if (distance < PARTICLE_BRIDGE_DISTANCE) {
        const opacity = 1 - distance / PARTICLE_BRIDGE_DISTANCE; // Calculate opacity based on distance
        const gradient = ctx.createLinearGradient(
          particle.x,
          particle.y,
          otherParticle.x,
          otherParticle.y
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);

        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(otherParticle.x, otherParticle.y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  });

  requestAnimationFrame(draw);
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Spawn given number of random particles
function initializeParticles(num) {
  for (let i = 0; i < num; i++) {
    newParticle(
      randomNumber(0, canvasElement.width),
      randomNumber(0, canvasElement.height)
    );
  }
}

// Setup canvas element
adjustCanvasSize();
window.addEventListener("resize", adjustCanvasSize);

// Initiate interval
setInterval(updatePositions, 1);
draw();

// Customize particle number for initial page load based on screen size
if (canvasElement.width > 1000) {
  MAX_PARTICLE_NUMBER = 130;
} else if (canvasElement.width > 800) {
  MAX_PARTICLE_NUMBER = 110;
} else if (canvasElement.width > 600) {
  MAX_PARTICLE_NUMBER = 90;
} else if (canvasElement.width > 400) {
  MAX_PARTICLE_NUMBER = 50;
} else {
  MAX_PARTICLE_NUMBER = 30;
}

// Draw randomized particles on page load
initializeParticles(MAX_PARTICLE_NUMBER);

// Draw new particle on canvas click
// Spawning particles at capacity removes old ones
canvasElement.addEventListener("click", (event) => {
  if (particles.length > MAX_PARTICLE_NUMBER) particles.shift();
  const [mouseX, mouseY] = getMousePositionRelativeTo(event, canvasElement);
  let particle = newParticle(mouseX, mouseY);
  drawParticle(particle);
});
