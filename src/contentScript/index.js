console.info('contentScript is running')
import JSConfetti from 'js-confetti'
const confettiInstance = new JSConfetti()

function playConfetti() {
  console.log('playing confetti')
  confettiInstance.addConfetti({
    confettiColors: ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'],
    confettiNumber: 300,
    confettiRadius: 3,
    confettiSpeed: 1,
    confettiInterval: 100,
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('message in confettiScript:', request)
  if (request.type === 'playConfetti') {
    playConfetti()
    sendResponse({ success: true })
  } else {
    sendResponse({ success: false })
  }
  return true
})
