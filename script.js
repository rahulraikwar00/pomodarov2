import confetti from "https://cdn.skypack.dev/canvas-confetti";

import Timer from "./timer.js";
import Animation from "./animation.js";
import { playSound, loopLofiSound, pauseLofiSound } from "./sound.js";

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const spritesheet = new Image();
spritesheet.src = "./images/walkpng.png";

const finishImage = new Image();
finishImage.src = "./images/finish.png";

const finishSound = new Audio("./sound/celebratesound.mp3");
const lofiloop = new Audio("./sound/lofiloop.mp3");
lofiloop.loop = true;

const toggelsoundbtn = document.getElementById("music");

toggelsoundbtn.addEventListener("click", () => {
  toggelsoundbtn.textContent = lofiloop.paused ? "on" : "off";
  if (lofiloop.paused) {
    loopLofiSound(lofiloop);
  } else {
    pauseLofiSound(lofiloop);
  }
});

const targetTime = 20; // 25 minutes in seconds

const timer = new Timer(targetTime, updateCounter, timerFinished);
const animation = new Animation(
  canvas,
  ctx,
  spritesheet,
  finishImage,
  targetTime,
  finishAnimation
);
animation.setTargetTime(targetTime * 70);

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const breakBtn = document.getElementById("breakBtn");
const counter = document.getElementById("timer");

function updateCounter(minutes, seconds) {
  counter.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function timerFinished() {
  confetti();
  pauseLofiSound(lofiloop);
  playSound(finishSound);
  counter.textContent = "Time's up!";
  startBtn.style.display = "block";
  stopBtn.style.display = "none";
  breakBtn.style.display = "none";
  timer.stop();
  timer.reset();
  animation.stop();
}

function finishAnimation() {
  console.log("Animation finished!", "sound has stopped playing");
  playSound(finishSound);
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      confetti();
    }, i * 150);
  }
  timer.stop();
  animation.reset();
}

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  stopBtn.style.display = "block";
  breakBtn.style.display = "block";
  loopLofiSound(lofiloop);
  timer.resume();
  animation.start();
});

stopBtn.addEventListener("click", () => {
  stopBtn.style.display = "none";
  startBtn.style.display = "block";
  breakBtn.style.display = "none";
  pauseLofiSound(lofiloop);
  timer.stop();
  animation.stop();
});

breakBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  stopBtn.style.display = "none";
  breakBtn.style.display = "none";
  timer.stop();
  animation.stop();
  timer.startBreak();
});

// Initial setup
startBtn.style.display = "block";
stopBtn.style.display = "none";
breakBtn.style.display = "none";
timer.reset();
