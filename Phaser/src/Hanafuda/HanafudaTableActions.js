export default class HanafudaTableActions{

    constructor(scene){
        this.scene = scene;
        this.tablepos = [];
    }

    searchesPair(card){//Good
        //Contador para saber cuantas cartas del mismo mes hay en la mesa
        this.scene.pos1 = {row: 0, col: 0};
        this.scene.pos2 = {row: 0, col: 0};
        this.scene.pos3 = {row: 0, col: 0};

        this.scene.numberOfPairs = 0;

        for(let i = 0; i < this.scene.tableCards.length; ++i){
            for(let j = 0; j < this.scene.tableCards[i].length; ++j){
                if(card.month === this.scene.tableCards[i][j].month){ //Comprueba si la carta elegida tiene algun par en la mesa (los meses deben coincidir)
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

    selectTablePair(pairs){
        let randomChoice = 0;
        if(pairs === 2){randomChoice = Math.floor(Math.random() * 2);}
        else if(pairs === 3){randomChoice = Math.floor(Math.random() * 3);}

        if(randomChoice === 0){this.scene.finalPos = this.scene.pos1;}
        else if(randomChoice === 1){this.scene.finalPos = this.scene.pos2;}
        else if(randomChoice === 2){this.scene.finalPos = this.scene.pos3;}
    }

    foundPair(card, cardpos, tablecardPos){
        if(this.scene.playerTurn){
            if(this.scene.refill == false) {this.scene.playerPairs.push(this.scene.playerCards.splice(cardpos, 1)[0]);}
            else {this.scene.playerPairs.push(this.scene.card);}
           
            this.scene.playerPairs.push(this.scene.tableCards[tablecardPos.row].splice(tablecardPos.col, 1)[0]);
        }
        else {
            if(this.scene.refill === false) { this.scene.opponentPairs.push(this.scene.opponentCards.splice(cardpos, 1)[0]);}
            else {this.scene.opponentPairs.push(this.scene.card);} //Pone la carta del deck

            this.scene.opponentPairs.push(this.scene.tableCards[tablecardPos.row].splice(tablecardPos.col, 1)[0]); //Coloca 
        }
    }

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

}