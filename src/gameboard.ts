/* eslint-disable import/no-unresolved */
import DisplayController from './display';
import Player from './player';

const table = document.querySelector('table')!;
const { rows } = table;

export default class GameBoard {
  currentPlayer: number;
  private players: Player[];
  private mode: string | undefined;
  public display: DisplayController | undefined;
  private snapshot: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  constructor() {
    this.currentPlayer = 0;
    this.players = [new Player('X'), new Player('O')];
  }

  setMode(mode: string) {
    this.mode = mode;
    if (mode === 'single') {
      this.currentPlayer = 1;
    }
  }

  getMode() {
    return this.mode;
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentPlayer];
  }

  nextTurn() {
    if (this.mode === 'single') {
      this.playBest();
      this.currentPlayer = 0;
      this.display!.checkGameover();
      this.currentPlayer = 1;
      return;
    }
    this.currentPlayer = (this.currentPlayer + 1) % 2;
    DisplayController.changeTurn(this.getCurrentPlayer());
  }

  checkTie() {
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (this.snapshot[i][j] === '') {
          return false;
        }
      }
    }
    return true;
  }

  checkWin() {
    return this.checkRows() || this.checkColumns() || this.checkDiagonals();
  }

  private checkRows() {
    return this.snapshot.some((row: string[]) => GameBoard.checkThreeTiles(row));
  }

  private checkColumns() {
    for (let i = 0; i < 3; i += 1) {
      const col = [];
      for (const row of this.snapshot) {
        col.push(row[i]);
      }
      if (GameBoard.checkThreeTiles(col)) {
        return true;
      }
    }
    return false;
  }

  private checkDiagonals() {
    const diags = [
      [this.snapshot[0][0], this.snapshot[1][1], this.snapshot[2][2]],
      [this.snapshot[0][2], this.snapshot[1][1], this.snapshot[2][0]],
    ];

    return diags.some((diag: string[]) => GameBoard.checkThreeTiles(diag));
  }

  private static checkThreeTiles(threeTiles: string[]) {
    const emptyCheck = !!threeTiles[0];
    const sameCheck = threeTiles[0] === threeTiles[1] && threeTiles[1] === threeTiles[2];
    return emptyCheck && sameCheck;
  }

  getSnapshot() {
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        this.snapshot[i][j] = rows[i].cells[j].textContent!;
      }
    }
  }

  static clearBoard() {
    for (const row of rows) {
      for (const cell of row.cells) {
        cell.textContent = '';
      }
    }
  }

  playBest() {
    this.getSnapshot();
    let bestScore = -Infinity;
    // placeholder
    let bestMove = { i: 0, j: 0 };
    let score: number;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (this.snapshot[i][j] !== '') {
          // eslint-disable-next-line no-continue
          continue;
        }
        this.snapshot[i][j] = 'X';
        score = this.minimax(0, -Infinity, Infinity, false);
        this.snapshot[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          bestMove = { i, j };
        }
      }
    }
    rows[bestMove.i].cells[bestMove.j].textContent = 'X';
  }

  private minimax(depth: number, alpha: number, beta: number, isMaximizing: boolean) {
    if (this.checkWin()) {
      if (isMaximizing) {
        return -100 + depth;
      }
      return 100 - depth;
    }
    if (this.checkTie()) {
      return 0;
    }

    let bestScore: number;
    let optimizer: Function;
    let symbol: string;
    let newAlpha = alpha;
    let newBeta = beta;

    if (isMaximizing) {
      bestScore = -Infinity;
      optimizer = Math.max;
      symbol = 'X';
    } else {
      bestScore = Infinity;
      optimizer = Math.min;
      symbol = 'O';
    }

    let score: number;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (this.snapshot[i][j] !== '') {
          // eslint-disable-next-line no-continue
          continue;
        }
        this.snapshot[i][j] = symbol;
        score = this.minimax(depth + 1, newAlpha, newBeta, !isMaximizing);
        this.snapshot[i][j] = '';
        bestScore = optimizer(bestScore, score);

        if (isMaximizing) {
          newAlpha = optimizer(newAlpha, score);
        } else {
          newBeta = optimizer(newBeta, score);
        }
        if (newBeta <= newAlpha) {
          return bestScore;
        }
      }
    }
    return bestScore;
  }
}
