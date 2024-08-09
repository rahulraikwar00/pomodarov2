import confetti from "canvas-confetti";

function playConfettiAnimation(duration) {
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
