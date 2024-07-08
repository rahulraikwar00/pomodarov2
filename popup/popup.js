console.log("popup.js is loaded");

const startButton = document.getElementById("startbutton");
const counter = document.getElementById("timer");
let isPlaying = false;

function updateCounter(minutes, seconds) {
  counter.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function finishAnimation() {
  document.getElementById("finish").style.display = "block";
}

const sendMessageToCurrentTab = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { Message: message }, () => {});
  });
};

function toggelTimer() {
  const timerState = chrome.storage.local.get("timer");
  if (timerState.state) {
    chrome.storage.local.set({ timer: { state: false } });
  } else {
    chrome.storage.local.set({ timer: { state: true } });
  }
}

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage({ Message: message });
}

startButton.addEventListener("click", () => {
  chrome.storage.local.set({ timer: { state: !isPlaying } });
  isPlaying = !isPlaying;
  const messageforanimation = isPlaying ? "start animation" : "stop animation";
  const messagefortimer = isPlaying ? "start timer" : "stop timer";
  toggelTimer();
  startButton.innerText = isPlaying ? "Stop focus" : "Start focus";
  sendMessageToCurrentTab(messageforanimation);
  sendMessageToBackground(messagefortimer);
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

window.onload = function () {
  chrome.storage.local.get("timer", function (result) {
    const state = result.timer.state || false;
    const counterValue = result.timer.remainingTime || 0;
    const minutes = Math.floor(counterValue / 60);
    const seconds = counterValue % 60;
    updateCounter(minutes, seconds);
    console.log("state", state, "counterValue", counterValue);
  });
};

chrome.storage.local.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    if (changes.hasOwnProperty("timer")) {
      const initialTimer = changes.timer.remainingTime;
    }
  }
});

setInterval(() => {
  chrome.storage.local.get("timer", (result) => {
    const minutes = Math.floor(result.timer.remainingTime / 60);
    const seconds = result.timer.remainingTime % 60;
    updateCounter(minutes, seconds);

    if (result.timer.remainingTime === 0) {
      finishAnimation();
    }
  });
}, 1000);
