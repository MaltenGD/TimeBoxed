import TransitionController from "../../misc/transitioncontroller.js";
import { BaseScene } from '../BaseScene.js';
import DialogueController from '../../DialogueController.js';

export class HanafudaEndScene extends BaseScene {
    constructor() {
        super('HanafudaEndScene');
        this.dialogueController;
    }

    create(playerData) {
    
        this.playerData = playerData;
        this.playerWon = this.playerData.HanafudaCompleted;

        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        this.achManager = this.registry.get('AchievementManager');
        if (this.playerWon) {
            this.achManager.awardAchievement('HA1');
            console.log("HA1 awarded!");
            this.achManager.checkGameCompletion(this.playerData);
        }
        this.registry.set('AchievementManager', this.achManager);
        
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();
        
        //Background
        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackgroundPlaceholder').setDisplaySize(this.width, this.height);


        //UI 
        const skipBtn = this.add.text(width - 100, height - 1000 , 'SKIP', {fontSize: '30px',fill: '#000000',backgroundColor: '#f7f7f7',padding: { x: 20, y: 10 }})
        .setOrigin(0.5).setInteractive({ cursor: 'pointer' })
        .on('pointerover', () => skipBtn.setStyle({ backgroundColor: '#bbbaba' }))
        .on('pointerout', () => skipBtn.setStyle({ backgroundColor: '#f7f7f7' }))
        .on('pointerdown', () => {
            this.dialogueController.skipToEnd();  
        });

        //Dialogue
        let HanafudaEndData = null;

        if(this.playerWon) {
            HanafudaEndData = this.cache.json.get('HanafudaWinDialogue');
            this.dialogueController = new DialogueController(this, "HanafudaWin", HanafudaEndData);
        }
        else{
            HanafudaEndData = this.cache.json.get('HanafudaDefeatDialogue');
            this.dialogueController = new DialogueController(this, "HanafudaDefeat", HanafudaEndData);
        } 
        this.dialogueController.iniDialogue();


        this.events.on('nextDialog',()=>{
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {

            this.transitionController.startFadeOutTransition();
            this.scene.start('SelectionMenuScene', this.playerData);  
        });
    
    }
}