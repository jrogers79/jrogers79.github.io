function setup() {
  createCanvas(400, 300);
}

function draw() {
  noStroke();
  background(0);

  fill('#FFF84A');
  circle(80, 160, 150);

  fill(0);
  triangle(80, 160, 0, 85, 0, 235);

  fill('#EA412C');
  circle(250, 160, 150);

  fill('#EA412C');
  rect(175, 160, 150, 75);

  fill(250);
  circle(215, 160, 40);

  fill(250);
  circle(285, 160, 40);

  fill('#0044F7');
  circle(215, 160, 25);

  fill('#0044F7');
  circle(285, 160, 25);
}
