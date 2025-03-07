// Keyboard controls
document.addEventListener("keydown", (event) => {
    if (isGameOver) return; // Prevent inputs if game is over
    
    // Toggle pause with Escape key
    if (event.key === 'Escape') {
        togglePause();
        return;
    }
    
    if (isPaused) return; // Ignore all inputs if paused

    // Track key presses for continuous movement
    keysPressed[event.key] = true;

    // Handle immediate actions
    switch (event.key) {
    case "ArrowLeft":
        if (canMove(currentPiece.row, currentPiece.col -1)) {
            currentPiece.col--;
        }
        break;
    case "ArrowRight":
        if (canMove(currentPiece.row, currentPiece.col +1)) {
            currentPiece.col++;
        }
        break;
    case "ArrowDown":
        moveDown();
        break;
    case "ArrowUp":
        rotatePiece();
        break;
    case " ":
        hardDrop();
        break;
    }
    updateBoard();
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

// Menu button event listeners
continueBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', resetGame);
restartBtnGameOver.addEventListener('click', resetGame);