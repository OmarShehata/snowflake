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

    createParticle(x,y) {
    	let p = this.matter.add.image(x,y, 'snow', null, 
    		{shape: {
    			type: 'polygon',
    			radius: 20
    		}})

    	//p.setCircle(20);
    	p.setScale(0.7);
    	p.setOrigin(0.5);
    	p.setFriction(0.97);
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
    		this.createParticle(600 + i * 50,0)
    	}

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
    	// Break joint based on distance
    	// Don't self join? 
        
        for(let i = 0; i < this.particles.length; i++) {
        	let particle1 = this.particles[i];
        	let id1 = particle1.uniqueID;

        	// Check if the distance between 

        	for(let j = 0; j < this.particles.length; j++) {
        		let particle2 = this.particles[j];
        		if(Object.keys(particle1.joints).length >= 3 || Object.keys(particle2.joints).length >= 3) {
	        		continue;
	        	}
        		let id2 = particle2.uniqueID;
        		if (i != j && !particle1.joints[id2]) {
        			let dx = particle1.x - particle2.x; 
        			let dy = particle1.y - particle2.y; 
        			let dist  = Math.sqrt(dx * dx + dy * dy);
        			if(dist < 30) {
        				let joint = this.matter.add.constraint(particle1, particle2, 30, 0.9);
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