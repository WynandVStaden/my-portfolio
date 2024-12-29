const canvas = document.getElementById('gameOfLifeCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 10;
const rows = canvas.height / gridSize;
const cols = canvas.width / gridSize;

let grid = createGrid(rows, cols);
let animationId = null;

// Check if the game-of-life section exists
const gameOfLifeSection = document.getElementById('game-of-life');

if (gameOfLifeSection) {
    const controlsDiv = document.getElementById('controls');
    const hideButtons = gameOfLifeSection.dataset.hideButtons === 'true';

    // Hide buttons if the option is set
    if (hideButtons && controlsDiv) {
        controlsDiv.style.display = 'none'; // Hide the controls div
    }
}


// Create an empty grid
function createGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define oval properties
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);
    const radiusX = Math.floor(cols / 3);
    const radiusY = Math.floor(rows / 3);

    grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            // Check if the current cell is within the oval
            const dx = c - centerX;
            const dy = r - centerY;
            if ((dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1) {
                grid[r][c] = 1; // Mark cell as alive if in the oval
            }

            // Set fill color based on cell state
            ctx.fillStyle = grid[r][c] ? 'black' : 'white';
            ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
            ctx.strokeStyle = 'gray'; // Add grid lines for clarity
            ctx.strokeRect(c * gridSize, r * gridSize, gridSize, gridSize);
        });
    });
}



// Update grid based on Game of Life rules
function updateGrid(grid) {
    const nextGrid = createGrid(rows, cols);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const aliveNeighbors = countAliveNeighbors(grid, r, c);
            if (grid[r][c] && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
                nextGrid[r][c] = 1;
            } else if (!grid[r][c] && aliveNeighbors === 3) {
                nextGrid[r][c] = 1;
            }
        }
    }
    return nextGrid;
}

// Count alive neighbors
function countAliveNeighbors(grid, row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                count += grid[r][c];
            }
        }
    }
    return count;
}

// Animation loop
function animate() {
    grid = updateGrid(grid);
    drawGrid(grid);
    animationId = requestAnimationFrame(animate);
}

// Event Listeners
document.getElementById('start').addEventListener('click', () => {
    if (!animationId) {
        console.log('Starting animation...');
        animate();
    }
});

document.getElementById('pause').addEventListener('click', () => {
    console.log('Pausing animation...');
    cancelAnimationFrame(animationId);
    animationId = null;
});

document.getElementById('reset').addEventListener('click', () => {
    console.log('Resetting grid...');
    grid = createGrid(rows, cols);
    drawGrid(grid);
    cancelAnimationFrame(animationId);
    animationId = null;
});

// Initialize
canvas.addEventListener('click', (e) => {
    const x = Math.floor(e.offsetX / gridSize);
    const y = Math.floor(e.offsetY / gridSize);
    console.log(`Toggling cell: (${x}, ${y})`);
    grid[y][x] = grid[y][x] ? 0 : 1;
    drawGrid(grid);
});

// Randomly remove one black square
function removeRandomAliveCell(grid) {
    // Find all alive cells
    const aliveCells = [];
    grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell === 1) {
                aliveCells.push({ row: r, col: c });
            }
        });
    });

    // If there are no alive cells, do nothing
    if (aliveCells.length === 0) return;

    // Randomly select one alive cell and make it dead
    const randomIndex = Math.floor(Math.random() * aliveCells.length);
    const { row, col } = aliveCells[randomIndex];
    grid[row][col] = 0; // Mark as dead
    grid[row-1][col] = 0;
    grid[row+1][col] = 0;
    grid[row-2][col] = 0;
    grid[row+2][col] = 0;


    
    grid[row][col-1] = 0;
    grid[row][col+1] = 0;
    grid[row][col-2] = 0;
    grid[row][col+2] = 0;
    drawGrid(grid); // Redraw grid to reflect changes
}

drawGrid(grid);

// Automatically start removing one black square every second
setInterval(() => {
    removeRandomAliveCell(grid);
}, 500);

animate();
