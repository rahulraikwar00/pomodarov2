const canvas = document.createElement("canvas");
canvas.id = "canvas2";
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100vw";
canvas.style.height = "100vh";
canvas.style.backgroundColor = "transparent";
canvas.style.zIndex = "9999999999";
canvas.style.pointerEvents = "none";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const spritesheet = new Image();
spritesheet.src = chrome.runtime.getURL("images/walkpng.png");

const finishImage = new Image();
finishImage.src = chrome.runtime.getURL("images/finish.png");

const targetTime = 10;
const animation = new Animation(
  canvas,
  ctx,
  spritesheet,
  finishImage,
  targetTime,
  finishAnimation
);

Promise.all([
  new Promise((resolve, reject) => {
    spritesheet.onload = resolve;
    spritesheet.onerror = reject;
  }),
  new Promise((resolve, reject) => {
    finishImage.onload = resolve;
    finishImage.onerror = reject;
  }),
])
  .then(() => {
    console.log("Images loaded");
  })
  .catch((error) => {
    console.error("Failed to load resources:", error);
  });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.Message === "setup animation") {
    setupAnimation();
    sendResponse({ Message: "set up successfull" });
  } else if (request.Message === "start animation") {
    startAnimation();
    sendResponse({ Message: "animation started" });
  } else if (request.Message === "stop animation") {
    stopAnimation();
    sendResponse({ Message: "animation stopped" });
  } else if (request.Message === "reset animation") {
    resetAnimation();
    sendResponse({ Message: "animation reset" });
  } else {
    sendResponse({ Message: "not setup" });
  }
  console.log("Message:", request.Message);
  return true;
});

function finishAnimation() {
  console.log("Animation finished! Sound has stopped playing");
  animation.reset();
}

function setupAnimation() {
  animation.setTargetTime(targetTime * 70);
  animation.stop();
}

function startAnimation() {
  animation.start();
}

function stopAnimation() {
  animation.reset();
}

function resetAnimation() {
  animation.reset();
}
