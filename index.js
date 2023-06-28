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
    let velocityX = randomNumber(0, MAX_PARTICLE_SPEED);
    let velocityY = randomNumber(0, MAX_PARTICLE_SPEED);
    particles.push({ x, y, velocityX, velocityY });
    return { x, y, velocityX, velocityY };
}

function drawParticle({ x, y, velocityX, velocityY }) {
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

function draw() {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    particles.forEach(({ x, y, velocityX, velocityY }) => {
        drawParticle({ x, y, velocityX, velocityY });
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

canvasElement.addEventListener("click", (event) => {
    const [mouseX, mouseY] = getMousePositionRelativeTo(event, canvasElement);
    let particle = newParticle(mouseX, mouseY);
    drawParticle(particle);
});