// Global variables
const gameBoard = document.getElementById("gameBoard");
const pauseMenu = document.getElementById('pause-menu');
const gameOverElement = document.getElementById('game-over');
const playBtn = document.getElementById('play-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreElement = document.getElementById('final-score');
const restartBtnGameOver = document.getElementById('restart-btn-game-over');

gameOverElement.style.display = 'none';

// Game constants and variables
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
let totalClearedRows = 0;
let gameHasStarted = false;


// Checking if tetris piece can move to a new position
function canMove(nextRow, nextCol) {
    let shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                let newR = nextRow + r;
                let newC = nextCol + c;

                // check if the piece is inside the board or collides with other pieces
                if (newR >= rows || newC < 0 || newC >= cols || board[newR][newC] !== 0) {
                    return false; // collision detected
                }
            }
        }
    }
    return true;
}
// Cheking if tetris pieces can rotate
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
// Calculates where current tetris piece would land
function getGhostPosition() {
    let ghostRow = currentPiece.row;

    while (canMove(ghostRow + 1, currentPiece.col)) {
        ghostRow++;
    }
    return ghostRow;
}