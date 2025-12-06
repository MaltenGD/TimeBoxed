
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

                let playerCard = this.scene.add.image(400 + (j * 120), (this.height / 2 - 140) + (i * 200), `Card${this.scene.tableCards[i][j].number}`)
                .setScale(0.2);
                this.scene.tableCardObjects[i].push(playerCard);

                if(this.scene.tableCards[i][j] === this.card){
                    this.newCard = this.scene.tableCardObjects[i][j];

                    this.scene.tweens.add({ 
                        targets: this.newCard, scaleX: 0.24,scaleY: 0.24,duration: 200,ease: 'Power2',
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
            const rect = this.scene.add.rectangle(400 + (i * 120), 170, 100, 150, 0x609C86);
            this.scene.opponentCardObjects.push(rect);
        });
    }

    /**@method renderPlayerCards :It renders the player cards on screen*/
    renderPlayerCards(){
        this.scene.playerCardObjects.forEach(obj => obj.destroy());  //Destroy old objects so they don't linger on scene
        this.scene.playerCardObjects = []; //clean the array

        this.scene.playerCards.forEach((card, i) => {
            let image = this.scene.add.image(400 + (i * 120), this.height / 2 + 350, `Card${card.number}`).setScale(0.2);
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

    renderDeckCard(){
        if (!this.scene.card) {
        console.warn("renderDeckCard() llamado sin this.scene.card");
        return;
        }

        if (typeof this.scene.card.number !== "number") {
            console.warn("this.scene.card.number es invalido:", this.scene.card);
            return;
        }

        this.scene.deckCardObject = this.scene.add.image(170, this.height/2 + 100,`Card${this.scene.card.number}`).setScale(0.2);
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
        this.scene.board = this.scene.add.graphics().fillStyle(color, 0.7).fillRoundedRect(300, 20, 1030, 1040, 20);
        this.scene.opponentPairZone = this.scene.add.graphics().fillStyle(color, 0.6).fillRoundedRect(this.width/ 2+ 400, 30, 530, 470, 20);
        this.scene.playerPairZone = this.scene.add.graphics().fillStyle(color, 0.6).fillRoundedRect(this.width/ 2+ 400, this.height/2 + 20, 530, 470, 20);
        this.scene.deckZone = this.scene.add.graphics().fillStyle(color, 0.7).fillRoundedRect(80, this.height/2 - 140, 180, 560, 20);
        this.scene.roundZone = this.scene.add.graphics().fillStyle(color, 0.8).fillRoundedRect(70, this.height/2 + 450, 190, 60, 10);
    }

    uiRender(){
        
        //Back button
        this.scene.backBtn = this.scene.add.text(0, 0, 'Back', { fontSize: 45, fill: '#f0f0f0ff'})
        .setInteractive()
        .on('pointerover', () => this.scene.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.scene.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerup', () => {this.scene.openOptionMenu(); });

        //Yakus Button
        this.scene.yakusMenuBtn = this.scene.add.image(170, 340, 'YakusNormalButton').setScale(0.16)
        .setInteractive()
        .on('pointerover', () => this.scene.yakusMenuBtn.setTexture('YakusHoverButton')).setScale(0.3)
        .on('pointerout', () => this.scene.yakusMenuBtn.setTexture('YakusNormalButton')).setScale(0.16)
        .on('pointerup', () => { this.scene.openYakusMenu();});

        //Text
        this.scene.infoText = this.scene.add.text(370, this.height / 2 + 180, "Start!", {fontSize: '40px', fill: '#ffffff', fontFamily: "CenturyGothic"}).setDepth(1);
        this.scene.roundText = this.scene.add.text(90, 1000, `Round:${this.scene.round}/4`, {fontSize: "30px",color: "#a3f9c2", fontFamily: "CenturyGothic"});

        // PlayerScore Text
        this.scene.playerPointsText = this.scene.add.text(this.width/2 + 130, 1010, "Your points: 0", {fontSize: "26px", color: "#a3f9c2", fontFamily: "CenturyGothic"});

        // OpponentScore Text
        this.scene.opponentPointsText = this.scene.add.text(350, 50, "Benten points: 0", {fontSize: "26px",color: "#a3f9c2",fontFamily: "CenturyGothic"});
    }
}