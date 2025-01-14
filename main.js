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

//initialize pendulum cart
//const cart = new Cart(canvas.width / 2 - railWidth * 0.1 / 2, railTop - railHeight * 0.25, railWidth * 0.1, railHeight * 1.5, railMin, railMax, "AI");

//initialize pendulum
//const pendulum = new Pendulum((canvas.height / 2) * .6, (canvas.height / 2) * .6 * .1, canvas.width / 2, railTop + railHeight / 2, Math.PI / 4);

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
    if (pendulum.bobY < (canvas.height / 2)) {
        pendulum.score += (pendulum.bobY - canvas.height) * -1 * 10;
    }
    if (pendulum.bobY > (canvas.height / 2) - 10 && pendulum.bobY > (canvas.height / 2) + 10) {
        if (pendulum.score > 1000) {
            pendulum.score -= pendulum.cross * 100;
            pendulum.cross += 1;
        }
        if (pendulum.score < 0) {
            pendulum.score = 100;
        }
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

function restart(best) {
    
}

// Start the animation loop
animate();
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
    
    console.log(getBest());

    requestAnimationFrame(animate);
}