console.log("service-worker.js is loaded");

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("sounds", (result) => {
    const sounds = result.sounds || [];
    sounds.forEach((soundConfig) => {
      if (soundConfig.enabled) {
        try {
          const sound = new Audio(chrome.runtime.getURL(soundConfig.url));
          sound.volume = soundConfig.volume;
          sound.play().catch((error) => console.log(error));
        } catch (error) {
          console.error(`Error playing sound ${soundConfig.name}:`, error);
        }
      }
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message comming for timer:", request.Message);
  if (request.Message === "start timer") {
    timer.start();
    sendResponse({ Message: "timer started" });
  }
  if (request.Message === "stop timer") {
    timer.stop();
    timer.reset();
    sendResponse({ Message: "timer stopped" });
  }
  if (request.Message === "reset timer") {
    timer.reset();
    sendResponse({ Message: "timer reset" });
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await setup();
    console.log("setup is done");
  } catch (error) {
    console.log(error);
  }
});

// Setup the sounds in local storage
const storageVariables = {
  sounds: [
    {
      name: "lofi",
      url: "sound/lofiloop.mp3",
      volume: 0.5,
      enabled: true,
    },
    {
      name: "celebratesound",
      url: "sound/celebratesound.mp3",
      volume: 0.5,
      enabled: false,
    },
  ],
  timer: {
    targetTime: 25 * 60,
    breakTime: 5 * 60,
    remainingTime: 25 * 60,
    isOnBreak: false,
    state: false,
    counter: 0,
    timerInterval: null,
    updateCallback: null,
    finishCallback: null,
  },
};

async function setup() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(storageVariables, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

class SoundManager {
  constructor() {
    this.sounds = [];
    this.loadSounds();
  }

  loadSounds() {
    chrome.storage.local.get("sounds", (result) => {
      this.sounds = result.sounds || [];
    });
  }

  playSound(soundConfig) {
    try {
      const sound = new Audio(chrome.runtime.getURL(soundConfig.url));
      sound.volume = soundConfig.volume;
      sound.play().catch((error) => console.log(error));
    } catch (error) {
      console.error(`Error playing sound ${soundConfig.name}:`, error);
    }
  }

  stopSound(sound) {
    sound.pause();
  }

  toggleSound(soundConfig) {
    this.playSound(soundConfig);
  }

  stopAllSounds() {
    this.sounds.forEach((soundConfig) => {
      const sound = new Audio(chrome.runtime.getURL(soundConfig.url));
      this.stopSound(sound);
    });
  }

  toggleAllSounds() {
    this.sounds.forEach((soundConfig) => {
      const sound = new Audio(chrome.runtime.getURL(soundConfig.url));
      sound.volume = sound.volume === 0 ? 1 : 0;
      sound.play().catch((error) => console.log(error));
    });
  }
}

class Timer {
  constructor(targetTime, finishCallback) {
    this.targetTime = targetTime;
    this.finishCallback = finishCallback;
    this.timerInterval = null;
    this.remainingTime = targetTime;
    this.breakTime = 5 * 60;
    this.isOnBreak = false;

    // Load timer state from storage
    chrome.storage.local.get("timer", (result) => {
      if (result.timer) {
        this.targetTime = result.timer.targetTime;
        this.breakTime = result.timer.breakTime;
        this.remainingTime = result.timer.remainingTime;
        this.isOnBreak = result.timer.isOnBreak;
      }
    });
  }

  start() {
    this.timerInterval = setInterval(() => this.update(), 1000);
  }

  stop() {
    clearInterval(this.timerInterval);
    this.updateStorage();
  }

  reset() {
    this.stop();
    this.remainingTime = this.targetTime;
    this.isOnBreak = false;
    this.updateStorage();
  }

  resume() {
    this.start();
  }

  startBreak() {
    this.isOnBreak = true;
    this.remainingTime = this.breakTime;
    this.stop();
    this.timerInterval = setInterval(() => this.update(), 1000);
  }

  update() {
    this.remainingTime--;
    if (this.remainingTime < 0) {
      this.stop();
      if (this.isOnBreak) {
        this.isOnBreak = false;
        this.remainingTime = this.targetTime;
        this.resume();
      } else {
        this.finishCallback();
      }
      return;
    }
    this.updateStorage();
  }
  updateStorage() {
    // console.log("update storage, ", this.targetTime, this.remainingTime);
    chrome.storage.local.set({
      timer: {
        targetTime: this.targetTime,
        breakTime: this.breakTime,
        remainingTime: this.remainingTime,
        isOnBreak: this.isOnBreak,
      },
    });
  }

  hasRemainingTime() {
    return this.remainingTime > 0;
  }
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
