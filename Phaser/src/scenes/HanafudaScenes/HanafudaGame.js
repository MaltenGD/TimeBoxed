import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { calculateYakus } from "./HanafudaScore.js";

export class HanafudaGame extends Phaser.Scene{
    constructor(){super('HanafudaGame')}

    init(data){
        /** Boolean to know whose turn it is, if it's false then that means it's the oponent starts */
        this.playerTurn = data.begins;  
        /**Round counter*/
        this.round = 1;
        /**Array of cards in deck */
        this.deck = [];
        /** Array of player cards */
        this.playerCards = [];
        /**Array of oponent cards */
        this.opponentCards = [];
        /** Array of cards on the table*/
        this.tableCards = [];
        /**Array of pairs the player has collected */
        this.playerPairs = [];
        /** Array of pairs the opponent has collected */
        this.opponentPairs = [];
        /** Array of GameObjects for cards on the table */
        this.tableCardObjects = [];
        /** Array of GameObjects for player cards */
        this.PlayerCardsObjects = [];
        /** Array of GameObjects for opponent cards */
        this.opponentCardsObjects = [];
        /** Array of GameObjects for player pairs */
        this.PlayerPairsObjects = [];
        /** Array of GameObjects for opponent pairs */
        this.opponentPairsObjects = [];
        /** Boolean to know if the table has been refilled in a turn or not*/
        this.refill = false;
        /**Array for checking the number of cards of each month in the table*/
        this.monthCounter = [];
        /**It constains the text to show the proccess of the game to the player*/
        this.infoText = null;

        this.tablepos = []; 
        /**table rows*/
        this.rows = 2;
        /**Initial table columns */
        this.cols = 4;

        this.gamePaused=false;

    }

    create(data){
        //For optionsMenu and other stuff
        this.playerData = data.playerData;

        //For transitions
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();
        
        this.input.keyboard.on('keydown-ESC', () => {
            this.openOptionMenu();
        });

        //Get Scale
        this.width = this.scale.width;
        this.height = this.scale.height;

        //Background
        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackgroundPlaceholder');

        //Back button
        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 45, fill: '#f0f0f0ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
        this.openOptionMenu();
        });

        //UI texts
        this.roundText = this.add.text(40, 1000, "Round:1", {fontSize: "30px",color: "#ffffff"});
        //this.turnText = this.add.text(50, 80, "Turno:", {fontSize: "48px", color: "#ffffff"});

        //Prepare the round
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();

        console.log("Jugador empieza:", this.playerTurn);

        //render the zones for the board (table, player and opponent cards are here), and two for where the player and opponent collected pairs will be
        this.board = this.add.rectangle(300, 20, 1030, 1040, 0x000000, 0.5).setOrigin(0, 0);
        this.opponentPairZone = this.add.rectangle(this.width/ 2+ 400, 30, 530, 470 , 0x000000, 0.5).setOrigin(0, 0);
        this.playerPairZone = this.add.rectangle(this.width/ 2+ 400, this.height/2 + 20, 530, 470, 0x000000, 0.5).setOrigin(0, 0);
        this.infoText = this.add.text(550, this.height / 2 + 200, "Start!", {fontSize: '60px', fill: '#ffffffff'}); //Text

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
        this.playerCards = this.deck.splice(0, 8); //8 cards from deck to player
        this.opponentCards = this.deck.splice(0, 8); //8 cards from deck to opponent

        for(let i = 0; i < this.rows; ++i){ //8 cards from deck to table, that will be an array of arrays
            this.tableCards[i] = [];
            for(let j = 0; j < this.cols; ++j){
                this.tableCards[i][j] = this.deck.splice(0, 1)[0];
            }
        }

        //Table cannot contain a whole month, so we count how many cards of each month there are
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
            this.deck.push(this.playerCards, this.opponentCards, this.tableCards);
            this.shuffleDeck();
            this.dealCards();
        }
    }

    /**@method renderTable :It renders the table cards in between the opponent and player cards on screen*/
    renderTable(){
        this.tableCardObjects.forEach((row) =>{ //Destroy old objects so they don't linger on scene 
            row.forEach((obj) => { obj.destroy();})
        });
        this.tableCardObjects = []; //clean the array

        for(let i = 0; i < this.tableCards.length; ++i){
            this.tableCardObjects[i] = [];
            for(let j = 0; j < this.tableCards[i].length; ++j){

                const image = this.add.image(400 + (j * 120), (this.height / 2 - 100) + (i * 170), `Card${this.tableCards[i][j].number}`).setScale(0.17);
                // const rect = this.add.rectangle(400 + (j * 120), (this.height / 2 - 100) + (i * 170), 100, 150, 0xd30000);
                // const text = this.add.text(rect.x, rect.y, `${this.tableCards[i][j].number} \n${this.tableCards[i][j].month}`,{fontSize: "28px",color: "#ffffffff"})
                // .setOrigin(0.5);
                this.tableCardObjects[i].push(image); 
                // this.tableCardObjects[i].push(text);
            }  
        }
    }

    /**@method renderOpponentCards :It renders the opponent cards on screen*/
    renderOpponentCards() {
        this.opponentCardsObjects.forEach(obj => obj.destroy()); //Destroy old objects so they don't linger on scene 
        this.opponentCardsObjects = []; //clean the array

        this.opponentCards.forEach((card, i) => {
            const rect = this.add.rectangle(400 + (i * 120), 150, 100, 150, 0x121212);
            this.opponentCardsObjects.push(rect);
            //const text = this.add.text(rect.x, rect.y, `${card.number}`, { fontSize: "28px", color: "#ffffff"}).setOrigin(0.5);  
            //this.opponentCardsObjects.push(text);
        });
    }

    /**@method renderPlayerCards :It renders the player cards on screen*/
    renderPlayerCards(){
        this.PlayerCardsObjects.forEach(obj => obj.destroy());  //Destroy old objects so they don't linger on scene
        this.PlayerCardsObjects = []; //clean the array

        this.playerCards.forEach((card, i) => {
            let image = this.add.image(400 + (i * 120), this.height / 2 + 400, `Card${card.number}`)
            .setScale(0.2)
            .setAlpha(1);
            this.PlayerCardsObjects.push(image);
            // const rect = this.add.rectangle(400 + (i * 120), this.height / 2 + 400, 100, 150, 0xffffff)
            // const text = this.add.text(rect.x, rect.y, `${card.number} \n ${card.month}`, {fontSize: "28px", color: "#000000ff"})
            // .setOrigin(0.5);
            // this.PlayerCardsObjects.push(rect);
            // this.PlayerCardsObjects.push(text);
        });
    }

    /**@method renderPlayerPairs :It renders the pairs collected by the player on screen*/
    renderPlayerPairs(){
        this.PlayerPairsObjects.forEach(obj => obj.destroy());
        this.PlayerPairsObjects = [];
        const cardsPerRow = 7;

        this.playerPairs.forEach((card, i) => {
            const col = i % cardsPerRow;
            const row = Math.floor(i / cardsPerRow);
            const image = this.add.image((this.width / 2 + 450) + (col * 70), (this.height / 2 + 90)+ (row * 100), `Card${card.number}`).setScale(0.1);
            this.PlayerPairsObjects.push(image);

            // const rect = this.add.rectangle((this.width / 2 + 450) + (col * 70), (this.height / 2 + 90)+ (row * 130), 60, 110, 0x92286b);
            // const text = this.add.text(rect.x, rect.y, `${card.number} \n ${card.month}`, {fontSize: "20px", color: "#ffffffff"})
            // .setOrigin(0.5);
            // this.PlayerPairsObjects.push(rect);
            // this.PlayerPairsObjects.push(text);
        });
    }

    /**@method renderOpponentPairs :It renders the pairs collected by the opponent on screen*/
    renderOpponentPairs(){
        this.opponentPairsObjects.forEach(obj => obj.destroy());
        this.opponentPairsObjects = [];
        const cardsPerRow = 7;

        this.opponentPairs.forEach((card, i) => {
            const col = i % cardsPerRow;
            const row = Math.floor(i / cardsPerRow);
            const image = this.add.image((this.width / 2 + 450) + (col * 70), (this.height / 2 - 450) + (row * 100), `Card${card.number}`)
            .setScale(0.1);
            this.opponentPairsObjects.push(image);

            // const rect = this.add.rectangle((this.width / 2 + 450) + (col * 70), (this.height / 2 - 450) + (row * 130), 60, 110, 0x0000ff);
            // const text = this.add.text(rect.x, rect.y, `${card.number} \n ${card.month}`, {fontSize: "20px", color: "#ffffffff"})
            // .setOrigin(0.5);

            // this.opponentPairsObjects.push(rect);
            // this.opponentPairsObjects.push(text);
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
        this.infoText.setText("Searching pairs...");
        this.time.delayedCall(1000, () => {

            this.searchesPair(card, cardpos); //Looks for a pairs for the chosen card with cards on the table
            this.infoText.setText("Refilling table...");

            this.time.delayedCall(1000, () => {
                this.refill = true; //The refill of the table only happens one time per turn and after the chosen card has found a pair or has been added to the table

                if(this.tableCards[0].length < 7 && this.tableCards[1].length < 7)
                {
                this.cardFromDeck = this.deck.splice(0,1)[0];
                console.log("anotherpair");
                console.log("cardFromDeck", this.cardFromDeck);
                this.searchesPair(this.cardFromDeck, 0);
                }

                this.refill = false; //Reset the variable for next turn
                this.infoText.setText("turn finished");
                console.log("oponentPairss", this.opponentPairs);
                this.playerTurn = !this.playerTurn;
                this.handlesTurns();
            })
        });
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
                    if(numberOfPairs === 1){pos1 = {row: i, col: j}}
                    else if(numberOfPairs === 2){ pos2 = {row: i, col: j}}
                    else if(numberOfPairs === 3){ pos3 = {row: i, col: j}}
                }
            }
        }
        console.log("Pairs found?",numberOfPairs);

        if(numberOfPairs === 1){ //Cuando solo hay una carta del mismo mes en la mesa
            this.tablepos.push(pos1);
            this.infoText.setText("Pair Found");
            this.foundPair(card, cardpos, this.tablepos);
        }
        else if(numberOfPairs > 1){this.selectTablePair(card, cardpos, numberOfPairs, pos1, pos2, pos3);}
        else if (numberOfPairs < 1){
            this.infoText.setText("No pair found");
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
        let randomChoice = 0;
        let finalPos = null;
        if(pairs === 2){randomChoice = Math.floor(Math.random() * 2);}
        else if(pairs === 3){randomChoice = Math.floor(Math.random() * 3);}

        if(randomChoice === 0){finalPos = pos1;}
        else if(randomChoice === 1){ finalPos = pos2;}
        else if(randomChoice === 2){finalPos = pos3;}
        this.tablepos.push(finalPos);

        this.infoText.setText("Pair Found");
        this.foundPair(card, cardpos, this.tablepos);
    }

    /** 
     * @method foundPair :The turn only changes the origin and final arrays. Before refilling the table it will add the card chosen by the player/opponent from the player/opponent array 
     * to the player/opponent pairs array, and if it's refilling, it will add the deck card to the player/opponent pairs array. In both cases the pair card on the table 
     * will be added to the pairs array. It will do the pairs arrays render according to the turn.*/
    foundPair(card, cardpos, tablecardPos){
        if(this.playerTurn == true){
            if(this.refill == false) {this.playerPairs.push(this.playerCards.splice(cardpos, 1)[0]);}
            else {this.playerPairs.push(card);}
           
            this.playerPairs.push(this.tableCards[tablecardPos[0].row].splice(tablecardPos[0].col, 1)[0]);
            this.renderPlayerPairs();
            this.checkYakus(true);
        }
        else {
            if(this.refill === false) { this.opponentPairs.push(this.opponentCards.splice(cardpos, 1)[0]);}
            else {this.opponentPairs.push(card);} //Pone la carta del deck

            this.opponentPairs.push(this.tableCards[tablecardPos[0].row].splice(tablecardPos[0].col, 1)[0]); //Coloca 
            this.renderOpponentPairs();
            this.checkYakus(false);
        }
    }

    /**@method pairNotFound : Before refilling the table, It eliminates the chosen card from it's original array and adds it to the table array. If during the table refill this method is called, it will add the card from the deck to the table.*/
    pairNotFound(cardpos){
        let row = 0;
        if(this.tableCards[0].length < this.tableCards[1].length){row = 0;}
        else if (this.tableCards[0].length > this.tableCards[1].length) {row = 1;}

        if(this.refill == false){ //If the table hasn't been refilled yet 
            if(this.playerTurn == true){this.tableCards[row].push(this.playerCards.splice(cardpos,1)[0]);}
            else {this.tableCards[row].push(this.opponentCards.splice(cardpos,1)[0]);}
        }
        else{this.tableCards[row].push(this.cardFromDeck);} //If The table is refilling then add deck card 
    }

    handlesTurns(){

         if (this.gamePaused) 
        {
        return;
        }
        if (this.playerCards.length === 0 && this.opponentCards.length === 0) {
            this.infoText.setText("Round Finished");
            this.round++;
            return;
        }
        this.roundText.setText("Round: " + this.round);

        if(this.playerTurn == false) {
            this.infoText.setText("Opponent's turn");
            this.time.addEvent({
                delay: 500,
                callback: this.handleOpponentTurn,
                callbackScope: this
            });  
        }
        else{
            this.infoText.setText("Your turn");
            this.time.delayedCall(1000, () => this.infoText.setText("Choose a card"));
            
            this.PlayerCardsObjects.forEach((cardObject, index) => {

                cardObject.setInteractive();
                cardObject.on('pointerover', () => cardObject.setScale(0.22));
                cardObject.on('pointerout', () => cardObject.setScale(0.2));
                cardObject.on('pointerdown', () => {
                    this.onCardSelected(this.playerCards[index], index);
                });
            });
        }
    }

    onCardSelected(card, cardPos){
        this.PlayerCardsObjects.forEach(obj => {
            obj.clearTint();
            obj.disableInteractive();
        });
        console.log("Player selected:", card);
        this.table(card, cardPos);
        
        
    }

    handleOpponentTurn(){
        this.time.delayedCall(1000, ()=> {
            this.infoText.setText("Choosing Card...")
            this.time.delayedCall(1000, ()=>{
                let opponentChoice = Math.floor(Math.random() * this.opponentCards.length);
                this.table(this.opponentCards[opponentChoice], opponentChoice);
            });
        });
    }

closeYakuPopup() {
    if (!this.yakuPopup) return;

    const { overlay, box, title, yakuText, pointsText, koiBtn, shobuBtn, okBtn } = this.yakuPopup;
    if (overlay && overlay.destroy) overlay.destroy();
    if (box && box.destroy) box.destroy();
    if (title && title.destroy) title.destroy();
    if (yakuText && yakuText.destroy) yakuText.destroy();
    if (pointsText && pointsText.destroy) pointsText.destroy();
    if (koiBtn && koiBtn.destroy) koiBtn.destroy();
    if (shobuBtn && shobuBtn.destroy) shobuBtn.destroy();
    if (okBtn && okBtn.destroy) okBtn.destroy();
    this.yakuPopup = null;
    this.gamePaused = false;
}

checkYakus(isPlayer) {
    const pairs = isPlayer ? this.playerPairs : this.opponentPairs;
    const result = calculateYakus(pairs);

    if (!result || !Array.isArray(result.yakus) || result.yakus.length === 0) {
        return;
    }

    const lastYaku = result.yakus[result.yakus.length - 1];
    const points = result.totalPoints;

    if (isPlayer) {
        this.showYakuPlayer(lastYaku, points)
        .setStrokeStyle(6, 0xaa0000)
        .setDepth(10000);

        const title = this.add.text(this.width/2, this.height/2 - 140, "Has conseguido un Yaku", { fontSize: "48px", color: "#000" })
        .setOrigin(0.5).setDepth(10001);

        const yakuText = this.add.text(this.width/2, this.height/2 - 40, "Combination: " + yaku, { fontSize: "38px", color: "#000" })
        .setOrigin(0.5).setDepth(10001);

        const pointsText = this.add.text(this.width/2, this.height/2 + 40, "Puntos: " + points, { fontSize: "32px", color: "#444" })
         this.endRoundForShobu('player', points);
        
        const koiBtn = this.add.text(this.width/2 - 170, this.height/2 + 150, "Koi-Koi", {
            fontSize: "36px", backgroundColor: "#0077cc", padding: { x: 25, y: 10 }, color: "#fff"
        }).setOrigin(0.5).setInteractive().setDepth(10002);

        const shobuBtn = this.add.text(this.width/2 + 170, this.height/2 + 150, "Shōbu", {
            fontSize: "36px", backgroundColor: "#cc0044", padding: { x: 25, y: 10 }, color: "#fff"
        }).setOrigin(0.5).setInteractive().setDepth(10002);

        this.yakuPopup = { overlay, box, title, yakuText, pointsText, koiBtn, shobuBtn };
        koiBtn.removeAllListeners?.();
        shobuBtn.removeAllListeners?.();

        koiBtn.on("pointerdown", () => {
            this.gamePaused = false;
            this.closeYakuPopup();
            this.handlesTurns();
        });

        shobuBtn.on("pointerdown", () => {
            console.log("Jugador elige Shobu (termina la ronda)");
            this.closeYakuPopup();
            if (this.endRoundForShobu) {
                this.endRoundForShobu('player', points);
            } else {
                this.gamePaused = true;
                this.infoText.setText("Round ended (shobu)");
            }
        });
    } 
    // else {
    //     this.gamePaused = true;
    //     this.infoText.setText("Round ended (shobu)");
    // }

}

showYakuPlayer(yaku, points) {
    if (this.yakuPopup) this.closeYakuPopup();

    this.gamePaused = true;
    const overlay = this.add.rectangle(this.width/2, this.height/2, this.width, this.height, 0x000000, 0.6)
        .setDepth(9000)
        .setInteractive();

    const box = this.add.rectangle(this.width/2, this.height/2, 900, 500, 0xffffff, 1)
        .setStrokeStyle(6, 0xaa0000)
        .setDepth(10000);

    const title = this.add.text(this.width/2, this.height/2 - 140, "Has conseguido un Yaku", { fontSize: "48px", color: "#000" })
        .setOrigin(0.5).setDepth(10001);

    const yakuText = this.add.text(this.width/2, this.height/2 - 40, "Combination: " + yaku, { fontSize: "38px", color: "#000" })
        .setOrigin(0.5).setDepth(10001);

    const pointsText = this.add.text(this.width/2, this.height/2 + 40, "Puntos: " + points, { fontSize: "32px", color: "#444" })
        .setOrigin(0.5).setDepth(10001);

    const koiBtn = this.add.text(this.width/2 - 170, this.height/2 + 150, "Koi-Koi", {
        fontSize: "36px", backgroundColor: "#0077cc", padding: { x: 25, y: 10 }, color: "#fff"
    }).setOrigin(0.5).setInteractive().setDepth(10002);

    const shobuBtn = this.add.text(this.width/2 + 170, this.height/2 + 150, "Shōbu", {
        fontSize: "36px", backgroundColor: "#cc0044", padding: { x: 25, y: 10 }, color: "#fff"
    }).setOrigin(0.5).setInteractive().setDepth(10002);

    this.yakuPopup = { overlay, box, title, yakuText, pointsText, koiBtn, shobuBtn };
    koiBtn.removeAllListeners?.();
    shobuBtn.removeAllListeners?.();

    koiBtn.on("pointerdown", () => {
        this.gamePaused = false;
        this.closeYakuPopup();
        this.handlesTurns();
    });

    shobuBtn.on("pointerdown", () => {
        console.log("Jugador elige Shobu (termina la ronda)");
        this.closeYakuPopup();
        if (this.endRoundForShobu) {
            this.endRoundForShobu('player', points);
        } else {
            this.gamePaused = true;
            this.infoText.setText("Round ended (shobu)");
        }
    });
}

showYakuEnemy(yaku, points) {
    if (this.yakuPopup) this.closeYakuPopup();

    this.gamePaused = true;

    const overlay = this.add.rectangle(
        this.width/2, this.height/2, this.width, this.height,
        0x000000, 0.6
    )
        .setDepth(9000)
        .setInteractive();

    const box = this.add.rectangle(
        this.width/2, this.height/2, 900, 420,
        0xffffff, 1
    )
        .setStrokeStyle(6, 0xaa0000)
        .setDepth(10000);

    const title = this.add.text(
        this.width/2, this.height/2 - 120,
        "El oponente consigui un Yaku",
        { fontSize: "40px", color: "#000" }
    ).setOrigin(0.5).setDepth(10001);

    const yakuText = this.add.text(
        this.width/2, this.height/2 - 30,
        "Combination: " + yaku,
        { fontSize: "32px", color: "#000" }
    ).setOrigin(0.5).setDepth(10001);

    const pointsText = this.add.text(
        this.width/2, this.height/2 + 40,
        "Puntos: " + points,
        { fontSize: "28px", color: "#333" }
    ).setOrigin(0.5).setDepth(10001);

    this.yakuPopup = { overlay, box, title, yakuText, pointsText };
}

enemyYaku(yaku, points) {
    this.showYakuEnemy(yaku, points);

    const choosesShobu = Math.random() >= 0.9;

    if (choosesShobu) {
        console.log("El enemigo elige Shobu, terminar ronda");

        this.time.delayedCall(1000, () => {
            this.closeYakuPopup();

            if (this.endRoundForShobu) {
                this.endRoundForShobu("opponent", points);
            } else {
                this.infoText.setText("Round ended by opponent Shobu");
            }
        });

    } else {
        console.log("El enemigo elige KoiKki, continua");
        this.time.delayedCall(1000, () => {
            this.closeYakuPopup();
            this.handlesTurns();
        });
    }
}


}