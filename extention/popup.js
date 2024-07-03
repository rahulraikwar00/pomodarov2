// popup.js

// Import necessary functions and classes
import Timer from "./timer.js";
import { animation } from "./extention/script.js";
// Select DOM elements
// const startBtn = document.getElementById("startBtn");
// const stopBtn = document.getElementById("stopBtn");
// const breakBtn = document.getElementById("breakBtn");
const counter = document.getElementById("timer");

// Set target time for timer
const targetTime = 20; // 25 minutes in seconds

// Initialize timer
const timer = new Timer(targetTime, updateCounter, timerFinished);

// Function to update timer display
function updateCounter(minutes, seconds) {
  counter.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Function called when timer finishes
function timerFinished() {
  counter.textContent = "Time's up!";
  startBtn.style.display = "block";
  stopBtn.style.display = "none";
  breakBtn.style.display = "none";
  timer.stop();
  timer.reset();
}

// // Event listener for start button
// startBtn.addEventListener("click", () => {
//   startBtn.style.display = "none";
//   stopBtn.style.display = "block";
//   breakBtn.style.display = "block";
//   animation.start();
//   timer.resume();
// });

// // Event listener for stop button
// stopBtn.addEventListener("click", () => {
//   stopBtn.style.display = "none";
//   startBtn.style.display = "block";
//   breakBtn.style.display = "none";
//   timer.stop();
//   animation.stop();
// });

// // Event listener for break button
// breakBtn.addEventListener("click", () => {
//   startBtn.style.display = "none";
//   stopBtn.style.display = "none";
//   breakBtn.style.display = "none";
//   timer.stop();
//   timer.startBreak();
// });

// // Initial setup
// startBtn.style.display = "block";
// stopBtn.style.display = "none";
// breakBtn.style.display = "none";
timer.reset();
