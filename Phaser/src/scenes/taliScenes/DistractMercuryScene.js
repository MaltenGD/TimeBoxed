import { BaseScene } from '../BaseScene.js';
import DialogueController from '../../DialogueController.js';
import TransitionController, { RGBColor } from '../../misc/transitioncontroller.js';
import RandomNumber from '../../misc/randomnumber.js';

/**
 * @class DistractMercuryScene
 * The scene which appears on top of the Tali Game scene.
 * In this scene, the player has the ability to influence the game by distracting drunk Mercury.
 */
export class DistractMercuryScene extends BaseScene {
    constructor() {
        super('DistractMercuryScene');
    }

    async create(data) {
        // Takes data that was passed to scene.
        this.playerData = data.playerData;
        this.mercuryRoll = data.mercuryRoll;

        await document.fonts.load('64px TaliOne');

        // Sets the class variables width and height.
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        this.diceImages = [0, 0, 0, 0];
        this.dice = [0, 0, 0, 0];

        // Creates transitin controller and fades in.
        this.transitionController = new TransitionController(this);
        
        // Keeps track of which round we are in.
        this.possibleDialogues = data.possibleDialogues;

        // The text for both options in all three rounds.
        this.optionText = [
            {one: {text: "Offer him the drink", correct: true}, two: {text: "Keep your drink close", correct: false}},
            {one: {text: "'Don't get distracted.'", correct: false}, two: {text: "'Look, a coin on the ground!'", correct: true}},
            {one: {text: "Shake your head", correct: false}, two: {text: "Call for another round", correct: true}},
            {one: {text: "Roll right now!", correct: false}, two: {text: "Take it even slower...", correct: true}},
            {one: {text: "'Right behind you!'", correct: true}, two: {text: "'Nope.'", correct: false}}
        ];

        console.log(this.possibleDialogues);
        this.dialogueIndex = RandomNumber.get(0, this.possibleDialogues.length);
        var index = this.possibleDialogues.indexOf(this.dialogueIndex);
        console.log(this.dialogueIndex);
        this.possibleDialogues.splice(index, 1);
        console.log(this.possibleDialogues);

        this.addImages();
        this.addText();
        this.addButtons();
        this.createAndBeginDialogue();
        this.addListeners();
    }

    /**
     * Adds all necessary images to the scene.
     */
    addImages() {
        this.background = this.add.rectangle(0, 0, this.width, this.height, '0x000000', 0.5).setDisplaySize(this.width, this.height).setScale(2);
    }

    addText() {
        this.infoText = this.add.text(this.width/2, this.height/4, "", {fontSize: 64, fontFamily: 'TaliOne'}).setOrigin(0.5);
    }

    /**
     * Creates and begins the first dialogue block.
     */
    createAndBeginDialogue() {
        const dialogueData = this.cache.json.get('TaliDialogue');
        this.dialogueController = new DialogueController(this, "DM" + this.dialogueIndex, dialogueData);
        this.dialogueController.iniDialogue();
    }

    /**
     * Creates the necessary buttons for the scene.
    */
    addButtons() {
        this.optionOne = this.createButton(this.width / 2, this.height / 3, this.optionText[this.dialogueIndex].one.text, () => {
            this.checkOption(this.optionText[this.dialogueIndex].one);
        });
        this.optionTwo = this.createButton(this.width / 2, this.height / 2, this.optionText[this.dialogueIndex].two.text, () => {
            this.checkOption(this.optionText[this.dialogueIndex].two);
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
    createButton(x, y, label, onClick = () => {}, style = {fill: '#fff', fontSize: 100, fontFamily: 'TaliOne'}, pointeroverStyle = {fill: 'rgba(116, 8, 9, 1)'}) {
        const btnImg = this.add.image(0, 0, 'taliButton');
        const btn = this.add.text(0, 0, label, {
            fontSize: style.fontSize,
            fill: style.fill,
            fontFamily: style.fontFamily
        })
        .setOrigin(0.5)

        const button = this.add.container(x, y, [ btnImg, btn ])
        button.setSize(btnImg.width, btnImg.height)
        button.setInteractive()
        .setScale(0.5)
        .on('pointerover', () => this.tweens.add({ targets: button, scale: 0.6, duration: 100, ease: 'Power1' }))
        .on('pointerout', () => this.tweens.add({ targets: button, scale: 0.5, duration: 100, ease: 'Power1' }))
        .on('pointerdown', onClick);

        return button;
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
        this.hideOptions();
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
            this.diceImages[i].once('pointerdown', () => {this.onDiceClicked(i);
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
        this.scene.resume('TaliScene', {playerData: this.playerData, mercuryResultRoll: this.mercuryRoll, possibleDialogues: this.possibleDialogues});
    }


    /**
     * Adds all the listeners in this scene.
     */
    addListeners() {
        this.events.on('nextDialog', () => {
            this.dialogueController.handleInteraction();
        })

        this.events.once('Finished', ()=> {
            this.showOptions();
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