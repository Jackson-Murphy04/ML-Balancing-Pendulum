class Cart {
    constructor(x, y, width, height, minX, maxX) {
        //basic location and size attributes
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        //basic movement attributes
        this.speed = 0;
        this.acceleration = 0.5;
        this.maxSpeed = 5;
        this.friction = 0.2;

        //movement constraints
        this.minX = minX;
        this.maxX = maxX;

        //controls
        this.controls = new Controls();
    }

    update() {
        this.#move();
        this.polygon = this.#createPolygon();
    }

    #move() {
        //move car left and right
        if(this.controls.left) {
            this.speed -= this.acceleration;
        }
        if(this.controls.right) {
            this.speed += this.acceleration;
        }

        /*
        if(!this.controls.left && !this.controls.right) {
            this.speed = 0;
        }
*/

        //apply friction
        if(this.speed < 0) {
            this.speed += this.friction;
        }
        if(this.speed > 0) {
            this.speed -= this.friction;
        }

        //prevent tiny speed values
        if(Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        //limit speed
        if(this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed) {
            this.speed = -this.maxSpeed;
        }

        //prevent cart from moving out of bounds
        if(this.x < this.minX) {
            this.x = this.minX;
        }
        if(this.x > this.maxX - this.width) {
            this.x = this.maxX - this.width;
        }

        //update position
        this.x += this.speed;
    }

    #createPolygon() {
        const points = [];
        points.push({
            x: this.x,
            y: this.y
        });
        points.push({
            x: this.x + this.width,
            y: this.y
        });
        points.push({
            x: this.x + this.width,
            y: this.y + this.height
        });
        points.push({
            x: this.x,
            y: this.y + this.height
        });
        return points;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        //draw based on polygon points
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
    }
}