let grenade, explosion;
let noiseSynth, bassSynth, lfo;
let exploded = false;
let grenadeX = 100, grenadeY = 100, grenadeSize = 200;

function preload() {
  grenade = loadImage("media/grenade.png");
  explosion = loadImage("media/explosion.png");
}

function setup() {
  createCanvas(400, 400);
  filt = new Tone.Filter(1500, "lowpass").toDestination();
  synth1 = new Tone.PolySynth(Tone.Synth).connect(filt);

  // Noise for the explosion
  noiseSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.01, decay: 0.8, sustain: 0 }
  }).toDestination();

  // Low bass "boom"
  bassSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.2 }
  }).toDestination();
}

function draw() {
  background(220);
  
  if (exploded) {
    image(explosion, grenadeX, grenadeY, 200, 200);
  } else {
    image(grenade, grenadeX, grenadeY, grenadeSize, grenadeSize);
  }
}

function mousePressed() {
  Tone.start();
  let d = dist(mouseX, mouseY, grenadeX + grenadeSize / 2, grenadeY + grenadeSize / 2);
  if (!exploded && d < grenadeSize / 2) {
    exploded = true;
    noiseSynth.triggerAttackRelease("0.5");
    bassSynth.triggerAttackRelease("C2", "0.5"); 
    
    // Reset explosion after 1 second
    setTimeout(() => {
      exploded = false;
    }, 1000);
  }
}