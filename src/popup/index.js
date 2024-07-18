import './index.css'
import { localStorage, updateDisplay, togglePlayState } from '../utills'
const initBackgroundMusic = () => {
  const backgroundMusic = document.getElementById('backgroundMusic')
  const confettiButton = document.createElement('button')
  const controls = document.getElementById('controls')
  confettiButton.id = 'confettiButton'
  confettiButton.textContent = 'confetti'
  controls.appendChild(confettiButton)

  localStorage.get('sound', (result) => {
    backgroundMusic.innerText = result.sound.state ? 'pause' : 'play'
  })

  backgroundMusic.addEventListener('click', togglePlayState)

  setInterval(() => {
    updateDisplay()
  }, 500)
}

// Apply initial UI settings and setup background music control
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')
  app.style.setProperty('--background', `url(${chrome.runtime.getURL('img/girl.gif')})`)
  initBackgroundMusic()
  updateDisplay()

  confettiButton.addEventListener('click', async () => {
    console.log('confettiButton click')
    chrome.runtime.sendMessage({ type: 'playConfetti' }, (response) => {
      console.log('response in popoup ', response)
    })
  })
})
