---
title: Space Shooter
layout: default
---

# Space Shooter Documentation

Welcome to the official documentation for the Arduino-powered Galaga-style game.

![Gameplay Screenshot](media/gameplayScreenshot.png)

## Overview

This project connects an Arduino joystick and button to a p5.js-based game using serial communication.

## Features

- Joystick-controlled movement
- Physical fire button
- Tone.js sound effects
- LED life indicators
- Game state feedback over serial

## Components Used

- **p5.js** — for game graphics and logic
- **Tone.js** — for sound effects
- **Arduino UNO** — joystick and button input, plus LED output
- **Serial communication** — between Arduino and p5.js using Web Serial API

## How it works

- The game starts in a browser and waits for serial input from the Arduino.
- The joystick controls ship movement.
- Pressing the physical fire button sends "FIRE" over serial to fire a bullet.
- Lives are tracked in the game and reflected using LEDs connected to the Arduino.
- Tone.js adds sound effects for shooting and damage.

## Media

![Ship firing and dodging enemies](media/recording.gif)

## Arduino Wiring

![Wiring](media/wiring.jpg)

...
