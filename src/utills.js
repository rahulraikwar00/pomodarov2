export async function createOffscreenDocument(path, reason, justification) {
  try {
    const offscreenDocument = await chrome.offscreen.createDocument({
      url: chrome.runtime.getURL(path),
      reasons: [reason],
      justification: justification,
    })
    return offscreenDocument
  } catch (error) {
    console.error('Error creating offscreen document:', error)
    return null
  }
}

export async function hasOffscreenDocument(path) {
  try {
    const offscreenUrl = chrome.runtime.getURL(path)
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [offscreenUrl],
    })
    return existingContexts.length > 0
  } catch (error) {
    console.error('Error checking offscreen document:', error)
    return false
  }
}

export function toggleSoundtext() {
  const backgroundMusic = document.getElementById('backgroundMusic')
  if (backgroundMusic) {
    backgroundMusic.innerText = backgroundMusic.innerText === 'play' ? 'pause' : 'play'
  } else {
    console.error('Element with id "backgroundMusic" not found.')
  }
}

// ###############################################################
// Storage manangment
// #################################################################
export const localStorage = {
  get: (key, callback) => {
    chrome.storage.sync.get(key, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving data:', chrome.runtime.lastError)
      } else {
        callback(result)
      }
    })
  },
  set: (configs, callback) => {
    chrome.storage.sync.set(configs, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting data:', chrome.runtime.lastError)
      } else if (callback) {
        callback()
      }
    })
  },
  listen: (callback) => {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync') {
        callback(changes)
      }
    })
  },
}
