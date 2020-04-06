var sound;
var playlist;
var g = 0;
var lowerBound = 30;
var button;
var button2;
let hue = 120;
var t = 0;

function preload() {
    //  sound = loadSound('')
}

function setup() {
    createCanvas(windowWidth - 4, windowHeight - 4);
    //second number means nothing apparently, but if i remove it, it get very dark
    colorMode(HSB, 360, 100);
    noStroke();

    button = createButton('next one');
    button.position(windowWidth * 9 / 10, windowHeight * 9 / 10);
    button.mousePressed(goToFire);

    button2 = createButton('last one');
    button2.position(windowWidth / 10, windowHeight * 9 / 10);
    button2.mousePressed(goToWater);
}

function windowResized() {
    resizeCanvas(windowWidth - 4, windowHeight - 4);
    button.position(windowWidth * 9 / 10, windowHeight * 9 / 10);
    button2.position(windowWidth / 10, windowHeight * 9 / 10)
}

function draw() {
    t += 0.1;
    background(220);
    var topBrightness = computeBrightness(g, PI / 2);
    fill(color(hue - 10, 100, topBrightness));
    rect(0, 0, width, height / 4);

    var topMiddleBrightness = computeBrightness(g, PI / 3);
    fill(color(hue, 100, topMiddleBrightness));
    rect(0, height / 4, width, height / 4);

    var bottomMiddleBrightness = computeBrightness(g, -PI / 3);
    fill(color(hue + 10, 100, bottomMiddleBrightness));
    rect(0, height * 2 / 4, width, height / 4);

    var bottomBrightness = computeBrightness(g, -PI / 2);
    fill(color(hue + 20, 100, bottomBrightness));
    rect(0, height * 3 / 4, width, height / 4);

    //left to right targets
    drawTarget(width / 4, height * 6 / 10, 300, 4);
    drawTarget(width * 3 / 5, height / 3, 400, 6);
    drawTarget(width * 6 / 8, height * 6 / 10 , 200, 5);
}

function mousePressed() {
    if (!sound.isPlaying()) {
        sound.loop();
    }
}

function computeBrightness(increment, offset) {
    return (lowerBound + 35 * (Math.sin(increment + offset) + 1))
}

function mouseWheel(event) {
    console.log(event.delta);
    console.log("scrolling");
    if (event.delta > 0) {
        g -= 0.1;
    } else {
        g += 0.1;
    }
}

//code dump
function goToFire() {
    window.location.href = "/fire.html";
}

function goToWater() {
    window.location.href = "/index.html";
}

function computeBrightness(increment, offset) {
    return (lowerBound + 35 * (Math.sin(increment + offset) + 1));
}

// Source:https://p5js.org/examples/structure-functions.html?fbclid=IwAR0e5WhUDzWojHVpuGG0n-boTPrbxPe6VQ3EvVQObkX0p58vqXXlBrHQSs4
function drawTarget(xloc, yloc, size, num) {
  const steps = size / num;
  for (let i = 0; i < num; i++) {
    fill(hue, 100, computeBrightness(t, i * PI / num));
    ellipse(xloc, yloc, size - i * steps, size - i * steps);
  }
}
