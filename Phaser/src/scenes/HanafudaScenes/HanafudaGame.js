import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { calculateYakus } from "./HanafudaScore.js";

export class HanafudaGame extends Phaser.Scene{
    constructor()
    {
        super('HanafudaGame')

        this.playerFirst = null;

        this.round = 1;

        /**array of cards in deck */
        this.deck = [];

        /** Array of player cards */
        this.playerCards = [];

        /**Array of oponent cards */
        this.enemyCards = [];

        /** Array of cards on the table*/
        this.tableCards = [];

        this.playerPairs = [];
        this.enemyPairs = [];

        this.playerContainer = [];
        this.playerChosenCard = null;

        /** Counter for how many refills have been done */
        this.refillTimes = 0;
        this.OponentChoice = null;

        this.hasDeckCardPair = null;
    }

    init(data)
    {
        /** Boolean to know whose turn is, if it's false then that means it's the oponent starts */
        this.playerTurn = this.playerFirst = data.begins;
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
        this.roundText = this.add.text(100, 900, "Round:1", {
        fontSize: "48px",
        color: "#ffffff"
        });

        this.turnText = this.add.text(50, 80, "Turno:", {
        fontSize: "48px",
        color: "#ffffff"
        });

        //Prepare the round
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();

        //this.updateTurnText();
        console.log("Jugador empieza:", this.playerTurn);

        //Initial render
        this.renderOponentCards();
        this.renderTableCards();
        this.renderPlayerCards();

        this.handlesTurns();
    }

    createDeck() {
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

        console.log(this.tableCards);

        // Mesa no puede ser todo un mes
        //const allSameMonth = this.tableCards.every(c => c.month === this.tableCards[0].month);
        // if (allSameMonth) { this.deck.push(...this.playerCards, ...this.enemyCards, ...this.tableCards);
        //     this.shuffleDeck();
        //     this.dealCards();
        // }
    }

    renderOponentCards() {
         this.enemyCards.forEach((card, i) => {
            const rect = this.add.rectangle(550 + i * 120, 150, 100, 150, 0x444444);

            this.mesaText = this.add.text(rect.x, rect.y, `${card.number}`, {
            fontSize: "28px",
            color: "#ffffff"
        }).setOrigin(0.5);
            
        });
    }

    renderPlayerCards()
    {
        this.playerCards.forEach((card, i) => {

            this.playerContainer.push(this.createCards(550 + i * 120, this.height - 150, `${card.number}`, card));
        });
    }

    renderTableCards()
    {
        const startX = 550;
        const startY = this.height / 2 - 100;
        const cardSpacingX = 120;
        const cardSpacingY = 170;
        const cardsPerRow = 4;

        this.tableCards.forEach((card, i) => {
            const col = i % cardsPerRow;
            const row = Math.floor(i / cardsPerRow);

            const x = startX + col * cardSpacingX;
            const y = startY + row * cardSpacingY;

            const rect = this.add.rectangle(x, y, 100, 150, 0xaa3333);
            this.add.text(rect.x, rect.y, `${card.number} \n ${card.month}`, {
            fontSize: "28px",
            color: "#ffffff"
            }).setOrigin(0.5);

        });
    }

    updateTurnText() {
    this.turnText.setText(this.playerTurn ? "Turn: you" : "Turn: oponent");
    }
        // handlePlayerCard(card, index) {
        // console.log("Jugador eligió:", card);

        // // Eliminar carta del array del jugador
        // this.playerCards.splice(index, 1);
        // this.playerTurn = false;
        // this.updateTurnText();
        //     this.round++;
        // this.roundText.setText("Round: " + this.round);
    //}

    createCards(x, y, textContent, card) 
    {
        const BOX_WIDTH = 90;
        const BOX_HEIGHT = 150;
    
        const backgroundCard = this.add.rectangle(0, 0, BOX_WIDTH, BOX_HEIGHT, 0xffffff);
    
        const text = this.add.text(0, 0,textContent,
        {   fontSize: '30px',
            fill: '#000000',
            align: 'center'
        })
        .setOrigin(0.5);
    
        const container = this.add.container(x, y, [backgroundCard, text]);

        container.setInteractive(new Phaser.Geom.Rectangle(-BOX_WIDTH / 2, -BOX_HEIGHT / 2, BOX_WIDTH, BOX_HEIGHT), Phaser.Geom.Rectangle.Contains)
        .on('pointerover', () => backgroundCard.setFillStyle(0xbbbaba))
        .on('pointerout', () => backgroundCard.setFillStyle(0xffffff))
        .on('pointerdown', () => { 
            this.onCardSelected(card);
        });

        return container;
    }

    onCardSelected(card) 
    {
        this.playerContainer.forEach(container => container.disableInteractive());

        if(this.playerTurn == true)
        {   
            const cardChosenPos= this.playerCards.findIndex(playerCard => playerCard === card);
            if (cardChosenPos !== -1){
                console.log("Player selected:", card);
                this.table(card, cardChosenPos);
            } else {
                console.error("Selected card not found in player's hand.", card);
            }
        }
        
        this.events.off("cardSelected");
    }

    table(card, cardpos)
    {
        console.log ("card sent", card, cardpos);

        this.searchesPair(card, cardpos);

        this.refillTimes ++;

        if(this.refillTimes == 1)
        { 
            console.log
            this.cardFromDeck = this.deck.splice(0,1)[0];
            console.log("anotherpair");
            this.searchesPair(this.cardFromDeck, this.tableCards.length - 1);
        }

        console.log ("no more refill")
        this.refillTimes = 0;

        if(this.hasDeckCardPair == false)
        {
            this.tableCards.push(this.cardFromDeck);
        }

        this.hasDeckCardPair = false;
        this.renderTableCards();
        console.log("bleh",this.tableCards);
        this.renderTableCards();
    }

    searchesPair(card, cardpos) //GoodForNow
    {   
        let numberOfPairs = 0;
        this.tableCards.forEach((tableCard, index) =>{

            if(card.month === tableCard.month)
            {
                numberOfPairs++;
                this.tablepos = index;

                if(numberOfPairs === 1)
                {
                    this.tablecard = tableCard;
                }
            }
        })

        console.log("nofP",numberOfPairs);

        if(numberOfPairs === 1)
        {
            console.log("Pair found", card, this.tablecard);
            
            this.foundPair(card, cardpos, this.tablepos);
        }
        else if (numberOfPairs < 1)
        {
            console.log("pairnotfound");
            this.pairNotFound(cardpos);
        }

        this.renderTableCards();
    }

    foundPair(card, cardpos, tablecardPos) //Good
    {
        // add the pair to the player pairs, and remove from playerCards and tableCards
        
        if(this.playerTurn == true)
        {  
            console.log(this.refillTimes);
            console.log(tablecardPos);
            
            if(this.refillTimes == 0) {this.playerPairs.push(this.playerCards.splice(cardpos, 1)[0]);}
           
            this.playerPairs.push(this.tableCards.splice(tablecardPos, 1)[0]);
            console.log(this.playerPairs);
        }
        else 
        {
            if(this.refillTimes == 0) {

                console.log(this.enemyCards);
                
                this.enemyPairs.push(this.enemyCards.splice(cardpos, 1)[0]);
            }
            else 
            {
                console.log("has deck card pair", card);
                this.enemyPairs.push(card);
                this.hasDeckCardPair = true;
            }

            console.log(this.refillTimes);

            this.enemyPairs.push(this.tableCards.splice(tablecardPos, 1)[0]);
            console.log("Oponent Pairs",this.enemyPairs);
        }
    }

    pairNotFound(cardpos) //Good
    {
        if(this.playerTurn == true) { this.tableCards.push(this.playerCards.splice(cardpos,1)[0]);}
        else {this.tableCards.push(this.enemyCards.splice(cardpos,1)[0]);}
    }

    handlesTurns()
    {
        if(this.playerTurn == false)
        {
            this.handleOpponentTurn();
        }
        else
        {
            this.playerContainer.forEach(container => container.setInteractive());
        }
    }

    handleOpponentTurn()
    {
        this.OponentChoice = Math.floor(Math.random() * this.enemyCards.length);
        console.log(this.OponentChoice);
        this.table(this.enemyCards[this.OponentChoice], this.OponentChoice);
        console.log(this.tableCards);
        this.playerTurn = true;
    }

    checkYakus(isPlayer) {

    let pairs;
    if (isPlayer) 
        {
        pairs = this.playerPairs;
    } else {
        pairs = this.enemyPairs;
    }

    const result = calculateYakus(pairs);

    if (result.yakus.length === 0) 
        {
        return;
    }

    const lastYAkus= result.yakus[result.yakus.length-1];
    const points= result.totalPoints;
    if(isPlayer)
    {
        
    }
    
}
    showYakuPlayer(yaku, points)
    {

        const overlay = this.add.rectangle(this.width/2, this.height/2,this.width,this.height, 0x00000, 0,5);
        const box = this.add.rectangle(this.width/2, this.height/2, 600, 350, 0xfffff).setStrokeStyle(5,0xaa0000);
        
        const title = this.add.text(this.width / 2, this.height / 2 - 100,
        "¡Has conseguido un Yaku!",
        { fontSize: "40px", color: "#000" }
        ).setOrigin(0.5);
        


    }

    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
        this.scene.pause();
        this.playerData.SceneToResume = this.scene.key;
        this.scene.launch('OptionMenu', this.playerData);
    }
}