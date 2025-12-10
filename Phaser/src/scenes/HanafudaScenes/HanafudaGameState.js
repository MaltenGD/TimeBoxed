import HanafudaRender from '../../Hanafuda/HanafudaRender.js';
import HanafudaTableActions from '../../Hanafuda/HanafudaTableActions.js';
import HanafudaPrepareRound from '../../Hanafuda/HanafudaPrepareRound.js';
import TransitionController from "../../misc/transitioncontroller.js";
import HanafudaPoints from '../../Hanafuda/HanafudaPoints.js';
import { BaseScene } from '../BaseScene.js';

/**
 * @readonly
 * @enum {string}
 * @description Defines the states of the game.
 */
export const HANAFUDA_STATE = {
    START_ROUND: 'START_ROUND',
    WAITING_PLAYER: 'WAITING_PLAYER',
    OPPONENT_TURN: 'OPPONENT_TURN',
    SEARCH_ACTION: 'SEARCH_ACTION',
    REFILL_ACTION: 'REFILL_ACTION',
    SHOW_YAKUS: 'SHOW_YAKUS',
    CHECK_END_ROUND: 'CHECK_END_ROUND',
    FINISH_ROUND: 'FINISH_ROUND',
    END_GAME: 'END_GAME',
};

export class HanafudaGameState extends BaseScene{

    constructor(){
        super('HanafudaGameState');
    }

    init(data){
        super.init(data);
        this.playerTurn = data.begins;
        this.cleanUp();
    }

    async create(data){

        this.playerData = data.playerData;
        
        await document.fonts.load('64px CenturyGothic');
        //For transitions
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition(); //It shows the transition into the scene from the previous scene.

        // Wait for the custom font to be loaded before creating any text
        // The font size here doesn't matter, it just ensures the font family is ready.

        //Get Scale
        /** @type {number} it saves the width of the canvas*/
        this.width = this.scale.width;
        /** @type {number} it saves the height of the canvas*/
        this.height = this.scale.height;

        this.render = new HanafudaRender(this,this.width,this.height);
        this.tableAction = new HanafudaTableActions(this);
        this.prepareRound = new HanafudaPrepareRound(this);
        this.points = new HanafudaPoints(this);

        // Background music
        const baseMusicVolume = 0.25;
        this.music = this.sound.add('japaneseMusic', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
        this.soundInstances.push({ 
            sound: this.music, 
            type: 'music', 
            baseVolume: baseMusicVolume 
        });
        this.music.play();

        // Unlock audio on the first user interaction
        this.sound.pauseOnBlur = false; // Keep audio playing even when the window loses focus.
        
        this.cleanUp(); //Initializes the variables that will be used in the game.
        /** @type {number} It counts the number of rounds*/
        this.round = 0;
        /**@type {number} saves the player's score*/
        this.playerScore = 0;
        /**@type {number} saves the opponent's score*/
        this.opponentScore = 0;

        this.lastRoundWinner = null;
        this.lastRoundPoints = 0;

        this.koikoiActivePlayer = false;
        this.koikoiActiveEnemy = false;

        this.koikoiAccumulatedPlayer = 0;
        this.koikoiAccumulatedEnemy = 0;

        /** @type {object} It has the background image */
        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackgroundPlaceholder');
        
        this.render.renderZones();//render the zones for the board (table, player and opponent cards are here), and two for where the player and opponent collected pairs will be
        this.render.uiRender(); //render UI (buttons, text)

        //Deck render
        this.deckObject = this.add.rectangle(170, this.height/2, 200, 350, 0x609C86).setScale(0.6);
        this.deckCardObject = null;

        this.transitionTo(HANAFUDA_STATE.START_ROUND);
    }

    /**
     * @param {HANAFUDA_STATE} newState
     * @method transitionTo : It updates the current state of the game according to the parameter, and calls the state machine method.
     */
    transitionTo(newState) {
        this.currentState = newState;
        this.handleGameState();
    }

    /** 
     * @method handleGameState : Depending on the current State of the game, it will start a round, wait the input from the player, 
     * make the opponent choose a card, search pairs and refill the table, check combinations,end the game.
    */
    handleGameState(){
        switch(this.currentState){
            case HANAFUDA_STATE.START_ROUND:
                this.round++; //The round counter is increased when a new round begins
                this.roundText.setText(`Round:${this.round}/4`) //The text that shows the number of rounds is updated

                this.prepareRound.createDeck(); //It creates the deck with all the cards
                this.prepareRound.shuffleDeck(); //It suffles the cards, so the probablity of getting pairs together is lower
                this.prepareRound.dealCards(); //It deals cards to the player, the opponent and the table
                this.renderCards(); //Initial render

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
                        this.transitionTo(HANAFUDA_STATE.SEARCH_ACTION); //when a card is selected, the tbale mechanics come in
                    });
                });
            break;
            case HANAFUDA_STATE.OPPONENT_TURN:
                this.infoText.setText("Opponent is thinking");//it changes the text on screen

                this.chosenCardPos = Math.floor(Math.random() * this.opponentCards.length); //random selection
                this.card = this.opponentCards[this.chosenCardPos];//selected card

                this.time.delayedCall(900, ()=> {
                    this.infoText.setText("Opponent has chosen a card!"); //it changes the text on screen

                    let chosenCardObject = this.opponentCardObjects[this.chosenCardPos];
                    //card poking out of the opponent hand animation
                    this.tweens.add({ 
                        targets: chosenCardObject, y: chosenCardObject.y + 30,duration: 300, ease: 'Power2', 
                    });
                    
                    this.time.delayedCall(1000, ()=> {this.transitionTo(HANAFUDA_STATE.SEARCH_ACTION);});
                });
            break;
            case HANAFUDA_STATE.SEARCH_ACTION:
                
                this.infoText.setText("Searching pairs...");//it changes the text on screen
                this.refill = false;//no refill yet, it only search for matches of selected card with table pair
                this.numberOfPairs = 0;

                this.tableAction.searchesPair(this.card);

                this.time.delayedCall(800, ()=>{
                    this.selectPair();

                    this.time.delayedCall(1000, ()=>{
                        this.infoText.setText("Arranging cards");//it changes the text on screen
                        this.renderCards(); //render of updated cards

                        this.time.delayedCall(800, ()=>{
                            this.previousState = this.currentState;
                            this.combinationAction();
                        });
                    });
                });
            break;
            case HANAFUDA_STATE.REFILL_ACTION:
                //The refill happens, second search is done but with a card from the deck
                this.refill = true;

                this.time.delayedCall(800, ()=> {

                    this.infoText.setText("Getting card from deck");//it changes the text on screen
                    this.card = this.deck.splice(0,1)[0]; // It gets last card from the deck

                    if (!this.card) {
                        console.log(" Se intentó coger carta del deck pero estaba vacío");
                        this.transitionTo(HANAFUDA_STATE.CHECK_END_ROUND);
                    }
                    this.tweens.add({ //deck chosen card getting out of the deck animation
                        targets: this.deckObject, scaleX: 0.7, scaleY: 0.7, duration: 200, ease: 'Power2',yoyo: true,
                    });

                    this.render.renderDeckCard(); //renders the card selected from deck, for visual purposes
                    console.log("deckcard", this.card);

                    this.time.delayedCall(1200, ()=> {
                        this.tableAction.searchesPair(this.card);
                        this.selectPair();
                        this.deckCardObject.destroy(); //destroy deck card, so it doesn't linger on scene because it is added to the table or the pairs
                        this.renderCards();

                        this.time.delayedCall(800, ()=>{
                            this.previousState = this.currentState;
                            this.combinationAction();
                        });
                    });
                });   
            break;
            case HANAFUDA_STATE.SHOW_YAKUS:
                console.log("combination"); 
                this.points.checkYakus();
            break;
            case HANAFUDA_STATE.CHECK_END_ROUND:

                this.time.delayedCall(1000, ()=> {
                    if(this.playerCards.length === 0 && this.opponentCards.length === 0) //When no one has any cards left, the round finishes
                        this.transitionTo(HANAFUDA_STATE.FINISH_ROUND); //Here we have to add combinations
                    else{
                        this.playerTurn = !this.playerTurn; //Now it's turn of the opposite party

                        this.time.delayedCall(800, ()=> {
                            if(this.playerTurn){ //changes state to the right state according to whose turn it is
                                this.infoText.setText("Your Turn");//it changes the text on screen
                                this.time.delayedCall(800, ()=> {this.transitionTo(HANAFUDA_STATE.WAITING_PLAYER);}, this);
                            }
                            else {
                                this.infoText.setText("Opponent's Turn");//it changes the text on screen
                                this.time.delayedCall(900, ()=> {this.transitionTo(HANAFUDA_STATE.OPPONENT_TURN);}, this);
                            }
                        }, this)
                    }
                }, this);
            break;
            case HANAFUDA_STATE.FINISH_ROUND:

                if (this.lastRoundWinner === "player") {
                    this.playerScore += this.lastRoundPoints;
                    this.playerPointsText.setText(`Player points: ${this.playerScore}`);
                }
                else if (this.lastRoundWinner === "opponent") {
                    this.opponentScore += this.lastRoundPoints;
                    this.opponentPointsText.setText(`Benten points: ${this.opponentScore}`);
                }
                this.transitionController.startFadeInTransition();
                this.blackScreen =this.add.rectangle(0, 0, this.width, this.height, 0x000000).setOrigin(0, 0);
                this.infoText.setText("Starting next round");

                //Destroy the objects on scene, so it can prepare for a new round or the end of the game
                this.opponentCardObjects.forEach(obj => obj.destroy())
                this.tableCardObjects.forEach(row => { row.forEach(card => card.destroy());});
                this.playerCardObjects.forEach(obj => obj.destroy());
                this.playerPairsObjects.forEach(obj => obj.destroy());
                this.opponentPairsObjects.forEach(obj => obj.destroy());
                this.cleanUp(); 

                console.log("roundCounter",this.round);
                this.time.delayedCall(2000, ()=> {
                    if(this.round < 2){ //a new round will start unless all the set rounds are completed, in which case the game ends
                        this.transitionController.startFadeInTransition();
                        this.blackScreen.destroy();
                        this.transitionTo(HANAFUDA_STATE.START_ROUND);
                    }
                    else{this.transitionTo(HANAFUDA_STATE.END_GAME);}
                }, this)
               
            break;
            case HANAFUDA_STATE.END_GAME:

                this.infoText.setText("Game Finished!");
                if(this.playerScore > this.opponentScore) this.playerData.hanafudaCompleted = true;
                else this.playerData.hanafudaCompleted = false;
                this.scene.start('HanafudaEndScene', this.playerData);
            break;
        }
    }

    /**
     * @method selectPair :Depending on the number of pairs found in the array table, it will call founPair, selectTablepair
     * or pairnotfound methods
     */
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
        }
    }

    /**
     * @method cleanUp :It sets each variable inside it to its original values
     */
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

        this.previousState = null;
    }

    /**
     * @method combinationAction : Checks if there's a combination formed within a pair array, in case there is one
     * it will change the state to Show_Yakus, if not if will continue to the next state of the current scene*/
    combinationAction(){
        const pairs = this.playerTurn ? this.playerPairs : this.opponentPairs;
        if (this.points.hasCombinations(pairs)) this.transitionTo(HANAFUDA_STATE.SHOW_YAKUS);
        else{
            if(this.currentState === HANAFUDA_STATE.SEARCH_ACTION) this.transitionTo(HANAFUDA_STATE.REFILL_ACTION);
            else this.transitionTo(HANAFUDA_STATE.CHECK_END_ROUND);
        }
    }

    openYakusMenu() {
        if (this.scene.isActive('YakusMenu')) return;
        this.scene.pause();
        this.playerData.sceneToResume = this.scene.key;
        this.scene.launch('YakusMenu', this.playerData);
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