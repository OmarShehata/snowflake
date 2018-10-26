import 'phaser';


class Game extends Phaser.Scene {
    constructor(config) {
    	super('Game');
    }

    preload() {
    	
    }

    create() {
    	var logo = this.add.image(400, 150, 'logo');

	    this.tweens.add({
	        targets: logo,
	        y: 450,
	        duration: 2000,
	        ease: 'Power2',
	        yoyo: true,
	        loop: -1
	    });
    }
}

// Make it so we can use it from a different file. 
export default Game;