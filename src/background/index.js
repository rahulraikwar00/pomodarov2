import {
  createOffscreenDocument,
  logConfigsSet,
  updateTimerValue,
} from "../utils";
import { localStorage, setupStorageConfig } from "../localstorage";

const onInstalled = async () => {
  const { path, reason, justification, configs } =
    getOffscreenDocumentCreationData();

  await clearStorage();
  await clearAllAllarms();
  await createOffscreenDocument(path, reason, justification);
  await saveConfigs(configs);
  await logStorageValue();
};

const getOffscreenDocumentCreationData = () => ({
  path: "offscreen.html",
  reason: "AUDIO_PLAYBACK",
  justification: "for playing audio",
  configs: setupStorageConfig(),
});

const clearStorage = () => chrome.storage.local.clear();
const clearAllAllarms = () => chrome.alarms.clearAll();
const saveConfigs = async (configs) => localStorage.set(configs, logConfigsSet);

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

  async getConfigs() {
    try {
      const result = await localStorage.get("timer");
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
      }
      this.updateDisplay();
      this.updateStorage();
    }
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
    updateTimerValue(this.timer);
  }

  updateStorage() {
    localStorage
      .set({
        timer: {
          time: this.timer,
          stateType: this.stateType,
        },
      })
      .then(() => {
        // console.log("Timer state updated successfully");
      })
      .catch((error) => {
        console.error("Error updating timer state:", error);
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
