console.log('background is running')

import { createOffscreenDocument, setupStorageConfig, localStorage } from '../utills'

chrome.runtime.onMessage.addListener((request) => {
  console.log('background got message: ', request)
})

chrome.runtime.onInstalled.addListener(() => {
  setup()
})

/**
 * Setup function to create an offscreen document for audio playback.
 */
function setup() {
  const path = 'offscreen.html'
  const reason = 'AUDIO_PLAYBACK'
  const justification = 'for playing audio'
  const configs = setupStorageConfig()

  chrome.storage.local.clear()
  // Create offscreen document
  createOffscreenDocument(path, reason, justification)

  localStorage.set(configs, () => {
    console.log('Configs set ho gaya!')
  })

  console.log('setup done')
}

// Set initial configs

// // Get configs
// localStorage.get(['timer', 'animation', 'sound'], (result) => {
//   console.log('Timer data:', result.timer)
//   console.log('Animation data:', result.animation)
//   console.log('Sound data:', result.sound)
// })

// // Listen for changes
// localStorage.listen((changes) => {
//   if (changes.timer) {
//     console.log('Timer change hua:', changes.timer.newValue)
//   }
//   if (changes.animation) {
//     console.log('Animation change hui:', changes.animation.newValue)
//   }
//   if (changes.sound) {
//     console.log('Sound change hua:', changes.sound.newValue)
//   }
// })
