import DialogueController from "../../DialogueController.js";
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { SkipButton } from "../../SkipButton.js";
import { BaseScene } from "../BaseScene.js";
export class IntroAseb extends BaseScene
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


         // Background music
            const baseMusicVolume = 0.25;
            this.music = this.sound.add('egyptMusic', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
            this.soundInstances.push({ 
                sound: this.music, 
                type: 'music', 
                baseVolume: baseMusicVolume 
            });
            this.music.play();
        

        // Unlock audio on the first user interaction
        this.sound.pauseOnBlur = false; // Keep audio playing even when the window loses focus.

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'asebBackgroundPlaceholder').setDisplaySize(width, height);

        // --- Back Button ---
        const backBtnImage = this.add.image(0, 0, 'AsebButton').setScale(0.3,0.5);
        const backBtnText = this.add.text(0, 0, 'Pause', { fontSize: 48, fill: '#000000ff', fontFamily: "Anubismythicalserif"}).setOrigin(0.5);

        this.backBtn = this.add.container(140, 80, [ backBtnImage, backBtnText ]);
        this.backBtn.setSize(backBtnImage.width * 0.5, backBtnImage.height * 0.5).setInteractive()
            .on('pointerover', () => {
                this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume }); 
                this.tweens.add({ targets: this.backBtn, scale: 1.1, duration: 100, ease: 'Power1' });
            })
            .on('pointerout', () => {
                this.tweens.add({ targets: this.backBtn, scale: 1.0, duration: 100, ease: 'Power1' });
            })
            .on('pointerdown', () => this.openOptionMenu());

        /** variable json*/
        const introAsebData = this.cache.json.get('AsebIntroDialogue');
        this.dialogueController = new DialogueController(this, "Aseb", introAsebData);
        this.dialogueController.iniDialogue();

        /**Skip button */
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
            
        } , 400);  
                
            
            });
            
    }
}
