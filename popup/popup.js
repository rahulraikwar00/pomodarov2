console.log("popup.js is loaded");

const startButton = document.getElementById("startbutton");
const resetbutton = document.getElementById("resetbutton");
const counter = document.getElementById("timer");
let isPlaying = false;

function updateCounter() {
  chrome.storage.local.get(["timer", "isRunning"], (result) => {
    const minutes = Math.floor(result.timer / 60);
    const seconds = result.timer % 60;

    const timeSting = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    counter.textContent = timeSting;
    startButton.innerText = result.isRunning ? "Stop focus" : "Start focus";
  });
}
const sendMessageToCurrentTab = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, message, () => {});
    }
  });
};

startButton.addEventListener("click", () => {
  console.log("clicked");
  chrome.storage.local.get("isRunning", (result) => {
    let newIsRunning = !result.isRunning;
    chrome.storage.local.set({ isRunning: newIsRunning }, () => {
      startButton.innerText = newIsRunning ? "Stop focus" : "Start focus";
    });
  });
});

resetbutton.addEventListener("click", () => {
  chrome.storage.local.set({ timer: 25 * 60, isRunning: false }, () => {
    startButton.innerText = "Start focus";
    console.log("Timer reset to 0");
  });
});

updateCounter();
setInterval(() => {
  chrome.storage.local.get(["timer", "isRunning"], (result) => {
    console.log("result in popup ininternvals", result.timer, result.isRunning);
  });
  updateCounter();
}, 1000);

window.onload = () => {
  // Call updateCounter on window load
  updateCounter();
};
function setupAnimation() {
  sendMessageToCurrentTab({ animation: { state: "setup" } });
  clearInterval(timerInterval);
}
