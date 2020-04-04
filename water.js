var sound;
var playlist;
var g = 0;
var lowerBound = 30;
var button;
var button2;
let hue = 200;
var bubbles = [];
let numBubbles = 10;
var bubblesBg = [];
let numBubblesBg = 20;

function setup() {
    createCanvas(windowWidth - 4, windowHeight - 4);
    //second number means nothing apparently, but if i remove it, it get very dark
    colorMode(HSB, 360, 100);
    noStroke();

    button = createButton('next one');
    button.position(windowWidth * 9 / 10, windowHeight * 9 / 10);
    button.mousePressed(goToNature);

    button2 = createButton('last one');
    button2.position(windowWidth / 10, windowHeight * 9 / 10);
    button2.mousePressed(goToFire);

    for (var i = 0; i < numBubbles; i++){
        bubbles[i] = new Bubble(i / numBubbles, 20, 40);
    }
    for (var i = 0; i < numBubblesBg; i++){
        bubblesBg[i] = new Bubble(i / numBubblesBg, 5, 15);
    }
}

function windowResized() {
    resizeCanvas(windowWidth - 4, windowHeight - 4);
    button.position(windowWidth * 9 / 10, windowHeight * 9 / 10);
    button2.position(windowWidth / 10, windowHeight * 9 / 10);
    for (var i = 0; i < numBubbles; i++){
        bubbles[i].x = bubbles[i].horizontalProportion * windowWidth
    }
    for (var i = 0; i < numBubblesBg; i++){
        bubblesBg[i].x = bubblesBg[i].horizontalProportion * windowWidth
    }
}

function draw() {
    noStroke()
    var topBrightness = computeBrightness(g, PI / 2)
    fill(color(hue, 100, topBrightness));
    rect(0, 0, width, height / 4);

    var topMiddleBrightness = computeBrightness(g, PI / 3)
    fill(color(200, 100, topMiddleBrightness));
    rect(0, height / 4, width, height / 4);

    var bottomMiddleBrightness = computeBrightness(g, -PI / 3)
    fill(color(190, 100, bottomMiddleBrightness));
    rect(0, height * 2 / 4, width, height / 4);

    var bottomBrightness = computeBrightness(g, -PI / 2)
    fill(color(180, 100, bottomBrightness));
    rect(0, height * 3 / 4, width, height / 4);

    for (var i = 0; i < numBubblesBg; i++){
        bubblesBg[i].display();
    }
    for (var i = 0; i < numBubbles; i++){
        bubbles[i].display();
    }
}

function mouseWheel(event) {
    if (event.delta > 0) {
        // Scrolling up
        g -= 0.1;
        // Moves up foreground bubbles
        for (var i = 0; i < numBubbles; i++){
            bubbles[i].move(-4);
        }
        // Moves up background bubbles
        for (var i = 0; i < numBubblesBg; i++){
            bubblesBg[i].move(-1);
        }
    } else {
        // Scrolling down
        g += 0.1;
        // Moves down foreground bubbles
        for (var i = 0; i < numBubbles; i++){
            bubbles[i].move(4);
        }
        // Moves down background bubbles
        for (var i = 0; i < numBubblesBg; i++){
            bubblesBg[i].move(1);
        }
    }
}

//Page transitions
function goToFire() {
    window.location.href = "/fire.html";
}

function goToNature() {
    window.location.href = "/nature.html";
}

function computeBrightness(increment, offset) {
    /*
    Returns a brightness value between lowerBound and 100.
    In order to make the brigthness oscilate between lowerBound and 100 instead
    of jumping from one end to the other, I used the sin function. I offset
    so the top starts at 100 and the bottom at lowerBound. The sin function
    is incremented by a small g so the transitions are smooth when scrolling. The
    desired output for the variating piece is [0, 70]. This can be achieved with
    the function f(x) = 70 * (sin(x) + 1) / 2.
    */
    return (lowerBound + 35 * (Math.sin(increment + offset) + 1))
}


//Defines a Bubble class
function Bubble(horizontalPos, minSize, maxSize) {
    this.horizontalProportion = horizontalPos
    this.x = this.horizontalProportion * windowWidth;
    this.y = random(0, windowHeight);
    var size = random(minSize, maxSize)
    this.w = size;
    this.h = size;

    this.display = function() {
        color(190, 20);
        ellipse(this.x, this.y, this.w, this.h);
    }

    this.move = function(direction) {
        if (this.y < 0 - this.h) {
            this.y = windowHeight; //resets to the bottom of the screen
            var size = random(minSize, maxSize)
            this.w = size;
            this.h = size;
        } else if (this.y > windowHeight + this.h) {
            this.y = 0; //resets to the top of the screen
            var size = random(minSize, maxSize)
            this.w = size;
            this.h = size;
        } else {
            this.y += direction;
        }
    }
}
