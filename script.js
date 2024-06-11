// script.js
document.addEventListener("DOMContentLoaded", () => {
    const grid = [];
    const rows = 10;
    const cols = 10;
    const mineCount = 10;
    const gameContainer = document.getElementById("game-container");

    function initializeGrid() {
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener("click", handleCellClick);
                cell.addEventListener("contextmenu", handleCellRightClick);
                gameContainer.appendChild(cell);
                row.push({ element: cell, isMine: false, isRevealed: false, isFlagged: false, mineCount: 0 });
            }
            grid.push(row);
        }
        placeMines();
        calculateNumbers();
    }

    function placeMines() {
        let placedMines = 0;
        while (placedMines < mineCount) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);
            if (!grid[row][col].isMine) {
                grid[row][col].isMine = true;
                placedMines++;
            }
        }
    }

    function calculateNumbers() {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],         [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j].isMine) continue;
                let count = 0;
                for (const [dx, dy] of directions) {
                    const newRow = i + dx;
                    const newCol = j + dy;
                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && grid[newRow][newCol].isMine) {
                        count++;
                    }
                }
                grid[i][j].mineCount = count;
            }
        }
    }

    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        revealCell(row, col);
    }

    function handleCellRightClick(event) {
        event.preventDefault();
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        const cell = grid[row][col];
        if (!cell.isRevealed) {
            cell.isFlagged = !cell.isFlagged;
            cell.element.classList.toggle("flag", cell.isFlagged);
        }
    }

    function revealCell(row, col) {
        const cell = grid[row][col];
        if (cell.isRevealed || cell.isFlagged) return;
        cell.isRevealed = true;
        cell.element.classList.add("revealed");
        if (cell.isMine) {
            cell.element.classList.add("mine");
            alert("Game Over!");
            return;
        }
        if (cell.mineCount > 0) {
            cell.element.textContent = cell.mineCount;
        } else {
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],         [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            for (const [dx, dy] of directions) {
                const newRow = row + dx;
                const newCol = col + dy;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }

    initializeGrid();
});
