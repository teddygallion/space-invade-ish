/*----------------------------- Constants --------------------------------*/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 40,
    width: 30,
    height: 30,
    color: "red"
};

/*------------------------------ Variables --------------------------------*/

/*-------------------------------- Classes --------------------------------*/
class Alien {
    constructor(x, y, width = 30, height = 30) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "purple";
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color;
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }
}

/*-------------------------------- Functions --------------------------------*/
const aliens = [];
const alienRowCount = 3;
const alienColumnCount = 6;

function createAliens() {
    for (let col = 0; col < alienColumnCount; col++) {
        for (let row = 0; row < alienRowCount; row++) {
            aliens.push(new Alien(
                col * (40) + 50, 
                row * (40) + 30 
            ));
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y); 
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height); 
    ctx.closePath();
    ctx.fill();

    aliens.forEach(alien => alien.draw());
}

createAliens();
draw();
