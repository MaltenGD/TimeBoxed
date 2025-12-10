import DialogueController from "../DialogueController.js";
import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";
import { SkipButton } from "../SkipButton.js";
import { BaseScene } from "./BaseScene.js";

/**  
 *  @class Intro
 *  This class/scene shows the intro background and dialogues of the player meeting kronos
 */
export class Intro extends BaseScene 
{
    constructor() 
    {
        super('Intro');
    }

    
    create(playerData) 
    {

        this.playerData = playerData;
        this.playerData.StartedIntro = true;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;

        this.height = height;

        const baseMusicVolume = 0.2;
            this.music = this.sound.add('HappyNeighborhood', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
            this.soundInstances.push({ 
                sound: this.music, 
                type: 'music', 
                baseVolume: baseMusicVolume 
            });
            this.music.play();

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'IntroBackgroundPlaceholder').setDisplaySize(width, height).setDepth(-3);

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
        const introData = this.cache.json.get('IntroDialogue');
        this.dialogueController = new DialogueController(this, "Intro", introData);

        this.events.on('CharacterTalking', (characterObj) => {
            this.displayCharacterSprite(characterObj);
        })
         this.events.on('changeTutoImage',(imageKey)=> {
            this.changeTutoImage(imageKey);
            console.log('tuto');
        });

        this.dialogueController.iniDialogue();

        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {
            this.playerData.IntroCompleted = true
            this.transitionController.startFadeOutTransition(() => {
            this.scene.start('SelectionMenuScene', this.playerData);
                }, 400);
        });

       

        /**Skip button */
        this.skipBtn = new SkipButton(this, width - 15, 15, this.dialogueController, this.playerData);
    
    }

    displayCharacterSprite(characterObj) {
        if (this.currentCharacter || characterObj == "none") { // if another character was talking or set to none, delete sprite
            this.currentCharacter.destroy();
            if (this.currentEmoticon)
                this.currentEmoticon.destroy();
        }

        console.log(characterObj.ImageKey);

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

    changeTutoImage(imageKey)
    {
        if(this.tutoImage)
        {
            this.tutoImage.destroy();
        }

        if (imageKey != "none") this.tutoImage = this.add.image(this.width/2, this.height/2, imageKey).setOrigin(0.5).setScale(1).setDepth(-2);   
    }
        
}