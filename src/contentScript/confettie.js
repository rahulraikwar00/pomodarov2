import confetti from 'canvas-confetti'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('message in confettiScript:', request)
  if (request.type === 'playConfetti') {
    var duration = 15 * 1000
    var animationEnd = Date.now() + duration
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    /**
     * Generates a random number between the given minimum and maximum values (inclusive).
     *
     * @param {number} min - The minimum value of the range.
     * @param {number} max - The maximum value of the range.
     * @return {number} A random number between min and max.
     */
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      var particleCount = 50 * (timeLeft / duration)
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
    sendResponse({ success: true })
  } else {
    sendResponse({ success: false })
  }
  return true
})

// export function addConfettihere(tab) {
//   const jsConfetti = new JSConfetti()

//   jsConfetti.addConfetti({
//     confettiColors: ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'],
//     confettiNumber: 100,
//     confettiRadius: 5,
//     confettiSpeed: 0.8,
//     confettiInterval: 150,
//   })
// }

export function playConfetti() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'playConfetti' })
    }
  })
}
