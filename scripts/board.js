// Game board state
let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null));

// Check if the current piece collides with anything
function isCollision(offsetX = 0, offsetY = 0, rotatedBlocks = null) {
    const blocksToCheck = rotatedBlocks || currentPiece.blocks;
    
    return blocksToCheck.some(block => {
        const x = currentPiece.x + block.x + offsetX;
        const y = currentPiece.y + block.y + offsetY;
        
        // Check if out of bounds
        if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) {
            return true;
        }
        
        // Check if collides with existing blocks
        if (y >= 0 && board[y][x] !== null) {
            return true;
        }
        
        return false;
    });
}

// Lock the current piece in place
function lockPiece() {
    if (!currentPiece) return;
    
    // Add blocks to the board
    currentPiece.blocks.forEach(block => {
        const x = currentPiece.x + block.x;
        const y = currentPiece.y + block.y;
        
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            board[y][x] = {
                type: currentPiece.type,
                element: document.createElement('div')
            };
            
            const blockElement = board[y][x].element;
            blockElement.className = 'tetris-block';
            blockElement.style.width = BLOCK_SIZE + 'px';
            blockElement.style.height = BLOCK_SIZE + 'px';
            blockElement.style.backgroundColor = COLORS[currentPiece.type];
            updateBlockPosition(blockElement, x, y);
            
            tetrisContainer.appendChild(blockElement);
        }
    });
    
    // Remove the current piece elements
    currentPiece.elements.forEach(element => {
        tetrisContainer.removeChild(element);
    });
    
    // Check for completed lines
    checkLines();
    
    // Spawn a new piece
    spawnNewPiece();
}

// Check for completed lines
function checkLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== null)) {
            // Remove the line
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (board[y][x] && board[y][x].element) {
                    tetrisContainer.removeChild(board[y][x].element);
                }
            }
            
            // Move all lines above down
            for (let yy = y; yy > 0; yy--) {
                board[yy] = [...board[yy - 1]];
                
                // Update positions of moved blocks
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    if (board[yy][x] !== null) {
                        updateBlockPosition(board[yy][x].element, x, yy);
                    }
                }
            }
            
            // Clear the top line
            board[0] = Array(BOARD_WIDTH).fill(null);
            
            linesCleared++;
            
            // Recheck the current line since we moved everything down
            y++;
        }
    }
    
    if (linesCleared > 0) {
        // Update score based on lines cleared
        addScore(linesCleared);
        
        // Update lines and level
        addLines(linesCleared);
    }
}