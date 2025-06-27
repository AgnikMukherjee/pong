const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 8; // AI paddle speed

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// Helper functions
function drawRect(x, y, w, h, color='#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color='#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, size=36) {
    ctx.fillStyle = "#fff";
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 6 * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() * 2 - 1);
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp within canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// AI paddle movement
function moveAI() {
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
        aiY += PADDLE_SPEED;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
        aiY -= PADDLE_SPEED;
    }
    // Clamp
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Ball movement and collision
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY < 0) {
        ballY = 0;
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height - BALL_SIZE) {
        ballY = canvas.height - BALL_SIZE;
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH;
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on where the ball hit the paddle
        let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 5;
    }

    // Right paddle collision (AI)
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_SIZE;
        ballSpeedX = -ballSpeedX;
        let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 5;
    }

    // Score check
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX > canvas.width - BALL_SIZE) {
        playerScore++;
        resetBall();
    }
}

// Drawing everything
function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "#222");

    // Draw net
    for (let i = 10; i < canvas.height; i += 30) {
        drawRect(canvas.width/2-2, i, 4, 20, "#888");
    }

    // Draw paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw score
    drawText(playerScore, canvas.width / 4, 50, 40);
    drawText(aiScore, 3 * canvas.width / 4, 50, 40);
}

// Main game loop
function gameLoop() {
    moveAI();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();