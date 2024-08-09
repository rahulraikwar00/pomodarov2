import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.style.setProperty(
    "--background",
    `url(${chrome.runtime.getURL("img/girl.gif")})`
  );

  const rangeInput = document.getElementById("rangeInput");
  const durationValue = document.getElementById("durationValue");
  const setButton = document.getElementById("setButton");
  durationValue.innerText = rangeInput.value;
  rangeInput.addEventListener("input", () => {
    durationValue.innerText = rangeInput.value;
  });

  setButton.addEventListener("click", () => {
    const value = rangeInput.value;
    updateDuration(value);
    alert(`Duration set to ${value} minutes`);
  });
});

function updateDuration(value) {
  chrome.storage.local.get("timer", (result) => {
    let timer = result.timer;
    if (timer) {
      timer.time = value * 60;
      // warning: this will try to stop the timer but it won't work
      timer.stateType = "stopped";
      chrome.storage.local.set({ timer: timer }, () => {
        console.log("Updated timer in storage");
      });
    }
  });
}
