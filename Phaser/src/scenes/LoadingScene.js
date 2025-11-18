import Tali from "../tali/tali.js";
import AchievementManager from "../achievements/achievementManager.js";

export class LoadingScene extends Phaser.Scene 
{
    constructor() 
    {
        super('LoadingScene');
    }

    preload() 
    {   
        this.with = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;

        let progressBoxWidth = 620;
        let progressBoxHeight = 80;

        let progressBoxPosX = this.with / 2 - progressBoxWidth / 2;
        let progressBoxPosY = this.height / 2 - progressBoxHeight / 2;


        let progressBarWidth = progressBoxWidth - 20;
        let progressBarHeight = progressBoxHeight - 20


        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();
        progressBox.fillStyle(0xff0000, 1);
        progressBox.fillRect(progressBoxPosX, progressBoxPosY, progressBoxWidth, progressBoxHeight);

        let percentageText = this.add.text(progressBoxPosX + progressBoxWidth/2, progressBoxPosY + progressBoxHeight/2, "0%", {fontSize:40, color: '#000000ff', fontStyle: 'bold'}).setOrigin(0.5)
        let loadingText = this.add.text(progressBoxPosX + progressBoxWidth/2, progressBoxPosY - 40, "Loading...", {fontSize:55}).setOrigin(0.5);
        let loadingInfo = this.add.text(progressBoxPosX + progressBoxWidth/2, progressBoxPosY + progressBoxHeight + 40 , "Starting game...", {fontSize:35}).setOrigin(0.5);

        this.loadMainMenuAssets();
        this.loadIntroAssets();
        this.loadSelectionMenuAssets();
        this.loadAsebAssets();
        this.loadTaliAssets();
        this.loadHanafudaAssets();
        this.loadCreditsAssets();
        this.loadInisgniaAssets();
        this.loadTestAssets();
        
        this.load.json('achievements', 'Phaser/assets/achievements.json');

        this.load.on('progress', (value) => {
        console.log(value);
        progressBar.clear();
        progressBar.fillStyle(0xFFFFFF, 1);
        progressBar.fillRect(progressBoxPosX + 10, progressBoxPosY + 10, progressBarWidth * value, progressBarHeight);
        // the progress bar has to be 10 pixels to the right and down to be centered in side the progressBox

        percentageText.setText(Math.trunc(value * 100) + "%");
        });
                
        this.load.on('fileprogress', (file) => {
            console.log(file.src);
            loadingInfo.setText("Loading: " + file.key +"\nFrom: " + file.src);
        });
        this.load.on('complete', () => {
            console.log('complete');

            progressBar.destroy();
            progressBox.destroy();
        })
        this.load.on('fileprogress', (file) => {
            console.log(file.src);
            loadingInfo.setText("Loading: " + file.key +"\nFrom: " + file.src);
        });
        this.load.on('complete', () => {
            console.log('complete');

            progressBar.destroy();
            progressBox.destroy();
            
            this.scene.start("Start");  
        });
    }
    
    loadMainMenuAssets()
    {
        this.load.image('background', 'Phaser/assets/StartMenu/MainBackground.png');
        this.load.image('backgroundTB', 'Phaser/assets/StartMenu/MainBackgroundTimeboxedMode.png');
        this.load.image('taliBackgroundPlaceholder', 'Phaser/assets/tali/taliBackgroundPlaceholder.png');
        this.load.image('StartMenuKronos', 'Phaser/assets/StartMenu/kittykronos.png')
        this.load.image('BoxOpen', 'Phaser/assets/StartMenu/cardboardbox.png')
        this.load.image('logo', 'Phaser/assets/titlelogo.png');
        this.load.image('teamLogo', 'Phaser/assets/teamLogo.png');
        this.load.spritesheet('playButton', 'Phaser/assets/playButton.png', { frameWidth: 186, frameHeight: 92 });
        this.load.json('playerData', 'Phaser/src/playerData.json');
    }

    /**
     * Loads all option menu assets.
     */
    loadOptionMenuAssets()
    {
    }

    /**
     * Loads all intro assets.
     */
    loadIntroAssets() {

         // loads the background
        this.load.image('IntroBackgroundPlaceholder', 'Phaser/assets/Intro/IntroBackgroundPlaceholder.jpeg');
        
        this.load.image('OptionMenuBase', 'Phaser/assets/OptionMenu/OptionMenuBase.png');
        this.load.image('ResumeButtonNormal', 'Phaser/assets/OptionMenu/ResumeNormal.png');
        this.load.image('ResumeButtonHovered', 'Phaser/assets/OptionMenu/ResumeHovered.png');
        this.load.image('HelpButtonNormal', 'Phaser/assets/OptionMenu/HelpNormal.png');
        this.load.image('HelpButtonHovered', 'Phaser/assets/OptionMenu/HelpHovered.png');
        this.load.image('ItemsButtonNormal', 'Phaser/assets/OptionMenu/ItemsNormal.png');
        this.load.image('ItemsButtonHovered', 'Phaser/assets/OptionMenu/ItemsHovered.png');
        this.load.image('ExitButtonNormal', 'Phaser/assets/OptionMenu/ExitNormal.png');
        this.load.image('ExitButtonHovered', 'Phaser/assets/OptionMenu/ExitHovered.png');

        /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('IntroDialogue', 'Phaser/DialoguesJson/IntroDialogue.json');
    }

    loadSelectionMenuAssets()
    {

        this.load.image('BoxClosed', 'Phaser/assets/SelectionMenu/BoxClosed.png');

    }

    /**
     * Loads all aseb assets.
     */
    loadAsebAssets() {
        this.load.image('asebVerticalBackground', 'Phaser/assets/SelectionMenu/EgyptVertical.png');

        this.load.image('asebBackgroundPlaceholder', 'Phaser/assets/aseb/Egipcio.png');

        this.load.image('StickBoard', 'Phaser/assets/aseb/stickBoard.png');
        this.load.image('StickLight', 'Phaser/assets/aseb/AsebStickLight.png');
        this.load.image('StickDark', 'Phaser/assets/aseb/AsebStickDark.png');

        this.load.image('asebBoard', 'Phaser/assets/aseb/AsebBoard.png');
        this.load.image('redPiece', 'Phaser/assets/aseb/redPiece.png');
        this.load.image('bluePiece', 'Phaser/assets/aseb/bluePiece.png');
    }

    /**
     * Loads all tali assets.
     */
    loadTaliAssets() {
        this.load.image('taliVerticalBackground', 'Phaser/assets/SelectionMenu/RomeVertical.png');

        this.load.image('taliBoard', 'Phaser/assets/tali/temporary_board.png');
        for (let i = 0; i < Tali.NUMBER_OF_DICE; i++) {
            this.load.image('dice' + i, 'Phaser/assets/tali/temporary_dice' + i + '.png');
        }
        for (let i = 0; i < Tali.DICE_THROW_NAMES.length; i++) {
            console.log(Tali.DICE_THROW_NAMES[i]);
            this.load.image(Tali.DICE_THROW_NAMES[i], 'Phaser/assets/tali/temporary_throw' + i + '.png');
        }
    }

    loadHanafudaAssets()
    {
        this.load.image('HanafudaBackgroundPlaceholder', 'Phaser/assets/Hanafuda/HanafudaBackgroundPlaceholder.png');
    }

    loadCreditsAssets() {
        this.load.image('member1', 'Phaser/assets/mewingCat.jpg');
        this.load.image('member2', 'Phaser/assets/oreoCat.jpg');
        this.load.image('member3', 'Phaser/assets/alienCat.jpg');
        this.load.image('member4', 'Phaser/assets/awkwarCat.jpg');
    }

    loadInisgniaAssets() {
        this.load.image('tempInsignia1', 'Phaser/assets/insignias/tempInsignia1.png');
        this.load.image('tempInsignia2', 'Phaser/assets/insignias/tempInsignia2.png');
    }

    /**
     * Loads test assets.
     * Only exists to make loading slower, otherwise we wouldn't be able to see the loading screen.
     */
    loadTestAssets() {
        
    }

    create() {
        this.createAchievementManager();
    }

    /**
     * Creates the achievement manager and loads the achievements from the json file into it.
     */
    createAchievementManager() {
        // Create the achievement manager and load achievements into it.
        this.achievementManager = new AchievementManager();
        this.achievementManager.loadAchievements(this.cache.json.get('achievements'));

        // Save the achievement manager into the registry.
        this.registry.set('AchievementManager', this.achievementManager);
    }
}