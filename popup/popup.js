console.log("popup.js is loaded");

const startButton = document.getElementById("startbutton");
const resetbutton = document.getElementById("resetbutton");
const counter = document.getElementById("timer");
let isPlaying = false;

function updateCounter() {
  chrome.storage.local.get("timer", (result) => {
    const minutes = Math.floor(result.timer / 60);
    const seconds = result.timer % 60;

    console.log("minutes", minutes, "seconds", seconds);
    const timeSting = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    counter.textContent = timeSting;
  });
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

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(message, () => {
    console.log("message sent to background");
  });
}

startButton.addEventListener("click", () => {
  console.log("clcicked");
  chrome.storage.local.get("isRunning", (result) => {
    chrome.storage.local.set({ isRunning: !result.isRunning }, () => {
      startButton.innerText = !result.isRunning ? "Stop focus" : "Start focus";
    });
  });
});

resetbutton.addEventListener("click", () => {
  chrome.storage.local.set({ timer: 25 * 60, isRunning: false }, () => {
    startButton.innerText = "Start focus";
    console.log("Timer reset to 0");
  });
});

window.onload = async function () {
  updateCounter();
};

updateCounter();
setInterval(() => {
  updateCounter();
}, 1000);

function setupAnimation() {
  sendMessageToCurrentTab({ animation: { state: "setup" } });
  clearInterval(timerInterval);
}
