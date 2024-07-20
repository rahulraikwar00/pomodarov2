import "./index.css";
import { togglePlayState } from "../audioManager";
import { localStorage } from "../localstorage";
import { playConfetti } from "../contentScript/confettie";

// Initialize background music control
const initBackgroundMusic = () => {
  const backgroundMusic = document.getElementById("backgroundMusic");
  const controls = document.getElementById("controls");
  const startAndPauseButton = document.getElementById("startAndPause");

  const confettiButton = createButton(
    "confettiButton",
    "Confetti",
    handleConfettiClick
  );
  controls.appendChild(confettiButton);

  setButtonStateFromLocalStorage(
    startAndPauseButton,
    "timer",
    "state",
    "pause",
    "play"
  );
  setButtonStateFromLocalStorage(
    backgroundMusic,
    "sound",
    "state",
    "pause",
    "play"
  );

  startAndPauseButton.addEventListener("click", () => {
    toggleTimerState(startAndPauseButton);
  });

  backgroundMusic.addEventListener("click", togglePlayState);
};

// Create a button element
const createButton = (id, text, onClick) => {
  const button = document.createElement("button");
  button.id = id;
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
};

// Set button state based on local storage value
const setButtonStateFromLocalStorage = (
  button,
  key,
  stateKey,
  trueText,
  falseText
) => {
  localStorage.get(key, (result) => {
    button.innerText = result[key][stateKey] ? trueText : falseText;
  });
};

// Toggle timer state and update button text
const toggleTimerState = (button) => {
  localStorage.get("timer", (result) => {
    const isActive = result.timer.state;
    localStorage.set({ timer: { state: !isActive } });
    button.innerText = isActive ? "Play" : "Pause";
  });
};

// Handle confetti button click
const handleConfettiClick = () => {
  console.log("Confetti button clicked");
  playConfetti();
};

// Apply initial UI settings and setup background music control
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.style.setProperty(
    "--background",
    `url(${chrome.runtime.getURL("img/girl.gif")})`
  );
  initBackgroundMusic();
});


// DELAYED IMPLEMENTATION OF TIMER FOR TESTING PURPOSES
//
//
//
// function setTime(minutes) {
//   const timeInMiliseconds = minutes * 60 * 1000
//   localStorage.set({ testfinishtime: timeInMiliseconds })
// }

// function updateTimer() {
//   let testfinishtime = 0
//   let currTime = new Date().getTime()
//   localStorage.get('testfinishtime', (result) => {
//     testfinishtime = result.testfinishtime
//     let updateDisplayValue = testfinishtime - currTime
//     setInterval(() => {
//       const time = updateDisplayValue
//       const minutes = Math.floor(time / (60 * 1000))
//       const seconds = Math.floor((time % (60 * 1000)) / 1000)
//       console.log(minutes, seconds)
//       const timerDisplay = document.getElementById('timer')
//       timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
//       updateDisplayValue -= 1000
//     }, 1000)
//   })
// }

//
//
//
//
//
//
//
//
// function toggleSoundtext() {
//   const backgroundMusic = document.getElementById('backgroundMusic')
//   if (backgroundMusic) {
//     backgroundMusic.innerText = backgroundMusic.innerText === 'play' ? 'pause' : 'play'
//     localStorage.set({ sound: { state: backgroundMusic.innerText === 'play' } })
//   } else {
//     console.error('Element with id "backgroundMusic" not found.')
//   }
// }

// try to handle the time fuction from front end only
