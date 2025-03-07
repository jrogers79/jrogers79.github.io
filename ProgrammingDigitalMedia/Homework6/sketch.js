let synth, filter, slider;
let keyMap = {
  'A': 'C4', 'W': 'C#4', 'S': 'D4', 'E': 'D#4', 'D': 'E4',
  'F': 'F4', 'T': 'F#4', 'G': 'G4', 'Y': 'G#4', 'H': 'A4',
  'U': 'A#4', 'J': 'B4', 'K': 'C5'
};

function setup() {
  createCanvas(400, 200);
  
  synth = new Tone.PolySynth(Tone.Synth).toDestination();
  filter = new Tone.Filter(1000, "lowpass").toDestination();
  synth.connect(filter);
  
  slider = createSlider(50, 5000, 1000);
  slider.position(10, height - 30);
}

function draw() {
  background(50);
  fill(255);
  textSize(16);
  text("Press keys A-K to play notes", 20, 40);
  text("Adjust filter cutoff:", 20, height - 40);
  
  filter.frequency.value = slider.value();
}

function keyPressed() {
  let note = keyMap[key.toUpperCase()];
  if (note) {
    synth.triggerAttack(note);
  }
}

function keyReleased() {
  let note = keyMap[key.toUpperCase()];
  if (note) {
    synth.triggerRelease(note);
  }
}
