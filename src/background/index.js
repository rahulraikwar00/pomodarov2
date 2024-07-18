import {
  createOffscreenDocument,
  setupStorageConfig,
  localStorage,
  updateTime,
  playConfetti,
} from '../utills'
chrome.runtime.onInstalled.addListener(setup)

function setup() {
  const path = 'offscreen.html'
  const reason = 'AUDIO_PLAYBACK'
  const justification = 'for playing audio'
  const configs = setupStorageConfig()

  chrome.storage.local.clear()
  createOffscreenDocument(path, reason, justification)
  localStorage.set(configs, logConfigsSet)
}

function logConfigsSet() {
  console.log('Configs set ho gaya!')
}

// Listen for messages from the popup or other parts of the extension
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'playConfetti') {
//     // Forward the message to the content script
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       if (tabs[0]) {
//         chrome.tabs.sendMessage(tabs[0].id, { type: 'playConfetti' }, sendResponse)
//       } else {
//         sendResponse({ success: false })
//       }
//     })
//   }
//   return true
// })

// ###############################################
// timer code
// ###############################################

let timer = 10
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== 'pomodaro') return

  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60
  timer -= 1
  if (timer < 0) {
    timer = 7
    playConfetti()
    chrome.alarms.clear('pomodaro')
    chrome.action.setBadgeText({
      text: '00:00',
    })
  }
  updateTime(timer)
  console.log('pomodaro triggered', timer)
  chrome.action.setBadgeText({
    text: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    // text: timer.toString(),
  })
})

function setAlarm() {
  chrome.alarms.create('pomodaro', {
    periodInMinutes: 1 / 60,
  })
}
setAlarm()
