import { createOffscreenDocument, hasOffscreenDocument } from './utills'
import { localStorage } from './localstorage'

export const togglePlayState = async () => {
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
