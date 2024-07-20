import { localStorage } from './localstorage'

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

// ###############################################################
// Storage manangment
// #################################################################

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

// Toggle play/pause music state and update localStorageex

// ###############################################################
// confettie import and injextt function to run whenever we need confetti
// #################################################################

// ###############################################
// pomodoro timer controlls
// ###############################################

export class TimerController {
  constructor() {
    this.alarmName = 'pomodoro'
  }

  startTimer() {
    chrome.alarms.create(this.alarmName, {
      when: Date.now() + 1000 * 60 * 7,
      periodInMinutes: 1,
    })
  }

  stopTimer() {
    chrome.alarms.clear(this.alarmName)
  }

  resetTimer() {
    this.stopTimer()
    this.startTimer()
  }

  toggleTimer() {
    chrome.alarms.get(this.alarmName, (alarm) => {
      if (alarm) {
        this.stopTimer()
      } else {
        this.startTimer()
      }
    })
  }
}
