let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});
let gameState = GameStates.START;
let score = 0;
let highScore = 0;
let time = 30;
let textPadding = 15;
let gameFont;

let bugs = [];
let bugSprites;
let initialBugCount = 5;
let baseSpeed = 1;

function preload() {
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
  bugSprites = loadImage("media/bug.png");
}

function setup() {
  createCanvas(400, 400);
  textFont(gameFont);
  for (let i = 0; i < initialBugCount; i++) {
    bugs.push(new Bug());
  }
}

function draw() {
  background(220);

  switch (gameState) {
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER to Start", width / 2, height / 2);
      break;
    case GameStates.PLAY:
      textAlign(LEFT, TOP);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);

      time -= deltaTime / 1000;
      if (time <= 0) {
        gameState = GameStates.END;
      }

      for (let bug of bugs) {
        bug.update();
        bug.display();
      }
      break;
    case GameStates.END:
      textAlign(CENTER, CENTER);
      text("Game Over!", width / 2, height / 2 - 20);
      text("Score: " + score, width / 2, height / 2);
      if (score > highScore) highScore = score;
      text("High Score: " + highScore, width / 2, height / 2 + 20);
      textSize(12);
      text("Press ENTER to Restart", width / 2, height / 2 + 40);
      break;
  }
}

function mousePressed() {
  if (gameState === GameStates.PLAY) {
    for (let bug of bugs) {
      if (bug.isClicked(mouseX, mouseY)) {
        bug.squish();
        score++;
        increaseSpeed();
        break;
      }
    }
  }
}

function keyPressed() {
  switch (gameState) {
    case GameStates.START:
      if (keyCode === ENTER) {
        startGame();
      }
      break;
    case GameStates.END:
      if (keyCode === ENTER) {
        startGame();
      }
      break;
  }
}

function startGame() {
  gameState = GameStates.PLAY;
  score = 0;
  time = 30;
  bugs = [];
  baseSpeed = 1;
  for (let i = 0; i < initialBugCount; i++) {
    let bug = new Bug();
    bug.speed = baseSpeed;
    bugs.push(bug);
  }
}

function increaseSpeed() {
  baseSpeed *= 1.1;
  for (let bug of bugs) {
    bug.speed *= 1.1;
  }
}

class Bug {
  constructor() {
    this.spriteWidth = bugSprites.width / 2;
    this.spriteHeight = bugSprites.height / 3;
    this.size = 40;
    this.x = random(width - this.size);
    this.y = random(height - this.size);
    this.speed = baseSpeed;
    this.angle = random(TWO_PI);
    this.frame = 0;
    this.squished = false;
    this.frameDelay = 10;
    this.frameCounter = 0;
  }

  update() {
    if (this.squished) return;

    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frame = (this.frame + 1) % 2;
      this.frameCounter = 0;
    }

    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    // Bounce off walls
    if (this.x < 0 || this.x > width - this.size) {
      this.angle = PI - this.angle;
    }
    if (this.y < 0 || this.y > height - this.size) {
      this.angle = -this.angle;
    }
  }

  display() {
    push();
    translate(this.x + this.size / 2, this.y + this.size / 2);

    if (this.squished) {
      image(
        bugSprites,
        -this.size / 2, -this.size / 2,
        this.size, this.size,
        0, this.spriteHeight * 2,
        this.spriteWidth, this.spriteHeight
      );
    } else {
      rotate(this.angle + HALF_PI); // Face movement direction
      let row = 0; // Up/Down sprite row
      if (abs(cos(this.angle)) > abs(sin(this.angle))) {
        row = 1; // Left/Right sprite row
      }
      image(
        bugSprites,
        -this.size / 2, -this.size / 2,
        this.size, this.size,
        this.frame * this.spriteWidth,
        row * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight
      );
    }
    pop();
  }

  isClicked(mx, my) {
    let d = dist(mx, my, this.x + this.size / 2, this.y + this.size / 2);
    return d < this.size / 2 && !this.squished;
  }

  squish() {
    this.squished = true;
    setTimeout(() => this.respawn(), 500);
  }

  respawn() {
    this.x = random(width - this.size);
    this.y = random(height - this.size);
    this.angle = random(TWO_PI);
    this.squished = false;
  }
}
