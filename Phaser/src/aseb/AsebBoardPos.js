import { PIECE_TYPE } from "./AsebPiece.js";

/**
 * @class AsebBoardPos
 * @description Represents a single position (a square) on the Aseb game board.
 * It holds information about its screen coordinates, validity, and any piece occupying it.
 */
export default class AsebBoardPos{

  /**
   * @param {AsebBoard} board - The board this position belongs to.
   * @param {number} x - The screen x-coordinate of this position.
   * @param {number} y - The screen y-coordinate of this position.
   * @param {AsebPiece} piecePlaced - The piece currently on this position, it will be null when the position has no piece Placed.
   * @param {boolean} validPos - Whether this is a valid, playable position.
   */
  constructor(board, x, y, piecePlaced = null, validPos = true) {
    /** @type {AsebBoard} */
    this.board = board;
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {boolean} */
    this.isSpecial = false;

    /** @type {AsebPiece|null} */
    this.piecePlaced = piecePlaced;
    /** @type {boolean} */
    this.validPos = validPos;
  }

  /**
   * Sets or clears the piece occupying this board position.
   * @param {AsebPiece|null} piece - The piece to place here, or null to clear it.
   */
  SetPiece(piece)
  {
    this.piecePlaced = piece;
  }
}