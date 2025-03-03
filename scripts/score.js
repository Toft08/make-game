// Score and stats elements
const timeElement = document.getElementById('time');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');

// Game stats
let score = 0;
let level = 1;
let lines = 0;
let startTime = null;
let elapsedTime = 0;
let dropInterval = 1000; // Initial drop speed in ms

// Update the timer display
function updateTimer(time) {
    if (isPaused || isGameOver) return;
    
    if (!startTime) {
        startTime = time;
    }
    
    const currentTime = time - startTime + elapsedTime;
    const seconds = Math.floor(currentTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update the score display
function updateScore() {
    scoreElement.textContent = score;
}

// Update the level display
function updateLevel() {
    levelElement.textContent = level;
}

// Update the lines display
function updateLines() {
    linesElement.textContent = lines;
}

// Add to score based on lines cleared
function addScore(linesCleared) {
    // Points for 0, 1, 2, 3, 4 lines
    const linePoints = [0, 40, 100, 300, 1200];
    score += linePoints[linesCleared] * level;
    updateScore();
}

// Add cleared lines and update level
function addLines(linesCleared) {
    lines += linesCleared;
    updateLines();
    
    // Level up every 10 lines
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel > level) {
        level = newLevel;
        updateLevel();
        // Increase speed
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    }
}

// Add points for soft drop
function addSoftDropPoints() {
    score += 1;
    updateScore();
}