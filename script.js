let size = 4;
let tiles = [];
let points = 0;
let highPoints = localStorage.getItem("highPoints") || 0;

let boardRows = document.querySelectorAll(".row");
let pointsBox = document.querySelector(".score-box .score");
let highPointsBox = document.querySelector(".score-box.best .score");
let restartBtn = document.querySelector(".new-game-btn");

function startGame() {
  tiles = [];
  for (let i = 0; i < size; i++) {
    tiles.push([0, 0, 0, 0]);
  }
  points = 0;
  addTile();
  addTile();
  showTiles();
  showPoints();
}

function showPoints() {
  pointsBox.textContent = points;
  if (points > highPoints) {
    highPoints = points;
    localStorage.setItem("highPoints", highPoints);
  }
  highPointsBox.textContent = highPoints;
}

function showTiles() {
  for (let row = 0; row < size; row++) {
    let blocks = boardRows[row].children;
    for (let col = 0; col < size; col++) {
      let num = tiles[row][col];
      blocks[col].textContent = num === 0 ? "" : num;
      blocks[col].className = "";
      blocks[col].classList.add("tile");
      if (num) blocks[col].classList.add("tile-" + num);
    }
  }
}

function addTile() {
  let blanks = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (tiles[i][j] === 0) blanks.push([i, j]);
    }
  }
  if (blanks.length === 0) return;
  let pick = blanks[Math.floor(Math.random() * blanks.length)];
  tiles[pick[0]][pick[1]] = Math.random() < 0.9 ? 2 : 4;
}

function moveRowLeft(row) {
  let newRow = row.filter(n => n);
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      points += newRow[i];
      newRow[i + 1] = 0;
    }
  }
  newRow = newRow.filter(n => n);
  while (newRow.length < size) newRow.push(0);
  return newRow;
}

function turnBoard() {
  let turned = [];
  for (let i = 0; i < size; i++) {
    turned.push([]);
    for (let j = 0; j < size; j++) {
      turned[i][j] = tiles[size - j - 1][i];
    }
  }
  tiles = turned;
}

function play(key) {
  let turnCount = 0;
  if (key === "ArrowUp") turnCount = 3;
  if (key === "ArrowRight") turnCount = 2;
  if (key === "ArrowDown") turnCount = 1;

  for (let i = 0; i < turnCount; i++) turnBoard();

  let didMove = false;
  for (let i = 0; i < size; i++) {
    let before = tiles[i].slice();
    tiles[i] = moveRowLeft(tiles[i]);
    if (before.join() !== tiles[i].join()) didMove = true;
  }

  for (let i = 0; i < (4 - turnCount) % 4; i++) turnBoard();

  if (didMove) {
    addTile();
    showTiles();
    showPoints();
  }
}

document.addEventListener("keydown", e => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    play(e.key);
  }
});

restartBtn.addEventListener("click", () => {
  startGame();
});

startGame();
