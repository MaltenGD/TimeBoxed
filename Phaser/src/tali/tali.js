import Player from './player.js';
import Enemy from './enemy.js';
import RandomNumber from '../randomnumber.js';

/**
 * @class Tali
 * Controls the Tali game.
 */
export default class Tali {
    static NUMBER_OF_DICE = 4;

    player;
    enemy;
    dice;

    playerScore;
    enemyScore;

    emitter;

    /**
     * @constructor Creates new player and enemy objects.
     */
    constructor() {
        this.player = new Player();
        this.enemy = new Enemy();
        this.emitter = new Phaser.Events.EventEmitter();
    }

    /**
     * @returns The player's current score.
     */
    get playerScore() {
        return this.player.score;
    }

    /**
     * @returns The enemy's current score.
     */
    get enemyScore() {
        return this.enemy.score;
    }

    get emitter() {
        return this.emitter;
    }

    /**
     * Starts the new game.
     */
    startGame() {
        this.player.resetScore();
        this.enemy.resetScore();
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
        this.emitter.emit('diceRolled', arr);
    }

    /**
     * All the enemy's actions.
     */
    enemyTurn() {

    }
}