const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player parameters
let player = { x: canvas.width / 2, y: canvas.height / 2, radius: 20, speedY: 0 };
let gravity = 0.5; // Decreased gravity
let jumpSpeed = 10; // Decreased jump speed
let jumping = false;
let gameOver = false;
let spacePressed = false; // Flag to track spacebar press

// Line parameters
let line = { x: 0, y: canvas.height - 100, width: canvas.width, height: 5 }; // Increased line height

// Time
let startTime = 0; // Record the start time
let elapsedTime = 0; // Elapsed time

// Event listener for keydown to jump
document.addEventListener('keydown', function(event) {
    if (event.key === ' ' && !gameOver) {
        if (!jumping) {
            player.speedY = -jumpSpeed; // Use jump speed variable
            jumping = true;
        }
        spacePressed = true; // Set flag when spacebar is pressed
    }
});

// Event listener for keyup to stop jumping
document.addEventListener('keyup', function(event) {
    if (event.key === ' ') {
        spacePressed = false; // Unset flag when spacebar is released
    }
});

// Event listener for click to restart
canvas.addEventListener('click', function(event) {
    if (gameOver) {
        restartGame();
    }
});

// Function to restart the game
function restartGame() {
    player.y = canvas.height / 2;
    player.speedY = 0;
    jumping = false;
    gameOver = false;
    startTime = Date.now(); // Record the start time
}

// Main game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        // Gravity
        player.speedY += gravity;

        // Continuous jumping while spacebar is held down
        if (spacePressed) {
            player.speedY = -jumpSpeed; // Use jump speed variable
        }

        player.y += player.speedY;

        // Collision with ground
        if (player.y + player.radius >= canvas.height) {
            player.y = canvas.height - player.radius;
            player.speedY = 0;
            jumping = false;
        }

        // Collision with line
        if (player.y + player.radius >= line.y) {
            gameOver = true;
        }

        // Calculate elapsed time
        elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds
    }

    // Draw the line
    ctx.fillStyle = 'black';
    ctx.fillRect(line.x, line.y, line.width, line.height);

    // Draw the player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();

    // Display the elapsed time
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Time: ' + elapsedTime + 's', 20, 30);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Click to restart.', canvas.width / 2 - 150, canvas.height / 2);
    }

    requestAnimationFrame(gameLoop);
}
// Event listener for touchstart to jump
document.addEventListener('touchstart', function(event) {
    if (!gameOver) {
        if (!jumping) {
            player.speedY = -jumpSpeed; // Use jump speed variable
            jumping = true;
            score++; // Increment score when jumping
        }
    }
});

// Event listener for touchend to stop jumping
document.addEventListener('touchend', function(event) {
    if (jumping) {
        jumping = false;
    }
});

// Ensure the player starts above the ground line
restartGame();

gameLoop();