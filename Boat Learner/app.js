const canvas = document.getElementById('sailingCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// --- Game Constants ---
const WIND_DIR = Math.PI * 1.5; // Wind from the North (Up)
const WIND_SPD = 15;

// --- Game State ---
let boat = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    speed: 0,
    trim: 0.5, // 0 is tight, 1 is fully out
    points: 0
};

let target = { x: 200, y: 200 };
const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function update() {
    // 1. Steering (Tacking/Jibing)
    if (keys['ArrowLeft']) boat.angle -= 0.03;
    if (keys['ArrowRight']) boat.angle += 0.03;

    // 2. Sail Trim
    if (keys['ArrowUp']) boat.trim = Math.max(0, boat.trim - 0.02);
    if (keys['ArrowDown']) boat.trim = Math.min(1, boat.trim + 0.02);

    // 3. Sailing Physics (Relative Wind)
    let diff = (boat.angle - WIND_DIR + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    let absDiff = Math.abs(diff); // 0 is directly into wind, PI is dead downwind

    // Calculate Optimal Trim for current angle
    // Generally, you want sail at half the angle of the wind
    let optimalTrim = Math.min(1, absDiff / Math.PI);
    let trimError = Math.abs(boat.trim - optimalTrim);

    // Speed calculation
    let power = 0;
    if (absDiff < 0.7) { // In Irons
        power = -0.05; 
    } else {
        // High efficiency at 90-110 degrees (Reach)
        let sailEfficiency = Math.max(0, 1 - (trimError * 3));
        power = Math.sin(absDiff) * sailEfficiency * 0.15;
    }

    boat.speed = Math.max(0, (boat.speed + power) * 0.98); // Drag
    
    boat.x += Math.cos(boat.angle) * boat.speed;
    boat.y += Math.sin(boat.angle) * boat.speed;

    // 4. Target Logic
    if (Math.hypot(boat.x - target.x, boat.y - target.y) < 30) {
        boat.points += 100;
        target.x = Math.random() * (canvas.width - 100) + 50;
        target.y = Math.random() * (canvas.height - 100) + 50;
    }

    // Update UI
    document.getElementById('points').innerText = boat.points;
    document.getElementById('speed').innerText = (boat.speed * 5).toFixed(1);
    document.getElementById('heading').innerText = Math.floor((boat.angle * 180 / Math.PI) % 360);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Target
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(target.x, target.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw Boat Hull
    ctx.save();
    ctx.translate(boat.x, boat.y);
    ctx.rotate(boat.angle);
    
    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-10, -10);
    ctx.lineTo(-15, 0);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.stroke();

    // Draw Sail (Moves with trim and wind)
    let windRelative = (WIND_DIR - boat.angle + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    let sailSide = windRelative > 0 ? 1 : -1;
    let sailAngle = (boat.trim * Math.PI / 2) * sailSide;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(-15 * Math.cos(sailAngle), 15 * Math.sin(sailAngle));
    ctx.stroke();

    ctx.restore();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
