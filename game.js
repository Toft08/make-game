const gameBoard = document.getElementById("gameBoard");

// Create a 10x20 grid
for (let i = 0; i < 200; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
}

const rows = 20;
const cols = 10;
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

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


function moveDown() {
    if (canMove(currentPiece.row + 1, currentPiece.col)) {
        currentPiece.row++;
    } else {
        placePiece();
        spawnNewPiece();
    }
    updateBoard();
}

function canMove(nextRow, nextCol) {
    let shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                let newR = nextRow + r;
                let newC = nextCol + c;
                if (newR >= rows || newC < 0 || newC >= cols || board[newR][newC] === 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

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

function spawnNewPiece() {
    currentPiece = {
        shape: tetrominos.T,
        row: 0,
        col: 3
    };
}

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
    setInterval(moveDown, 1000);
}

startGame();
