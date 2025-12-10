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

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'IntroBackgroundPlaceholder').setDisplaySize(width, height).setDepth(-3);

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
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
        this.skipBtn = new SkipButton(this, width - 130, 50, this.dialogueController, this.playerData);
    
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

    changeTutoImage(imageKey)
    {
        if(this.tutoImage)
        {
            this.tutoImage.destroy();
        }

        if (imageKey != "none") this.tutoImage = this.add.image(this.width/2, this.height/2, imageKey).setOrigin(0.5).setScale(1).setDepth(-2);   
    }
        
}