import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";

export class HanafudaGame extends Phaser.Scene{
    constructor()
    {
        super('HanafudaGame')

        this.playerFirst = null;

        this.round = 1;
        this.playerContainer = [];
    }

    init(data)
    {
        this.playerFirst = data.begins;
    }

    create(playerData) 
    {
        //For optionsMenu and other stuff
        this.playerData = playerData;
        console.log(this.playerData)

        //For transitions
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();
        
        this.input.keyboard.on('keydown-ESC', () => {
            this.openOptionMenu();
        });

        //Get Scale 
        this.width = this.scale.width;
        this.height = this.scale.height;

        //Bakcground
        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackgroundPlaceholder');

        //Back button
        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
        this.openOptionMenu();
        });

        //UI texts
        this.roundText = this.add.text(50, 20, "Round:1", {
        fontSize: "48px",
        color: "#ffffff"
        });

        this.turnText = this.add.text(50, 80, "Turno:", {
        fontSize: "48px",
        color: "#ffffff"
        });

        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        this.playerPairs = [];
        this.enemyPairs = [];
        this.playerTurn = this.playerFirst === true; 
        this.updateTurnText();
        console.log("Jugador empieza:", this.playerTurn);
        this.renderAllCards();
    }

    createDeck() {
        this.deck = [];

        let number = 0;
        for (let month = 0; month < 12; month++) 
        {
            for (let i = 0; i < 4; i++) 
            {
                this.deck.push({
                    number, month 
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

        console.log(this.deck);

        // Mesa no puede ser todo un mes
        const allSameMonth = this.tableCards.every(c => c.month === this.tableCards[0].month);
        if (allSameMonth) { this.deck.push(...this.playerCards, ...this.enemyCards, ...this.tableCards);
            this.shuffleDeck();
            this.dealCards();
        }
    }

    renderAllCards() {
        // Jugador
        this.playerCards.forEach((card, i) => {

            this.playerContainer.push(this.createCards(550 + i * 120, this.height - 150, `${card.number}`, card));

            // const rect = this.add.rectangle(550 + i * 120, this.height - 150, 100, 150, 0x3333aa)
            //     .setInteractive()
            //     .on("pointerdown", () => {
            //         if (!this.playerTurn) return;
            //         this.handlePlayerCard(card, i);
            //     });

            // this.add.text(rect.x, rect.y, `${card.number}`, {
            //     fontSize: "28px",
            //     color: "#ffffff"
            // }).setOrigin(0.5);
        });

        // Mesa
        this.tableCards.forEach((card, i) => {
            const rect = this.add.rectangle(550 + i * 120, this.height / 2, 100, 150, 0xaa3333);
            this.add.text(rect.x, rect.y, `${card.number}`, {
                fontSize: "28px",
                color: "#ffffff"
            }).setOrigin(0.5);
        });

        // Enemigo
        this.enemyCards.forEach((card, i) => {
            const rect = this.add.rectangle(550 + i * 120, 150, 100, 150, 0x444444);
            this.add.text(rect.x, rect.y, `${card.number}`, {
                fontSize: "28px",
                color: "#ffffff"
            }).setOrigin(0.5);
        });
    }

    updateTurnText() {
    this.turnText.setText(this.playerTurn ? "Turn: you" : "Turn: oponent");
    }
        handlePlayerCard(card, index) {
        console.log("Jugador eligió:", card);

        // Eliminar carta del array del jugador
        this.playerCards.splice(index, 1);
        this.playerTurn = false;
        this.updateTurnText();
            this.round++;
        this.roundText.setText("Round: " + this.round);
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
            this.onCardSelected(card);
        });

        return container;
    }

    onCardSelected(card) {
        console.log("Player selected:", this.playerCard);

        this.playerContainer.forEach(container => container.disableInteractive());

        if(this.playerTurn == true)
        {   
            this.playerCards.forEach(cardArray, index => {
                if(card == cardArray)
                {
                    cardpos = index;
                }   
            });
            
            this.searchesPair(card, cardpos);
        }
        
        // this.time.delayedCall(1000, () => {
        //     this.handleOpponentTurn();
        // });

        this.events.off("cardSelected"); // Prevent this from being called again.
    }


    searchesPair(card, cardpos)
    {   
        let numberOfPairs = 0;
        this.tableCards.forEach((tableCard, index) =>{

            if(card.month === tableCard.month)
            {
                numberOfPairs++;
                console.log("Pair found", card, tableCard);
                this.foundPair(card, tableCard, cardpos, index);
            }
            else 
            {
                this.pairNotFound(card, cardpos);
            }
        })
    }

    foundPair(card1pos, card2pos)
    {
        // add the pair to the player pairs, and remove from playerCards and tableCards
        if(this.playerTurn == true)
        {
            this.playerPairs.push([this.playerCards.splice(card1pos, 1), this.tableCards.splice(card2pos, 1)]);
        }
        else 
        {
            this.enemyPairs.push([this.enemyCards.splice(card1pos, 1), this.tableCards.splice(card2pos, 1)]);
        }

        console.log(this.playerPairs);
        console.log(this.playerCards);
        console.log(this.tableCards);
        console.log(this.enemyCards);
        console.log(this.enemyPairs);
    }

    pairNotFound(card, cardpos)
    {
        if(this.playerTurn == true)
        {
            this.tableCards.push(this.playerCards.splice(cardpos,1));
        }
        else 
        {
            this.tableCards.push(this.enemyCards.splice(cardpos,1));
        }

        console.log(this.playerCards);
        console.log(this.enemyCards);
        console.log(this.tableCards);

        this.tableCards.push(this.deck.splice(0,1));
        this.searchesPair(this.tableCards[this.tableCards.length -1], this.tableCards.length -1);
    }

    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
        this.scene.pause();
        this.playerData.SceneToResume = this.scene.key;
        this.scene.launch('OptionMenu', this.playerData);
    }
}