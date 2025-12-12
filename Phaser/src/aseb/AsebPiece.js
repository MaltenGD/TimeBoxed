/**
 * @readonly
 * @enum {string}
 * @description Defines the type of a game piece.
 */
export const PIECE_TYPE = {
    PLAYER: 'PLAYER',
    ENEMY: 'ENEMY',
};

/**
 * @class AsebPiece
 * @extends Phaser.GameObjects.Image
 * @description Represents a single game piece on the Aseb board. It handles its own state, position, and interactions.
 */
export default class AsebPiece extends Phaser.GameObjects.Image {

    /**
     * @param {Phaser.Scene} scene - The scene this piece belongs to.
     * @param {number} x - The initial horizontal position.
     * @param {number} y - The initial vertical position.
     * @param {string} image - The texture key for the piece's image.
     * @param {AsebBoard} board - The board this piece belongs to.
     * @param {PIECE_TYPE} type - The type of the piece (PLAYER or ENEMY).
     */
    constructor(scene, x, y, image, board, type) {

        super(scene, x, y, image);
        
        /** @type {PIECE_TYPE} */
        this.type = type; // The piece can be either a player piece or enemy piece

        /** @type {{x: number, y: number}} The initial screen coordinates where the piece spawns. */
        this.SpawnPoint = { // The spawnPoint will be used to return the piece to its initial position when its killed
            x: x,
            y: y
        };
        /** @type {AsebBoard} A reference to the main game board. */
        this.board = board;
        /** @type {{row: number, col: number}} The piece's position on the board grid. (-1, -1) means it's in the spawn area. */
        this.boardPos = { // The piece position relative to the board position matrix
            row: -1,
            col: -1
            // The piece is not in the board when its created
        }
        /** @type {boolean} Determines if the piece can be moved by the player. */
        this.movable = false;
        /** @type {Phaser.Tweens.Tween} The idle animation tween for the piece. */
        this.idleTween = null;

        if (this.type === PIECE_TYPE.PLAYER) {
            this.setInteractive().on('pointerdown', () => {
                this.onClick();
            });
        }

        this.scene.add.existing(this);

        this.idleTween = this.board.scene.tweens.add({
            targets: this,
            scale: 0.085,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });
        this.setIdleAnimation(false);
    }

    /**
     * Controls the idle animation of the piece.
     * @param {boolean} animate - If true, the animation plays. If false, it stops.
     */
    setIdleAnimation(animate) {
        if (!this.idleTween) return;

        if (animate) {
            this.idleTween.resume();
        } else {
            this.idleTween.pause();
            this.setScale(0.1); // Reset to base scale when stopping animation
        }
    }

    /**
     * Handles the logic when a player piece is clicked. It calculates the next position and attempts to move.
     */
    onClick() {
        if (!this.movable) {
            console.log("this piece can not be moved")
            return;
        }
        console.log("The piece is in position " + this.boardPos.row + "," + this.boardPos.col)
        let moves = this.scene.asebGame.player.actualStickResult;
        console.log("The piece wants to move +" + moves + " positions");
        let nextPos = this.scene.board.getNextBoardPosition(this, moves);
        console.log("The next board position will be: " + nextPos.row + "," + nextPos.col);
        this.scene.board.TryMovePiece(this, nextPos);

    }

    /**
     * Updates the piece's internal board grid position.
     * @param {number} row - The new row index.
     * @param {number} col - The new column index.
     */
    setBoardVariables(row, col) {
        this.boardPos.row = row;
        this.boardPos.col = col;
    }
    /**
     * Instantly moves the piece to new screen coordinates.
     * @param {number} x - The new x-coordinate.
     * @param {number} y - The new y-coordinate.
     */
    MoveInScreen(x, y, IsSpecialPosition, row, col, AnimDuration = 200) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: AnimDuration,
            ease: 'Cubic.easeInOut',
            onComplete: () => {
                this.scene.time.delayedCall(350, () => {
                    this.board.emit('pieceAnimComplete', this, IsSpecialPosition, row, col);
                });
                
            }
        });
    }
    /**
     * Sets whether the piece is movable by the player.
     * @param {boolean} state - True to make it movable, false otherwise.
     */
    setInteractable(state, moves) {

        // Se hace interactiva si se quiere y si se puede mover la pieza
        if (state) {
            this.movable = this.board.IsValidMove(this, this.board.getNextBoardPosition(this, moves)).isValid;        }
        else {
            this.movable = false;
        }

    }

    /**
     * Resets the piece to its original spawn point and removes it from the board grid.
     */
    ReturnToSpawn() {
        this.x = this.SpawnPoint.x;
        this.y = this.SpawnPoint.y;

        this.boardPos.row = -1;
        this.boardPos.col = -1;
    }

    /**
     * Checks if the piece has reached the final position on the board.
     * @returns True if the piece is at the end, false otherwise.
     */
    Ended() {
        return (this.boardPos.row === 1 && this.boardPos.col === 0);
    }
}