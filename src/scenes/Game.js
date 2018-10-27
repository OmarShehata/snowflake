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

    makeShape(pathString, x, y) {
    	let verts = this.matter.verts.fromPath(pathString);
    	return this.matter.add.fromVertices(x, y, verts, { isStatic: true }, true);
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

    create() {    	
    	this.particles = [];
    	this.particleKeys = {}
    	this.initKeys();
    	var W = this.game.config.width * 2;
    	var H = this.game.config.height;

    	this.createParticle(500,0)
    	this.createParticle(600,0)
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


    	// Don't self join? 
        
        for(let i = 0; i < this.particles.length; i++) {
        	let particle1 = this.particles[i];
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
        			}
        		}
        	}
        }
    }
}

// Make it so we can use it from a different file. 
export default Game;