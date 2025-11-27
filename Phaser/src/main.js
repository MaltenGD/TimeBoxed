import { Start } from './scenes/Start.js';
import { LoadingScene } from './scenes/LoadingScene.js';
import { SelectionMenuScene } from './scenes/SelectionMenuScene.js';
import { TaliScene } from './scenes/taliScenes/TaliScene.js';
import { TaliBeginScene } from './scenes/taliScenes/TaliBeginScene.js';
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
import { HelpLobbyScene } from './scenes/HelpLobbyScene.js';
import { ItemsScene } from './scenes/ItemsScene.js';
import { TimeBoxedDefeat } from './scenes/TimeBoxedDefeat.js'
import { HanafudaBeginScene} from './scenes/HanafudaScenes/HanafudaBeginScene.js'
import { HanafudaGame} from './scenes/HanafudaScenes/HanafudaGame.js'
import { TutorialAseb } from './scenes/asebScenes/TutorialAseb.js';
import { TaliIntroScene } from './scenes/taliScenes/TaliIntroScene.js';
import { TaliTutorial } from './scenes/taliScenes/TaliTutorialScene.js';
import { GameModeSelectionScene } from './scenes/GameModeSelectionScene.js';
import { GameCompleted } from './scenes/GameCompleted.js';



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
        TaliEndScene,
        HanafudaBeginScene,
        HanafudaGame,
        TimeBoxedDefeat,
        GameCompleted,
        OptionMenuScene,
        ItemsScene,
        HelpLobbyScene,
        TaliTutorial,
        TutorialAseb,
        GameModeSelectionScene,
        ConfirmMenuScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
