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

function updateScoreboard() {
    document.getElementById("lines").textContent = totalClearedRows;
    document.getElementById("final-lines").textContent = totalClearedRows;
    document.getElementById("level").textContent = level;
    document.getElementById("final-level").textContent = level;
    document.getElementById("score").textContent = score;
    document.getElementById("final-score").textContent = score;
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
    } else {
        pauseMenu.style.display = 'none';
        requestAnimationFrame(gameLoop);
    }
}