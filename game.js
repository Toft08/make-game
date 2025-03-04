const gameBoard = document.getElementById("gameBoard");

// Create a 10x20 grid
for (let i = 0; i < 200; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
}

const rows = 20;
const cols = 10;

// initialize the game board as 2D array filled with 0 (empty spaces)
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

// define the tetromino shapes using 2D arrays
const tetrominos = {
    T: [[0, 1, 0], [1, 1, 1]],
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    L: [[1, 0], [1, 0], [1, 1]],
    J: [[0, 1], [0, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]]
};

let currentPiece = {
    shape: tetrominos.T,
    row: 0,
    col: 3
};

function updateBoard() {
    // Clear only the temporary moving piece positions
    let tempBoard = board.map(row => [...row]);

    let shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                let newR = currentPiece.row + r;
                let newC = currentPiece.col + c;
                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
                    tempBoard[newR][newC] = 1; // Only update the moving piece
                }
            }
        }
    }
    console.log("Update board:", tempBoard)
    drawBoard(tempBoard);
}

function drawBoard(tempBoard) {
    const cells = document.querySelectorAll(".cell");
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let index = r * cols + c;
            if (tempBoard[r][c] === 1) {
                cells[index].style.backgroundColor = "red";  // Tetrimino color
            } else {
                cells[index].style.backgroundColor = "#222"; // Empty cell
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
                if (newR >= rows || newC < 0 || newC >= cols || board[newR][newC] === 1) {
                    return false; // collision detected
                }
            }
        }
    }
    return true;
}
// locks the piece at the bottom of the board once it reaches the bottom
function placePiece() {
    let shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                board[currentPiece.row + r][currentPiece.col + c] = 1; // Store placed piece permanently
            }
        }
    }
}
// spawn a new piece at the top
function spawnNewPiece() {
    const keys = Object.keys(tetrominos);
    const randomKey = keys[Math.floor(Math.random() * keys.length)]; // pick random key
    currentPiece = {
        shape: tetrominos[randomKey], // assing random shape
        row: 0,
        col: 3
    };
}
 // keyboard controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && canMove(currentPiece.row, currentPiece.col - 1)) {
        currentPiece.col--;
    } else if (event.key === "ArrowRight" && canMove(currentPiece.row, currentPiece.col + 1)) {
        currentPiece.col++;
    } else if (event.key === "ArrowDown") {
        moveDown();
    }
    updateBoard();
});

function startGame() {
    updateBoard();
    setInterval(moveDown, 1000); // move piece down with given interval
}

startGame();
