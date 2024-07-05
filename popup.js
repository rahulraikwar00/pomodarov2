const startButton = document.getElementById("msgsend");
const backgroundtext = document.getElementById("textHere");
const commingfromcontext = document.getElementById("commingfromcontext");

startButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ Message: "send from popup" }, (response) => {
    backgroundtext.innerText = response.Message;
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { Message: "send from popup" },
    function (response) {
      commingfromcontext.innerText = response.Message;
    }
  );
});
