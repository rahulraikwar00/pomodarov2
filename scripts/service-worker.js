chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in service worker:", request.Message);
  sendResponse({ Message: "Message received send from service worker" });
});
