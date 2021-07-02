/* eslint-disable import/no-unresolved */
import GameBoard from './gameboard';
import Player from './player';

const turnHeader = document.getElementById('turn')! as HTMLParagraphElement;

export default class DisplayController {
  private game: GameBoard;
  private playable: boolean;

  constructor() {
    this.game = new GameBoard();
    this.game.display = this;
    this.playable = true;
  }

  markTile(e: MouseEvent) {
    if ((e.target! as HTMLElement).tagName !== 'TD') {
      return;
    }
    if (!this.playable) {
      return;
    }

    const marked = this.game.getCurrentPlayer().mark(e.target as HTMLTableCellElement);
    if (marked) {
      this.checkGameover();
      if (this.playable) {
        this.game.nextTurn();
      }
    }
  }

  static changeTurn(currPlayer: Player) {
    turnHeader.textContent = `Player ${currPlayer.symbol}'s turn`;
  }

  checkGameover() {
    this.game.getSnapshot();
    if (this.game.checkWin()) {
      this.endGame(true);
      this.playable = false;
    } else if (this.game.checkTie()) {
      this.endGame(false);
      this.playable = false;
    }
  }

  reset() {
    GameBoard.clearBoard();
    this.playable = true;
    turnHeader.innerHTML = '<br>';
    this.startGame();
  }

  endGame(win: boolean) {
    if (win) {
      turnHeader.textContent = `Player ${this.game.getCurrentPlayer().symbol} wins!`;
    } else {
      turnHeader.textContent = "It's a tie!";
    }
  }

  setGameMode(mode: string) {
    this.game.setMode(mode);
  }

  startGame() {
    if (this.game.getMode() === 'single') {
      this.game.nextTurn();
      return;
    }
    this.game.currentPlayer = 0;
    turnHeader.textContent = "Player X's turn";
  }
}
