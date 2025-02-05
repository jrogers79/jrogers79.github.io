let currentColor;
let palette = [];
let paletteWidth = 50;

function setup() {
  createCanvas(800, 600);
  background(255);
  
  // Define color palette
  palette = [
    color(255, 0, 0),    // Red
    color(255, 165, 0),  // Orange
    color(255, 255, 0),  // Yellow
    color(0, 128, 0),    // Green
    color(0, 255, 255),  // Cyan
    color(0, 0, 255),    // Blue
    color(255, 0, 255),  // Magenta
    color(119, 67, 21),  // Brown
    color(255, 255, 255),// White
    color(0, 0, 0)       // Black
  ];
  
  currentColor = palette[9]; // Default to black
  drawPalette();
}

function draw() {
  if (mouseIsPressed) {
    if (mouseX > paletteWidth) {
      stroke(currentColor);
      strokeWeight(4);
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
  }
  drawPalette(); // Keep palette visible
}

function mousePressed() {
  if (mouseX < paletteWidth) {
    let boxHeight = height / palette.length;
    let selectedBox = floor(mouseY / boxHeight);
    if (selectedBox >= 0 && selectedBox < palette.length) {
      currentColor = palette[selectedBox];
    }
  }
}

function drawPalette() {
  let boxHeight = height / palette.length;
  for (let i = 0; i < palette.length; i++) {
    fill(palette[i]);
    stroke(0);
    strokeWeight(1);
    rect(0, i * boxHeight, paletteWidth, boxHeight);
  }
}
