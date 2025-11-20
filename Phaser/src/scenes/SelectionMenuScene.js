import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";


const IMAGE_KEYS = {
    'Egypt': 'asebVerticalBackground', 
    'Rome': 'taliVerticalBackground', 
    'Japan': 'BoxClosed'  
};



/**
 * @class SelectionMenuScene
 * shows in the different levels of the game, so the player can choose
 */

export class SelectionMenuScene extends Phaser.Scene {
    constructor() {
        super('SelectionMenuScene');
    }

    /** Create the elements of the scene */
    create(playerData) {

        this.playerData = playerData;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);

        this.transitionController.startFadeInTransition();
        
        const { width, height } = this.sys.game.canvas;  //width and height of the canvas
        if (this.playerData.TimeboxedMode) this.background = this.add.image(width / 2, height / 2, 'backgroundTB').setDisplaySize(width, height);
        else this.background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);
        const centerX = width / 2;
        const centerY = height / 2;
        
        /** 
         * Box that when pressed it will go to the bottom of the canvas 
         * @param centerX X position of the center of the canvas
         * @param centerY Y position of the center of the canvas
         * @param 200 width of the box
         * @param 200 height of the box
         * @param 0xffffff color of the box
         * .setStrokeStyle(4, 0x000000) black border of 4px
         * .setInteractive({ cursor: 'pointer' }) makes the box clickable and changes the cursor to pointer when hovering
         * .setOrigin(0.5) centers the box
        */
        const box = this.add.image(centerX, centerY, 'BoxClosed')
            .setInteractive({ cursor: 'pointer' })
            .setOrigin(0.5);
        
        // Position of the buttons when they're out of the box

        /**Space between buttons */
        const buttonGap = 650; 

        /**Final positions of the buttons
         * @param x X position of each button
         * @param y Y position of each button
        */
       const initialPositions = [
            { x: centerX, y: centerY +250 },  // Egypt
            { x: centerX, y: centerY +250},   // Rome
            { x: centerX, y: centerY +250 }   // Japan
        ];
        const finalPositions = [
            { x: centerX - buttonGap, y: centerY-100 },  // Egypt
            { x: centerX, y: centerY -100},              // Rome
            { x: centerX + buttonGap, y: centerY -100 }   // Japan
        ];

        const backgroundCrops = [
            { x: 0, y: 0, width: 1280, height: 1440 },  // Egypt  2560 x 1440
            { x: 0, y: 0, width: 1280, height: 1440 },   // Rome   1880 x 1048
            { x: 0, y: 0, width: 0, height: 0 }   // Japan

        ]

        /** array of string for the levels 
         * Egypt for egipcian level
         * Rome for roman level
         * Japan for japanese level
        */
        const opciones = ['Egypt', 'Rome', 'Japan'];

        /** array of string for each of the levels scenes
         * AsebBeginScene for egipcian level scene
         * TaliBeginScene for roman level scene
         * HanafudaScene for japanese level scene
        */

        const scenes = ['IntroAseb', 'TaliIntroScene', 'HanafudaBeginScene'];

        /** Array for buttons */
        const buttons = [];
        
        // Levels Buttons creation but they aren't showed until the box is clicked

        /**
         * @param opcion options between levels
         * @param index index to itereate
         */
        opciones.forEach((opcion, index) => {

        /** 
        * Creation of a button for each level 
        * @param centerX X position of the center of the canvas
        * @param centerY+150 Y position of the center of the canvas plus 150px
        * @param opcion text of each button
        * @param fontSize size of the font
        * @param fill color of the font
        * @param backgroundColor background color of the button
        * @param padding padding of the button
        * .setOrigin(0.5) centers the button
        * .setAlpha(0) makes the button invisible at the beginning
        * .setScale(0.1) makes the button small at the beginning
        */
        // const btn = this.add.text(centerX, centerY+150 , opcion, {
        //     fontSize: '35px',
        //     fill: 'rgba(0, 0, 0, 1)',
        //     backgroundColor: '#ffffff',
        //     padding: { top: 20, bottom: 700, x: 200 }
        // })
        // .setOrigin(0.5)
        // .setAlpha(0)
        // .setScale(0.1);

        const btn = this.add.image(initialPositions[index].x, initialPositions[index].y, IMAGE_KEYS[opcion])
        .setOrigin(0.5)
        .setAlpha(0)
        .setScale(0.1);
        
        


        
        /**Inserts each of the buttons for the array 
         * @param btn each button created
        */
        buttons.push(btn);
        });

        /** Button to go back to the Start scene
         * @param 200 X position of the button
         * @param height - 100 Y position of the button
         * @param 'Volver al inicio' text of the button 
         * @param fontSize size of the font
         * @param fill color of the font
         * @param backgroundColor background color of the button
         * @param padding padding of the button
         * .setOrigin(0.5) centers the button
         * .setInteractive({ cursor: 'pointer' }) makes the button clickable and changes the cursor to pointer when hovering
         * .on('pointerover', ...) changes the background color of the button when hovering
         * .on('pointerout', ...) changes the background color of the button when not hovering
         * .on('pointerdown', ...) starts the Start scene when the button is clicked
        */
        const backBtn = this.add.text(200, height - 100, 'Return to main menu', {
            fontSize: '30px',
            fill: '#000000',
            backgroundColor: '#f7f7f7',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerover', () => backBtn.setStyle({ backgroundColor: '#bbbaba' }))
        .on('pointerout', () => backBtn.setStyle({ backgroundColor: '#f7f7f7' }))
        .on('pointerdown', () => {
            this.transitionController.startFadeOutTransition(() => {
                
                this.scene.start('Start', this.playerData)

            
            }, 400);
        });

        /** It controls if the buttons are showing/deployed in screen so their animation doesn't reapeat again (it's used only 1 time)*/
        let deployed = false;

        // When the box is clicked the following happens:
        
        /** When the box is clicked
         * @param pointer event when the box is clicked
         * If deployed is true, it returns and doesn't do anything
         * If deployed is false, it sets deployed to true
         * The box shrinks and goes to the bottom of the canvas
        */
        box.on('pointerdown', () => {
            if (deployed) return;
            deployed = true;

            box.setTexture('BoxOpen');

            /**
             * Box going down animation
             * @param targets targets to animate (box)
             * @param scale scale of the box and text
             * @param x final X position of the box
             * @param y final Y position of the box
             * @param duration duration of the animation
             * @param ease easing function of the animation
             */
            this.tweens.add({
                targets: box,
                scale: 0.5,
                x: centerX, 
                y: centerY + 400,
                duration: 1600,
                ease: 'Back.easeOut'
            });

        // Buttons coming out of the box animation

        /**
         * @param btn the levels buttons
         * @param index index to itereate
         */
            buttons.forEach((btn, index) => {

                /**
                 * Button going out of the box animation
                 * @param targets targets to animate (btn)
                 * @param x final X position of the button
                 * @param y final Y position of the button
                 * @param alpha final alpha of the button
                 * @param duration duration of the animation
                 * @param ease easing function of the animation
                 * @param onComplete function to execute when the animation is complete
                 */
                this.tweens.add({
                    targets: btn,
                    x: finalPositions[index].x,
                    y: finalPositions[index].y,
                    alpha: 1,
                    duration: 1000,
                    ease: 'Sine.easeOut',
                    onComplete: () => { // this is done so buttons are interactive only when the animation is complete
                        /**
                         * Makes the button interactive
                         * @param cursor changes the cursor to pointer when hovering
                         * @on pointerover changes the color of the button text when hovering
                         * @on pointerout changes the color of the button text when not hovering
                         * @on pointerdown starts the corresponding level scene when the button is clicked
                         */
                        btn.setInteractive({ cursor: 'pointer' })
                            .on('pointerdown', () => {
                                this.transitionController.startFadeOutTransition(() => {
                                    
                                    this.scene.start(scenes[index], this.playerData);
                                
                                }, 400);
                                
                            });
                    }
                });

                /** 
                 * Button scaling effect when it appears
                 * @param targets targets to animate (btn)
                 * @param scale final scale of the button
                 * @param duration duration of the animation
                 * @param ease easing function of the animation
                 */
                this.tweens.add({ 
                    targets: btn,
                    scale: 0.4,
                    duration: 1700,
                    ease: 'Sine.easeOut',
                    
                });

            });
        });

        /** Box hover on the button effect
         * @param pointer event when the pointer is over the box
        */
        box.on('pointerover', () => {
            if (!deployed) {

                /**
                 * Box scaling effect when hovering
                 * @param targets targets to animate (box)
                 * @param scale final scale of the box and text
                 * @param duration duration of the animation
                 * @param ease easing function of the animation
                 */
                this.tweens.add({
                    targets: box,
                    scale: 1.1,
                    duration: 200,
                    ease: 'Sine.easeOut'
                });
            }
        });

        /** Box hover out the button effect
         * @param pointer event when the pointer is over the box
        */
        box.on('pointerout', () => {
            if (!deployed) {

                /**
                 * Box scaling effect when not hovering
                 * @param targets targets to animate (box)
                 * @param scale final scale of the box and text
                 * @param duration duration of the animation
                 * @param ease easing function of the animation
                 */
                this.tweens.add({
                    targets: box,
                    scale: 1,
                    duration: 200,
                    ease: 'Sine.easeIn'
                });
            }
        });
    }
}