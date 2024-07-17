console.info('contentScript is running')
import JSConfetti from 'js-confetti'
const confettiInstance = new JSConfetti()

function playConfetti() {
  console.log('playing confetti')
  confettiInstance.addConfetti()
}

setTimeout(() => {
  playConfetti()
}, 1000)

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
