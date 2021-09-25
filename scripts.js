const marks = {
  CROSS: {
    name: "cross",
    symbol: "x"},
  CIRCLE: {
    name: "circle",
    symbol: "o"},
  VOID: " "
}
const SPACE_CODE = 32;
const resultWindow = document.getElementById('result-window');
const resultMessage = document.getElementById('result-message');
const victoryMessage = " has won. Congratulations!";
const tieMessage = "Out of moves. It is a tie :(";
const retryButton = document.getElementById('retry-button');
let player = marks.CROSS;
let grid = document.querySelector('.ttt-container');
let cells = [[],[],[]];
initializeBoard(cells);
let playerTurnMessage = document.querySelector('.player-turn-message');

function markCell(cell) {
  if (cell.textContent === marks.VOID) {
    cell.textContent = player.symbol;
    cell.classList.add(player.name);
    checkGameState();
    togglePlayer();
  } else {
    console.log('The cell is occupied.');
  }
}

function togglePlayer() {
  if (player === marks.CROSS) {
    player = marks.CIRCLE;
  } else {
    player = marks.CROSS;
  }
  playerTurnMessage.classList.toggle('cross');
  playerTurnMessage.classList.toggle('circle');
}

function checkGameState() {
  const simplified = cells.map(element => element.map(element => element.textContent));
  const transposed = transposeArray(simplified);
  let winner = false;
  if ((winner = checkRows(simplified)) > SPACE_CODE ||
      (winner = checkRows(transposed)) > SPACE_CODE ||
      (winner = checkDiagonals(simplified)) > SPACE_CODE ||
      (winner = checkDiagonals(exchangeRows(simplified, 0, 2))) > SPACE_CODE) {
    showResultMessage(winner);
  } else if (!freeSpaceExists(simplified)) {
    showResultMessage();
  }
}

function checkRows(board) {
  let mark;
  board.some(row => {
    mark = row.reduce((acc, current) => acc === current? current : " ")
    return (mark !== " ")? true: null;
  });
  return mark.charCodeAt();
}

function checkDiagonals(board) {
  let mark = board[0][0];
  for (let index = 0; index < board.length; index++) {
    const cell = board[index][index];
    if (cell !== mark) {
      return -1;
    }
  }
  return mark.charCodeAt();
}

function freeSpaceExists(board) {
  for (let j = 0; j < board.length; j++) {
    const row = board[j];
    for (let i = 0; i < row.length; i++) {
      const col = row[i];
      if (col === marks.VOID) {
        return true;
      }
    }
  }
  return false;
}

// transpose an MxM array matrix
// https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
function transposeArray(array) {
  let transpose = array[0].map((_, colIndex) => array.map(row => row[colIndex]));
  return transpose;
}

// exchange columns
function exchangeRows(array, rowA, rowB) {
  const aux = array[rowA];
  array[rowA] = array[rowB];
  array[rowB] = aux;
  return array;
}

function initializeBoard(board) {
  for (let row = 0, index = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      board[row][col] = grid.children[index++];
      board[row][col].textContent = marks.VOID; 
      board[row][col].classList.remove('circle');
      board[row][col].classList.remove('cross');
    }
  } 
}

function showResultMessage(winner) {
  resultWindow.setAttribute('open', 'true');
  if(winner) {
    resultMessage.classList.add(player.name);
    resultMessage.textContent = victoryMessage;
  } else {
    resultMessage.textContent = tieMessage;
  }
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('ttt-box')) {
    markCell(e.target);
    // checkGameState();
    // togglePlayer();
  }
})

retryButton.addEventListener('click', ()=> {
  initializeBoard(cells);
  resultWindow.removeAttribute('open');
  resultMessage.classList.remove('circle');
  resultMessage.classList.remove('cross');
})

