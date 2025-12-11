//import TransitionController from "../../misc/transitioncontroller.js";
import { BaseScene } from '../BaseScene.js';
import DialogueController from '../../DialogueController.js';

export class HanafudaEndScene extends Phaser.Scene{
    constructor() {
        super('HanafudaEndScene');
    }

    create(playerData) {
        this.playerData = playerData;
        this.playerWon = this.playerData.HanafudaCompleted;

        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        this.achManager = this.registry.get('AchievementManager');
        if (this.playerWon) {
            this.achManager.awardAchievement('HA1');
            console.log("HA1 awarded!");
            this.achManager.checkGameCompletion(this.playerData);
        }
        this.registry.set('AchievementManager', this.achManager);
        
        //this.transitionController = new TransitionController(this);
        //this.transitionController.startFadeInTransition();
        
        //Background
        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackgroundPlaceholder').setDisplaySize(this.width, this.height);

        // //Dialogue
        const dialogueKey = this.playerWon ? 'HanafudaWinDialogue' : 'HanafudaDefeatDialogue';
        const dialogueData = this.cache.json.get(dialogueKey);
        console.log(dialogueData);
        const dialogueType = this.playerWon ? "HanafudaWin" : "HanafudaDefeat";
        

        this.dialogueController = new DialogueController(this, dialogueType, dialogueData);
        this.dialogueController.iniDialogue();

        this.events.on('nextDialog',()=>{
            this.dialogueController.handleInteraction();
        });

        this.events.on('CharacterTalking', (characterObj) => {
        this.displayCharacterSprite(characterObj);
        })

        this.events.on('Finished', () => {
            //this.transitionController.startFadeOutTransition();
            this.scene.start('SelectionMenuScene', this.playerData);  
        });

        //UI 
        const skipBtn = this.add.text(width - 100, height - 1000 , 'SKIP', {fontSize: '30px',fill: '#000000',backgroundColor: '#f7f7f7',padding: { x: 20, y: 10 }})
        .setOrigin(0.5).setInteractive({ cursor: 'pointer' })
        .on('pointerover', () => skipBtn.setStyle({ backgroundColor: '#bbbaba' }))
        .on('pointerout', () => skipBtn.setStyle({ backgroundColor: '#f7f7f7' }))
        .on('pointerdown', () => {
            this.dialogueController.skipToEnd();  
        });
    
    }

    displayCharacterSprite(characterObj) {
        if (this.currentCharacter) {
        this.currentCharacter.destroy();
        this.currentCharacter = null;
    }

    if (this.currentEmoticon) {
        this.currentEmoticon.destroy();
        this.currentEmoticon = null;
    }

    if (characterObj === "none") {
        return;
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
        else if (characterObj.emoticon == "none") {

        if (this.currentEmoticon) {
            this.currentEmoticon.destroy();
            this.currentEmoticon = null;
        }
        }
    }
}