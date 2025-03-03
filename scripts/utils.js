// Constants for the game
const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Colors for different tetromino pieces
const COLORS = [
    '#00FFFF', // I - Cyan
    '#0000FF', // J - Blue
    '#FFA500', // L - Orange
    '#FFFF00', // O - Yellow
    '#00FF00', // S - Green
    '#800080', // T - Purple
    '#FF0000'  // Z - Red
];

// Get the bounds of a shape for centering
function getShapeBounds(blocks) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    blocks.forEach(block => {
        minX = Math.min(minX, block.x);
        maxX = Math.max(maxX, block.x);
        minY = Math.min(minY, block.y);
        maxY = Math.max(maxY, block.y);
    });
    
    return { minX, maxX, minY, maxY };
}