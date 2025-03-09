// Current and next piece variables
let currentPiece = {
    shape: tetrominos.T.shape,
    type: tetrominos.T.type,
    row: 0,
    col: 3
};

let nextPiece = getRandomPiece();

function moveDown() {
    if (canMove(currentPiece.row + 1, currentPiece.col)) {
        currentPiece.row++;
    } else {
        placePiece();
        spawnNewPiece();
    }
    updateBoard();
}

function rotatePiece() {
    let rotatedShape = rotateMatrix(currentPiece.shape);
    // standard rotation check
    if (canRotate(rotatedShape, currentPiece.row, currentPiece.col)) {
        currentPiece.shape = rotatedShape; // apply rotation if valid
        return;
    }
    // wall kick offsets (right & left shifts)
    let wallKicks = [1, -1, 2, -2, 3, -3];

    // special case for i-piece
    if (currentPiece.type === "i") {
        wallKicks = [2, -2, 3, -3, 4, -4];
    }
    // try shifting to valid position
    for (let offset of wallKicks) {
        if (canRotate(rotatedShape, currentPiece.row, currentPiece.col + offset)) {
            currentPiece.col += offset;
            currentPiece.shape = rotatedShape;
            return;
        }
    }
}

function spawnNewPiece() {
    currentPiece = nextPiece;
    nextPiece = getRandomPiece();
    updateNextPieceDisplay();
    checkGameOver();
}

function checkGameOver() {
    // Check for game over AFTER creating the piece
    if (!canMove(currentPiece.row, currentPiece.col)) {
        isGameOver = true;
        gameOverElement.style.display = 'flex';
        finalScoreElement.textContent = score; 
        return true;
    }
    return false;
}

function hardDrop() {
    while (canMove(currentPiece.row + 1, currentPiece.col)) {
        currentPiece.row++; // Move down until it collides
    }
    placePiece(); // Lock piece in place
    spawnNewPiece(); // Generate new piece
    updateBoard();
}

function gameLoop(timestamp) {
    if (isPaused || isGameOver) {
        return
    }

    let deltaTime = timestamp - lastTime; // difference since last frame
    lastTime = timestamp;
    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
        moveDown();
        dropCounter = 0;
    }
    requestAnimationFrame(gameLoop); //continue loop
}

function resetGame() {
    // Reset game state
    board = Array.from({ length: rows }, () => Array(cols).fill(0));

    currentPiece = getRandomPiece();
    
    // Reset game variables
    isPaused = false;
    isGameOver = false;
    score = 0;
    level = 1;
    // startTime = performance.now();
    elapsedTime = 0;
    dropInterval = 1000;
    dropCounter = 0;
    totalClearedRows = 0;
    // lastTime = performance.now();
    
    // Hide menus
    pauseMenu.style.display = 'none';
    gameOverElement.style.display = 'none';
    
    // Clear the board
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.className = "cell";
    });

    // Reset timer
    clearInterval(timeInterval);
    seconds = 0;
    minutes = 0;
    document.getElementById("timer").textContent = "Timer: 00:00";
    startTimer();

    nextPiece = getRandomPiece();
    updateNextPieceDisplay();
    updateScoreboard();
    
    // Restart the game loop
    updateBoard();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    isPaused = false; // Makes sure the start unpaused
    pauseMenu.style.display = "none";
    currentPiece = getRandomPiece();
    nextPiece = getRandomPiece();
    updateBoard();
    updateNextPieceDisplay();
    startTimer();
    requestAnimationFrame(gameLoop); // start loop
}

