const gameBoard = document.getElementById("gameBoard");
const pauseMenu = document.getElementById('pause-menu');
const gameOverElement = document.getElementById('game-over');
const continueBtn = document.getElementById('continue-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreElement = document.getElementById('final-score');
const restartBtnGameOver = document.getElementById('restart-btn-game-over');

gameOverElement.style.display = 'none';
// restartBtn.style.display = 'none'; 
// restartBtnGameOver.style.display = 'none';

let isPaused = false;
let isGameOver = false;
let keysPressed = {};
let lastTime = 0;
let level = 1;
let score = 0;
const levelUpThreshold = 10;
let dropInterval = 1000;
const minDropInterval = 100;
let dropCounter = 0;
let seconds = 0;
let minutes = 0;
let timeInterval;
const rows = 20;
const cols = 10;

// Create a 10x20 grid
for (let i = 0; i < 200; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
}

let totalClearedRows = 0;

// initialize the game board as 2D array filled with 0 (empty spaces)
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

// define the tetromino shapes using 2D arrays
const tetrominos = {
    T: { shape: [[0, 1, 0], [1, 1, 1]], type: "tetromino-t" },
    I: { shape: [[1, 1, 1, 1]], type: "tetromino-i" },
    O: { shape: [[1, 1], [1, 1]], type: "tetromino-o" },
    L: { shape: [[1, 0], [1, 0], [1, 1]], type: "tetromino-l" },
    J: { shape: [[0, 1], [0, 1], [1, 1]], type: "tetromino-j" },
    S: { shape: [[0, 1, 1], [1, 1, 0]], type: "tetromino-s" },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], type: "tetromino-z" }
};

let currentPiece = {
    shape: tetrominos.T.shape,
    type: tetrominos.T.type,
    row: 0,
    col: 3
};

let nextPiece = getRandomPiece();

function updateBoard() {
    // Clear only the temporary moving piece positions
    let tempBoard = board.map(row => [...row]);
    let shape = currentPiece.shape;
    let ghostRow = getGhostPosition();

    // Draw ghost piece first
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                let newR = ghostRow + r;
                let newC = currentPiece.col + c;
                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
                    tempBoard[newR][newC] = "ghost";
                }
            }
        }
    }
    // Draw active falling piece
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                let newR = currentPiece.row + r;
                let newC = currentPiece.col + c;
                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
                    tempBoard[newR][newC] = currentPiece.type; // Only update the moving piece
                }
            }
        }
    }
    drawBoard(tempBoard);
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

function clearRows() {
    const levelUpThreshold = 10; // Move inside as a temporary fix

    let newBoard = board.filter(row => row.some(cell => cell === 0));
    let rowsCleared = rows - newBoard.length; // count removed rows

    if (rowsCleared > 0) {
        totalClearedRows += rowsCleared; // update total cleared rows

        // Apply scoring based on lines cleared at once
        let baseScore = [0, 100, 300, 500, 800]; 
        score += (baseScore[rowsCleared] || 0) * level;

        // Increase level every 'levelUpThreshold' cleared rows
        if (Math.floor(totalClearedRows / levelUpThreshold) + 1 > level) {
            level++;
            dropInterval = Math.max(minDropInterval, dropInterval * 0.8); // Increase speed 0.8 or 0.9 when done with testing
        }

        updateScoreboard();
    }

    while (newBoard.length < rows) {
        newBoard.unshift(new Array(cols).fill(0)); // add empty rows at the top
    }
    board = newBoard;
}


function getGhostPosition() {
    let ghostRow = currentPiece.row;

    while (canMove(ghostRow + 1, currentPiece.col)) {
        ghostRow++;
    }
    return ghostRow;
}

function drawBoard(tempBoard) {
    const cells = document.querySelectorAll(".cell");

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let index = r * cols + c;
            let cell = cells[index];

            cell.className = "cell"; // reset class first

            if (tempBoard[r][c] !== 0) {
                if (tempBoard[r][c] === "ghost") {
                    cell.classList.add("ghost-piece")
                } else if (typeof tempBoard[r][c] === 'string') {
                    cell.classList.add(tempBoard[r][c]);
                } else {
                    cell.classList.add(currentPiece.type); // add class based on tetromino type
                }
            }
        }
    }
}

// move the piece down by one row
function moveDown() {
    if (canMove(currentPiece.row + 1, currentPiece.col)) {
        currentPiece.row++;
    } else {
        placePiece();
        spawnNewPiece();
    }
    updateBoard();
}
// check if the piece can move to new position
function canMove(nextRow, nextCol) {
    let shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                let newR = nextRow + r;
                let newC = nextCol + c;
                if (newR >= rows || newC < 0 || newC >= cols || board[newR][newC] !== 0) {
                    return false; // collision detected
                }
            }
        }
    }
    return true;
}
// prevents rotating into walls or other pieces
function canRotate(newShape, row, col) {
    for (let r = 0; r < newShape.length; r++) {
        for (let c = 0; c < newShape[r].length; c++) {
            if (newShape[r][c] === 1) {
                let newR = row + r;
                let newC = col + c;
                
                if (newR < 0 || newR >= rows || newC < 0 || newC >= cols) {
                    return false; // collision detected
                }
                if (board[newR][newC] !== 0) {
                    return false;
                }
            }
        }
    }
    return true;
}


function rotateMatrix(matrix) {
    // Transpose the matrix (swap rows and columns)
    let transposed = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));

    // Reverse each row to complete the 90° rotation
    return transposed.map(row => row.reverse());
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

// locks the piece at the bottom of the board once it reaches the bottom
function placePiece() {
    let shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                board[currentPiece.row + r][currentPiece.col + c] = currentPiece.type; // Store placed piece permanently
            }
        }
    }
    clearRows();
}
// spawn a new piece at the top
function spawnNewPiece() {
    currentPiece = nextPiece;
    nextPiece = getRandomPiece();
    updateNextPieceDisplay();
    checkGameOver();
}

function getRandomPiece() {
    const keys = Object.keys(tetrominos);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    
    return {
        shape: tetrominos[randomKey].shape.map(row => [...row]),
        type: tetrominos[randomKey].type,
        row: 0,
        col: 3
    };
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

function startTimer() {
    timeInterval = setInterval(function() {
        if (!isPaused && !isGameOver) {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
            }
            document.getElementById("timer").textContent = `Timer: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function togglePause() {
    if (isGameOver) return; // Prevent pausing if the game is over

    isPaused = !isPaused;

    if (isPaused) {
        pauseMenu.style.display = 'flex';
        // elapsedTime += performance.now() - startTime;
    } else {
        pauseMenu.style.display = 'none';
        requestAnimationFrame(gameLoop);
    }
}

function updateNextPieceDisplay() {
    const nextPieceElement = document.getElementById("nextPieceGrid");
    if (!nextPieceElement) {
        console.error("Error: Element with id 'nextPieceGrid' not found!");
        return;
    }
    // clear previous next piece display
    nextPieceElement.innerHTML = "";
    
    // get the next shape
    const piece = nextPiece.shape;

    // creating 4x4 grid to display next piece
    piece.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                const block = document.createElement("div");
                block.classList.add("block", nextPiece.type);
                block.style.gridRowStart = rowIndex + 1;
                block.style.gridColumnStart = colIndex + 1;
                nextPieceElement.appendChild(block);
            }
        });
    });
}
 
 // keyboard controls
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


function updateScoreboard() {
    document.getElementById("lines").textContent = 'Lines: ' + totalClearedRows;
    document.getElementById("final-lines").textContent = totalClearedRows;
    document.getElementById("level").textContent = 'level: ' + level;
    document.getElementById("final-level").textContent = level;
    document.getElementById("score").textContent = 'Score: ' + score;
    document.getElementById("final-score").textContent = score;
}


document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

// Menu button event listeners
continueBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', resetGame);
restartBtnGameOver.addEventListener('click', resetGame);

function startGame() {
    isPaused = false; // Makes sure the start unpaused
    currentPiece = getRandomPiece();
    nextPiece = getRandomPiece();
    updateBoard();
    updateNextPieceDisplay();
    startTimer();
    requestAnimationFrame(gameLoop); // start loop
}

startGame();

