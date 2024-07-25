document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9;
    const sudokuGrid = document.getElementById("sudoku-grid");
    const solveButton = document.getElementById("solve-btn");
    const clearButton = document.getElementById("clear-btn");

    solveButton.addEventListener('click', solveSudoku);
    clearButton.addEventListener('click', clearBoard);

    for (let row = 0; row < gridSize; row++) {
        const newRow = document.createElement("tr");
        for (let column = 0; column < gridSize; column++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${column}`;

            input.addEventListener('input', function() {
                if (input.value.trim() !== '') {
                    input.classList.add('user-input');
                } else {
                    input.classList.remove('user-input');
                }
            });

            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
});

function clearBoard() {
    location.reload();
}

async function solveSudoku(){
    const gridSize = 9;
    const sudokuArray = [];

    for (let row = 0; row < gridSize; row++){
        sudokuArray[row] = [];
        for (let column = 0; column < gridSize; column++){
            const cellId = `cell-${row}-${column}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][column] = cellValue !== "" ? parseInt(cellValue) : 0;

            const cell = document.getElementById(cellId);

            if (cellValue !== ""){
                cell.classList.add("user-input");
            } else {
                cell.classList.remove("user-input");
            }
        }
    
    }

    for (let row = 0; row < gridSize; row++){
        for (let column = 0; column < gridSize; column++){
            const cellId = `cell-${row}-${column}`;
            const cell = document.getElementById(cellId);

            if (sudokuArray[row][column] !== 0){
                cell.classList.add("user-input");
            }
        }
    }


    if (solveSudokuHelper(sudokuArray)){
        for (let row = 0; row < gridSize; row++){
            for (let column = 0; column < gridSize; column++){
                const cellId = `cell-${row}-${column}`;
                const cell = document.getElementById(cellId);

                if(!cell.classList.contains("user-input")){
                    cell.value = sudokuArray[row][column];
                    cell.classList.add("solved");
                    await sleep(20); //delay for visualization
                }
            } 
        }
    } else {
        alert("No solution exists for the given Sudoku Puzzle.");
    }
}

function solveSudokuHelper(board){
    const gridSize = 9;

    for (let row = 0; row < gridSize; row++){
        for (let column = 0; column < gridSize; column++){
            if (board[row][column] === 0){
                for (let num = 1; num <= 9; num++){
                    if(isValidMove(board, row, column, num)){
                        board[row][column] = num;

                        if(solveSudokuHelper(board)){
                            return true; //puzzle solved
                        }

                        board[row][column] = 0; //Backtrack
                    }
                }
                return false; //no valid number found
            }
        }
    }

    return true;  //all cells are filled
}

function isValidMove(board, row, column, num){
    const gridSize = 9;

    for (let i = 0; i < gridSize; i++){
        if (board[row][i] === num || board[i][column] === num){
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startColumn = Math.floor (column / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++){
        for (let j = startColumn; j <  startColumn + 3; j++){
            if (board[i][j] === num){
                return false;
            }
        }
    }

    return true;
}


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
