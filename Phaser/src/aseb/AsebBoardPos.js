import { PIECE_TYPE } from "./AsebPiece.js";

export default class AsebBoardPos{

  constructor(board, x, y, piecePlaced = null, validPos = true) {
    this.board = board;
    this.x = x;
    this.y = y;

    this.piecePlaced = piecePlaced;
    this.validPos = validPos;
  
    
  }
  SetPiece(piece) // Sets the AsebPiece instance in this positions (the previous value gets overwritted)
  {
    this.piecePlaced = piece;
  }

  

}