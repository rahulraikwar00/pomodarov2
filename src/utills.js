import { localStorage } from './localstorage'

export async function createOffscreenDocument(urlPath, reason, justification) {
  try {
    const offscreenDocument = await chrome.offscreen.createDocument({
      url: chrome.runtime.getURL(urlPath),
      reasons: [reason],
      justification: justification,
    })
    return offscreenDocument
  } catch (error) {
    console.error('Error creating offscreen document:', error)
    return null
  }
}

export async function hasOffscreenDocument(urlPath) {
  try {
    const offscreenUrl = chrome.runtime.getURL(urlPath)
    const existingOffscreenDocuments = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [offscreenUrl],
    })
    return existingOffscreenDocuments.length > 0
  } catch (error) {
    console.error('Error checking offscreen document:', error)
    return false
  }
}

// ###############################################################
// Storage manangment
// #################################################################

// Function to update the time value
export function updateTimerValue(newTime) {
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

// ###############################################
// pomodoro timer controlls
// ###############################################
export class PomodoroTimerController {
  constructor() {
    this.alarmName = 'pomodoro'
  }

  startPomodoroTimer() {
    chrome.alarms.create(this.alarmName, {
      when: Date.now() + 1000 * 60 * 25,
      periodInMinutes: 25,
    })
  }

  stopPomodoroTimer() {
    chrome.alarms.clear(this.alarmName)
  }

  resetPomodoroTimer() {
    this.stopPomodoroTimer()
    this.startPomodoroTimer()
  }

  togglePomodoroTimer() {
    chrome.alarms.get(this.alarmName, (alarm) => {
      if (alarm) {
        this.stopPomodoroTimer()
      } else {
        this.startPomodoroTimer()
      }
    })
  }
}
