import DialogueController from "../../DialogueController.js";
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { BaseScene } from "../BaseScene.js";
export class TaliTutorial extends BaseScene
{
    constructor()
    {super('TaliTutorial');}

    create(playerData)
    {
        this.playerData = playerData;
        console.log(this.playerData) 

        this.setBackgroundMusic('taliIntroMusic');

        this.DisableOptionMenu();
        
        let { width, height } = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        if (this.playerData.TimeboxedMode) this.background = this.add.image(width / 2, height / 2, 'backgroundTB').setDisplaySize(width, height);
        else this.background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height).setDepth(-3);
        
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        this.setupDialogue();
    }

    setupDialogue() {
        const tutorialTaliData = this.cache.json.get('TaliDialogue');
        this.dialogueController = new DialogueController(this, "TaliTutorial", tutorialTaliData);

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
           if (this.playerData.comingFromMenu)
           {
                // Stops this scene and resumes the HelpLobyScene
                this.playerData.comingFromMenu = false;
                this.scene.stop();
                this.scene.resume('HelpLobbyScene', this.playerData);

           }
            else this.scene.start('TaliBeginScene', this.playerData)
        });
    }

    changeTutoImage(imageKey)
    {
        if(this.tutoImage)
        {
            this.tutoImage.destroy();
        }

        if (imageKey != "none") this.tutoImage = this.add.image(this.width/2, this.height/2, imageKey).setOrigin(0.5).setScale(1).setDepth(-3);   
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