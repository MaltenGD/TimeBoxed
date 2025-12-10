import TransitionController, {RGBColor} from '../../misc/transitioncontroller.js';
import DialogueController from '../../DialogueController.js';
import { OptionMenuScene } from '../OptionMenuScene.js';
import { BaseScene } from '../BaseScene.js';
import { SkipButton } from '../../SkipButton.js';

/**
 * @class TaliEndScene
 * The scene for the end of the Tali game.
 */
export class TaliEndScene extends BaseScene {
    constructor() {
        super('TaliEndScene');
        this.dialogueController;
    }

    async create(data) {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        this.playerData = data.playerData;
        this.distractCounter = data.distractCounter;
        console.log(this.playerData);
        this.playerWon = this.playerData.TaliCompleted;

        await document.fonts.load('64px TaliOne'); 

        this.setBackgroundMusic('taliIntroMusic');

        this.achManager = this.registry.get('AchievementManager');
        if (this.playerWon) {
            this.achManager.awardAchievement('TA1');
            console.log("TA1 awarded!");
            this.achManager.checkGameCompletion(this.playerData);
            if (this.distractCounter >= 3) {
                this.achManager.awardAchievement('TA2');
                console.log("TA2 awarded!");
            }
        }
        this.registry.set('AchievementManager', this.achManager);
        
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();
        
        this.createUI();
        this.setDialogue();

        /**Skip button */
        this.skipBtn = new SkipButton(this, this.width - 130, 50, this.dialogueController, this.playerData);
    }

    /**
     * Creates the UI.
     */
    createUI() {
        this.addImages();
        this.createButtons();
        this.addText();
    }


    setDialogue() {
        let taliDialogue = this.cache.json.get('TaliDialogue'), taliDialogueGroup;
        if (this.playerWon) {
            taliDialogueGroup = "TaliWin";
        }
        else {
            taliDialogueGroup = "TaliLose";
        }
        this.dialogueController = new DialogueController(this, taliDialogueGroup, taliDialogue);

        this.events.on('changeTutoImage',(imageKey)=> {
            this.changeTutoImage(imageKey);
        });

        this.events.on('CharacterTalking', (characterObj) => {
            this.displayCharacterSprite(characterObj);
        })

        this.dialogueController.iniDialogue();
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {
            this.transitionController.startFadeOutTransition(()=> {
                if (this.playerData.TimeboxedMode && !this.playerWon) this.scene.start('TimeBoxedDefeat', this.playerData);
                else this.scene.start('SelectionMenuScene', this.playerData);
            }, 400);
        });
    }

    displayCharacterSprite(characterObj) {
        if (this.currentCharacter || characterObj == "none") { // if another character was talking or set to none, delete sprite
            this.currentCharacter.destroy();
            if (this.currentEmoticon)
                this.currentEmoticon.destroy();
        }

        this.currentCharacter = this.add.sprite(characterObj.x, this.height, characterObj.ImageKey, characterObj.frame)
        .setScale(characterObj.scaleX, characterObj.scaleY).setOrigin(0, 1).setDepth(-2);

        if (characterObj.emoticon && characterObj.emoticon != "none") {
            let xOffset = 0;
            if (characterObj.emoticonX) {
                xOffset = characterObj.emoticonX;
            }
            this.currentEmoticon = this.add.sprite(characterObj.x - 20 + xOffset, this.height/2 + characterObj.emoticonY, "emotes", characterObj.emoticon)
            .setScale(characterObj.scaleX, characterObj.scaleY).setOrigin(0, 1).setDepth(-1);
            console.log(characterObj.emoticon);
        }
        else if (characterObj.emoticon == "none" || this.currentEmoticon) {
            this.currentEmoticon.destroy();
        }
    }

    /**
     * Adds all the images to the scene.
     */
    addImages() {
        this.background = this.add.image(this.width / 2, this.height / 2, 'taliBackgroundPlaceholder').setDisplaySize(this.width, this.height).setDepth(-3);
        this.boardImg = this.add.image(this.width/2, this.height/2, 'taliBoard').setOrigin(0.5).setScale(0.44).setDepth(-2);
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        /**Back button */
       this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff', fontFamily: "TaliOne"})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });
        
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
     * Adds all the text to the scene.
     */
    addText() {
        this.victoryText = this.add.text(this.width/2, this.height/2, this.playerWon ? 'You won!' : 'You lost!', { fontSize: 150, fill: '#fff', fontFamily: 'TaliOne'}).setOrigin(0.5);
    }
}