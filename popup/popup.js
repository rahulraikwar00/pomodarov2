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
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, message, () => {});
    }
  });
};

async function toggleTimer() {
  const timerState = await chrome.storage.local.get("storageVariables");
  const state = timerState.timer ? timerState.timer.state : false;
  chrome.storage.local.set({ timer: { state: !state } });
}

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(message, () => {
    console.log("message sent to background");
  });
}

async function updateDisplay() {
  const timerState = await chrome.storage.local.get("timer");
  const minutes = Math.floor(timerState.timer.remainingTime / 60);
  const seconds = timerState.timer.remainingTime % 60;
  updateCounter(minutes, seconds);
}

startButton.addEventListener("click", () => {
  chrome.storage.local.set({
    storageVariables: { timer: { isOnBreak: false, state: !isPlaying } },
  });
  isPlaying = !isPlaying;
  const messageforanimation = isPlaying ? "start" : "stop";
  const messagefortimer = isPlaying ? "start" : "stop";
  toggleTimer();
  startButton.innerText = isPlaying ? "Stop focus" : "Start focus";
  sendMessageToCurrentTab({ animation: { state: messageforanimation } });
  sendMessageToBackground({ timer: { state: messagefortimer } });
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

window.onload = async function () {
  const result = await chrome.storage.local.get("storageVariables");
  console.log("result on load", result);
  const state = result.storageVariables?.timer?.state || false;
  const counterValue = result.storageVariables?.timer?.remainingTime || 0;
  const minutes = Math.floor(counterValue / 60);
  const seconds = counterValue % 60;
  updateCounter(minutes, seconds);
  console.log("state", state, "counterValue", counterValue);
};

chrome.storage.local.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    if (changes.hasOwnProperty("storageVariables")) {
      const initialTimer = changes.storageVariables.timer.remainingTime;
    }
  }
});

chrome.action.onClicked.addListener(() => {
  setupAnimation();
  setInterval(() => {
    chrome.storage.local.get("storageVaribales", (result) => {
      console.log("result in setInterval", result);
      const minutes = Math.floor(result.timer.remainingTime / 60);
      const seconds = result.timer.remainingTime % 60;
      updateCounter(minutes, seconds);

      if (result.timer.remainingTime === 0) {
        finishAnimation();
      }
    });
  }, 1000);
});

function setupAnimation() {
  sendMessageToCurrentTab({ animation: { state: "setup" } });
  // clear the setInterval
  clearInterval(timerInterval);
}
