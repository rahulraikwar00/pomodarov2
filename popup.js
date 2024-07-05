chrome.runtime.onInstalled.addListener(() => {
  const startanimation = document.getElementById("startanimation");
  startanimation.addEventListener("click", () => {
    animation.start();
  });
});
