// Initialize the game board as 2D array filled with 0 (empty spaces)
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

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