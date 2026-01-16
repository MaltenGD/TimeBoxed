import DialogueController from '../dialogues/DialogueController.js';
import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";
import { SkipButton } from "../misc/SkipButton.js";
import { BaseScene } from "./BaseScene.js";

/**  
 *  @class GameCompleted
 *  This class/scene shows the intro background and dialogues of the player meeting kronos
 */
export class GameCompleted extends BaseScene 
{
    constructor() 
    {
        super('GameCompleted');
    }

    
    create(playerData) 
    {

        this.playerData = playerData;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();


        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;
        this.height = height;


        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'IntroBackground').setDisplaySize(width, height).setDepth(-3);

        this.pauseBtn = this.add.image(15, 15, 'PauseButtonNormal')
            .setOrigin(0)
            .setScale(0.5)
            .setInteractive({ cursor: 'pointer' });

        this.pauseBtn.on('pointerover', () => {
            this.pauseBtn.setTexture('PauseButtonHovered');
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            this.tweens.add({
                targets: this.pauseBtn,
                scale: 0.55,
                duration: 100,
                ease: 'Power1'
            });
        });

        this.pauseBtn.on('pointerout', () => {
            this.pauseBtn.setTexture('PauseButtonNormal');
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            this.tweens.add({
                targets: this.pauseBtn,
                scale: 0.5,
                duration: 100,
                ease: 'Power1'
            });
        });

        this.pauseBtn.on('pointerdown', () => {
            this.openOptionMenu();
        });
        
        //dialogues
        const dialogueData = this.cache.json.get('GameCompletedDialogue');
        this.dialogueController = new DialogueController(this, "GameCompleted", dialogueData);
        this.dialogueController.iniDialogue();

        /**Skip button */
        this.skipBtn = new SkipButton(this, width - 15, 15, this.dialogueController, this.playerData);
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

         this.events.on('CharacterTalking', (characterObj) => {
            this.displayCharacterSprite(characterObj);
        })

        this.events.on('Finished', () => {
            this.playerData.GameCompleted = true;
            this.transitionController.startFadeOutTransition(() => {
                this.resetPlayerData();
                this.scene.start('CreditsScene', this.playerData);
                }, 400);
        });

    }
    displayCharacterSprite(characterObj) {
        if (this.currentCharacter || characterObj == "none") { // if another character was talking or set to none, delete sprite
            if (this.currentCharacter) this.currentCharacter.destroy();
            if (this.currentEmoticon) this.currentEmoticon.destroy();
                
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
            if (this.currentEmoticon) this.currentEmoticon.destroy();
        }
    }

    resetPlayerData()
    {
        for (const key in this.playerData) {
            if (typeof this.playerData[key] === 'boolean') {
                this.playerData[key] = false;
            }
        }

    }
        
}