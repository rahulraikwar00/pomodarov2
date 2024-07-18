chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "playSound") {
    const audio = new Audio(chrome.runtime.getURL("sound/lofiloop.mp3"));
    audio.loop = true;
    audio.volume = 0.5;
    document.body.appendChild(audio);
    audio.play();
  }
});
