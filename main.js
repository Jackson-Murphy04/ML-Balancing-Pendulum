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
const cart = new Cart(canvas.width / 2 - railWidth * 0.1 / 2, railTop - railHeight * 0.25, railWidth * 0.1, railHeight * 1.5, railMin, railMax);

//initialize pendulum
const pendulum = new Pendulum((canvas.height / 2) * .6, (canvas.height / 2) * .6 * .1, canvas.width / 2, railTop + railHeight / 2, Math.PI / 4);

// Start the animation loop
animate();
function animate() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the rail
    ctx.fillStyle = "black";
    ctx.fillRect(railMin, railTop, railWidth, railHeight);
    
    // Update and draw the cart and pendulum
    cart.update();
    pendulum.update(cart.middle);
    ctx.save();
    cart.draw(ctx);
    pendulum.draw(ctx);
    ctx.restore();
    requestAnimationFrame(animate);

}