import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";
import { BaseScene } from "./BaseScene.js";
export class CreditsScene extends BaseScene {
    constructor() {
        super('CreditsScene');
    }

    preload() {

    }

    create(playerData) {

        this.playerData = playerData;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        const { width, height } = this.sys.game.canvas;

        this.cameras.main.setBackgroundColor('#000000');

        /**
         * CREDITS text
         */
        this.add.text(width / 2, 120, 'C R É D I T O S', {
            fontSize: '48px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        /**
         * Team name
         */
        this.add.text(width / 2, 180, 'POPCAT\nTimeboxed:', {
            fontSize:'28px',
            fill: '#ffffff',
            align:'center'
        } ).setOrigin(0.5);

        /**
         * Team member data
         */
         const members = [
            { name: 'Oliver', title: 'Krono Lover', image: 'member1' },
            { name: 'Sarahi', title: 'Nr 1 Krono Hater', image: 'member2' },
            { name: 'Zhiyi', title: 'Code Overlord', image: 'member3' },
            { name: 'Alexandra', title: 'Time Keeper', image: 'member4' }
        ];

        const imageWidth = 150;
        const imageHeight = 150;
        const spacingX = 220;
        const startX = width / 2 - ((members.length - 1) * spacingX) / 2;
        const y = height / 2;

        members.forEach((member, i) => {

            const x = startX + i * spacingX;

            this.add.text(x, y - imageHeight / 2 - 10, member.name, {
                fontSize: '22px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            const img = this.add.image(x, y, member.image).setOrigin(0.5);
            img.displayWidth = imageWidth;
            img.displayHeight = imageHeight;

            this.add.text(x, y + imageHeight / 2 + 25, member.title, {
                fontSize: '18px',
                fill: '#aaaaaa',
                fontStyle: 'italic'
            }).setOrigin(0.5);
        });

        /**
         * Back botton
         */
        const backBtn = this.add.text(width / 2, height / 2 + 250, 'Volver al Inicio', {
            fontSize: '36px',
            fill: '#000000',
            backgroundColor: '#FFFFFF',
            padding: { x: 30, y: 15 }
        })
        .setOrigin(0.5)
        .setInteractive()
        
        .on('pointerover', () => backBtn.setStyle({ backgroundColor: '#e6e6e6' }))
        .on('pointerout', () => backBtn.setStyle({ backgroundColor: '#FFFFFF' }))
        .on('pointerdown', () => {
            this.scene.start('Start', this.playerData);
        });
    }
}
