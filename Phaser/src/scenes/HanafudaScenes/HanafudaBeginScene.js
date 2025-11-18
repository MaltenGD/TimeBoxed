
export class HanafudaBeginScene extends Phaser.Scene 
{
    constructor()
    {
        super('HanafudaBeginScene');
        this.playerBegins = false;
        this.playerCard = null;
        this.oponentcard = null;
        this.mazo = [];
    }

    preload() {
        /** @type {number} */
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    create()
    {   
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

        console.log(this.mazo);

        let cardGap = 110;
        let centerX = this.width/2;
        let centerY = this.height/2;
        const finalPositions = 
        [
            { x: centerX - cardGap* 3, y: centerY -100},
            { x: centerX - cardGap*2, y: centerY -100 },
            { x: centerX - cardGap, y: centerY -100 },
            { x: centerX, y: centerY -100 },
            { x: centerX + cardGap, y: centerY -100 },
            { x: centerX + cardGap * 2, y: centerY -100 },
            { x: centerX + cardGap * 3, y: centerY -100 },
            { x: centerX + cardGap * 4, y: centerY-100 },
        ];

        for(let i = 0; i < 8; ++i)
        {
            this.createCards(finalPositions[i].x, finalPositions[i].y, `${this.mazo[i].number}`, this.mazo[i]);
        }
    }

    createCards(x, y, textContent, card) 
    {
        const BOX_WIDTH = 90;
        const BOX_HEIGHT = 150;
    
        // Create children at (0,0) as their positions are relative to the container
        const backgroundCard = this.add.rectangle(0, 0, BOX_WIDTH, BOX_HEIGHT, 0xffffff);
    
        const text = this.add.text(0, 0,textContent,
        {   fontSize: '30px',
            fill: '#000000',
            align: 'center'
        })
        .setOrigin(0.5);
    
        const container = this.add.container(x, y, [backgroundCard, text]);

        // Define a hit area for the container to make it interactive
        container.setInteractive(new Phaser.Geom.Rectangle(0, 0, BOX_WIDTH, BOX_HEIGHT), Phaser.Geom.Rectangle.Contains)
        .on('pointerover', () => backgroundCard.setFillStyle(0xbbbaba))
        .on('pointerout', () => backgroundCard.setFillStyle(0xffffff))
        .on('pointerdown', () => {
            this.events.emit("selected");
            this.playerCard = card;
            console.log("Player selected:", this.playerCard);
            this.handleOpponentTurn();
        });

        this.events.on("selected", ()=>{container.disableInteractive();})

        return container;
    }

    handleOpponentTurn()
    {
        let oponentCardPos;
        do {
            oponentCardPos = Math.floor(Math.random() * 8);
            this.oponentcard = this.mazo[oponentCardPos];
        } while (this.oponentcard === this.playerCard);

        console.log("Oponent selected:", this.oponentcard);

        if(this.oponentcard.number < this.playerCard.number)
        {
            this.playerBegins = false;
            console.log("Opponent starts");
            this.scene.start('HanafudaGame', this.playerBegins);
        }
        else
        {
            this.playerBegins = true;
            console.log("Player starts");
            this.scene.start('HanafudaGame',{begins: this.playerBegins});
        }
    }
}
