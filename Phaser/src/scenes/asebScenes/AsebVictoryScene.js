import DialogueController from "../../DialogueController.js";
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { SkipButton } from "../../SkipButton.js";
import { BaseScene } from "../BaseScene.js";

export class AsebVictoryScene extends BaseScene
{
    constructor(){super('AsebVictoryScene');}


    create(playerData) 
    {

        this.playerData = playerData;
        console.log(this.playerData)

        this.playerData.AsebCompleted = true;

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;

        const baseMusicVolume = 0.25;
            this.music = this.sound.add('egyptMusic', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
            this.soundInstances.push({ 
                sound: this.music, 
                type: 'music', 
                baseVolume: baseMusicVolume 
            });
            this.music.play();

        
        // Award Achievements

        this.awardAch("AS1");
        if (this.playerData.AsebNoCapturesCompletion) this.awardAch("AS2");
        if (this.playerData.AsebLandedOnEverySpecial) this.awardAch("AS3");

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'asebBackgroundPlaceholder').setDisplaySize(width, height);

        this.backBtn = this.add.text(0, 0, 'Pause', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });

        /** variable json*/
        const victoryAsebData = this.cache.json.get('AsebWinDialogue');
        this.dialogueController = new DialogueController(this, "AsebWin", victoryAsebData);
        this.dialogueController.iniDialogue();

        /**Skip button */
        this.skipBtn = new SkipButton(this, width - 15, 15, this.dialogueController, this.playerData);
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {
            this.transitionController.startFadeOutTransition(() => {
            this.scene.start('SelectionMenuScene', this.playerData);
                }, 400);
            console.log("cambia de escena");
        });
    
    }
}
