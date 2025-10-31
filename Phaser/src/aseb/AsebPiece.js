export const PIECE_TYPE = {
    PLAYER: 'PLAYER',
    ENEMY: 'ENEMY',
};

export default class AsebPiece extends Phaser.GameObjects.Image {

    constructor(scene, x, y, image, type) {
    
        super(scene, x, y, image);

        this.type = type; // The piece can be either a player piece or enemy piece
        
        this.SpawnPoint = { // The spawnPoint will be used to return the piece to its initial position when its killed
            x: x,
            y: y
        };
        this.board = this.scene.board;
        this.boardPos = { // The piece position relative to the board position matrix
            row:-1,
            col:-1
         // The piece is not in the board when its created
        }
        this.movable = false;

        if (this.type === PIECE_TYPE.PLAYER) {
            this.setInteractive().on('pointerdown', () => {; // The piece mo
                this.onClick();
            });
        }

        this.scene.add.existing(this);
    }

    onClick()
    {
       if (!this.movable)
        {
          console.log("this piece can not be moved (and neither the rest lmao )")  
          return;  
        } 
        console.log ("The piece is in position " + this.boardPos.row + "," + this.boardPos.col)
        let moves = this.scene.asebGame.player.actualStickResult;
       console.log("The piece wants to move +" + moves + " positions");
       let nextPos = this.scene.board.getNextBoardPosition(this, moves);
       console.log("The next board position will be: " + nextPos.row + "," + nextPos.col);
       this.scene.board.TryMovePiece(this, nextPos);
       
    }

    setBoardVariables(row, col)
    {
        this.boardPos.row = row;
        this.boardPos.col = col;
    }
    MoveInScreen(x, y)
    {
        this.x = x;
        this.y = y;
    }
    setInteractable(state)
    {
       this.movable = state;

    }
    
    ReturnToSpawn()
    {
            this.x = this.SpawnPoint.x;
            this.y = this.SpawnPoint.y;

            this.boardPos.row = -1;
            this.boardPos.col = -1;
    }

    Ended() 
    {
        return (this.boardPos.row === 1 && this.boardPos.col === 0);  
    }
}