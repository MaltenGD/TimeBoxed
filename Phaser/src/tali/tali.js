import TaliPlayer from './taliplayer.js';
import RandomNumber from '../randomnumber.js';

/**
 * The states of the game.
 */
export const GAME_STATE = {
    PLAYER_TURN: 'PLAYER_TURN',
    ENEMY_TURN: 'ENEMY_TURN',
    PLAYER_VICTORY: 'PLAYER_VICTORY',
    ENEMY_VICTORY: 'ENEMY_VICTORY'
};

/**
 * @class Tali
 * Controls the Tali game.
 */
export default class Tali {
    static NUMBER_OF_DICE = 4;
    static TURNS = 3;

    diceNrs = [1, 3, 4, 6]
    diceImages = [0, 0, 0, 0];

    playerScore = 0;
    enemyScore = 0;

    playerFirst = true;

    emitter;

    /**
     * @constructor Creates new player and enemy objects.
     * @param {Phaser.Scene} scene The current scene.
     * @param {number} canvasWidth The canvas's width.
     * @param {number} canvasHeight The canvas's height.  
     * @param {boolean} playerFirst Determines if the player begins first. 
     */
    constructor(scene, canvasWidth, canvasHeight, playerFirst = true) {
        this.scene = scene;
        this.scene.add.existing(this);
        this.width = canvasWidth;
        this.height = canvasHeight;

        this.emitter = new Phaser.Events.EventEmitter();
        
        this.playerFirst = playerFirst;
        this.state = playerFirst ? GAME_STATE.PLAYER_TURN : GAME_STATE.ENEMY_TURN;

        this.player = new TaliPlayer();
        this.enemy = new TaliPlayer();
        
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
    }

    playerRoll() {
        this.rollDice();
        // this.emitter.once('diceOut', () => {
        //     this.scene.time.addEvent({
        //         delay: 1000,
        //         callback: () => { },
        //         loop: false
        //     })
        // })
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
        this.setDiceImages(arr);
        this.emitter.once('diceOut', () => this.identifyRoll(arr));
        return arr;
    }

    /**
     * Positions the dice images.
     * @param {} roll The current roll to position. 
     */
    setDiceImages(roll) {
        for (let i = 0, j = -this.width/12; i < Tali.NUMBER_OF_DICE; i++, j+=this.width/12) { 
            this.diceImages[i] = this.scene.add.image(this.width/2 - j, this.height/2, 'dice' + roll[i]).setOrigin(0, 0.5).setScale(0.3).setAlpha(0);
        }
        this.animateDice();
    }

    /**
     * Animates the dice appearing and disappearing.
     */
    animateDice() {
        this.diceImages.forEach((img) => {
            this.animateDiceIn(img);
        })
    }

    /**
     * Animates the appearance of the dice.
     */
    animateDiceIn(img) {
        this.scene.tweens.add({
            targets: img,
            alpha: 1,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.emitter.emit('diceIn');
                this.scene.time.addEvent({
                    delay: 2000, 
                    callback: () => { this.animateDiceOut(img);},
                    loop: false
                });
            }
        })
    }

    /**
     * Animates the disappearance of the dice. 
     */
    animateDiceOut(img) {
        this.scene.tweens.add({
            targets: img,
            alpha: 0,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => this.emitter.emit('diceOut')
        })
    }

    identifyRoll() {
        
    }

    

    // ====================================================================
    // USED ONLY IN BEGIN SCENE
    // ====================================================================
    /**
     * The player's roll.
     * @returns The sum of the numbers on the dice.
     */
    playerTurn() {
        let score = this.#generalTurn();
        return score;
    }

    /**
     * The enemy's roll.
     * @returns The sum of the numbers on the dice.
     */
    enemyTurn() {
        let score = this.#generalTurn();
        return score;
    }

    /**
     * Rolls and calculates the sum.
     * @returns The sum of the numbers on the dice for the currrent roll.
     */
    #generalTurn() {
        let roll = this.rollDice();
        let sum = 0;
        roll.forEach(element => {
            sum+=this.diceNrs[element];
            console.log(sum);
        });
        return sum;
    }
}