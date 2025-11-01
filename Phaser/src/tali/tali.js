import TaliPlayer, { TALI_THROWS } from './taliplayer.js';
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

    currentRoll;
    diceThrows;
    counter;

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
        this.identifyRoll(this.player);
    }

    enemyRoll() {
        this.rollDice();
        this.identifyRoll(this.enemy);
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
        this.currentRoll = arr;
        this.setDiceImages();
        return arr;
    }

    identifyRoll(taliPlayer) {
        this.counter = [0, 0, 0, 0];
        this.currentRoll.forEach(element => {
            this.counter[element]++;
            console.log('element: ' + element + ' counter: ' + this.counter[element]);
        })
        
        this.diceThrows = [];
        this.checkAddVenusRoll();
        this.checkAddMarteRoll();
        this.checkAddJupiterRoll();
        this.checkAddNeptunoRoll();
        this.checkLunaRoll();
        

        this.emitter.emit('turnEnded');
    }

    /**
     * Check if all the dice results are different from each other.
     * Adds throw to array if true.
     */
    checkAddVenusRoll() {
        let venus = true;
        let i = 0;
        while (i < Tali.NUMBER_OF_DICE && venus) {
            if (this.counter[i] != 1) {
                venus = false;
            }
            i++;
        }
        if (venus) {
            this.diceThrows.push(TALI_THROWS.VENUS);
        }
    }

    /**
     * Check if there's at least one 6.
     * Adds throw to array if true.
     */
    checkAddMarteRoll() {
        if (this.counter[3] > 0) {
            this.diceThrows.push(TALI_THROWS.MARTE);
        }
    }      

    /**
     * Check if all the dice have the same result.
     * Adds throw to array if true.
     */
    checkAddJupiterRoll() {
        let jupiter = false;
        let i = 0;
        while (i < Tali.NUMBER_OF_DICE && !jupiter) {
            if (this.counter[i] == Tali.NUMBER_OF_DICE) {
                jupiter = true;
            }
        }
        if (jupiter) {
            this.diceThrows.push(TALI_THROWS.JUPITER);
        }
    }

    /**
     * Check if all the dice are number 1.
     * Adds throw to array if true.
     */
    checkAddNeptunoRoll() {
        if (this.counter[0] == 4) {
            this.diceThrows.push(TALI_THROWS.NEPTUNO);
        }
    }

    checkLunaRoll() {
        if (this.counter[1] >= 3) {
            this.diceThrows.push(TALI_THROWS.LUNA);
            this.emitter.emit('luna');
        }
    }

    /**
     * Positions the dice images according to the current roll.
     */
    setDiceImages() {
        for (let i = 0, j = -this.width/12; i < Tali.NUMBER_OF_DICE; i++, j+=this.width/12) { 
            this.diceImages[i] = this.scene.add.image(this.width/2 - j, this.height/2, 'dice' + this.currentRoll[i]).setOrigin(0, 0.5).setScale(0.3).setAlpha(0);
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