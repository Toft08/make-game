// Define the tetromino shapes using 2D arrays
const tetrominos = {
    T: { shape: [[0, 1, 0], [1, 1, 1]], type: "tetromino-t" },
    I: { shape: [[1, 1, 1, 1]], type: "tetromino-i" },
    O: { shape: [[1, 1], [1, 1]], type: "tetromino-o" },
    L: { shape: [[1, 0], [1, 0], [1, 1]], type: "tetromino-l" },
    J: { shape: [[0, 1], [0, 1], [1, 1]], type: "tetromino-j" },
    S: { shape: [[0, 1, 1], [1, 1, 0]], type: "tetromino-s" },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], type: "tetromino-z" }
};

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

function rotateMatrix(matrix) {
    // Transpose the matrix (swap rows and columns)
    let transposed = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));

    // Reverse each row to complete the 90° rotation
    return transposed.map(row => row.reverse());
}