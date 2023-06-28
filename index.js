const PARTICLE_SIZE = 2;
const MAX_PARTICLE_SPEED = 1;
const MAX_PARTICLES = 10;

const canvasElement = document.getElementById("particles");
const ctx = canvasElement.getContext("2d");
const particles = [];

function adjustCanvasSize() {
  canvasElement.width = canvasElement.parentElement.clientWidth;
  canvasElement.height = canvasElement.parentElement.clientHeight;
}

function getMousePositionRelativeTo(mouseEvent, element) {
  const elementRectangle = element.getBoundingClientRect();
  return [
    mouseEvent.pageX - elementRectangle.x,
    mouseEvent.pageY - elementRectangle.y,
  ];
}

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

// calculates distance between two particles
function calculateDistance(particle1, particle2) {
  const dx = particle1.x - particle2.x;
  const dy = particle1.y - particle2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function draw() {
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  particles.forEach((particle, index) => {
    drawParticle(particle);

    for (let i = index + 1; i < particles.length; i++) {
      const otherParticle = particles[i];
      const distance = calculateDistance(particle, otherParticle);

      if (distance < 50) {
        const opacity = 1 - distance / 50; // Calculate opacity based on distance
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

// Setup
adjustCanvasSize();
window.addEventListener("resize", adjustCanvasSize);

// Initiate
setInterval(updatePositions, 1);
draw();

// Draw randomized particles
function initializeParticles() {
  for (let i = 0; i < 100; i++) {
    newParticle(
      randomNumber(0, canvasElement.width),
      randomNumber(0, canvasElement.height)
    );
  }
}
initializeParticles();

canvasElement.addEventListener("click", (event) => {
  const [mouseX, mouseY] = getMousePositionRelativeTo(event, canvasElement);
  let particle = newParticle(mouseX, mouseY);
  drawParticle(particle);
});
