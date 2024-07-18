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
    localStorage.set({ sound: { state: backgroundMusic.innerText === 'play' } })
  } else {
    console.error('Element with id "backgroundMusic" not found.')
  }
}

// ###############################################################
// Storage manangment
// #################################################################
export const localStorage = {
  get: (key, callback) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving data:', chrome.runtime.lastError)
      } else {
        callback(result)
      }
    })
  },
  set: (configs, callback) => {
    chrome.storage.local.set(configs, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting data:', chrome.runtime.lastError)
      } else if (callback) {
        callback()
      }
    })
  },
  listen: (callback) => {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      console.log('change', changes, areaName)
    })
  },
}

export const setupStorageConfig = () => ({
  timer: {
    duration: 1500,
    time: 1500,
    mode: 'pomoji',
    state: 'stop',
  },
  animation: {
    state: false,
    position: { x: 0, y: 0 },
  },
  sound: {
    state: false,
    filename: '',
  },
})

// Function to update the time value
export function updateTime(newTime) {
  localStorage.get('timer', (result) => {
    if (result.timer) {
      result.timer.time = newTime
      localStorage.set({ timer: result.timer }, () => {
        console.log('Time value updated successfully')
      })
    } else {
      console.error('Timer configuration not found')
    }
  })
}

export function updateDisplay() {
  localStorage.get('timer', (result) => {
    if (result.timer) {
      const time = result.timer.time
      const minutes = Math.floor(time / 60)
      const seconds = time % 60
      console.log(minutes, seconds)
      const timerDisplay = document.getElementById('timer')
      timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      console.error('Timer configuration not found')
    }
  })
}

// Toggle play/pause state and update localStorageex
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

// ###############################################################
// confettie import and injextt function to run whenever we need confetti
// #################################################################

export function addConfettihere(tab) {
  const jsConfetti = new JSConfetti()

  jsConfetti.addConfetti({
    confettiColors: ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'],
    confettiNumber: 100,
    confettiRadius: 5,
    confettiSpeed: 0.8,
    confettiInterval: 150,
  })
}

export function playConfetti() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'playConfetti' })
    }
  })
}
