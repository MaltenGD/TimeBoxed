export class HanafudaGame extends Phaser.Scene{
    constructor()
    {
        super('HanafudaGame')

        this.playerFirst = null;
    }

    init(data)
    {
        this.playerFirst = data.begins;
    }

    create() {
        this.playerData = playerData;
        console.log(this.playerData)

        this.input.keyboard.on('keydown-ESC', () => {
            this.openOptionMenu();
        });

        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackgroundPlaceholder');

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });

        this.width = this.scale.width;
        this.height = this.scale.height;

        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        this.playerPairs = [];
        this.enemyPairs = [];
        this.playerTurn = this.playerFirst === true; 
        console.log("Jugador empieza:", this.playerTurn);
        this.renderAllCards();
    }
        preload()
    {
        /** @type {number} */
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    createDeck() {
        this.deck = [];

        let number = 0;
        for (let month = 0; month < 12; month++) {
            for (let i = 0; i < 4; i++) {
                this.deck.push({
                    number,
                    month
                });
                number++;
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        this.playerCards = this.deck.splice(0, 8);
        this.enemyCards = this.deck.splice(0, 8);
        this.tableCards = this.deck.splice(0, 8);

        // Mesa no puede ser todo un mes
        const allSameMonth = this.tableCards.every(c => c.month === this.tableCards[0].month);
        if (allSameMonth) {
            this.deck.push(...this.playerCards, ...this.enemyCards, ...this.tableCards);
            this.shuffleDeck();
            this.dealCards();
        }
    }

    renderAllCards() {
        // Jugador
        this.playerCards.forEach((card, i) => {
            const rect = this.add.rectangle(200 + i * 120, this.height - 150, 100, 150, 0x3333aa)
                .setInteractive()
                .on("pointerdown", () => {
                    if (!this.playerTurn) return;
                    this.handlePlayerCard(card, i);
                });

            this.add.text(rect.x, rect.y, `${card.number}`, {
                fontSize: "28px",
                color: "#ffffff"
            }).setOrigin(0.5);
        });

        // Mesa
        this.tableCards.forEach((card, i) => {
            const rect = this.add.rectangle(200 + i * 120, this.height / 2, 100, 150, 0xaa3333);

            this.add.text(rect.x, rect.y, `${card.number}`, {
                fontSize: "28px",
                color: "#ffffff"
            }).setOrigin(0.5);
        });

        // Enemigo
        this.enemyCards.forEach((card, i) => {
            const rect = this.add.rectangle(200 + i * 120, 150, 100, 150, 0x444444);

            this.add.text(rect.x, rect.y, "??", {
                fontSize: "28px",
                color: "#ffffff"
            }).setOrigin(0.5);
        });
    }

    handlePlayerCard(card, index) {
        console.log("Jugador eligió:", card);

        // eliminar carta del array del jugador
        this.playerCards.splice(index, 1);

        this.playerTurn = false;
    }


    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.playerData.SceneToResume = this.scene.key;
            this.scene.launch('OptionMenu', this.playerData);
    }
}