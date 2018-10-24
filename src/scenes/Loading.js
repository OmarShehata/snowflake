import 'phaser';


class Loading extends Phaser.Scene {
    constructor(config) {
    	super('Loading');
    }

    preload() {
    	// We can still load assets in each scene, but I think it might be best to load the 
    	// heavy stuff here up front 
    }

    create() {
    	console.log("Loading!");
    	let that = this;
    	setTimeout(function(){
    		that.scene.start("Game");
    	}, 2000)
    }
}

// Make it so we can use it from a different file. 
export default Loading;