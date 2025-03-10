let keysPressed = {}; // Track which keys are held

// Handle key press (store key states)
document.addEventListener("keydown", (event) => {
    if (isGameOver) return; // Prevent input if game is over

    // Prevent input if controls popup is open
    const controlsPopup = document.getElementById("controls-popup");
    if (controlsPopup.style.display === "block") return;

    // Toggle pause with Escape key
    if (event.key === 'Escape') {
        togglePause();
        return;
    }

    if (isPaused) return; // Ignore input if paused

    keysPressed[event.key] = true; // Store pressed key

    // Immediate actions (rotation & hard drop)
    if (event.key === "ArrowUp") rotatePiece();
    if (event.key === " ") hardDrop();
});

// Handle key release (stop movement)
document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key];
});

// Function to handle movement in the game loop
function handleMovement() {
    if (keysPressed["ArrowLeft"] && canMove(currentPiece.row, currentPiece.col - 1)) {
        currentPiece.col--;
    }
    if (keysPressed["ArrowRight"] && canMove(currentPiece.row, currentPiece.col + 1)) {
        currentPiece.col++;
    }
    if (keysPressed["ArrowDown"]) {
        moveDown();
    }
}

// Modify the game loop to handle movement & updates
function gameLoop(timestamp) {
    if (isPaused || isGameOver) return;

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    dropCounter += deltaTime;

    handleMovement(); // Call movement function here

    if (dropCounter > dropInterval) {
        moveDown();
        dropCounter = 0;
    }

    updateBoard();
    requestAnimationFrame(gameLoop);
}

// Start game loop
requestAnimationFrame(gameLoop);