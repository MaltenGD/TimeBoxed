import HanafudaRender from '../../Hanafuda/HanafudaRender.js';
import HanafudaTableActions from '../../Hanafuda/HanafudaTableActions.js';
import HanafudaPrepareRound from '../../Hanafuda/HanafudaPrepareRound.js';
import TransitionController from "../../misc/transitioncontroller.js";
//import { calculateYakus } from './HanafudaScore.js';
import HanafudaPoints from '../../Hanafuda/HanafudaPoints.js';


/**
 * @readonly
 * @enum {string}
 * @description Defines the states of the game.
 */
export const HANAFUDA_STATE = {
    START_ROUND: 'START_ROUND',
    WAITING_PLAYER: 'WAITING_PLAYER',
    OPPONENT_TURN: 'OPPONENT_TURN',
    TABLE_ACTIONS: 'TABLE_ACTIONS',
    CHECK_END_ROUND: 'CHECK_END_ROUND',
    COMBINATIONS: 'COMBINATIONS',
    FINISH_ROUND: 'FINISH_ROUND',
    END_GAME: 'END_GAME',
};

export class HanafudaGameState extends Phaser.Scene{

    constructor(){
        super('HanafudaGameState');
    }

    init(data){
        this.playerTurn = data.begins;
        this.cleanUp();
    }

    create(playerData){

        this.playerData = playerData;

        //For transitions
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition(); //It shows the transition into the scene from the previous scene.

        //Get Scale
        /** @type {number} it saves the width of the canvas*/
        this.width = this.scale.width;
        /** @type {number} it saves the height of the canvas*/
        this.height = this.scale.height;

        this.render = new HanafudaRender(this,this.width,this.height);
        this.tableAction = new HanafudaTableActions(this);
        this.prepareRound = new HanafudaPrepareRound(this);

        this.cleanUp(); //Initializes the variables that will be used in the game.
        /** @type {number} It counts the number of rounds*/
        this.round = 0;

        /** @type {object} It has the background image */
        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackgroundPlaceholder');

        //Back button
        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 45, fill: '#f0f0f0ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
        this.openOptionMenu();
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.openOptionMenu();
        });

        //render the zones for the board (table, player and opponent cards are here), and two for where the player and opponent collected pairs will be
        this.board = this.add.rectangle(300, 20, 1030, 1040, 0x000000, 0.7).setOrigin(0, 0);
        this.opponentPairZone = this.add.rectangle(this.width/ 2+ 400, 30, 530, 470 , 0x000000, 0.6).setOrigin(0, 0);
        this.playerPairZone = this.add.rectangle(this.width/ 2+ 400, this.height/2 + 20, 530, 470, 0x000000, 0.6).setOrigin(0, 0);
        this.deckZone = this.add.rectangle(110, this.height/2 - 140, 180, 560, 0x000000, 0.6).setOrigin(0, 0);
        this.infoText = this.add.text(370, this.height / 2 + 200, "Start!", {fontSize: '56px', fill: '#ffffffff'}); //Text
        this.roundText = this.add.text(40, 1000, `round:${this.round}/4`, {fontSize: "30px",color: "#ffffff"});
        this.deckObject = this.add.rectangle(200, this.height/2, 200, 350, 0x609C86).setScale(0.6);
        this.deckCardObject = null;

        this.transitionTo(HANAFUDA_STATE.START_ROUND);

        this.points = new HanafudaPoints(this);

    }

    /**
     * @param {HANAFUDA_STATE} newState
     * @method transitionTo : It updates the current state of the game according to the parameter, and calls the state machine method.
     */
    transitionTo(newState) {
        //console.log(`Transition: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
        //console.log(`State: ${this.currentState}`);
        this.handleGameState();
    }

    /** 
     * @method handleGameState : Depending on the current State of the game, it will start a round, wait the input from the player, 
     * make the opponent choose a card, search pairs and refill the table, check combinations,end the game.
    */
    handleGameState(){
        if (this.currentState === "POPUP_BLOCK") {
        console.log("FSM pausada por popup");
        return;
    }

        switch(this.currentState){
            case HANAFUDA_STATE.START_ROUND:
                this.round++; //The round counter is increased when a new round begins
                this.roundText.setText(`round:${this.round}/4`) //The text that shows the number of rounds is updated

                this.prepareRound.createDeck(); //It creates the deck with all the cards
                this.prepareRound.shuffleDeck(); //It suffles the cards, so the probablity of getting pairs together is lower
                this.prepareRound.dealCards(); //It deals cards to the player, the opponent and the table

                this.render.renderOpponentCards();
                this.render.renderPlayerCards();
                this.render.renderTable();

                //Based on whose turn it is, it will go to the state for the player, or the state for the opponent
                this.time.delayedCall(1000, ()=> {
                    if(this.playerTurn) this.transitionTo(HANAFUDA_STATE.WAITING_PLAYER);
                    else this.transitionTo(HANAFUDA_STATE.OPPONENT_TURN);
                }, this);
                
            break;
            case HANAFUDA_STATE.WAITING_PLAYER:

                this.infoText.setText("Choose a card"); //it changes the text on screen
                this.playerCardObjects.forEach((card, index ) => { //make the player cards interactive
                    card.setInteractive()
                    .on('pointerover', () => card.setScale(0.22))
                    .on('pointerout', () => card.setScale(0.2))
                    .on('pointerdown', () => {
                        this.chosenCardPos = index;
                        this.card = this.playerCards[index]; //selected card
                        this.playerCardObjects.forEach(obj => obj.setInteractive(false).off('pointerdown') //deactivates interactive so the player can't select another card
                        .off('pointerover')
                        .off('pointerout'));
                        this.transitionTo(HANAFUDA_STATE.TABLE_ACTIONS); //when a card is selected, the tbale mechanics come in
                    });
                });
            break;
            case HANAFUDA_STATE.OPPONENT_TURN:
                this.infoText.setText("Opponent is thinking");//it changes the text on screen
                this.chosenCardPos = Math.floor(Math.random() * this.opponentCards.length); //random selection
                this.card = this.opponentCards[this.chosenCardPos];//selected card

                this.time.delayedCall(1000, ()=> {
                    this.infoText.setText("Opponent has chosen a card!"); //

                    let chosenCardObject = this.opponentCardObjects[this.chosenCardPos];
                    this.tweens.add({ //card poking out of the opponent hand animation
                        targets: chosenCardObject, y: chosenCardObject.y + 50,duration: 300, ease: 'Power2',
                    });
                    
                    this.time.delayedCall(1000, ()=> {
                        this.infoText.setText("searching pairs...");//it changes the text on screen
                        this.transitionTo(HANAFUDA_STATE.TABLE_ACTIONS);
                    }, this);
                },this);
            break;
            case HANAFUDA_STATE.TABLE_ACTIONS:
                this.infoText.setText("searching pairs...");//it changes the text on screen
                
                this.refill = false;//no refill yet, it only search for matches of selected card with table pair
                this.numberOfPairs = 0;

                this.tableAction.searchesPair(this.card);

                this.time.delayedCall(2000, ()=>{
                    this.selectPair();
                
                    this.time.delayedCall(1000, ()=>{
                        this.infoText.setText("arranging cards");//it changes the text on screen
                        this.renderCards(); //render of updated cards
                        
                        //The refill happens, second search is done but with a card from the deck
                        this.refill = true;
                        this.time.delayedCall(800, ()=> {
                            this.infoText.setText("Getting card from deck");//it changes the text on screen
                            this.card = this.deck.splice(0,1)[0]; // It gets last card from the deck
                            if (!this.card) {
                console.warn("⚠ Se intentó coger carta del deck pero estaba vacío");
                this.transitionTo(HANAFUDA_STATE.CHECK_END_ROUND);
                return;
            }
                            this.tweens.add({ //deck chosen card getting out of the deck animation
                                targets: this.deckObject, scaleX: 0.7, scaleY: 0.7, duration: 200, ease: 'Power2',yoyo: true,
                            });

                            this.render.renderDeckCard(); //renders the card selected from deck, for visual purposes
                            console.log("deckcard", this.card);

                            this.time.delayedCall(1800, ()=> {
                                this.tableAction.searchesPair(this.card);
                                this.selectPair();
                                this.deckCardObject.destroy(); //destroy deck card, so it doesn't linger on scene because it is added to the table or the pairs
                                this.renderCards();
                                this.transitionTo(HANAFUDA_STATE.CHECK_END_ROUND);

                            },this);
                        }, this);
                    }, this);
                }, this);
                
            break;
            case HANAFUDA_STATE.CHECK_END_ROUND:

                this.time.delayedCall(1000, ()=> {
                    if(this.playerCards.length === 0 && this.opponentCards.length === 0) //When no one has any cards left, the round finishes
                        this.transitionTo(HANAFUDA_STATE.FINISH_ROUND); //Here we have to add combinations
                    else{
                        this.playerTurn = !this.playerTurn; //Now it's turn of the opposite party

                        this.time.delayedCall(1000, ()=> {
                            if(this.playerTurn){ //changes state to the right state according to whose turn it is
                                this.infoText.setText("Your Turn");//it changes the text on screen
                                this.time.delayedCall(800, ()=> {this.transitionTo(HANAFUDA_STATE.WAITING_PLAYER);}, this);
                            }
                            else {
                                this.infoText.setText("Opponent's Turn");//it changes the text on screen
                                this.time.delayedCall(1000, ()=> {this.transitionTo(HANAFUDA_STATE.OPPONENT_TURN);}, this);
                            }
                        }, this)
                    }
                }, this);
            break;
            case HANAFUDA_STATE.FINISH_ROUND:
                console.log('roundFinished');

                //Destroy the objects on scene, so it can prepare for a new round or the end of the game
                this.opponentCardObjects.forEach(obj => obj.destroy())
                this.tableCardObjects.forEach(row => { row.forEach(card => card.destroy());});
                this.playerCardObjects.forEach(obj => obj.destroy());
                this.playerPairsObjects.forEach(obj => obj.destroy());
                this.opponentPairsObjects.forEach(obj => obj.destroy());
                this.cleanUp();

                console.log("roundCounter",this.round);
                this.time.delayedCall(1000, ()=> {
                    if(this.round < 4){ //a new round will start unless all the set rounds are completed, in which case the game ends
                    this.transitionController.startFadeInTransition();
                    this.transitionController.startFadeOutTransition();
                    this.transitionController.startFadeInTransition();
                    this.transitionTo(HANAFUDA_STATE.START_ROUND);
                    }
                    else{this.transitionTo(HANAFUDA_STATE.END_GAME);}
                }, this)
               
            break;
            case HANAFUDA_STATE.END_GAME:
                console.log("Game done");
                this.infoText.setText("Game Finished!")
            break;
        }
    }

    selectPair(){
        if(this.numberOfPairs === 1){
            this.infoText.setText("Pair Found");
            this.tableAction.foundPair(this.card, this.chosenCardPos, this.pos1);
        }
        else if(this.numberOfPairs > 1){
            this.infoText.setText("Pair Found");
            this.finalPos = null;
            this.tableAction.selectTablePair(this.numberOfPairs);
            this.tableAction.foundPair(this.card, this.chosenCardPos, this.finalPos);
        }
        else if (this.numberOfPairs < 1){
            if(this.refill)this.infoText.setText("Table is refilled");
            else {this.infoText.setText("No pair found");}
            this.tableAction.pairNotFound(this.chosenCardPos);
            //this.render.renderNewCardToTable(this.card, this.tableCards[this.emptyRow].length, this.emptyRow);
        }
    }

    cleanUp(){
        /**@type {Array} deck cards */
        this.deck = [];
        /** @type {Array} player cards */
        this.playerCards = [];
        /**@type {Array} Opponent cards */
        this.opponentCards = [];
        /** @type {Array} cards on the table*/
        this.tableCards = [];
        /** @type {Array} player pairs */
        this.playerPairs = [];
        /** @type {Array} opponent pairs */
        this.opponentPairs = [];
        /** @type {Array} :It contains the images of the player cards*/
        this.playerCardObjects = [];
        /** @type {Array} :It contains the images of the opponent cards*/
        this.opponentCardObjects = [];
        /** @type {Array} :It contains the images of the cards on the table*/
        this.tableCardObjects = [];
        /** @type {Array} :It contains the images of the player pairs*/
        this.playerPairsObjects = [];
        /** @type {Array} :It contains the images of the opponent pairs*/
        this.opponentPairsObjects = [];
        /**@type {number} :counter of pairs on the table*/
        this.numberOfPairs = 0;
        /**@type {card} : It contains the number and month of the chosen card card*/
        this.card = null;
        /** @type {boolean}: It indicates if it's doing the table refill or not*/
        this.refill = false;
        /** @type {number} : It indicates which row of the table a new card should go to*/
        this.emptyRow = 0;
    }

    openOptionMenu(){
        if (this.scene.isActive('OptionMenu')) return;
        this.scene.pause();
        this.playerData.SceneToResume = this.scene.key;
        this.scene.launch('OptionMenu', this.playerData);
    }

    renderCards(){
        this.render.renderOpponentCards();
        this.render.renderPlayerCards();
        if (this.numberOfPairs > 0) {
            if(this.playerTurn)this.render.renderPlayerPairs();
            else this.render.renderOpponentPairs();
        }
        this.render.renderTable();
    }
}