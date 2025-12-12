import { Start } from './scenes/Start.js';
import { LoadingScene } from './scenes/LoadingScene.js';
import { SelectionMenuScene } from './scenes/SelectionMenuScene.js';
import { TaliScene } from './scenes/taliScenes/TaliScene.js';
import { TaliBeginScene } from './scenes/taliScenes/TaliBeginScene.js';
import { DistractMercuryScene } from './scenes/taliScenes/DistractMercuryScene.js';
import { CombinatinMenu } from './scenes/taliScenes/CombinationMenu.js';
import { TaliEndScene } from './scenes/taliScenes/TaliEndScene.js';
import { AsebBeginScene } from './scenes/asebScenes/AsebBeginScene.js';
import { AsebScene } from './scenes/asebScenes/AsebScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';
import { Intro } from './scenes/Intro.js';
import { AsebVictoryScene } from './scenes/asebScenes/AsebVictoryScene.js';
import { AsebDefeatScene } from './scenes/asebScenes/AsebDefeatScene.js';
import { ConfirmMenuScene } from './scenes/ConfirmMenuScene.js';
import { IntroAseb } from './scenes/asebScenes/IntroAseb.js';
import { OptionMenuScene } from './scenes/OptionMenuScene.js';
import { YakusMenu } from './scenes/HanafudaScenes/YakusMenu.js';
import { HelpLobbyScene } from './scenes/HelpLobbyScene.js';
import { ItemsScene } from './scenes/ItemsScene.js';
import { AchievementPanelScene } from './scenes/AchievementPanel.js';

import { TimeBoxedDefeat } from './scenes/TimeBoxedDefeat.js';

import { HanafudaIntro } from './scenes/HanafudaScenes/HanafudaIntroScene.js'; 
import { HanafudaBeginScene} from './scenes/HanafudaScenes/HanafudaBeginScene.js';
import { HanafudaGameState} from './scenes/HanafudaScenes/HanafudaGameState.js';
import { HanafudaEndScene } from './scenes/HanafudaScenes/HanafudaEndScene.js';

import { TutorialAseb } from './scenes/asebScenes/TutorialAseb.js';
import { TaliIntroScene } from './scenes/taliScenes/TaliIntroScene.js';
import { TaliTutorial } from './scenes/taliScenes/TaliTutorialScene.js';
import { TutorialHanafuda } from './scenes/HanafudaScenes/TutorialHanafuda.js';
import { GameModeSelectionScene } from './scenes/GameModeSelectionScene.js';
import { GameCompleted } from './scenes/GameCompleted.js';
import { BaseScene } from './scenes/BaseScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';


const config = {
    type: Phaser.CANVAS,
    title: 'Timeboxed',
    description: '',
    parent: 'game-container',
    width: 1920,
    height: 1080,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: 
    [
        LoadingScene,
        BaseScene,
        Start,
        Intro,
        CreditsScene,
        SelectionMenuScene,
        IntroAseb,
        AsebScene,
        AsebBeginScene,
        AsebVictoryScene,
        AsebDefeatScene,
        TaliScene,
        TaliIntroScene,
        TaliBeginScene,
        CombinatinMenu,
        DistractMercuryScene,
        TaliEndScene,
        HanafudaIntro,
        HanafudaBeginScene,
        HanafudaGameState,
        HanafudaEndScene,
        TimeBoxedDefeat,
        GameCompleted,
        OptionMenuScene,
        YakusMenu,
        ItemsScene,
        AchievementPanelScene,
        HelpLobbyScene,
        TaliTutorial,
        TutorialAseb,
        TutorialHanafuda,
        GameModeSelectionScene,
        SettingsScene,
        ConfirmMenuScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
