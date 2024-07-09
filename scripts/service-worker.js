// console.log("service-worker.js is loaded");

// chrome.runtime.onStartup.addListener(() => {
//   chrome.storage.local.get("storageVariables", (result) => {
//     const sounds = result.storageVariables?.sounds || [];
//     sounds.forEach((soundConfig) => {
//       if (soundConfig.enabled) {
//         try {
//           const sound = new Audio(chrome.runtime.getURL(soundConfig.url));
//           sound.volume = soundConfig.volume;
//           sound.play().catch((error) => console.log(error));
//         } catch (error) {
//           console.error(`Error playing sound ${soundConfig.name}:`, error);
//         }
//       }
//     });
//   });
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log("Message comming for timer:", request.timer);
//   if (request.timer.state === "start") {
//     timer.start();
//     sendResponse({ Message: "timer started" });
//   }
//   if (request.timer.state === "stop") {
//     timer.stop();
//     timer.reset();
//     sendResponse({ Message: "timer stopped" });
//   }
//   if (request.timer.state === "reset") {
//     timer.reset();
//     sendResponse({ Message: "timer reset" });
//   }
// });

// chrome.runtime.onInstalled.addListener(async () => {
//   try {
//     await setup();
//     console.log("setup is done");
//   } catch (error) {
//     console.log(error);
//   }
// });

// // Setup the sounds in local storage
// const storageVariables = {
//   sounds: [
//     {
//       name: "lofi",
//       url: "sound/lofiloop.mp3",
//       volume: 0.5,
//       enabled: true,
//     },
//     {
//       name: "celebratesound",
//       url: "sound/celebratesound.mp3",
//       volume: 0.5,
//       enabled: false,
//     },
//   ],
//   timer: {
//     targetTime: 25 * 60,
//     breakTime: 5 * 60,
//     remainingTime: 25 * 60,
//     isOnBreak: false,
//     state: false,
//     counter: 0,
//     timerInterval: null,
//     updateCallback: null,
//     finishCallback: null,
//   },
// };

// class SoundManager {
//   constructor() {
//     this.sounds = [];
//     this.loadSounds();
//   }

//   loadSounds() {
//     chrome.storage.local.get("storageVariables", (result) => {
//       this.storageVariables.sounds = result.storageVariables.sounds || [];
//     });
//   }

//   playSound(soundConfig) {
//     try {
//       const sound = new Audio(chrome.runtime.getURL(soundConfig.url));
//       sound.volume = soundConfig.volume;
//       sound.play().catch((error) => console.log(error));
//     } catch (error) {
//       console.error(`Error playing sound ${soundConfig.name}:`, error);
//     }
//   }

//   stopSound(sound) {
//     sound.pause();
//   }

//   toggleSound(soundConfig) {
//     this.playSound(soundConfig);
//   }

//   stopAllSounds() {
//     this.sounds.forEach((soundConfig) => {
//       const sound = new Audio(chrome.runtime.getURL(soundConfig.url));
//       this.stopSound(sound);
//     });
//   }

//   toggleAllSounds() {
//     this.sounds.forEach((soundConfig) => {
//       const sound = new Audio(chrome.runtime.getURL(soundConfig.url));
//       sound.volume = sound.volume === 0 ? 1 : 0;
//       sound.play().catch((error) => console.log(error));
//     });
//   }
// }

// class Timer {
//   constructor(targetTime, finishCallback) {
//     this.targetTime = targetTime;
//     this.finishCallback = finishCallback;
//     this.timerInterval = null;
//     this.remainingTime = targetTime;
//     this.breakTime = 5 * 60;
//     this.isOnBreak = false;

//     // Load timer state from storage
//     chrome.storage.local.get("storageVariables", (result) => {
//       const storageVariables = result.storageVariables || {};
//       const timer = storageVariables.timer || {};
//       this.targetTime = timer.targetTime;
//       this.breakTime = timer.breakTime;
//       this.remainingTime = timer.remainingTime;
//       this.isOnBreak = timer.isOnBreak;
//     });
//   }

//   start() {
//     this.timerInterval = setInterval(() => this.update(), 1000);
//   }

//   stop() {
//     clearInterval(this.timerInterval);
//     this.updateStorage();
//   }

//   reset() {
//     this.stop();
//     this.remainingTime = this.targetTime;
//     this.isOnBreak = false;
//     this.updateStorage();
//   }

//   resume() {
//     this.start();
//   }

//   startBreak() {
//     this.isOnBreak = true;
//     this.remainingTime = this.breakTime;
//     this.stop();
//     this.timerInterval = setInterval(() => this.update(), 1000);
//   }

//   update() {
//     this.remainingTime--;
//     if (this.remainingTime < 0) {
//       this.stop();
//       if (this.isOnBreak) {
//         this.isOnBreak = false;
//         this.remainingTime = this.targetTime;
//         this.resume();
//       } else {
//         this.finishCallback();
//       }
//       return;
//     }
//     this.updateStorage();
//   }

//   getStorageVariables(callback) {
//     chrome.storage.local.get("storageVariables", function (result) {
//       const storageVariables = result.storageVariables || {};
//       callback(storageVariables);
//     });
//   }
//   updateStorage() {
//     this.getStorageVariables((storageVariables) => {
//       const updateStorageVariable = storageVariables;
//       updateStorageVariable.timer = {
//         targetTime: this.targetTime,
//         breakTime: this.breakTime,
//         remainingTime: this.remainingTime,
//         isOnBreak: this.isOnBreak,
//       };
//       console.log("updateStorageVariable backend", updateStorageVariable);
//       chrome.storage.local.set({
//         storageVariables: updateStorageVariable,
//       });
//     });
//   }

//   hasRemainingTime() {
//     return this.remainingTime > 0;
//   }
// }

// function timerFinished() {
//   timer.stop();
//   timer.reset();
// }

// const timer = new Timer(
//   25 * 60,
//   (minutes, seconds) => {
//     updateCounter(minutes, seconds);
//   },
//   timerFinished
// );

// const sendMessageToCurrentTab = (message) => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.tabs.sendMessage(
//       tabs[0].id,
//       { animation: { state: message } },
//       () => {}
//     );
//   });
// };

// // function to setup the animation
// function setupAnimation() {
//   sendMessageToCurrentTab("setup");
// }

// chrome.browserAction.onClicked.addListener(() => {
//   setupAnimation();
// });

// // setup storage variables
// async function setup() {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.set(storageVariables, () => {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else {
//         resolve();
//       }
//     });
//   }).then(() => {
//     console.log("storageVariables set", storageVariables);
//     chrome.storage.local.get("storageVariables", (result) => {
//       console.log("storageVariables", result);
//     });
//   });
// }

console.log("service-worker.js is loaded");

function clearLocalStorage() {
  chrome.storage.local.clear(() => {
    if (chrome.runtime.lastError) {
      console.error("Error clearing local storage:", chrome.runtime.lastError);
    } else {
      console.log("Local storage cleared successfully.");
    }
  });
}
chrome.runtime.onInstalled.addListener(async () => {
  try {
    clearLocalStorage();
    await setup();
    console.log("Setup is done");
  } catch (error) {
    console.error("Setup failed:", error);
  }
});

// Handle chrome.runtime.onStartup event
chrome.runtime.onStartup.addListener(async () => {
  try {
    const result = await new Promise((resolve, reject) => {
      chrome.storage.local.get("storageVariables", (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(data);
        }
      });
    });

    const sounds = result.storageVariables?.sounds || [];
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
  } catch (error) {
    console.error("Error fetching storage variables on startup:", error);
  }
});

// Handle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message coming for timer:", request.timer);
  if (request.timer) {
    if (request.timer.state === "start") {
      timer.start();
      sendResponse({ Message: "timer started" });
    } else if (request.timer.state === "stop") {
      timer.stop();
      sendResponse({ Message: "timer stopped" });
    } else if (request.timer.state === "reset") {
      timer.reset();
      sendResponse({ Message: "timer reset" });
    }
  }
  return true; // Important for async response
});

// Setup storage variables
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

class SoundManager {
  constructor() {
    this.sounds = [];
    this.loadSounds();
  }

  loadSounds() {
    chrome.storage.local.get("storageVariables", (result) => {
      this.sounds = result.storageVariables.sounds || [];
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
    chrome.storage.local.get("storageVariables", (result) => {
      const storageVariables = result.storageVariables || {};
      const timer = storageVariables.timer || {};
      this.targetTime = timer.targetTime || this.targetTime;
      this.breakTime = timer.breakTime || this.breakTime;
      this.remainingTime = timer.remainingTime || this.remainingTime;
      this.isOnBreak = timer.isOnBreak || this.isOnBreak;
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

  getStorageVariables(callback) {
    chrome.storage.local.get("storageVariables", function (result) {
      const storageVariables = result.storageVariables || {};
      callback(storageVariables);
    });
  }

  updateStorage() {
    this.getStorageVariables((storageVariables) => {
      const updateStorageVariable = storageVariables;
      updateStorageVariable.timer = {
        targetTime: this.targetTime,
        breakTime: this.breakTime,
        remainingTime: this.remainingTime,
        isOnBreak: this.isOnBreak,
      };
      console.log(
        "updateStorageVariable backend",
        updateStorageVariable,
        "storageVariables",
        storageVariables
      );
      chrome.storage.local.set({
        storageVariables: updateStorageVariable,
      });
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
  () => {
    console.log("Timer finished");
    // Do something when the timer finishes
  },
  timerFinished
);

const sendMessageToCurrentTab = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { animation: { state: message } },
        () => {}
      );
    }
  });
};

// Function to setup the animation
function setupAnimation() {
  sendMessageToCurrentTab("setup");
}

// Setup storage variables
// async function setup() {
//   return new Promise((resolve, reject) => {
//     console.log("Setting up storageVariables", storageVariables);
//     chrome.storage.local.set(storageVariables, () => {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else {
//         resolve();
//       }
//     });
//   })
//     .then(async () => {
//       // Wait for storage to be set before getting the storage variables
//       const result = await chrome.storage.local.get("storageVariables");
//       console.log("getting storageVariables", result);
//     })
//     .catch((error) => {
//       console.error("Error setting storage variables:", error);
//     });
// }

async function setup() {
  try {
    // Setting storage variables
    await new Promise((resolve, reject) => {
      console.log("Setting up storageVariables", storageVariables);
      chrome.storage.local.set({ storageVariables }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });

    // Retrieving storage variables
    const result = await new Promise((resolve, reject) => {
      chrome.storage.local.get("storageVariables", (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(data);
        }
      });
    });

    console.log("Getting storageVariables", result);
  } catch (error) {
    console.error("Error setting or getting storage variables:", error);
  }
}
