console.log("content-script.js is loaded");

const canvas = document.createElement("canvas");
canvas.id = "canvas2";
canvas.style.position = "fixed";
canvas.style.bottom = "0";
canvas.style.left = "0";
canvas.style.width = "100vw";
canvas.style.height = "50px";
canvas.style.backgroundColor = "transparent";
// canvas.style.opacity = "0.4";
canvas.style.zIndex = "99";
canvas.style.pointerEvents = "none";

const canvasforAnmiation = document.createElement("canvas");
canvasforAnmiation.id = "canvasforAnmiation";
canvasforAnmiation.style.position = "fixed";
canvasforAnmiation.style.bottom = "0";
canvasforAnmiation.style.left = "0";
canvasforAnmiation.style.width = "50px";
canvasforAnmiation.style.height = "50px";
canvasforAnmiation.style.backgroundColor = "transparent";
// canvasforAnmiation.style.opacity = "";/home/mthead/coding/pesonal-project/aniamtion/scripts
canvasforAnmiation.style.zIndex = "999";
canvasforAnmiation.style.pointerEvents = "none";

document.body.appendChild(canvas);
document.body.appendChild(canvasforAnmiation);
// Adjust the canvas dimensions to match the CSS dimensions
const vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

canvas.width = vw; // Set the canvas width to match viewport width
canvas.height = vh * 0.08;

console.log("cavas", canvas.width, canvas.height);

const canvasctx = canvas.getContext("2d");
const canvasforAnmiationCtx = canvasforAnmiation.getContext("2d");
canvasctx.imageSmoothingEnabled = false;

const spritesheet = new Image();
spritesheet.src = chrome.runtime.getURL("images/walkpng.png");

const finishImage = new Image();
finishImage.src = chrome.runtime.getURL("images/finish.png");

const finishSound = new Audio(
  chrome.runtime.getURL("sound/celebratesound.mp3")
);
const lofiloop = new Audio(chrome.runtime.getURL("sound/lofiloop.mp3"));

const targetTime = 25 * 60;
chrome.storage.local
  .get("storageVariables")
  .then((result) => {
    const storageVariables = result.storageVariables || {};
    const targetTime = storageVariables.timer?.targetTime;

    if (targetTime) {
      console.log("targetTime", targetTime);
    }
  })
  .catch((error) => {
    console.error("Error retrieving storage:", error);
  });

const animation = new Animation(
  canvas,
  canvasforAnmiation,
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
  new Promise((resolve, reject) => {
    finishSound.onload = resolve;
    finishSound.onerror = reject;
  }),
  new Promise((resolve, reject) => {
    lofiloop.onload = resolve;
    lofiloop.onerror = reject;
  }),
])
  .then(() => {
    console.log("All resources loaded successfully");
  })
  .catch((error) => {
    console.error("Failed to load resources:", error);
  });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log("Message comming for animation:", request.Message);
//   if (request.animation.state === "setup") {
//     setupAnimation();
//     sendResponse({ Message: "set up successfull" });
//   } else if (request.animation.state === "start") {
//     setupAnimation();
//     startAnimation();
//     loopLofiSound(lofiloop);
//     sendResponse({ Message: "animation started" });
//   } else if (request.animation.state === "stop") {
//     stopAnimation();
//     sendResponse({ Message: "animation stopped" });
//   } else if (request.animation.state === "reset") {
//     resetAnimation();
//     sendResponse({ Message: "animation reset" });
//   } else {
//     sendResponse({
//       Message: "not setup beacuse Message has not been recognised",
//     });
//   }
//   return true;
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message coming for animation:", request.animation.state);

  const actions = {
    setup: () => {
      setupAnimation();
      sendResponse({ message: "Setup successful" });
    },
    start: () => {
      setupAnimation();
      startAnimation();
      loopLofiSound(lofiloop);
      sendResponse({ message: "Animation started" });
    },
    stop: () => {
      stopAnimation();
      sendResponse({ message: "Animation stopped" });
    },
    reset: () => {
      resetAnimation();
      sendResponse({ message: "Animation reset" });
    },
  };

  if (actions[request.animation.state]) {
    actions[request.animation.state]();
  } else {
    sendResponse({
      message: "Not setup because the message has not been recognized",
    });
  }

  return true; // Keep the message channel open for async sendResponse
});

function finishAnimation() {
  console.log("Animation finished! Sound has stopped playing");
  finishSound.play();
  toggelSFX();
  animation.reset();
}

function setupAnimation() {
  console.log("taget time has been set to", targetTime);
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

function loopLofiSound(sound) {
  sound.loop = true;
  // sound.play();
}

function pauseLofiSound(sound) {
  sound.pause();
}
function toggelSFX() {
  if (lofiloop.paused) {
    loopLofiSound(lofiloop);
  } else {
    pauseLofiSound(lofiloop);
  }
}
