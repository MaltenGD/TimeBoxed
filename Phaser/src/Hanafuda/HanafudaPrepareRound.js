export default class HanafudaPrepareRound{
     constructor(scene)
    {
        this.scene = scene;
        this.rows = 2;
        this.cols = 4;
        /** @type {Array} :It contains the counters of each month*/
        this.monthCounter = [];
    }

    /**
     * @method createDeck :Inserts into the deck array 48 cards, with 48 numbers and 12 months in number format. 
     * It also initializes the monthCounter array with twelve zeros*/
    createDeck() {
        let number = 0;
        this.monthCounter = [];

        for (let month = 0; month < 12; month++) {
            for (let i = 0; i < 4; i++){
                this.scene.deck.push({ number, month });
                number++;
            }
            this.monthCounter.push({month: month, count:0});
        }
    }

    /**
     * @method suffleDeck :It gets random positions and swaps the cards elements according to that positions*/
    shuffleDeck() {
        for (let i = this.scene.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.scene.deck[i], this.scene.deck[j]] = [this.scene.deck[j], this.scene.deck[i]];
        }
    }

     /**
     * @method dealCards : It gives 8 cards, from the table array, to the Player array, 8 to the opponent array and 8 to the table array.
     * It also checks that a 4 cards from the same month aren't on the table array, or else it returns the cards to the deck, and calls suffleDeck and dealcards Mehtods.
     */
    dealCards() {
        this.scene.playerCards = this.scene.deck.splice(0, 8); //8 cards from deck to player
        this.scene.opponentCards = this.scene.deck.splice(0, 8); //8 cards from deck to opponent

        for(let i = 0; i < this.rows; ++i){ //8 cards from deck to table, that will be an array of arrays
            this.scene.tableCards[i] = [];
            for(let j = 0; j < this.cols; ++j){
                this.scene.tableCards[i][j] = this.scene.deck.splice(0, 1)[0];
            }
        }

        console.log("tablecards", this.scene.tableCards);

        //Table array cannot contain a whole month, so we count how many cards of each month there are
        for(let i = 0; i < this.scene.tableCards.length; ++i){
            for(let h = 0; h < this.scene.tableCards[i].length; ++h){
                for(let j = 0; j < this.monthCounter.length; ++j){
                    if(this.scene.tableCards[i][h].month === this.monthCounter[j].month)this.monthCounter[j].count++;
                }
            }
        }

        /**boolean to indicate if there's 4 cards from the same month on the table */
        let wholeMonth = false;
        this.monthCounter.forEach(month => { //check to see if any month Counter is 4
            if(month.count === 4) {wholeMonth = true;}
        });
        
        if (wholeMonth){ //if a whole month is on the table, the cards are returned to the deck and it is suffled and dealt again.
            this.scene.deck.push(this.scene.playerCards, this.scene.opponentCards);
            this.scene.deck.push(this.scene.tableCards.flat());
            this.shuffleDeck();
            this.dealCards();
        }
    }
}