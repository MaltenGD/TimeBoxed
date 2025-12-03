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
        this.background = this.add.image(width / 2, height / 2, 'asebBackgroundPlaceholder').setDisplaySize(width, height);

        /** variable json*/
        const defeatAsebData = this.cache.json.get('AsebDefeatDialogue');
        this.dialogueController = new DialogueController(this, "AsebDefeat", defeatAsebData);
        this.dialogueController.iniDialogue();

        /**Skip button */
        this.skipBtn = new SkipButton(this, width - 130, 50, this.dialogueController, this.playerData);
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {

            this.transitionController.startFadeOutTransition(() => {
            if (this.playerData.TimeboxedMode) this.scene.start('TimeBoxedDefeat', this.playerData);
            else this.scene.start('AsebBeginScene', this.playerData)
                }, 400);
            
            console.log("cambia de escena");
        });
    
    }
}
