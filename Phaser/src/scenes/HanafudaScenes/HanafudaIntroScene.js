import DialogueController from "../../DialogueController.js";
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { BaseScene } from "../BaseScene.js";
import { SkipButton } from "../../SkipButton.js";

export class HanafudaIntro extends BaseScene{

    constructor(){
        super('HanafudaIntro');
    }

    create(playerData) 
    {
        this.playerData = playerData;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;

        // Background music
        const baseMusicVolume = 0.25;
        this.music = this.sound.add('japaneseMusic', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
        this.soundInstances.push({ 
            sound: this.music, 
            type: 'music', 
            baseVolume: baseMusicVolume 
        });
        this.music.play();

        // Unlock audio on the first user interaction
        this.sound.pauseOnBlur = false; // Keep audio playing even when the window loses focus.

        //Background
        this.background = this.add.image(width / 2, height / 2, 'HanafudaBackgroundPlaceholder').setDisplaySize(width, height);

        //Back button
        this.backBtn = this.add.image(80, 50, 'BackNormalButton').setScale(0.27)
        .setInteractive()
        .on('pointerover', () => this.backBtn.setTexture('BackHoverButton')).setScale(0.6)
        .on('pointerout', () => this.backBtn.setTexture('BackNormalButton')).setScale(0.27)
        .on('pointerup', () => {this.openOptionMenu(); });

        /** variable json*/
        const introHanafudaData = this.cache.json.get('HanafudaIntroDialogue');
        this.dialogueController = new DialogueController(this, "HanafudaIntro", introHanafudaData);
        this.dialogueController.iniDialogue();

        //skip Button
        this.skipBtn = new SkipButton(this, width - 15, 15, this.dialogueController, this.playerData);
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {
            this.transitionController.startFadeOutTransition(() => {
                this.scene.stop(this);
                this.scene.launch('ConfirmMenu',{
                    sceneToPause: this.scene.key,
                    playerData: this.playerData,
                    text: "Is your first time playing Hanafuda?\n Do you want to go through an explanation?",
                    onYes: () => {         
                        this.scene.stop(this.playerData.SceneToResume);
                        this.scene.stop('ConfirmMenu');
                        this.scene.stop('OptionMenu');
                        this.scene.start('TutorialHanafuda', this.playerData);
                    },
                    onNo: () => {
                        this.scene.start('HanafudaBeginScene', this.playerData);
                        this.scene.stop('ConfirmMenu');
                    }
                });
            } , 400);  
        });
    }
}