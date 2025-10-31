import { Start } from './scenes/Start.js';
import { SelectionMenuScene } from './scenes/SelectionMenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { TaliScene } from './scenes/taliScenes/TaliScene.js';
import { TaliBeginScene } from './scenes/taliScenes/TaliBeginScene.js';
import { AsebBeginScene } from './scenes/asebScenes/AsebBeginScene.js';
import { AsebScene } from './scenes/asebScenes/AsebScene.js';
import { HanafudaScene } from './scenes/HanafudaScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';
import { Intro } from './scenes/Intro.js';


const config = {
    type: Phaser.CANVAS,
    title: 'Timeboxed',
    description: '',
    parent: 'game-container',
    width: 1920,
    height: 1080,
    backgroundColor: '#000000',
    pixelArt: false,
<<<<<<< Updated upstream
    scene: [
        Start,
=======
    scene: 
    [
        Start,
        Intro,
        CreditsScene,
>>>>>>> Stashed changes
        SelectionMenuScene,
        AsebScene,
        AsebBeginScene,
        TaliBeginScene,
        DialogTestingScene,
        CreditsScene,
        GameScene,
        TaliScene,
        HanafudaScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
