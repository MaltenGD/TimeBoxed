import Player from './player.js';
import Enemy from './enemy.js';
import RandomNumber from '../randomnumber.js';

/**
 * @class Tali
 * Controls the Tali game.
 */
export default class Tali {
    player;
    enemy;
    dice;
    // diceNumbers = [1, 3, 4, 6];
    static NUMBER_OF_DICE = 4;
 
    /**
     * @constructor Creates new player and enemy objects.
     */
    constructor() {
        this.player = new Player();
        this.enemy = new Enemy();
    }

    /**
     * Starts the new game.
     */
    startGame() {
        
    }

    /**
     * Ends the game.
     */
    stopGame() {

    }

    /**
     * Rolls the dice.
     * @returns An array containing four indexes, each corresponding to the respective dice image/value.
     */
    rollDice() {    
        let arr = [];
        for (let i = 0; i < Tali.NUMBER_OF_DICE; i++) {
            arr.push(RandomNumber.get(0, Tali.NUMBER_OF_DICE));
        }
        return arr;
    }

    /**
     * All the enemy's actions.
     */
    enemyTurn() {

    }
}