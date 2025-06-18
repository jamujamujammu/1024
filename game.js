const size = 12;
let board, score;

function setup() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  addRandom();
  addRandom();
  updateView();
}

function addRandom() {
  const empty = [];
  board.forEach((row, i) =>
    row.forEach((v, j) => {
      if (v === 0) empty.push([i, j]);
    })
  );
  if (empty.length === 0) return;
  const [i, j] = empty[Math.floor(Math.random() * empty.length)];
  board[i][j] = Math.random() < 0.9 ? 2 : 4;
}

function updateView() {
  const container = document.getElementById('game-container');
  container.innerHTML = '';
  board.flat().forEach(v => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    if (v > 0) {
      tile.textContent = v;
      tile.setAttribute('data-value', v);
    }
    container.appendChild(tile);
  });
  document.getElementById('score-value').textContent = score;
}

function slideRow(row) {
  let arr = row.filter(v => v);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  return arr.filter(v => v).concat(Array(size - arr.filter(v => v).length).fill(0));
}

function rotateBoard(clockwise = true) {
  const newBoard = Array.from({ length: size }, () => Array(size).fill(0));
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      newBoard[i][j] = clockwise ? board[size - j - 1][i] : board[j][size - i - 1];
  board = newBoard;
}

function handleMove(direction) {
  let moved = false;

  for (let i = 0; i < { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3 }[direction]; i++) {
    rotateBoard();
  }

  board = board.map(row => {
    const original = [...row];
    const newRow = slideRow(row);
    if (!moved && newRow.some((v, i) => v !== original[i])) moved = true;
    return newRow;
  });

  for (let i = 0; i < (4 - { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3 }[direction]) % 4; i++) {
    rotateBoard();
  }

  if (moved) {
    addRandom();
    updateView();
  }
}

window.addEventListener('keydown', e => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    handleMove(e.key);
  }
});

document.getElementById('new-game').addEventListener('click', setup);

setup();
