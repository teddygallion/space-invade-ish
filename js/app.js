/*-------------------------------- Constants --------------------------------*/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 20,
    color: "purple"
};

const aliens = [];
const bullets = [];
const stars = [];

const alienRowCount = 3;
const alienColumnCount = 6;

/*----------------------------- Variables -----------------------------------*/
let alienSpeed = 0.5;
let alienDirection = 1;
let isGameOver = false;
let score = 0;

/*------------------------ Cached Element References ------------------------*/


/*-------------------------------- Classes ----------------------------------*/
class Alien {
    constructor(x, y, width = 30, height = 20) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.status = 1; // 1 = alive, 0 = destroyed
        this.color = "red";
    }

    move(speed, direction) {
        this.x += speed * direction;
    }

    descend(amount) {
        this.y += amount;
    }

    draw() {
        if (this.status === 1) {
            ctx.fillStyle = this.color;
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + this.width, this.y);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        }
    }
    checkCollision(bullet) {
        return (
            bullet.x < this.x + this.width &&
            bullet.x + bullet.width > this.x &&
            bullet.y < this.y + this.height &&
            bullet.y + bullet.height > this.y
        );
    }
}

class Star {
    constructor() {
        this.x = random(0, canvas.width);
        this.y = random(0, canvas.height);
        this.size = random(1, 3);
        this.alpha = random(0.3, 1);
        this.speed = random(0.1, 0.3); // Slower movement
    }

    update() {
        this.y += this.speed;

        // Reset when the star moves off-screen
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = random(0, canvas.width);
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/*------------------------ Cached Element References ------------------------*/
function random(min, max) {
    return min + Math.random() * (max - min);
}

function createStars() {
    const numStars = (canvas.width * canvas.height) / 1000; 
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

function drawStars() {
    for (let star of stars) {
        star.update();
        star.draw();
    }
}

function createAliens() {
    for (let col = 0; col < alienColumnCount; col++) {
        aliens[col] = [];
        for (let row = 0; row < alienRowCount; row++) {
            aliens[col][row] = new Alien(
                col * (30 + 10) + 30,
                row * (20 + 10) + 30,
            );
        }
    }
}
createAliens();
createStars(); // Populate stars before starting the game

/*----------------------------- Event Listeners -----------------------------*/
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && player.x > 0) {
        e.preventDefault();
        player.x -= 5;
    } else if (e.key === "ArrowRight" && player.x < canvas.width - player.width) {
        e.preventDefault();
        player.x += 5;
    } else if (e.key === " ") {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            color: "white",
            speed: 5
        });
    }
});

/*-------------------------------- Game Loop --------------------------------*/
function game() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawStars(); // Draw moving stars

    // Draw Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Move & Draw Aliens
    for (let col = 0; col < alienColumnCount; col++) {
        for (let row = 0; row < alienRowCount; row++) {
            let alien = aliens[col][row];
            if (alien.status === 1) {
                alien.move(alienSpeed, alienDirection);
                alien.draw();
            }
        }
    }

    // Change Alien Direction on Wall Hit
    for (let col = 0; col < alienColumnCount; col++) {
        for (let row = 0; row < alienRowCount; row++) {
            let alien = aliens[col][row];
            if (alien.status === 1) {
                if (alien.x + alien.width > canvas.width || alien.x < 0) {
                    alienDirection *= -1;
                    aliens.flat().forEach((a) => a.descend(20));
                    break;
                }
                if (alien.y > player.y - alien.height) {
                    isGameOver = true;
                    displayGameOver();
                }
            }
        }
    }

    // Draw & Move Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;

        // Check Collision with Aliens
        for (let col = 0; col < alienColumnCount; col++) {
            for (let row = 0; row < alienRowCount; row++) {
                let alien = aliens[col][row];
                if (alien.status === 1 && alien.checkCollision(bullet)) {
                    alien.status = 0; // Destroy alien
                    bullets.splice(i, 1); // Remove bullet
                    score += 10;
                    break;
                }
            }
        }

        // Remove bullets that go off-screen
        if (bullet.y < 0) {
            bullets.splice(i, 1);
        }
    }

    // Display Score
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 8, 20);
    // Check if all aliens are destroyed
    if (aliens.flat().every(alien => alien.status === 0)) {
        isGameOver = true;
        displayWin();
    }

    requestAnimationFrame(game);
}

/*----------------------------- Game Over & Win -----------------------------*/
function displayGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
}

function displayWin() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
}

// Start the game
game();
   