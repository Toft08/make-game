// Keyboard input tracking
let keysPressed = {};

// Handle key presses
document.addEventListener('keydown', (e) => {
    // Don't handle input when game is over
    if (isGameOver) return;
    
    // Toggle pause with Escape key
    if (e.key === 'Escape') {
        togglePause();
        return;
    }
    
    // Don't handle other keys when paused
    if (isPaused) return;
    
    // Track key presses for continuous movement
    keysPressed[e.key] = true;
    
    // Handle immediate actions
    switch (e.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            movePiece(0, 1);
            addSoftDropPoints();
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case ' ': // Space bar
            hardDrop();
            break;
    }
    
    // Prevent default for game controls
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    // Track key releases
    keysPressed[e.key] = false;
});

// Handle continuous key presses
function handleKeyPresses(deltaTime) {
    const moveInterval = 100; // Milliseconds between moves when key is held
    const keyStates = {
        ArrowLeft: { time: 0, fn: () => movePiece(-1, 0) },
        ArrowRight: { time: 0, fn: () => movePiece(1, 0) },
        ArrowDown: { time: 0, fn: () => { movePiece(0, 1); addSoftDropPoints(); } }
    };
    
    Object.keys(keyStates).forEach(key => {
        if (keysPressed[key]) {
            keyStates[key].time += deltaTime;
            
            // Initial delay followed by repeated actions
            if (keyStates[key].time >= moveInterval) {
                keyStates[key].fn();
                keyStates[key].time = 0;
            }
        } else {
            keyStates[key].time = moveInterval; // Ready for next press
        }
    });
}

// Menu button event listeners
continueBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', init);
restartBtnGameOver.addEventListener('click', init);