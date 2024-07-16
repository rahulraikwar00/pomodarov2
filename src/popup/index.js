import './index.css'

import { hasOffscreenDocument, toggleSoundtext } from '../utills'

document.addEventListener('DOMContentLoaded', () => {
  const backgroundMusic = document.getElementById('backgroundMusic')
  let offscreenAvailable = hasOffscreenDocument('offscreen.html')

  backgroundMusic.addEventListener('click', () => {
    if (offscreenAvailable) {
      if (backgroundMusic.innerText == 'play') {
        chrome.runtime.sendMessage('play')
      } else {
        chrome.runtime.sendMessage('pause')
      }
      toggleSoundtext()
    }
  })
})
