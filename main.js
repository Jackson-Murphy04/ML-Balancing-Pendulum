// Canvas Setup
const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//draw car rail
ctx.fillStyle = "black";
const railWidth = canvas.width * 0.7;
const railHeight = canvas.height * 0.05;
const railMin = canvas.width / 2 - railWidth / 2;
const railMax = canvas.width / 2 + railWidth / 2;
const railTop = canvas.height / 2 - railHeight / 2;
const railBottom = canvas.height / 2 + railHeight / 2;

//center rail on canvas and draw
ctx.fillRect(railMin, railTop, railWidth, railHeight);

//set canvas and rail to resize with window
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillRect(canvas.width / 2 - railWidth / 2, canvas.height / 2 - railHeight / 2, railWidth, railHeight);
});

let count = 0;
//add function for start and stoping of sim
let isAnimating = false;
let animationFrameId;
function startSim() {
    if (!isAnimating) {
        isAnimating = true;
        if (count == 60) {
            final();
        } else {
            startTimer();
            animate();
        }
        count++;
    }
}

//start timer function
//define timer duration (60 seconds)
let timerDuration = 6000;
let timerId;
function startTimer() {
    if(timerId) {
        clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
        stopSim();
    }, timerDuration);
}

const carts = [];
const pendulums = [];
initCarts(1000);

function initCarts(total) {
    for (let i = 0; i < total; i++) {
        const cart = new Cart(canvas.width / 2 - railWidth * 0.1 / 2, railTop - railHeight * 0.25, railWidth * 0.1, railHeight * 1.5, railMin, railMax, "AI");
        const pendulum = new Pendulum((canvas.height / 2) * .6, (canvas.height / 2) * .6 * .1, canvas.width / 2, railTop + railHeight / 2, Math.PI / 4);
        carts.push(cart);
        pendulums.push(pendulum);
    }
    return;
}

function fitness(pendulum) {
    // reward for being above
    if (pendulum.bobY < (canvas.height / 2)) {
        pendulum.score += (pendulum.bobY - canvas.height) * -1 * 10;
    }
    // penalize for being below
    if (pendulum.bobY > (canvas.height / 2)) {
        pendulum.score -= 10;
    }
    // penalize for crossing to many times
    if (pendulum.bobY > (canvas.height / 2) - 10 && pendulum.bobY > (canvas.height / 2) + 10) {
        if (pendulum.score > 1000) {
            pendulum.score -= pendulum.cross * 10;
            pendulum.cross += 1;
        }
    }
    // penalize for not moving
    if (pendulum.angleV == 0) {
        score -= 100;
    }
}

function getBest() {
    let high = 0; 
    let index = 0;
    for (let i = 0; i < carts.length; i++) {
        if(pendulums[i].score > high) {
            high = pendulums[i].score;
            index = i;
        }
    }
    return index;
}

//declare mutation rate
let mutationRate = 0.2;

function stopSim() {
    console.log("restart");
    if (isAnimating) {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);

        // save best
        let bestBrain = JSON.parse(JSON.stringify(carts[getBest()].brain));

        // Mutate network based on best brain
        for (let i = 0; i < carts.length; i++) {
            carts[i].reset();
            pendulums[i].reset();
        }

        for (let i = 0; i < carts.length; i++) {
            carts[i].brain = JSON.parse(JSON.stringify(bestBrain)); // Clone the best overall brain
            if (i != 0) {
                NeuralNetwork.mutate(carts[i].brain, mutationRate);
            }
        }

        carts[0].brain = bestBrain;

        // Add a small delay before restarting to ensure everything is reset
        setTimeout(() => {
            startSim();
        }, 0);
    }
}

function final() {
    console.log("final");
    if (isAnimating) {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);

        // save best
        let bestBrain = JSON.parse(JSON.stringify(carts[getBest()].brain));

        // Mutate network based on best brain
        for (let i = 0; i < carts.length; i++) {
            carts[i].reset();
            pendulums[i].reset();
        }

        carts[0].brain = bestBrain;
        
        carts.length = 1;
        pendulums.length = 1;

        // Clear the canvas and redraw the remaining cart and pendulum
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(railMin, railTop, railWidth, railHeight);

        animate();
    }
}

// Start the animation loop
//animate();
startSim();
function animate() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the rail
    ctx.fillStyle = "black";
    ctx.fillRect(railMin, railTop, railWidth, railHeight);
    
    // make transparent
    ctx.globalAlpha = 0.2;

    ctx.save();
    // Update and draw the cart and pendulum
    for (let i = 0; i < carts.length; i++) {
        carts[i].update(i);
        pendulums[i].update(carts[i].middle, carts[i].speed);
        carts[i].draw(ctx);
        pendulums[i].draw(ctx);
        fitness(pendulums[i]);
    }
    carts[getBest()].draw(ctx, "blue");
    pendulums[getBest()].draw(ctx, "blue");
    ctx.restore();

    requestAnimationFrame(animate);
}