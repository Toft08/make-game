// DOM Elements
const tetrisContainer = document.getElementById('tetris-container');
const pauseMenu = document.getElementById('pause-menu');
const continueBtn = document.getElementById('continue-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtnGameOver = document.getElementById('restart-btn-game-over');
const nextPieceContainer = document.getElementById('next-piece-container');

// Update a block's position on the screen
function updateBlockPosition(element, x, y) {
    element.style.transform = `translate(${x * BLOCK_SIZE}px, ${y * BLOCK_SIZE}px)`;
}

// Update all blocks of the current piece
function updatePiecePosition() {
    if (!currentPiece || !currentPiece.elements) return;
    
    currentPiece.blocks.forEach((block, index) => {
        updateBlockPosition(
            currentPiece.elements[index],
            currentPiece.x + block.x,
            currentPiece.y + block.y
        );
    });
}

// Render the current piece on the board
function renderPiece() {
    if (!currentPiece) return;
    
    currentPiece.elements = currentPiece.blocks.map(block => {
        const blockElement = document.createElement('div');
        blockElement.className = 'tetris-block';
        blockElement.style.width = BLOCK_SIZE + 'px';
        blockElement.style.height = BLOCK_SIZE + 'px';
        blockElement.style.backgroundColor = COLORS[currentPiece.type];
        
        // Set initial position
        updateBlockPosition(blockElement, currentPiece.x + block.x, currentPiece.y + block.y);
        
        tetrisContainer.appendChild(blockElement);
        return blockElement;
    });
}

// Update the next piece display
function updateNextPieceDisplay() {
    // Clear the next piece container
    while (nextPieceContainer.firstChild) {
        nextPieceContainer.removeChild(nextPieceContainer.firstChild);
    }
    
    // Get the bounds of the piece to center it
    const bounds = getShapeBounds(nextPiece.blocks);
    const width = bounds.maxX - bounds.minX + 1;
    const height = bounds.maxY - bounds.minY + 1;
    
    // Center position
    const centerX = (150 - (width * (BLOCK_SIZE * 0.8))) / 2;
    const centerY = (150 - (height * (BLOCK_SIZE * 0.8))) / 2;
    
    // Create the blocks
    nextPiece.blocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.className = 'tetris-block';
        blockElement.style.width = (BLOCK_SIZE * 0.8) + 'px';
        blockElement.style.height = (BLOCK_SIZE * 0.8) + 'px';
        blockElement.style.backgroundColor = COLORS[nextPiece.type];
        
        // Position adjustment to center the piece
        const adjustedX = (block.x - bounds.minX) * (BLOCK_SIZE * 0.8) + centerX;
        const adjustedY = (block.y - bounds.minY) * (BLOCK_SIZE * 0.8) + centerY;
        
        blockElement.style.transform = `translate(${adjustedX}px, ${adjustedY}px)`;
        nextPieceContainer.appendChild(blockElement);
    });
}