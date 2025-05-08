const int buttonPin = 2;
const int ledPins[] = {3, 4, 5};
const int numLives = 3;
int currentLives = 0;
int xVal, yVal;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP); // Use internal pull-up
  Serial.begin(9600);
  for (int i = 0; i < numLives; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], HIGH); // All lives on
  }
}

void loop() {
  xVal = analogRead(A0);
  yVal = analogRead(A1);

  Serial.print("X:");
  Serial.print(xVal);
  Serial.print(" Y:");
  Serial.println(yVal);

  int buttonState = digitalRead(buttonPin);
  if (buttonState == LOW) {
    Serial.println("FIRE");
  }

  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');

    // Example: "LIVES:2" → update LEDs to show 2 lives
    if (input.startsWith("LIVES:")) {
      int lives = input.substring(6).toInt();
      updateLives(lives);
    }
  }
  delay(50); // small delay for stability
}

void updateLives(int lives) {
  // Clamp lives between 0 and numLives
  if (lives < 0) lives = 0;
  if (lives > numLives) lives = numLives;
  
  currentLives = lives;

  for (int i = 0; i < numLives; i++) {
    digitalWrite(ledPins[i], i < currentLives ? HIGH : LOW);
  }
}
