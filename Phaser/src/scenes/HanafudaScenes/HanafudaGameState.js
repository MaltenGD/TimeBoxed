import HanafudaRender from '../../Hanafuda/HanafudaRender.js'
import HanafudaTableActions from '../../Hanafuda/HanafudaTableActions.js'
import HanafudaPrepareRound from '../../Hanafuda/HanafudaPrepareRound.js'
import { OptionMenuScene } from '../OptionMenuScene.js';
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";


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
        this.transitionController.startFadeInTransition();

        //Get Scale
        this.width = this.scale.width;
        this.height = this.scale.height;

        this.render = new HanafudaRender(this,this.width,this.height);
        this.tableAction = new HanafudaTableActions(this);
        this.prepareRound = new HanafudaPrepareRound(this);

        this.AnimDuration = 500;

        this.cleanUp();
        this.round = 0;

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

        this.input.keyboard.on('keydown-ESC', () => {
            this.openOptionMenu();
        });

        //render the zones for the board (table, player and opponent cards are here), and two for where the player and opponent collected pairs will be
        this.board = this.add.rectangle(300, 20, 1030, 1040, 0x000000, 0.7).setOrigin(0, 0);
        this.opponentPairZone = this.add.rectangle(this.width/ 2+ 400, 30, 530, 470 , 0x000000, 0.6).setOrigin(0, 0);
        this.playerPairZone = this.add.rectangle(this.width/ 2+ 400, this.height/2 + 20, 530, 470, 0x000000, 0.6).setOrigin(0, 0);
        this.infoText = this.add.text(370, this.height / 2 + 200, "Start!", {fontSize: '56px', fill: '#ffffffff'}); //Text
        this.roundText = this.add.text(40, 1000, `round:${this.round}/4`, {fontSize: "30px",color: "#ffffff"});
        this.deckObject = this.add.rectangle(200, this.height/2, 200, 350, 0x00000).setScale(0.6);

        this.transitionTo(HANAFUDA_STATE.START_ROUND);
    }

    transitionTo(newState) {
        //console.log(`Transition: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
        //console.log(`State: ${this.currentState}`);
        this.handlesGameState();
    }

    handlesGameState(){
        switch(this.currentState){
            case HANAFUDA_STATE.START_ROUND:
                this.round++;
                this.roundText.setText(`round:${this.round}/4`)

                this.prepareRound.createDeck();
                this.prepareRound.shuffleDeck();
                this.prepareRound.dealCards();

                this.render.renderOpponentCards();
                this.render.renderPlayerCards();
                this.render.renderTable();

                this.time.delayedCall(1000, ()=> {
                    if(this.playerTurn) this.transitionTo(HANAFUDA_STATE.WAITING_PLAYER);
                    else this.transitionTo(HANAFUDA_STATE.OPPONENT_TURN);
                }, this);
                
            break;
            case HANAFUDA_STATE.WAITING_PLAYER:

                this.infoText.setText("Choose a card");
                this.playerCardObjects.forEach((card, index ) => {
                    card.setInteractive()
                    .on('pointerover', () => card.setScale(0.22))
                    .on('pointerout', () => card.setScale(0.2))
                    .on('pointerdown', () => {
                        this.chosenCardPos = index;
                        this.card = this.playerCards[index];
                        this.OncardSelected();
                        this.infoText.setText("searching pairs...");
                        this.transitionTo(HANAFUDA_STATE.TABLE_ACTIONS);
                    });
                });
            break;
            case HANAFUDA_STATE.OPPONENT_TURN:
                this.infoText.setText("Opponent is thinking");
                this.chosenCardPos = Math.floor(Math.random() * this.opponentCards.length);
                this.card = this.opponentCards[this.chosenCardPos];

                this.time.delayedCall(1000, ()=> {
                    const chosenCardObject = this.opponentCardObjects[this.chosenCardPos];
                    this.tweens.add({
                        targets: chosenCardObject,
                        y: chosenCardObject.y + 50,
                        duration: 300,
                        ease: 'Power2',
                    });
                    this.infoText.setText("Opponent has chosen a card!");
                    this.time.delayedCall(1000, ()=> {
                        this.infoText.setText("searching pairs...")
                        this.transitionTo(HANAFUDA_STATE.TABLE_ACTIONS);
                    }, this);
                },this);
            break;
            case HANAFUDA_STATE.TABLE_ACTIONS:
                
                this.refill = false;
                this.numberOfPairs = 0;

                this.tableAction.searchesPair(this.card);

                this.time.delayedCall(2000, ()=>{
                    this.selectPair();
                
                    this.time.delayedCall(1000, ()=>{
                        this.infoText.setText("arranging cards");
                        this.renderCards();
                        
                        //refill
                        this.refill = true;

                        this.time.delayedCall(800, ()=> {
                            this.infoText.setText("Refilling table");
                            this.card = this.deck.splice(0,1)[0];
                            this.tweens.add({
                                targets: this.deckObject,
                                scaleX: 0.7,
                                scaleY: 0.7,
                                duration: 300,
                                ease: 'Power2',
                                yoyo: true,
                            });
                            console.log("deckcard", this.card);

                            this.time.delayedCall(1800, ()=> {
                                this.tableAction.searchesPair(this.card);
                                this.selectPair();
                                this.renderCards();
                                this.transitionTo(HANAFUDA_STATE.CHECK_END_ROUND);

                            },this);
                        }, this);
                    }, this);
                }, this);
                
            break;
            case HANAFUDA_STATE.CHECK_END_ROUND:

                this.time.delayedCall(1000, ()=> {
                    if(this.playerCards.length === 0 && this.opponentCards.length === 0) this.transitionTo(HANAFUDA_STATE.FINISH_ROUND);
                    else{
                        this.playerTurn = !this.playerTurn;

                        this.time.delayedCall(1000, ()=> {
                            if(this.playerTurn){
                                this.infoText.setText("Your Turn");
                                this.time.delayedCall(800, ()=> {this.transitionTo(HANAFUDA_STATE.WAITING_PLAYER);}, this);
                            }
                            else {
                                this.infoText.setText("Opponent's Turn");
                                this.time.delayedCall(1000, ()=> {this.transitionTo(HANAFUDA_STATE.OPPONENT_TURN);}, this);
                            }
                        }, this)
                    }
                }, this);
            break;
            case HANAFUDA_STATE.FINISH_ROUND:
                console.log('roundFinished');
                this.opponentCardObjects.forEach(obj => obj.destroy())
                this.tableCardObjects.forEach(row => { row.forEach(card => card.destroy());});
                this.playerCardObjects.forEach(obj => obj.destroy());
                this.playerPairsObjects.forEach(obj => obj.destroy());
                this.opponentPairsObjects.forEach(obj => obj.destroy());
                this.cleanUp();

                console.log("roundCounter",this.round);
                this.time.delayedCall(1000, ()=> {
                    if(this.round < 4){
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

    OncardSelected(){
        this.playerCardObjects.forEach(obj => obj.setInteractive(false));
    }

    selectPair(){
        if(this.numberOfPairs === 1){ //Cuando solo hay una carta del mismo mes en la mesa
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
            this.infoText.setText("No pair found");
            this.tableAction.pairNotFound(this.chosenCardPos);
            //this.render.renderNewCardToTable(this.card, this.tableCards[this.emptyRow].length, this.emptyRow);
        }
    }

    cleanUp(){
        this.opponentCardObjects = [];
        this.playerCardObjects = [];
        this.tableCardObjects = [];
        this.playerPairsObjects = [];
        this.opponentPairsObjects = [];
        this.playerPairs = [];
        this.opponentPairs = [];
        this.monthCounter = [];
        this.tableCards = [];
        this.numberOfPairs = 0;
        this.card = null;
        this.refill = false;
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