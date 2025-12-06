import DialogueController from "../../DialogueController.js";
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { BaseScene } from "../BaseScene.js";

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


        // // Background music
        // const baseMusicVolume = 0.25;
        // this.music = this.sound.add('egyptMusic', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
        // this.soundInstances.push({ 
        //     sound: this.music, 
        //     type: 'music', 
        //     baseVolume: baseMusicVolume 
        // });
        // this.music.play();
        

        // Unlock audio on the first user interaction
        // this.sound.pauseOnBlur = false; // Keep audio playing even when the window loses focus.

        //Background
        this.background = this.add.image(width / 2, height / 2, 'HanafudaBackgroundPlaceholder').setDisplaySize(width, height);

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

        /** variable json*/
        const introHanafudaData = this.cache.json.get('HanafudaIntroDialogue');
        this.dialogueController = new DialogueController(this, "HanafudaIntro", introHanafudaData);
        this.dialogueController.iniDialogue();
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {

            this.transitionController.startFadeOutTransition(() => {
                this.scene.start('HanafudaBeginScene', this.playerData);
                this.scene.launch('ConfirmMenu',{
                    sceneToPause: this.scene.key,
                    playerData: this.playerData,
                    text: "Is your first time playing Aseb?\n Do you want to go through an explanation?",
                    onYes: () => {         
                        this.scene.stop(this.playerData.SceneToResume);
                        this.scene.stop('ConfirmMenu');
                        this.scene.stop('OptionMenu');
                        this.scene.start('TutorialHanafuda', this.playerData);
                    },
                    onNo: () => {
                        this.scene.start('HanafudaBeginScene', this.playerData);
                        this.scene.stop('ConfirmMenu');
                        console.log("cambia de escena");
                    }
                });
            } , 400);  
        });
    }
}