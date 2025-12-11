import DialogueController from "../../DialogueController.js";
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { SkipButton } from "../../SkipButton.js";
import { BaseScene } from "../BaseScene.js";

export class AsebDefeatScene extends BaseScene
{
    constructor(){super('AsebDefeatScene');}



    create(playerData) 
    {
        this.playerData = playerData;
        console.log(this.playerData)
        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;
        this.height = height;

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        this.DisableOptionMenu();

        const baseMusicVolume = 0.25;
            this.music = this.sound.add('CreepyegyptMusic', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
            this.soundInstances.push({ 
                sound: this.music, 
                type: 'music', 
                baseVolume: baseMusicVolume 
            });
            this.music.play();

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'asebBackground').setDisplaySize(width, height).setDepth(-3);

        /** variable json*/
        const defeatAsebData = this.cache.json.get('AsebDefeatDialogue');
        this.dialogueController = new DialogueController(this, "AsebDefeat", defeatAsebData);
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

            this.transitionController.startFadeOutTransition(() => {
            if (this.playerData.TimeboxedMode) this.scene.start('TimeBoxedDefeat', this.playerData);
            else this.scene.start('AsebBeginScene', this.playerData)
                }, 400);
            
            console.log("cambia de escena");
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
}
