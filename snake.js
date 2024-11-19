// Snake Game Implementation

const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const gridSize = 20;
const canvasSize = 400;
const directions = { up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT' };

// Initial Snake Setup
let snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 }
];

let food = { x: 100, y: 100 };
let direction = directions.right;
let score = 0;
let gameInterval;
let gameStarted = false; // Track if the game has started

const gameOverScreen = document.getElementById('game-over-screen');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');

// Function to draw the snake on the canvas
function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));
}

// Function to draw food on the canvas
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Function to move the snake
function moveSnake() {
    const head = { ...snake[0] };

    if (direction === directions.up) head.y -= gridSize;
    if (direction === directions.down) head.y += gridSize;
    if (direction === directions.left) head.x -= gridSize;
    if (direction === directions.right) head.x += gridSize;

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

// Function to generate new food position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / (gridSize))) * (gridSize),
        y: Math.floor(Math.random() * (canvasSize / (gridSize))) * (gridSize) 
    };
}

// Function to check if snake collides with itself or walls
function checkCollision() {
    const head = snake[0];

    // Check wall collisions
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }

    // Check self collisions
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Function to update the game every frame
function gameLoop() {
    ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear canvas

    moveSnake(); // Move the snake
    if (checkCollision()) {
        endGame();
        return;
    }

    drawSnake(); // Draw the snake
    drawFood(); // Draw the food
}

// Function to handle end of game
function endGame() {
    clearInterval(gameInterval); // Stop the game loop
    gameOverScreen.style.display = 'block'; // Show the game over screen
}

// Function to start the game
function startGame() {
    // Reset the game state
    snake = [
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];
    food = { x: 100, y: 100 };
    direction = directions.right;
    score = 0;
    gameOverScreen.style.display = 'none'; // Hide the game over screen
    startScreen.style.display = 'none'; // Hide the start screen

    gameStarted = true; // Mark game as started
    gameInterval = setInterval(gameLoop, 110); // Start the game loop
}

// Event listener to change direction
document.addEventListener('keydown', (e) => {
    if (!gameStarted) return; // Don't change direction if the game hasn't started

    if (e.key === 'ArrowUp' && direction !== directions.down) direction = directions.up;
    if (e.key === 'ArrowDown' && direction !== directions.up) direction = directions.down;
    if (e.key === 'ArrowLeft' && direction !== directions.right) direction = directions.left;
    if (e.key === 'ArrowRight' && direction !== directions.left) direction = directions.right;
});

// Add event listeners for arrow control buttons
document.getElementById('up-btn').addEventListener('click', () => {
    if (direction !== directions.down) direction = directions.up;
});

document.getElementById('down-btn').addEventListener('click', () => {
    if (direction !== directions.up) direction = directions.down;
});

document.getElementById('left-btn').addEventListener('click', () => {
    if (direction !== directions.right) direction = directions.left;
});

document.getElementById('right-btn').addEventListener('click', () => {
    if (direction !== directions.left) direction = directions.right;
});

// Event listener to start the game
startBtn.addEventListener('click', startGame);

// Event listener to restart the game
restartBtn.addEventListener('click', startGame);
