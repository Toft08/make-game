// Keyboard controls
document.addEventListener("keydown", (event) => {
    if (isGameOver) return; // Prevent inputs if game is over

        // Check if controls popup is open
        const controlsPopup = document.getElementById("controls-popup");
        if (controlsPopup.style.display === "block") return;
    
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
playBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', resetGame);
restartBtnGameOver.addEventListener('click', resetGame);

window.onload = function () {
    isPaused = true;
    pauseMenu.style.display = "block";
    restartBtn.style.display = "none";
};

document.addEventListener("DOMContentLoaded", function () {
    const controlsBtn = document.getElementById("controls-btn");
    const controlsPopup = document.getElementById("controls-popup");
    const closePopup = document.getElementById("close-popup");

    controlsBtn.addEventListener("click", function () {
        controlsPopup.style.display = "block";
    });

    closePopup.addEventListener("click", function () {
        controlsPopup.style.display = "none";
    });

    // Optional: Close popup when clicking outside it
    window.addEventListener("click", function (event) {
        if (event.target === controlsPopup) {
            controlsPopup.style.display = "none";
        }
    });
});