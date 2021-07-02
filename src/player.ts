export default class Player {
  // eslint-disable-next-line
  constructor(public symbol: string) {}

  mark(this: Player, tile: HTMLTableCellElement) {
    if (tile.textContent) {
      return false;
    }
    // eslint-disable-next-line no-param-reassign
    tile.textContent = this.symbol;
    return true;
  }
}
