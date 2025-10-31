import AsebPlayer from "./AsebPlayer.js"
import AsebMachine from "./AsebMachine.js"
import AsebPiece, { PIECE_TYPE } from "./AsebPiece.js";
import RandomNumber from '../randomnumber.js';


export const GAME_STATE = {
        PLAYER_TURN: 'PLAYER_TURN', //Represents the player turn
        ENEMY_TURN: 'ENEMY_TURN', // Rpresents the enemy turn
        PLAYER_VICTORY: 'PLAYER_VICTORY', // If the plager wins (all the player pieces goes into the end)
        ENEMY_VICTORY: 'ENEMY_VICTORY', // If the plager loses (all the enemy pieces goes into the end)
    };

/**
 * @class Aseb
 * Controls the Aseb game.
 */
export default class AsebGame {
    
    constructor(scene, playerFirst) {
        this.scene = scene;
        this.playerFirst = playerFirst;
        this.state = playerFirst ? GAME_STATE.PLAYER_TURN : GAME_STATE.ENEMY_TURN;
        this.player = new AsebPlayer();
        this.enemy = new AsebMachine();

    }


    /**
     * Simulates a throw of the Aseb sticks.
     * Each stick has a 50% chance of landing light (1) or dark (0).
     * @returns {object} An object containing:
     *   - {Array<number>} throwResult - An array of 4 numbers (0 or 1) representing the outcome of each stick.
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


    //Checks if the player or the enemy wins.
    // Changes the game state if so.
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