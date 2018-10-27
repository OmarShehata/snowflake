import 'phaser';
import ImageTracer from '../ImageTracer';

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

    makeShape(pathString, x, y) {
    	let verts = this.matter.verts.fromPath(pathString);
    	return this.matter.add.fromVertices(x, y, verts, { isStatic: true }, true);
    }

    create() {    	
    	this.initKeys();

    	console.log("Start game?")

    	var W = this.game.config.width * 2;
    	var H = this.game.config.height;

    	this.matter.world.setBounds(0, 0, W, H);

    	var block = this.matter.add.image(400, 0, 'block').setBounce(0.8).setMass(60).setFriction(0.9);

    	this.matter.add.image(0,0, 'stone');
    	this.matter.add.mouseSpring();

    	// Set up camera to follow player 
    	this.cameras.main.setBounds(0, 0, W, H);
    	this.cameras.main.startFollow(block, true, 0.09, 0.09);

    	// Try to read image data to create level 
    	var tex = this.textures.get('level1');
    	var img = tex.getSourceImage();
    	
		let tracer = new ImageTracer();
		let shapes = tracer.traceImage(img);

		let offset = 0;
		for(let shape of shapes) {
			this.makeShape(shape, 1280/2 + offset, H/2);
			offset += 500;
		}
    }

    update() {
    	this.debugUpdate();	
    }
}

// Make it so we can use it from a different file. 
export default Game;