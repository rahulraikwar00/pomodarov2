import { createOffscreenDocument, setupStorageConfig, localStorage } from '../utills'
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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'playConfetti') {
    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'playConfetti' }, sendResponse)
      } else {
        sendResponse({ success: false })
      }
    })
  }
  return true
})
