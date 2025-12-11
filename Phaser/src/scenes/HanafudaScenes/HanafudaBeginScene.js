import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { BaseScene } from "../BaseScene.js";

export class HanafudaBeginScene extends BaseScene
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


    init(playerData){
        super.init(playerData);
        this.playerBegins = false;
        this.playerCard = null;
        this.oponentcard = null;
        this.mazo = [];
        this.cardsObjects = [];
        this.infoText = null;
    }

    async create(playerData){   
        this.playerData = playerData;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        // Wait for the custom font to be loaded before creating any text
        // The font size here doesn't matter, it just ensures the font family is ready.
        await document.fonts.load('64px CenturyGothic');

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

        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackground');

        //Back button
        this.backBtn = this.add.image(80, 50, 'BackNormalButton').setScale(0.27)
        .setInteractive()
        .on('pointerover', () => this.backBtn.setTexture('BackHoverButton')).setScale(0.6)
        .on('pointerout', () => this.backBtn.setTexture('BackNormalButton')).setScale(0.27)
        .on('pointerup', () => {this.openOptionMenu(); });

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

        this.add.graphics().fillStyle(0x002016, 0.7).fillRoundedRect(150, 310, 1550, 340, 20); 

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

        this.infoText = this.add.text(this.width / 2 - 100, this.height / 2 - 300, "Choose a card", {
            fontSize: '50px', fill: '#fffefeff', fontFamily: "CenturyGothic"
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
}
