console.log('service-worker.js is loaded')

chrome.alarms.clearAll()
chrome.storage.local.clear()

chrome.storage.local.get(['timer', 'isRunning'], (result) => {
  console.log('faltu main running ')
  chrome.storage.local.set({
    timer: 'timer' in result ? result.timer : 25 * 60,
    isRunning: 'isRunning' in result ? result.isRunning : false,
  })
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== 'timer') return

  chrome.storage.local.get(['timer', 'isRunning'], (data) => {
    let timer = data.timer
    const minutes = Math.floor(timer / 60)
    const seconds = timer % 60

    chrome.action.setBadgeText({
      text: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    })

    if (!data.isRunning) return

    timer -= 1
    if (timer < 0) {
      timer = 25 * 60
      chrome.storage.local.set({ timer: timer, isRunning: false })
    } else {
      chrome.storage.local.set({ timer: timer, isRunning: true })
    }
  })
})

function setAlarm() {
  chrome.alarms.create('timer', {
    periodInMinutes: 1 / 60,
  })
}
setAlarm()

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.message === 'createOffscreenDocument') {
    await chrome.offscreen.createDocument({
      url: 'offscreendoc/offscreen.html',
      reasons: ['CLIPBOARD'],
      justification: 'reason for needing the document',
    })
  }
})
