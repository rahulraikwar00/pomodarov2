const startButton = document.getElementById("startbutton");
const counter = document.getElementById("timer");
let isPlaying = false;
function updateCounter(minutes, seconds) {
  counter.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function timerFinished() {
  timer.stop();
  timer.reset();
}

const timer = new Timer(
  25 * 60,
  (minutes, seconds) => {
    updateCounter(minutes, seconds);
  },
  timerFinished
);
function finishAnimation() {
  document.getElementById("finish").style.display = "block";
}

const sendMessageToCurrentTab = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { Message: message }, () => {});
  });
};

startButton.addEventListener("click", () => {
  isPlaying = !isPlaying;
  const message = isPlaying ? "start animation" : "stop animation";
  timer.start();
  sendMessageToCurrentTab(message);
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { Message: "setup animation" });
});

// script.js
document.addEventListener("DOMContentLoaded", function () {
  var soundElements = document.querySelectorAll(".sound");

  soundElements.forEach(function (soundElement) {
    soundElement.addEventListener("click", function () {
      this.classList.toggle("sound-mute");
    });
  });
});

//
//
//
//
//

//

// timmerrrrr classs
class Timer {
  constructor(targetTime, updateCallback, finishCallback) {
    this.targetTime = targetTime; // Original target time for the main countdown
    this.updateCallback = updateCallback;
    this.finishCallback = finishCallback;
    this.timerInterval = null;
    this.remainingTime = targetTime; // Initialize remainingTime to the original target time
    this.breakTime = 5 * 60; // 5 minutes break time in seconds
    this.isOnBreak = false;
  }

  start() {
    this.timerInterval = setInterval(() => this.update(), 1000);
  }

  stop() {
    clearInterval(this.timerInterval);
  }

  reset() {
    this.stop();
    this.remainingTime = this.targetTime; // Reset remainingTime to the original target time
    this.updateDisplay();
    this.isOnBreak = false;
  }

  resume() {
    this.start();
  }

  startBreak() {
    this.isOnBreak = true;
    this.remainingTime = this.breakTime; // Set remainingTime to break time
    this.stop();
    this.updateDisplay();
    this.timerInterval = setInterval(() => this.update(), 1000);
  }

  update() {
    this.remainingTime--; // Decrement remainingTime
    if (this.remainingTime < 0) {
      this.stop();
      if (this.isOnBreak) {
        this.isOnBreak = false;
        this.remainingTime = this.targetTime; // Reset to original target time after break
        this.resume();
      } else {
        this.finishCallback();
      }
      return;
    }
    this.updateDisplay();
  }

  updateDisplay() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    this.updateCallback(minutes, seconds);
  }

  hasRemainingTime() {
    return this.remainingTime > 0;
  }
}
