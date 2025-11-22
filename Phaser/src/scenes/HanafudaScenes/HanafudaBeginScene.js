
export class HanafudaBeginScene extends Phaser.Scene 
{
    constructor()
    {
        super('HanafudaBeginScene');
        this.playerBegins = false;
        this.playerCard = null;
        this.oponentcard = null;
        this.mazo = [];
        this.cardContainers = [];
        this.infoText; 
    }

    preload() {
        /** @type {number} */
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    create(playerData)
    {   

        this.playerData = playerData;
        console.log(this.playerData)

        this.input.keyboard.on('keydown-ESC', () => {
             this.openOptionMenu()
        });

        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackgroundPlaceholder');

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });

        const totalCards = 48;
        const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        let monthCount = 0;
        
        //Fill mazo array
        for (let i = 0; i < totalCards; ++i)
        {
            monthCount = Math.floor(i / 4);

            const newCard = {number: i, month: months[monthCount]};
            
            this.mazo.push(newCard);
        }


        //Mix cards
        let aux1;
        for (let i = 0; i < totalCards; ++i)
        {
            let randomNumber = Math.floor(Math.random() * totalCards)
            
            aux1 = this.mazo[i];
            this.mazo[i] = this.mazo[randomNumber];
            this.mazo[randomNumber] = aux1;
        }

        console.log(this.mazo);

        let cardGap = 110;
        let centerX = this.width/2;
        let centerY = this.height/2;
        const finalPositions = 
        [
            { x: centerX - cardGap* 3, y: centerY -100},
            { x: centerX - cardGap*2, y: centerY -100 },
            { x: centerX - cardGap, y: centerY -100 },
            { x: centerX, y: centerY -100 },
            { x: centerX + cardGap, y: centerY -100 },
            { x: centerX + cardGap * 2, y: centerY -100 },
            { x: centerX + cardGap * 3, y: centerY -100 },
            { x: centerX + cardGap * 4, y: centerY-100 },
        ];

        for(let i = 0; i < 8; ++i)
        {
            const cardContainer = this.createCards(finalPositions[i].x, finalPositions[i].y, `${this.mazo[i].number}`, this.mazo[i]);
            this.cardContainers.push(cardContainer);
        }

        this.infoText = this.add.text(this.width / 2, this.height / 2 - 200, "Choose a card", {
            fontSize: '30px', fill: '#000000'
        }).setOrigin(0.5);

        this.events.on("cardSelected", this.onCardSelected, this);
    }

    createCards(x, y, textContent, card) 
    {
        const BOX_WIDTH = 90;
        const BOX_HEIGHT = 150;
    
        // Create children at (0,0) as their positions are relative to the container
        const backgroundCard = this.add.rectangle(0, 0, BOX_WIDTH, BOX_HEIGHT, 0xffffff);
    
        const text = this.add.text(0, 0,textContent,
        {   fontSize: '30px',
            fill: '#000000',
            align: 'center'
        })
        .setOrigin(0.5);
    
        const container = this.add.container(x, y, [backgroundCard, text]);

        // Define a hit area for the container to make it interactive
        container.setInteractive(new Phaser.Geom.Rectangle(-BOX_WIDTH / 2, -BOX_HEIGHT / 2, BOX_WIDTH, BOX_HEIGHT), Phaser.Geom.Rectangle.Contains)
        .on('pointerover', () => backgroundCard.setFillStyle(0xbbbaba))
        .on('pointerout', () => backgroundCard.setFillStyle(0xffffff))
        .on('pointerdown', () => {
            this.events.emit("cardSelected", card); 
        });

        return container;
    }

    onCardSelected(card) {
        this.playerCard = card;
        console.log("Player selected:", this.playerCard);

        this.cardContainers.forEach(container => container.disableInteractive());

        this.infoText.setText("Player has selected a card");

        const playerChosenCard = this.createCards(this.width/2 + 500, this.height/2 + 400,`${card.number}`, card).disableInteractive();

        this.time.delayedCall(1000, () => {
            this.infoText.setText("Oponent is selecting a card");
        });

        this.time.delayedCall(1000, () => {
            this.handleOpponentTurn();
        });

        this.events.off("cardSelected"); // Prevent this from being called again.
    }

    handleOpponentTurn()
    {
        let oponentCardPos;
        do {
            oponentCardPos = Math.floor(Math.random() * 8);
            this.oponentcard = this.mazo[oponentCardPos];
        } while (this.oponentcard === this.playerCard);

        console.log("Oponent selected:", this.oponentcard);
        this.time.delayedCall(1000, () => {
            this.infoText.setText("Oponent has selected a card");
        });

        const oponentChosenCard = this.createCards(this.width/2 - 500, this.height/2 + 400,`${this.oponentcard.number}`, this.oponentcard).disableInteractive();
        

        if(this.oponentcard.number < this.playerCard.number)
        {
            this.playerBegins = false;
            console.log("Opponent starts");
            this.time.delayedCall(1000, () => {
                this.infoText.setText("Oponent Starts");
            });
        }
        else
        {
            this.playerBegins = true;
            console.log("Player starts");
            this.time.delayedCall(1000, () => {
                this.infoText.setText("Player Starts");
            });
        }

        this.time.delayedCall(2000, () => {
            this.scene.start('HanafudaGame', { begins: this.playerBegins });
        });
    }

     openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.playerData.SceneToResume = this.scene.key;
            this.scene.launch('OptionMenu', this.playerData);
    }
}
