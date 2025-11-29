import DialogueController from "../../DialogueController.js";
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { BaseScene } from "../BaseScene.js";
export class TutorialAseb extends BaseScene
{
    constructor()
    {super('TutorialAseb');}

    create(playerData)
    {

        this.playerData = playerData;
        console.log(this.playerData) 

        this.DisableOptionMenu();
        
         let { width, height } = this.sys.game.canvas;
         this.width = width;
         this.height = height;

        if (this.playerData.TimeboxedMode) this.background = this.add.image(width / 2, height / 2, 'backgroundTB').setDisplaySize(width, height);
        else this.background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);
        
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        const tutorialAsebData = this.cache.json.get('AsebTutorialDialogue');
        this.dialogueController = new DialogueController(this, "AsebTutorial", tutorialAsebData);
        this.dialogueController.iniDialogue();
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {

           if (this.playerData.comingFromMenu)
           {
            // Stops this scene and resumes the HelpLobyScene
            this.playerData.comingFromMenu = false;
            this.scene.stop();
            this.scene.resume('HelpLobbyScene', this.playerData);

           }
            else this.scene.start('AsebBeginScene', this.playerData)
            
            console.log("cambia de escena");
        });

        this.events.on('changeTutoImage',(imageKey)=> {
            this.changeTutoImage(imageKey);
        });
    }

    changeTutoImage(imageKey)
    {
        if(this.tutoImage)
        {
            this.tutoImage.destroy();
        }

        if (imageKey != "none") this.tutoImage = this.add.image(this.width/2, this.height/2, imageKey).setOrigin(0.5).setScale(1);
    }



    
}