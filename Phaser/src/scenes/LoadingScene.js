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
        this.loadCharacterAssets();
        
        this.load.json('achievements', 'Phaser/assets/jsonFiles/achievements.json');

        this.load.on('progress', (value) => {
        //console.log(value);
        progressBar.clear();
        progressBar.fillStyle(0xFFFFFF, 1);
        progressBar.fillRect(progressBoxPosX + 10, progressBoxPosY + 10, progressBarWidth * value, progressBarHeight);
        // the progress bar has to be 10 pixels to the right and down to be centered in side the progressBox

        percentageText.setText(Math.trunc(value * 100) + "%");
        });
                
        this.load.on('fileprogress', (file) => {
            //console.log(file.src);
            loadingInfo.setText("Loading: " + file.key +"\nFrom: " + file.src);
        });
        this.load.on('complete', () => {
            //console.log('complete');

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
        this.load.image('background', 'Phaser/assets/startMenu/MainBackground.png');
        this.load.image('backgroundTB', 'Phaser/assets/startMenu/MainBackgroundTimeboxedMode.png');
        this.load.image('TaliBackground', 'Phaser/assets/tali/TaliBackground.png');
        this.load.image('StartMenuKronos', 'Phaser/assets/startMenu/bigKronos.png');
        this.load.image('Timepiece', 'Phaser/assets/startMenu/timePiece.png');
        this.load.image('BoxOpen', 'Phaser/assets/startMenu/cardboardbox.png')
        
        //Timeboxed Logo
        this.load.image('T', 'Phaser/assets/startMenu/TimeboxedTitle/T.png');  
        this.load.image('I', 'Phaser/assets/startMenu/TimeboxedTitle/I.png');  
        this.load.image('M', 'Phaser/assets/startMenu/TimeboxedTitle/M.png');  
        this.load.image('E', 'Phaser/assets/startMenu/TimeboxedTitle/FirstE.png');
        this.load.image('B', 'Phaser/assets/startMenu/TimeboxedTitle/B.png');  
        this.load.image('O', 'Phaser/assets/startMenu/TimeboxedTitle/O.png');  
        this.load.image('X', 'Phaser/assets/startMenu/TimeboxedTitle/X.png');  
        this.load.image('E2', 'Phaser/assets/startMenu/TimeboxedTitle/SecondE.png');  
        this.load.image('D', 'Phaser/assets/startMenu/TimeboxedTitle/D.png');     

        this.load.image('creditsButton', 'Phaser/assets/startMenu/creditsButton.png');
        this.load.image('teamLogo', 'Phaser/assets/startMenu/teamLogo.png');
        this.load.json('playerData', 'Phaser/assets/jsonFiles/playerData.json');
        this.load.image('playButtonS', 'Phaser/assets/startMenu/StartButtonS.png');
        this.load.image('playButtonT', 'Phaser/assets/startMenu/StartButtonT.png');
        this.load.image('playButtonA', 'Phaser/assets/startMenu/StartButtonA.png');
        this.load.image('playButtonR', 'Phaser/assets/startMenu/StartButtonR.png');
        this.load.image('playButtonT2', 'Phaser/assets/startMenu/StartButtonT2.png');
        this.load.image('StartMenuSettings', 'Phaser/assets/startMenu/StartMenuSettings.png');

        this.load.image('playButtonSHovered', 'Phaser/assets/startMenu/StartButtonSHovered.png');
        this.load.image('playButtonTHovered', 'Phaser/assets/startMenu/StartButtonTHovered.png');
        this.load.image('playButtonAHovered', 'Phaser/assets/startMenu/StartButtonAHovered.png');
        this.load.image('playButtonRHovered', 'Phaser/assets/startMenu/StartButtonRHovered.png');
        this.load.image('playButtonT2Hovered', 'Phaser/assets/startMenu/StartButtonT2Hovered.png');
        this.load.image('StartMenuSettingsHovered', 'Phaser/assets/startMenu/StartMenuSettingsHovered.png');


    }

    loadAudioAssets()
    {
        // Audio comun, que es usado en varias escenas
        this.load.audio('startMenuMusic', 'Phaser/assets/audio/mainmenuScene/Floating Beyond.mp3');
        this.load.audio('buttonHover', 'Phaser/assets/audio/Buttons/ButtonHover.wav');
        this.load.audio('DialogueTextSFX', 'Phaser/assets/audio/Dialogues/DialogueTextSFX.mp3');
        this.load.audio('boxClickedSFX', 'Phaser/assets/audio/SelectionMenuScene/BoxClickedSFX.mp3');
        this.load.audio('TextPop', 'Phaser/assets/audio/Egypt-Aseb/TextPop.mp3');

        //TimeboxedDefeat
        this.load.audio('Emptyness', 'Phaser/assets/audio/TimeboxedDefeat/Emptyness.mp3');
        

        // Musica
        this.load.audio('HappyNeighborhood', 'Phaser/assets/audio/intro/HappyNeighborhood.mp3')
        this.load.audio('ChooseYourEra', 'Phaser/assets/audio/SelectionMenuScene/ChooseYourEra.mp3')
        this.load.audio('egyptMusic', 'Phaser/assets/audio/Egypt-Aseb/AsebIntroMusic.mp3');
        this.load.audio('CreepyegyptMusic', 'Phaser/assets/audio/Egypt-Aseb/AsebDefeatMusic.mp3');
        this.load.audio('AsebMusic', 'Phaser/assets/audio/Egypt-Aseb/AsebGameMusic.mp3');
        this.load.audio('japaneseMusic', 'Phaser/assets/audio/JapaneseHanafuda/japanese.mp3');
    }

    /**
     * Loads all intro assets.
     */
    loadIntroAssets() {
         // loads the background
        this.load.image('IntroBackground', 'Phaser/assets/intro/IntroBackground.png');

        //Skip Button
        this.load.image('SkipButtonNormal', 'Phaser/assets/buttons/SkipButtonNormal.png');
        this.load.image('SkipButtonHovered', 'Phaser/assets/buttons/SkipButtonHovered.png');

        //Pause Button
        this.load.image('PauseButtonNormal', 'Phaser/assets/buttons/PauseButtonNormal.png');
        this.load.image('PauseButtonHovered', 'Phaser/assets/buttons/PauseButtonHovered.png');
    }

    /**
     * Loads all option menu assets.
     */
    loadOptionMenuAssets()
    {
        // Normal mode assets
        this.load.image('OptionMenuBase', 'Phaser/assets/optionMenu/OptionMenuBase.png');
        this.load.image('ResumeButtonNormal', 'Phaser/assets/optionMenu/ResumeNormal.png');
        this.load.image('ResumeButtonHovered', 'Phaser/assets/optionMenu/ResumeHovered.png');
        this.load.image('HelpButtonNormal', 'Phaser/assets/optionMenu/HelpNormal.png');
        this.load.image('HelpButtonHovered', 'Phaser/assets/optionMenu/HelpHovered.png');
        this.load.image('ItemsButtonNormal', 'Phaser/assets/optionMenu/ItemsNormal.png');
        this.load.image('ItemsButtonHovered', 'Phaser/assets/optionMenu/ItemsHovered.png');
        this.load.image('ExitButtonNormal', 'Phaser/assets/optionMenu/ExitNormal.png');
        this.load.image('ExitButtonHovered', 'Phaser/assets/optionMenu/ExitHovered.png');
        this.load.image('SettingsIcon', 'Phaser/assets/optionMenu/SettingsIcon.png');
        this.load.image('SettingsIconHovered', 'Phaser/assets/optionMenu/SettingsIconHovered.png');
        
        // Timeboxed mode assets
        this.load.image('OptionMenuBaseTB', 'Phaser/assets/optionMenu/TimeboxedMode/OptionMenuBase.png');
        this.load.image('ResumeButtonNormalTB', 'Phaser/assets/optionMenu/TimeboxedMode/ResumeNormal.png');
        this.load.image('ResumeButtonHoveredTB', 'Phaser/assets/optionMenu/TimeboxedMode/ResumeHovered.png');
        this.load.image('HelpButtonNormalTB', 'Phaser/assets/optionMenu/TimeboxedMode/HelpNormal.png');
        this.load.image('HelpButtonHoveredTB', 'Phaser/assets/optionMenu/TimeboxedMode/HelpHovered.png');
        this.load.image('ItemsButtonNormalTB', 'Phaser/assets/optionMenu/TimeboxedMode/ItemsNormal.png');
        this.load.image('ItemsButtonHoveredTB', 'Phaser/assets/optionMenu/TimeboxedMode/ItemsHovered.png');
        this.load.image('ExitButtonNormalTB', 'Phaser/assets/optionMenu/TimeboxedMode/ExitNormal.png');
        this.load.image('ExitButtonHoveredTB', 'Phaser/assets/optionMenu/TimeboxedMode/ExitHovered.png');
        this.load.image('SettingsIconTB', 'Phaser/assets/optionMenu/TimeboxedMode/SettingsIcon.png');
        this.load.image('SettingsIconHoveredTB', 'Phaser/assets/optionMenu/TimeboxedMode/SettingsIconHovered.png');

        // Settings Menu Assets
        this.load.image('SettingsBackButton', 'Phaser/assets/settings/SettingsBackButton.png');
    }

    loadSelectionMenuAssets()
    {

        this.load.image('BoxClosed', 'Phaser/assets/selectionMenu/BoxClosed.png');
        this.load.image('BackToStartNormal', 'Phaser/assets/selectionMenu/BackToStartNormal.png');
        this.load.image('BackToStartHovered', 'Phaser/assets/selectionMenu/BackToStartHovered.png');

    }

    /**
     * Loads all aseb assets.
     */
    loadAsebAssets() {
        this.load.image('asebVerticalBackground', 'Phaser/assets/selectionMenu/EgyptVertical.png');
        this.load.image('asebVerticalBackgroundHovered', 'Phaser/assets/selectionMenu/EgyptVerticalHovered.png');

        this.load.image('asebBackground', 'Phaser/assets/aseb/AsebBackground.png');

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
        this.load.image('taliVerticalBackground', 'Phaser/assets/selectionMenu/RomeVertical.png');
        this.load.image('taliVerticalBackgroundHovered', 'Phaser/assets/selectionMenu/RomeVerticalHovered.png');

        this.load.image('taliButton', 'Phaser/assets/tali/button.png');

        this.load.image('taliBoard', 'Phaser/assets/tali/tali_board.png');
        for (let i = 0; i < Tali.NUMBER_OF_DICE; i++) {
            this.load.image('dice' + i, 'Phaser/assets/tali/dice' + i + '.png');
            this.load.image('dice_disabled' + i, 'Phaser/assets/tali/dice' + i + '_disabled.png');
        }
        for (let i = 0; i < Tali.DICE_THROW_NAMES.length; i++) {
            this.load.image(Tali.DICE_THROW_NAMES[i], 'Phaser/assets/tali/throw' + i + '.png');
        }

        this.load.image('TaliCombinations', 'Phaser/assets/tali/taliCombinations.png');


        // Tutorial images
        this.load.image('TT3', 'Phaser/assets/tali/TutorialImages/TT3.png');
        this.load.image('TT4', 'Phaser/assets/tali/TutorialImages/TT4.png');
        this.load.image('TT5', 'Phaser/assets/tali/TutorialImages/TT5.png');
        this.load.image('TT7', 'Phaser/assets/tali/TutorialImages/TT7.png');
        this.load.image('TT8', 'Phaser/assets/tali/TutorialImages/TT8.png');
        this.load.image('TT9', 'Phaser/assets/tali/TutorialImages/TT9.png');
        this.load.image('TT10', 'Phaser/assets/tali/TutorialImages/TT10.png');
        this.load.image('TT11', 'Phaser/assets/tali/TutorialImages/TT11.png');
        this.load.image('TT12-2', 'Phaser/assets/tali/TutorialImages/TT12-2.png');
        this.load.image('TT16', 'Phaser/assets/tali/TutorialImages/TT16.png');
        this.load.image('TT17', 'Phaser/assets/tali/TutorialImages/TT17.png');

        // Audios
        this.load.audio('taliIntroMusic', 'Phaser/assets/audio/Tali/TaliIntroMusic.mp3');
        this.load.audio('taliGameMusic', 'Phaser/assets/audio/Tali/TaliGameMusic.mp3');
    }

    loadHanafudaAssets()
    {
        this.load.image('japanVerticalBackground', 'Phaser/assets/selectionMenu/JapanVertical.png')
        this.load.image('japanVerticalBackgroundHovered', 'Phaser/assets/selectionMenu/JapanVerticalHovered.png')
        this.load.image('HanafudaBackground', 'Phaser/assets/hanafuda/HanafudaBackground.png');
        this.load.image('YakusHoverButton', 'Phaser/assets/hanafuda/UI/YakusNormalButton.png');
        this.load.image('YakusNormalButton', 'Phaser/assets/hanafuda/UI/YakusHoverButton.png');
        this.load.image('BackHoverButton', 'Phaser/assets/hanafuda/UI/BackNormalButton.png');
        this.load.image('BackNormalButton', 'Phaser/assets/hanafuda/UI/BackHoverButton.png');

        this.load.image('Card0', 'Phaser/assets/hanafuda/HanafudaCards/0.png');
        this.load.image('Card1', 'Phaser/assets/hanafuda/HanafudaCards/1.png');
        this.load.image('Card2', 'Phaser/assets/hanafuda/HanafudaCards/2.png');
        this.load.image('Card3', 'Phaser/assets/hanafuda/HanafudaCards/3.png');
        this.load.image('Card4', 'Phaser/assets/hanafuda/HanafudaCards/4.png');
        this.load.image('Card5', 'Phaser/assets/hanafuda/HanafudaCards/5.png');
        this.load.image('Card6', 'Phaser/assets/hanafuda/HanafudaCards/6.png');
        this.load.image('Card7', 'Phaser/assets/hanafuda/HanafudaCards/7.png');
        this.load.image('Card8', 'Phaser/assets/hanafuda/HanafudaCards/8.png');
        this.load.image('Card9', 'Phaser/assets/hanafuda/HanafudaCards/9.png');
        this.load.image('Card10', 'Phaser/assets/hanafuda/HanafudaCards/10.png');
        this.load.image('Card11', 'Phaser/assets/hanafuda/HanafudaCards/11.png');
        this.load.image('Card12', 'Phaser/assets/hanafuda/HanafudaCards/12.png');
        this.load.image('Card13', 'Phaser/assets/hanafuda/HanafudaCards/13.png');
        this.load.image('Card14', 'Phaser/assets/hanafuda/HanafudaCards/14.png');
        this.load.image('Card15', 'Phaser/assets/hanafuda/HanafudaCards/15.png');
        this.load.image('Card16', 'Phaser/assets/hanafuda/HanafudaCards/16.png');
        this.load.image('Card17', 'Phaser/assets/hanafuda/HanafudaCards/17.png');
        this.load.image('Card18', 'Phaser/assets/hanafuda/HanafudaCards/18.png');
        this.load.image('Card19', 'Phaser/assets/hanafuda/HanafudaCards/19.png');
        this.load.image('Card20', 'Phaser/assets/hanafuda/HanafudaCards/20.png');
        this.load.image('Card21', 'Phaser/assets/hanafuda/HanafudaCards/21.png');
        this.load.image('Card22', 'Phaser/assets/hanafuda/HanafudaCards/22.png');
        this.load.image('Card23', 'Phaser/assets/hanafuda/HanafudaCards/23.png');
        this.load.image('Card24', 'Phaser/assets/hanafuda/HanafudaCards/24.png');
        this.load.image('Card25', 'Phaser/assets/hanafuda/HanafudaCards/25.png');
        this.load.image('Card26', 'Phaser/assets/hanafuda/HanafudaCards/26.png');
        this.load.image('Card27', 'Phaser/assets/hanafuda/HanafudaCards/27.png');
        this.load.image('Card28', 'Phaser/assets/hanafuda/HanafudaCards/28.png');
        this.load.image('Card29', 'Phaser/assets/hanafuda/HanafudaCards/29.png');
        this.load.image('Card30', 'Phaser/assets/hanafuda/HanafudaCards/30.png');
        this.load.image('Card31', 'Phaser/assets/hanafuda/HanafudaCards/31.png');
        this.load.image('Card32', 'Phaser/assets/hanafuda/HanafudaCards/32.png');
        this.load.image('Card33', 'Phaser/assets/hanafuda/HanafudaCards/33.png');
        this.load.image('Card34', 'Phaser/assets/hanafuda/HanafudaCards/34.png');
        this.load.image('Card35', 'Phaser/assets/hanafuda/HanafudaCards/35.png');
        this.load.image('Card36', 'Phaser/assets/hanafuda/HanafudaCards/36.png');
        this.load.image('Card37', 'Phaser/assets/hanafuda/HanafudaCards/37.png');
        this.load.image('Card38', 'Phaser/assets/hanafuda/HanafudaCards/38.png');
        this.load.image('Card39', 'Phaser/assets/hanafuda/HanafudaCards/39.png');
        this.load.image('Card40', 'Phaser/assets/hanafuda/HanafudaCards/40.png');
        this.load.image('Card41', 'Phaser/assets/hanafuda/HanafudaCards/41.png');
        this.load.image('Card42', 'Phaser/assets/hanafuda/HanafudaCards/42.png');
        this.load.image('Card43', 'Phaser/assets/hanafuda/HanafudaCards/43.png');
        this.load.image('Card44', 'Phaser/assets/hanafuda/HanafudaCards/44.png');
        this.load.image('Card45', 'Phaser/assets/hanafuda/HanafudaCards/45.png');
        this.load.image('Card46', 'Phaser/assets/hanafuda/HanafudaCards/46.png');
        this.load.image('Card47', 'Phaser/assets/hanafuda/HanafudaCards/47.png');

        this.load.image('TutorialCardGroup','Phaser/assets/hanafuda/Tutorial/TutorialCardGroup.png')
        this.load.image('TutorialChooseCard','Phaser/assets/hanafuda/Tutorial/TutorialChooseCard.png')
        this.load.image('TutorialCombination', 'Phaser/assets/hanafuda/Tutorial/TutorialCombination.png');
        this.load.image('Decision', 'Phaser/assets/hanafuda/Tutorial/Decision.png');
        this.load.image('Help', 'Phaser/assets/hanafuda/Tutorial/Help.png');
        this.load.image('MatchCard', 'Phaser/assets/hanafuda/Tutorial/MatchCard.png');
        this.load.image('TutorialTablero', 'Phaser/assets/hanafuda/Tutorial/TutorialTablero.png');
        this.load.image('YakuMenu', 'Phaser/assets/hanafuda/Tutorial/YakuMenu.png');
        
    }

    loadCreditsAssets() {
        this.load.image('member1', 'Phaser/assets/creditsMenu/mewingCat.jpg');
        this.load.image('member2', 'Phaser/assets/creditsMenu/oreoCat.jpg');
        this.load.image('member3', 'Phaser/assets/creditsMenu/alienCat.jpg');
        this.load.image('member4', 'Phaser/assets/creditsMenu/awkwarCat.jpg');
    }

    loadInisgniaAssets() {
        this.load.image('Card_God', 'Phaser/assets/insignias/Card_God.png');
        this.load.image('Underworld_Conqueror', 'Phaser/assets/insignias/Underworld_Conqueror.png');
        this.load.image('Square_Master', 'Phaser/assets/insignias/Square_Master.png');
        this.load.image('Wonder_of_Egypt', 'Phaser/assets/insignias/Wonder_of_Egypt.png');
        this.load.image('Dice_Ruler', 'Phaser/assets/insignias/Dice_Ruler.png');
        this.load.image('Master_of_Time', 'Phaser/assets/insignias/Master_of_Time.png');
        this.load.image('God_of_Time', 'Phaser/assets/insignias/God_of_Time.png');
        this.load.image('Stealthy_Kitty', 'Phaser/assets/insignias/Stealthy_Kitty.png');

    }

    loadDialogues() {
        /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('TaliDialogue', 'Phaser/assets/dialoguesJson/TaliDialogue.json');

        /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('IntroDialogue', 'Phaser/assets/dialoguesJson/IntroDialogue.json');

         /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebTutorialDialogue', 'Phaser/assets/dialoguesJson/AsebTutorialDialogue.json');

        /** Load the json file for the Egypt/Aseb Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebIntroDialogue', 'Phaser/assets/dialoguesJson/EgyptDialogue.json');

        /** Load the json file for the Aseb Defeat Dialogue, when the player loses. 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebDefeatDialogue', 'Phaser/assets/dialoguesJson/AsebDefeatDialogue.json');

        /** Load the json file for the Aseb Winning Dialogue, when the player wins.
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebWinDialogue', 'Phaser/assets/dialoguesJson/AsebWinDialogue.json');

        this.load.json('HanafudaTutorialDialogue', 'Phaser/assets/dialoguesJson/HanafudaTutorialDialogue.json');

        /** Load the json file for the hanafuda intro Dialogue, before hanafuda game starts.
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('HanafudaIntroDialogue', 'Phaser/assets/dialoguesJson/HanafudaDialogues/HanafudaIntroDialogue.json');

        /** Load the json file for the hanafuda Win Dialogue, When player wins hanafuda.
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('HanafudaWinDialogue', 'Phaser/assets/dialoguesJson/HanafudaDialogues/HanafudaWinDialogue.json');

        /** Load the json file for the hanafuda defeat Dialogue, When player is defeated in hanafuda.
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('HanafudaDefeatDialogue', 'Phaser/assets/dialoguesJson/HanafudaDialogues/HanafudaDefeatDialogue.json');

        /** Load the json file for the Game Completed Dialogue, when the player completes the game.
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('GameCompletedDialogue', 'Phaser/assets/dialoguesJson/GameCompletedDialogue.json');
    }

    loadCharacterAssets() {
        this.load.spritesheet("anubis", "Phaser/assets/spritesheets/anubisSpritesheet.png", {frameWidth: 403, frameHeight: 825});
        this.load.spritesheet("benten", "Phaser/assets/spritesheets/bentenSpritesheet.png", {frameWidth: 551, frameHeight: 886});
        this.load.spritesheet("emotes", "Phaser/assets/spritesheets/emotesSpritesheet.png", {frameWidth: 186, frameHeight: 149});
        this.load.spritesheet("kronos", "Phaser/assets/spritesheets/kronosSpritesheet.png", {frameWidth: 431, frameHeight: 821});
        this.load.spritesheet("mercury", "Phaser/assets/spritesheets/mercurySpritesheet.png", {frameWidth: 488, frameHeight: 504});
        this.load.spritesheet("protagonist", "Phaser/assets/spritesheets/protagonistSpritesheet.png", {frameWidth: 335, frameHeight: 614});
        this.load.image("yarn_ball", 'Phaser/assets/spritesheets/yarn_ball.png');
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