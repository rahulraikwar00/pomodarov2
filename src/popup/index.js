import './index.css'
import { hasOffscreenDocument, toggleSoundtext, createOffscreenDocument } from '../utills'

document.addEventListener('DOMContentLoaded', () => {
  const backgroundMusic = document.getElementById('backgroundMusic')
  const app = document.getElementById('app')
  const path = 'offscreen.html'

  // Setting the background image (gif)
  app.style.setProperty('--background', `url(${chrome.runtime.getURL('img/girl.gif')})`)

  backgroundMusic.addEventListener('click', async () => {
    try {
      let offscreenAvailable = await hasOffscreenDocument(path)
      console.log('Offscreen document status:', offscreenAvailable)

      if (!offscreenAvailable) {
        console.log('Offscreen document not available, creating one.')
        await createOffscreenDocument(path, 'AUDIO_PLAYBACK', 'Background music playback')
        // Retry the action after creating the offscreen document
        offscreenAvailable = await hasOffscreenDocument(path)
      }

      if (offscreenAvailable) {
        if (backgroundMusic.innerText === 'play') {
          chrome.runtime.sendMessage('play')
        } else {
          chrome.runtime.sendMessage('pause')
        }
        toggleSoundtext()
      }
    } catch (error) {
      console.error('Error handling background music:', error)
    }
  })
})
