import {
  createOffscreenDocument,
  logConfigsSet,
  updateTimerValue,
} from "../utils";
import { setupStorageConfig } from "../localstorage";

const onInstalled = async () => {
  const { path, reason, justification } = getOffscreenDocumentCreationData();

  await clearStorage();
  await clearAllAllarms();
  await createOffscreenDocument(path, reason, justification);
  await saveConfigs(setupStorageConfig());
  await logStorageValue();
};

const getOffscreenDocumentCreationData = () => ({
  path: "offscreen.html",
  reason: "AUDIO_PLAYBACK",
  justification: "for playing audio",
});

const clearStorage = () => chrome.storage.local.clear();
const clearAllAllarms = () => chrome.alarms.clearAll();
const saveConfigs = async (configs) => {
  await chrome.storage.local.set(configs);
  await chrome.storage.local.get((result) => {
    logConfigsSet(configs);
  });
};

const logStorageValue = () =>
  chrome.storage.local.get((result) => {
    // console.log("Timer value:", result);
  });

chrome.runtime.onInstalled.addListener(onInstalled);

// ###############################################
// timer code
// ###############################################

const TIMER_STATE = {
  RUNNING: "running",
  PAUSED: "paused",
  STOPPED: "stopped",
};

class Timer {
  constructor() {
    this.timer = 0;
    this.stateType = TIMER_STATE.STOPPED;
    this.alarmInterval = 1 / 60;
  }

  async init() {
    try {
      const configs = await this.getConfigs();
      this.timer = configs?.timer?.time || 0;
      this.stateType = configs?.timer?.stateType || TIMER_STATE.STOPPED;
      this.setupAlarm();
      this.updateDisplay();
    } catch (error) {
      console.error("Error initializing timer:", error);
    }
  }

  playConfetti() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "playConfetti" });
      }
    });
  }

  async getConfigs() {
    try {
      const result = await chrome.storage.local.get("timer");
      return result;
    } catch (error) {
      console.error("Error retrieving timer configs:", error);
      return null;
    }
  }

  setupAlarm() {
    chrome.alarms.create("pomodoro", {
      periodInMinutes: this.alarmInterval,
    });
  }

  handleAlarm(alarm) {
    if (this.stateType === TIMER_STATE.RUNNING) {
      this.timer -= 1;
      if (this.timer < 0) {
        this.clearAlarm();
        this.timer = 1500;
        this.stateType = TIMER_STATE.STOPPED;
        this.playConfetti();
      }
      this.updateDisplay();
      this.updateStorage();
    }
  }

  updateBadge() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    chrome.action.setBadgeText({
      text: `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    });
  }
  startTimer(time) {
    this.clearAlarm();
    this.timer = time;
    this.stateType = TIMER_STATE.RUNNING;
    this.setupAlarm();
    this.updateDisplay();
    this.updateStorage();
  }

  resetTimer() {
    this.clearAlarm();
    this.timer = 1500;
    this.stateType = TIMER_STATE.STOPPED;
    this.updateDisplay();
    this.updateStorage();
  }

  pauseTimer() {
    this.clearAlarm();
    this.stateType = TIMER_STATE.PAUSED;
    this.updateDisplay();
    this.updateStorage();
  }

  updateDisplay() {
    this.updateBadge();
    updateTimerValue(this.timer);
  }

  updateStorage() {
    chrome.storage.local.get("timer", (result) => {
      let timerData = result.timer;
      timerData.time = this.timer;
      console.log("Timer data is :", timerData);
      timerData.stateType = this.stateType;
      chrome.storage.local.set({ timer: timerData }, () => {
        console.log("Updated timer in storage");
      });
    });
  }

  clearAlarm() {
    chrome.alarms.clearAll(() => {
      console.log("Cleared all alarms");
    });
  }

  handleTimer(request) {
    if (request.type === "handleTimer") {
      console.log("request.payload:", request.payload);
      if (request.payload === "play") {
        if (this.stateType === TIMER_STATE.PAUSED) {
          this.resumeTimer();
        } else {
          chrome.storage.local.get("timer", (result) => {
            this.startTimer(result.timer.time);
          });
        }
      } else if (request.payload === "pause") {
        this.pauseTimer();
      } else if (request.payload === "reset") {
        this.resetTimer();
      }
    }
  }

  resumeTimer() {
    this.clearAlarm();
    this.stateType = TIMER_STATE.RUNNING;
    this.setupAlarm();
    this.updateDisplay();
    this.updateStorage();
  }
}

const timer = new Timer();
timer.init();

chrome.runtime.onMessage.addListener((request) => {
  timer.handleTimer(request);
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  timer.handleAlarm(alarm);
  // console.log("Alarm triggered");
});

const sendMessageToCurrentTab = (message) => {
  const confettiInterval = setInterval(() => {
    console.log("sending messga for confetti");
    chrome.tabs.query({ active: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, message, () => {});
      }
    });
  }, 1500);
  setTimeout(() => {
    clearInterval(confettiInterval);
  }, 10000);
};
