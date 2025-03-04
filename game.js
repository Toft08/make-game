const gameBoard = document.getElementById("gameBoard");
const pauseMenu = document.getElementById('pause-menu');
const gameOverElement = document.getElementById('game-over');

let isPaused = false;
let isGameOver = false;
let keysPressed = {};
let lastTime = 0;
const dropInterval = 1000;
let dropCounter = 0;
const rows = 20;
const cols = 10;

// Create a 10x20 grid
for (let i = 0; i < 200; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
}

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
    // Drat active falling piece
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
    console.log("Update board:", tempBoard)
    drawBoard(tempBoard);
}

function resetGame() {
    // Reset game state
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    currentPiece = {
        shape: tetrominos.T.shape,
        type: tetrominos.T.type,
        row: 0,
        col: 3
    };
    
    // Reset game variables
    isPaused = false;
    isGameOver = false;
    score = 0;
    startTime = performance.now();
    elapsedTime = 0;
    dropCounter = 0;
    lastTime = performance.now();
    
    // Hide menus
    pauseMenu.style.display = 'none';
    gameOverElement.style.display = 'none';
    
    // Clear the board
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.className = "cell";
    });
    
    // Restart the game loop
    updateBoard();
    requestAnimationFrame(gameLoop);
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

    if (canRotate(rotatedShape, currentPiece.row, currentPiece.col)) {
        currentPiece.shape = rotatedShape; // apply rotation if valid
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
}
// spawn a new piece at the top
function spawnNewPiece() {
    const keys = Object.keys(tetrominos);
    const randomKey = keys[Math.floor(Math.random() * keys.length)]; // pick random key
    currentPiece = {
        shape: tetrominos[randomKey].shape, // assing random shape
        type: tetrominos[randomKey].type, // store type for CSS
        row: 0,
        col: 3
    };
        // Check for game over (if new piece can't be placed)
    if (!canMove(currentPiece.row, currentPiece.col)) {
        isGameOver = true;
        gameOverElement.style.display = 'flex';
        finalScoreElement.textContent = score;
    }
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
        // requestAnimationFrame(gameLoop);
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

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

// Menu button event listeners
continueBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', initGame);
restartBtnGameOver.addEventListener('click', initGame);

function startGame() {
    isPaused = false; // Makes sure the start unpaused
    updateBoard();
    requestAnimationFrame(gameLoop); // start loop
}

startGame();

// initGame();
