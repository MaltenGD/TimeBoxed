import DialogueController from "../../DialogueController.js";
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
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

        /**Skip button */
        const skipBtn = this.add.text(width - 100, height - 1000 , 'SKIP', {
            fontSize: '30px',
            fill: '#000000',
            backgroundColor: '#f7f7f7',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerover', () => skipBtn.setStyle({ backgroundColor: '#bbbaba' }))
        .on('pointerout', () => skipBtn.setStyle({ backgroundColor: '#f7f7f7' }))
        .on('pointerdown', () => {   
            this.dialogueController.skipToEnd();

        });

        /** variable json*/
        const defeatAsebData = this.cache.json.get('AsebDefeatDialogue');
        this.dialogueController = new DialogueController(this, "AsebDefeat", defeatAsebData);
        this.dialogueController.iniDialogue();
        
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
