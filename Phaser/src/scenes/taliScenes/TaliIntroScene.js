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


        this.setBackgroundMusic('taliIntroMusic');

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'taliBackgroundPlaceholder').setDisplaySize(width, height);

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });

        /** variable json*/
        const introTaliData = this.cache.json.get('TaliDialogue');
        this.dialogueController = new DialogueController(this, "Tali", introTaliData);
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
        
        /**Skip button */
        this.skipBtn = new SkipButton(this, width - 130, 50, this.dialogueController, this.playerData);
    
    }
            
}
