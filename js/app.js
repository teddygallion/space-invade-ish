/*-------------------------------- Cached Elements --------------------------------*/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");
const startScreen = document.getElementById("startScreen")
const resultsDisplay = document.getElementById('display')
/*------------------------------ Load Assets -----------------------------*/
const playerImg = new Image();
playerImg.src = "https://teddygallion.github.io/space-invade-ish/assets/images/player.png";

const enemyImg1 = new Image();
enemyImg1.src = "https://teddygallion.github.io/space-invade-ish/assets/images/enemy1.png";

const enemyImg2 = new Image()
enemyImg2.src = "https://teddygallion.github.io/space-invade-ish/assets/images/enemy2.png"

const blaster = new Audio("https://teddygallion.github.io/space-invade-ish/assets/audio/blaster.wav");
blaster.preload = 'auto';
blaster.load();
blaster.volume = .05
const enemyBlaster = new Audio("https://teddygallion.github.io/space-invade-ish/assets/audio/reversed.wav");
enemyBlaster.preload = 'auto';
enemyBlaster.load();
enemyBlaster.volume = .05
const explosion = new Audio("https://teddygallion.github.io/space-invade-ish/assets/audio/explosion.mp3")
explosion.preload = 'auto';
explosion.load();
explosion.volume = .05
/*-------------------------------- Constants --------------------------------*/
const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    draw() {
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    }
};

const aliens = [];
const bullets = [];
const alienBullets = [];
const stars = [];
const alienRowCount = 4;
const alienColumnCount = 8;

/*----------------------------- Variables -----------------------------------*/
let alienSpeed = 0.5;
let alienDirection = 1;
let gameStarted = false;
let isGameOver = false;
let isPaused = false;
let waveComplete = false;
let score = 0;
let wave = 1

/*-------------------------------- Classes ----------------------------------*/
class Alien {
    constructor(x, y, width = 50, height = 50) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.status = 1;
    }
    move(speed, direction) {
        this.x += speed * direction;
    }

    descend(amount) {
        this.y += amount;
    }

    draw(img) {
        if (this.status === 1) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
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
    shoot(){
         const bullet = {
            x: this.x + this.width / 2 - 2.5,
            y: this.y + this.height, 
            width: 5,
            height: 10,
            color: "red",
            speed: 2,
        };
        alienBullets.push(bullet);
        let enemyBlasterSound = enemyBlaster.cloneNode();
        enemyBlasterSound.volume = .05;
        enemyBlasterSound.play();
    }

}

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.speed = Math.random() * 0.2 + 0.1;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/*----------------------------- Functions -----------------------------*/

function createAliens() {
    for (let col = 0; col < alienColumnCount; col++) {
        aliens[col] = [];
        for (let row = 0; row < alienRowCount; row++) {
            aliens[col][row] = new Alien(col * 40 + 30, row * 30 + 30);
        }
    }
}

function createStars() {
    const numStars = (canvas.width * canvas.height) / 2000;
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

function moveAliens() {
    for (let col of aliens) {
        for (let alien of col) {
            if (alien.status === 1) {
                alien.move(alienSpeed, alienDirection);
                alien.draw(wave === 1 ? enemyImg1 : enemyImg2)
                if (alien.x + alien.width > canvas.width || alien.x < 0) {
                    alienDirection *= -1;
                    aliens.flat().forEach(a => a.descend(20));
                    return;
                }
                if (alien.y + alien.height >= player.y) {
                    isGameOver = true;
                    displayGameOver();
                    return;
                }
            }
        }
    }
}

function movePlayer(e) {
    e.preventDefault();
    if (e.key === "ArrowLeft" && player.x > 0) {
        player.x -= 10;
    } else if (e.key === "ArrowRight" && player.x < canvas.width - player.width) {
        player.x += 10;
    } else if (e.key === " ") {
        shootBullet();
    } else if (e.key.toLowerCase() === "p") {
        togglePause();
    }
}



function enemyShoot() {
    const firingWindow = player.width / 2 + 20;
    const shootingAliens = aliens.flat().filter(alien => 
        alien.status === 1 && Math.abs(alien.x + alien.width / 2 - (player.x + player.width / 2)) <= firingWindow
    );

    if (shootingAliens.length === 0) return;

    const shooter = shootingAliens[Math.floor(Math.random() * shootingAliens.length)];
    shooter.shoot();
}


setInterval(() => {
    if (gameStarted && !isGameOver && !isPaused) {
        enemyShoot();
    }
}, 1500); 

function shootBullet() {
    if(!isGameOver && !isPaused){
        let triggerBlaster = blaster.cloneNode();
        triggerBlaster.volue = .05;
        triggerBlaster.play();
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            color: "white",
            speed: 5
        });
    }
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed; 

        for (let col of aliens) {
            for (let alien of col) {
                if (alien.status === 1 && alien.checkCollision(bullet)) {
                    let explosionInst = explosion.cloneNode();
                    explosionInst.volume =.05;
                    explosionInst.play();
                    alien.status = 0;
                    bullets.splice(i, 1);
                    score += 10;
                    return;

                    
                }
            }
        }

        if (bullet.y < 0) bullets.splice(i, 1);
    }

    for (let i = alienBullets.length - 1; i >= 0; i--) {
        let bullet = alienBullets[i];
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y += bullet.speed; 


        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            let explosionInst = explosion.cloneNode();
            explosionInst.volume = .05;
            explosionInst.play();
            isGameOver = true;
            displayLose();
            return;
        }

        if (bullet.y > canvas.height) {
            alienBullets.splice(i, 1);
        }
    }
}

function drawStars() {
    for (let star of stars) {
        star.update();
        star.draw();
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 8, 20);   
}

function checkGameOver() {
    if (aliens.flat().every(alien => alien.status === 0)) {
        if (wave >= 3) {
            isGameOver = true;
            displayWin();
        } else {
            displayWaveComplete();
        }
    }
}

function game() {
    
    if (!gameStarted || isGameOver || waveComplete) return;

    if (isPaused) {
        handlePause();
        return;
    }

    document.documentElement.dataset.interacted = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    player.draw();
    moveAliens();
    updateBullets(); 
    drawScore();
    checkGameOver();

    requestAnimationFrame(game);
}

function drawInitialFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars();  
    player.draw();
    aliens.flat().forEach(alien => alien.draw(enemyImg1)); 
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawScore(); 
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press any key or click to start", canvas.width / 2, canvas.height /2);

}


function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game();
    }
}
function displayLose(){
    alienBullets.length =0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You Lose!", canvas.width / 2, canvas.height / 2);
    resetBtn.style.display = "block";
}

function displayWin() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
    resetBtn.style.display = "block";

}
function resetGame() {
    isGameOver = false;
    isPaused = false;
    score = 0;
    alienDirection = 1;
    aliens.length = 0;
    bullets.length = 0;
    alienBullets.length = 0;
    
    createAliens();
    resetBtn.style.display = "none";
    
    game();
}

function togglePause() {
    isPaused = !isPaused;

    if (!isPaused) {
        game();
    }
}
function displayWaveComplete() {
    waveComplete = true; 
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Wave ${wave} Completed!`, canvas.width / 2, canvas.height / 2);
    wave++;
    resetBtn.style.display="none";
    let countdown = 3;
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawStars();
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(`Next wave in: ${countdown}`, canvas.width / 2, canvas.height / 2);

        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            waveComplete = false; 
            startNextWave();
        }
    }, 1000);
}
function startNextWave() {
    aliens.length = 0; 
    alienBullets.length = 0;
    alienDirection = 1;
    let newRowCount = alienRowCount + Math.floor(wave / 2); 
    let newColumnCount = alienColumnCount + Math.floor(wave / 3);

    for (let col = 0; col < newColumnCount; col++) {
        aliens[col] = [];
        for (let row = 0; row < newRowCount; row++) {
            aliens[col][row] = new Alien(col * 40 + 30, row * 30 + 30);
        }
    }

    alienSpeed += 0.1;
    game();
}

function handlePause() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Paused", canvas.width / 2, canvas.height / 2);
}

/*------------------------ Event Listeners -----------------------------*/
document.addEventListener("keydown", startGame);
document.addEventListener("click", startGame);
document.addEventListener("keydown", movePlayer);
resetBtn.addEventListener("click", resetGame)

/*-------------------------- Start Game ------------------------*/
playerImg.onload = enemyImg1.onload = () => {
    createAliens();
    createStars();
    drawInitialFrame();
    game();

};
