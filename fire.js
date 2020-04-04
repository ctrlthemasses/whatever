var sound;
var playlist;
var g = 0;
var lowerBound = 30;
var button;
var button2;
let hue = 0;
// texture for the particle
let particle_texture = null;

// variable holding our particle system
let ps = null;

function preload() {
    //  sound = loadSound('')
    particle_texture = loadImage("texture.png");
}

function setup() {
    createCanvas(windowWidth - 4, windowHeight - 4);
    //second number means nothing apparently, but if i remove it, it get very dark
    colorMode(HSB, 360, 100);
    noStroke();

    button = createButton('next one');
    button.position(windowWidth * 9 / 10, windowHeight * 9 / 10);
    button.mousePressed(goToWater);

    button2 = createButton('last one');
    button2.position(windowWidth / 10, windowHeight * 9 / 10);
    button2.mousePressed(goToNature);

    // particle system
    ps = new ParticleSystem(0, createVector(width / 2, height - 60), particle_texture);
}

function windowResized() {
    resizeCanvas(windowWidth - 4, windowHeight - 4);
    button.position(windowWidth * 9 / 10, windowHeight * 9 / 10);
    button2.position(windowWidth / 10, windowHeight * 9 / 10);

}

function draw() {
    background(220);
    var topBrightness = computeBrightness(g, PI / 2)
    fill(color(hue, 100, topBrightness));
    rect(0, 0, width, height / 4);

    var topMiddleBrightness = computeBrightness(g, PI / 3)
    fill(color(hue - 10, 100, topMiddleBrightness));
    rect(0, height / 4, width, height / 4);

    var bottomMiddleBrightness = computeBrightness(g, -PI / 3)
    fill(color(hue - 20, 100, bottomMiddleBrightness));
    rect(0, height * 2 / 4, width, height / 4);

    var bottomBrightness = computeBrightness(g, -PI / 2)
    fill(color(hue - 30, 100, bottomBrightness));
    rect(0, height * 3 / 4, width, height / 4);

    let dx = map(mouseX, 0, width, -0.2, 0.2);
    let wind = createVector(dx, 0);

    ps.applyForce(wind);
    ps.run();
    for (let i = 0; i < 2; i++) {
        ps.addParticle();
    }

}

function mousePressed() {
    if (!sound.isPlaying()) {
        sound.loop();
    }
}

function mouseWheel(event) {
    console.log(event.delta);
    console.log("scrolling");
    if (event.delta > 0) {
        g -= 0.1;
        ps.updateOrigin(-1);
    } else {
        g += 0.1;
        ps.updateOrigin(1);
    }
}

//code dump
function goToNature() {
    window.location.href = "/nature.html";
}

function goToWater() {
    window.location.href = "/index.html";
}

function computeBrightness(increment, offset) {
    return (lowerBound + 35 * (Math.sin(increment + offset) + 1))
}

// source: https://p5js.org/examples/simulate-smokeparticles.html?fbclid=IwAR205JnurAy9DP2B5G1IKZOQIAv67DFAq_66c-2Wp3uo8OhYiCrV26dZ8NQ

//========= PARTICLE SYSTEM ===========

/**
 * A basic particle system class
 * @param num the number of particles
 * @param v the origin of the particle system
 * @param img_ a texture for each particle in the system
 * @constructor
 */
let ParticleSystem = function(num, v, img_) {

    this.particles = [];
    this.origin = v.copy(); // we make sure to copy the vector value in case we accidentally mutate the original by accident
    this.img = img_
    for (let i = 0; i < num; ++i) {
        this.particles.push(new Particle(this.origin, this.img));
    }
};

/**
 * This function runs the entire particle system.
 */
ParticleSystem.prototype.run = function() {

    // cache length of the array we're going to loop into a variable
    // You may see <variable>.length in a for loop, from time to time but
    // we cache it here because otherwise the length is re-calculated for each iteration of a loop
    let len = this.particles.length;

    //loop through and run particles
    for (let i = len - 1; i >= 0; i--) {
        let particle = this.particles[i];
        particle.run();

        // if the particle is dead, we remove it.
        // javascript arrays don't have a "remove" function but "splice" works just as well.
        // we feed it an index to start at, then how many numbers from that point to remove.
        if (particle.isDead()) {
            this.particles.splice(i, 1);
        }
    }
}

/**
* This function updates the origin of the particles
*/
ParticleSystem.prototype.updateOrigin = function(direction) {
    this.origin[1] += direction;
}


/**
 * Method to add a force vector to all particles currently in the system
 * @param dir a p5.Vector describing the direction of the force.
 */
ParticleSystem.prototype.applyForce = function(dir) {
    let len = this.particles.length;
    for (let i = 0; i < len; ++i) {
        this.particles[i].applyForce(dir);
    }
}

/**
 * Adds a new particle to the system at the origin of the system and with
 * the originally set texture.
 */
ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin, this.img));
}

//========= PARTICLE  ===========
/**
 *  A simple Particle class, renders the particle as an image
 */
let Particle = function(pos, img_) {
    this.loc = pos.copy();

    let vx = randomGaussian() * 0.3;
    let vy = randomGaussian() * 0.3 - 1.0;

    this.vel = createVector(vx, vy);
    this.acc = createVector();
    this.lifespan = 100.0;
    this.texture = img_;
}

/**
 *  Simulataneously updates and displays a particle.
 */
Particle.prototype.run = function() {
    this.update();
    this.render();
}

/**
 *  A function to display a particle
 */
Particle.prototype.render = function() {
    imageMode(CENTER);
    tint(255, this.lifespan);
    image(this.texture, this.loc.x, this.loc.y);
}

/**
 *  A method to apply a force vector to a particle.
 */
Particle.prototype.applyForce = function(f) {
    this.acc.add(f);
}

/**
 *  This method checks to see if the particle has reached the end of it's lifespan,
 *  if it has, return true, otherwise return false.
 */
Particle.prototype.isDead = function() {
    if (this.lifespan <= 0.0) {
        return true;
    } else {
        return false;
    }
}

/**
 *  This method updates the position of the particle.
 */
Particle.prototype.update = function() {
    this.vel.add(this.acc);
    this.loc.add(this.vel);
    this.lifespan -= 2.5;
    this.acc.mult(0);
}
