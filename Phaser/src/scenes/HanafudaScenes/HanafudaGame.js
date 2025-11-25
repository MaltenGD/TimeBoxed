import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { calculateYakus } from "./HanafudaScore.js";

export class HanafudaGame extends Phaser.Scene{
    constructor(){super('HanafudaGame')}

    init(data){
        /** Boolean to know whose turn it is, if it's false then that means it's the oponent starts */
        this.playerTurn = data.begins;

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
        this.opponentPairs = [];

        /** Array of GameObjects for cards on the table */
        this.tableCardObjects = [];
        this.PlayerCardsObjects = [];
        this.opponentCardsObjects = [];
        this.PlayerPairsObjects = [];
        this.opponentPairsObjects = [];

        this.playerChosenCard = null;

        /** Boolean to know if the table has been refill in a turn or not*/
        this.refill = false;
        this.OponentChoice = null;

        /**Array for checking the number of cards of each month in the table*/
        this.monthCounter = [];

        this.infoText = null;

        this.tablepos = []; 

        this.rows = 2;
        this.cols = 4;

        this.chooseTableCard = false;
    }

    create(playerData){
        //For optionsMenu and other stuff
        this.playerData = playerData;

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
        this.roundText = this.add.text(100, 900, "Round:1", {fontSize: "48px",color: "#ffffff"});
        this.turnText = this.add.text(50, 80, "Turno:", {fontSize: "48px", color: "#ffffff"});

        //Prepare the round
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();

        //this.updateTurnText();
        console.log("Jugador empieza:", this.playerTurn);

        this.board = this.add.rectangle(350, 30, 1050, 1000, 0x000000, 0.5).setOrigin(0, 0);
        this.OpponentPairZone = this.add.rectangle(this.width/ 2+ 460, 30, 490, 400 , 0x000000, 0.5).setOrigin(0, 0);
        this.PlayerPairZone = this.add.rectangle(this.width/ 2+ 460, this.height/2 + 20, 490, 400, 0x000000, 0.5).setOrigin(0, 0);
        this.infoText = this.add.text(550, this.height / 2 + 200, "Start!", {fontSize: '60px', fill: '#ffffffff'});

        //Initial renders
        this.renderOpponentCards();
        this.renderTable();
        this.renderPlayerCards();
        this.handlesTurns();
    }

    /**
    * @method createDeck :It initalizes the deck array with 48 cards, each have a number int and a month int. 
    * Also initializes the mountCounter array to be used in the dealCards method */
    createDeck() {
        let number = 0;
        for (let month = 0; month < 12; month++) {
            for (let i = 0; i < 4; i++){
                this.deck.push({ number, month });
                number++;
            }
            this.monthCounter.push({month: month, count:0});
        }
    }

    /**@method shuffleDeck :Suffles the cards in the deck array */
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    /**
     * @method dealCards : It gives 8 cards, from the table array, to the Player array, 8 to the opponent array and 8 to the table array.
     * It also checks that a 4 cards from the same month aren't on the table array, or else it returns the cards to the deck, and calls suffleDeck and dealcards Mehtods.
     */
    dealCards() {
        this.playerCards = this.deck.splice(0, 8);
        this.enemyCards = this.deck.splice(0, 8);

        for(let i = 0; i < this.rows; ++i){
            this.tableCards[i] = [];
            for(let j = 0; j < this.cols; ++j){
                this.tableCards[i][j] = this.deck.splice(0, 1)[0];
            }
        }

        //Table cannot contain a whole month, So we have to count how many cards of each month there are
        for(let i = 0; i < this.tableCards.length; ++i){
            for(let h = 0; h < this.tableCards[i].length; ++h){
                for(let j = 0; j < this.monthCounter.length; ++j){
                if(this.tableCards[i][h].month === this.monthCounter[j].month)
                {this.monthCounter[j].count++;}  
                }
            }
        }

        /**boolean to indicate if there's 4 cards from the same month on the table */
        let wholeMonth = false;
        this.monthCounter.forEach(month => { //check to see if any month Counter is 4
            if(month.count === 4) {wholeMonth = true;}
        });
        
        if (wholeMonth){ //if a whole month is on the table, the cards are returned to the deck and it is suffled and dealt again.
            this.deck.push(this.playerCards, this.enemyCards, this.tableCards);
            this.shuffleDeck();
            this.dealCards();
        }
    }

    renderTable(){
        this.tableCardObjects.forEach((row, rowindex) =>{
            row.forEach((obj, index) => { obj.destroy();})
        });
        this.tableCardObjects = [];

        for(let i = 0; i < this.tableCards.length; ++i){
            this.tableCardObjects[i] = [];
            for(let j = 0; j < this.tableCards[i].length; ++j){
                
                const x = 450 + j * 120;
                const y = this.height / 2 - 100 + i * 170;
                const rect = this.add.rectangle(x, y, 100, 150, 0xd30000);
                const text = this.add.text(rect.x, rect.y, `${this.tableCards[i][j].number} \n${this.tableCards[i][j].month}`,{
                    fontSize: "28px",
                    color: "#ffffffff"
                }).setOrigin(0.5);
                
                this.tableCardObjects[i].push(rect);
                this.tableCardObjects[i].push(text);
            }  
        }
    }

    /**@method renderOpponentCards : It renders the opponent cards on screen*/
    renderOpponentCards() {
        this.opponentCardsObjects.forEach(obj => obj.destroy());
        this.opponentCardsObjects = [];

        this.enemyCards.forEach((card, i) => {
            const rect = this.add.rectangle(450 + i * 120, 150, 100, 150, 0x444444);
            const text = this.add.text(rect.x, rect.y, `${card.number}`, { fontSize: "28px", color: "#ffffff"})
            .setOrigin(0.5);  

            this.opponentCardsObjects.push(rect);
            this.opponentCardsObjects.push(text);
        });
    }

    renderPlayerCards(){
        this.PlayerCardsObjects.forEach(obj => obj.destroy());
        this.PlayerCardsObjects = [];

        this.playerCards.forEach((card, i) => {
            const x = 450 + i *120;
            const y = this.height / 2 + 400;

            const rect = this.add.rectangle(x, y, 100, 150, 0xffffff)

            const text = this.add.text(rect.x, rect.y, `${card.number} \n ${card.month}`, {
                fontSize: "28px",
                color: "#000000ff"
            }).setOrigin(0.5);

            this.PlayerCardsObjects.push(rect);
            this.PlayerCardsObjects.push(text);
        });
    }

    renderPlayerPairs(){
        this.PlayerPairsObjects.forEach(obj => obj.destroy());
        this.PlayerPairsObjects = [];
        const cardsPerRow = 7;

        this.playerPairs.forEach((card, i) => {
            const col = i % cardsPerRow;
            const row = Math.floor(i / cardsPerRow);
            const x = this.width / 2 + 500 + col * 70;
            const y = this.height / 2 + 90 + row * 130;
            const rect = this.add.rectangle(x, y, 60, 110, 0x92286b);
            const text = this.add.text(rect.x, rect.y, `${card.number} \n ${card.month}`, {fontSize: "20px", color: "#ffffffff"})
            .setOrigin(0.5);

            this.PlayerPairsObjects.push(rect);
            this.PlayerPairsObjects.push(text);
        });
    }

    renderOpponentPairs(){
        this.opponentPairsObjects.forEach(obj => obj.destroy());
        this.opponentPairsObjects = [];
        const cardsPerRow = 7   ;

        this.opponentPairs.forEach((card, i) => {
            const col = i % cardsPerRow;
            const row = Math.floor(i / cardsPerRow);
            const x = this.width / 2 + 500 + col * 70;
            const y = this.height / 2 - 450  + row * 130;
            const rect = this.add.rectangle(x, y, 60, 110, 0x0000ff);
            const text = this.add.text(rect.x, rect.y, `${card.number} \n ${card.month}`, {fontSize: "20px", color: "#ffffffff"})
            .setOrigin(0.5);

            this.opponentPairsObjects.push(rect);
            this.opponentPairsObjects.push(text);
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

    table(card, cardpos){
        this.infoText.setText("Searching pairs...")
        this.searchesPair(card, cardpos);   //Looks for a pairs with cards on the table
        this.infoText.setText("Refilling table...");
        this.refill = true; //The refill of the table only happens one time per turn

        if(this.tableCards[0].length < 7 && this.tableCards[1].length < 7){//just in case refill doesn't change
            this.cardFromDeck = this.deck.splice(0,1)[0];
            console.log("anotherpair");
            console.log("cardFromDeck", this.cardFromDeck);
            this.searchesPair(this.cardFromDeck, 0);
        }

        this.refill = false; //Reset the variable for next turn
        this.infoText.setText("turn finished");
        console.log("oponentPairss", this.opponentPairs);
    }

    searchesPair(card, cardpos){//Good
        let numberOfPairs = 0; //Contador para saber cuantas cartas del mismo mes hay en la mesa
        let pos1 = {row: 0, col: 0};
        let pos2 = {row: 0, col: 0};
        let pos3 = {row: 0, col: 0};

        for(let i = 0; i < this.tableCards.length; ++i){
            for(let j = 0; j < this.tableCards[i].length; ++j){
                if(card.month === this.tableCards[i][j].month){ //Comprueba si la carta elegida tiene algun par en la mesa (los meses deben coincidir)
                    numberOfPairs++;
                    if(numberOfPairs === 1){ pos1 = {row: i, col: j}}
                    else if(numberOfPairs === 2){ pos2 = {row: i, col: j}}
                    else if(numberOfPairs === 3){ pos3 = {row: i, col: j}}
                }
            }
        }
        console.log("Pairs?",numberOfPairs);

        if(numberOfPairs === 1){ //Cuando solo hay una carta del mismo mes en la mesa
            this.tablecard = this.tableCards[pos1.row][pos1.col]; //envia la carta par de la mesa
            this.tablepos.push(pos1);

            console.log("Pair found", card, this.tablecard);
            this.infoText.setText("Pair Found!");
            this.foundPair(card, cardpos, this.tablepos);
        }
        else if(numberOfPairs > 1){this.selectTablePair(card, cardpos, numberOfPairs, pos1, pos2, pos3);}
        else if (numberOfPairs < 1){
            this.infoText.setText("Shame, there aren't any matching cards");
            this.pairNotFound(cardpos);
        }
    
        this.tablepos = [];
        this.infoText.setText("arranging cards");
        //render
        this.renderTable();
        this.renderOpponentCards();
        this.renderPlayerCards();
    }

    selectTablePair(card, cardpos, pairs, pos1, pos2, pos3){
        let opponentChoice = 0;
        let finalPos = null;
        if(pairs === 2){opponentChoice = Math.floor(Math.random() * 2);}
        else if(pairs === 3){opponentChoice = Math.floor(Math.random() * 3);}

        if(opponentChoice === 0){finalPos = pos1;}
        else if(opponentChoice === 1){ finalPos = pos2;}
        else if(opponentChoice === 2){finalPos = pos3;}
        this.tablecard = this.tableCards[finalPos.row][finalPos.col];
        this.tablepos.push(finalPos);
        console.log("Pair found", card, this.tableCards[finalPos.row][finalPos.col]);
        this.infoText.setText("Pair Found!");
        this.foundPair(card, cardpos, this.tablepos);
    }

    foundPair(card, cardpos, tablecardPos){ //Good
        if(this.playerTurn == true){
            if(this.refill == false) {this.playerPairs.push(this.playerCards.splice(cardpos, 1)[0]);}
            else {this.playerPairs.push(card);}
           
            this.playerPairs.push(this.tableCards[tablecardPos[0].row].splice(tablecardPos[0].col, 1)[0]);
            console.log(this.playerPairs);
            this.renderPlayerPairs();
        }
        else {
            if(this.refill === false) { this.opponentPairs.push(this.enemyCards.splice(cardpos, 1)[0]);}
            else {
                console.log("has deck card pair", card);
                this.opponentPairs.push(card); //Pone la carta del deck
            }

            this.opponentPairs.push(this.tableCards[tablecardPos[0].row].splice(tablecardPos[0].col, 1)[0]); //Coloca 
            this.renderOpponentPairs();
        }
    }

    /**@method pairNotFound : Before refilling the table, It eliminates the chosen card from it's original array and adds it to the table array. If during the table refill this method is called, it will add the card from the deck to the table.*/
    pairNotFound(cardpos){

        let row = 0;
        if(this.tableCards[0].length < this.tableCards[1].length){row = 0;}
        else if (this.tableCards[0].length > this.tableCards[1].length) {row = 1;}

        if(this.refill == false){ //If the table hasn't been refilled yet 
            if(this.playerTurn == true){this.tableCards[row].push(this.playerCards.splice(cardpos,1)[0]);}
            else {this.tableCards[row].push(this.enemyCards.splice(cardpos,1)[0]);}
        }
        else{this.tableCards[row].push(this.cardFromDeck);} //If The table is refilling then add deck card 
    }

    handlesTurns(){
        if (this.playerCards.length === 0 && this.enemyCards.length === 0) {
            this.infoText.setText("Round Finished");
            console.log("round over");
            this.round++;
            return;
        }

        this.roundText.setText("Round: " + this.round);

        if(this.playerTurn == false) {
            this.infoText.setText("Opponent's turn");
            this.time.addEvent({
                delay: 1000,
                callback: this.handleOpponentTurn,
                callbackScope: this
            });  
        }
        else{
            this.infoText.setText("Your turn");
            this.time.delayedCall(1000, () => this.infoText.setText("Choose a card..."));
            
            this.PlayerCardsObjects.forEach((cardObject, index) => {
                if (index % 2 === 0) {
                    const cardDataIndex = index / 2;
                    const cardData = this.playerCards[cardDataIndex];
                    cardObject.setInteractive()
                        .on('pointerover', () => cardObject.setFillStyle(0xbbbaba))
                        .on('pointerout', () => cardObject.setFillStyle(0xffffff))
                        .on('pointerdown', () => {
                            this.onCardSelected(cardData, cardDataIndex);
                        });
                }
            });
        }
    }

    onCardSelected(card, cardPos){
        this.PlayerCardsObjects.forEach(obj => obj.setInteractive(false));
        console.log("Player selected:", card);
        this.table(card, cardPos);
        this.playerTurn = false;
        this.handlesTurns();
    }

    handleOpponentTurn(){
        this.infoText.setText("Choosing Card...");
        this.OponentChoice = Math.floor(Math.random() * this.enemyCards.length);
        this.table(this.enemyCards[this.OponentChoice], this.OponentChoice);
        this.playerTurn = true;
        this.handlesTurns();
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
        
        const yakuText = this.add.text(this.width / 2, this.height / 2 - 20,
        "Combination: " + yaku,
        { fontSize: "32px", color: "#000" }
        ).setOrigin(0.5);

        const pointsText = this.add.text(this.width / 2, this.height / 2 + 40,
        "Points: " + points,
        { fontSize: "28px", color: "#333" }
        ).setOrigin(0.5);

    const koikoiBtn = this.add.text(this.width / 2 - 120, this.height / 2 + 120,
        "KoiKoi",
        { fontSize: "32px", backgroundColor: "#0077cc", padding: 10, color: "#fff" }
        ).setOrigin(0.5).setInteractive();

        const shobuBtn = this.add.text(this.width / 2 + 120, this.height / 2 + 120,
        "Shobu",
        { fontSize: "32px", backgroundColor: "#cc0044", padding: 10, color: "#fff" }
    ).setOrigin(0.5).setInteractive();

        koikoiBtn.on("pointerdown", () => {
            console.log("El jugador elige koikoo, el juego sigue");
            overlay.destroy();
            box.destroy();
            title.destroy();
            yakuText.destroy();
            pointsText.destroy();
            koikoiBtn.destroy();
            shobuBtn.destroy();

            this.handlesTurns();
        });

        shobuBtn.on("pointerdown", () => {
        console.log("El jugador elige SHOBU,ronda termina aqu");
        overlay.destroy();
        box.destroy();
        title.destroy();
        yakuText.destroy();
        pointsText.destroy();
        koikoiBtn.destroy();
        shobuBtn.destroy();
    });
    }

    enemyYaku(yaku, points)
    {
    console.log("El enemigo consiguio un Yaku:", yaku, points, "puntos");

    const random = Math.random();

    if (random < 0.5) {
        console.log("El enemigo elige Koikoi");
        this.handlesTurns();

    } else {
        console.log("El enemigo elige Shobu, ronda termina");
    }
    }

    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
        this.scene.pause();
        this.playerData.SceneToResume = this.scene.key;
        this.scene.launch('OptionMenu', this.playerData);
    }
}