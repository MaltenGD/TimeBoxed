
export default class HanafudaRender{

    constructor(scene, width, height)
    {
        this.scene = scene;
        this.width = width;
        this.height = height;
    }

    renderTable(){
         if (!this.scene.tableCards || this.scene.tableCards.length === 0) {
        console.warn("renderTable() called but tableCards is empty");
        return;
    }
        this.scene.tableCardObjects.forEach((row) =>{ //Destroy old objects so they don't linger on scene 
            row.forEach((obj) => { obj.destroy();})
        });
        this.scene.tableCardObjects = []; //clean the array

        for(let i = 0; i < this.scene.tableCards.length; ++i){
            this.scene.tableCardObjects[i] = [];
            for(let j = 0; j < this.scene.tableCards[i].length; ++j){
                let cardData = this.scene.tableCards[i][j];
            if (!cardData) {
                console.warn("Table card undefined en posición", i, j);
                continue;
            }

                let playerCard = this.scene.add.image(400 + (j * 120), (this.height / 2 - 150) + (i * 200), `Card${this.scene.tableCards[i][j].number}`)
                .setScale(0.2);
                this.scene.tableCardObjects[i].push(playerCard);

                if(this.scene.tableCards[i][j] === this.card){
                    this.newCard = this.scene.tableCardObjects[i][j];

                    this.scene.tweens.add({
                        targets: this.newCard,
                        scaleX: 0.24,
                        scaleY: 0.24,
                        duration: 200,
                        ease: 'Power2',
                    });
                }
            }  
        }
    }

    /**@method renderOpponentCards :It renders the opponent cards on screen*/
    renderOpponentCards() {
        this.scene.opponentCardObjects.forEach(obj => obj.destroy()); //Destroy old objects so they don't linger on scene
        this.scene.opponentCardObjects = [];

        this.scene.opponentCards.forEach((card, i) => {
            const rect = this.scene.add.rectangle(400 + (i * 120), 150, 100, 150, 0x609C86);
            this.scene.opponentCardObjects.push(rect);
        });
    }

    /**@method renderPlayerCards :It renders the player cards on screen*/
    renderPlayerCards(){
        this.scene.playerCardObjects.forEach(obj => obj.destroy());  //Destroy old objects so they don't linger on scene
        this.scene.playerCardObjects = []; //clean the array

        this.scene.playerCards.forEach((card, i) => {
            let image = this.scene.add.image(400 + (i * 120), this.height / 2 + 400, `Card${card.number}`).setScale(0.2);
            this.scene.playerCardObjects.push(image);
        });
    }

    /**@method renderPlayerPairs :It renders the pairs collected by the player on screen*/
    renderPlayerPairs(){
        const cardsPerRow = 7;
        const existingCardCount = this.scene.playerPairsObjects.length;

        for (let i = existingCardCount; i < this.scene.playerPairs.length; i++) {
            const card = this.scene.playerPairs[i];
            const col = i % cardsPerRow;
            const row = Math.floor(i / cardsPerRow);
            const image = this.scene.add.image((this.width / 2 + 450) + (col * 70), (this.height / 2 + 90)+ (row * 100), `Card${card.number}`).setScale(0.1);
            
            this.pairsTweens(image);
            this.scene.playerPairsObjects.push(image);
        }
    }

    /**@method renderOpponentPairs :It renders the pairs collected by the opponent on screen*/
    renderOpponentPairs(){
        const cardsPerRow = 7;
        const existingCardCount = this.scene.opponentPairsObjects.length;

        for (let i = existingCardCount; i < this.scene.opponentPairs.length; i++) {
            const card = this.scene.opponentPairs[i];
            const col = i % cardsPerRow;
            const row = Math.floor(i / cardsPerRow);
            const image = this.scene.add.image((this.width / 2 + 450) + (col * 70), (this.height / 2 - 450) + (row * 100), `Card${card.number}`)
            .setScale(0.1);
            this.pairsTweens(image);
            this.scene.opponentPairsObjects.push(image);
        }
    }

    /**@method renderNewCardToTable : Renders a single new card to the table with a tween */
    renderNewCardToTable(card, col, row) {
        const newCardImage = this.scene.add.image(280 + (col * 120), (this.height / 2 - 150) + (row * 200), `Card${card.number}`)
        .setScale(0.1);
        this.scene.tableCardObjects[row].push(newCardImage);

        this.scene.tweens.add({
            targets: newCardImage,
            scaleX: 0.23,
            scaleY: 0.23,
            duration: 200,
            ease: 'Power2',
        });
    }

    renderDeckCard(){
        if (!this.scene.card) {
        console.warn("renderDeckCard() llamado sin this.scene.card");
        return;
    }

    if (typeof this.scene.card.number !== "number") {
        console.warn("this.scene.card.number es invalido:", this.scene.card);
        return;
    }
        this.scene.deckCardObject = this.scene.add.image(200, this.height/2 + 100,`Card${this.scene.card.number}`).setScale(0.2);
        this.scene.tweens.add({
            targets: this.scene.deckCardObject,
            y: this.scene.deckCardObject.y + 150,
            duration: 200,
            ease: 'Power2',
        });
    }

    pairsTweens(image){
        this.scene.tweens.add({
            targets: image,
            scaleX: 0.13,
            scaleY: 0.13,
            duration: 200,
            ease: 'Power2',
            yoyo: true,
        });
    }

    renderZones(){
        const color = 0x002016;
        this.scene.board = this.scene.add.rectangle(300, 20, 1030, 1040, color, 0.7).setOrigin(0, 0);
        this.scene.opponentPairZone = this.scene.add.rectangle(this.width/ 2+ 400, 30, 530, 470 , color, 0.6).setOrigin(0, 0);
        this.scene.playerPairZone = this.scene.add.rectangle(this.width/ 2+ 400, this.height/2 + 20, 530, 470, color, 0.6).setOrigin(0, 0);
        this.scene.deckZone = this.scene.add.rectangle(110, this.height/2 - 140, 180, 560, color, 0.6).setOrigin(0, 0);
    }
}