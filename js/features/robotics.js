/**
 * Virtual Robotics Lab
 * Simulates simple hardware (LEDs) via HTML Canvas
 */

export class RoboticsSim {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.ledState = false;
    }

    init() {
        const canvas = document.getElementById(this.canvasId);
        if (canvas) {
            this.ctx = canvas.getContext('2d');
            this.draw();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, 300, 300);
        
        // Board
        this.ctx.fillStyle = '#2d6a4f';
        this.ctx.fillRect(50, 50, 200, 200);
        
        // LED
        this.ctx.beginPath();
        this.ctx.arc(150, 150, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.ledState ? '#ef4444' : '#7f1d1d'; // Bright Red vs Dark Red
        this.ctx.fill();
        this.ctx.stroke();
    }

    // Exposed to Python
    turnOn() {
        this.ledState = true;
        this.draw();
    }

    turnOff() {
        this.ledState = false;
        this.draw();
    }
}
