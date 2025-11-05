import AsebPlayer from "./AsebPlayer.js"
import AsebMachine from "./AsebMachine.js"
import AsebPiece, { PIECE_TYPE } from "./AsebPiece.js";
import RandomNumber from '../misc/randomnumber.js';

/**
 * @readonly
 * @enum {string}
 * @description The possible states of the Aseb game.
 */
export const GAME_STATE = {
        PLAYER_TURN: 'PLAYER_TURN', //Represents the player turn
        ENEMY_TURN: 'ENEMY_TURN', // Rpresents the enemy turn
        PLAYER_VICTORY: 'PLAYER_VICTORY', // If the plager wins (all the player pieces goes into the end)
        ENEMY_VICTORY: 'ENEMY_VICTORY', // If the plager loses (all the enemy pieces goes into the end)
    };
/**
 * @class AsebGame
 * @description Manages the core logic of the Aseb game, including game state, player/enemy data, and win conditions.
 */
export default class AsebGame {
    
    /**
     * @param {Phaser.Scene} scene - The Phaser scene that this game instance belongs to.
     * @param {boolean} [playerFirst=true] - Determines if the player takes the first turn.
     */
    constructor(scene, playerFirst) {
        /** @type {Phaser.Scene} */
        this.scene = scene;
        /** @type {boolean} */
        this.playerFirst = playerFirst;
        /** @type {GAME_STATE} */
        this.state = playerFirst ? GAME_STATE.PLAYER_TURN : GAME_STATE.ENEMY_TURN;
        /** @type {AsebPlayer} */
        this.player = new AsebPlayer();
        /** @type {AsebMachine} */
        this.enemy = new AsebMachine();

    }


    /**
     * Simulates a throw of the Aseb sticks.
     * Each stick has a 50% chance of landing light (1) or dark (0).
     * @returns {object} An object containing:
     *   - {number[]} throwResult - An array of 4 numbers (0 or 1) representing the outcome of each stick.
     *   - {number} Sum - The total sum of the stick outcomes (number of light sticks).
     */

    getThrow() {
        let throwResult = [];
        let sum = 0;
        for (let i = 0; i < 4; i++) {
            const randomBit = RandomNumber.get(0, 2); // the number 2 is not included
            throwResult.push(randomBit);
            sum += randomBit;
        }
        return {throwResult: throwResult, Sum: sum};
    }


    /**
     * Checks if a player has won the game by getting all their pieces to the end. Updates the game state if a winner is found.
     */
    checkForWinner(){

         if (this.player.winningPieces === 5) {
            console.log("Player wins!");
            this.state = GAME_STATE.PLAYER_VICTORY;
        } else if (this.enemy.winningPieces === 5) {
            console.log("Enemy wins!");
            this.state = GAME_STATE.ENEMY_VICTORY;
        }

    }

    /**
     * Handles the logic when a piece reaches the end of the board.
     * @param {AsebPiece} piece The piece that reached the end.
     */
    pieceReachedEnd(piece) {
        if (piece.type === PIECE_TYPE.PLAYER) {
            this.player.winningPieces++;
            console.log(`Player scored! Player score: ${this.player.winningPieces}`);
        } else {
            this.enemy.winningPieces++;
            console.log(`Enemy scored! Enemy score: ${this.enemy.winningPieces}`);
        }
        
        this.checkForWinner();
       
    
    }



}