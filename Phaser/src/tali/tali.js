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
    throwImages = [0, 0, 0, 0, 0];

    currentRoll;
    diceThrows;
    diceThrowIndex = 0;
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

        this.diceThrows = [];

        this.addImages();
        
        this.emitter.on('throwsDone', () => this.emitter.emit('turnEnded'));
    }

    addImages() {
        this.throwImages[0] = this.scene.add.image(this.width/5, this.height/2, 'VENUS').setOrigin(0.5).setAlpha(0);
        this.throwImages[1] = this.scene.add.image(2*this.width/5, this.height/2, 'MARTE').setOrigin(0.5).setAlpha(0);
        this.throwImages[2] = this.scene.add.image(3*this.width/5, this.height/2, 'JUPITER').setOrigin(0.5).setAlpha(0);
        this.throwImages[3] = this.scene.add.image(4*this.width/5, this.height/2, 'NEPTUNO').setOrigin(0.5).setAlpha(0);
        this.throwImages[4] = this.scene.add.image(5*this.width/5, this.height/2, 'LUNA').setOrigin(0.5).setAlpha(0);
    }
    /**
     * @returns The player's current score.
     */
    get playerScore() {
        return this.player.score.score;
    }

    /**
     * @returns The enemy's current score.
     */
    get enemyScore() {
        return this.enemy.score.score;
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
        this.player.printThrows();
    }

    enemyRoll() {
        this.rollDice();
        this.identifyRoll(this.enemy);
        this.enemy.printThrows();
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
        this.diceThrowIndex = 0;
        this.checkAddVenusRoll();
        this.checkAddMarteRoll();
        this.checkAddJupiterRoll();
        this.checkAddNeptunoRoll();
        this.checkLunaRoll();
        this.diceThrows.forEach(element => {
            console.log(element);
        });
        taliPlayer.addThrows(this.diceThrows);

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
            console.log('venus');
        }
    }

    /**
     * Check if there's at least one 6.
     * Adds throw to array if true.
     */
    checkAddMarteRoll() {
        if (this.counter[3] > 0) {
            this.diceThrows.push(TALI_THROWS.MARTE);
            console.log('marte');
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
            i++;
        }
        if (jupiter) {
            this.diceThrows.push(TALI_THROWS.JUPITER);
            console.log('jupiter');
        }
    }

    /**
     * Check if all the dice are number 1.
     * Adds throw to array if true.
     */
    checkAddNeptunoRoll() {
        if (this.counter[0] == 4) {
            this.diceThrows.push(TALI_THROWS.NEPTUNO);
            console.log('neptuno');
        }
    }

    checkLunaRoll() {
        if (this.counter[1] >= 3) {
            this.diceThrows.push(TALI_THROWS.LUNA);
            this.emitter.emit('luna');
            console.log('luna');
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
        this.emitter.once('diceOut', () => {
            if (this.diceThrows.length !== 0) {
                this.animateThrows();
            }
            else {
                this.emitter.emit('turnEnded');
            }
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
            onComplete: () => { 
                this.emitter.emit('diceOut');
            }
        })
    }

    animateThrows() {
        if (this.diceThrows !== 0) {
            this.diceThrows.forEach(element => {
                this.animateThrowIn(this.throwImages.find(img=> img.texture.key === element.name));
            });
        }
        else {
            this.emitter.emit('throwsEnded');
        }
    }

    animateThrowIn(img) {
        this.scene.tweens.add({
            targets: img,
            alpha: 1,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.emitter.emit('throwIn');
                this.scene.time.addEvent({
                    delay: 2000, 
                    callback: () => { this.animateThrowOut(img);},
                    loop: false
                });
            }
        })
    }

    animateThrowOut(img) {
        this.scene.tweens.add({
            targets: img,
            alpha: 0,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => { 
                this.emitter.emit('throwOut');
                this.diceThrowIndex++;
                if (this.diceThrows.length === this.diceThrowIndex) {
                    this.emitter.emit('throwsDone');
                }
            }
        })
    }

    playerWon() {
        return this.player.score.score >= this.enemy.score.score;
    }

    // ====================================================================
    // USED ONLY IN BEGIN SCENE
    // ====================================================================
    
    firstRoll() {
        this.currentRoll = [];
        this.currentRoll.push(RandomNumber.get(0, Tali.NUMBER_OF_DICE));
        this.firstDiceImages();
        return this.currentRoll[0];
    }

    firstDiceImages() {
        this.diceImages = [];
        this.diceImages.push(this.scene.add.image(this.width/2, this.height/2, 'dice' + this.currentRoll[0]).setOrigin(0.5).setScale(0.3).setAlpha(0));
        this.animateDice();
    }

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
        let res = this.diceNrs[this.firstRoll()];
        return res;
    }
}