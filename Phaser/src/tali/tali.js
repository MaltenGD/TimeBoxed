import Player from './player.js';
import Enemy from './enemy.js';
import RandomNumber from '../randomnumber.js';

/**
 * @class Tali
 * Controls the Tali game.
 */
export default class Tali {
    static NUMBER_OF_DICE = 4;
    static TURNS = 3;

    player;
    enemy;
    dice;
    currentTurn;

    playerScore;
    enemyScore;

    playerFirst = true;

    emitter;

    /**
     * @constructor Creates new player and enemy objects.
     */
    constructor() {
        this.player = new Player();
        this.enemy = new Enemy();
        this.emitter = new Phaser.Events.EventEmitter();
        this.currentTurn = 1;
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

        this.emitter.on('enemyTurnEnd', () => {this.playerTurn(); console.log('enemyturnend');});
        this.emitter.on('playerTurnEnd', () => this.enemyTurn());

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
     * Plays the enemy's turn.
     */
    enemyTurn() {
        // TODO: check if its the last turn and who started

        this.emitter.emit('enemyTurnStart');
        this.emitter.once('diceRolled', () => this.emitter.emit('enemyTurnEnd'));
        this.rollDice();
        
    }
    
    /**
     * Plays the player's turn.
     */
    playerTurn() {
        // TODO: check if its the last turn and who started

        this.emitter.emit('playerTurnStart');
        this.playerTurn = false;
        // this.rollDice();
    }
}