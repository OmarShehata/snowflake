import 'phaser';


class Game extends Phaser.Scene {
    constructor(config) {
    	super('Game');
    }

    debugUpdate() {
    	// For toggling the debug physics view and anything else 
    	if (Phaser.Input.Keyboard.JustDown(this.keys.spacebar)) {
    		this.matter.world.drawDebug = !this.matter.world.drawDebug;
    		this.matter.world.debugGraphic.clear();
    	}
    }

    initKeys() {
    	this.keys  = {
    		'spacebar' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    	}
	}

    preload() {
    	
    }

    create() {    	
    	this.initKeys();

    	var W = this.game.config.width * 2;
    	var H = this.game.config.height;

    	this.matter.world.setBounds(0, 0, W, H);

    	this.matter.add.image(400, 0, 'block').setBounce(0.8).setMass(60);

    	this.matter.add.mouseSpring();
    }

    update() {
    	this.debugUpdate();
    }
}

// Make it so we can use it from a different file. 
export default Game;