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
        this.loadOptionMenuAssets();
        this.loadDialogues();
        this.loadIntroAssets();
        this.loadSelectionMenuAssets();
        this.loadAsebAssets();
        this.loadTaliAssets();
        this.loadHanafudaAssets();
        this.loadCreditsAssets();
        this.loadInisgniaAssets();
        this.loadAudioAssets();
        
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
            loadingText.setText("Click or Press any key to start");
            loadingInfo.destroy();
            
            this.input.once('pointerdown', () => {
                this.scene.start('Start');
            });
            this.input.keyboard.once('keydown', () => {
                this.scene.start('Start');
            });
            


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
        this.load.image('creditsButton', 'Phaser/assets/StartMenu/creditsButton.png');
        this.load.image('teamLogo', 'Phaser/assets/teamLogo.png');
        this.load.json('playerData', 'Phaser/src/playerData.json');
        this.load.image('playButtonS', 'Phaser/assets/StartMenu/StartButtonS.png');
        this.load.image('playButtonT', 'Phaser/assets/StartMenu/StartButtonT.png');
        this.load.image('playButtonA', 'Phaser/assets/StartMenu/StartButtonA.png');
        this.load.image('playButtonR', 'Phaser/assets/StartMenu/StartButtonR.png');
        this.load.image('playButtonT2', 'Phaser/assets/StartMenu/StartButtonT2.png');
        this.load.image('StartMenuSettings', 'Phaser/assets/StartMenu/StartMenuSettings.png');

        this.load.image('playButtonSHovered', 'Phaser/assets/StartMenu/StartButtonSHovered.png');
        this.load.image('playButtonTHovered', 'Phaser/assets/StartMenu/StartButtonTHovered.png');
        this.load.image('playButtonAHovered', 'Phaser/assets/StartMenu/StartButtonAHovered.png');
        this.load.image('playButtonRHovered', 'Phaser/assets/StartMenu/StartButtonRHovered.png');
        this.load.image('playButtonT2Hovered', 'Phaser/assets/StartMenu/StartButtonT2Hovered.png');
        this.load.image('StartMenuSettingsHovered', 'Phaser/assets/StartMenu/StartMenuSettingsHovered.png');


    }

    loadAudioAssets()
    {
        // Audio comun, que es usado en varias escenas
        this.load.audio('startMenuMusic', 'Phaser/assets/audio/mainmenuScene/Floating Beyond-OliverMix.mp3');
        this.load.audio('buttonHover', 'Phaser/assets/audio/Buttons/ButtonHoverLowLatency.wav');
        this.load.audio('egyptMusic', 'Phaser/assets/audio/Egypt-Aseb/AsebIntroMusic.mp3');
        this.load.audio('CreepyegyptMusic', 'Phaser/assets/audio/Egypt-Aseb/AsebDefeatMusic.mp3');
        this.load.audio('AsebMusic', 'Phaser/assets/audio/Egypt-Aseb/AsebGameMusic.mp3');
        this.load.audio('TextPop', 'Phaser/assets/audio/Egypt-Aseb/TextPop.mp3');
        this.load.audio('DialogueTextSFX', 'Phaser/assets/audio/Dialogues/DialogueTextSFX.mp3');
        this.load.audio('boxClickedSFX', 'Phaser/assets/audio/SelectionMenuScene/BoxClickedSFX.mp3');
    }

    

    /**
     * Loads all intro assets.
     */
    loadIntroAssets() {

         // loads the background
        this.load.image('IntroBackgroundPlaceholder', 'Phaser/assets/Intro/IntroBackgroundPlaceholder.jpeg');

        //Skip Button
        this.load.image('SkipButtonNormal', 'Phaser/assets/SkipButtonNormal.png');
        this.load.image('SkipButtonHovered', 'Phaser/assets/SkipButtonHovered.png');
        
        

        
    }

    /**
     * Loads all option menu assets.
     */
    loadOptionMenuAssets()
    {
        // Normal mode assets
        this.load.image('OptionMenuBase', 'Phaser/assets/OptionMenu/OptionMenuBase.png');
        this.load.image('ResumeButtonNormal', 'Phaser/assets/OptionMenu/ResumeNormal.png');
        this.load.image('ResumeButtonHovered', 'Phaser/assets/OptionMenu/ResumeHovered.png');
        this.load.image('HelpButtonNormal', 'Phaser/assets/OptionMenu/HelpNormal.png');
        this.load.image('HelpButtonHovered', 'Phaser/assets/OptionMenu/HelpHovered.png');
        this.load.image('ItemsButtonNormal', 'Phaser/assets/OptionMenu/ItemsNormal.png');
        this.load.image('ItemsButtonHovered', 'Phaser/assets/OptionMenu/ItemsHovered.png');
        this.load.image('ExitButtonNormal', 'Phaser/assets/OptionMenu/ExitNormal.png');
        this.load.image('ExitButtonHovered', 'Phaser/assets/OptionMenu/ExitHovered.png');
        this.load.image('SettingsIcon', 'Phaser/assets/OptionMenu/SettingsIcon.png');
        this.load.image('SettingsIconHovered', 'Phaser/assets/OptionMenu/SettingsIconHovered.png');
        
        // Timeboxed mode assets
        this.load.image('OptionMenuBaseTB', 'Phaser/assets/OptionMenu/TimeboxedMode/OptionMenuBase.png');
        this.load.image('ResumeButtonNormalTB', 'Phaser/assets/OptionMenu/TimeboxedMode/ResumeNormal.png');
        this.load.image('ResumeButtonHoveredTB', 'Phaser/assets/OptionMenu/TimeboxedMode/ResumeHovered.png');
        this.load.image('HelpButtonNormalTB', 'Phaser/assets/OptionMenu/TimeboxedMode/HelpNormal.png');
        this.load.image('HelpButtonHoveredTB', 'Phaser/assets/OptionMenu/TimeboxedMode/HelpHovered.png');
        this.load.image('ItemsButtonNormalTB', 'Phaser/assets/OptionMenu/TimeboxedMode/ItemsNormal.png');
        this.load.image('ItemsButtonHoveredTB', 'Phaser/assets/OptionMenu/TimeboxedMode/ItemsHovered.png');
        this.load.image('ExitButtonNormalTB', 'Phaser/assets/OptionMenu/TimeboxedMode/ExitNormal.png');
        this.load.image('ExitButtonHoveredTB', 'Phaser/assets/OptionMenu/TimeboxedMode/ExitHovered.png');
        this.load.image('SettingsIconTB', 'Phaser/assets/OptionMenu/TimeboxedMode/SettingsIcon.png');
        this.load.image('SettingsIconHoveredTB', 'Phaser/assets/OptionMenu/TimeboxedMode/SettingsIconHovered.png');

        // Settings Menu Assets
        this.load.image('SettingsBackButton', 'Phaser/assets/Settings/SettingsBackButton.png');
    }

    loadSelectionMenuAssets()
    {

        this.load.image('BoxClosed', 'Phaser/assets/SelectionMenu/BoxClosed.png');
        this.load.image('BackToStartNormal', 'Phaser/assets/SelectionMenu/BackToStartNormal.png');
        this.load.image('BackToStartHovered', 'Phaser/assets/SelectionMenu/BackToStartHovered.png');

    }

    /**
     * Loads all aseb assets.
     */
    loadAsebAssets() {
        this.load.image('asebVerticalBackground', 'Phaser/assets/SelectionMenu/EgyptVertical.png');

        this.load.image('asebBackgroundPlaceholder', 'Phaser/assets/aseb/Egipcio.png');

        this.load.image('StickBoard', 'Phaser/assets/aseb/stickBoard.png');
        this.load.image('AsebButton', 'Phaser/assets/aseb/AsebButton.png');
        this.load.image('AsebButtonHovered', 'Phaser/assets/aseb/AsebButtonHovered.png');
        this.load.image('AsebButtonDisabled', 'Phaser/assets/aseb/AsebButtonDisabled.png');
        this.load.image('StickLight', 'Phaser/assets/aseb/AsebStickLight.png');
        this.load.image('StickDark', 'Phaser/assets/aseb/AsebStickDark.png');

        this.load.image('asebBoard', 'Phaser/assets/aseb/AsebBoard.png');
        this.load.image('redPiece', 'Phaser/assets/aseb/redPiece.png');
        this.load.image('bluePiece', 'Phaser/assets/aseb/bluePiece.png');

        // Related to Aseb tutorial
        this.load.image('AsebTuto_AsebBoard', 'Phaser/assets/aseb/Tutorial/AsebTuto_AsebBoard.png');
        this.load.image('AsebTuto_ThrowingSticks', 'Phaser/assets/aseb/Tutorial/AsebTuto_ThrowingSticks.png');
        this.load.image('AsebTuto_SpecialSquares', 'Phaser/assets/aseb/Tutorial/AsebTuto_SpecialSquares.png');
        this.load.image('AsebTuto_SpecialSquares', 'Phaser/assets/aseb/Tutorial/AsebTuto_SpecialSquares.png');
        this.load.image('AsebTuto_KillingPieces', 'Phaser/assets/aseb/Tutorial/AsebTuto_KillingPieces.png');
        this.load.image('AsebTuto_ReachingEnd', 'Phaser/assets/aseb/Tutorial/AsebTuto_ReachingEnd.png');
        this.load.image('AsebTuto_Pieces', 'Phaser/assets/aseb/Tutorial/AsebTuto_Pieces.png');
        this.load.image('AsebTuto_Paths', 'Phaser/assets/aseb/Tutorial/AsebTuto_Paths.png');
        this.load.image('AsebTuto_HelpMenu', 'Phaser/assets/aseb/Tutorial/AsebTuto_HelpMenu.png');

        
    }

    /**
     * Loads all tali assets.
     */
    loadTaliAssets() {
        this.load.image('taliVerticalBackground', 'Phaser/assets/SelectionMenu/RomeVertical.png');

        this.load.image('taliButton', 'Phaser/assets/tali/button.png');

        this.load.image('taliBoard', 'Phaser/assets/tali/tali_board.png');
        for (let i = 0; i < Tali.NUMBER_OF_DICE; i++) {
            this.load.image('dice' + i, 'Phaser/assets/tali/dice' + i + '.png');
            this.load.image('dice_disabled' + i, 'Phaser/assets/tali/dice' + i + '_disabled.png');
        }
        for (let i = 0; i < Tali.DICE_THROW_NAMES.length; i++) {
            console.log(Tali.DICE_THROW_NAMES[i]);
            this.load.image(Tali.DICE_THROW_NAMES[i], 'Phaser/assets/tali/throw' + i + '.png');
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
        this.load.image('tempInsignia3', 'Phaser/assets/insignias/tempInsignia3.png');
        this.load.image('Underworld_Conqueror', 'Phaser/assets/insignias/Underworld_Conqueror.png');
        this.load.image('Square_Master', 'Phaser/assets/insignias/Square_Master.png');
        this.load.image('Wonder_of_Egypt', 'Phaser/assets/insignias/Wonder_of_Egypt.png');
        this.load.image('Dice_Ruler', 'Phaser/assets/insignias/Dice_Ruler.png');
        this.load.image('Master_of_Time', 'Phaser/assets/insignias/Master_of_Time.png');
        this.load.image('God_of_Time', 'Phaser/assets/insignias/God_of_Time.png');

    }

    loadDialogues() {
        /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('TaliDialogue', 'Phaser/DialoguesJson/TaliDialogue.json');

        /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('IntroDialogue', 'Phaser/DialoguesJson/IntroDialogue.json');

         /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebTutorialDialogue', 'Phaser/DialoguesJson/AsebTutorialDialogue.json');

        /** Load the json file for the Egypt/Aseb Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebIntroDialogue', 'Phaser/DialoguesJson/EgyptDialogue.json');

        /** Load the json file for the Aseb Defeat Dialogue, when the player loses. 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebDefeatDialogue', 'Phaser/DialoguesJson/AsebDefeatDialogue.json');

        /** Load the json file for the Aseb Winning Dialogue, when the player wins.
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebWinDialogue', 'Phaser/DialoguesJson/AsebWinDialogue.json');

        /** Load the json file for the Game Completed Dialogue, when the player completes the game.
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('GameCompletedDialogue', 'Phaser/DialoguesJson/GameCompletedDialogue.json');
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