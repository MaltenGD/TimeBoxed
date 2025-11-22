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

        /** Array of GameObjects for cards on the table */
        this.tableCardObjects = [];

        this.playerPairs = [];
        this.opponentPairs = [];

        this.playerContainer = [];
        this.playerChosenCard = null;

        /** Boolean to know if the table has been refill in a turn or not*/
        this.refill = false;
        this.OponentChoice = null;
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

        //Mesa no puede ser todo un mes
        // let allSameMonth = 0;
        // this.tableCards.forEach((card, card2, index) => {
        
        //     if(card.month ===)

        // });

        
        // if (allSameMonth) { this.deck.push(this.playerCards, this.enemyCards, this.tableCards);
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
        // Clear previous card game objects
        this.tableCardObjects.forEach(obj => obj.destroy());
        this.tableCardObjects = [];

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
            const text = this.add.text(rect.x, rect.y, `${card.number} \n ${card.month}`, {
                fontSize: "28px",
                color: "#ffffff"
            }).setOrigin(0.5);

            this.tableCardObjects.push(rect);
            this.tableCardObjects.push(text);
        });
    }

    renderPlayerPairs()
    {

    }

    renderOpponentPairs()
    {

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
            const cardChosenPos = this.playerCards.findIndex(playerCard => playerCard === card);
            if (cardChosenPos !== -1){
                console.log("Player selected:", card);
                this.table(card, cardChosenPos);
            }
        }
        this.events.off("cardSelected");
    }

    table(card, cardpos)
    {
        console.log ("card sent", card, cardpos);
        this.searchesPair(card, cardpos);   //Looks for a pairs with cards on the table
        this.refill = true; //The refill of the table only happens one time per turn

        if(this.refill == true && this.tableCards.length < 10)//just in case refill doesn't change
        { 
            this.cardFromDeck = this.deck.splice(0,1)[0];
            console.log("anotherpair");
            console.log("cardFromDeck", this.cardFromDeck);
            this.searchesPair(this.cardFromDeck, 0);
        }

        this.refill = false; //Resetear la variable para siguiente turno
        this.renderTableCards(); //render
        console.log("oponentPairss", this.opponentPairs);
    }

    searchesPair(card, cardpos) //Good
    {
        let numberOfPairs = 0; //Contador para saber cuantas cartas del mismo mes hay en la mesa
        this.tableCards.forEach((tableCard, index) =>{

            if(card.month === tableCard.month) //Comprueba si la carta elegida tiene algun par en la mesa (los meses deben coincidir)
            {
                numberOfPairs++; //Ha encontrado un par
            
                if(numberOfPairs === 1) //Cuando solo hay una carta del mismo mes en la mesa
                {
                    this.tablepos = index; //envia el index del par
                    this.tablecard = tableCard; //envia la carta par de la mesa
                }
            }
        })

        console.log("Pairs?",numberOfPairs);

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
        if(this.playerTurn == true)
        {  
            console.log(this.refill);
            if(this.refill == false) {this.playerPairs.push(this.playerCards.splice(cardpos, 1)[0]);}
           
            this.playerPairs.push(this.tableCards.splice(tablecardPos, 1)[0]);
            console.log(this.playerPairs);
        }
        else 
        {
            if(this.refill === false) { this.opponentPairs.push(this.enemyCards.splice(cardpos, 1)[0]);}
            else {
                console.log("has deck card pair", card);
                this.opponentPairs.push(card); //Pone la carta del deck
            }

            this.opponentPairs.push(this.tableCards.splice(tablecardPos, 1)[0]); //Coloca 
        }
    }

    pairNotFound(cardpos) //Good
    {
        if(this.refill == false)
        {
            if(this.playerTurn == true) { this.tableCards.push(this.playerCards.splice(cardpos,1)[0]);}
            else {this.tableCards.push(this.enemyCards.splice(cardpos,1)[0]);}
        }
        else{ this.tableCards.push(this.cardFromDeck);} //If The table is refilling then 
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
            pairs = this.opponentPairs;
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