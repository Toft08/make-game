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

let lastMoveTime = 0;
const moveDelay = 100;

// Function to handle movement in the game loop
function handleMovement(timestamp) {
    if (timestamp - lastMoveTime < moveDelay) return;
    lastMoveTime = timestamp;

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