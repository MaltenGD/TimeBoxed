import DialogueController from "../../DialogueController.js";
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";

export class IntroAseb extends Phaser.Scene
{
    constructor(){super('IntroAseb');}


    create(playerData) 
    {

        this.playerData = playerData;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;

        this.input.keyboard.on('keydown-ESC', () => {
            this.openOptionMenu();
        });

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'asebBackgroundPlaceholder').setDisplaySize(width, height);

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
           this.transitionController.startFadeOutTransition(() => {
                
                 this.dialogueController.skipToEnd();
            
            }, 400);
        });

        /** variable json*/
        const introAsebData = this.cache.json.get('AsebIntroDialogue');
        this.dialogueController = new DialogueController(this, "Aseb", introAsebData);
        this.dialogueController.iniDialogue();
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {

            this.scene.launch('ConfirmMenu',{
                sceneToPause: this.scene.key,
                text: "Is your first time playing Aseb?\n Do you want to go through an explanation?",
                onYes: () => {         
                    this.scene.stop(this.playerData.SceneToResume);
                    this.scene.stop('ConfirmMenu');
                    this.scene.stop('OptionMenu');
                    this.scene.start('TutorialAseb', this.playerData);

                    
                },
                onNo: () => {
                    this.scene.start('AsebBeginScene', this.playerData);
                    this.scene.stop('ConfirmMenu');
                    console.log("cambia de escena");
                }
            });
            
        });  
    }
    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.playerData.SceneToResume = this.scene.key;
            this.scene.launch('OptionMenu', this.playerData);
    }
            
}
