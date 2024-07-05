const startButton = document.getElementById("startbutton");
const commingfromcontext = document.getElementById("commingfromcontext");

const sendMessageToCurrentTab = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { Message: message }, () => {});
  });
};

const updateContext = (response) => {
  commingfromcontext.innerText = response.Message;
};

startButton.addEventListener("click", () => {
  sendMessageToCurrentTab("start animation");
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { Message: "setup animation" },
    updateContext
  );
});
