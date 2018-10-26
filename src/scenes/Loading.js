import 'phaser';


class Loading extends Phaser.Scene {
    constructor(config) {
    	super('Loading');
    }

    createText() {
    	var W = this.game.config.width;
    	var H = this.game.config.height;

    	var style = { fontFamily: 'Krub, sans-serif', fontSize: 60 };
    	var text = this.add.text(W/2, H/2, 'Loading...', style);
    	text.setOrigin(0.5);

    	return text;
    }

    preload() {
    	// We can still load assets in each scene, but I think it might be best to load the 
    	// heavy stuff here up front 
    	this.load.image('logo', 'assets/logo.png');
    	this.load.image('block', 'assets/block.png');
    	this.load.image('blue', 'assets/particles/blue.png');
    	this.load.image('white', 'assets/particles/white.png');
    	this.load.image('yellow', 'assets/particles/yellow.png');

    	var loadingText = this.createText();

    	this.load.on('progress', function (value) {
    		loadingText.text = value.toFixed(2) + " %";
    	});

    	this.load.on('complete', function () {
    		loadingText.text = "Click to start!";
	    });
    }

    create() {
    	var that = this;
    	this.input.once('pointerdown', function () {
            that.scene.start("Game");
        });
    }
}

// Make it so we can use it from a different file. 
export default Loading;