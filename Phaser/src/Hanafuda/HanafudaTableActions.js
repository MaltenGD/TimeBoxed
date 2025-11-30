export default class HanafudaTableActions{

    constructor(scene){
        this.scene = scene;
        this.tablepos = [];
    }

    /**@method searchesPair : it Compares the month of the card received with the month of the cards on the table, if they match the number of pair counter increases */
    searchesPair(card){
        this.scene.pos1 = {row: 0, col: 0};
        this.scene.pos2 = {row: 0, col: 0};
        this.scene.pos3 = {row: 0, col: 0};

        this.scene.numberOfPairs = 0;

        for(let i = 0; i < this.scene.tableCards.length; ++i){
            for(let j = 0; j < this.scene.tableCards[i].length; ++j){
                const tableCard = this.scene.tableCards[i][j];

            //evitar error si la carta no existe
            if (!tableCard) {
                console.warn(" tableCard es null/undefined en", i, j);
                continue;
            }

            if (card.month === tableCard.month) {
                this.scene.numberOfPairs++;
                    if(this.scene.numberOfPairs === 1){this.scene.pos1 = {row: i, col: j}}
                    else if(this.scene.numberOfPairs === 2){this.scene.pos2 = {row: i, col: j}}
                    else if(this.scene.numberOfPairs === 3){this.scene.pos3 = {row: i, col: j}}
                }
            }
        }
        console.log("Pairs found?",this.scene.numberOfPairs);
        console.log("positions", this.scene.pos1, this.scene.pos2, this.scene.pos3);
    }

    /**
     *  @param {number} pairs :number of different pairs on the table
     *  @method selectTablePair 
     * :It chooses a position randomly of the different positions of pairs on the table 
     * */
    selectTablePair(pairs){
        let randomChoice = 0;
        if(pairs === 2){randomChoice = Math.floor(Math.random() * 2);}
        else if(pairs === 3){randomChoice = Math.floor(Math.random() * 3);}

        if(randomChoice === 0){this.scene.finalPos = this.scene.pos1;}
        else if(randomChoice === 1){this.scene.finalPos = this.scene.pos2;}
        else if(randomChoice === 2){this.scene.finalPos = this.scene.pos3;}
    }

    /** 
     * @param {number} cardpos :position of the chosen card inside it's respective array
     * @param {tablecardPos} tablecardPos:position of the chosen table card
     * @method foundPair :Depending on whose turn it is, it only changes the origin and final arrays. Before refilling the table it will add the card chosen by the player/opponent 
     * from the player/opponent array to the player/opponent pairs array, and if it's refilling, it will add the deck card to the player/opponent pairs array. 
     * In both cases the pair card on the table will be added to the pairs array.*/
    foundPair(card, cardpos, tablecardPos){
        if(this.scene.playerTurn){
            if(this.scene.refill == false) {this.scene.playerPairs.push(this.scene.playerCards.splice(cardpos, 1)[0]);}
            else {this.scene.playerPairs.push(this.scene.card);}
           
            this.scene.playerPairs.push(this.scene.tableCards[tablecardPos.row].splice(tablecardPos.col, 1)[0]);
            this.scene.points.checkYakus(true);
        }
        else {
            if(this.scene.refill === false) { this.scene.opponentPairs.push(this.scene.opponentCards.splice(cardpos, 1)[0]);}
            else {this.scene.opponentPairs.push(this.scene.card);}

            this.scene.opponentPairs.push(this.scene.tableCards[tablecardPos.row].splice(tablecardPos.col, 1)[0]);
            this.scene.points.checkYakus(false);
        }
    }

    /**
     * @method pairNotFound :Before refilling the table, It eliminates the chosen card from it's original array and adds it to the table array. 
     * If during the table refill this method is called, it will add the card from the deck to the table.*/
    pairNotFound(cardpos){
        this.scene.emptyRow = 0;
        if(this.scene.tableCards[0].length < this.scene.tableCards[1].length){this.scene.emptyRow = 0;}
        else if (this.scene.tableCards[0].length > this.scene.tableCards[1].length) {this.scene.emptyRow = 1;}

        if(this.scene.refill == false){ //If the table hasn't been refilled yet 
            if(this.scene.playerTurn){this.scene.tableCards[this.scene.emptyRow].push(this.scene.playerCards.splice(cardpos,1)[0]);}
            else {this.scene.tableCards[this.scene.emptyRow].push(this.scene.opponentCards.splice(cardpos,1)[0]);}
        }
        else{this.scene.tableCards[this.scene.emptyRow].push(this.scene.card);} //If The table is refilling then add deck card 
    }

//     checkYakus(isPlayer) {
//     const cards = isPlayer ? this.playerPairs : this.opponentPairs;
//     const { yakus, points } = calculateYakus(cards);

//     if (yakus.length === 0) return;

//     const last = yakus[yakus.length - 1];

//     if (isPlayer) {
//         this.pointsUI.showPlayer(last,points,() => {
//                 this.gamePaused = false;
//                 this.handlesTurns();
//             },() => {
//                 this.gamePaused = true;
//                 this.transitionTo(HANAFUDA_STATE.FINISH_ROUND);
//             }
//         );
//     } else {
//         const shobu = Math.random() < 0.5;

//         if (shobu) {
//             this.pointsUI.showEnemy(last,points,() => this.transitionTo(HANAFUDA_STATE.FINISH_ROUND));
//         } else {this.pointsUI.showEnemy(last,points,() => { this.gamePaused = false; this.handlesTurns(); });
//         }
//     }
// }
}