import TaliPlayer, { TALI_THROWS } from './taliplayer.js';
import RandomNumber from '../misc/randomnumber.js';

/**
 * @readonly
 * @enum {string} The states of the game.
 */
export const GAME_STATE = {
    PLAYER_START: 'PLAYER_START',
    PLAYER_ROLLED: 'PLAYER_ROLLED',
    PLAYER_THROWN: 'PLAYER_THROWN',
    ENEMY_START: 'ENEMY_START',
    ENEMY_ROLLED: 'ENEMY_ROLLED',
    ENEMY_DISTRACT: 'ENEMY_DISTRACT',
    ENEMY_THROWN: 'ENEMY_THROWN',
    GAME_OVER: 'GAME_OVER'
};

/**
 * @class Tali
 * Controls the Tali game.
 */
export default class Tali {
    static NUMBER_OF_DICE = 4;
    static TURNS = 6;
    static DICE_THROW_NAMES = ['VENUS', 'MARTE', 'JUPITER', 'NEPTUNO', 'LUNA'];


    /**
     * @constructor Creates new player and enemy objects.
     * @param {Phaser.Scene} scene The current scene.
     * @param {number} canvasWidth The canvas's width.
     * @param {number} canvasHeight The canvas's height.  
     * @param {boolean} playerFirst Determines if the player begins first. 
     */
    constructor(scene, canvasWidth, canvasHeight, playerFirst) {
        this.scene = scene;
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.emitter = new Phaser.Events.EventEmitter();

        this.turnCount = 0;
        this.playerFirst = playerFirst;

        this.player = new TaliPlayer();
        this.enemy = new TaliPlayer();
        this.state = GAME_STATE.PLAYER_TURN;

        this.diceThrows = [];
        this.diceImages = [];
        this.throwImages = [];

        this.currentRoll = [];
        this.diceNrs = [1, 3, 4, 6]

        this.diceRollIndex = 0;
        this.diceThrowIndex = 0;
        this.counter = 0;

        this.lunaThrow = false;
         
        this.addImages();

        this.noComboText = this.scene.add.text(this.width/2, this.height/2, 'No combinations!', {fontSize: 80}).setOrigin(0.5).setAlpha(0);
        this.noComboText.depth = 1;
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

    /**
     * Adds all the images.
     */
    addImages() {
        for (let i = 0, j = 1; i < Tali.DICE_THROW_NAMES.length; i++, j++) {
            this.throwImages[i] = this.scene.add.image(j*this.width/5, this.height/2, Tali.DICE_THROW_NAMES[i]).setOrigin(0.5).setAlpha(0).setScale(0.9);
            this.throwImages[i].depth = 1;
        }
    }
    

    /**
     * Starts the new game.
     */
    startGame() {
        this.state = this.playerFirst ? GAME_STATE.PLAYER_START : GAME_STATE.ENEMY_START;
        this.nextTurn();
    }

    nextTurn() {
        if (this.turnCount > Tali.TURNS) {
            this.state = GAME_STATE.GAME_OVER;
            this.emitState();
        }
        else {
            switch(this.state) {
                case GAME_STATE.PLAYER_START:
                    this.hideThrows();
                    this.turnCount++;
                    this.emitState();
                    this.state = GAME_STATE.PLAYER_ROLLED;
                    break; 
                case GAME_STATE.PLAYER_ROLLED:
                    this.generalRoll(this.player);
                    this.emitter.once('diceIn', () => {
                        this.emitState();
                        this.state = GAME_STATE.PLAYER_THROWN;
                    });
                    break;
                case GAME_STATE.PLAYER_THROWN:
                    this.hideDice();
                    this.identifyRoll(this.player);
                    this.animateThrows();
                    this.emitter.once('throwsIn', () => {
                        this.emitState();
                        if (this.lunaThrow) {
                            this.state = GAME_STATE.PLAYER_START;
                            this.lunaThrow = false;
                        }
                        else {
                            this.state = GAME_STATE.ENEMY_START;
                        }
                    })
                    break;
                case GAME_STATE.ENEMY_START:
                    this.hideThrows();
                    this.turnCount++;
                    this.emitState();
                    this.state = GAME_STATE.ENEMY_ROLLED;
                    break;
                case GAME_STATE.ENEMY_ROLLED:
                    this.generalRoll(this.enemy);
                    this.emitter.once('diceIn', () => {
                        this.emitState();
                        this.state = GAME_STATE.ENEMY_DISTRACT;
                    })
                    break;
                case GAME_STATE.ENEMY_DISTRACT:
                    this.emitState();
                    this.state = GAME_STATE.ENEMY_THROWN;
                    this.hideDice();
                    break;
                case GAME_STATE.ENEMY_THROWN:
                    this.hideDice();
                    this.identifyRoll(this.enemy);
                    this.animateThrows();
                    this.emitter.once('throwsIn', () => {
                        this.emitState();
                        if (this.lunaThrow) {
                            this.state = GAME_STATE.ENEMY_START;
                            this.lunaThrow = false;
                        }
                        else {
                            this.state = GAME_STATE.PLAYER_START;
                        }
                    })
                    break;
            }
        }
    }

    /**
     * Emits the current state.
     */
    emitState() {
        this.emitter.emit('stateChange', this.state);
    }


    generalRoll(player) {
        this.rollDice();

        this.setDiceImages();
        
        // this.identifyRoll(player);
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
        return arr;
    }

    /**
     * Identifies which rolls have been thrown.
     * @param {TaliPlayer} taliPlayer 
     */
    identifyRoll(taliPlayer) {
        this.counter = [0, 0, 0, 0];
        this.currentRoll.forEach(element => {
            this.counter[element]++;
            console.log('element: ' + element + ' counter: ' + this.counter[element]);
        })
        
        this.diceThrows = [];
        this.diceThrowIndex = 0;

        this.checkAddAllRolls();
        
        this.diceThrows.forEach(element => {
            console.log(element);
        });
        
        taliPlayer.addThrows(this.diceThrows);

    }

    /**
     * Checks if the player has rolled any combination and which one.
     */
    checkAddAllRolls() {
        this.checkAddVenusRoll();
        this.checkAddMarteRoll();
        this.checkAddJupiterRoll();
        this.checkAddNeptunoRoll();
        this.checkLunaRoll();
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

    /**
     * Checks if there are at least 3 dice with the number 3.
     * Adds throw to array if true and emits 'Luna'.
     */
    checkLunaRoll() {
        if (this.counter[1] >= 3) {
            this.diceThrows.push(TALI_THROWS.LUNA);
            this.lunaThrow = true;
        }
    }

    /**
     * Positions the dice images according to the current roll.
     */
    setDiceImages() {
        for (let i = 0, j = -2*this.width/12; i < Tali.NUMBER_OF_DICE; i++, j+=this.width/12) { 
            this.diceImages[i] = this.scene.add.image(this.width/2 + j, this.height/2, 'dice' + this.currentRoll[i]).setOrigin(0, 0.5).setScale(0.3).setAlpha(0);
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
            duration: 700,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.diceRollIndex++;
                if (this.diceRollIndex >= this.currentRoll.length) {
                    this.diceRollIndex = 0;
                    this.emitter.emit('diceIn');
                }
            }
        })
    }

    hideDice() {
        this.diceImages.forEach(element => {
            element.setAlpha(0);
        });
    }

    animateThrows() {
        console.log('length: ', this.diceThrows.length);
        if (this.diceThrows.length === 0) {
            this.diceThrows.push(this.noComboText);
            this.animateThrowIn(this.noComboText);
        }
        else {
            this.diceThrows.forEach(element => {
                this.animateThrowIn(this.throwImages.find(img=> img.texture.key === element.name));
            });
        }
    }

    animateThrowIn(img) {
        this.scene.tweens.add({
            targets: img,
            alpha: 1,
            duration: 800,
            ease: 'Sine.easeOut',
            onComplete: () => {
                if ((this.diceThrows.length - 1) === this.diceThrowIndex) {
                    this.emitter.emit('throwsIn');
                    this.diceThrowIndex = 0;
                }
                else {
                    this.diceThrowIndex++;
                }
            }
        }
        )
    }

    hideThrows() {
        this.throwImages.forEach(element => {
            element.setAlpha(0);
        });
        this.noComboText.setAlpha(0);
        console.log('hiding throws');
    }

    hideThrows() {
        this.diceThrows.forEach(element => {
            this.throwImages.find(img=> img.texture.key === element.name)?.setAlpha(0);
        });
        this.noComboText.setAlpha(0);
    }

    playerWon() {
        return this.player.score.score >= this.enemy.score.score;
    }

    // ====================================================================
    // USED ONLY IN BEGIN SCENE
    // ====================================================================
    
    /**
     * The first roll. Rolls only one die.
     * @returns the dice throw.
     */
    firstRoll() {
        this.currentRoll = [];
        this.currentRoll.push(RandomNumber.get(0, Tali.NUMBER_OF_DICE));
        this.firstDiceImages();
        return this.currentRoll[0];
    }

    /**
     * Sets the die image.
     */
    firstDiceImages() {
        this.diceImages = [];
        this.diceImages.push(this.scene.add.image(this.width/2, this.height/2, 'dice' + this.currentRoll[0]).setOrigin(0.5).setScale(0.3).setAlpha(0));
        this.animateDiceIn(this.diceImages[0]);
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