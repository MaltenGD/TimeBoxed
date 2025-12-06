import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";


export class HanafudaBeginScene extends Phaser.Scene 
{
    constructor(){
        super('HanafudaBeginScene');
    }

    preload() {
        /** @type {number} */
        const {width, height} = this.scale;
        this.width = width;
        this.height = height;
    }


    init(){
        this.playerBegins = false;
        this.playerCard = null;
        this.oponentcard = null;
        this.mazo = [];
        this.cardsObjects = [];
        this.infoText = null;
    }

    create(playerData){   
        this.playerData = playerData;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        this.input.keyboard.on('keydown-ESC', () => {
             this.openOptionMenu()
        });

        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackgroundPlaceholder');

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });

        const totalCards = 48;
        const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        let monthCount = 0;
        
        //Fill mazo array
        for (let i = 0; i < totalCards; ++i)
        {
            monthCount = Math.floor(i / 4);
            const newCard = {number: i, month: months[monthCount]};
            this.mazo.push(newCard);
        }


        //Mix cards
        let aux1;
        for (let i = 0; i < totalCards; ++i)
        {
            let randomNumber = Math.floor(Math.random() * totalCards)
            
            aux1 = this.mazo[i];
            this.mazo[i] = this.mazo[randomNumber];
            this.mazo[randomNumber] = aux1;
        }


        this.cardsZone = this.add.rectangle(150, 310, 1550, 340, 0x002016, 0.7).setOrigin(0, 0);  

        for(let i = 0; i < 8; ++i){
            const image = this.add.rectangle(250 + i * 190, this.height - 600, 150, 250, 0x609C86).setScale(1);
            this.cardsObjects.push(image);
        }

        this.cardsObjects.forEach((card, i) =>{
            card.setInteractive();
            card.on('pointerover', () => card.setScale(0.95));
            card.on('pointerout', () => card.setScale(1));
            card.on('pointerdown', () => {
                this.onCardSelected(this.mazo[i]);
            });
        });

        this.infoText = this.add.text(this.width / 2, this.height / 2 - 300, "Choose a card", {
            fontSize: '40px', fill: '#000000'
        }).setOrigin(0.5);

    }

    onCardSelected(card) {
        this.playerCard = card;
        console.log("Player selected:", card);
        this.cardsObjects.forEach(cardObject => cardObject.disableInteractive());
        const chosenCard = this.add.image(this.width/2 + 500, this.height/2 + 400,`Card${card.number}`).setScale(0.2);
        this.add.tween({ targets: chosenCard, scaleX: 0.24, scaleY: 0.24, duration: 200, ease: 'Power2', yoyo: true,});

        this.infoText.setText("Player has selected a card");

        this.time.delayedCall(1000, () => {this.infoText.setText("Oponent is selecting a card");});
        this.time.delayedCall(1000, () => {this.handleOpponentTurn();});
        this.events.off("cardSelected"); // Prevent this from being called again.
    }

    handleOpponentTurn(){
        let oponentCardPos;
        do {
            oponentCardPos = Math.floor(Math.random() * 8);
            this.oponentcard = this.mazo[oponentCardPos];
        } while (this.oponentcard === this.playerCard);

        console.log("Oponent selected:", this.oponentcard);
        this.time.delayedCall(1000, () => {
            this.infoText.setText("Oponent has selected a card");
        });

        this.time.delayedCall(1000, () => {
            const opponentCard = this.add.image(this.width/2 - 500, this.height/2 + 400,`Card${this.oponentcard.number}`).setScale(0.2);
            this.add.tween({ targets: opponentCard, scaleX: 0.24, scaleY: 0.24, duration: 200, ease: 'Power2', yoyo: true,});
        });
         
        if(this.oponentcard.number < this.playerCard.number){
            this.playerBegins = false;
            //console.log("Opponent starts");
            this.time.delayedCall(2000, () => {
                this.infoText.setText("Oponent Starts");
            });
        }
        else{
            this.playerBegins = true;
            //console.log("Player starts");
            this.time.delayedCall(2000, () => {
                this.infoText.setText("Player Starts");
            });
        }

        this.time.delayedCall(3000, () => {
            this.transitionController.startFadeOutTransition(() => {
                this.scene.start('HanafudaGameState', { playerData: this.playerData, begins: this.playerBegins});
            }, 400);
        });
    }

    openOptionMenu(){
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.playerData.SceneToResume = this.scene.key;
            this.scene.launch('OptionMenu', this.playerData);
    }

    shutdown() {
        console.log('HanafudaBeginScene shutting down, removing keyboard listeners.');
        this.input.keyboard.off('keydown-ESC');
    }
}
