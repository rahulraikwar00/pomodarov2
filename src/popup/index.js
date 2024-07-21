import "./index.css";
import { togglePlayState } from "../audioManager";
import { localStorage } from "../localstorage";
import { playConfetti } from "../contentScript/confettie";
import { updateDisplayfromMessage } from "../utils";

const initBackgroundMusic = () => {
  const controls = {
    backgroundMusic: document.getElementById("backgroundMusic"),
    startAndPauseButton: document.getElementById("startAndPause"),
  };

  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === "timerUpdate") {
      updateDisplayfromMessage(request.payload);
    }
    return true;
  });

  chrome.storage.local.get("timer", (result) => {
    updateDisplayfromMessage(result.timer.time);
    console.log("first trt to update the inner text ");
    const stateType = result?.timer?.stateType;
    controls.startAndPauseButton.innerText =
      stateType === "stopped"
        ? "play"
        : stateType === "running"
          ? "pause"
          : "play";
  });

  controls.startAndPauseButton.addEventListener("click", () => {
    const buttonInnerText = controls.startAndPauseButton.innerText;
    controls.startAndPauseButton.innerText =
      buttonInnerText === "play" ? "pause" : "play";
    handleTimer(buttonInnerText);
  });

  controls.backgroundMusic.addEventListener("click", togglePlayState);
};

const setButtonStateFromLocalStorage = (
  button,
  key,
  stateKey,
  trueText,
  falseText
) => {
  localStorage.get(key, (result) => {
    button.innerText = result?.[key]?.[stateKey] ? trueText : falseText;
  });
};

const handleConfettiClick = () => {
  console.log("Confetti button clicked");
  playConfetti();
};

const handleTimer = (buttonInnerText) => {
  const payload =
    buttonInnerText === "play"
      ? "play"
      : buttonInnerText === "pause"
        ? "pause"
        : buttonInnerText === "reset"
          ? "reset"
          : null;

  if (payload) {
    chrome.runtime.sendMessage({ type: "handleTimer", payload }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error in handleTimer:", chrome.runtime.lastError);
      } else {
        console.log("Response from background script:", response);
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.style.setProperty(
    "--background",
    `url(${chrome.runtime.getURL("img/girl.gif")})`
  );
  initBackgroundMusic();
});
