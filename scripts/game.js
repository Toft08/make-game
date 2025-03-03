// Game state variables
let currentPiece = null;
let nextPiece = null;
let isPaused = false;
let isGameOver = false;
let lastFrameTime = 0;
let dropCounter = 0;

// Set up the game container size
tetrisContainer.style.width = BLOCK_SIZE * BOARD_WIDTH + 'px';
tetrisContainer.style.height = BLOCK_SIZE * BOARD_HEIGHT + 'px';

// Initialize the game
function init() {
    // Clear the board
    board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null));
    
    // Reset game state
    isPaused = false;
    isGameOver = false;
    score = 0;
    level = 1;
    lines = 0;
    startTime = performance.now();
    elapsedTime = 0;
    dropInterval = 1000;
    
    // Update UI
    updateScore();
    updateLevel();
    updateLines();
    
    // Clear existing blocks
    const blocksToRemove = tetrisContainer.querySelectorAll('.tetris-block');
    blocksToRemove.forEach(block => {
        tetrisContainer.removeChild(block);
    });
    
    // Generate pieces
    if (!nextPiece) {
        nextPiece = generateRandomPiece();
    }
    spawnNewPiece();
    
    // Hide menus
    pauseMenu.style.display = 'none';
    gameOverElement.style.display = 'none';
    
    // Start the game loop
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);
}

// Toggle pause state
function togglePause() {
    if (isGameOver) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        pauseMenu.style.display = 'flex';
        // Record elapsed time when pausing
        elapsedTime += performance.now() - startTime;
    } else {
        pauseMenu.style.display = 'none';
        // Reset start time when unpausing
        startTime = performance.now();
    }
}

// Main game loop
function gameLoop(time) {
    const deltaTime = time - lastFrameTime;
    lastFrameTime = time;
    
    if (!isPaused && !isGameOver) {
        // Update timer
        updateTimer(time);
        
        // Update drop counter
        dropCounter += deltaTime;
        
        // Handle key presses
        handleKeyPresses(deltaTime);
        
        // Auto drop piece
        if (dropCounter > dropInterval) {
            movePiece(0, 1);
            dropCounter = 0;
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game
init();