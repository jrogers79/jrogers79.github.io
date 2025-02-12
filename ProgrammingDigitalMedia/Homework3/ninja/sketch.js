let ninja;
let characters = [];

function preload() {
  ninja = loadImage("media/ninja.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  for (let i = 0; i < 9; i++) {
    let x = random(80, width-80);
    let y = random(80, height-80);
    let character = new Character(x,y);
    character = new Character(random(80, width-80),random(80, height-80));
    character.addAnimation("down", new SpriteAnimation(ninja, 6, 5, 6));
    character.addAnimation("up", new SpriteAnimation(ninja, 0, 5, 6));
    character.addAnimation("right", new SpriteAnimation(ninja, 1, 0, 8));
    character.addAnimation("left", new SpriteAnimation(ninja, 1, 0, 8));
    character.addAnimation("stand", new SpriteAnimation(ninja, 0, 0, 1));
    character.currentAnimation = "stand";

    characters.push(character);
  }
}

function draw() {
  background(220);

  for (let i = 0; i < characters.length; i++) {
    characters[i].draw();
  }
}

function keyPressed() {
  for (let i = 0; i < characters.length; i++) {
    characters[i].keyPressed();
  }
}

function keyReleased() {
  for (let i = 0; i < characters.length; i++) {
    characters[i].keyReleased();
  }
}

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.animations = {};
    this.facingLeft = false; // Track direction
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch (this.currentAnimation) {
        case "up":
          this.y -= 2;
          break;
        case "down": 
          this.y += 2;
          break;
        case "left":
          this.x -= 2;
          break;
        case "right": 
          this.x += 2;
          break;
      }
      push();
      translate(this.x, this.y);

      // Flip sprite if facing left
      if (this.facingLeft) {
        scale(-1, 1);  // Flip horizontally
      }

      animation.draw();
      pop();
    }
  }

  keyPressed() {
    switch(keyCode) {
      case UP_ARROW:
        this.currentAnimation = "up";
        break;
      case DOWN_ARROW:
        this.currentAnimation = "down";
        break;
      case LEFT_ARROW:
        this.currentAnimation = "left";  // You could change to walking animation if you have one
        this.facingLeft = true; // Set facing direction to left
        break;
      case RIGHT_ARROW:
        this.currentAnimation = "right";  // You could change to walking animation if you have one
        this.facingLeft = false;
        break;
    }
  }
  
  keyReleased() {
    this.currentAnimation = "stand";
    //this.animations[this.currentAnimation].flipped = true;
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.flipped = false;
  }

  draw() {

    let s = (this.flipped) ? -1 : 1;
    scale(s,1);
    image(this.spritesheet, 0, 0, 80, 80, this.u*80, this.v*80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 10 === 0)
      this.u++;

    if (this.u === this.startU + this.duration)
      this.u = this.startU;
  }
}
