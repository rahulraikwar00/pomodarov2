import './index.css'
import { hasOffscreenDocument, localStorage, createOffscreenDocument } from '../utills'

// Initialize background music control
const initBackgroundMusic = () => {
  const backgroundMusic = document.getElementById('backgroundMusic')
  const confettiButton = document.createElement('button')
  confettiButton.id = 'confettiButton'
  confettiButton.textContent = 'confetti'
  document.body.appendChild(confettiButton)

  // Set the initial state of the background music from localStorage
  localStorage.get('sound', (result) => {
    backgroundMusic.innerText = result.sound.state ? 'pause' : 'play'
  })

  // Toggle play/pause state and update localStorage
  const togglePlayState = async () => {
    try {
      const path = 'offscreen.html'
      let offscreenAvailable = await hasOffscreenDocument(path)

      if (!offscreenAvailable) {
        await createOffscreenDocument(path, 'AUDIO_PLAYBACK', 'Background music playback')
        offscreenAvailable = await hasOffscreenDocument(path)
      }

      if (offscreenAvailable) {
        const isPlaying = backgroundMusic.innerText === 'play'
        chrome.runtime.sendMessage(isPlaying ? 'play' : 'pause')
        backgroundMusic.innerText = isPlaying ? 'pause' : 'play'
        localStorage.set({ sound: { state: isPlaying } })
      }
    } catch (error) {
      console.error('Error handling background music:', error)
    }
  }

  confettiButton.addEventListener('click', async () => {
    console.log('confettiButton click')
    // Inject the confetti script before playing
    chrome.runtime.sendMessage({ type: 'playConfetti' }, (response) => {
      // if (response.success) {
      //   chrome.runtime.sendMessage(
      //     {
      //       type: 'playConfetti',
      //       message: 'confetti',
      //     },
      //     (response) => {
      //       console.log('response', response)
      //     },
      //   )
      // } else {
      //   console.error('Failed to inject confetti script')
      // }
      console.log('response in popoup ', response)
    })
  })

  backgroundMusic.addEventListener('click', togglePlayState)
}

// Apply initial UI settings and setup background music control
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')
  app.style.setProperty('--background', `url(${chrome.runtime.getURL('img/girl.gif')})`)
  initBackgroundMusic()
})
