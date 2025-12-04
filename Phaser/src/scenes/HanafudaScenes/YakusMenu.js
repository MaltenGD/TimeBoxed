export class YakusMenu extends Phaser.Scene {
    constructor() {
        super('YakusMenu');
    }

    init(data) {
        this.playerData = data;
        this.cacheKeys = [];
    }

    preload() {

    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.panelWidth = 420;
        this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5)
            .setOrigin(0, 0)
            .setInteractive()
            .setDepth(4)
            .on('pointerdown', () => this.closeMenu());

        this.panel = this.add.graphics();
        this.panel.fillStyle(0x111111, 0.95);
        this.panel.fillRect(0, 0, this.panelWidth, height);
        this.panel.x = -this.panelWidth;
        this.panel.y = 0;
        this.panel.setDepth(5);

        this.title = this.add.text(-this.panelWidth + 20, 30, "Combinations (Yakus)", {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setDepth(6);

        this.container = this.add.container(-this.panelWidth, 100).setDepth(6);

        const maskShape = this.add.graphics();
        maskShape.fillRect(0, 0, this.panelWidth - 20, height - 140);
        maskShape.x = 0;
        maskShape.y = 0;
        maskShape.setVisible(false);
        
        const mask = new Phaser.Display.Masks.GeometryMask(this, maskShape);
        this.container.setMask(mask);
        const yakus = [
            { 
                name: "Ryujin", 
                points: "4 points",
                cards: ["4 cartas del mismo mes"] 
            },
            { 
                name: "Tane", 
                points: "3 points",
                cards: ["5 cartas con simbolo especial"] 
            },
            { 
                name: "Kajin", 
                points: "3 points",
                cards: ["3 cartas con cinta"] 
            },

            { 
                name: "Doujin", 
                points: "2 points",
                cards: ["3 cartas de 3 meses diferentes que forman una estación"] 
            },
            { 
                name: "Fujin", 
                points: "2 points ",
                cards: ["12 cartas básicas (sin símbolo ni cinta)"] 
            }
        ];

        let y = 0;

        yakus.forEach((yaku, index) => {
            const bg = this.add.graphics();
            bg.fillStyle(0x222222, 0.7);
            bg.fillRect(10, y, this.panelWidth - 30, 110);
            this.container.add(bg);
            const nameText = this.add.text(20, y + 10, yaku.name, {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold',
                wordWrap: { width: this.panelWidth - 50 }
            });
            this.container.add(nameText);
            const pointsText = this.add.text(20, y + 45, yaku.points, {
                fontSize: '18px',
                color: '#0077ffff'
            });
            this.container.add(pointsText);
            const cardsText = this.add.text(20, y + 75, yaku.cards.join(', '), {
                fontSize: '16px',
                color: '#cccccc',
                wordWrap: { width: this.panelWidth - 50 }
            });
            this.container.add(cardsText);

            y += 150;
        });

        this.containerHeight = y;

        this.tweens.add({
            targets: this.panel,
            x: 0,
            duration: 350,
            ease: 'Cubic.easeOut'
        });

        this.tweens.add({
            targets: this.title,
            x: 20,
            duration: 350,
            ease: 'Cubic.easeOut'
        });

        this.tweens.add({
            targets: this.container,
            x: 20,
            duration: 350,
            ease: 'Cubic.easeOut'
        });
        this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
            this.container.y += deltaY * 0.5;

            const maxScroll = Math.max(0, this.containerHeight - (height - 140));
            this.container.y = Phaser.Math.Clamp(this.container.y, -maxScroll, 100);
        });
    }

    closeMenu() {

        this.tweens.add({
            targets: [this.panel, this.title, this.container, this.closeBtn],
            x: -this.panelWidth,
            duration: 350,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                if (this.playerData && this.playerData.sceneToResume) {
                    this.scene.resume(this.playerData.sceneToResume);
                }
                this.scene.stop();
            }
        });
    }
}