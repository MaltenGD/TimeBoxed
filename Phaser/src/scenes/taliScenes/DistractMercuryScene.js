import { BaseScene } from '../BaseScene.js';
import DialogueController from '../../DialogueController.js';
import TransitionController, { RGBColor } from '../../misc/transitioncontroller.js';

/**
 * @class DistractMercuryScene
 * The scene which appears on top of the Tali Game scene.
 * In this scene, the player has the ability to influence the game by distracting drunk Mercury.
 */
export class DistractMercuryScene extends BaseScene {
    constructor() {
        super('DistractMercuryScene');
    }

    create(data) {
        // Takes data that was passed to scene.
        this.playerData = data.playerData;
        this.mercuryRoll = data.mercuryRoll;

        // Sets the class variables width and height.
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        this.diceImages = [0, 0, 0, 0];
        this.dice = [0, 0, 0, 0];

        // Creates transitin controller and fades in.
        this.transitionController = new TransitionController(this);
        
        // Keeps track of which round we are in.
        this.roundIndex = data.roundIndex;

        // The text for both options in all three rounds.
        this.optionText = [
            {one: {text: "Option 1", correct: true}, two: {text: "Option 2", correct: false}},
            {one: {text: "Option 1 2", correct: false}, two: {text: "Option 2 2", correct: true}},
            {one: {text: "Option 1 3", correct: true}, two: {text: "Option 2 3", correct: true}}
        ];

        this.addImages();
        this.addText();
        this.addButtons();
        this.createAndBeginDialogue();
        this.addListeners();

        console.log("TURN " + this.roundIndex);
    }

    /**
     * Adds all necessary images to the scene.
     */
    addImages() {
        this.background = this.add.rectangle(0, 0, this.width, this.height, '0x000000', 0.5).setDisplaySize(this.width, this.height).setScale(2);
    }

    addText() {
        this.infoText = this.add.text(this.width/2, this.height/4, "", {fontSize: 64}).setOrigin(0.5);
    }

    /**
     * Creates and begins the first dialogue block.
     */
    createAndBeginDialogue() {
        const dialogueData = this.cache.json.get('TaliDialogue');
        this.dialogueController = new DialogueController(this, "DM" + this.roundIndex, dialogueData);
        this.dialogueController.iniDialogue();
    }

    /**
     * Creates the necessary buttons for the scene.
    */
    addButtons() {
        this.optionOne = this.createButton(this.width / 2, this.height / 3, this.optionText[this.roundIndex].one.text, () => {
            this.checkOption(this.optionText[this.roundIndex].one);
        });
        this.optionTwo = this.createButton(this.width / 2, this.height / 2, this.optionText[this.roundIndex].two.text, () => {
            this.checkOption(this.optionText[this.roundIndex].two);
        });

        this.hideOptions();
    }

    /**
     * Creates a button with the given specifications.
     * @param {number} x X position
     * @param {number} y Y position
     * @param {string} label The text inside the button
     * @param {() => void} [onClick=() => {}] The event run on click
     * @param {*} style The style (fontSize, fill...)
     * @param {*} pointeroverStyle Style when hovering over the button
     * @returns 
     */
    createButton(x, y, label, onClick = () => {}, style = {backgroundColor: '#fff', fill: '#000', fontSize: 80}, pointeroverStyle = {fill: 'rgba(116, 8, 9, 1)'}) {
        const btn = this.add.text(x, y, label, {
            fontSize: style.fontSize,
            fill: style.fill,
            backgroundColor: style.backgroundColor
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => btn.setStyle({ fill: pointeroverStyle.fill }))
        .on('pointerout', () => btn.setStyle({ fill: style.fill }))
        .on('pointerdown', onClick);

        return btn;
    }

    /**
     * Hides the dialogue options.
     */
    hideOptions() {
        this.setObjectState(this.optionOne, false);
        this.setObjectState(this.optionTwo, false);
    }

    /**
     * Shows the dialogue options.
     */
    showOptions() {
        this.setObjectState(this.optionOne, true);
        this.setObjectState(this.optionTwo, true);
    }

    /**
     * Checks if the button pressed is the correct answer or not
     * @param {button} option Dialogue option pressed 
     */
    checkOption(option) {
        console.log("Current round: " + this.roundIndex);
        this.hideOptions();
        this.roundIndex += 1;
        if (option.correct) this.onCorrectOption();
        else this.onIncorrectOption();
    }

    /**
     * Handles event where correct answer is picked.
     */
    onCorrectOption() {
        console.log("Correct option picked.");
        this.showMercuryDice();
        
    }

    /**
     * Displas Mercury's roll.
     */
    showMercuryDice() {
        this.infoText.setText("Choose one of Mercury's dice to change: ");
        console.log("Showing Mercury's dice.");
        // Arranges the dice on the screen. 
        // mercuryRoll contains the indexes of the dice images (0 - 1, 1 - 3, 2 - 4, 3 - 6).
        for (let i = 0, j = -2*this.width/12; i < 4; i++, j+=this.width/12) { 
            this.diceImages[i] = this.add.image(this.width/2 + j, this.height/2, 'dice' + this.mercuryRoll[i]).setOrigin(0, 0.5).setScale(0.3).setAlpha(1).setInteractive();
            this.diceImages[i].on('pointerdown', () => {this.onDiceClicked(i);
            });
        }
    }

    /**
     * Handles dice click.
     * @param {number} diceIndex the dice from Mercury's rolls picked to be changed. 
     */
    onDiceClicked(diceIndex) {
        this.diceImages.forEach(element => {
            element.off('pointerdown');
            
        });
        console.log("Clicked dice " + diceIndex + ".");
        this.showDiceOptions(diceIndex);
    }

    /**
     * 
     * @param {number} diceIndex shows the dice you can change to.
     */
    showDiceOptions(diceIndex) {
        for (let i = 0, j = -2*this.width/12; i < 4; i++, j+=this.width/12) {
            this.dice[i] = this.add.image(this.width/2 + j, this.height/3, 'dice' + i).setOrigin(0, 0.5).setScale(0.3).setAlpha(1).setInteractive()
            .on('pointerdown', ()=>this.changeDice(diceIndex, i));
        }
    }

    /**
     * 
     * @param {number} diceToChange the index of the die from Mercury's rolls to change. 
     * @param {number} changeToIndex the index of the die to which the diceToChange will be set.
     */
    changeDice(diceToChange, changeToIndex) {
        this.mercuryRoll[diceToChange] = changeToIndex;
        console.log("Changing dice in index " + diceToChange + " to index " + changeToIndex + ".");
        this.returnToGame();
    }

    /**
     * Handles event where incorrect option is picked.
     * Returns to game with no changes.
     */
    onIncorrectOption() {
        console.log("Incorrect option picked.");
        this.returnToGame();
    }

    /**
     * Sleeps the current scene and resumes the game scene.
     * Passes to the game scene the new roll set.
     */
    returnToGame() {
        this.addListeners();
        this.scene.sleep(); 
        this.scene.resume('TaliScene', {playerData: this.playerData, mercuryResultRoll: this.mercuryRoll});
    }


    /**
     * Adds all the listeners in this scene.
     */
    addListeners() {
        this.events.once('nextDialog', () => {
            this.showOptions();
        })

        this.events.on('Finished', ()=> {
            // TODO
        })
    }

    /**
     * Changes visibility and state of an object.
     * @param object The object to change the state of.
     * @param {boolean} state The state.
     */
    setObjectState(object, state)
    {
        object.setVisible(state).setActive(state).setAlpha(state ? 1 : 0);
    }

}