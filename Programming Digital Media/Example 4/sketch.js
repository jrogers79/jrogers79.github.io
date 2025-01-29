function setup() {
  createCanvas(400, 400);
}

function draw() {
  background('#000081');
  strokeWeight(4);
  stroke(255);

  fill('#008000');
  circle(217, 210, 225);

  fill('#FF0000');
  beginShape();
  vertex(330,180)
  vertex(250,180)
  vertex(220,95)
  vertex(180,180)
  vertex(100,180)
  vertex(165,235)
  vertex(140,305)
  vertex(215,265)
  vertex(290,305)
  vertex(265,235)
  endShape(CLOSE);
}
