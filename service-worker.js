console.log("service-worker.js is loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request.message);
  sendResponse({ response: "message received from service worker" });
});
