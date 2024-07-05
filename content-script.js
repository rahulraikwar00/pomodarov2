// Create canvas

function setupAnimation() {
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
  console.log("Canvas created:", canvas);
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    console.log("Canvas context created:", ctx);

    // Load images and sounds
    const spritesheet = new Image();
    const finishImage = new Image();
    // const finishSound = new Audio(
    //   chrome.runtime.getURL("sound/celebratesound.mp3")
    // );
    // const lofiloop = new Audio(chrome.runtime.getURL("sound/lofiloop.mp3"));

    spritesheet.src = chrome.runtime.getURL("images/walkpng.png");
    finishImage.src = chrome.runtime.getURL("images/finish.png");
    lofiloop.loop = true;

    // Wait for images to load before starting the animation
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

        console.log("Animation created:", animation);
      })
      .catch((error) => {
        console.error("Failed to load resources:", error);
      });

    // Handle message from background script or popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.message === "contentScriptReady") {
        sendResponse({ status: "ready" });
      }
    });

    chrome.runtime.sendMessage(
      { message: "contentScriptReady" },
      (response) => {
        console.log("Response:", response);
      }
    );
  }
}

function finishAnimation() {
  console.log("Animation finished! Sound has stopped playing");
  // playSound(finishSound);
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      // confetti();
    }, i * 150);
  }
  // Assuming you have a global timer and animation object
  timer.stop();
  animation.reset();
}

function playSound(audio) {
  audio.play();
}

function stopSound(audio) {
  audio.pause();
}

function startAnimation() {
  // Initialize the animation
  const targetTime = 10; // Example target time
  const animation = new Animation(
    canvas,
    ctx,
    spritesheet,
    finishImage,
    targetTime,
    finishAnimation
  );

  // Set target time and start animation
  animation.setTargetTime(targetTime * 70);
  animation.start();
}

function stopanimation() {
  animation.reset();
}

function resetanimation() {
  animation.reset();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script", request.Message);
  sendResponse({ Message: "coming from context script" });
});
