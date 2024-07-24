import "./index.css";
import { createOffscreenDocument, hasOffscreenDocument } from "../utils";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.style.setProperty(
    "--background",
    `url(${chrome.runtime.getURL("img/girl.gif")})`
  );
  setupEventListeners();
  updateTimerButton();
  updateTimerDisplay();
  updateSoundUiButton();
  allStatesInStorage();
  setInterval(() => {
    updateTimerDisplay();
  }, 1000);
});

const setupEventListeners = () => {
  const controls = {
    backgroundMusic: document.getElementById("backgroundMusic"),
    startAndPauseButton: document.getElementById("startAndPause"),
    resteButton: document.getElementById("resetbutton"),
    lofiSelect: document.getElementById("lofiSelect"),
  };

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

  controls.lofiSelect.addEventListener("change", () => {
    handleSelectEvent();
    allStatesInStorage();
  });
  controls.backgroundMusic.addEventListener("click", () => {
    handleSoundButton();
    allStatesInStorage();
  });
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

function updateTimerDisplay() {
  chrome.storage.local.get("timer", (result) => {
    const time = result.timer.time;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timerDisplay = document.getElementById("timer");
    timerDisplay.innerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  });
}

const updateSoundUiButton = () => {
  console.log("updating sound button...");

  chrome.storage.local.get("sound", (result) => {
    try {
      if (result?.sound?.state) {
        document.getElementById("backgroundMusic").innerText = "pause";
      } else {
        document.getElementById("backgroundMusic").innerText = "play";
      }
    } catch (error) {
      console.error(error);
    }
  });
};
const updateTimerButton = () => {
  console.log("updating timer button...");
  chrome.storage.local.get("timer", (result) => {
    const stateType = result?.timer?.stateType;
    document.getElementById("startAndPause").innerText =
      stateType === "stopped"
        ? "play"
        : stateType === "running"
          ? "pause"
          : "play";
  });
};
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
selectElement.id = "lofiSelect";
stationNames.forEach((station) => {
  const optionElement = document.createElement("option");
  optionElement.textContent = station;
  selectElement.appendChild(optionElement);
});
const lofiCard = document.getElementById("lofiCard");
lofiCard.appendChild(selectElement);

// Creates an offscreen document if necessary
const createOffscreenDocumentIFNecessary = async (path) => {
  try {
    await createOffscreenDocument(
      path,
      "AUDIO_PLAYBACK",
      "Background music playback"
    );
  } catch (error) {
    console.error("Error creating offscreen document:", error);
  }
};

const handleSoundButton = async () => {
  document.getElementById("backgroundMusic").innerText = "loading...";
  try {
    const path = "offscreen.html";
    let offscreenAvailable = await hasOffscreenDocument(path);
    if (!offscreenAvailable) {
      await createOffscreenDocumentIFNecessary(path);
      offscreenAvailable = await hasOffscreenDocument(path);
    }
    if (offscreenAvailable) {
      chrome.storage.local.get("sound", (result) => {
        let isPlaying = result?.sound?.state;
        chrome.storage.local.set(
          {
            sound: {
              state: !isPlaying,
              Filename: result?.sound?.Filename || "",
            },
          },
          () => {
            const messageType = isPlaying ? "pause" : "play";
            sendAudioControlMessage(messageType, "DEFAULT-STATION");
            updateSoundUiButton();
          }
        );
      });
    }
  } catch (error) {
    console.error("Error handling sound button:", error);
  }
};

const handleSelectEvent = async () => {
  document.getElementById("backgroundMusic").innerText = "loading...";
  const path = "offscreen.html";
  try {
    let offscreenAvailable = await hasOffscreenDocument(path);
    if (!offscreenAvailable) {
      await createOffscreenDocumentIFNecessary(path);
      offscreenAvailable = await hasOffscreenDocument(path);
    }
    if (offscreenAvailable) {
      chrome.storage.local.get("sound", (result) => {
        chrome.storage.local.set(
          {
            sound: {
              state: true,
              Filename: result?.sound?.Filename || "",
            },
          },
          () => {
            const messageType = "updateStation";
            const selectedStation = selectElement.value;
            sendAudioControlMessage(messageType, selectedStation);
            updateSoundUiButton();
          }
        );
      });
    }
  } catch (error) {
    console.error("Error handling select event:", error);
  }
};

const sendAudioControlMessage = (messageType, selectedStation) => {
  let messageForSend = {
    type: messageType,
    payload: {
      selectedStation: selectedStation,
    },
  };
  console.log("sending to audiocontroller", messageForSend);
  chrome.runtime.sendMessage(messageForSend);
};

const allStatesInStorage = async () => {
  chrome.storage.local.get((result) => {
    console.log("all states in storage: ", result);
  });
};

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
