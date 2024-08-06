
class Pendulum {
    constructor (length, radius, x, y, angle) {
        this.length = length;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.angle = angle;

        this.angleV = 0;
        this.angleA = 0;
        this.force = 0;
        this.bobX;
        this.bobY;
        this.gravity = 1;
    }

    update(middle) {
        //update pendulum force based on gravity value and angle
        this.force = this.gravity * Math.sin(this.angle);
        //calculate angle accel
        this.angleA = (-1 * this.force) / this.length;
        //calculate angle velocity
        this.angleV += this.angleA;
        this.angle += this.angleV;

        //add some friction to slow down over time
        this.angleV *= .99

        this.bobX = this.length * Math.sin(this.angle) + this.x;
        this.bobY = this.length * Math.cos(this.angle) + this.y;

        this.x = middle[0].x;
        this.y = middle[0].y;
    }

    draw(ctx) {
        ctx.lineWidth = 10;
        ctx.fillStyle = "red";
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.bobX, this.bobY)
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.bobX, this.bobY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}