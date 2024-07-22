import confetti from "canvas-confetti";

/**
 * Generates a random number between the given minimum and maximum values (inclusive).
 *
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @return {number} A random number between min and max.
 */
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Plays a confetti animation for a given duration.
 *
 * @param {number} duration - The duration of the confetti animation in milliseconds.
 */
function playConfettiAnimation(duration) {
  // const animationEnd = Date.now() + duration;
  // const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  // const interval = setInterval(() => {
  //   const timeLeft = animationEnd - Date.now();

  //   if (timeLeft <= 0) {
  //     clearInterval(interval);
  //     return;
  //   }

  //   const particleCount = 50 * (timeLeft / duration);
  //   confetti({
  //     ...defaults,
  //     particleCount,
  //     origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
  //   });
  //   confetti({
  //     ...defaults,
  //     particleCount,
  //     origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
  //   });
  // }, 250);

  var count = 200;
  var defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log('message in confettiScript:', request)
  if (request.type === "playConfetti") {
    playConfettiAnimation(3 * 1000); // 15 seconds duration
    sendResponse({ success: true });
  } else {
    sendResponse({ success: false });
  }
  return true;
});

/**
 * Sends a message to the active tab to play the confetti animation.
 */
export function playConfetti() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "playConfetti" });
    }
  });
}
