const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const snowflakes = [];
const maxFlakes = 100;

for (let i = 0; i < maxFlakes; i++) {
    snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 1,
        d: Math.random() * maxFlakes
    });
}

function drawSnow() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    for (let i = 0; i < snowflakes.length; i++) {
        const f = snowflakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI*2, true);
    }
    ctx.fill();
    moveSnow();
}

let angle = 0;
function moveSnow() {
    angle += 0.01;
    for (let i = 0; i < snowflakes.length; i++) {
        const f = snowflakes[i];
        f.y += Math.cos(angle + f.d) + 1 + f.r/2;
        f.x += Math.sin(angle) * 2;

        if(f.y > height) {
            snowflakes[i] = {x: Math.random()*width, y:0, r:f.r, d:f.d};
        }
    }
    requestAnimationFrame(drawSnow);
}

drawSnow();
