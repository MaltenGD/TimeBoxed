import DialogueController from "../../DialogueController.js";
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { BaseScene } from "../BaseScene.js";
import { SkipButton } from "../../SkipButton.js";

export class TaliIntroScene extends BaseScene
{
    constructor(){super('TaliIntroScene');}

    create(playerData) 
    {

        this.playerData = playerData;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;
        this.height = height;

        this.setBackgroundMusic('taliIntroMusic');

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'taliBackgroundPlaceholder').setDisplaySize(width, height).setDepth(-3);

        this.backBtn = this.add.text(0, 0, 'Pause', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });

        this.createAndBeginDialogue();
        
        /**Skip button */
        this.skipBtn = new SkipButton(this, width - 15, 15, this.dialogueController, this.playerData);
    
    }

    createAndBeginDialogue() {
        const introTaliData = this.cache.json.get('TaliDialogue');
        this.dialogueController = new DialogueController(this, "Tali", introTaliData);

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

             this.transitionController.startFadeOutTransition(() => {
                this.scene.launch('ConfirmMenu',{
                sceneToPause: this.scene.key,
                playerData: this.playerData,
                text: "Is your first time playing Tali?\n Do you want to go through an explanation?",
                onYes: () => {         
                    this.scene.stop(this.playerData.SceneToResume);
                    this.scene.stop('ConfirmMenu');
                    this.scene.stop('OptionMenu');
                    this.scene.start('TaliTutorial', this.playerData);

                    
                },
                onNo: () => {
                    this.scene.start('TaliBeginScene', this.playerData);
                    this.scene.stop('ConfirmMenu');
                }
            });
            
        }); 
        }, 400);

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
            
}
