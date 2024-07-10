console.log("service-worker.js is loaded");
chrome.alarms.clearAll();

chrome.storage.local.remove(["timer", "isRunning"]);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "timer") return;

  chrome.storage.local.get(["timer", "isRunning"], ({ timer, isRunning }) => {
    const minutes = Math.floor(timer / 60);

    if (!isRunning) return;

    timer -= 1;

    if (timer <= 0) {
      timer = 25 * 60;
      chrome.alarms.clear("timer");
      console.log("Time's up!");
      chrome.storage.local.set({ isRunning: false });
    }

    console.log("Timer:", timer);

    chrome.action.setBadgeText({
      text: `${minutes.toString().padStart(2, "0")}M`,
    });

    chrome.storage.local.set({ timer: timer });
  });
});

function setAlarm() {
  chrome.alarms.create("timer", {
    periodInMinutes: 1 / 60,
  });
}

setAlarm();

chrome.storage.local.get(["timer", "isRunning"], (result) => {
  chrome.storage.local.set({
    timer: "timer" in result ? result.timer : 25 * 60,
    isRunning: "isRunning" in result ? result.isRunning : false,
  });
});
