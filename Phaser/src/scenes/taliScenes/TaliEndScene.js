import TransitionController, {RGBColor} from '../../misc/transitioncontroller.js';
import DialogueController from '../../DialogueController.js';
import { OptionMenuScene } from '../OptionMenuScene.js';
import { BaseScene } from '../BaseScene.js';

/**
 * @class TaliEndScene
 * The scene for the end of the Tali game.
 */
export class TaliEndScene extends BaseScene {
    constructor() {
        super('TaliEndScene');
        this.dialogueController;
    }

    preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    create(playerData) {

        this.playerData = playerData;
        console.log(this.playerData);
        this.playerWon = this.playerData.TaliCompleted;

        this.achManager = this.registry.get('AchievementManager');
        if (this.playerWon) {
            this.achManager.awardAchievement('TA1');
            console.log("TA1 awarded!");
            this.achManager.checkGameCompletion(this.playerData);
        }
        this.registry.set('AchievementManager', this.achManager);
        
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();
        
        this.createUI();
        this.setDialogue();
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

    /**
     * Adds all the images to the scene.
     */
    addImages() {
        this.background = this.add.image(this.width / 2, this.height / 2, 'taliBackgroundPlaceholder').setDisplaySize(this.width, this.height);
        this.boardImg = this.add.image(this.width/2, this.height/2, 'taliBoard').setOrigin(0.5).setScale(0.45);
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        /**Back button */
       this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });

        /**Skip button */
        const skipBtn = this.add.text(this.width - 100, this.height - 1000 , 'SKIP', {
            fontSize: '30px',
            fill: '#000000',
            backgroundColor: '#f7f7f7',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerover', () => skipBtn.setStyle({ backgroundColor: '#bbbaba' }))
        .on('pointerout', () => skipBtn.setStyle({ backgroundColor: '#f7f7f7' }))
        .on('pointerdown', () => {
           this.transitionController.startFadeOutTransition(() => {
                
                 this.dialogueController.skipToEnd();
            
            }, 400);
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
        this.victoryText = this.add.text(this.width/2, this.height/5, this.playerWon ? 'You won!' : 'You lost!', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }
    
}