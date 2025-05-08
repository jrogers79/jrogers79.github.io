let ship;
let shipCharacter;
let score = 0;
let scoreP;
let lives = 3;
let gameStarted = false;
let gameOver = false;

let stars = [];
let bullets = [];
let lastShotTime = 0;
let shotCooldown = 300; // milliseconds between shots

let enemies = [];
let enemyImage;
let enemySpawnInterval = 2000; // spawn every 2 seconds
let lastEnemySpawn = 0;
let enemyBullets = [];

let basicSynth, noiseEnv, noise1;
let audioStarted = false;

let port;
let connectButton;
let serial;
let xInput = 512;
let yInput = 512;

function preload() {
  ship = loadImage("media/ship.png");
  enemy = loadImage("media/enemy.png");
}

function initAudio() {
  if (audioStarted) return; // Prevent re-init
  audioStarted = true;

  // FIRE SOUND: Simple synth
  basicSynth = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: 0.1
    }
  }).toDestination();

  // DAMAGE SOUND: Noise burst
  noise1 = new Tone.Noise("white");
  noiseEnv = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: 0.2,
    sustain: 0,
    release: 0.1
  }).toDestination();

  noise1.connect(noiseEnv);
}


function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  // Initialize stars
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 2),
      speed: random(1, 3)
    });
  }
  shipCharacter = new ShipCharacter(width/2, height/2); // Start in center

  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(() => {
    port.open("Arduino", 9600);
    // Start the Tone.js audio context
    Tone.start().then(() => {
      console.log("Audio Context Started");
      initAudio();  // Initialize audio (Synths & Envelopes)
    }).catch((err) => {
      console.error("Audio context could not be started:", err);
    });
  });  
  scoreP = createP("Score: 0 | Lives: 3");
  scoreP.style("color", "black");
}

function draw() {
  background(0);
  let now = millis();

  // Update & draw stars
  for (let star of stars) {
    star.y += star.speed;
    if (star.y > height) {
      star.y = 0;
      star.x = random(width);
    }
    noStroke();
    fill(255);
    ellipse(star.x, star.y, star.size);
  }

  if (gameStarted && !gameOver && now - lastEnemySpawn > enemySpawnInterval) {
    enemies.push({
      x: random(40, width - 40), // Start somewhere across the screen
      y: random(20, height / 2),
      speed: random([-2, 2]),    // Random horizontal direction
      shootCooldown: random(1000, 3000),
      lastShot: now
    });
    lastEnemySpawn = now;
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.x += e.speed;
    // Bounce off walls
    if (e.x < 40 || e.x > width - 40) {
      e.speed *= -1;
    }

    image(enemy, e.x, e.y, 80, 80);

    // Enemy Shooting
    if (now - e.lastShot > e.shootCooldown) {
      enemyBullets.push({
        x: e.x,
        y: e.y + 20,
        speed: 4
      });
      e.lastShot = now;
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      if (dist(e.x, e.y, b.x, b.y) < 20) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 100;
        scoreP.html("Score: " + score + " | Lives: " + lives);
        break;
      }
    }

    // Remove if off screen
    if (e.y > height + 40) {
      enemies.splice(i, 1);
    }
  }
  

  let line = port.readUntil('\n');
  if (line.length > 0) {
    line = line.trim();

    // Movement
    let xMatch = line.match(/X:(\d+)/);
    let yMatch = line.match(/Y:(\d+)/);
  
    if (xMatch && yMatch) {
      xInput = int(xMatch[1]);
      yInput = int(yMatch[1]);
    }

    // Firing
    if (line === "FIRE") {
      if (!gameStarted) {
        gameStarted = true;
        return;
      }

      // Restart if game is over
      if (gameOver) {
        // Reset game state
        score = 0;
        lives = 3;
        bullets = [];
        enemies = [];
        enemyBullets = [];
        gameOver = false;
        port.write("LIVES:3\n"); // Reset LED lives on Arduino
        scoreP.html("Score: " + score + " | Lives: " + lives);
        return;
      }

      let currentTime = millis();
      if (currentTime - lastShotTime > shotCooldown && !gameOver) {
        bullets.push({
          x: shipCharacter.x,
          y: shipCharacter.y - 20,
          speed: 5
        });
        lastShotTime = currentTime;
        playFireSound();
      }
    }
  }
  
  shipCharacter.update();
  shipCharacter.draw();

  // Update and draw bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;

    fill(255, 255, 0);
    ellipse(bullets[i].x, bullets[i].y, 5, 10);

    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    let b = enemyBullets[i];
    b.y += b.speed;
  
    fill(255, 0, 0);
    ellipse(b.x, b.y, 5, 10);
  
    // Optional: check collision with player
    if (dist(b.x, b.y, shipCharacter.x, shipCharacter.y) < 20 && !gameOver) {
      console.log("Player hit!");
      playDamageSound();
      enemyBullets.splice(i, 1);
      lives--;

      scoreP.html("Score: " + score + " | Lives: " + lives);

      if (lives <= 0) {
        gameOver = true;
      }
      port.write("LIVES:" + lives + "\n");
    }

    if (b.y > height) {
      enemyBullets.splice(i, 1);
    }
  }  

  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 0, 0);
    text("GAME OVER", width / 2, height / 2);
  }
}

function serialEvent() {
  let data = serial.readLine().trim();
  if (data.length > 0) {
    let parts = data.split(',');
    if (parts.length === 2) {
      xInput = int(parts[0]);
      yInput = int(parts[1]);
    }
  }
}

class ShipCharacter {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update() {
    let dx = map(xInput, 0, 1023, -2, 2);
    let dy = map(yInput, 0, 1023, -2, 2);

    this.x += dx;
    this.y += dy;

    // Optional: clamp to screen
    this.x = constrain(this.x, 40, width - 40);
    this.y = constrain(this.y, 40, height - 40);
  }

  draw() {
    image(ship, this.x, this.y, 80, 80);
  }
}

function playFireSound() {
  basicSynth.triggerAttackRelease("C5", 0.1); // short beep
  basicSynth.frequency.rampTo("E5", 0.05);    // quick pitch change
}

function playDamageSound() {
  noise1.start();
  noiseEnv.triggerAttackRelease("8n");
  setTimeout(() => noise1.stop(), 300); // stop the noise after the envelope
}