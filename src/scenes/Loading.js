import 'phaser';
import Music from '../Music';

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
        let music = new Music();
        music.playSampleNote();
        

    	// We can still load assets in each scene, but I think it might be best to load the 
    	// heavy stuff here up front 
    	this.load.image('logo', 'assets/logo.png');
    	this.load.image('block', 'assets/block.png');
    	this.load.image('stone', 'assets/stone.png');
    	this.load.image('blue', 'assets/particles/blue.png');
    	this.load.image('white', 'assets/particles/white.png');
    	this.load.image('yellow', 'assets/particles/yellow.png');
    	this.load.image('pixel', 'assets/particles/pixel.png');
    	this.load.image('pixel-blue', 'assets/particles/pixel-blue.png');
    	this.load.image('pixel-red', 'assets/particles/pixel-red.png');
    	this.load.image('snow', 'assets/particles/snow.png');
        this.load.image('stone-tile', 'assets/stone_tile.png');
    	// Levels
    	this.load.image('level1', 'assets/levels/level1.png');

    	var loadingText = this.createText();

    	this.load.on('progress', function (value) {
    		loadingText.text = Math.round(value.toFixed(2) * 100) + " %";
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