# Snowflake

Snow your enemy, snow yourself. 

### Requirements

We need [Node.js](https://nodejs.org) to install and run scripts.

## Install and run

Run next commands in your terminal:

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies and launch browser with examples.|
| `npm start` | Launch browser to show the examples. <br> Press `Ctrl + c` to kill **http-server** process. |
=======

## Todo

* Create matterjs softbody as seen [here](https://github.com/liabru/matter-js/blob/master/src/factory/Composites.js#L298).
	* It's really just a mesh of constraints.
* Move by finding topmost particle(s) and applying force to them
* Any particle you touch, create constraints to it 
* Break constraints with enough force? 
* Path graphics for the snow so they can plop together 


## Mechanic Ideas

* Generate random soft bodies, and if they don't stick, it's just debris, but if they stick, it'd be weird wobbling snowmen 
* Avalanche level makes you so heavy and deformed 
* The particles are all of different sizes making the soft body interesting