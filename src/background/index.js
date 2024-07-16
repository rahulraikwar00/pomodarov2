console.log('background is running')

import { createOffscreenDocument } from '../utills'

chrome.runtime.onMessage.addListener((request) => {
  console.log('background got message: ', request)
})

chrome.runtime.onInstalled.addListener(() => {
  setup()
})

function setup() {
  createOffscreenDocument('offscreen.html', 'AUDIO_PLAYBACK', 'for playing audio')
  console.log('setup done')
}
