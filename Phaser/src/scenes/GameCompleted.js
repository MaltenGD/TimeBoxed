import DialogueController from "../DialogueController.js";
import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";
import { BaseScene } from "./BaseScene.js";

/**  
 *  @class GameCompleted
 *  This class/scene shows the intro background and dialogues of the player meeting kronos
 */
export class GameCompleted extends BaseScene 
{
    constructor() 
    {
        super('GameCompleted');
    }

    
    create(playerData) 
    {

        this.playerData = playerData;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;

        this.input.keyboard.on('keydown-ESC', () => {
             this.openOptionMenu()
        });

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'IntroBackgroundPlaceholder').setDisplaySize(width, height);

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });
        
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

        //dialogues
        const dialogueData = this.cache.json.get('GameCompletedDialogue');
        this.dialogueController = new DialogueController(this, "GameCompleted", dialogueData);
        this.dialogueController.iniDialogue();
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {
            this.playerData.GameCompleted = true;
            this.transitionController.startFadeOutTransition(() => {
                this.resetPlayerData();
                this.scene.start('CreditsScene', this.playerData);
                }, 400);
        });

    }

    resetPlayerData()
    {
        for (const key in this.playerData) {
            if (typeof this.playerData[key] === 'boolean') {
                this.playerData[key] = false;
            }
        }

    }
        
}