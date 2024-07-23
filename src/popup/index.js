import "./index.css";
import { togglePlayState } from "../audioManager";
import { localStorage } from "../localstorage";
import { playConfetti } from "../contentScript/confettie";
import { updateDisplayfromMessage } from "../utils";

const initBackgroundMusic = () => {
  const controls = {
    backgroundMusic: document.getElementById("backgroundMusic"),
    startAndPauseButton: document.getElementById("startAndPause"),
    resteButton: document.getElementById("resetbutton"),
  };

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

  chrome.storage.local.get("sound", (result) => {
    if (result?.sound?.state) {
      controls.backgroundMusic.innerText = "pause";
    } else {
      controls.backgroundMusic.innerText = "play";
    }
  });

  controls.startAndPauseButton.addEventListener("click", () => {
    const buttonInnerText = controls.startAndPauseButton.innerText;
    controls.startAndPauseButton.innerText =
      buttonInnerText === "play" ? "pause" : "play";
    handleTimer(buttonInnerText);
  });

  controls.resteButton.addEventListener("click", () => {
    const resteButtonText = controls.resteButton.innerText;
    controls.startAndPauseButton.innerText = "play";
    handleTimer(resteButtonText);
  });
  controls.backgroundMusic.addEventListener("click", () => {
    const selectedPlayStation = selectElement.value;
    togglePlayState(selectedPlayStation);
  });
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

  updateTimer();
});

function updateTimer() {
  setInterval(() => {
    chrome.storage.local.get("timer", (result) => {
      updateDisplayfromMessage(result.timer.time);
    });
  }, 500);
}

const stationNames = [
  "Lofi 24/7",
  "Planet LoFi",
  "ChillHop",
  "Chillsky",
  "RauteMusik FM Study",
  "I Love Chillhop",
  "Radio Record Lo-Fi",
];

const selectElement = document.createElement("select");
stationNames.forEach((station) => {
  const optionElement = document.createElement("option");
  optionElement.textContent = station;
  selectElement.appendChild(optionElement);
});
const lofiCard = document.getElementById("lofiCard");
lofiCard.appendChild(selectElement);

// ##################################################
// experimental code
// #############################################333##

function togglePlayIcon(playState) {
  const playButton = document.getElementById("startAndPause");
  if (playState) {
    playButton.classList.add("playIcon");
    playButton.classList.remove("pauseIcon");
  } else {
    playButton.classList.add("pauseIcon");
    playButton.classList.remove("playIcon");
  }
}
