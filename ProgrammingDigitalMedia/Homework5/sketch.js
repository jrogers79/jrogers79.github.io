let startContext, samples, sampler, buton1, button2, button3, button4, buttonStop, delTimeSlider, feedbackSlider, distSlider, wetSlider, rateSlider, volumeSlider;

let rev = new Tone.Reverb(5).toDestination()
let dist = new Tone.Distortion(0).connect(rev);
let del = new Tone.FeedbackDelay(0, 0).connect(dist);
let gainNode = new Tone.Gain(1).toDestination(); // 1 = normal volume
del.wet.value = 0.5;

function preload() {
  samples = new Tone.Players({
    gameover: "media/gameover.mp3",
    criticalhit: "media/criticalhit.mp3",
    klaxonbeat: "media/klaxonbeat.mp3",
    nuke: "media/nuke.mp3"
  }).connect(del).connect(gainNode);
}

function setup() {
  createCanvas(400, 400);
  startContext = createButton("Start Audio Context");
  startContext.position(0,0);
  startContext.mousePressed(startAudioContext);
  
  button1 = createButton("Play Game Over");
  button1.position(10, 30);
  button2 = createButton("Play Critical Hit Sample");
  button2.position(200, 30);
  button3 = createButton("Play Klaxon Beat");
  button3.position(10, 70);
  button4 = createButton("Play Nuke Sample");
  button4.position(200, 70);

  button1.mousePressed(() => playSample("gameover"));
  button2.mousePressed(() => playSample("criticalhit"));
  button3.mousePressed(() => playSample("klaxonbeat"));
  button4.mousePressed(() => playSample("nuke"));

  // Stop all sounds button
  buttonStop = createButton("Stop All Sounds");
  buttonStop.position(150, 0);
  buttonStop.mousePressed(stopAllSounds);

  delTimeSlider = createSlider(0, 1, 0, 0.01);
  delTimeSlider.position(10, 130);
  delTimeSlider.input(() => {del.delayTime.value = delTimeSlider.value()});

  feedbackSlider = createSlider(0, 0.99, 0, 0.01);
  feedbackSlider.position(200, 130);
  feedbackSlider.input(() => {del.feedback.value = feedbackSlider.value()});

  distSlider = createSlider(0, 10, 0, 0.01);
  distSlider.position(10, 200);
  distSlider.input(() => {dist.distortion = distSlider.value()});

  wetSlider = createSlider(0, 1, 0, 0.01);
  wetSlider.position(200, 200);
  wetSlider.input(() => {rev.wet.value = wetSlider.value()});

  rateSlider = createSlider(0.5, 2, 1, 0.1);
  rateSlider.position(10, 270);

  volumeSlider = createSlider(0, 1, 1, 0.01); // Range: 0 (mute) to 1 (full volume)
  volumeSlider.position(200, 270);
  volumeSlider.input(() => {
    gainNode.gain.value = volumeSlider.value(); // Set gain directly
  });
}

function draw() {
  background(220);
  text("Delay Time: " + delTimeSlider.value(), 15, 120);
  text("Feedback Amount: " + feedbackSlider.value(), 205, 120);
  text("Distortion Amount: " + distSlider.value(), 15, 190);
  text("Reverb Wet Amount: " + wetSlider.value(), 205, 190);
  text("Playback Rate: " + rateSlider.value(), 15, 260);
  text("Volume: " + volumeSlider.value(), 205, 260);
}

function playSample(sampleName) {
  let player = samples.player(sampleName);
  player.playbackRate = rateSlider.value();
  player.start();
}

function stopAllSounds() {
  samples.stopAll();
}

function startAudioContext() {
  if (Tone.context.state != 'running') {
    Tone.start();
    console.log("Audio Context Started")
  } else {
    console.log("Audio Context is already running")
  }
}