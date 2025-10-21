import Player from './player.js';
import Enemy from './enemy.js';
import Dice from './dice.js';

/**
 * @class Tali
 * Controls the Tali game.
 */
export default class Tali {
    player;
    enemy;
    dice;
    diceRolls = [];
    /**
     * @constructor Creates a new player, enemy, and dice object.
     */
    constructor() {
        this.player = new Player();
        this.enemy = new Enemy();
        this.dice = new Dice();
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
     */
    rollDice() {
        this.dice.rollDice();
    }

    /**
     * All the enemy's actions.
     */
    enemyTurn() {

    }
}