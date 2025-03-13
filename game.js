let currentPiece;
let nextPiece;

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
    if (currentPiece.type === "tetromino-o") {
        return false; // O-piece does not rotate
    }

    let rotatedShape = rotateMatrix(currentPiece.shape);
    let originalRow = currentPiece.row;
    let originalCol = currentPiece.col;

    // Special handling for I-piece to rotate from its center
    if (currentPiece.type === "tetromino-i") {
        if (currentPiece.shape.length === 1) { 
            currentPiece.row -= 1; // Horizontal → Vertical (shift up)
            currentPiece.col += 1; // Shift right
        } else { 
            currentPiece.row += 1; // Vertical → Horizontal (shift down)
            currentPiece.col -= 1; // Shift left
        }
    }

    // If rotation is valid without wall kicks, apply it
    if (canRotate(rotatedShape, currentPiece.row, currentPiece.col)) {
        currentPiece.shape = rotatedShape;
        return true;
    }

    // Define wall kick tests
    const wallKickTests = (currentPiece.type === "tetromino-i")
        ? [ { x: -2, y: 0 }, { x: 2, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 } ] // I-piece kicks
        : [ { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 } ]; // Normal pieces

    // Try wall kicks
    for (let test of wallKickTests) {
        if (canRotate(rotatedShape, currentPiece.row + test.y, currentPiece.col + test.x)) {
            currentPiece.row += test.y;
            currentPiece.col += test.x;
            currentPiece.shape = rotatedShape;
            return true;
        }
    }

    // Restore original position if all attempts fail
    currentPiece.row = originalRow;
    currentPiece.col = originalCol;

    return false;
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
    elapsedTime = 0;
    dropInterval = 1000;
    dropCounter = 0;
    totalClearedRows = 0;
    
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

startGame();
