import AsebPiece, { PIECE_TYPE } from "./AsebPiece.js";
import AsebBoardPos from "./AsebBoardPos.js";

/**
 * @class AsebBoard
 * @extends Phaser.GameObjects.Image
 * @description Represents the Aseb game board. Manages board positions, pieces, and their movement logic.
 * Emits events for piece movements and special actions (like landing on special positions).
 */
export default class AsebBoard extends Phaser.GameObjects.Image 
{

  /**
   * @param {Phaser.Scene} scene - The scene this board belongs to.
   * @param {number} x - The horizontal position of this board in the world.
   * @param {number} y - The vertical position of this board in the world.
   * @param {string} image - The texture key for the board image.
   */
  constructor(scene, x, y, image = "asebBoard") {
    super(scene,x,y,image);
    /** @type {AsebGame} */
    this.asebGame = scene.asebGame;
    this.scene.add.existing(this);

    /** @type {number} */
    this.rows = 3;
    /** @type {number} */
    this.cols = 12;

    this.createPositions();
    this.createPieces();

    this.on('pieceAnimComplete', (piece, IsSpecialPosition, row, col) =>{
      this.checkNewPosition(IsSpecialPosition, piece, row, col);
    });
  }

  /**
   * Creates the grid of board positions, marking them as valid, invalid, or special.
   */
  createPositions()
  {
    this.positions = [];
    this.specialBoxes = [
      {row: 0, col: 11},
      {row: 2, col: 11},
      {row: 1, col: 8},
      {row: 1, col: 4},
    ];


    // --- Approximate dimensions for positioning ---
    const squareWidth = 81.5;
    const squareHeight = 132;
    // Top-left corner of the grid relative to the board's center
    const gridStartX = this.x -440;
    const gridStartY = this.y - 140;
    // ---

    for (let row = 0; row < this.rows; row++) {
      this.positions[row] = [];
      for (let col = 0; col < this.cols; col++) {
        // The first 8 columns of the top (0) and bottom (2) rows are not valid playable positions.
        const isValid = (row === 1) || (col >= 8); // All the middle positions are valid and everything past the eight colum is also valid

        const posX = gridStartX + (col * squareWidth);
        const posY = gridStartY + (row * squareHeight);

        this.positions[row][col] = new AsebBoardPos(this, posX, posY, null, isValid);
      }
    }
    // All positions that matches the specialBoxes positions now are special positions
    this.specialBoxes.forEach(position => {
      this.positions[position.row][position.col].isSpecial = true;
      this.positions[position.row][position.col].playerlandedHere = false;
    });
  }

    /**
     * Creates the player and enemy pieces and places them in their starting spawn areas.
     */
    createPieces()
    {
      this.enemyPieces = [];
      this.playerPieces = [];

      for (let i = 0; i < 5; i++) {
        
        const pieceOffsetX = (i - 2.5) * 81.5;

        let enemyPiece = new AsebPiece(this.scene, this.x + pieceOffsetX, this.y - 140, 'redPiece', this,  PIECE_TYPE.ENEMY).setOrigin(0.5).setScale(0.1);
        this.enemyPieces.push(enemyPiece);

        let playerPiece = new AsebPiece(this.scene, this.x + pieceOffsetX, this.y + 125, 'bluePiece', this, PIECE_TYPE.PLAYER).setOrigin(0.5).setScale(0.1);
        this.playerPieces.push(playerPiece);

      }
    }

    /**
     * Sets the interactable state for all player pieces.
     * @param {boolean} state - True to make pieces interactive, false otherwise.
     */
    setPlayerPieceInteractable(state)
    {
      this.playerPieces.forEach(piece => {
        piece.setInteractable(state, this.asebGame.player.actualStickResult);

        piece.setIdleAnimation(piece.movable);

      });
    }

    /**
     * Calculates the target board position for a piece given a number of moves.
     * @param {AsebPiece} piece - The piece to calculate the move for.
     * @param {number} numPositions - The number of squares to move.
     * @returns {{row: number, col: number}} The calculated target row and column.
     */
    getNextBoardPosition(piece, numPositions)  
    {
      let currentRow = piece.boardPos.row;
      let currentCol = piece.boardPos.col;

      // If the piece is not on the board yet (if its on the spawn)
      if (currentRow === -1 || currentCol === -1) {
          if (piece.type === PIECE_TYPE.PLAYER) {
              currentRow = 2; // Player pieces enter from the bottom row
              currentCol = 7;
          } else {
              currentRow = 0; // Enemy pieces enter from the top row
              currentCol = 7;
          }
      }

      let targetRow = currentRow;
      let targetCol = currentCol;

      for (let i = 0; i < numPositions; i++) {
        //If on the middle row, always move left.
        if (targetRow === 1) {
          targetCol--;
        }
        //If at the end of a side row, change rows.
        else if (targetCol === this.cols - 1) { // targetRow is guaranteed not to be 1 here
          if (piece.type === PIECE_TYPE.PLAYER) {
            targetRow--; // Player moves up (2 -> 1) //Down row to middle row
          } else {
            targetRow++; // Enemy moves down (0 -> 1) // Upper row to middle row
          }
        }
        // Move right on the side rows.
        else {
          targetCol++;
        }
      }

      
      return { row: targetRow, col: targetCol };
    }

    /**
     * Checks if there are any valid moves available for a given set of pieces and a move distance.
     * @param {AsebPiece[]} piecesArray - The array of pieces to check (player pieces or enemy pieces).
     * @param {number} moves - The number of squares to move.
     * @returns {boolean} True if at least one valid move exists, false otherwise.
     */
    IsThereValidMoves(piecesArray, moves)
    {
      for (const piece of piecesArray) {
        if (!piece.active) continue;

        if  (this.IsValidMove(piece, this.getNextBoardPosition(piece, moves)).isValid)
        {
          return true;
        }
      }
      return false
        
    }



    /**
     * Validates a potential move for a piece to a target row and column.
     * @param {AsebPiece} piece - The piece that is intended to move.
     * @param {{row: number, col: number}} position - The target destination with row and column.
     * @returns {{isValid: boolean, piece: AsebPiece|null, isSpecialPosition: boolean, msg: string}} An object describing the validity of the move.
     */
    IsValidMove(piece, {row, col})
    {
      if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return {isValid: false, piece: null, msg: "InValid Move, OutOfRange position"};

      let boardTargetPos = this.positions[row][col]; // boardTargetPos is a AsebBoardPos instance
      if (!boardTargetPos.validPos) return {isValid: false, piece: null, msg: "InValid Move, Invalid Board position"};
      if (boardTargetPos.piecePlaced !== null && boardTargetPos.piecePlaced.type === piece.type) 
      {
        return {isValid: false, piece: boardTargetPos.piecePlaced , msg: "InValid Move, same Piece in that position"};
      }

      // From here, the movement is valid.

      return {isValid: true, piece: boardTargetPos.piecePlaced, isSpecialPosition: boardTargetPos.isSpecial, msg: "Valid Move"}; //piecePlaced can be null

    }
    

    /**
     * Attempts to move a piece to a specified board position.
     * This function handles validating the move, capturing opponent pieces, and emitting events.
     * @param {AsebPiece} piece - The piece to move.
     * @param {{row: number, col: number}} The target destination with row and column.
     * @returns {boolean} True if the move was successful, false otherwise.
     */
    TryMovePiece(piece , {row, col})
    {
      // Check if the target position is valid 
      // If the AsebBoardPos has a enemy piece (that piece goes to the spawn), 
      // If the position has no piece

      let isNextPositionValid = this.IsValidMove(piece, {row: row, col: col})

      console.log(isNextPositionValid.msg);
      
      if (!isNextPositionValid.isValid) // If the move is invalid
      { return false; }
      

      let boardTargetPos = this.positions[row][col];

      if (isNextPositionValid.piece !== null) // If a anemy piece is in the next position
      {
        console.log("Landed on an opponent's piece. Sending it back to spawn.");
        isNextPositionValid.piece.ReturnToSpawn();
        this.emit('pieceCaptured', isNextPositionValid.piece);
      }

      
      // The position of the piece before moving
        const startRow = piece.boardPos.row; 
        const startCol = piece.boardPos.col;

        // If the piece is already on the board (not in spawn), clear its old position on the board.
        if (startRow !== -1 && startCol !== -1) {
          this.positions[startRow][startCol].SetPiece(null);
        }

        piece.setBoardVariables(row, col);

        piece.MoveInScreen(boardTargetPos.x, boardTargetPos.y, isNextPositionValid.isSpecialPosition, row, col);
        this.scene.sound.play('boxClickedSFX', { volume: 0.5 * this.scene.playerData.sfxVolume }); // The sound when a piece is moved is the same as when a box is clicked in the selection menu
        boardTargetPos.SetPiece(piece);

        return true;
    }


    checkNewPosition(isSpecialPosition, piece, row, col)
    {
      if (isSpecialPosition)
        {
          this.emit('SpecialPosition' ,piece.type);
          if (piece.type === PIECE_TYPE.PLAYER) 
            {
              this.positions[row][col].playerlandedHere = true;
              console.log("Player landed on a special position. position: " + row + "," + col);
            }
          
        }
        else if (piece.Ended())
        {
          this.emit('pieceReachesEnd', piece);
          this.positions[row][col].SetPiece(null);
          piece.destroy();
        }
        else this.emit('pieceMoved', piece); // Emit an event to notify the scene.
    }
    /**
     * Manages the AI's turn. It gets a throw result and attempts to make a valid move with a random piece.
     * @param {number} StickResultSum - The result of the AI's stick throw.
     */
    doRandomMovement(StickResultSum)
    {
        console.log(`Anubis threw a ${StickResultSum}`);
        // If the throw is 0, the turn is skipped.
        if (StickResultSum === 0) {
            console.log("Anubis got 0 points. Turn skipped.");
            this.scene.infoText.setText("Anubis got 0 points!\nTurn is skipped.");
            this.scene.time.addEvent({
            delay: this.scene.pauseTime,
            callback: () => {
                this.emit('skipTurn');
            },
          });
            return; 
        }

        this.scene.infoText.setText(`Anubis got ${StickResultSum} points!`);

        this.scene.time.addEvent({
            delay: this.scene.pauseTime,
            callback: () => {
                // Create a shuffled copy of the enemy pieces array to randomize the selection.
              const shuffledPieces = Phaser.Utils.Array.Shuffle([...this.enemyPieces]);

              // Iterate through the shuffled pieces to find a valid move.
              for (const piece of shuffledPieces) {
                  // Ignoring the pieces that have been destroyed (pieces that already reached the end).
                  if (!piece.active) continue;

                const { row, col } = this.getNextBoardPosition(piece, StickResultSum);
                
                // TryMovePiece returns true if the move was successful.
                if (this.TryMovePiece(piece, { row, col })) {
                    return; // A valid move was found.
                }
              }

              // If the loop completes, no valid moves were found.
              console.log("Anubis has no valid moves.");
              this.scene.infoText.setText(`Anubis got ${throwResult} points\nbut has no valid moves!`);
              this.scene.time.addEvent({
                  delay: this.scene.pauseTime,
                  callback: () => {
                      this.emit('skipTurn');
                  },
              });
            },
          });

        

    }



  checkLandedAllSpecialPositions() {
    for (let position of this.specialBoxes) {
      if (position.row != 0 && !this.positions[position.row][position.col].playerlandedHere) { // position.row != 0 to skip the first special box that the player cannot reach (is the enemy lane)
        return false;
        console.log("Not all special positions have been landed on yet by the player.");
      }
    }
    return true;
  }

  

}