// Sound effects (using .wav files)
const eatSound = new Audio('eat.wav');
const gameOverSound = new Audio('gameover.wav');

// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the size of the grid (each square is 20x20 pixels)
const gridSize = 20;

// Starting position of the snake (an array of grid coordinates)
let snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 }
];

// Snake's movement direction (right to start)
let dx = 1;
let dy = 0;

// Food position
let food = { x: 0, y: 0 };

// Game over flag
let gameOver = false;

// Score
let score = 0;

// Place the first piece of food
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize));
    food.y = Math.floor(Math.random() * (canvas.height / gridSize));
}
placeFood();

// Draw everything on the canvas
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake with rounded corners and a distinct head
    snake.forEach((segment, index) => {
        ctx.beginPath();
        ctx.fillStyle = index === 0 ? '#4caf50' : '#8bc34a'; // Brighter head
        ctx.strokeStyle = '#388e3c';
        ctx.lineWidth = 2;
        // Rounded rectangle for each segment (fallback to rect if unsupported)
        if ('roundRect' in ctx) {
            ctx.roundRect(
                segment.x * gridSize,
                segment.y * gridSize,
                gridSize, gridSize,
                [6] // Rounded corners
            );
        } else {
            ctx.rect(
                segment.x * gridSize,
                segment.y * gridSize,
                gridSize, gridSize
            );
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    });

    // Draw food as an apple (circle with a green leaf)
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0, Math.PI * 2
    );
    ctx.fillStyle = '#f44336'; // Red
    ctx.fill();
    ctx.strokeStyle = '#b71c1c';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Draw the apple leaf
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2 + 5,
        food.y * gridSize + gridSize / 2 - 7,
        3, 0, Math.PI * 2
    );
    ctx.fillStyle = '#43a047'; // Green
    ctx.fill();
    ctx.closePath();

    // Draw the score
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    // If game over, show text
    if (gameOver) {
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', 80, 200);
        ctx.font = '20px Arial';
        ctx.fillText('Press Space to Restart', 90, 240);
    }
}

// Move the snake
function moveSnake() {
    // Create a new head based on current direction
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for collision with walls
    if (
        head.x < 0 ||
        head.x >= canvas.width / gridSize ||
        head.y < 0 ||
        head.y >= canvas.height / gridSize
    ) {
        if (!gameOver) {
            gameOver = true;
            gameOverSound.currentTime = 0;
            gameOverSound.play();
        }
        return;
    }

    // Check for collision with itself
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            if (!gameOver) {
                gameOver = true;
                gameOverSound.currentTime = 0;
                gameOverSound.play();
            }
            return;
        }
    }

    // Add new head to the snake
    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        eatSound.currentTime = 0;
        eatSound.play();
        placeFood();
    } else {
        // Remove the last segment if food not eaten
        snake.pop();
    }
}

// Game loop
function gameLoop() {
    if (!gameOver) {
        moveSnake();
        draw();
        setTimeout(gameLoop, 100); // Run the game loop every 100ms
    } else {
        draw(); // Draw one last time to show "Game Over"
    }
}

gameLoop(); // Start the game!

// Listen for keyboard events to change direction
document.addEventListener('keydown', function (event) {
    if (gameOver) return;

    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

// Restart the game when pressing Space after game over
document.addEventListener('keydown', function (event) {
    if (gameOver && event.code === 'Space') {
        // Reset all variables to initial state
        snake = [
            { x: 8, y: 10 },
            { x: 7, y: 10 },
            { x: 6, y: 10 }
        ];
        dx = 1;
        dy = 0;
        score = 0;
        gameOver = false;
        placeFood();
        gameLoop();
    }
});