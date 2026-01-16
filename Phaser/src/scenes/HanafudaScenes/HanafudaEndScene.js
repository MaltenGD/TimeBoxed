//import TransitionController from "../../misc/transitioncontroller.js";
import { BaseScene } from '../BaseScene.js';
import DialogueController from '../../dialogues/DialogueController.js';
import { SkipButton } from "../../misc/SkipButton.js";

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
        
        //Background
        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackground').setDisplaySize(this.width, this.height).setDepth(-3);

        // //Dialogue
        const dialogueKey = this.playerWon ? 'HanafudaWinDialogue' : 'HanafudaDefeatDialogue';
        const dialogueData = this.cache.json.get(dialogueKey);
        console.log(dialogueData);
        const dialogueType = this.playerWon ? "HanafudaWin" : "HanafudaDefeat";
        

        this.dialogueController = new DialogueController(this, dialogueType, dialogueData);
        
        this.events.on('CharacterTalking', (characterObj) => {
            this.displayCharacterSprite(characterObj);
        })

        this.dialogueController.iniDialogue();

        this.events.on('nextDialog',()=>{
            this.dialogueController.handleInteraction();
        });


        this.events.on('Finished', () => {
            //this.transitionController.startFadeOutTransition();
            this.scene.start('SelectionMenuScene', this.playerData);  
        });

         this.skipBtn = new SkipButton(this, width - 15, 15, this.dialogueController, this.playerData);
    
    }

    displayCharacterSprite(characterObj) {
        if (this.currentCharacter || characterObj == "none") { // if another character was talking or set to none, delete sprite
            if(this.currentCharacter) this.currentCharacter.destroy();
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
}