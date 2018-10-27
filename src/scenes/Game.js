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

    	console.log("Start game?")

    	var W = this.game.config.width * 2;
    	var H = this.game.config.height;

    	this.matter.world.setBounds(0, 0, W, H);

    	var block = this.matter.add.image(400, 0, 'block').setBounce(0.8).setMass(60);

    	this.matter.add.image(0,0, 'stone');
    	this.matter.add.mouseSpring();

    	// Set up camera to follow player 
    	this.cameras.main.setBounds(0, 0, W, H);
    	this.cameras.main.startFollow(block, true, 0.09, 0.09);

    	// Try to read image data to create level 
    	var tex = this.textures.get('level1');
    	var img = tex.getSourceImage();
    	var c = document.createElement("canvas")
		c.width = img.width
		c.height = img.height
		var ctx = c.getContext("2d")
		ctx.drawImage(img,0,0)
		var imageData = ctx.getImageData(0,0,img.width,img.height);

		// From Joseph Parker's http://www.procjam.com/tutorials/en/wfc/
		function getPixel(imgData, x, y) {
		  var index = y*imgData.width+x
		  var i = index*4, d = imgData.data
		  return {r:d[i],g:d[i+1],b:d[i+2]}
		}

		let points = [];
		let inside = false;
		// Scanline to get the points 
		for(var x = 0;x < img.width; x ++){
			for(var y = 0;y < img.height; y++){
				var pixel = getPixel(imageData, x, y);
				// If we see a black pixel and we're not inside anything
				if(pixel.r == 0 && !inside) {
					inside = true;
					points.push({x:x * 10,y:y * 10})
				} else if(inside && pixel.r == 255) {
					inside = false;
				}
			}
		}

		inside = false;
		for(var y = 0;y < img.height; y ++){
			for(var x = 0;x < img.width; x++){
				var pixel = getPixel(imageData, x, y);
				if(pixel.r == 0 && !inside) {
					inside = true;
					points.push({x:x * 10,y:y * 10})
				} else if(inside && pixel.r == 255) {
					inside = false;
				}
			}
		}

		// for(let p of points) {
		// 	this.add.image(p.x, p.y, 'pixel');
		// }

		// Take the leftmost point, find the closest, until threshold breaks into a new shape
		function getPointWithSmallestX(points) {
			let smallestX;
			let smallestIndex;
			let i = 0;
			for(let p of points) {
				if (smallestIndex == undefined) {
					smallestIndex = i;
					smallestX = p.x;
				}

				if(p.x <= smallestX) {
					smallestX = p.x; 
					smallestIndex = i;
				}

				i++;
			}

			return smallestIndex;
		}
		let shapes = [];

		let i = 0;
		
		let point = points.splice(getPointWithSmallestX(points),1)[0];
		let newShape = [];
		
		while(points.length != 0) {
			let closestIndex;
			let closestDistance;
			let i = 0;
			// Find the closest point to point
			for(let p of points) {
				let dx = p.x - point.x;
				let dy = p.y - point.y; 

				let dist = Math.sqrt(dx * dx + dy * dy);
				if(closestIndex == undefined) {
					closestDistance = dist;
				}

				if(dist <= closestDistance) {
					closestIndex = i; 
					closestDistance = dist; 
				}
				i++;
			}

			// If it's close enough, it's still part of the shape
			if(closestDistance < 50 && points.length > 1) {
				// If a point is too close skip it 
				if(closestDistance > 10) {
					newShape.push(point);
					point = points.splice(closestIndex, 1)[0]
				} else {
					points.splice(closestIndex, 1)[0]
				}
			} else {
				// Too far! Start a new shape
				shapes.push(newShape);
				point = points.splice(getPointWithSmallestX(points), 1)[0];
				newShape = [];
			}
		}

		this.counter = 0;
		this.shapes = shapes;
		this.shapeNum = 0;


		// var colors = ['pixel', 'pixel-red', 'pixel-blue']
		// i = 0;
		// for(let shape of shapes){
		// 	for(let p of shape){
		// 		var pixel = this.add.image(p.x, p.y, colors[i])
		// 	}
		// 	i++;
		// }
		
    }

    update() {
    	this.debugUpdate();


    	this.counter ++;
    	if(this.counter > 1) {
    		this.counter = 0;
			
			if(this.shapes[this.shapeNum].length != 0){
				this.add.image(this.shapes[this.shapeNum][0].x, this.shapes[this.shapeNum][0].y, 'pixel');
				this.shapes[this.shapeNum].splice(0,1);
			} else {
				this.shapeNum ++;
				console.log("Shape!");
			}
    	}

    	
    }
}

// Make it so we can use it from a different file. 
export default Game;