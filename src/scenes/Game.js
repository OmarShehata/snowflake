import 'phaser';


class Game extends Phaser.Scene {
    constructor(config) {
    	super('Game');
    }

    preload() {
    	
    }

    create() {
    	var W = this.game.config.width * 2;
    	var H = this.game.config.height;

    	this.matter.world.setBounds(0, 0, W, H);

    	this.matter.add.image(400, 0, 'block').setBounce(0.8).setMass(60);

    	this.matter.add.mouseSpring();
    }
}

// Make it so we can use it from a different file. 
export default Game;