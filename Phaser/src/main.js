import { Start } from './scenes/Start.js';
import { LoadingScene } from './scenes/LoadingScene.js';
import { SelectionMenuScene } from './scenes/SelectionMenuScene.js';
import { TaliScene } from './scenes/taliScenes/TaliScene.js';
import { TaliBeginScene } from './scenes/taliScenes/TaliBeginScene.js';
import { TaliEndScene } from './scenes/taliScenes/TaliEndScene.js';
import { AsebBeginScene } from './scenes/asebScenes/AsebBeginScene.js';
import { AsebScene } from './scenes/asebScenes/AsebScene.js';
import { HanafudaScene } from './scenes/HanafudaScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';
import { Intro } from './scenes/Intro.js';
import { AsebVictoryScene } from './scenes/asebScenes/AsebVictoryScene.js';
import { AsebDefeatScene } from './scenes/asebScenes/AsebDefeatScene.js';
import { PauseMenuScene } from './scenes/PauseMenuScene.js';
import { IntroAseb } from './scenes/asebScenes/IntroAseb.js';
import { OptionMenuScene } from './scenes/OptionMenuScene.js';


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
        OptionMenuScene,
        Start,
        LoadingScene,
        Intro,
        CreditsScene,
        SelectionMenuScene,
        IntroAseb,
        AsebScene,
        AsebBeginScene,
        AsebVictoryScene,
        AsebDefeatScene,
        TaliScene,
        TaliBeginScene,
        TaliEndScene,
        HanafudaScene,
        PauseMenuScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
