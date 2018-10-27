import 'phaser';
import ImageTracer from '../ImageTracer';

class Game extends Phaser.Scene {
    constructor(config) {
    	super('Game');

    	this.pCounter = 0;
    }

    debugUpdate() {
    	// For toggling the debug physics view and anything else 
    	if (Phaser.Input.Keyboard.JustDown(this.keys.spacebar)) {
    		this.matter.world.drawDebug = !this.matter.world.drawDebug;
    		this.matter.world.debugGraphic.clear();
    	}
    	// Break all joints 
    	if (Phaser.Input.Keyboard.JustDown(this.keys.B)) {
    		for(let i = 0; i < this.particles.length; i++) {
        		let particle1 = this.particles[i];
        		for(let key in particle1.joints) {
        			let joint = particle1.joints[key]
        			let particle2 = this.particleKeys[key]
        			delete particle2.joints[particle1.uniqueID];
        			delete particle1.joints[key];
        			this.matter.world.removeConstraint(joint);
        		}
        	}
    	}
    }

    initKeys() {
    	this.keys  = {
    		'spacebar' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    		'B' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B)
    	}
	}

    preload() {
    	
    }

    createParticle(x,y, scale) {
    	// let p = this.matter.add.image(x,y, 'snow', null, 
    	// 	{shape: {
    	// 		type: 'polygon',
    	// 		radius: 20
    	// 	}})
    	let p = this.matter.add.image(x,y, 'snow')

    	p.setCircle(12);
    	p.setScale(scale);
    	p.setOrigin(0.5);
    	p.setFriction(0.99);
    	p.setBlendMode('ADD');
    	p.uniqueID = this.pCounter++;
    	p.joints = {}

    	this.particles.push(p);
    	this.particleKeys[p.uniqueID] = p;

    	return p;
    }

    markSentient(particle) {
    	// This function should ONLY be run on a single particle on startup
    	// or on a particle that is connected to   a sentient chunk 
    	particle.isSentient = true;
    	this.sentientParticles.push(particle);
    	particle.setTint(0xff0000);
    }

    create() {    	
    	this.particles = [];
    	this.particleKeys = {};
    	this.sentientParticles = [];
    	this.targetCamX = 0;
    	this.targetCamY = 0;
    	this.initKeys();
        var tex = this.textures.get('level1');
    	var img = tex.getSourceImage();
        var map_scale = 10;
        var map_w = img.width * map_scale;
        var map_h = img.height * map_scale;
    	var W = map_w;
    	var H = map_h;

    	this.markSentient(this.createParticle(500,0, 1))
    	this.createParticle(600,0, 1)
    	for(let i = 0;i < 10;i++){
    		let min = 0.5;
    		let max = 1;
    		let size = Math.round(Math.random() * (min-max)) + min;
    		this.createParticle(600 + i * 50,0, 1)
    	}

    	// for(let i = 0;i < 50;i++){
    	// 	this.createParticle(800 + Math.random() * 200, 0)
    	// }

    	this.matter.world.setBounds(0, 0, W, H);

    	var block = this.matter.add.image(400, 0, 'block').setBounce(0.8).setMass(60).setFriction(0.9);
        this.block = block;

    	this.matter.add.mouseSpring();

    	// Set up camera to follow player 
    	this.cameras.main.setBounds(0, 0, W, H);

    	// Try to read image data to create level
		let tracer = new ImageTracer();
		let shapes = tracer.traceImage(img, map_scale);
        
        // Convert shape vertex x/y to a string for Matterjs 
		let stringShapes = [];

		for(let shape of shapes){
			let newString = '';
			for(let point of shape){
				newString += point.x + " " + point.y + " "
			}
			stringShapes.push(newString)
		}
        
        var vertArray = [];
        for(let s of stringShapes) {
            let verts = this.matter.verts.fromPath(s);
            vertArray.push(verts);
        }
    	this.matter.add.fromVertices(W/2, H/2, vertArray, { isStatic: true }, true);
        
        // Tile stone texture across level, masking using the traced image (help from https://goo.gl/VC8dK2)
        var ground = this.add.tileSprite(W/2, H/2, W, H, 'stone-tile');
        
        var mask_shape = this.make.graphics();
        mask_shape.fillStyle(0xffffff);
        mask_shape.beginPath();
        for(let shape of shapes) {
            var pts = [];
            for (let p of shape) {
                pts.push(new Phaser.Geom.Point(p.x, p.y));
            }
            mask_shape.fillPoints(pts, true);
        }
        var mask = mask_shape.createGeometryMask();

        ground.setMask(mask);

    }

    killDisconnectedSentience() {
    	// Collect all connected components
    	// if there are more than 1, mark all except the biggest as non-sentient 
    	let that = this;
    	function depthFirstSearch(particle, explored) {
    		explored[particle.uniqueID] = true; 
    		for(let key in particle.joints) {
				let particle2 = that.particleKeys[key]
				if(!explored[key]) {
					depthFirstSearch(particle2, explored);
				}
			}
    	}

    	let componentArray = [];
    	if(this.sentientParticles.length == 0) {
    		return;
    	}

    	let component = {};
    	depthFirstSearch(this.sentientParticles[0], component);
    	componentArray.push(component);
    	//console.log(Object.keys(component).length, this.sentientParticles.length);
    	let done = false;
    	while(!done) {
    		for(let p of this.sentientParticles) {
	    		if(!component[p.uniqueID]) {
	    			// Found a new component!
	    			let newComponent = {};
	    			depthFirstSearch(p, newComponent);
	    			componentArray.push(newComponent);
	    			break;
	    		}
	    	}

	    	done = true;
    	}
    	

    	if(componentArray.length > 1) {
    		// Find the biggest component 
    		let biggestComponentIndex = -1;
    		let biggest;
    		let i = 0;
    		for(let c of componentArray) {
    			if(biggestComponentIndex == -1) {
    				biggestComponentIndex = i;
    				biggest = Object.keys(c).length;
    			}

    			if(Object.keys(c).length >= biggest) {
    				biggest = Object.keys(c).length; 
    				biggestComponentIndex = i;
    			}

    			i++;
    		}

    		// Now mark everything else as non sentient 
    		i = 0;
    		this.sentientParticles = [];

    		for(let c of componentArray) {
    			for(let key in c) {
    				let particle = this.particleKeys[key]
					if(i != biggestComponentIndex) {
	    				particle.isSentient = false;
						particle.setTint(0xffffff);
	    			} else {
	    				this.sentientParticles.push(particle);
	    			}
				}
    			i++;
    		}

    		
    	}

    	
    }

    markSweepSentience(particle, explored) {
    	// Given a particle, make sure all particles connected to it are marked as sentient 
    	for(let key in particle.joints) {
			let particle2 = this.particleKeys[key]
			if(!explored[key] && !particle2.isSentient) {
				this.markSentient(particle2);
				explored[key] = true;
				this.markSweepSentience(particle2, explored);
			}
		}
    }

    update() {
    	this.debugUpdate();	


    	let sentientAvgX = 0;
    	let sentientAvgY = 0;
        
        for(let i = 0; i < this.particles.length; i++) {
        	let particle1 = this.particles[i];

        	if(particle1.isSentient) {
        		sentientAvgX += particle1.x; 
        		sentientAvgY += particle1.y;
        	}

        	let id1 = particle1.uniqueID;

        	// Check if the distance between particle1 and all its joint particles is too big, 
        	// and if so, destroy the joint
        	for(let key in particle1.joints) {
    			let joint = particle1.joints[key]
    			let particle2 = this.particleKeys[key]
    			let dx = particle1.x - particle2.x; 
    			let dy = particle1.y - particle2.y; 
    			let dist  = Math.sqrt(dx * dx + dy * dy);
    			if (dist >= 45 || dist <= 30) {
    				delete particle2.joints[particle1.uniqueID];
    				delete particle1.joints[key];
    				this.matter.world.removeConstraint(joint);
    				this.killDisconnectedSentience();
    			}
    			
    		}

        	for(let j = 0; j < this.particles.length; j++) {
        		let particle2 = this.particles[j];
        		let p1Keys = Object.keys(particle1.joints);
        		let p2Keys = Object.keys(particle2.joints);
        		
        		// No particle should have more than 3 connections
        		// if(p1Keys.length >= 3 || p2Keys.length >= 3) {
	        	// 	continue;
	        	// }

        		let id2 = particle2.uniqueID;
        		if (i != j && !particle1.joints[id2]) {
        			let dx = particle1.x - particle2.x; 
        			let dy = particle1.y - particle2.y; 
        			let dist  = Math.sqrt(dx * dx + dy * dy);
        			if(dist < 30) {
        				let joint = this.matter.add.constraint(particle1, particle2, 35, 0.35);
        				particle1.joints[id2] = joint;
        				particle2.joints[id1] = joint;
        				if(particle1.isSentient && !particle2.isSentient) {
        					this.markSentient(particle2);
        					this.markSweepSentience(particle2, {});
        				} else if (particle2.isSentient && !particle1.isSentient) {
        					this.markSentient(particle1);
        					this.markSweepSentience(particle1, {});
        				}
        			}
        		}
        	}
        }

        // Average the x and y of the sentient 
        var W = this.game.config.width;
    	var H = this.game.config.height;
        sentientAvgX /= this.sentientParticles.length;
        sentientAvgY /= this.sentientParticles.length;
        let camera = this.cameras.main;

        this.targetCamX += (sentientAvgX - this.targetCamX) * 0.16;
        this.targetCamY += (sentientAvgY - this.targetCamY) * 0.16;

        let dx = (this.targetCamX - camera.scrollX) - camera.centerX;
        let dy = (this.targetCamY - camera.scrollY) - camera.centerY;
		let newX = (camera.centerX + camera.scrollX) + dx * 0.16;
		let newY = (camera.centerY + camera.scrollY) + dy * 0.16;
        camera.centerOn(newX, newY);
    }
}

// Make it so we can use it from a different file. 
export default Game;