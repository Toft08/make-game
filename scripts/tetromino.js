// Tetromino shapes defined by their relative block positions
const SHAPES = [
    [[0, 0], [0, -1], [0, 1], [0, 2]],    // I
    [[0, 0], [0, -1], [0, 1], [-1, 1]],   // J
    [[0, 0], [0, -1], [0, 1], [1, 1]],    // L
    [[0, 0], [1, 0], [0, 1], [1, 1]],     // O
    [[0, 0], [1, 0], [0, -1], [-1, -1]],  // S
    [[0, 0], [-1, 0], [1, 0], [0, 1]],    // T
    [[0, 0], [-1, 0], [0, -1], [1, -1]]   // Z
];

// Generate a random tetromino piece
function generateRandomPiece() {
    const type = Math.floor(Math.random() * SHAPES.length);
    const blocks = SHAPES[type].map(([x, y]) => ({ x, y }));
    return {
        type,
        blocks,
        x: Math.floor(BOARD_WIDTH / 2),
        y: 1
    };
}

// Rotate the current piece
function rotatePiece() {
    if (!currentPiece || isPaused || isGameOver) return;
    
    // Skip rotation for O piece (square)
    if (currentPiece.type === 3) return;
    
    const rotatedBlocks = currentPiece.blocks.map(block => ({
        x: -block.y,
        y: block.x
    }));
    
    // Try basic rotation
    if (!isCollision(0, 0, rotatedBlocks)) {
        currentPiece.blocks = rotatedBlocks;
        updatePiecePosition();
        return;
    }
    
    // Wall kick - try to adjust position if rotation causes collision
    const kicks = [1, -1, 2, -2]; // Right, left, 2 right, 2 left
    
    for (const kick of kicks) {
        if (!isCollision(kick, 0, rotatedBlocks)) {
            currentPiece.blocks = rotatedBlocks;
            currentPiece.x += kick;
            updatePiecePosition();
            return;
        }
    }
    
    // If all fails, don't rotate
}

// Move the current piece
function movePiece(dx, dy) {
    if (!currentPiece || isPaused || isGameOver) return false;
    
    if (!isCollision(dx, dy)) {
        currentPiece.x += dx;
        currentPiece.y += dy;
        updatePiecePosition();
        return true;
    }
    
    // If moving down and there's a collision, lock the piece
    if (dy > 0) {
        lockPiece();
    }
    
    return false;
}

// Hard drop - move piece all the way down
function hardDrop() {
    if (!currentPiece || isPaused || isGameOver) return;
    
    let dropDistance = 0;
    while (!isCollision(0, dropDistance + 1)) {
        dropDistance++;
    }
    
    if (dropDistance > 0) {
        currentPiece.y += dropDistance;
        updatePiecePosition();
        lockPiece();
    }
}

// Spawn a new piece on the board
function spawnNewPiece() {
    currentPiece = nextPiece;
    nextPiece = generateRandomPiece();
    updateNextPieceDisplay();
    
    // Check for game over
    if (isCollision()) {
        isGameOver = true;
        gameOverElement.style.display = 'flex';
        finalScoreElement.textContent = score;
        return;
    }
    
    renderPiece();
}