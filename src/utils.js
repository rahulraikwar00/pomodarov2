export async function createOffscreenDocument(urlPath, reason, justification) {
  try {
    const offscreenDocument = await chrome.offscreen.createDocument({
      url: chrome.runtime.getURL(urlPath),
      reasons: [reason],
      justification,
    });
    return offscreenDocument;
  } catch (error) {
    console.error("Error creating offscreen document:", error);
    return null;
  }
}

export async function hasOffscreenDocument(urlPath) {
  try {
    const offscreenUrl = chrome.runtime.getURL(urlPath);
    const existingOffscreenDocuments = await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [offscreenUrl],
    });
    return existingOffscreenDocuments.length > 0;
  } catch (error) {
    console.error("Error checking offscreen document:", error);
    return false;
  }
}

export async function updateTimerValue(newTime) {
  try {
    let timerData = chrome.storage.local.get("timer");
    timerData = await timerData;
    console.log("Timer data is :", timerData.timer);
    timerData.timer.time = newTime;
    chrome.storage.local.set({ timer: timerData.timer });
  } catch (error) {
    console.error("Error storing timer in storage:", error);
  }
}

export async function updateDisplay() {
  try {
    const timerData = chrome.storage.local.get("timer");
    timerData.then((result) => {
      const time = result.timer.time;
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      const timerDisplay = document.getElementById("timer");
      timerDisplay.innerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    });
  } catch (error) {
    console.error("Error retrieving timer from storage:", error);
  }
}

export function logConfigsSet(result) {
  console.log("Configs set successfully");
}
